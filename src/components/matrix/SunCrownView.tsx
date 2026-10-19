import React, { useState, useMemo } from 'react';
import { 
  Grid, 
  ArrowLeft, 
  Tv, 
  Sparkles, 
  RotateCw, 
  Play, 
  Compass,
  Layers,
  ChevronRight,
  SplitSquareVertical
} from 'lucide-react';
import { MatrixProfile, SunNeighbor } from '../../utils/matrixGridService';
import { TvPlayerIcon } from '../YonywoodBrandIcons';

interface SunCrownViewProps {
  sun: MatrixProfile;
  neighbors: SunNeighbor[];
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

  // Détection mobile pour disposition à 2 couronnes (6 intérieures + 10 extérieures)
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 640 : false;

  // Trouver le contrepoint pour le bouton "Voir le duo"
  const counterpointNeighbor = neighbors.find(n => n.sourceType === 'counterpoint');
  const counterpointProfile = counterpointNeighbor?.person;

  // Calcul des coordonnées trigonométriques des 16 voisins
  const neighborPositions = useMemo(() => {
    if (isMobile) {
      // Version Smartphone : 2 couronnes concentriques
      // Couronne 1 : R = 115 px (6 personnes : Contrepoint + Lignée proche)
      // Couronne 2 : R = 175 px (10 personnes : Thématique + Découverte)
      const innerRadius = 115;
      const outerRadius = 175;
      const innerList = neighbors.slice(0, 6);
      const outerList = neighbors.slice(6, 16);

      const items: Array<SunNeighbor & { x: number; y: number; radius: number }> = [];

      innerList.forEach((n, idx) => {
        const angle = -90 + (idx * (360 / Math.max(1, innerList.length))) + rotationOffset;
        const rad = (angle * Math.PI) / 180;
        items.push({
          ...n,
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
          x: Math.cos(rad) * outerRadius,
          y: Math.sin(rad) * outerRadius,
          radius: 20
        });
      });

      return items;
    } else {
      // Version Desktop : 1 grande orbite solaire royale (R = 260 px)
      const r = 260;
      return neighbors.map((n, idx) => {
        const angle = -90 + (idx * (360 / Math.max(1, neighbors.length))) + rotationOffset;
        const rad = (angle * Math.PI) / 180;
        return {
          ...n,
          x: Math.cos(rad) * r,
          y: Math.sin(rad) * r,
          radius: 26
        };
      });
    }
  }, [neighbors, isMobile, rotationOffset]);

  const rotateMore = () => {
    setRotationOffset(prev => prev + 45);
  };

  return (
    <div className="relative w-full h-[calc(100dvh-56px)] overflow-hidden select-none bg-stone-950 text-white flex flex-col justify-between">
      
      {/* Texture céleste en filigrane */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #C89B3C 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* ========================================================================= */}
      {/* 1. BARRE SUPÉRIEURE DE NAVIGATION ET FIL D'ARIANE                         */}
      {/* ========================================================================= */}
      <div className="relative z-30 w-full max-w-4xl mx-auto px-3 sm:px-6 pt-2 pb-1 shrink-0 flex items-center justify-between gap-2 pointer-events-auto">
        
        {/* Gauche : Bouton fixe "Matrice" (Grille) + Bouton Revenir au précédent */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={onBackToMatrix}
            id="btn-back-to-matrix"
            className="flex items-center gap-1.5 h-8 sm:h-9 px-3 rounded-full bg-white/10 hover:bg-[#A2482B] text-white border border-white/20 hover:border-[#A2482B] text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95 group"
            title="Revenir au grand mur de la Matrice (256 visages)"
          >
            <Grid className="w-4 h-4 text-[#FFE7A3] group-hover:text-white" />
            <span>Matrice</span>
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

        {/* Centre / Droite : Fil d'Ariane discret (3-4 derniers soleils visités) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-[10px] text-stone-400 uppercase tracking-wider font-semibold mr-1 hidden sm:inline">
            Parcours :
          </span>
          {historyBreadcrumbs.slice(-4).map((crumb, idx) => {
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
      {/* 2. SCÈNE CENTRALE : LE SOLEIL ET SA COURONNE DE 16 VOISINS                */}
      {/* ========================================================================= */}
      <div className="relative flex-1 w-full flex items-center justify-center my-auto min-h-0">
        
        {/* SVG vectoriel des orbites et des lignes de connexion */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="-350 -350 700 700"
        >
          <defs>
            {/* Halo lumineux pour le Soleil central */}
            <radialGradient id="sunCentralGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#C89B3C" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#A2482B" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#A2482B" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Orbite(s) concentrique(s) */}
          {isMobile ? (
            <>
              <circle cx="0" cy="0" r="115" fill="none" stroke="#C89B3C" strokeWidth="0.8" strokeDasharray="3 4" opacity="0.4" />
              <circle cx="0" cy="0" r="175" fill="none" stroke="#C89B3C" strokeWidth="0.6" strokeDasharray="2 3" opacity="0.3" />
            </>
          ) : (
            <circle cx="0" cy="0" r="260" fill="none" stroke="#C89B3C" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
          )}

          {/* Lignes de liaison visuelles distinguées par source */}
          {neighborPositions.map((neighbor) => (
            <line
              key={`link-${neighbor.person.id}`}
              x1="0"
              y1="0"
              x2={neighbor.x}
              y2={neighbor.y}
              stroke={neighbor.strokeColor}
              strokeWidth={neighbor.strokeWidth}
              strokeDasharray={neighbor.strokeDash}
              opacity={hoveredNeighbor?.person.id === neighbor.person.id ? 0.95 : 0.45}
            />
          ))}
        </svg>

        {/* ========================================================================= */}
        {/* NOYAU CENTRAL : LE SOLEIL (Profil Actif)                                  */}
        {/* ========================================================================= */}
        <div 
          onClick={() => onOpenStoryModal(sun)}
          className="absolute z-20 flex flex-col items-center justify-center cursor-pointer group select-none transition-transform duration-300 hover:scale-105"
        >
          {/* Halo radiant or & terracotta */}
          <div className="absolute -inset-4 sm:-inset-6 rounded-full bg-[#A2482B]/30 blur-xl animate-pulse pointer-events-none" />

          {/* Pastille solaire centrale */}
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-3 sm:border-4 border-[#C89B3C] shadow-[0_0_35px_rgba(200,155,60,0.6)] bg-stone-900">
            <img 
              src={sun.photoUrl} 
              alt={sun.name} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Overlay discret avec icône lecture */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20 flex flex-col items-center justify-end pb-2">
              <span className="text-[11px] sm:text-xs font-bold text-white text-center px-1 truncate max-w-full drop-shadow-md">
                {sun.name}
              </span>
              <span className="text-[9px] sm:text-[10px] text-[#FFE7A3] font-medium drop-shadow-md">
                Voir l'histoire ▶
              </span>
            </div>
          </div>

          {/* Drapeau / Pays au bas */}
          <div className="absolute -bottom-2 px-2 py-0.5 rounded-full bg-stone-900 border border-[#C89B3C] shadow-md text-[10px] font-bold text-white flex items-center gap-1">
            <span>{sun.flag}</span>
            <span className="text-[9px] uppercase tracking-wider text-[#C89B3C]">Soleil</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* LES 16 VOISINS EN ORBITE                                                  */}
        {/* ========================================================================= */}
        {neighborPositions.map((neighbor) => {
          const isHovered = hoveredNeighbor?.person.id === neighbor.person.id;
          const isCounterpoint = neighbor.sourceType === 'counterpoint';

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
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center cursor-pointer group select-none"
            >
              {/* Zone tactile garantie >= 44x44px */}
              <div className="absolute -inset-2 rounded-full pointer-events-auto" />

              {/* Halo lumineux distinctif */}
              <div 
                className={`absolute -inset-1 rounded-full transition-all duration-200 pointer-events-none ${
                  isCounterpoint 
                    ? 'border-2 border-[#C89B3C] shadow-[0_0_15px_rgba(200,155,60,0.8)]' 
                    : isHovered 
                    ? 'border-2 border-[#A2482B] shadow-[0_0_12px_rgba(162,72,43,0.7)]' 
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
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-50 pointer-events-none w-48 p-2 rounded-xl bg-stone-900/95 backdrop-blur-md border border-[#A2482B] shadow-2xl text-left animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="font-bold text-xs text-white truncate">{neighbor.person.name}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/10 text-[#FFE7A3] font-semibold shrink-0">
                      {neighbor.sourceLabel}
                    </span>
                  </div>
                  <p className="text-[10px] text-stone-300 truncate">{neighbor.person.role}</p>
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
      {/* 3. BARRE INFÉRIEURE : LÉGENDE DES 4 SOURCES & BOUTONS D'HISTOIRES          */}
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

        {/* Boutons d'action permanents : "Voir son histoire" et "Voir le duo" */}
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
