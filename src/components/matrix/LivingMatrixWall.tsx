import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  Sparkles, 
  Shuffle, 
  Compass, 
  Layers, 
  X, 
  Tv, 
  Info,
  Maximize2
} from 'lucide-react';
import { MatrixProfile } from '../../utils/matrixGridService';
import { EXPLORER_CATEGORIES } from '../../data/explorerTopicsData';
import { DimensionIcon } from '../DimensionIcon';

interface LivingMatrixWallProps {
  grid: MatrixProfile[];
  allProfiles: MatrixProfile[];
  onSelectPerson: (person: MatrixProfile) => void;
  onShuffle: () => void;
  activeFilterDoor: string | null;
  onFilterChange: (doorId: string | null) => void;
  initialPanOffset?: { x: number; y: number };
  onSavePanOffset?: (offset: { x: number; y: number }) => void;
}

export const LivingMatrixWall: React.FC<LivingMatrixWallProps> = ({
  grid,
  allProfiles,
  onSelectPerson,
  onShuffle,
  activeFilterDoor,
  onFilterChange,
  initialPanOffset = { x: 0, y: 0 },
  onSavePanOffset
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wallRef = useRef<HTMLDivElement | null>(null);

  // Tailles minimales garanties par le cahier des charges : 56px sur desktop, 64px sur mobile
  // Grille 16 x 16 = 256 visages
  const GRID_SIZE = 16;
  const CELL_SIZE_DESKTOP = 60; // > 56px
  const GAP_DESKTOP = 14;
  const CELL_SIZE_MOBILE = 68;  // > 64px
  const GAP_MOBILE = 14;

  const [isMobile, setIsMobile] = useState<boolean>(() => {
    return typeof window !== 'undefined' ? window.innerWidth < 640 : false;
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const cellSize = isMobile ? CELL_SIZE_MOBILE : CELL_SIZE_DESKTOP;
  const cellGap = isMobile ? GAP_MOBILE : GAP_DESKTOP;
  const pitch = cellSize + cellGap;
  const wallDimension = GRID_SIZE * pitch; // ~1184px à 1312px

  // Position virtuelle du pan (déplacement dans le mur)
  const [pan, setPan] = useState<{ x: number; y: number }>(initialPanOffset);
  const panRef = useRef<{ x: number; y: number }>(initialPanOffset);
  panRef.current = pan;

  // Détection de survol & surbrillance du contrepoint
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [longPressedIndex, setLongPressedIndex] = useState<number | null>(null);

  // État de fondu aléatoire périodique (1 à 2s)
  const [pulsingCells, setPulsingCells] = useState<Record<number, MatrixProfile>>({});

  // Détection d'inactivité pour pause du mouvement automatique
  const [isUserInteracting, setIsUserInteracting] = useState<boolean>(false);
  const userInteractionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Parallaxe souris (desktop)
  const [parallax, setParallax] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Éducation du geste (première visite uniquement, mémorisée dans localStorage)
  const [showGestureTooltip, setShowGestureTooltip] = useState<boolean>(() => {
    try {
      return localStorage.getItem('yonywood_matrix_tooltip_dismissed') !== 'true';
    } catch {
      return true;
    }
  });

  const dismissGestureTooltip = () => {
    setShowGestureTooltip(false);
    try {
      localStorage.setItem('yonywood_matrix_tooltip_dismissed', 'true');
    } catch {
      // ignore
    }
  };

  // Drag & Pan tactile / souris
  const isDraggingRef = useRef<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const dragStartPanRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const velocityRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const lastPointerPosRef = useRef<{ x: number; y: number; time: number }>({ x: 0, y: 0, time: 0 });
  const inertiaAnimFrameRef = useRef<number | null>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Dérive douce et continue (quelques px/seconde) via requestAnimationFrame
  useEffect(() => {
    // Respect de prefers-reduced-motion
    const prefersReducedMotion = typeof window !== 'undefined' && 
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) return;

    let lastTime = performance.now();
    let driftAnimId: number;

    const driftLoop = (currentTime: number) => {
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      // Dériver uniquement si l'onglet est visible et que l'utilisateur n'interagit pas
      if (!document.hidden && !isUserInteracting && !isDraggingRef.current) {
        const speedX = 4.5; // px / sec
        const speedY = 2.8; // px / sec

        setPan(prev => {
          let nextX = prev.x - speedX * delta;
          let nextY = prev.y - speedY * delta;

          // Boucle torique sans fin du mur
          if (nextX < -wallDimension) nextX += wallDimension;
          if (nextX > 0) nextX -= wallDimension;
          if (nextY < -wallDimension) nextY += wallDimension;
          if (nextY > 0) nextY -= wallDimension;

          const updated = { x: nextX, y: nextY };
          if (onSavePanOffset) onSavePanOffset(updated);
          return updated;
        });
      }

      driftAnimId = requestAnimationFrame(driftLoop);
    };

    driftAnimId = requestAnimationFrame(driftLoop);
    return () => cancelAnimationFrame(driftAnimId);
  }, [isUserInteracting, wallDimension, onSavePanOffset]);

  // 2. Micro-fondu subtil : toutes les 1,5 à 2 secondes, un visage change pour un autre profil réel
  useEffect(() => {
    const prefersReducedMotion = typeof window !== 'undefined' && 
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) return;

    const interval = setInterval(() => {
      if (document.hidden || isUserInteracting) return;

      const randomIdx = Math.floor(Math.random() * grid.length);
      const currentPerson = grid[randomIdx];
      const otherProfiles = allProfiles.filter(p => p.id !== currentPerson?.id && p.allowedToAppear !== false);
      if (otherProfiles.length === 0) return;

      const newPerson = otherProfiles[Math.floor(Math.random() * otherProfiles.length)];

      setPulsingCells(prev => ({ ...prev, [randomIdx]: newPerson }));

      // Nettoyer après la transition de fondu (1.2s)
      setTimeout(() => {
        setPulsingCells(prev => {
          const next = { ...prev };
          delete next[randomIdx];
          return next;
        });
      }, 1400);
    }, 1800);

    return () => clearInterval(interval);
  }, [grid, allProfiles, isUserInteracting]);

  // Marquer une interaction et programmer la reprise douce après 5s d'inactivité
  const markInteraction = useCallback(() => {
    setIsUserInteracting(true);
    if (userInteractionTimeoutRef.current) {
      clearTimeout(userInteractionTimeoutRef.current);
    }
    userInteractionTimeoutRef.current = setTimeout(() => {
      setIsUserInteracting(false);
    }, 5000);
  }, []);

  // Parallaxe au pointeur sur desktop
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isMobile) return;
    const { clientX, clientY } = e;
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const px = ((clientX - cx) / cx) * 14;
    const py = ((clientY - cy) / cy) * 14;
    setParallax({ x: px, y: py });
  }, [isMobile]);

  // Gestion du Pointer Down (Touch / Clic pour glisser le mur)
  const handlePointerDown = (e: React.PointerEvent) => {
    markInteraction();
    if (inertiaAnimFrameRef.current) {
      cancelAnimationFrame(inertiaAnimFrameRef.current);
      inertiaAnimFrameRef.current = null;
    }

    isDraggingRef.current = false;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    dragStartPanRef.current = { ...panRef.current };
    lastPointerPosRef.current = { x: e.clientX, y: e.clientY, time: performance.now() };
    velocityRef.current = { x: 0, y: 0 };

    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!e.buttons && e.pointerType === 'mouse') return;
    markInteraction();

    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;

    if (Math.hypot(dx, dy) > 8) {
      isDraggingRef.current = true;
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = null;
      }
    }

    if (isDraggingRef.current) {
      const now = performance.now();
      const dt = Math.max(1, now - lastPointerPosRef.current.time);
      const vx = (e.clientX - lastPointerPosRef.current.x) / dt;
      const vy = (e.clientY - lastPointerPosRef.current.y) / dt;

      velocityRef.current = { x: vx * 16, y: vy * 16 };
      lastPointerPosRef.current = { x: e.clientX, y: e.clientY, time: now };

      let nextX = dragStartPanRef.current.x + dx;
      let nextY = dragStartPanRef.current.y + dy;

      // Boucle torique continue
      if (nextX < -wallDimension) nextX += wallDimension;
      if (nextX > 0) nextX -= wallDimension;
      if (nextY < -wallDimension) nextY += wallDimension;
      if (nextY > 0) nextY -= wallDimension;

      setPan({ x: nextX, y: nextY });
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    // Appliquer l'inertie si glissement rapide
    if (isDraggingRef.current) {
      let vx = velocityRef.current.x;
      let vy = velocityRef.current.y;

      const applyInertia = () => {
        vx *= 0.92;
        vy *= 0.92;

        if (Math.abs(vx) > 0.4 || Math.abs(vy) > 0.4) {
          setPan(prev => {
            let nextX = prev.x + vx;
            let nextY = prev.y + vy;

            if (nextX < -wallDimension) nextX += wallDimension;
            if (nextX > 0) nextX -= wallDimension;
            if (nextY < -wallDimension) nextY += wallDimension;
            if (nextY > 0) nextY -= wallDimension;

            const updated = { x: nextX, y: nextY };
            if (onSavePanOffset) onSavePanOffset(updated);
            return updated;
          });
          inertiaAnimFrameRef.current = requestAnimationFrame(applyInertia);
        } else {
          inertiaAnimFrameRef.current = null;
        }
      };

      inertiaAnimFrameRef.current = requestAnimationFrame(applyInertia);
    }
  };

  // Trouver l'indice du contrepoint (duo) de la personne survolée
  const activeHoverProfile = hoveredIndex !== null ? (pulsingCells[hoveredIndex] || grid[hoveredIndex]) : null;
  const activeLongPressProfile = longPressedIndex !== null ? (pulsingCells[longPressedIndex] || grid[longPressedIndex]) : null;

  const highlightedCounterpointId = activeHoverProfile?.counterpointId || activeLongPressProfile?.counterpointId;

  // Calcul du bloc d'affichage répété 2x2 pour garantir une infinité visuelle parfaite en drag
  const repeatOffsets = [
    { ox: 0, oy: 0 },
    { ox: wallDimension, oy: 0 },
    { ox: 0, oy: wallDimension },
    { ox: wallDimension, oy: wallDimension }
  ];

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full h-[calc(100dvh-56px)] overflow-hidden select-none touch-none bg-stone-950 text-white flex flex-col justify-between"
    >
      {/* Texture subtile de fond céleste & maillage or délicat */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #C89B3C 1px, transparent 0)`,
          backgroundSize: '36px 36px'
        }}
      />

      {/* ========================================================================= */}
      {/* 1. BARRE D'ACCUEIL & FILTRES DES 8 PORTES EN TÊTE                         */}
      {/* ========================================================================= */}
      <div className="relative z-30 w-full max-w-4xl mx-auto px-3 sm:px-6 pt-2 pb-1 shrink-0 flex flex-col gap-2 pointer-events-auto">
        
        {/* Titre & phrase d'accueil éditoriale */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-editorial text-xs sm:text-sm font-bold text-stone-100 tracking-tight">
              La Matrice des Héritages
            </span>
            <span className="hidden sm:inline text-[11px] text-stone-400 font-medium">
              — 256 visages vivants reliés de proche en proche
            </span>
          </div>

          {/* Bouton Mélanger officiel */}
          <button
            onClick={onShuffle}
            id="matrix-btn-shuffle"
            className="flex items-center gap-1.5 h-7 sm:h-8 px-2.5 sm:px-3 rounded-full bg-white/10 hover:bg-[#A2482B] text-stone-200 hover:text-white border border-white/20 hover:border-[#A2482B] text-[11px] sm:text-xs font-semibold backdrop-blur-md transition-all cursor-pointer shadow-xs active:scale-95 shrink-0"
            title="Relancer une disposition aléatoire harmonieuse"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Mélanger</span>
          </button>
        </div>

        {/* Filtres par Portes thématiques : allume les profils concernés, estompe doucement les autres */}
        <div className="w-full overflow-x-auto no-scrollbar py-0.5 flex items-center gap-1.5 sm:gap-2">
          {/* Option : Tous */}
          <button
            onClick={() => onFilterChange(null)}
            className={`h-6.5 sm:h-7 px-2.5 sm:px-3 rounded-full text-[10.5px] sm:text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeFilterDoor === null
                ? 'bg-[#A2482B] text-white shadow-xs ring-1 ring-[#A2482B]'
                : 'bg-white/10 text-stone-300 hover:bg-white/20 hover:text-white'
            }`}
          >
            Tous les visages
          </button>

          {EXPLORER_CATEGORIES.map(cat => {
            const isActive = activeFilterDoor === cat.id;
            return (
              <button
                key={`door-filter-${cat.id}`}
                onClick={() => onFilterChange(isActive ? null : cat.id)}
                className={`h-6.5 sm:h-7 px-2.5 sm:px-3 rounded-full text-[10.5px] sm:text-[11px] font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#A2482B] text-white shadow-xs ring-1 ring-[#A2482B]'
                    : 'bg-white/10 text-stone-300 hover:bg-white/20 hover:text-white'
                }`}
              >
                <DimensionIcon name={`${cat.id}/_dimension`} size={12} className={isActive ? 'text-white' : 'text-stone-300'} />
                <span>{cat.shortLabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. ZONE CENTRALE : LE GRAND MUR DÉRIVANT DE 256 VISAGES                   */}
      {/* ========================================================================= */}
      <div 
        ref={wallRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="relative flex-1 w-full overflow-hidden cursor-grab active:cursor-grabbing my-auto"
      >
        <div 
          className="absolute top-0 left-0 will-change-transform"
          style={{
            transform: `translate3d(${pan.x + parallax.x}px, ${pan.y + parallax.y}px, 0)`
          }}
        >
          {repeatOffsets.map((offset, repIdx) => (
            <div 
              key={`wall-repeat-${repIdx}`}
              className="absolute grid"
              style={{
                left: `${offset.ox}px`,
                top: `${offset.oy}px`,
                width: `${wallDimension}px`,
                height: `${wallDimension}px`,
                gridTemplateColumns: `repeat(${GRID_SIZE}, ${cellSize}px)`,
                gap: `${cellGap}px`
              }}
            >
              {grid.map((defaultPerson, cellIdx) => {
                const person = pulsingCells[cellIdx] || defaultPerson;
                const isFilteredIn = activeFilterDoor === null || person.doorId === activeFilterDoor;
                const isHovered = hoveredIndex === cellIdx;
                const isCounterpointToActive = person.id === highlightedCounterpointId;

                return (
                  <div
                    key={`cell-${repIdx}-${cellIdx}-${person.id}`}
                    onClick={(e) => {
                      if (isDraggingRef.current) return;
                      e.stopPropagation();
                      onSelectPerson(person);
                    }}
                    onMouseEnter={() => {
                      if (!isMobile) {
                        setHoveredIndex(cellIdx);
                        markInteraction();
                      }
                    }}
                    onMouseLeave={() => {
                      if (!isMobile) {
                        setHoveredIndex(null);
                      }
                    }}
                    onTouchStart={() => {
                      longPressTimerRef.current = setTimeout(() => {
                        setLongPressedIndex(cellIdx);
                      }, 400);
                    }}
                    onTouchEnd={() => {
                      if (longPressTimerRef.current) {
                        clearTimeout(longPressTimerRef.current);
                      }
                    }}
                    style={{
                      width: `${cellSize}px`,
                      height: `${cellSize}px`
                    }}
                    className={`group relative rounded-full transition-all duration-300 cursor-pointer ${
                      isFilteredIn ? 'opacity-100' : 'opacity-25 scale-95'
                    }`}
                  >
                    {/* Halo de contrepoint (Duo en vis-à-vis illuminé en or chaud) */}
                    {isCounterpointToActive && (
                      <div className="absolute -inset-2 rounded-full border-2 border-[#C89B3C] animate-pulse bg-[#C89B3C]/20 shadow-[0_0_20px_rgba(200,155,60,0.8)] pointer-events-none z-20" />
                    )}

                    {/* Halo au survol du visage */}
                    {isHovered && (
                      <div className="absolute -inset-1.5 rounded-full border-2 border-[#A2482B] shadow-[0_0_15px_rgba(162,72,43,0.7)] pointer-events-none z-20" />
                    )}

                    {/* Médaillon circulaire avec photo */}
                    <div className="w-full h-full rounded-full overflow-hidden border border-white/20 bg-stone-900 shadow-md group-hover:scale-108 transition-transform duration-200">
                      <img 
                        src={person.photoUrl} 
                        alt={person.name} 
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover pointer-events-none"
                      />
                    </div>

                    {/* Micro-pastille de thématique au bas */}
                    <div className="absolute -bottom-0.5 right-0 w-4 h-4 rounded-full bg-stone-900 border border-white/30 flex items-center justify-center text-[8px] pointer-events-none shadow-xs">
                      <span>{person.flag || '✨'}</span>
                    </div>

                    {/* Infobulle élégante au survol (Desktop) */}
                    {isHovered && !isMobile && (
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-50 pointer-events-none w-52 p-2.5 rounded-xl bg-stone-900/95 backdrop-blur-md border border-[#A2482B] shadow-2xl text-left animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="font-bold text-xs text-white truncate">{person.name}</span>
                          <span className="text-[10px] text-stone-400">{person.flag}</span>
                        </div>
                        <p className="text-[10.5px] text-[#FFE7A3] font-medium leading-snug truncate mb-1">
                          {person.role}
                        </p>
                        {person.teaserPitch && (
                          <p className="text-[9.5px] italic text-stone-300 line-clamp-2 leading-tight">
                            « {person.teaserPitch} »
                          </p>
                        )}
                        {person.counterpointName && (
                          <div className="mt-1 pt-1 border-t border-white/10 flex items-center gap-1 text-[9px] text-[#C89B3C]">
                            <span>Duo &lt;&gt;</span>
                            <span className="font-semibold truncate">{person.counterpointName}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. BULLE D'ÉDUCATION DU GESTE (Première visite uniquement)                 */}
      {/* ========================================================================= */}
      {showGestureTooltip && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-md p-3 rounded-2xl bg-stone-900/95 backdrop-blur-md border border-[#A2482B] shadow-2xl flex items-center justify-between gap-3 text-stone-200 text-xs animate-in slide-in-from-bottom duration-300">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-base shrink-0">💡</span>
            <p className="leading-snug">
              <strong className="text-white">Touchez un visage</strong> pour le placer au centre en Soleil. Touchez le centre pour découvrir son histoire.
            </p>
          </div>
          <button
            onClick={dismissGestureTooltip}
            className="p-1 rounded-full text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
            title="Masquer le conseil"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. VOLET APERÇU MOBILE SUR APPUI LONG                                    */}
      {/* ========================================================================= */}
      {activeLongPressProfile && isMobile && (
        <div className="absolute bottom-18 left-3 right-3 z-50 p-3.5 rounded-2xl bg-stone-900/95 backdrop-blur-xl border border-[#A2482B] shadow-2xl flex items-center justify-between gap-3 animate-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center gap-2.5 min-w-0">
            <img 
              src={activeLongPressProfile.photoUrl} 
              alt={activeLongPressProfile.name}
              className="w-12 h-12 rounded-full object-cover border border-[#A2482B] shrink-0" 
            />
            <div className="min-w-0">
              <h4 className="font-bold text-xs text-white truncate">{activeLongPressProfile.name}</h4>
              <p className="text-[10.5px] text-[#FFE7A3] truncate">{activeLongPressProfile.role}</p>
              {activeLongPressProfile.counterpointName && (
                <p className="text-[9.5px] text-[#C89B3C] truncate">
                  Contrepoint : {activeLongPressProfile.counterpointName}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => {
                onSelectPerson(activeLongPressProfile);
                setLongPressedIndex(null);
              }}
              className="px-3 py-1.5 rounded-full bg-[#A2482B] text-white text-xs font-bold shadow-xs cursor-pointer active:scale-95"
            >
              Explorer
            </button>
            <button
              onClick={() => setLongPressedIndex(null)}
              className="p-1.5 rounded-full text-stone-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
