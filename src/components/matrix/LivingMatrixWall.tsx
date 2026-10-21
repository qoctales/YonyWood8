import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { MatrixProfile } from '../../utils/matrixGridService';

interface LivingMatrixWallProps {
  grid: MatrixProfile[];
  allProfiles: MatrixProfile[];
  highlightedPersonId?: string | null;
  onSelectPerson: (person: MatrixProfile) => void;
}

// Les 4 tempos ralentis et apaisés pour une contemplation poétique (en millisecondes : 8s, 14s, 20s, 28s)
const RHYTHMS = [8000, 14000, 20000, 28000];

interface MatrixCellProps {
  initialProfile: MatrixProfile;
  idx: number;
  highlightedPersonId?: string | null;
  activeCounterpointId?: string | null;
  isPaused: boolean;
  onSelectPerson: (person: MatrixProfile) => void;
  onHoverProfile: (profile: MatrixProfile | null, e?: React.MouseEvent) => void;
  onRequestNewProfile: (currentId: string, cellIdx: number) => MatrixProfile;
}

/**
 * MatrixCell:
 * Case autonome de la matrice possédant son propre tempo ralenti et désynchronisé (8s, 14s, 20s, 28s).
 * Elle commence à son propre moment décalé, s'éteint en fondu au noir très lent (1400ms),
 * change de visage, réapparaît en douceur puis choisit un nouveau rythme parmi les 4 tempos.
 * Mémoïsée pour garantir 60 FPS constants sans re-render de la grille globale.
 */
const MatrixCell: React.FC<MatrixCellProps> = React.memo(({
  initialProfile,
  idx,
  highlightedPersonId,
  activeCounterpointId,
  isPaused,
  onSelectPerson,
  onHoverProfile,
  onRequestNewProfile
}) => {
  const [profile, setProfile] = useState<MatrixProfile>(initialProfile);
  const [fadePhase, setFadePhase] = useState<'idle' | 'fadeOut' | 'fadeIn'>('idle');
  const [isEmerging, setIsEmerging] = useState<boolean>(false);

  // Synchronisation si le profil initial change depuis le parent
  useEffect(() => {
    setProfile(initialProfile);
  }, [initialProfile]);

  const isPausedRef = useRef(isPaused);
  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  const currentProfileRef = useRef(profile);
  useEffect(() => {
    currentProfileRef.current = profile;
  }, [profile]);

  useEffect(() => {
    let isMounted = true;
    let timerOut: NodeJS.Timeout | null = null;
    let timerIn: NodeJS.Timeout | null = null;
    let nextTimer: NodeJS.Timeout | null = null;

    // 1. Décalage de départ unique et désynchronisé pour chaque case (étalé doucement jusqu'à 24s)
    const initialDelay = ((idx * 137.5) % 24000) + 800;

    const executeCycle = () => {
      if (!isMounted) return;

      // Si l'utilisateur est en train de glisser activement la grille, repousser doucement de 2s
      if (isPausedRef.current) {
        nextTimer = setTimeout(executeCycle, 2000);
        return;
      }

      // Phase 1 : Fondu au noir très doux et ralenti (1400ms)
      setFadePhase('fadeOut');

      timerOut = setTimeout(() => {
        if (!isMounted) return;

        // Phase 2 : Remplacement ou échange de visage dans l'obscurité totale
        const nextProfile = onRequestNewProfile(currentProfileRef.current.id, idx);
        setProfile(nextProfile);
        currentProfileRef.current = nextProfile;
        setFadePhase('fadeIn');
        setIsEmerging(true);

        timerIn = setTimeout(() => {
          if (!isMounted) return;
          setFadePhase('idle');
          setIsEmerging(false);

          // Phase 3 : Changement de rythme pour le cycle suivant (ex: 8s -> 20s -> 14s -> 28s)
          const nextInterval = RHYTHMS[Math.floor(Math.random() * RHYTHMS.length)];
          nextTimer = setTimeout(executeCycle, nextInterval);
        }, 1400);
      }, 1400);
    };

    // Programmation du premier cycle décalé
    nextTimer = setTimeout(executeCycle, initialDelay);

    return () => {
      isMounted = false;
      if (nextTimer) clearTimeout(nextTimer);
      if (timerOut) clearTimeout(timerOut);
      if (timerIn) clearTimeout(timerIn);
    };
  }, [idx, onRequestNewProfile]);

  const isHighlighted = highlightedPersonId === profile.id;
  const isCounterpoint = activeCounterpointId === profile.id;
  const displayName = profile.firstName || profile.name.split(' ')[0];

  return (
    <div
      onClick={() => onSelectPerson(profile)}
      onMouseEnter={(e) => onHoverProfile(profile, e)}
      className={`group/cell relative aspect-square rounded-[2px] sm:rounded-[3px] overflow-hidden cursor-pointer transition-all duration-300 ${
        isCounterpoint 
          ? 'ring-2 ring-[#A2482B] scale-110 z-30 shadow-md' 
          : isHighlighted
            ? 'ring-2 ring-amber-400 scale-105 z-20'
            : isEmerging
              ? 'ring-1 ring-[#C89B3C] z-20 shadow-xs'
              : 'hover:scale-120 hover:z-30 hover:shadow-lg hover:ring-2 hover:ring-[#A2482B]'
      }`}
      style={{ backgroundColor: '#0E0D0B' }}
      title={displayName}
    >
      {/* Photo : fondu au noir très lent (1400ms) et réémergence douce selon le tempo dynamique de cette case */}
      <img
        src={profile.photoUrl}
        alt={displayName}
        loading="lazy"
        onError={(e) => {
          const target = e.currentTarget;
          target.onerror = null;
          const fallbackAvatars = [
            '/assets/protagonists/adjovi-blandine.jpg',
            '/assets/protagonists/chef-koffi.jpg',
            '/assets/protagonists/kwame-mensah.jpg',
            '/assets/protagonists/amara-tisserande.jpg',
            '/assets/protagonists/dah-zounon.jpg',
            '/assets/protagonists/fatou-diallo.jpg',
            '/assets/protagonists/koffi-tisserand.jpg',
            '/assets/protagonists/malik-diop.jpg',
            '/assets/protagonists/mawuna-medium.jpg',
            '/assets/protagonists/senan-agossa.jpg'
          ];
          target.src = fallbackAvatars[idx % fallbackAvatars.length];
        }}
        className={`w-full h-full object-cover pointer-events-none ${
          fadePhase === 'fadeOut'
            ? 'opacity-0 scale-95 transition-all duration-[1400ms] ease-in-out'
            : fadePhase === 'fadeIn'
              ? 'opacity-100 scale-100 transition-all duration-[1400ms] ease-in-out'
              : isCounterpoint || isHighlighted || isEmerging
                ? 'opacity-100 filter-none transition-all duration-300'
                : 'opacity-100 grayscale-[35%] sepia-[15%] contrast-[1.05] group-hover/cell:filter-none transition-all duration-300'
        }`}
      />

      {/* Voile doré au survol */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover/cell:opacity-100 transition-opacity duration-150 pointer-events-none" />

      {/* Halo terracotta si contrepoint */}
      {isCounterpoint && (
        <div className="absolute inset-0 bg-[#A2482B]/25 animate-pulse pointer-events-none" />
      )}

      {/* Subtil éclat doré lors de l'émergence d'un nouveau visage */}
      {isEmerging && (
        <div className="absolute inset-0 bg-[#C89B3C]/15 pointer-events-none animate-in fade-in duration-500" />
      )}
    </div>
  );
});

export const LivingMatrixWall: React.FC<LivingMatrixWallProps> = ({
  grid,
  allProfiles = [],
  highlightedPersonId,
  onSelectPerson
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Registre des 256 profils actifs dans la matrice pour organiser les échanges et renouvellements
  const currentGridProfilesRef = useRef<MatrixProfile[]>(grid.slice(0, 256));

  useEffect(() => {
    currentGridProfilesRef.current = grid.slice(0, 256);
  }, [grid]);

  const [zoomLevel, setZoomLevel] = useState<number>(1);
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

  // Écouteur global pour relâcher tout glissement sur mobile ou desktop
  useEffect(() => {
    const handleGlobalRelease = () => {
      setIsDragging(false);
    };
    window.addEventListener('pointerup', handleGlobalRelease);
    window.addEventListener('touchend', handleGlobalRelease);
    window.addEventListener('touchcancel', handleGlobalRelease);
    return () => {
      window.removeEventListener('pointerup', handleGlobalRelease);
      window.removeEventListener('touchend', handleGlobalRelease);
      window.removeEventListener('touchcancel', handleGlobalRelease);
    };
  }, []);

  useEffect(() => {
    let active = true;
    const animate = () => {
      if (!active) return;
      // La dérive subtile et poétique s'anime dès que l'utilisateur ne glisse pas la grille
      if (!isDragging) {
        const elapsed = (Date.now() - driftStartTimeRef.current) / 1000;
        const dx = Math.sin(elapsed * 0.45) * 4;
        const dy = Math.cos(elapsed * 0.35) * 4;
        setDriftOffset({ x: dx, y: dy });
      }
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => {
      active = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isDragging]);

  // Fournisseur de nouveaux profils : alterne entre permutation de cases et arrivée de nouveaux visages de la forêt
  const handleRequestNewProfile = useCallback((currentId: string, cellIdx: number): MatrixProfile => {
    const totalCells = currentGridProfilesRef.current.length;
    if (totalCells === 0) return grid[0] || ({} as MatrixProfile);

    const canEmergeNew = allProfiles && allProfiles.length > 0;
    // 50% de probabilité d'échange de places avec une autre case, 50% d'apparition d'un nouveau profil
    const isSwap = !canEmergeNew || Math.random() < 0.5;

    if (isSwap && totalCells > 1) {
      // Échange avec une autre case de la matrice
      let otherIdx = Math.floor(Math.random() * totalCells);
      if (otherIdx === cellIdx) otherIdx = (cellIdx + 23) % totalCells;
      
      const targetProfile = currentGridProfilesRef.current[otherIdx];
      currentGridProfilesRef.current[cellIdx] = targetProfile;
      return targetProfile;
    } else {
      // Sélection d'un profil de la forêt qui n'est pas encore visible dans la grille
      const visibleIds = new Set(currentGridProfilesRef.current.map(p => p.id));
      const unseen = allProfiles.filter(p => !visibleIds.has(p.id));
      const chosen = unseen.length > 0
        ? unseen[Math.floor(Math.random() * unseen.length)]
        : allProfiles[Math.floor(Math.random() * allProfiles.length)];

      if (chosen) {
        currentGridProfilesRef.current[cellIdx] = chosen;
        return chosen;
      }
      return currentGridProfilesRef.current[cellIdx];
    }
  }, [allProfiles, grid]);

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
    setIsDragging(false);
  };

  const handleHoverProfile = useCallback((profile: MatrixProfile | null, e?: React.MouseEvent) => {
    setHoveredProfile(profile);
    if (profile && e && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setTooltipPos({
        x: Math.min(Math.max(e.clientX - rect.left, 50), rect.width - 50),
        y: Math.max(e.clientY - rect.top - 38, 10)
      });
    } else if (!profile) {
      setTooltipPos(null);
    }
  }, []);

  const handleCellClick = useCallback((profile: MatrixProfile) => {
    if (hasDraggedRef.current) return;
    onSelectPerson(profile);
  }, [onSelectPerson]);

  const currentTotalX = panOffset.x + driftOffset.x;
  const currentTotalY = panOffset.y + driftOffset.y;
  const isInteractionActive = isDragging;

  return (
    <div 
      className="w-full flex flex-col items-center justify-center relative select-none my-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setHoveredProfile(null);
      }}
    >
      {/* LA MATRICE : PARFAITEMENT ÉQUILIBRÉE ET CENTRÉE VERTICALEMENT */}
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
        
        {/* GRILLE 16×16 = 256 CASES VIVANTES AVEC RYTHMES INDIVIDUELS (4s, 8s, 12s, 16s) */}
        <div 
          className="w-full h-full grid grid-cols-16 grid-rows-16 gap-[1.5px] sm:gap-[2px] transition-transform duration-75 ease-out will-change-transform relative"
          style={{
            transform: `translate3d(${currentTotalX}px, ${currentTotalY}px, 0) scale(${zoomLevel})`,
            transformOrigin: 'center center'
          }}
        >
          {/* Onde de respiration céleste discrète en arrière-plan reliant les nœuds */}
          <div className="absolute -inset-6 animate-matrix-aura pointer-events-none z-10 select-none">
            <div 
              className="w-full h-full"
              style={{
                background: 'radial-gradient(circle 160px at 50% 50%, rgba(200, 155, 60, 0.08) 0%, rgba(162, 72, 43, 0.05) 50%, transparent 75%)',
                filter: 'blur(12px)'
              }}
            />
          </div>

          {/* Les 256 cases vivantes avec leurs tempos asynchrones */}
          {grid.slice(0, 256).map((initialProfile, idx) => (
            <MatrixCell
              key={`cell-slot-${idx}`}
              idx={idx}
              initialProfile={initialProfile}
              highlightedPersonId={highlightedPersonId}
              activeCounterpointId={activeCounterpointId}
              isPaused={isInteractionActive}
              onSelectPerson={handleCellClick}
              onHoverProfile={handleHoverProfile}
              onRequestNewProfile={handleRequestNewProfile}
            />
          ))}
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
