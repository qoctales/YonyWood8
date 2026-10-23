import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  X, 
  BookOpen, 
  Sparkles, 
  Check, 
  Building2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  CornerDownRight,
  RotateCcw
} from 'lucide-react';
import { 
  getLineageTree, 
  getChildrenForMember, 
  LineageMember, 
  LINEAGE_COLORS 
} from '../utils/lineageService';
import { SequenceCreditsModal } from './SequenceCreditsModal';
import { getSeriesCredits } from '../data/seriesTeamData';
import { ProfileSoloIcon, TvPlayerIcon } from './YonywoodBrandIcons';
import { ShareIcon } from './ShareIcon';
import { ViewScreen } from '../types';

interface ProfileLineageFriseProps {
  personIdOrName: string;
  onNavigateToPerson: (personId: string) => void;
  onNavigate?: (screen: ViewScreen) => void;
  onClose?: () => void;
}

export const ProfileLineageFrise: React.FC<ProfileLineageFriseProps> = ({
  personIdOrName,
  onNavigateToPerson,
  onNavigate,
  onClose
}) => {
  // Membre actuellement au centre de l'arbre généalogique (permet une exploration infinie)
  const [focalMemberId, setFocalMemberId] = useState<string>(personIdOrName);
  // Historique de navigation pour revenir facilement au profil initial
  const [navHistory, setNavHistory] = useState<string[]>([]);

  // Pagination horizontale par tranche de 3 cooptés sur la même ligne
  const [descendantPageIndex, setDescendantPageIndex] = useState<number>(0);
  const [grandchildPageIndex, setGrandchildPageIndex] = useState<number>(0);

  // Enfant sélectionné dont la descendance est déployée en dessous (1er clic)
  const [expandedChildId, setExpandedChildId] = useState<string | null>(null);
  // Petit-enfant sélectionné dont la sous-descendance est déployée (1er clic)
  const [expandedGrandchildId, setExpandedGrandchildId] = useState<string | null>(null);

  // Ascendant sélectionné pour le menu d'action rapide (Centrer / Vidéo)
  const [activeAscendantActionId, setActiveAscendantActionId] = useState<string | null>(null);

  const [hoveredMemberId, setHoveredMemberId] = useState<string | null>(null);
  const [videoModalMember, setVideoModalMember] = useState<LineageMember | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [isCreditsModalOpen, setIsCreditsModalOpen] = useState(false);
  const [copied, setCopied] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Synchronisation si le prop change de l'extérieur
  useEffect(() => {
    setFocalMemberId(personIdOrName);
    setNavHistory([]);
    setExpandedChildId(null);
    setExpandedGrandchildId(null);
    setDescendantPageIndex(0);
    setGrandchildPageIndex(0);
  }, [personIdOrName]);

  // Arbre généalogique principal pour le membre focal actuel
  const tree = getLineageTree(focalMemberId);
  const focalMember = tree.current;

  // Descendance de l'enfant sélectionné au 1er clic
  const expandedChildDescendants = expandedChildId 
    ? getChildrenForMember(expandedChildId)
    : [];

  // Petit-enfant sélectionné
  const expandedGrandchildDescendants = expandedGrandchildId
    ? getChildrenForMember(expandedGrandchildId)
    : [];

  // Tranche de 3 descendants affichée sur la ligne principale
  const PAGE_SIZE = 3;
  const totalDescendantPages = Math.ceil(tree.descendants.length / PAGE_SIZE) || 1;
  const visibleDescendants = tree.descendants.slice(
    descendantPageIndex * PAGE_SIZE,
    (descendantPageIndex + 1) * PAGE_SIZE
  );

  // Tranche de 3 petits-enfants
  const totalGrandchildPages = Math.ceil(expandedChildDescendants.length / PAGE_SIZE) || 1;
  const visibleGrandchildren = expandedChildDescendants.slice(
    grandchildPageIndex * PAGE_SIZE,
    (grandchildPageIndex + 1) * PAGE_SIZE
  );

  // Recentrer la vue sur le membre focal au changement
  useEffect(() => {
    const timer = setTimeout(() => {
      const currentElem = document.getElementById(`frise-node-focal-${focalMember.id}`);
      if (currentElem && scrollContainerRef.current) {
        currentElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [focalMemberId, focalMember.id]);

  /**
   * Navigue et recentre tout l'arbre généalogique sur un membre spécifique
   * (permettant d'explorer ses ancêtres, ses pairs et tous les cooptés qu'il a introduits)
   */
  const navigateToFocalMember = (newMemberId: string) => {
    if (newMemberId === focalMemberId) return;
    setNavHistory(prev => [...prev, focalMemberId]);
    setFocalMemberId(newMemberId);
    setExpandedChildId(null);
    setExpandedGrandchildId(null);
    setDescendantPageIndex(0);
    setGrandchildPageIndex(0);
    setActiveAscendantActionId(null);
  };

  /**
   * Retourne au membre précédent dans l'historique d'exploration
   */
  const handleGoBack = () => {
    if (navHistory.length === 0) return;
    const previousId = navHistory[navHistory.length - 1];
    setNavHistory(prev => prev.slice(0, prev.length - 1));
    setFocalMemberId(previousId);
    setExpandedChildId(null);
    setExpandedGrandchildId(null);
    setDescendantPageIndex(0);
    setGrandchildPageIndex(0);
    setActiveAscendantActionId(null);
  };

  /**
   * Règle d'interaction en 2 clics sur la descendance :
   * - 1er clic : Révèle la descendance de la personne en dessous.
   * - 2ème clic : Ouvre sa carte vidéo format Héritage.
   */
  const handleChildClick = (child: LineageMember) => {
    if (expandedChildId === child.id) {
      openVideoCard(child);
    } else {
      setExpandedChildId(child.id);
      setExpandedGrandchildId(null);
      setGrandchildPageIndex(0);
    }
  };

  const handleGrandchildClick = (grandchild: LineageMember) => {
    if (expandedGrandchildId === grandchild.id) {
      openVideoCard(grandchild);
    } else {
      setExpandedGrandchildId(grandchild.id);
    }
  };

  const openVideoCard = (member: LineageMember) => {
    setVideoModalMember(member);
    setIsPlaying(true);
    setIsQuestionModalOpen(false);
  };

  const togglePlayback = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div 
      id="profile-lineage-frise-container"
      className="relative w-full max-w-lg mx-auto flex-1 min-h-0 h-full flex flex-col items-center justify-between bg-white text-stone-900 animate-in fade-in duration-200 select-none overflow-hidden"
    >
      {/* Barre de retour en arrière si l'utilisateur a navigué dans l'arbre */}
      {navHistory.length > 0 && (
        <div className="w-full px-4 pt-3 pb-1 flex items-center justify-between bg-white/95 backdrop-blur-xs border-b border-stone-100 z-30 shrink-0">
          <button
            type="button"
            onClick={handleGoBack}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#A2482B] hover:text-[#C85A32] transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Revenir au membre précédent</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setFocalMemberId(personIdOrName);
              setNavHistory([]);
              setExpandedChildId(null);
              setExpandedGrandchildId(null);
            }}
            className="text-[11px] text-stone-500 hover:text-stone-800 flex items-center gap-1 transition-colors cursor-pointer"
            title="Revenir au profil initial"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Racine</span>
          </button>
        </div>
      )}

      {/* Conteneur principal avec défilement fluide et fond blanc pur */}
      <div 
        ref={scrollContainerRef}
        id="profile-lineage-frise-scroll"
        className="relative flex-1 w-full h-full overflow-y-auto overflow-x-hidden no-scrollbar px-3 py-6 flex flex-col items-center scroll-smooth bg-white"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        onClick={() => setActiveAscendantActionId(null)}
      >
        {/* Structure de l'arbre généalogique */}
        <div className="relative flex flex-col items-center w-full my-auto py-2">

          {/* ========================================================= */}
          {/* 1. CHAÎNE D'ASCENDANCE VERTICALE (PARRAINS JUSQU'AU RACINE)*/}
          {/* ========================================================= */}
          {tree.ascendants.length > 0 && (
            <div className="relative flex flex-col items-center gap-9 w-full mb-9">
              {/* Ligne d'ascendance continue en or noble */}
              <div 
                className="absolute top-4 bottom-[-2.25rem] left-1/2 -translate-x-1/2 w-[2.5px] bg-[#C89B3C] pointer-events-none -z-0"
                style={{ boxShadow: '0 0 6px rgba(200, 155, 60, 0.35)' }}
              />

              {tree.ascendants.map((ascendant, idx) => {
                const isFounder = ascendant.isFounder === true;
                const isOrg = ascendant.entityType === 'organization';
                const isHovered = hoveredMemberId === ascendant.id;
                const isActionOpen = activeAscendantActionId === ascendant.id;

                return (
                  <div
                    key={`ascendant-${ascendant.id}-${idx}`}
                    className="relative z-10 flex flex-col items-center"
                    onMouseEnter={() => setHoveredMemberId(ascendant.id)}
                    onMouseLeave={() => setHoveredMemberId(null)}
                  >
                    {/* Bulle info au survol */}
                    {isHovered && !isActionOpen && (
                      <div className="absolute -top-7 px-3 py-0.5 rounded-full text-[11px] font-semibold bg-[#1C1917] text-white border border-stone-700 shadow-md pointer-events-none whitespace-nowrap z-30 animate-in fade-in">
                        {ascendant.name}
                        {isFounder && <span className="ml-1 text-[9px] uppercase text-[#E07A5F]">· Fondateur</span>}
                      </div>
                    )}

                    {/* Menu d'action au clic sur l'ascendant : Explorer sa branche ou Voir sa vidéo */}
                    {isActionOpen && (
                      <div 
                        className="absolute -top-11 z-40 flex items-center gap-1.5 p-1 rounded-full bg-[#1C1917] text-white shadow-xl border border-amber-400/50 animate-in zoom-in-95 duration-150"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() => navigateToFocalMember(ascendant.id)}
                          className="px-2.5 py-1 rounded-full bg-[#A2482B] hover:bg-[#C85A32] text-[10px] font-bold text-white flex items-center gap-1 cursor-pointer transition-colors"
                          title="Centrer l'arbre sur cet ascendant et voir tous ses cooptés et pairs"
                        >
                          <CornerDownRight className="w-3 h-3" />
                          <span>Explorer sa lignée</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveAscendantActionId(null);
                            openVideoCard(ascendant);
                          }}
                          className="px-2 py-1 rounded-full bg-stone-800 hover:bg-stone-700 text-[10px] font-medium text-stone-200 flex items-center gap-1 cursor-pointer transition-colors"
                          title="Regarder son témoignage vidéo"
                        >
                          <Play className="w-2.5 h-2.5 fill-white" />
                          <span>Vidéo</span>
                        </button>
                      </div>
                    )}

                    {/* Médaillon de l'ascendant */}
                    {isOrg ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveAscendantActionId(prev => prev === ascendant.id ? null : ascendant.id);
                        }}
                        className="group relative w-12 h-12 rounded-xl border-2 border-[#C89B3C] bg-white overflow-hidden shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
                        title={`${ascendant.name} · Cliquez pour explorer`}
                      >
                        <img 
                          src={ascendant.photoUrl} 
                          alt={ascendant.name} 
                          referrerPolicy="no-referrer" 
                          className="w-full h-full object-cover" 
                        />
                        <div className="absolute bottom-0.5 right-0.5 p-0.5 rounded-xs bg-black/70 text-amber-300">
                          <Sparkles className="w-2.5 h-2.5" />
                        </div>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveAscendantActionId(prev => prev === ascendant.id ? null : ascendant.id);
                        }}
                        className="group relative w-12 h-14 flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer"
                        title={`${ascendant.name} · Cliquez pour explorer`}
                      >
                        <svg viewBox="0 0 100 115" className="absolute inset-0 w-full h-full pointer-events-none">
                          <polygon 
                            points="50,2 96,28 96,87 50,113 4,87 4,28" 
                            fill="#FFFFFF" 
                            stroke={isFounder ? '#C85A32' : '#C89B3C'} 
                            strokeWidth={isFounder ? '3' : '2'}
                            strokeLinejoin="round"
                          />
                          {isFounder && (
                            <polygon 
                              points="50,6 92,30 92,85 50,109 8,85 8,30" 
                              fill="none" 
                              stroke="#E07A5F" 
                              strokeWidth="1.5"
                              strokeLinejoin="round"
                            />
                          )}
                        </svg>
                        <div 
                          className="w-[84%] h-[84%] overflow-hidden bg-stone-100"
                          style={{ clipPath: 'polygon(50% 2%, 96% 28%, 96% 72%, 50% 98%, 4% 72%, 4% 28%)' }}
                        >
                          <img 
                            src={ascendant.photoUrl} 
                            alt={ascendant.name} 
                            referrerPolicy="no-referrer" 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                      </button>
                    )}

                    {/* Uniquement le Nom épuré sans étiquette superflue */}
                    <span className="mt-1 text-[11px] font-semibold text-stone-700 bg-white px-2 py-0.2 rounded-full border border-stone-200/80 shadow-2xs">
                      {ascendant.firstName || ascendant.name.split(' ')[0]}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* ========================================================= */}
          {/* 2. LE MEMBRE FOCAL (AU CŒUR DE L'ARBRE)                   */}
          {/* ========================================================= */}
          <div 
            id={`frise-node-focal-${focalMember.id}`}
            className="relative z-20 flex flex-col items-center my-2"
          >
            {/* Halo lumineux chaleureux */}
            <div 
              className="absolute -inset-4 rounded-full pointer-events-none animate-pulse"
              style={{
                background: focalMember.isFounder 
                  ? 'radial-gradient(circle, rgba(200,90,50,0.3) 0%, transparent 70%)'
                  : 'radial-gradient(circle, rgba(200,155,60,0.3) 0%, transparent 70%)',
                filter: 'blur(8px)'
              }}
            />

            {/* Médaillon central agrandi */}
            {focalMember.entityType === 'organization' ? (
              <button
                type="button"
                onClick={() => openVideoCard(focalMember)}
                className="relative w-18 h-18 rounded-2xl border-[3px] border-[#C89B3C] shadow-md overflow-hidden bg-white cursor-pointer hover:scale-105 active:scale-95 transition-all"
                title={`${focalMember.name} (Organisation centrale · Cliquez pour la vidéo)`}
              >
                <img 
                  src={focalMember.photoUrl} 
                  alt={focalMember.name} 
                  referrerPolicy="no-referrer" 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute bottom-1 right-1 p-0.5 rounded-xs bg-black/75 text-amber-300">
                  <Sparkles className="w-3 h-3" />
                </div>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => openVideoCard(focalMember)}
                className="relative w-18 h-21 flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-all"
                title={`${focalMember.name} (Membre central · Cliquez pour la vidéo)`}
              >
                <svg viewBox="0 0 100 115" className="absolute inset-0 w-full h-full pointer-events-none">
                  <polygon 
                    points="50,2 96,28 96,87 50,113 4,87 4,28" 
                    fill="#FFFFFF" 
                    stroke={focalMember.isFounder ? '#C85A32' : '#C89B3C'} 
                    strokeWidth="3.5"
                    strokeLinejoin="round"
                  />
                  {focalMember.isFounder && (
                    <polygon 
                      points="50,6 92,30 92,85 50,109 8,85 8,30" 
                      fill="none" 
                      stroke="#E07A5F" 
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                  )}
                </svg>
                <div 
                  className="w-[86%] h-[86%] overflow-hidden bg-stone-100"
                  style={{ clipPath: 'polygon(50% 2%, 96% 28%, 96% 72%, 50% 98%, 4% 72%, 4% 28%)' }}
                >
                  <img 
                    src={focalMember.photoUrl} 
                    alt={focalMember.name} 
                    referrerPolicy="no-referrer" 
                    className="w-full h-full object-cover" 
                  />
                </div>
              </button>
            )}

            {/* Nom épuré du membre central */}
            <div className="mt-2 text-center max-w-[240px]">
              <p className="text-xs font-bold text-stone-900 tracking-wide">
                {focalMember.name}
              </p>
            </div>
          </div>

          {/* ========================================================= */}
          {/* 3. BRANCHE HORIZONTALE EN T RELIANT LES 3 COOPTÉS         */}
          {/*    AVEC PAGINATION LATÉRALE GAUCHE/DROITE                 */}
          {/* ========================================================= */}
          <div className="relative w-full flex flex-col items-center mt-3 pt-6">
            {/* Tige verticale reliant le membre focal à la barre transversale */}
            <div 
              className="absolute top-0 left-1/2 -translate-x-1/2 w-[2.5px] h-6 bg-[#A2482B] pointer-events-none"
              style={{ boxShadow: '0 0 6px rgba(162, 72, 43, 0.35)' }}
            />

            {/* Barre horizontale transversale reliant les 3 enfants */}
            <div 
              className="absolute top-6 left-[14%] right-[14%] h-[2.5px] bg-[#A2482B] pointer-events-none rounded-full"
              style={{ boxShadow: '0 0 6px rgba(162, 72, 43, 0.35)' }}
            />

            {/* Boutons de navigation latérale ‹ et › si plus de 3 cooptés */}
            {totalDescendantPages > 1 && (
              <>
                <button
                  type="button"
                  disabled={descendantPageIndex === 0}
                  onClick={() => setDescendantPageIndex(prev => Math.max(0, prev - 1))}
                  className={`absolute top-3.5 left-1 z-30 w-7 h-7 rounded-full bg-white border border-stone-300 shadow-sm flex items-center justify-center transition-all ${
                    descendantPageIndex === 0 
                      ? 'opacity-30 cursor-not-allowed text-stone-400' 
                      : 'hover:bg-[#A2482B] hover:text-white hover:border-[#A2482B] cursor-pointer text-stone-700 active:scale-90'
                  }`}
                  title="Voir les 3 cooptés précédents"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  disabled={descendantPageIndex >= totalDescendantPages - 1}
                  onClick={() => setDescendantPageIndex(prev => Math.min(totalDescendantPages - 1, prev + 1))}
                  className={`absolute top-3.5 right-1 z-30 w-7 h-7 rounded-full bg-white border border-stone-300 shadow-sm flex items-center justify-center transition-all ${
                    descendantPageIndex >= totalDescendantPages - 1 
                      ? 'opacity-30 cursor-not-allowed text-stone-400' 
                      : 'hover:bg-[#A2482B] hover:text-white hover:border-[#A2482B] cursor-pointer text-stone-700 active:scale-90'
                  }`}
                  title="Voir les 3 cooptés suivants"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Indicateur de page discret */}
                <div className="absolute top-1 left-1/2 -translate-x-1/2 px-2 py-0.2 rounded-full bg-white border border-stone-200 text-[9px] font-medium text-stone-500 z-20">
                  {descendantPageIndex * PAGE_SIZE + 1}–{Math.min((descendantPageIndex + 1) * PAGE_SIZE, tree.descendants.length)} sur {tree.descendants.length}
                </div>
              </>
            )}

            {/* Les 3 Alvéoles côte à côte sur la même ligne */}
            <div className="relative z-10 grid grid-cols-3 gap-2 sm:gap-4 w-full px-2">
              {visibleDescendants.map((child, idx) => {
                const isSelected = expandedChildId === child.id;
                const isOrg = child.entityType === 'organization';
                const isHovered = hoveredMemberId === child.id;

                return (
                  <div 
                    key={`descendant-col-${child.id}-${idx}`}
                    className="relative flex flex-col items-center"
                    onMouseEnter={() => setHoveredMemberId(child.id)}
                    onMouseLeave={() => setHoveredMemberId(null)}
                  >
                    {/* Petite tige verticale descendante reliant la barre transversale à l'alvéole */}
                    <div 
                      className="absolute -top-6 left-1/2 -translate-x-1/2 w-[2.5px] h-6 bg-[#A2482B] pointer-events-none"
                      style={{ boxShadow: '0 0 4px rgba(162, 72, 43, 0.35)' }}
                    />

                    {/* Indication d'état : 1er clic = déployé / 2ème clic = vidéo */}
                    {isSelected && (
                      <div className="absolute -top-5 px-2 py-0.2 rounded-full bg-[#A2482B] text-white text-[9px] font-bold tracking-tight shadow-xs whitespace-nowrap animate-in fade-in z-20 flex items-center gap-0.5">
                        <span>2e clic : vidéo</span>
                      </div>
                    )}

                    {/* Médaillon Visuel (Hexagonal pour individu, Carré pour organisation) */}
                    <div className="relative mt-2 flex items-center justify-center">
                      {isSelected && (
                        <div 
                          className="absolute -inset-2.5 rounded-full pointer-events-none animate-pulse"
                          style={{
                            background: 'radial-gradient(circle, rgba(162, 72, 43, 0.35) 0%, transparent 70%)',
                            filter: 'blur(6px)'
                          }}
                        />
                      )}

                      {isOrg ? (
                        <button
                          type="button"
                          onClick={() => handleChildClick(child)}
                          className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl border-2 transition-all duration-200 cursor-pointer overflow-hidden bg-white shadow-xs ${
                            isSelected 
                              ? 'border-[#A2482B] scale-105 shadow-[0_0_12px_rgba(162,72,43,0.35)]' 
                              : 'border-[#A2482B]/80 hover:border-[#A2482B] hover:scale-105'
                          }`}
                          title={`${child.name} · 1er clic = révéler descendance / 2e clic = vidéo`}
                        >
                          <img 
                            src={child.photoUrl} 
                            alt={child.name} 
                            referrerPolicy="no-referrer" 
                            className="w-full h-full object-cover" 
                          />
                          <div className="absolute bottom-0.5 right-0.5 p-0.5 rounded-xs bg-black/75 text-amber-200">
                            <Sparkles className="w-2.5 h-2.5" />
                          </div>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleChildClick(child)}
                          className={`relative w-14 h-16 sm:w-16 sm:h-18 flex items-center justify-center transition-all duration-200 cursor-pointer ${
                            isSelected ? 'scale-105' : 'hover:scale-105'
                          }`}
                          title={`${child.name} · 1er clic = révéler descendance / 2e clic = vidéo`}
                        >
                          <svg viewBox="0 0 100 115" className="absolute inset-0 w-full h-full pointer-events-none">
                            <polygon 
                              points="50,2 96,28 96,87 50,113 4,87 4,28" 
                              fill="#FFFFFF" 
                              stroke={isSelected ? '#A2482B' : '#C46A4D'} 
                              strokeWidth={isSelected ? '3' : '2'}
                              strokeLinejoin="round"
                            />
                            {isSelected && (
                              <polygon 
                                points="50,6 92,30 92,85 50,109 8,85 8,30" 
                                fill="none" 
                                stroke="#E07A5F" 
                                strokeWidth="1.5"
                                strokeLinejoin="round"
                              />
                            )}
                          </svg>
                          <div 
                            className="w-[84%] h-[84%] overflow-hidden bg-stone-100"
                            style={{ clipPath: 'polygon(50% 2%, 96% 28%, 96% 72%, 50% 98%, 4% 72%, 4% 28%)' }}
                          >
                            <img 
                              src={child.photoUrl} 
                              alt={child.name} 
                              referrerPolicy="no-referrer" 
                              className="w-full h-full object-cover" 
                            />
                          </div>
                        </button>
                      )}
                    </div>

                    {/* Uniquement le Nom épuré sans étiquettes alourdissantes */}
                    <div className="mt-1 text-center w-full max-w-[110px] px-1">
                      <p className={`text-[11px] font-bold truncate leading-tight ${isSelected ? 'text-[#A2482B]' : 'text-stone-800'}`}>
                        {child.firstName || child.name.split(' ')[0]}
                      </p>
                    </div>

                    {/* Flèche subtile vers le bas si sélectionné */}
                    {isSelected && (
                      <div className="mt-1 text-[#A2482B] animate-bounce">
                        <ChevronDown className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ========================================================= */}
          {/* 4. SOUS-BRANCHE RÉVÉLÉE AU CLIC D'UN ENFANT (ÉTAGE 2)     */}
          {/*    AVEC NAVIGATION LATÉRALE SI NÉCESSAIRE                 */}
          {/* ========================================================= */}
          {expandedChildId && expandedChildDescendants.length > 0 && (
            <div className="relative w-full flex flex-col items-center mt-6 pt-6 animate-in fade-in slide-in-from-top-2 duration-300">
              {/* Ligne verticale de transition vers le sous-niveau */}
              <div 
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-6 bg-[#A2482B] pointer-events-none"
                style={{ boxShadow: '0 0 4px rgba(162, 72, 43, 0.35)' }}
              />

              {/* Barre transversale pour les petits-enfants */}
              <div 
                className="absolute top-6 left-[16%] right-[16%] h-[2px] bg-[#A2482B] pointer-events-none rounded-full"
                style={{ boxShadow: '0 0 4px rgba(162, 72, 43, 0.35)' }}
              />

              {/* Titre discret de la branche déployée */}
              <div className="mb-2 px-3 py-0.5 rounded-full bg-white border border-stone-200 text-[10px] text-stone-600 font-semibold z-10 shadow-2xs">
                Descendance de {resolveChildName(expandedChildId, tree.descendants)}
              </div>

              {/* Flèches latérales pour les petits-enfants si > 3 */}
              {totalGrandchildPages > 1 && (
                <>
                  <button
                    type="button"
                    disabled={grandchildPageIndex === 0}
                    onClick={() => setGrandchildPageIndex(prev => Math.max(0, prev - 1))}
                    className={`absolute top-4 left-1 z-30 w-6 h-6 rounded-full bg-white border border-stone-300 shadow-2xs flex items-center justify-center transition-all ${
                      grandchildPageIndex === 0 
                        ? 'opacity-30 cursor-not-allowed text-stone-400' 
                        : 'hover:bg-[#A2482B] hover:text-white cursor-pointer text-stone-700'
                    }`}
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={grandchildPageIndex >= totalGrandchildPages - 1}
                    onClick={() => setGrandchildPageIndex(prev => Math.min(totalGrandchildPages - 1, prev + 1))}
                    className={`absolute top-4 right-1 z-30 w-6 h-6 rounded-full bg-white border border-stone-300 shadow-2xs flex items-center justify-center transition-all ${
                      grandchildPageIndex >= totalGrandchildPages - 1 
                        ? 'opacity-30 cursor-not-allowed text-stone-400' 
                        : 'hover:bg-[#A2482B] hover:text-white cursor-pointer text-stone-700'
                    }`}
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </>
              )}

              {/* Les 3 petits-enfants sur la ligne inférieure */}
              <div className="relative z-10 grid grid-cols-3 gap-2 sm:gap-4 w-full px-2">
                {visibleGrandchildren.map((grandchild, gIdx) => {
                  const isGrandchildSelected = expandedGrandchildId === grandchild.id;
                  const isOrg = grandchild.entityType === 'organization';

                  return (
                    <div 
                      key={`grandchild-col-${grandchild.id}-${gIdx}`}
                      className="relative flex flex-col items-center"
                    >
                      {/* Ligne verticale de raccord */}
                      <div 
                        className="absolute -top-6 left-1/2 -translate-x-1/2 w-[2px] h-6 bg-[#A2482B] pointer-events-none"
                      />

                      {/* Médaillon petit-enfant */}
                      {isOrg ? (
                        <button
                          type="button"
                          onClick={() => handleGrandchildClick(grandchild)}
                          className={`relative w-12 h-12 rounded-xl border-2 transition-all duration-200 cursor-pointer overflow-hidden bg-white shadow-2xs ${
                            isGrandchildSelected ? 'border-[#A2482B] scale-105' : 'border-[#A2482B]/70 hover:scale-105'
                          }`}
                          title={`${grandchild.name} · 1er clic = déployer / 2e clic = vidéo`}
                        >
                          <img 
                            src={grandchild.photoUrl} 
                            alt={grandchild.name} 
                            referrerPolicy="no-referrer" 
                            className="w-full h-full object-cover" 
                          />
                          <div className="absolute bottom-0.5 right-0.5 p-0.5 rounded-xs bg-black/75 text-amber-200">
                            <Sparkles className="w-2 h-2" />
                          </div>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleGrandchildClick(grandchild)}
                          className={`relative w-12 h-14 flex items-center justify-center transition-all duration-200 cursor-pointer ${
                            isGrandchildSelected ? 'scale-105' : 'hover:scale-105'
                          }`}
                          title={`${grandchild.name} · 1er clic = déployer / 2e clic = vidéo`}
                        >
                          <svg viewBox="0 0 100 115" className="absolute inset-0 w-full h-full pointer-events-none">
                            <polygon 
                              points="50,2 96,28 96,87 50,113 4,87 4,28" 
                              fill="#FFFFFF" 
                              stroke={isGrandchildSelected ? '#A2482B' : '#C46A4D'} 
                              strokeWidth="2"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <div 
                            className="w-[84%] h-[84%] overflow-hidden bg-stone-100"
                            style={{ clipPath: 'polygon(50% 2%, 96% 28%, 96% 72%, 50% 98%, 4% 72%, 4% 28%)' }}
                          >
                            <img 
                              src={grandchild.photoUrl} 
                              alt={grandchild.name} 
                              referrerPolicy="no-referrer" 
                              className="w-full h-full object-cover" 
                            />
                          </div>
                        </button>
                      )}

                      {/* Uniquement le Nom épuré */}
                      <div className="mt-1 text-center w-full max-w-[100px] px-1">
                        <p className="text-[10px] font-bold text-stone-800 truncate leading-tight">
                          {grandchild.firstName || grandchild.name.split(' ')[0]}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ========================================================= */}
      {/* MODALE VIDÉO FORMAT HÉRITAGE AU 2ÈME CLIC                 */}
      {/* (SANS ICÔNE D'ÉVALUATION · RÉSERVÉE AU CASTING)            */}
      {/* ========================================================= */}
      {videoModalMember && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
          onClick={() => {
            setVideoModalMember(null);
            setIsQuestionModalOpen(false);
          }}
        >
          {/* Bouton Fermer la modale en haut à droite */}
          <button
            type="button"
            id="btn-close-lineage-video-modal"
            onClick={(e) => {
              e.stopPropagation();
              setVideoModalMember(null);
              setIsPlaying(false);
              setIsQuestionModalOpen(false);
            }}
            className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-[#A2482B] text-white backdrop-blur-md border border-white/20 hover:border-[#A2482B] flex items-center justify-center transition-all cursor-pointer shadow-xl hover:scale-105 active:scale-95 shrink-0"
            title="Fermer"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          <div 
            className="h-[min(490px,calc(100dvh-210px))] sm:h-[min(540px,calc(100dvh-190px))] lg:h-[min(570px,calc(100dvh-180px))] aspect-[9/16] w-auto mx-auto rounded-3xl overflow-hidden bg-stone-950 text-white shadow-2xl border border-stone-200/40 relative flex flex-col justify-between p-4 sm:p-5 select-none shrink-0 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Poster de fond */}
            <img
              src={videoModalMember.photoUrl}
              alt={videoModalMember.name}
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />

            {/* Vidéo de fond */}
            <video
              ref={videoRef}
              src={videoModalMember.teaserVideoUrl || 'https://assets.mixkit.co/videos/preview/mixkit-african-potter-working-with-clay-41551-large.mp4'}
              poster={videoModalMember.photoUrl}
              autoPlay
              loop
              playsInline
              muted={isMuted}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 pointer-events-none ${
                isPlaying ? 'opacity-100' : 'opacity-0'
              }`}
            />

            {/* Gradient sombre pour lisibilité cinématographique */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/65 pointer-events-none" />

            {/* Haut de carte : Son et Pause */}
            <div 
              className="relative z-20 flex items-center justify-end gap-1.5 w-full pointer-events-auto"
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
            >
              {isPlaying && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsMuted((prev) => !prev);
                  }}
                  className="w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-full bg-black/50 hover:bg-[#A2482B] backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
                  title={isMuted ? 'Activer le son' : 'Couper le son'}
                >
                  {isMuted ? <VolumeX className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" /> : <Volume2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />}
                </button>
              )}

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  togglePlayback();
                }}
                className="w-8.5 h-8.5 sm:w-9.5 sm:h-9.5 rounded-lg sm:rounded-xl bg-black/45 hover:bg-[#A2482B] backdrop-blur-md border border-white/20 hover:border-[#A2482B] flex items-center justify-center text-white transition-all duration-200 shadow-md cursor-pointer hover:scale-105 active:scale-95 shrink-0"
                title={isPlaying ? "Mettre en pause" : "Regarder"}
              >
                {isPlaying ? (
                  <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white text-white" />
                ) : (
                  <TvPlayerIcon className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-white" strokeWidth={1.6} />
                )}
              </button>
            </div>

            {/* Flanc droit : 3 icônes d'action (SANS icône évaluation) */}
            <div 
              onClick={(e) => e.stopPropagation()}
              className="absolute right-3 sm:right-3.5 top-[60%] -translate-y-1/2 z-20 flex flex-col items-center gap-2.5 sm:gap-3 pointer-events-auto"
            >
              {/* 1. Question existentielle */}
              <button
                id={`lineage-btn-question-${videoModalMember.id}`}
                onClick={() => setIsQuestionModalOpen(true)}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-black/45 hover:bg-[#A2482B] backdrop-blur-md border border-white/20 hover:border-[#A2482B] text-white flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer hover:scale-105 active:scale-95"
                title="Découvrir la question"
              >
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </button>

              {/* 2. Découvrir son profil complet (Individu) OU son espace Lumières (Organisation) */}
              <button
                id={`lineage-btn-profile-${videoModalMember.id}`}
                onClick={() => {
                  const isOrg = videoModalMember.entityType === 'organization';
                  const targetId = isOrg ? (videoModalMember.organizationId || videoModalMember.id) : videoModalMember.id;
                  setVideoModalMember(null);
                  if (isOrg) {
                    if (onNavigate) {
                      onNavigate({ type: 'enterprise', selectedCompanyId: targetId });
                    } else {
                      onNavigateToPerson(targetId);
                    }
                  } else {
                    if (onNavigate) {
                      onNavigate({ type: 'protagonist_profile', protagonistId: targetId });
                    } else {
                      onNavigateToPerson(targetId);
                    }
                  }
                }}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-black/45 hover:bg-[#A2482B] backdrop-blur-md border border-white/20 hover:border-[#A2482B] text-white flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer hover:scale-105 active:scale-95"
                title={
                  videoModalMember.entityType === 'organization' 
                    ? `Découvrir la mise en lumière de ${videoModalMember.name}` 
                    : `Découvrir le portrait de ${videoModalMember.name}`
                }
              >
                {videoModalMember.entityType === 'organization' ? (
                  <Sparkles className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-amber-300" />
                ) : (
                  <ProfileSoloIcon className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-white" />
                )}
              </button>

              {/* 3. Bouton Partager */}
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: videoModalMember.name,
                      text: `Découvrez la lignée de ${videoModalMember.name} sur YonyWood`,
                      url: window.location.href,
                    }).catch(() => {});
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }
                }}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl border flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95 ${
                  copied
                    ? 'bg-emerald-700/85 border-emerald-600 text-white'
                    : 'bg-black/45 hover:bg-[#A2482B] border-white/20 text-white'
                }`}
                title="Partager ce témoignage"
              >
                {copied ? <Check className="w-4 h-4 text-white" /> : <ShareIcon className="w-4 h-4 text-white" />}
              </button>
            </div>

            {/* Bas de carte */}
            <div className="relative z-10 pt-2 mt-auto flex items-end justify-between gap-2 pointer-events-auto">
              <div className="space-y-0.5">
                <h3 className="font-editorial text-[15px] sm:text-base font-bold text-white tracking-wider leading-snug drop-shadow-md">
                  {videoModalMember.entityType === 'organization' ? videoModalMember.name : (videoModalMember.firstName || videoModalMember.name.split(' ')[0])}
                </h3>
                {videoModalMember.entityType === 'organization' && (
                  <p className="text-[11px] text-amber-300 font-medium tracking-wide drop-shadow-xs flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    <span>Lumières · Organisation mise en lumière</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Volet modal des crédits & générique de la séquence */}
          <SequenceCreditsModal
            isOpen={isCreditsModalOpen}
            onClose={() => setIsCreditsModalOpen(false)}
            title={videoModalMember.name}
            seriesTitle="Lignée & Transmission"
            credits={getSeriesCredits(videoModalMember.seriesId || 'jesus-legba', videoModalMember.name)}
            onNavigateToProfile={(protagonistId) => {
              setIsCreditsModalOpen(false);
              setVideoModalMember(null);
              onNavigateToPerson(protagonistId);
            }}
          />

          {/* Modale Question existentielle */}
          {isQuestionModalOpen && (
            <div 
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
              onClick={(e) => {
                e.stopPropagation();
                setIsQuestionModalOpen(false);
              }}
            >
              <div 
                className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-stone-200 text-center animate-in zoom-in-95 duration-200 pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => setIsQuestionModalOpen(false)}
                  className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="w-12 h-12 rounded-full bg-[#C89B3C]/15 text-[#C89B3C] flex items-center justify-center mx-auto mb-4 border border-[#C89B3C]/30">
                  <BookOpen className="w-6 h-6" />
                </div>

                <h3 className="font-editorial text-base sm:text-lg font-bold text-[#1C1917] mb-2">
                  {videoModalMember.firstName || videoModalMember.name.split(' ')[0]} a répondu :
                </h3>

                <p className="font-sans text-xs sm:text-sm font-semibold text-stone-600 mb-4 px-2">
                  « {videoModalMember.questionAnswered?.question || "Quelle vision singulière ce parcours apporte-t-il au monde ?"} »
                </p>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 text-left">
                  <p className="font-serif-editorial text-sm sm:text-base text-stone-800 leading-relaxed italic">
                    « {videoModalMember.questionAnswered?.answer || videoModalMember.quote || "Chaque être lié à la lignée nourrit la sève commune."} »
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

function resolveChildName(childId: string, list: LineageMember[]): string {
  const found = list.find(c => c.id === childId);
  if (!found) return 'Membre';
  return found.firstName || found.name.split(' ')[0];
}
