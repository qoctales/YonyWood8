import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { ZoomIn, ZoomOut } from 'lucide-react';
import { MatrixProfile } from '../../utils/matrixGridService';

interface LivingMatrixWallProps {
  grid: MatrixProfile[];
  allProfiles: MatrixProfile[];
  highlightedPersonId?: string | null;
  onSelectPerson: (person: MatrixProfile) => void;
}

export const LivingMatrixWall: React.FC<LivingMatrixWallProps> = ({
  grid,
  highlightedPersonId,
  onSelectPerson
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Sur mobile, pré-zoomer à ~1.55 pour afficher ~10x10 visages nets, faciles à toucher et à explorer
  const isMobileInitial = typeof window !== 'undefined' && window.innerWidth < 640;
  const [zoomLevel, setZoomLevel] = useState<number>(isMobileInitial ? 1.55 : 1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; startPanX: number; startPanY: number }>({ x: 0, y: 0, startPanX: 0, startPanY: 0 });
  const hasDraggedRef = useRef(false);
  const initialPinchDistRef = useRef<number | null>(null);
  const initialZoomRef = useRef<number>(1);

  // État de survol
  const [hoveredProfile, setHoveredProfile] = useState<MatrixProfile | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  // ID du contrepoint en duo
  const activeCounterpointId = useMemo(() => {
    if (!hoveredProfile?.duoPartnerId) return null;
    return hoveredProfile.duoPartnerId;
  }, [hoveredProfile]);

  // Dérive douce et continue (sensation de mur vivant infini)
  const [driftOffset, setDriftOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const animFrameRef = useRef<number | null>(null);
  const driftStartTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    const isReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) return;

    let active = true;
    const animate = () => {
      if (!active) return;
      // Ne dérive que si l'utilisateur ne touche pas et ne survole pas le mur
      if (!isHovered && !isDragging && zoomLevel <= 1.1) {
        const elapsed = (Date.now() - driftStartTimeRef.current) / 1000;
        const dx = Math.sin(elapsed * 0.45) * 5;
        const dy = Math.cos(elapsed * 0.35) * 5;
        setDriftOffset({ x: dx, y: dy });
      }
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => {
      active = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isHovered, isDragging, zoomLevel]);

  // Micro-fondu aléatoire délicat (une case pulse doucement toutes les 2.8s)
  const [pulsingIndex, setPulsingIndex] = useState<number | null>(null);
  useEffect(() => {
    const isReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) return;

    const interval = setInterval(() => {
      const randIdx = Math.floor(Math.random() * 256);
      setPulsingIndex(randIdx);
      setTimeout(() => setPulsingIndex(null), 1200);
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  // Calcul des limites de pan strictes
  const clampPan = useCallback((x: number, y: number, zoom: number) => {
    if (zoom <= 1) return { x: 0, y: 0 };
    if (!containerRef.current) return { x, y };

    const size = containerRef.current.clientWidth;
    const maxOffset = (size * (zoom - 1)) / 2;
    return {
      x: Math.min(Math.max(x, -maxOffset), maxOffset),
      y: Math.min(Math.max(y, -maxOffset), maxOffset)
    };
  }, []);

  const updateZoom = useCallback((newZoom: number) => {
    const clampedZoom = Math.min(Math.max(newZoom, 1), 3);
    setZoomLevel(clampedZoom);
    if (clampedZoom <= 1) {
      setPanOffset({ x: 0, y: 0 });
    } else {
      setPanOffset(prev => clampPan(prev.x, prev.y, clampedZoom));
    }
  }, [clampPan]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.15 : -0.15;
    updateZoom(zoomLevel + delta);
  }, [zoomLevel, updateZoom]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    setIsDragging(true);
    hasDraggedRef.current = false;
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      startPanX: panOffset.x,
      startPanY: panOffset.y
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      hasDraggedRef.current = true;
    }
    if (zoomLevel > 1) {
      const rawX = dragStartRef.current.startPanX + dx;
      const rawY = dragStartRef.current.startPanY + dy;
      setPanOffset(clampPan(rawX, rawY, zoomLevel));
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      initialPinchDistRef.current = dist;
      initialZoomRef.current = zoomLevel;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && initialPinchDistRef.current) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const scale = dist / initialPinchDistRef.current;
      updateZoom(initialZoomRef.current * scale);
    }
  };

  const handleTouchEnd = () => {
    initialPinchDistRef.current = null;
  };

  // Clic sur une case -> Déclenche l'histoire vidéo
  const handleCellClick = (profile: MatrixProfile) => {
    if (hasDraggedRef.current) return;
    onSelectPerson(profile);
  };

  // Curseur de zoom vertical latéral
  const sliderTrackRef = useRef<HTMLDivElement>(null);
  const handleSliderPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!sliderTrackRef.current) return;
    const rect = sliderTrackRef.current.getBoundingClientRect();
    const ratio = 1 - Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    updateZoom(1 + ratio * 2);
  };

  const normalizedZoom = (zoomLevel - 1) / 2;
  const currentTotalX = panOffset.x + (zoomLevel <= 1.1 ? driftOffset.x : 0);
  const currentTotalY = panOffset.y + (zoomLevel <= 1.1 ? driftOffset.y : 0);

  return (
    <div 
      className="w-full h-full flex flex-col items-center justify-start pt-2 sm:pt-3 pb-20 sm:pb-24 relative select-none p-1 sm:p-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setHoveredProfile(null);
      }}
    >
      {/* LA MATRICE : REHAUSSÉE PRÈS DU TITRE, DÉGAGÉE DE LA BARRE DU BAS SANS MORDRE */}
      <div 
        ref={containerRef}
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative overflow-hidden bg-transparent border-none shadow-none 
          w-[min(calc(100vw-32px),min(430px,calc(100dvh-230px)))] sm:w-[min(calc(100vw-48px),min(500px,calc(100dvh-220px)))]
          h-[min(calc(100vw-32px),min(430px,calc(100dvh-230px)))] sm:h-[min(calc(100vw-48px),min(500px,calc(100dvh-220px)))]
          aspect-square flex items-center justify-center cursor-grab active:cursor-grabbing"
        style={{ touchAction: 'none' }}
      >
        
        {/* GRILLE 16×16 = 256 CARRÉS DIRECTEMENT SUR LE FOND BLANC */}
        <div 
          className="w-full h-full grid grid-cols-16 grid-rows-16 gap-[1.5px] sm:gap-[2px] transition-transform duration-75 ease-out will-change-transform"
          style={{
            transform: `translate3d(${currentTotalX}px, ${currentTotalY}px, 0) scale(${zoomLevel})`,
            transformOrigin: 'center center'
          }}
        >
          {grid.slice(0, 256).map((profile, idx) => {
            const isHighlighted = highlightedPersonId === profile.id;
            const isCounterpoint = activeCounterpointId === profile.id;
            const isPulsing = pulsingIndex === idx;

            return (
              <div
                key={`${profile.id}-${idx}`}
                onClick={() => handleCellClick(profile)}
                onMouseEnter={(e) => {
                  setHoveredProfile(profile);
                  if (containerRef.current) {
                    const rect = containerRef.current.getBoundingClientRect();
                    setTooltipPos({
                      x: Math.min(Math.max(e.clientX - rect.left, 70), rect.width - 70),
                      y: Math.max(e.clientY - rect.top - 45, 10)
                    });
                  }
                }}
                className={`group/cell relative aspect-square rounded-[2px] sm:rounded-[3px] overflow-hidden cursor-pointer transition-all duration-200 ${
                  isCounterpoint 
                    ? 'ring-2 ring-[#A2482B] scale-110 z-20 shadow-md' 
                    : isHighlighted
                      ? 'ring-2 ring-amber-400 scale-105 z-10'
                      : isPulsing
                        ? 'brightness-115 ring-1 ring-amber-300 z-10'
                        : 'hover:scale-120 hover:z-20 hover:shadow-lg hover:ring-2 hover:ring-[#A2482B]'
                }`}
                style={{ backgroundColor: '#ECE7DF' }}
                title={profile.name}
              >
                {/* Photo en carré : sépia/monochrome doux au repos, couleurs franches au survol */}
                <img
                  src={profile.photoUrl}
                  alt={profile.name}
                  loading="lazy"
                  className={`w-full h-full object-cover pointer-events-none transition-all duration-200 ${
                    isCounterpoint || isHighlighted || isPulsing
                      ? 'filter-none'
                      : 'grayscale-[35%] sepia-[15%] contrast-[1.05] group-hover/cell:filter-none'
                  }`}
                />

                {/* Voile doré au survol */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover/cell:opacity-100 transition-opacity duration-150 pointer-events-none" />

                {/* Halo terracotta si contrepoint */}
                {isCounterpoint && (
                  <div className="absolute inset-0 bg-[#A2482B]/25 animate-pulse pointer-events-none" />
                )}
              </div>
            );
          })}
        </div>

        {/* INFOBULLE MINIMALISTE AU SURVOL */}
        {hoveredProfile && tooltipPos && (
          <div 
            className="absolute pointer-events-none z-40 bg-stone-900/90 text-white backdrop-blur-md px-2.5 py-1 rounded-md shadow-lg border border-white/10 text-center animate-in fade-in duration-100 transform -translate-x-1/2"
            style={{
              left: `${tooltipPos.x}px`,
              top: `${tooltipPos.y}px`
            }}
          >
            <p className="text-[11px] font-semibold leading-tight text-white">{hoveredProfile.name}</p>
            {hoveredProfile.directionLabel && (
              <p className="text-[9.5px] text-amber-300/90 leading-tight font-medium">
                {hoveredProfile.directionLabel} {hoveredProfile.doorLabel ? `· ${hoveredProfile.doorLabel}` : ''}
              </p>
            )}
          </div>
        )}

      </div>

      {/* CURSEUR DE ZOOM VERTICAL SUR LE CÔTÉ DROIT */}
      <div 
        className="absolute right-1 sm:right-3 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center bg-white/90 backdrop-blur-md p-1 sm:p-1.5 rounded-full border border-stone-200 shadow-md select-none touch-none"
        title="Zoom de la matrice"
      >
        <button
          onClick={() => updateZoom(zoomLevel + 0.3)}
          className="w-6 h-6 rounded-full flex items-center justify-center text-stone-600 hover:text-[#A2482B] hover:bg-stone-100 transition-colors cursor-pointer"
          title="Zoomer"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>

        {/* Rail vertical */}
        <div
          ref={sliderTrackRef}
          onPointerDown={handleSliderPointerDown}
          className="w-1.5 h-16 sm:h-20 bg-stone-200 rounded-full my-1 relative cursor-pointer"
        >
          <div 
            className="absolute bottom-0 left-0 right-0 bg-[#A2482B] rounded-full"
            style={{ height: `${normalizedZoom * 100}%` }}
          />
          <div 
            className="absolute left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#A2482B] shadow-xs pointer-events-none"
            style={{ bottom: `calc(${normalizedZoom * 100}% - 7px)` }}
          />
        </div>

        <button
          onClick={() => updateZoom(zoomLevel - 0.3)}
          className="w-6 h-6 rounded-full flex items-center justify-center text-stone-600 hover:text-[#A2482B] hover:bg-stone-100 transition-colors cursor-pointer"
          title="Dézoomer"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
