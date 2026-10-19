import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Sparkles, 
  Shuffle, 
  Layers, 
  Compass, 
  Info,
  X,
  HeartHandshake
} from 'lucide-react';
import { MatrixProfile } from '../../utils/matrixGridService';
import { EXPLORER_CATEGORIES } from '../../data/explorerTopicsData';
import { DimensionIcon } from '../DimensionIcon';

interface LivingMatrixWallProps {
  grid: MatrixProfile[];
  allProfiles: MatrixProfile[];
  highlightedPersonId?: string | null;
  onSelectPerson: (person: MatrixProfile) => void;
  onShuffle: () => void;
  activeFilterDoor: string | null;
  onFilterChange: (doorId: string | null) => void;
  onSwitchToSwipe?: () => void;
}

export const LivingMatrixWall: React.FC<LivingMatrixWallProps> = ({
  grid,
  allProfiles,
  highlightedPersonId,
  onSelectPerson,
  onShuffle,
  activeFilterDoor,
  onFilterChange,
  onSwitchToSwipe
}) => {
  const GRID_SIZE = 16;
  const TOTAL_CELLS = 256;

  // Détection smartphone
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    return typeof window !== 'undefined' ? window.innerWidth < 640 : false;
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Cellule survolée ou touchée
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedPreview, setSelectedPreview] = useState<MatrixProfile | null>(null);

  // Micro-fondu vivant périodique (effet tableau vivant)
  const [pulsingIndex, setPulsingIndex] = useState<number | null>(null);

  useEffect(() => {
    const prefersReducedMotion = typeof window !== 'undefined' && 
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const interval = setInterval(() => {
      if (document.hidden) return;
      const randomIdx = Math.floor(Math.random() * TOTAL_CELLS);
      setPulsingIndex(randomIdx);
      setTimeout(() => {
        setPulsingIndex(null);
      }, 1200);
    }, 2400);

    return () => clearInterval(interval);
  }, [TOTAL_CELLS]);

  // Profil actif survolé
  const activeHoverProfile = useMemo(() => {
    if (hoveredIndex === null || !grid[hoveredIndex]) return null;
    return grid[hoveredIndex];
  }, [hoveredIndex, grid]);

  // Contrepoint du profil survolé pour l'allumer simultanément dans la matrice 16x16
  const highlightedCounterpointId = useMemo(() => {
    if (!activeHoverProfile?.counterpointId) return null;
    return activeHoverProfile.counterpointId;
  }, [activeHoverProfile]);

  return (
    <div className="relative w-full h-[calc(100dvh-56px)] overflow-hidden select-none bg-stone-950 text-white flex flex-col justify-between items-center py-2 sm:py-3 px-2 sm:px-4">
      
      {/* Texture céleste en filigrane */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #C89B3C 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* ========================================================================= */}
      {/* 1. BARRE SUPÉRIEURE : TITRE, FILTRES THÉMATIQUES & BOUTON MÉLANGER        */}
      {/* ========================================================================= */}
      <div className="relative z-30 w-full max-w-2xl mx-auto flex flex-col gap-2 shrink-0 pointer-events-auto">
        <div className="flex items-center justify-between gap-2">
          {/* Titre & Indicateur 256 */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-900 border border-[#C89B3C]/50 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#A2482B] animate-pulse" />
              <span className="text-[11px] sm:text-xs font-bold text-[#FFE7A3] tracking-wide">
                Matrice 16×16 · 256 Visages
              </span>
            </div>
            {highlightedPersonId && (
              <span className="hidden sm:inline-block text-[10px] text-stone-400 italic">
                (Cellule repère active)
              </span>
            )}
          </div>

          {/* Boutons d'action : Mélanger & Bascule Swipe */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={onShuffle}
              className="flex items-center gap-1.5 h-7 sm:h-8 px-2.5 sm:px-3 rounded-full bg-white/10 hover:bg-[#A2482B] text-white border border-white/20 hover:border-[#A2482B] text-[11px] font-semibold transition-all cursor-pointer shadow-xs active:scale-95"
              title="Mélanger aléatoirement la répartition des 256 figures"
            >
              <Shuffle className="w-3 h-3 text-[#FFE7A3]" />
              <span className="hidden sm:inline">Mélanger</span>
            </button>

            {onSwitchToSwipe && (
              <button
                onClick={onSwitchToSwipe}
                className="flex items-center gap-1.5 h-7 sm:h-8 px-2.5 sm:px-3 rounded-full bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white border border-white/20 text-[11px] font-semibold transition-all cursor-pointer shadow-xs active:scale-95"
                title="Passer en mode Swipe plein écran 9:16"
              >
                <Layers className="w-3 h-3 text-[#A2482B]" />
                <span>Swipe</span>
              </button>
            )}
          </div>
        </div>

        {/* Filtres par Portes thématiques */}
        <div className="w-full overflow-x-auto no-scrollbar py-0.5 flex items-center gap-1.5">
          <button
            onClick={() => onFilterChange(null)}
            className={`h-6 sm:h-6.5 px-2.5 rounded-full text-[10px] sm:text-[10.5px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeFilterDoor === null
                ? 'bg-[#A2482B] text-white shadow-xs ring-1 ring-[#A2482B]'
                : 'bg-white/10 text-stone-300 hover:bg-white/20 hover:text-white'
            }`}
          >
            Tous (256)
          </button>

          {EXPLORER_CATEGORIES.map(cat => {
            const isActive = activeFilterDoor === cat.id;
            return (
              <button
                key={`matrix-door-${cat.id}`}
                onClick={() => onFilterChange(isActive ? null : cat.id)}
                className={`h-6 sm:h-6.5 px-2.5 rounded-full text-[10px] sm:text-[10.5px] font-semibold whitespace-nowrap flex items-center gap-1 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#A2482B] text-white shadow-xs ring-1 ring-[#A2482B]'
                    : 'bg-white/10 text-stone-300 hover:bg-white/20 hover:text-white'
                }`}
              >
                <DimensionIcon name={`${cat.id}/_dimension`} size={11} className={isActive ? 'text-white' : 'text-stone-300'} />
                <span>{cat.shortLabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. LE CADRE CARRÉ HARMONIEUX (L'ESPACE DE DEUX CARTES VIDÉO)               */}
      {/* ========================================================================= */}
      <div className="relative z-20 flex-1 w-full flex items-center justify-center my-auto min-h-0 pointer-events-auto">
        
        {/* Le cadre carré / 9:8 représentatif de 2 cartes vidéo côte à côte */}
        <div 
          className="relative w-full max-w-[min(480px,calc(100dvh-200px))] sm:max-w-[min(520px,calc(100dvh-200px))] aspect-square rounded-2xl sm:rounded-3xl p-2.5 sm:p-3 bg-stone-900/90 backdrop-blur-xl border-2 border-[#C89B3C]/40 shadow-[0_15px_45px_rgba(0,0,0,0.65)] flex flex-col justify-between"
        >
          {/* Grille compacte des 256 cases (16 x 16) */}
          <div 
            className="w-full h-full grid grid-cols-16 gap-[2.5px] sm:gap-[3.5px] items-center justify-items-center"
          >
            {grid.map((person, idx) => {
              const isFilteredIn = activeFilterDoor === null || person.doorId === activeFilterDoor;
              const isHovered = hoveredIndex === idx;
              const isPulsing = pulsingIndex === idx;
              const isCounterpointToActive = person.id === highlightedCounterpointId;
              const isLastVisited = person.id === highlightedPersonId;

              return (
                <div
                  key={`matrix-cell-${person.id}-${idx}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectPerson(person);
                  }}
                  onMouseEnter={() => {
                    if (!isMobile) {
                      setHoveredIndex(idx);
                    }
                  }}
                  onMouseLeave={() => {
                    if (!isMobile) {
                      setHoveredIndex(null);
                    }
                  }}
                  onTouchStart={() => {
                    setSelectedPreview(person);
                  }}
                  title={`${person.name} (${person.role})`}
                  className={`relative w-full aspect-square rounded-full cursor-pointer transition-all duration-200 flex items-center justify-center ${
                    isFilteredIn ? 'opacity-100' : 'opacity-25 scale-90'
                  } ${
                    isHovered 
                      ? 'scale-175 z-40 shadow-2xl ring-2 ring-[#FFE7A3]' 
                      : isCounterpointToActive
                      ? 'scale-135 z-30 ring-2 ring-[#C89B3C] animate-pulse'
                      : isLastVisited
                      ? 'ring-2 ring-[#A2482B] shadow-[0_0_12px_#A2482B] z-20'
                      : isPulsing
                      ? 'scale-115 ring-1 ring-[#C89B3C]/80'
                      : 'hover:scale-125 hover:z-20'
                  }`}
                >
                  {/* Photo de profil découpée en médaillon circulaire */}
                  <img 
                    src={person.photoUrl} 
                    alt={person.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full rounded-full object-cover border border-white/20 bg-stone-900 pointer-events-none"
                  />

                  {/* Anneau doré persistant pour la dernière personne visitée */}
                  {isLastVisited && (
                    <div className="absolute -inset-1 rounded-full border border-[#A2482B] animate-ping opacity-60 pointer-events-none" />
                  )}

                  {/* Anneau or vibrant pour le contrepoint du visage survolé */}
                  {isCounterpointToActive && (
                    <div className="absolute -inset-1.5 rounded-full border-2 border-[#C89B3C] animate-pulse pointer-events-none" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Halo lumineux d'angle discret */}
          <div className="absolute -inset-0.5 rounded-2xl sm:rounded-3xl bg-gradient-to-tr from-[#A2482B]/20 via-transparent to-[#C89B3C]/20 pointer-events-none -z-10 blur-sm" />
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 3. CARTOUCHE D'INFO FLOTTANTE AU SURVOL / TAP D'UN VISAGE                 */}
      {/* ========================================================================= */}
      {(activeHoverProfile || selectedPreview) && (
        <div className="relative z-30 w-full max-w-md mx-auto mb-1 p-2 sm:p-2.5 rounded-2xl bg-stone-900/95 backdrop-blur-xl border border-[#A2482B] shadow-2xl flex items-center justify-between gap-3 animate-in fade-in zoom-in-95 duration-150 pointer-events-auto">
          {(() => {
            const p = activeHoverProfile || selectedPreview!;
            return (
              <>
                <div className="flex items-center gap-2.5 min-w-0">
                  <img 
                    src={p.photoUrl} 
                    alt={p.name} 
                    className="w-10 h-10 rounded-full object-cover border border-[#C89B3C] shrink-0" 
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-xs text-white truncate">{p.name}</h4>
                      <span>{p.flag}</span>
                    </div>
                    <p className="text-[10px] text-[#FFE7A3] font-medium truncate">{p.role}</p>
                    {p.counterpointName && (
                      <p className="text-[9px] text-[#C89B3C] truncate flex items-center gap-1">
                        <HeartHandshake className="w-2.5 h-2.5" />
                        <span>Duo : {p.counterpointName}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => onSelectPerson(p)}
                    className="px-3 py-1.5 rounded-full bg-[#A2482B] hover:bg-[#8A3B22] text-white text-[11px] font-bold shadow-xs cursor-pointer active:scale-95"
                  >
                    Ouvrir le Soleil →
                  </button>
                  {selectedPreview && (
                    <button
                      onClick={() => setSelectedPreview(null)}
                      className="p-1 rounded-full text-stone-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </>
            );
          })()}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. BARRE INFÉRIEURE : GUIDE D'ACTION FLUIDE                               */}
      {/* ========================================================================= */}
      <div className="relative z-30 w-full max-w-md mx-auto pt-1 pb-1 shrink-0 flex items-center justify-center text-center pointer-events-auto">
        <p className="text-[10px] sm:text-[11px] text-stone-400">
          <span className="text-[#FFE7A3] font-semibold">Touchez un visage</span> pour ouvrir son Soleil et explorer ses 16 liens.
        </p>
      </div>

    </div>
  );
};
