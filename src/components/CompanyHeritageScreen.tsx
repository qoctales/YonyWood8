import React, { useState, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause,
  Volume2, 
  VolumeX, 
  X,
  Compass,
  Layers,
  LayoutGrid,
  Check,
  Award,
  BookOpen,
  ArrowUpDown
} from 'lucide-react';
import { ShareIcon } from './ShareIcon';
import { ResonanceModal } from './ResonanceModal';
import { ProfileSoloIcon, TvPlayerIcon } from './YonywoodBrandIcons';
import { ViewScreen } from '../types';
import { CompanyEntity, CompanyStakeholder, COMPANIES_DATA } from '../data/companyPortraitsData';
import { PortraitsCircleView } from './PortraitsCircleView';
import { UnifiedVideoCardOverlay } from './UnifiedVideoCardOverlay';
import { celestialAudio } from '../utils/celestialAudio';

export type { CompanyStakeholder, CompanyEntity };
export { COMPANIES_DATA };


interface CompanyHeritageScreenProps {
  onNavigate?: (screen: ViewScreen) => void;
}

export const CompanyHeritageScreen: React.FC<CompanyHeritageScreenProps> = ({ onNavigate }) => {
  // Mode de navigation : 'circle' (par défaut) ou 'swipe'
  const [viewMode, setViewMode] = useState<'circle' | 'swipe'>('circle');

  // Navigation Niveau 1 (Entreprises globales)
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Navigation Niveau 2 (Espace de l'entreprise dédié)
  const [selectedCompanyForSpace, setSelectedCompanyForSpace] = useState<CompanyEntity | null>(null);
  const [stakeholderIdx, setStakeholderIdx] = useState(0);
  const [isStakeholderPlaying, setIsStakeholderPlaying] = useState(false);
  const [isStakeholderMuted, setIsStakeholderMuted] = useState(false);

  // Modales d'interaction pour les témoins & entreprises
  const [resonanceTargetCompany, setResonanceTargetCompany] = useState<CompanyEntity | null>(null);
  const [companyResonances, setCompanyResonances] = useState<Record<string, number>>({});
  const [resonanceTargetStakeholder, setResonanceTargetStakeholder] = useState<CompanyStakeholder | null>(null);
  const [stakeholderResonances, setStakeholderResonances] = useState<Record<string, number>>({});
  const [questionModalStakeholder, setQuestionModalStakeholder] = useState<CompanyStakeholder | null>(null);

  // Partage
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Swipe tactile
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const stakeholderVideoRef = useRef<HTMLVideoElement | null>(null);

  const currentCompany = COMPANIES_DATA[currentIdx];
  const activeStakeholders = selectedCompanyForSpace ? selectedCompanyForSpace.stakeholders : [];
  const currentStakeholder = activeStakeholders[stakeholderIdx] || activeStakeholders[0];

  // Gestion des swipes Niveau 1
  const handlePrev = () => {
    setIsPlaying(false);
    setCurrentIdx((prev) => (prev - 1 + COMPANIES_DATA.length) % COMPANIES_DATA.length);
  };

  const handleNext = () => {
    setIsPlaying(false);
    setCurrentIdx((prev) => (prev + 1) % COMPANIES_DATA.length);
  };

  // Gestion des swipes Niveau 2 (Stakeholders)
  const handlePrevStakeholder = () => {
    if (!activeStakeholders.length) return;
    setIsStakeholderPlaying(false);
    setStakeholderIdx((prev) => (prev - 1 + activeStakeholders.length) % activeStakeholders.length);
  };

  const handleNextStakeholder = () => {
    if (!activeStakeholders.length) return;
    setIsStakeholderPlaying(false);
    setStakeholderIdx((prev) => (prev + 1) % activeStakeholders.length);
  };

  const handleShare = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const url = selectedCompanyForSpace 
      ? `${window.location.origin}?company=${selectedCompanyForSpace.id}&speaker=${currentStakeholder.id}`
      : `${window.location.origin}?company=${currentCompany.id}`;
    navigator.clipboard?.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (touchStartXRef.current !== null && touchEndXRef.current !== null) {
      const diff = touchEndXRef.current - touchStartXRef.current;
      if (diff > 45) {
        if (selectedCompanyForSpace) {
          handlePrevStakeholder();
        } else {
          handlePrev();
        }
      } else if (diff < -45) {
        if (selectedCompanyForSpace) {
          handleNextStakeholder();
        } else {
          handleNext();
        }
      }
    }
    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  return (
    <div 
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className="w-full max-w-3xl mx-auto px-3 sm:px-6 py-2 pb-24 sm:pb-28 pt-safe pb-safe h-full max-h-full overflow-hidden flex flex-col justify-between text-[#1C1917] select-none"
    >
      
      {/* =========================================================== */}
      {/* EN-TÊTE HARMONISÉ : TITRE LUMIÈRE & BASCULE (MODE SWIPE UNIQUEMENT) */}
      {/* (En mode Cercle, PortraitsCircleView intègre son propre en-tête unique pour éviter tout dédoublement) */}
      {/* =========================================================== */}
      {viewMode === 'swipe' && (
        <div className="relative flex items-center justify-between h-9 sm:h-10 shrink-0 gap-2 mb-1">
          {selectedCompanyForSpace ? (
            <div className="flex items-center gap-1.5 sm:gap-2 h-full">
              <button
                onClick={() => {
                  setSelectedCompanyForSpace(null);
                  setIsStakeholderPlaying(false);
                }}
                className="font-normal text-stone-500 hover:text-stone-900 transition-colors cursor-pointer flex items-center gap-1 group py-1"
                title="Revenir à Lumières"
              >
                <ChevronLeft className="w-4 h-4 text-stone-400 group-hover:text-stone-700 group-hover:-translate-x-0.5 transition-transform" />
                <span>Lumières</span>
              </button>
              <span className="text-stone-300 font-light text-xs" aria-hidden="true">
                ›
              </span>
              <div className="relative flex items-center h-full">
                <span
                  className="font-editorial text-base sm:text-lg font-bold text-[#1C1917] tracking-tight truncate max-w-[150px] sm:max-w-[260px]"
                  aria-current="page"
                >
                  {selectedCompanyForSpace.companyName}
                </span>
                {/* Petit trait terracotta officiel */}
                <div className="absolute left-0 -bottom-1.5 w-8 h-0.5 bg-[#A2482B] rounded-full" />
              </div>
            </div>
          ) : (
            <div className="relative flex items-center h-full overflow-visible">
              <h1 className="font-editorial italic text-xs sm:text-sm md:text-base font-bold text-[#1C1917] tracking-tight leading-none whitespace-nowrap pr-2">
                Une histoire commune, plusieurs regards
              </h1>
              {/* Petit trait terracotta officiel */}
              <div className="absolute left-0 -bottom-1.5 w-8 h-0.5 bg-[#A2482B] rounded-full" />
            </div>
          )}

          {/* Bascule vers Mode Cercle avec son noble celestialAudio */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              id="btn-toggle-portraits-circle"
              onClick={() => {
                setViewMode('circle');
                celestialAudio.playOrbSelect();
              }}
              className="flex items-center gap-1.5 h-6.5 sm:h-7 px-3 rounded-full bg-[#A2482B] hover:bg-[#8A3B22] text-white text-[10.5px] sm:text-[11px] font-semibold transition-all cursor-pointer shadow-2xs shrink-0 active:scale-95"
              title="Revenir au mode Cercle"
            >
              <LayoutGrid className="w-3 h-3 text-white" />
              <span>Cercle</span>
            </button>
          </div>
        </div>
      )}

      {/* =========================================================== */}
      {/* VUE PRINCIPALE : MODE CERCLE OU CARTE VIDÉO 9:16           */}
      {/* =========================================================== */}
      {viewMode === 'circle' ? (
        <div className="relative w-full flex-1 flex flex-col min-h-0">
          <PortraitsCircleView 
            companies={COMPANIES_DATA} 
            selectedCompanyId={selectedCompanyForSpace?.id}
            onSelectCompany={(org) => setSelectedCompanyForSpace(org)}
            onNavigate={onNavigate}
            topRightAction={
              <button
                id="btn-toggle-portraits-swipe"
                onClick={() => {
                  setViewMode('swipe');
                  celestialAudio.playOrbSelect();
                }}
                className="flex items-center gap-1.5 h-6.5 sm:h-7 px-3 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-stone-900 border border-stone-200/90 text-[10.5px] sm:text-[11px] font-semibold transition-all cursor-pointer shadow-2xs shrink-0 active:scale-95"
                title="Passer en mode Swipe"
              >
                <Layers className="w-3 h-3 text-[#A2482B]" />
                <span>Swipe</span>
              </button>
            }
          />
        </div>
      ) : (
        <div className="relative w-full flex-1 flex items-center justify-center min-h-0 my-auto">
        
        {/* ========================================================= */}
        {/* CAS 1 : VUE GLOBALE DES ENTREPRISES (NIVEAU 1)            */}
        {/* ========================================================= */}
        {!selectedCompanyForSpace && (
          <>
            {/* Flèche gauche */}
            <button
              onClick={handlePrev}
              className="absolute left-1 sm:left-3 md:left-6 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white text-stone-800 hover:bg-[#A2482B] hover:text-white border border-stone-200 shadow-md flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
              title="Entreprise précédente"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* CARTE VIDÉO ENTREPRISE 9:16 (Même gabarit standardisé) */}
            <div 
              onClick={() => {
                setIsPlaying(!isPlaying);
              }}
              className="h-[min(480px,calc(100dvh-230px))] sm:h-[min(520px,calc(100dvh-210px))] lg:h-[min(550px,calc(100dvh-200px))] aspect-[9/16] w-auto mx-auto rounded-3xl overflow-hidden bg-stone-950 text-white shadow-2xl border border-stone-200/40 relative flex flex-col justify-between p-3.5 sm:p-4.5 cursor-pointer group select-none shrink-0"
            >
              {/* Media de fond : Vidéo ou Image */}
              {isPlaying ? (
                <video
                  ref={videoRef}
                  src={currentCompany.videoUrl}
                  autoPlay
                  loop
                  playsInline
                  muted={isMuted}
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                />
              ) : (
                <img
                  src={currentCompany.photoUrl}
                  alt={currentCompany.companyName}
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none group-hover:scale-103 transition-transform duration-500 ease-out"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/45 pointer-events-none" />

              {/* Overlay standardisé : domaine d'activité en haut à gauche, nom d'entreprise en bas à gauche, 5 boutons harmonisés */}
              <UnifiedVideoCardOverlay
                titleBadge={currentCompany.category}
                displayName={currentCompany.companyName}
                preserveFullName={true}
                isPlaying={isPlaying}
                onTogglePlay={() => setIsPlaying(prev => !prev)}
                isMuted={isMuted}
                onToggleMute={() => setIsMuted(prev => !prev)}
                questionText={currentCompany.manifestoQuestion}
                factText={`${currentCompany.tagline} — ${currentCompany.description}`}
                onOpenProfile={() => {
                  setSelectedCompanyForSpace(currentCompany);
                  setStakeholderIdx(0);
                  setIsStakeholderPlaying(false);
                }}
                onShare={handleShare}
                isShareCopied={copied}
                onReportVideo={() => {
                  setToastMessage('Vidéo signalée à la modération.');
                  setTimeout(() => setToastMessage(null), 2500);
                }}
                onBlockVideo={() => {
                  setToastMessage('Cette entreprise a été masquée.');
                  setTimeout(() => setToastMessage(null), 2500);
                }}
              />
            </div>

            {/* Flèche droite */}
            <button
              onClick={handleNext}
              className="absolute right-1 sm:right-3 md:right-6 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white text-stone-800 hover:bg-[#A2482B] hover:text-white border border-stone-200 shadow-md flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
              title="Entreprise suivante"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </>
        )}

        {/* ========================================================= */}
        {/* CAS 2 : ESPACE DÉDIÉ DE L'ENTREPRISE (NIVEAU 2)           */}
        {/* ========================================================= */}
        {selectedCompanyForSpace && currentStakeholder && (
          <>
            {/* Flèche gauche pour défiler les voix de l'entreprise */}
            <button
              onClick={handlePrevStakeholder}
              className="absolute left-1 sm:left-3 md:left-6 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white text-stone-800 hover:bg-[#A2482B] hover:text-white border border-stone-200 shadow-md flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
              title="Témoignage précédent"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* CARTE VIDÉO DU TÉMOIN 9:16 (Même gabarit que Studio) */}
            <div 
              onClick={() => {
                setIsStakeholderPlaying(!isStakeholderPlaying);
              }}
              className="group relative rounded-2xl sm:rounded-3xl overflow-hidden bg-[#151513] text-white shadow-2xl border border-stone-200/40 flex flex-col justify-between 
                aspect-[9/16] 
                w-[min(calc(100vw-32px),calc((100dvh-200px)*9/16))] 
                max-w-[280px] sm:max-w-[290px] 
                h-[min(500px,calc(100dvh-200px))] 
                mx-auto shrink-0 transition-all duration-300 cursor-pointer select-none"
            >
              {/* Média de fond : Vidéo ou Photo */}
              {isStakeholderPlaying ? (
                <video
                  ref={stakeholderVideoRef}
                  src={currentStakeholder.videoUrl}
                  autoPlay
                  loop
                  playsInline
                  muted={isStakeholderMuted}
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                />
              ) : (
                <img
                  src={currentStakeholder.photoUrl}
                  alt={currentStakeholder.name}
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none group-hover:scale-103 transition-transform duration-500 ease-out"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/65 pointer-events-none" />

              {/* Overlay standardisé : alignement vertical strict, 6 actions, pas de croix, titre en haut à gauche et prénom épuré en bas à gauche */}
              <UnifiedVideoCardOverlay
                titleBadge={selectedCompanyForSpace.companyName}
                displayName={currentStakeholder.name}
                isPlaying={isStakeholderPlaying}
                onTogglePlay={() => setIsStakeholderPlaying(prev => !prev)}
                isMuted={isStakeholderMuted}
                onToggleMute={() => setIsStakeholderMuted(prev => !prev)}
                questionText={currentStakeholder.question}
                factText={`${currentStakeholder.roleCategory} : ${currentStakeholder.roleDetail || 'partenaire de transmission et d’action territoriale'}`}
                onOpenProfile={() => {
                  if (onNavigate) {
                    onNavigate({ type: 'profile' });
                  }
                }}
                onShare={handleShare}
                isShareCopied={copied}
                onReportVideo={() => {
                  setToastMessage('Vidéo signalée à la modération.');
                  setTimeout(() => setToastMessage(null), 2500);
                }}
                onBlockVideo={() => {
                  setToastMessage('Cette vidéo a été masquée.');
                  setTimeout(() => setToastMessage(null), 2500);
                }}
              />
            </div>

            {/* Flèche droite pour défiler les voix de l'entreprise */}
            <button
              onClick={handleNextStakeholder}
              className="absolute right-1 sm:right-3 md:right-6 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white text-stone-800 hover:bg-[#A2482B] hover:text-white border border-stone-200 shadow-md flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
              title="Témoignage suivant"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </>
        )}

      </div>
      )}

      {/* Modale d'évaluation de la résonance pour les voix de l'entreprise */}
      {resonanceTargetStakeholder && (
        <ResonanceModal
          isOpen={Boolean(resonanceTargetStakeholder)}
          onClose={() => setResonanceTargetStakeholder(null)}
          storyId={`company-${selectedCompanyForSpace?.id || 'co'}-${resonanceTargetStakeholder.id}`}
          topicId={`Entreprise · ${selectedCompanyForSpace?.companyName}`}
          personName={resonanceTargetStakeholder.name.split(' ')[0]}
          initialPercentage={stakeholderResonances[resonanceTargetStakeholder.id]}
          onRatingSubmitted={(pct) => {
            setStakeholderResonances(prev => ({ ...prev, [resonanceTargetStakeholder.id]: pct }));
          }}
        />
      )}

      {/* Modale Question existentielle pour les voix de l'entreprise */}
      {questionModalStakeholder && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setQuestionModalStakeholder(null)}
        >
          <div 
            className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-stone-200 text-center animate-in zoom-in-95 duration-200 pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setQuestionModalStakeholder(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-full bg-[#C89B3C]/15 text-[#C89B3C] flex items-center justify-center mx-auto mb-4 border border-[#C89B3C]/30">
              <BookOpen className="w-6 h-6" />
            </div>

            <h3 className="font-editorial text-base sm:text-lg font-bold text-[#1C1917] mb-1">
              {questionModalStakeholder.name.split(' ')[0]}
            </h3>
            <p className="text-xs text-stone-500 font-semibold mb-3">
              {questionModalStakeholder.roleCategory} · {selectedCompanyForSpace?.companyName}
            </p>

            <p className="font-serif-editorial text-base sm:text-lg text-stone-800 leading-relaxed italic px-2">
              « {questionModalStakeholder.question || "Quelle vision singulière ce parcours apporte-t-il au monde ?"} »
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
