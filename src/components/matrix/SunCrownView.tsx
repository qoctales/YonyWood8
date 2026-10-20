import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  Sparkles, 
  HeartHandshake, 
  Check,
  ChevronRight,
  HelpCircle,
  X,
  User,
  RotateCcw
} from 'lucide-react';
import { ShareIcon } from '../ShareIcon';
import { MatrixProfile, PersonSatellite, ThemeSatellite, get16SunSatellites } from '../../utils/matrixGridService';
import { DimensionIcon } from '../DimensionIcon';

interface SunCrownViewProps {
  sun: MatrixProfile;
  allProfiles: MatrixProfile[];
  matrixGrid: MatrixProfile[];
  onSelectNeighbor: (neighbor: MatrixProfile) => void;
  onOpenStoryModal: (person: MatrixProfile) => void;
  onOpenDuoModal: (sun: MatrixProfile, counterpoint: MatrixProfile) => void;
  onBackToMatrix: () => void;
  onBackToPreviousSun: () => void;
  historyBreadcrumbs: MatrixProfile[];
}

export const SunCrownView: React.FC<SunCrownViewProps> = ({
  sun,
  allProfiles,
  onSelectNeighbor,
  onOpenStoryModal,
  onOpenDuoModal,
  onBackToMatrix,
  onBackToPreviousSun,
  historyBreadcrumbs
}) => {
  // Calcul des 16 satellites : 8 personnes + 8 thématiques
  const visitedIds = useMemo(() => historyBreadcrumbs.map(b => b.id), [historyBreadcrumbs]);
  const satellites = useMemo(() => get16SunSatellites(sun, allProfiles, visitedIds), [sun, allProfiles, visitedIds]);

  // Contrepoint duo
  const counterpointSat = satellites.find(s => s.kind === 'person' && s.linkType === 'counterpoint') as PersonSatellite | undefined;
  const counterpointPerson = counterpointSat?.person;

  // Thématique sélectionnée pour venir au centre (Interaction Thématique au cœur du Soleil)
  const [activeCenterTheme, setActiveCenterTheme] = useState<ThemeSatellite | null>(null);
  const [selectedSubcatDetail, setSelectedSubcatDetail] = useState<{ label: string; question?: string; icone?: string } | null>(null);

  // Satellite survolé pour affichage discret
  const [hoveredSatellite, setHoveredSatellite] = useState<{ kind: 'person' | 'theme'; title: string; subtitle?: string } | null>(null);

  // État de copie du lien
  const [copiedLink, setCopiedLink] = useState(false);
  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // Disposition angulaire des 16 satellites (8 personnes alternées avec 8 thématiques)
  const angleStep = (2 * Math.PI) / 16;
  const orbitRadius = 185; // Rayon adapté pour s'inscrire dans le gabarit ~440-520px

  return (
    <div className="w-full flex flex-col items-center justify-center px-3 sm:px-6 pt-16 sm:pt-20 pb-20 select-none">
      
      {/* CADRE PRINCIPAL : MÊME GABARIT STABLE DES DEUX CARTES DUO SUR FOND BLANC */}
      <div className={`relative rounded-2xl sm:rounded-3xl overflow-hidden bg-[#FAF8F5] text-stone-900 shadow-xl border border-stone-200/90 flex flex-col justify-between 
        w-full max-w-[min(100%,calc(2*310px+32px))] 
        min-h-[520px] sm:min-h-[580px] 
        transition-all duration-300 relative`}
      >
        
        {/* BARRE HAUTE DISCRÈTE : RETOUR MATRICE + BREADCRUMBS SANS ENCOMBREMENT */}
        <div className="relative z-30 flex items-center justify-between px-3 sm:px-4 py-2 bg-white/90 backdrop-blur-md border-b border-stone-200/80 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={onBackToMatrix}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-700 hover:text-[#A2482B] text-xs font-semibold transition-all cursor-pointer shadow-2xs"
              title="Retour à la Matrice 16×16"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#A2482B]" />
              <span>Matrice</span>
            </button>

            {historyBreadcrumbs.length > 1 && (
              <button
                onClick={onBackToPreviousSun}
                className="flex items-center gap-1 text-[11px] text-stone-600 hover:text-stone-900 transition-colors"
                title="Soleil précédent"
              >
                <RotateCcw className="w-3 h-3" />
                <span className="hidden sm:inline">Précédent</span>
              </button>
            )}
          </div>

          {/* Profil central actuel / Partage */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-stone-800 font-serif">
              {sun.name}
            </span>
            <button
              onClick={handleShare}
              className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-600 hover:text-stone-900 transition-all cursor-pointer"
              title="Partager ce Soleil"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <ShareIcon className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* ZONE CENTRALE : L'ORBITE CÉLESTE DU SOLEIL SUR FOND BLANC LUMINEUX */}
        <div className="relative flex-1 w-full h-full flex items-center justify-center p-4 overflow-hidden min-h-[440px]">
          
          {/* Lignes radiales et orbites discrètes en SVG */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="-240 -240 480 480">
            {/* Cercle d'orbite subtil */}
            <circle cx="0" cy="0" r={orbitRadius} fill="none" stroke="#E7E2DA" strokeWidth="1.2" strokeDasharray="3 3" />
            <circle cx="0" cy="0" r={orbitRadius * 0.65} fill="none" stroke="#EFECE6" strokeWidth="1" />

            {/* Rayons vers les 16 satellites */}
            {satellites.map((sat, i) => {
              const angle = i * angleStep - Math.PI / 2;
              const x = Math.cos(angle) * orbitRadius;
              const y = Math.sin(angle) * orbitRadius;

              const isContrepoint = sat.kind === 'person' && sat.linkType === 'counterpoint';
              const strokeColor = isContrepoint ? '#A2482B' : sat.kind === 'person' ? '#D6CEBE' : '#E0D9CB';
              const strokeWidth = isContrepoint ? '2.2' : '1';

              return (
                <line
                  key={`ray-${i}`}
                  x1="0"
                  y1="0"
                  x2={x}
                  y2={y}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeDasharray={isContrepoint ? undefined : '2 3'}
                  opacity={isContrepoint ? 0.9 : 0.6}
                />
              );
            })}
          </svg>

          {/* 16 SATELLITES SANS AUCUN TEXTE PERMANENT (PURETÉ VISUELLE) */}
          <div className="relative w-full h-full flex items-center justify-center">
            {satellites.map((sat, i) => {
              const angle = i * angleStep - Math.PI / 2;
              const x = Math.cos(angle) * orbitRadius;
              const y = Math.sin(angle) * orbitRadius;

              if (sat.kind === 'person') {
                const person = sat.person;
                const isContrepoint = sat.linkType === 'counterpoint';
                const isFiliation = sat.linkType === 'parent';

                return (
                  <div
                    key={`person-${person.id}-${i}`}
                    style={{
                      transform: `translate(${x}px, ${y}px)`
                    }}
                    onClick={() => {
                      setActiveCenterTheme(null);
                      onSelectNeighbor(person);
                    }}
                    onMouseEnter={() => setHoveredSatellite({ 
                      kind: 'person', 
                      title: person.name, 
                      subtitle: isContrepoint ? 'Contrepoint en duo' : isFiliation ? 'Lignée d’entrée' : 'Voix en résonance' 
                    })}
                    onMouseLeave={() => setHoveredSatellite(null)}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 group ${
                      isContrepoint 
                        ? 'z-20 hover:scale-125' 
                        : 'z-10 hover:scale-120 hover:z-30'
                    }`}
                    title={person.name}
                  >
                    {/* Vignette ronde pure sans texte en dessous */}
                    <div className={`relative rounded-full overflow-hidden transition-all shadow-md ${
                      isContrepoint 
                        ? 'w-11 h-11 sm:w-12 sm:h-12 ring-2 ring-[#A2482B] ring-offset-2 ring-offset-[#FAF8F5]' 
                        : isFiliation
                          ? 'w-9 h-9 sm:w-10 sm:h-10 ring-2 ring-amber-400 ring-offset-1 ring-offset-[#FAF8F5]'
                          : 'w-8.5 h-8.5 sm:w-9.5 sm:h-9.5 ring-1.5 ring-stone-300 group-hover:ring-[#A2482B]'
                    }`}>
                      <img
                        src={person.photoUrl}
                        alt={person.name}
                        className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all"
                      />
                    </div>
                  </div>
                );
              }

              // Satellite Thématique (Pictogramme des 8 Portes, sans texte permanent)
              const theme = sat as ThemeSatellite;
              const isCenterActive = activeCenterTheme?.doorId === theme.doorId;

              return (
                <div
                  key={`theme-${theme.doorId}-${i}`}
                  style={{
                    transform: `translate(${x}px, ${y}px)`
                  }}
                  onClick={() => {
                    setActiveCenterTheme(theme);
                    setSelectedSubcatDetail(null);
                  }}
                  onMouseEnter={() => setHoveredSatellite({ 
                    kind: 'theme', 
                    title: theme.label, 
                    subtitle: 'Cliquer pour explorer ses 8 directions' 
                  })}
                  onMouseLeave={() => setHoveredSatellite(null)}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 z-10 hover:scale-125 hover:z-30 group`}
                  title={theme.label}
                >
                  <div 
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shadow-xs transition-all ${
                      isCenterActive
                        ? 'ring-2 ring-offset-2 ring-offset-[#FAF8F5]'
                        : 'border border-stone-200/80 bg-white hover:border-stone-400'
                    }`}
                    style={{
                      borderColor: isCenterActive ? theme.accentColor : undefined,
                      boxShadow: isCenterActive ? `0 0 12px ${theme.accentColor}40` : undefined
                    }}
                  >
                    <DimensionIcon name={theme.iconName} size={16} className="text-stone-700 group-hover:text-stone-900" />
                  </div>
                </div>
              );
            })}

            {/* LE CŒUR DU SOLEIL (CENTRE) : SOIT LA PERSONNE, SOIT LA THÉMATIQUE SÉLECTIONNÉE */}
            {!activeCenterTheme ? (
              // 1. Vue Personne au Centre
              <div className="relative z-20 flex flex-col items-center text-center max-w-[170px] animate-in fade-in duration-200">
                <div 
                  onClick={() => onOpenStoryModal(sun)}
                  className="relative group cursor-pointer"
                >
                  <div className="w-22 h-22 sm:w-24 sm:h-24 rounded-full overflow-hidden shadow-2xl ring-4 ring-[#A2482B]/80 ring-offset-2 ring-offset-[#FAF8F5] transition-transform duration-300 group-hover:scale-105">
                    <img
                      src={sun.photoUrl}
                      alt={sun.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-[#A2482B] text-white text-[9.5px] font-bold px-2 py-0.5 rounded-full shadow-xs uppercase tracking-wider flex items-center gap-1 whitespace-nowrap">
                    <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                    <span>Soleil</span>
                  </div>
                </div>

                <div className="mt-2.5">
                  <h3 className="font-editorial text-sm sm:text-base font-bold text-stone-900 leading-tight">
                    {sun.name}
                  </h3>
                  {sun.doorLabel && (
                    <p className="text-[10.5px] text-[#A2482B] font-medium leading-tight mt-0.5">
                      {sun.doorLabel}
                    </p>
                  )}
                </div>

                {/* Actions épurées : Écouter l'histoire / Duo face-à-face */}
                <div className="flex items-center gap-1.5 mt-2">
                  <button
                    onClick={() => onOpenStoryModal(sun)}
                    className="px-2.5 py-1 rounded-full bg-stone-900 hover:bg-[#A2482B] text-white text-[10.5px] font-medium transition-all shadow-xs cursor-pointer"
                  >
                    Voir l'histoire
                  </button>
                  {counterpointPerson && (
                    <button
                      onClick={() => onOpenDuoModal(sun, counterpointPerson)}
                      className="p-1 rounded-full border border-stone-300 hover:border-[#A2482B] text-stone-700 hover:text-[#A2482B] bg-white transition-all shadow-2xs cursor-pointer"
                      title={`Voir le duo avec ${counterpointPerson.name}`}
                    >
                      <HeartHandshake className="w-3.5 h-3.5 text-[#A2482B]" />
                    </button>
                  )}
                </div>
              </div>
            ) : (
              // 2. Vue Thématique au Centre (Interaction demandée par l'utilisateur)
              <div className="relative z-20 flex flex-col items-center text-center max-w-[200px] bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-stone-200/90 shadow-xl animate-in zoom-in-95 duration-200">
                <button
                  onClick={() => setActiveCenterTheme(null)}
                  className="absolute top-2 right-2 text-stone-600 hover:text-stone-700 cursor-pointer"
                  title="Fermer la thématique"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md mb-1.5"
                  style={{ backgroundColor: activeCenterTheme.accentColor }}
                >
                  <DimensionIcon name={activeCenterTheme.iconName} size={20} className="text-white" />
                </div>

                <h4 className="font-editorial text-xs sm:text-sm font-bold text-stone-900 leading-tight">
                  {activeCenterTheme.label}
                </h4>
                <p className="text-[10px] text-stone-600 font-serif italic leading-tight mt-0.5">
                  8 directions de cette porte :
                </p>

                {/* Les 8 sous-directions affichées avec légèreté */}
                <div className="grid grid-cols-4 gap-1.5 mt-2 w-full">
                  {activeCenterTheme.subcategories.slice(0, 8).map((sub, sIdx) => (
                    <button
                      key={`subcat-${sIdx}`}
                      onClick={() => setSelectedSubcatDetail(sub)}
                      className={`p-1 rounded-lg border text-center transition-all flex flex-col items-center cursor-pointer ${
                        selectedSubcatDetail?.label === sub.label 
                          ? 'border-[#A2482B] bg-[#A2482B]/10' 
                          : 'border-stone-100 hover:border-stone-300 bg-stone-50'
                      }`}
                      title={sub.label}
                    >
                      <DimensionIcon name={sub.icone || activeCenterTheme.iconName} size={12} className="text-stone-700" />
                      <span className="text-[8px] text-stone-600 truncate w-full mt-0.5">{sub.label.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>

                {selectedSubcatDetail && (
                  <div className="mt-2 text-[9.5px] text-stone-700 bg-amber-50/80 p-1.5 rounded-lg border border-amber-200/60 leading-tight">
                    <span className="font-semibold">{selectedSubcatDetail.label}</span>
                    {selectedSubcatDetail.question && (
                      <p className="italic text-stone-600 mt-0.5">« {selectedSubcatDetail.question} »</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* INFOBULLE ÉPURÉE AU SURVOL D'UN SATELLITE (SANS TEXTE PERMANENT) */}
          {hoveredSatellite && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 pointer-events-none bg-stone-900/90 text-white backdrop-blur-md px-3 py-1 rounded-full text-center shadow-lg border border-white/10 animate-in fade-in duration-150">
              <span className="text-xs font-semibold">{hoveredSatellite.title}</span>
              {hoveredSatellite.subtitle && (
                <span className="text-[10px] text-amber-300 ml-1.5 font-normal">· {hoveredSatellite.subtitle}</span>
              )}
            </div>
          )}
        </div>

        {/* PIED DISCRET DU SOLEIL */}
        <div className="px-3 py-1.5 bg-stone-50/80 border-t border-stone-200/60 flex items-center justify-between text-[11px] text-stone-600">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A2482B]" />
            <span>16 satellites : 8 personnes & 8 portes d'exploration</span>
          </div>
          <button
            onClick={onBackToMatrix}
            className="text-[10.5px] text-[#A2482B] hover:underline font-semibold cursor-pointer"
          >
            ← Vue Matrice
          </button>
        </div>

      </div>

    </div>
  );
};
