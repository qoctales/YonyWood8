import React, { useState, useMemo, useRef } from 'react';
import { 
  Grid, 
  ArrowLeft, 
  Sparkles, 
  RotateCw, 
  SplitSquareVertical,
  ChevronDown,
  Layers,
  HeartHandshake,
  Compass,
  Share2,
  Check
} from 'lucide-react';
import { 
  MatrixProfile, 
  SunNeighbor, 
  computeInterNeighborLinks, 
  InterNeighborLink 
} from '../../utils/matrixGridService';
import { TvPlayerIcon } from '../YonywoodBrandIcons';

interface SunCrownViewProps {
  sun: MatrixProfile;
  neighbors: SunNeighbor[];
  matrixGrid?: MatrixProfile[];
  onSelectNeighbor: (neighbor: MatrixProfile) => void;
  onOpenStoryModal: (person: MatrixProfile) => void;
  onOpenDuoModal: (sun: MatrixProfile, counterpoint: MatrixProfile) => void;
  onBackToMatrix: () => void;
  onBackToPreviousSun?: () => void;
  historyBreadcrumbs: MatrixProfile[];
  onSelectBreadcrumb: (person: MatrixProfile) => void;
}

export const SunCrownView: React.FC<SunCrownViewProps> = ({
  sun,
  neighbors,
  matrixGrid = [],
  onSelectNeighbor,
  onOpenStoryModal,
  onOpenDuoModal,
  onBackToMatrix,
  onBackToPreviousSun,
  historyBreadcrumbs,
  onSelectBreadcrumb
}) => {
  const [rotationOffset, setRotationOffset] = useState<number>(0);
  const [hoveredNeighbor, setHoveredNeighbor] = useState<SunNeighbor | null>(null);
  const [selectedNeighbor, setSelectedNeighbor] = useState<SunNeighbor | null>(null);
  const [activePrism, setActivePrism] = useState<'all' | 'lineage_duo' | 'themes'>('all');
  const [showConstellationArcs, setShowConstellationArcs] = useState<boolean>(true);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Geste tactile de glissement vers le bas pour revenir à la matrice
  const touchStartYRef = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartYRef.current = e.touches[0].clientY;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartYRef.current === null) return;
    const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;
    if (deltaY > 75) {
      onBackToMatrix();
    }
    touchStartYRef.current = null;
  };

  // Détection smartphone
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 640 : false;

  // Contrepoint pour le bouton "Voir le duo"
  const counterpointNeighbor = neighbors.find(n => n.sourceType === 'counterpoint');
  const counterpointProfile = counterpointNeighbor?.person;

  // Calcul des liens transversaux entre les voisins eux-mêmes
  const interLinks = useMemo(() => {
    return computeInterNeighborLinks(sun, neighbors);
  }, [sun, neighbors]);

  // Index de la personne active dans la matrice 16x16 (pour la Minimap)
  const sunMatrixIndex = useMemo(() => {
    if (!matrixGrid || matrixGrid.length === 0) return -1;
    const idx = matrixGrid.findIndex(p => p.id === sun.id);
    return idx >= 0 ? idx : 0;
  }, [matrixGrid, sun.id]);

  // Calcul des coordonnées trigonométriques des 16 voisins
  const neighborPositions = useMemo(() => {
    if (isMobile) {
      // 2 couronnes concentriques aérées sur smartphone
      const innerRadius = 115;
      const outerRadius = 175;
      const innerList = neighbors.slice(0, 6);
      const outerList = neighbors.slice(6, 16);

      const items: Array<SunNeighbor & { x: number; y: number; radius: number; index: number }> = [];

      innerList.forEach((n, idx) => {
        const angle = -90 + (idx * (360 / Math.max(1, innerList.length))) + rotationOffset;
        const rad = (angle * Math.PI) / 180;
        items.push({
          ...n,
          index: idx,
          x: Math.cos(rad) * innerRadius,
          y: Math.sin(rad) * innerRadius,
          radius: 22
        });
      });

      outerList.forEach((n, idx) => {
        const angle = -90 + (idx * (360 / Math.max(1, outerList.length))) + rotationOffset * 0.7;
        const rad = (angle * Math.PI) / 180;
        items.push({
          ...n,
          index: 6 + idx,
          x: Math.cos(rad) * outerRadius,
          y: Math.sin(rad) * outerRadius,
          radius: 20
        });
      });

      return items;
    } else {
      // Grande orbite solaire royale sur Desktop
      const r = 250;
      return neighbors.map((n, idx) => {
        const angle = -90 + (idx * (360 / Math.max(1, neighbors.length))) + rotationOffset;
        const rad = (angle * Math.PI) / 180;
        return {
          ...n,
          index: idx,
          x: Math.cos(rad) * r,
          y: Math.sin(rad) * r,
          radius: 25
        };
      });
    }
  }, [neighbors, isMobile, rotationOffset]);

  // Arcs entre voisins liés pour la constellation
  const renderedArcs = useMemo(() => {
    return interLinks.map(link => {
      const posA = neighborPositions[link.fromIndex];
      const posB = neighborPositions[link.toIndex];
      if (!posA || !posB) return null;

      // Point de contrôle incurvé vers le centre (0,0)
      const midX = (posA.x + posB.x) / 2;
      const midY = (posA.y + posB.y) / 2;
      const curvature = isMobile ? 0.45 : 0.6;
      const ctrlX = midX * curvature;
      const ctrlY = midY * curvature;

      const pathData = `M ${posA.x} ${posA.y} Q ${ctrlX} ${ctrlY} ${posB.x} ${posB.y}`;

      const activeTargetId = (hoveredNeighbor || selectedNeighbor)?.person.id;
      const isHighlighted = activeTargetId && (link.fromPersonId === activeTargetId || link.toPersonId === activeTargetId);

      // Filtrage selon le prisme actif
      if (activePrism === 'lineage_duo' && link.type !== 'lineage' && link.type !== 'duo') {
        return null;
      }
      if (activePrism === 'themes' && link.type !== 'theme' && link.type !== 'territory') {
        return null;
      }

      return {
        ...link,
        pathData,
        isHighlighted
      };
    }).filter(Boolean) as Array<InterNeighborLink & { pathData: string; isHighlighted: boolean }>;
  }, [interLinks, neighborPositions, hoveredNeighbor, selectedNeighbor, activePrism, isMobile]);

  // Rotation douce
  const rotateMore = () => {
    setRotationOffset(prev => prev + 45);
  };

  const handleShareSun = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}?screen=matrix_view&soleil=${sun.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      });
    }
  };

  const activeFocusPerson = hoveredNeighbor?.person || selectedNeighbor?.person;

  return (
    <div 
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative w-full h-[calc(100dvh-56px)] overflow-hidden select-none bg-stone-950 text-white flex flex-col justify-between"
    >
      {/* Texture céleste en filigrane */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #C89B3C 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Poignée tactile de dézoom discrète sur mobile */}
      <div 
        onClick={onBackToMatrix}
        className="sm:hidden absolute top-1 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-0.5 cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
        title="Glisser vers le bas pour revenir à la matrice"
      >
        <div className="w-10 h-1 rounded-full bg-white/30 hover:bg-[#A2482B]" />
        <span className="text-[9px] text-stone-400 font-medium">Glisser ↓ Matrice</span>
      </div>

      {/* ========================================================================= */}
      {/* 1. BARRE SUPÉRIEURE DE NAVIGATION ET RETOUR MATRICE                       */}
      {/* ========================================================================= */}
      <div className="relative z-30 w-full max-w-4xl mx-auto px-3 sm:px-6 pt-2 pb-1 shrink-0 flex items-center justify-between gap-2 pointer-events-auto">
        
        {/* Gauche : BOUTON PHARE SIGNATURE "MATRICE 256" */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={onBackToMatrix}
            id="btn-back-to-matrix"
            className="flex items-center gap-2 h-8.5 sm:h-9 px-3 sm:px-3.5 rounded-full bg-stone-900 hover:bg-[#A2482B] text-white border border-[#C89B3C]/50 hover:border-[#A2482B] text-xs font-bold transition-all cursor-pointer shadow-md active:scale-95 group"
            title="Revenir au grand mur de la Matrice (256 visages)"
          >
            {/* Grille miniature 3x3 avec cœur terracotta */}
            <div className="grid grid-cols-3 gap-0.5 w-3.5 h-3.5 shrink-0">
              <span className="w-1 h-1 rounded-[0.5px] bg-[#FFE7A3] group-hover:bg-white" />
              <span className="w-1 h-1 rounded-[0.5px] bg-[#FFE7A3] group-hover:bg-white" />
              <span className="w-1 h-1 rounded-[0.5px] bg-[#FFE7A3] group-hover:bg-white" />
              <span className="w-1 h-1 rounded-[0.5px] bg-[#FFE7A3] group-hover:bg-white" />
              <span className="w-1 h-1 rounded-[0.5px] bg-[#A2482B] group-hover:bg-white ring-1 ring-white/40" />
              <span className="w-1 h-1 rounded-[0.5px] bg-[#FFE7A3] group-hover:bg-white" />
              <span className="w-1 h-1 rounded-[0.5px] bg-[#FFE7A3] group-hover:bg-white" />
              <span className="w-1 h-1 rounded-[0.5px] bg-[#FFE7A3] group-hover:bg-white" />
              <span className="w-1 h-1 rounded-[0.5px] bg-[#FFE7A3] group-hover:bg-white" />
            </div>
            <span className="font-semibold tracking-tight text-white">Matrice 256</span>
          </button>

          {onBackToPreviousSun && historyBreadcrumbs.length > 1 && (
            <button
              onClick={onBackToPreviousSun}
              className="flex items-center gap-1 h-8 sm:h-9 px-2.5 rounded-full bg-white/5 hover:bg-white/15 text-stone-300 hover:text-white border border-white/15 text-xs transition-colors cursor-pointer"
              title="Revenir au soleil précédent"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Précédent</span>
            </button>
          )}
        </div>

        {/* Centre : SÉLECTEUR DE PRISME (Liens humains vs Thématiques) */}
        <div className="hidden md:flex items-center bg-stone-900/90 border border-white/15 rounded-full p-0.5 shadow-sm">
          <button
            onClick={() => setActivePrism('all')}
            className={`px-2.5 py-1 rounded-full text-[10.5px] font-semibold transition-all cursor-pointer ${
              activePrism === 'all'
                ? 'bg-[#A2482B] text-white shadow-xs'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            Tous les liens (16)
          </button>
          <button
            onClick={() => setActivePrism('lineage_duo')}
            className={`px-2.5 py-1 rounded-full text-[10.5px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
              activePrism === 'lineage_duo'
                ? 'bg-[#C89B3C] text-stone-950 shadow-xs'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            <HeartHandshake className="w-3 h-3" />
            <span>Lignées & Duos</span>
          </button>
          <button
            onClick={() => setActivePrism('themes')}
            className={`px-2.5 py-1 rounded-full text-[10.5px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
              activePrism === 'themes'
                ? 'bg-[#D97706] text-white shadow-xs'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            <Compass className="w-3 h-3" />
            <span>Portes & Thèmes</span>
          </button>
        </div>

        {/* Droite : Fil d'Ariane discret (parcours des soleils visités) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {historyBreadcrumbs.slice(-3).map((crumb, idx) => {
            const isCurrent = crumb.id === sun.id;
            return (
              <button
                key={`crumb-${crumb.id}-${idx}`}
                onClick={() => onSelectBreadcrumb(crumb)}
                className={`flex items-center gap-1 pl-1 pr-2 py-0.5 rounded-full transition-all cursor-pointer ${
                  isCurrent 
                    ? 'bg-[#A2482B] text-white ring-1 ring-[#A2482B] shadow-xs' 
                    : 'bg-white/10 text-stone-300 hover:bg-white/20 hover:text-white'
                }`}
                title={`Aller à ${crumb.name}`}
              >
                <img 
                  src={crumb.photoUrl} 
                  alt={crumb.name} 
                  className="w-5 h-5 rounded-full object-cover border border-white/20 shrink-0" 
                />
                <span className="text-[10px] sm:text-[11px] font-semibold truncate max-w-[65px] sm:max-w-[85px]">
                  {crumb.firstName || crumb.name.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 2. SCÈNE CENTRALE : LE SOLEIL, SA COURONNE ET LA CONSTELLATION DE LIENS   */}
      {/* ========================================================================= */}
      <div className="relative flex-1 w-full flex items-center justify-center my-auto min-h-0">
        
        {/* SVG vectoriel des orbites, rayons radiaux et arcs de constellation */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="-350 -350 700 700"
        >
          <defs>
            <radialGradient id="sunCentralGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#C89B3C" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#A2482B" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#A2482B" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Orbite(s) concentrique(s) */}
          {isMobile ? (
            <>
              <circle cx="0" cy="0" r="115" fill="none" stroke="#C89B3C" strokeWidth="0.8" strokeDasharray="3 4" opacity="0.35" />
              <circle cx="0" cy="0" r="175" fill="none" stroke="#C89B3C" strokeWidth="0.6" strokeDasharray="2 3" opacity="0.25" />
            </>
          ) : (
            <circle cx="0" cy="0" r="250" fill="none" stroke="#C89B3C" strokeWidth="1" strokeDasharray="4 4" opacity="0.35" />
          )}

          {/* A. ARCS DE CONSTELLATION TRANSVERSAUX ENTRE LES VOISINS DU CERCLE */}
          {showConstellationArcs && renderedArcs.map((arc) => (
            <path
              key={arc.id}
              d={arc.pathData}
              fill="none"
              stroke={arc.strokeColor}
              strokeWidth={arc.isHighlighted ? 2.8 : 1.1}
              strokeDasharray={arc.type === 'theme' ? '3 3' : 'none'}
              opacity={arc.isHighlighted ? 0.95 : 0.28}
              className="transition-all duration-300"
            />
          ))}

          {/* B. RAYONS RADIAUX (CENTRE SOLEIL -> CHAQUE VOISIN) */}
          {neighborPositions.map((neighbor) => {
            const isHovered = (hoveredNeighbor || selectedNeighbor)?.person.id === neighbor.person.id;
            const isDimmed = activePrism === 'lineage_duo' 
              ? (neighbor.sourceType !== 'counterpoint' && neighbor.sourceType !== 'lineage')
              : activePrism === 'themes'
              ? (neighbor.sourceType !== 'theme')
              : false;

            return (
              <line
                key={`link-${neighbor.person.id}`}
                x1="0"
                y1="0"
                x2={neighbor.x}
                y2={neighbor.y}
                stroke={neighbor.strokeColor}
                strokeWidth={isHovered ? 2.5 : neighbor.strokeWidth}
                strokeDasharray={neighbor.strokeDash}
                opacity={isDimmed ? 0.12 : (isHovered ? 0.95 : 0.45)}
                className="transition-all duration-200"
              />
            );
          })}
        </svg>

        {/* ========================================================================= */}
        {/* NOYAU CENTRAL : LE SOLEIL (Profil Actif)                                  */}
        {/* ========================================================================= */}
        <div 
          onClick={() => onOpenStoryModal(sun)}
          className="absolute z-20 flex flex-col items-center justify-center cursor-pointer group select-none transition-transform duration-300 hover:scale-105"
        >
          {/* Halo radiant or & terracotta */}
          <div className="absolute -inset-4 sm:-inset-6 rounded-full bg-[#A2482B]/35 blur-xl animate-pulse pointer-events-none" />

          {/* Pastille solaire centrale */}
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-3 sm:border-4 border-[#C89B3C] shadow-[0_0_35px_rgba(200,155,60,0.65)] bg-stone-900">
            <img 
              src={sun.photoUrl} 
              alt={sun.name} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Overlay discret avec icône lecture vintage */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 flex flex-col items-center justify-end pb-2">
              <span className="text-[11px] sm:text-xs font-bold text-white text-center px-1 truncate max-w-full drop-shadow-md">
                {sun.name}
              </span>
              <span className="text-[9px] sm:text-[10px] text-[#FFE7A3] font-medium drop-shadow-md flex items-center gap-1">
                <span>Voir l'histoire</span>
                <span className="text-xs">▶</span>
              </span>
            </div>
          </div>

          {/* Drapeau / Pays au bas */}
          <div className="absolute -bottom-2 px-2.5 py-0.5 rounded-full bg-stone-900 border border-[#C89B3C] shadow-md text-[10px] font-bold text-white flex items-center gap-1">
            <span>{sun.flag}</span>
            <span className="text-[9px] uppercase tracking-wider text-[#C89B3C]">Soleil</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* LES 16 VOISINS EN ORBITE                                                  */}
        {/* ========================================================================= */}
        {neighborPositions.map((neighbor) => {
          const isHovered = (hoveredNeighbor || selectedNeighbor)?.person.id === neighbor.person.id;
          const isCounterpoint = neighbor.sourceType === 'counterpoint';
          const isDimmed = activePrism === 'lineage_duo' 
            ? (neighbor.sourceType !== 'counterpoint' && neighbor.sourceType !== 'lineage')
            : activePrism === 'themes'
            ? (neighbor.sourceType !== 'theme')
            : false;

          return (
            <div
              key={`neighbor-node-${neighbor.person.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onSelectNeighbor(neighbor.person);
              }}
              onMouseEnter={() => setHoveredNeighbor(neighbor)}
              onMouseLeave={() => setHoveredNeighbor(null)}
              style={{
                transform: `translate3d(${neighbor.x}px, ${neighbor.y}px, 0)`,
                width: isMobile ? '48px' : '56px',
                height: isMobile ? '48px' : '56px'
              }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center cursor-pointer group select-none transition-opacity duration-200 ${
                isDimmed ? 'opacity-35 hover:opacity-100' : 'opacity-100'
              }`}
            >
              {/* Zone tactile garantie >= 44x44px */}
              <div className="absolute -inset-2 rounded-full pointer-events-auto" />

              {/* Halo lumineux distinctif */}
              <div 
                className={`absolute -inset-1 rounded-full transition-all duration-200 pointer-events-none ${
                  isCounterpoint 
                    ? 'border-2 border-[#C89B3C] shadow-[0_0_15px_rgba(200,155,60,0.85)]' 
                    : isHovered 
                    ? 'border-2 border-[#A2482B] shadow-[0_0_12px_rgba(162,72,43,0.85)]' 
                    : 'border border-white/20'
                }`}
              />

              {/* Médaillon photo */}
              <div className="w-full h-full rounded-full overflow-hidden border border-white/30 bg-stone-900 shadow-md group-hover:scale-115 transition-transform duration-200">
                <img 
                  src={neighbor.person.photoUrl} 
                  alt={neighbor.person.name} 
                  className="w-full h-full object-cover pointer-events-none"
                />
              </div>

              {/* Mini badge source (Contrepoint, Lignée, etc.) */}
              {isCounterpoint && (
                <div className="absolute -top-1.5 -right-1 px-1.5 py-0.2 rounded-full bg-[#C89B3C] text-stone-950 font-bold text-[8px] uppercase tracking-wider shadow-xs pointer-events-none">
                  Duo
                </div>
              )}

              {/* Infobulle élégante au survol ou focus */}
              {isHovered && (
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-50 pointer-events-none w-52 p-2.5 rounded-xl bg-stone-900/95 backdrop-blur-md border border-[#A2482B] shadow-2xl text-left animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="font-bold text-xs text-white truncate">{neighbor.person.name}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/10 text-[#FFE7A3] font-semibold shrink-0">
                      {neighbor.sourceLabel}
                    </span>
                  </div>
                  <p className="text-[10px] text-stone-300 truncate">{neighbor.person.role}</p>
                  
                  {/* Liens avec les autres membres */}
                  {neighbor.person.counterpointName && (
                    <p className="text-[9px] text-[#C89B3C] truncate mt-0.5">
                      Duo : {neighbor.person.counterpointName}
                    </p>
                  )}

                  <p className="text-[9px] text-[#A2482B] font-bold mt-1">
                    Cliquer pour placer en Soleil →
                  </p>
                </div>
              )}
            </div>
          );
        })}

      </div>

      {/* ========================================================================= */}
      {/* 3. MINIMAP BOUSSOLE (16x16) EN BAS À DROITE POUR RETOUR RAPIDE À LA MATRICE */}
      {/* ========================================================================= */}
      <div 
        onClick={onBackToMatrix}
        className="absolute bottom-20 sm:bottom-16 right-3 sm:right-6 z-30 group cursor-pointer pointer-events-auto"
        title="Minimap : Cliquer pour revenir à la Matrice 16x16"
      >
        <div className="relative p-1.5 rounded-xl bg-stone-900/90 backdrop-blur-md border border-[#C89B3C]/50 hover:border-[#A2482B] shadow-xl transition-all group-hover:scale-105 active:scale-95">
          {/* Grille 16x16 miniature de 44x44 px */}
          <div className="grid grid-cols-16 gap-0.5 w-11 h-11 sm:w-12 sm:h-12 pointer-events-none">
            {Array.from({ length: 256 }).map((_, i) => {
              const isCurrent = i === sunMatrixIndex;
              return (
                <span
                  key={`mini-cell-${i}`}
                  className={`w-full aspect-square rounded-[0.5px] ${
                    isCurrent 
                      ? 'bg-[#A2482B] ring-1 ring-[#FFE7A3] animate-pulse z-10' 
                      : (i % 5 === 0 ? 'bg-white/20' : 'bg-white/10')
                  }`}
                />
              );
            })}
          </div>

          <div className="mt-1 flex items-center justify-center gap-1 text-[8.5px] font-bold text-[#FFE7A3] group-hover:text-white">
            <Grid className="w-2.5 h-2.5" />
            <span>256</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. BARRE INFÉRIEURE : LÉGENDE DES 4 SOURCES & BOUTONS D'HISTOIRES          */}
      {/* ========================================================================= */}
      <div className="relative z-30 w-full max-w-4xl mx-auto px-3 sm:px-6 pb-2.5 pt-1.5 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-2.5 pointer-events-auto">
        
        {/* Légende officielle en 4 sources (traits & couleurs) */}
        <div className="flex items-center flex-wrap justify-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] text-stone-300">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-1 rounded-full bg-[#C89B3C]" />
            <span className="font-semibold text-[#FFE7A3]">Contrepoint Duo</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-0.5 rounded-full bg-[#A2482B]" />
            <span>Lignée cooptée</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-0.5 border-b border-dashed border-[#D97706]" />
            <span>Même thématique</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-0.5 border-b border-dotted border-[#78716C]" />
            <span>Découverte</span>
          </div>
        </div>

        {/* Boutons d'action permanents : "Tourner", "Voir le duo" et "Voir son histoire" */}
        <div className="flex items-center gap-2 shrink-0">
          
          {/* Bouton Voir plus / Tourner la roue */}
          <button
            onClick={rotateMore}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white border border-white/20 transition-all cursor-pointer shadow-xs active:scale-95"
            title="Faire tourner la couronne"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>

          {/* Option : Voir le Duo (Face à face avec le contrepoint) */}
          {counterpointProfile && (
            <button
              onClick={() => onOpenDuoModal(sun, counterpointProfile)}
              id="btn-see-duo-face-to-face"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-900 hover:bg-stone-800 text-[#FFE7A3] border border-[#C89B3C] text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95"
              title={`Voir le Duo face-à-face entre ${sun.name} et ${counterpointProfile.name}`}
            >
              <SplitSquareVertical className="w-3.5 h-3.5 text-[#C89B3C]" />
              <span>Voir le duo</span>
            </button>
          )}

          {/* Bouton phare permanent : Voir son histoire */}
          <button
            onClick={() => onOpenStoryModal(sun)}
            id="btn-see-sun-story"
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#A2482B] hover:bg-[#8A3B22] text-white text-xs font-bold shadow-md transition-all cursor-pointer active:scale-95 hover:scale-102"
            title={`Regarder le témoignage vidéo de ${sun.name}`}
          >
            <TvPlayerIcon className="w-4 h-4 text-white" />
            <span>Voir son histoire</span>
          </button>
        </div>

      </div>

    </div>
  );
};
