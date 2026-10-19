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

  const currentTotalX = panOffset.x + (zoomLevel <= 1.1 ? driftOffset.x : 0);
  const currentTotalY = panOffset.y + (zoomLevel <= 1.1 ? driftOffset.y : 0);

  return (
    <div 
      className="w-full flex flex-col items-center justify-center relative select-none my-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setHoveredProfile(null);
      }}
    >
      {/* LA MATRICE : PARFAITEMENT ÉQUILIBRÉE ET CENTRÉE VERTICALEMENT À ÉQUIDISTANCE STRICTE */}
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
          w-[min(calc(100vw-28px),calc(100dvh-230px))]
          h-[min(calc(100vw-28px),calc(100dvh-230px))]
          sm:w-[min(520px,calc(100dvh-210px))]
          sm:h-[min(520px,calc(100dvh-210px))]
          lg:w-[min(550px,calc(100dvh-200px))]
          lg:h-[min(550px,calc(100dvh-200px))]
          aspect-square flex items-center justify-center cursor-grab active:cursor-grabbing my-auto"
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
            const displayName = profile.firstName || profile.name.split(' ')[0];

            return (
              <div
                key={`${profile.id}-${idx}`}
                onClick={() => handleCellClick(profile)}
                onMouseEnter={(e) => {
                  setHoveredProfile(profile);
                  if (containerRef.current) {
                    const rect = containerRef.current.getBoundingClientRect();
                    setTooltipPos({
                      x: Math.min(Math.max(e.clientX - rect.left, 50), rect.width - 50),
                      y: Math.max(e.clientY - rect.top - 38, 10)
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
                title={displayName}
              >
                {/* Photo en carré : sépia/monochrome doux au repos, couleurs franches au survol */}
                <img
                  src={profile.photoUrl}
                  alt={displayName}
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

        {/* INFOBULLE ÉPURÉE AU SURVOL : STRICTEMENT LE PRÉNOM SEUL SANS ENCOMBREMENT */}
        {hoveredProfile && tooltipPos && (
          <div 
            className="absolute pointer-events-none z-40 bg-black/85 text-white backdrop-blur-md px-2.5 py-0.5 rounded-full shadow-lg border border-white/20 text-center animate-in fade-in duration-100 transform -translate-x-1/2"
            style={{
              left: `${tooltipPos.x}px`,
              top: `${tooltipPos.y}px`
            }}
          >
            <p className="text-[11px] font-medium leading-tight text-white tracking-wide">
              {hoveredProfile.firstName || hoveredProfile.name.split(' ')[0]}
            </p>
          </div>
        )}

      </div>

    </div>
  );
};
