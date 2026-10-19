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
  Check,
  Award,
  BookOpen
} from 'lucide-react';
import { ShareIcon } from './ShareIcon';
import { ResonanceModal } from './ResonanceModal';
import { ProfileSoloIcon, TvPlayerIcon } from './YonywoodBrandIcons';
import { ViewScreen } from '../types';
import { 
  CompanyStakeholder, 
  CompanyEntity, 
  COMPANIES_DATA 
} from '../data/companyPortraitsData';
import { PortraitsCircleView } from './PortraitsCircleView';

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

  // Modales d'interaction pour les témoins
  const [resonanceTargetStakeholder, setResonanceTargetStakeholder] = useState<CompanyStakeholder | null>(null);
  const [stakeholderResonances, setStakeholderResonances] = useState<Record<string, number>>({});
  const [questionModalStakeholder, setQuestionModalStakeholder] = useState<CompanyStakeholder | null>(null);

  // Partage
  const [copied, setCopied] = useState(false);

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
      {/* EN-TÊTE : Titre standardisé ou Barre retour Espace Société   */}
      {/* =========================================================== */}
      {selectedCompanyForSpace ? (
        <div className="flex items-center justify-between h-8 sm:h-9 shrink-0 gap-2 mb-1.5 sm:mb-2">
          <button
            onClick={() => {
              setSelectedCompanyForSpace(null);
              setIsStakeholderPlaying(false);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 hover:bg-[#A2482B] text-stone-700 hover:text-white border border-stone-200 transition-all text-xs font-semibold cursor-pointer shadow-xs group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Entreprises</span>
          </button>

          <div className="relative flex items-center h-full shrink-0">
            <h2 className="font-editorial text-sm sm:text-base font-bold text-[#1C1917] tracking-wider">
              {selectedCompanyForSpace.companyName}
            </h2>
            <div className="absolute left-0 -bottom-2 w-8 h-0.5 bg-[#A2482B] rounded-full" />
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between h-8 sm:h-9 shrink-0 gap-2 mb-1.5 sm:mb-2">
          <div className="relative flex items-center h-full shrink-0">
            <h1 className="font-editorial text-base sm:text-[18px] font-bold text-[#1C1917] tracking-tight leading-none">
              Portraits
            </h1>
            <div className="absolute left-0 -bottom-2 w-8 h-0.5 bg-[#A2482B] rounded-full" />
          </div>

          {/* SÉLECTEUR DE MODE [ CERCLE | SWIPE ] */}
          <div className="flex items-center bg-stone-100 p-0.5 rounded-full border border-stone-200 shadow-2xs">
            <button
              onClick={() => {
                setViewMode('circle');
                setIsPlaying(false);
                setIsStakeholderPlaying(false);
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'circle'
                  ? 'bg-[#A2482B] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Mode Cercle officiel des 16 organisations"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Cercle</span>
            </button>
            <button
              onClick={() => {
                setViewMode('swipe');
                setIsPlaying(false);
                setIsStakeholderPlaying(false);
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'swipe'
                  ? 'bg-[#A2482B] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Mode Cartes défilantes"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Swipe</span>
            </button>
          </div>
        </div>
      )}

      {/* =========================================================== */}
      {/* VUE PRINCIPALE : MODE CERCLE OU CARTE VIDÉO 9:16           */}
      {/* =========================================================== */}
      {viewMode === 'circle' ? (
        <div className="relative w-full flex-1 flex flex-col items-center justify-between min-h-0 my-auto">
          <PortraitsCircleView 
            companies={COMPANIES_DATA} 
            selectedCompanyId={selectedCompanyForSpace?.id}
            onSelectCompany={(org) => setSelectedCompanyForSpace(org)}
            onNavigate={onNavigate}
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

            {/* CARTE VIDÉO ENTREPRISE 9:16 (Même gabarit que Studio) */}
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

              {/* =========================================================== */}
              {/* HAUT DE CARTE : DOMAINE EN TITRE À GAUCHE & LECTEUR VIDÉO EN HAUT À DROITE */}
              {/* =========================================================== */}
              <div className="relative z-20 flex items-center justify-between w-full pointer-events-auto">
                <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[10.5px] sm:text-xs font-bold text-white tracking-wider uppercase drop-shadow-sm truncate inline-block">
                  {currentCompany.category}
                </span>

                {/* Lecteur vidéo vintage officiel TvPlayerIcon en haut à droite */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsPlaying(prev => !prev);
                  }}
                  className="w-8.5 h-8.5 sm:w-9.5 sm:h-9.5 rounded-xl bg-black/50 hover:bg-[#A2482B] backdrop-blur-md border border-white/20 hover:border-[#A2482B] flex items-center justify-center text-white transition-all duration-200 shadow-md cursor-pointer hover:scale-105 active:scale-95 shrink-0"
                  title={isPlaying ? "Mettre en pause" : `Regarder la vidéo de ${currentCompany.companyName}`}
                >
                  {isPlaying ? (
                    <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white text-white" />
                  ) : (
                    <TvPlayerIcon className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-white transition-transform" strokeWidth={1.6} />
                  )}
                </button>
              </div>

              {/* =========================================================== */}
              {/* FLANC DROIT : EXPLORER L'UNIVERS & PARTAGER                 */}
              {/* =========================================================== */}
              <div 
                onClick={(e) => e.stopPropagation()}
                className="absolute right-3 sm:right-3.5 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3 pointer-events-auto"
              >
                {/* 1. Découvrir l'univers de l'entreprise */}
                <button
                  onClick={() => {
                    setSelectedCompanyForSpace(currentCompany);
                    setStakeholderIdx(0);
                    setIsStakeholderPlaying(false);
                  }}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-black/45 hover:bg-[#A2482B] border border-white/20 hover:border-[#A2482B] text-white flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
                  title={`Découvrir l'univers et les témoignages de ${currentCompany.companyName}`}
                >
                  <Compass className="w-4 h-4 text-white" />
                </button>

                {/* 2. Partager cette entreprise */}
                <button
                  onClick={handleShare}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl border flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95 ${
                    copied
                      ? 'bg-emerald-700/85 border-emerald-600 text-white'
                      : 'bg-black/45 hover:bg-[#A2482B] border-white/20 text-white'
                  }`}
                  title="Partager cette entreprise"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-white" />
                  ) : (
                    <ShareIcon className="w-4 h-4 text-white" />
                  )}
                </button>
              </div>

              {/* =========================================================== */}
              {/* BAS DE LA CARTE : NOM DE L'ENTREPRISE SEUL À GAUCHE         */}
              {/* ET SYMBOLE MUTE EN BAS À DROITE                             */}
              {/* =========================================================== */}
              <div className="relative z-20 pt-2 mt-auto flex items-end justify-between gap-2 pointer-events-auto">
                <div className="min-w-0 pr-2">
                  <h4 className="font-editorial text-base sm:text-lg font-bold text-white drop-shadow-md tracking-wider leading-tight">
                    {currentCompany.companyName}
                  </h4>
                </div>

                {/* Symbole Muet en bas à droite */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMuted(prev => !prev);
                  }}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/50 hover:bg-[#A2482B] backdrop-blur-md border border-white/20 hover:border-[#A2482B] text-white flex items-center justify-center cursor-pointer transition-all shadow-md hover:scale-105 active:scale-95 shrink-0"
                  title={isMuted ? "Activer le son" : "Couper le son"}
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5 text-white" /> : <Volume2 className="w-3.5 h-3.5 text-white" />}
                </button>
              </div>
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
              className="h-[min(480px,calc(100dvh-230px))] sm:h-[min(520px,calc(100dvh-210px))] lg:h-[min(550px,calc(100dvh-200px))] aspect-[9/16] w-auto mx-auto rounded-3xl overflow-hidden bg-stone-950 text-white shadow-2xl border border-stone-200/40 relative flex flex-col justify-between p-3.5 sm:p-4.5 cursor-pointer group select-none shrink-0"
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

              {/* =========================================================== */}
              {/* HAUT DE CARTE : NOM DE L'ENTREPRISE EN TITRE À GAUCHE &     */}
              {/* LECTEUR VIDÉO EN HAUT À DROITE                              */}
              {/* =========================================================== */}
              <div className="relative z-20 flex items-center justify-between w-full pointer-events-auto">
                <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[10.5px] sm:text-xs font-bold text-white tracking-wider uppercase drop-shadow-sm truncate inline-block">
                  {selectedCompanyForSpace.companyName}
                </span>

                {/* Lecteur vidéo vintage officiel TvPlayerIcon en haut à droite */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsStakeholderPlaying(prev => !prev);
                  }}
                  className="w-8.5 h-8.5 sm:w-9.5 sm:h-9.5 rounded-xl bg-black/50 hover:bg-[#A2482B] backdrop-blur-md border border-white/20 hover:border-[#A2482B] flex items-center justify-center text-white transition-all duration-200 shadow-md cursor-pointer hover:scale-105 active:scale-95 shrink-0"
                  title={isStakeholderPlaying ? "Mettre en pause" : `Regarder la vidéo de ${currentStakeholder.name}`}
                >
                  {isStakeholderPlaying ? (
                    <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white text-white" />
                  ) : (
                    <TvPlayerIcon className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-white transition-transform" strokeWidth={1.6} />
                  )}
                </button>
              </div>

              {/* =========================================================== */}
              {/* FLANC DROIT : ÉVALUATION, QUESTION, PROFIL & PARTAGE        */}
              {/* =========================================================== */}
              <div 
                onClick={(e) => e.stopPropagation()}
                className="absolute right-3 sm:right-3.5 top-[58%] -translate-y-1/2 z-20 flex flex-col items-center gap-2.5 sm:gap-3 pointer-events-auto"
              >
                {/* 1. Évaluation résonance */}
                <button
                  id={`stakeholder-btn-resonance-${currentStakeholder.id}`}
                  onClick={() => setResonanceTargetStakeholder(currentStakeholder)}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl backdrop-blur-md border flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer hover:scale-105 active:scale-95 ${
                    stakeholderResonances[currentStakeholder.id] !== undefined
                      ? 'bg-[#A2482B] border-[#A2482B] text-white shadow-[0_0_14px_rgba(162,72,43,0.5)]'
                      : 'bg-black/45 hover:bg-[#A2482B] border-white/20 hover:border-[#A2482B] text-white'
                  }`}
                  title={stakeholderResonances[currentStakeholder.id] !== undefined ? `Résonance : ${stakeholderResonances[currentStakeholder.id]}%` : "Évaluer la résonance"}
                >
                  <Award className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </button>

                {/* 2. Question existentielle */}
                <button
                  id={`stakeholder-btn-question-${currentStakeholder.id}`}
                  onClick={() => setQuestionModalStakeholder(currentStakeholder)}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-black/45 hover:bg-[#A2482B] backdrop-blur-md border border-white/20 hover:border-[#A2482B] text-white flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer hover:scale-105 active:scale-95"
                  title="Découvrir la question"
                >
                  <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </button>

                {/* 3. Découvrir son profil complet */}
                <button
                  id={`stakeholder-btn-profile-${currentStakeholder.id}`}
                  onClick={() => onNavigate && onNavigate({ type: 'profile' })}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-black/45 hover:bg-[#A2482B] backdrop-blur-md border border-white/20 hover:border-[#A2482B] text-white flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer hover:scale-105 active:scale-95"
                  title={`Découvrir le profil de ${currentStakeholder.name}`}
                >
                  <ProfileSoloIcon className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-white" />
                </button>

                {/* 4. Bouton Partager */}
                <button
                  onClick={handleShare}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl border flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95 ${
                    copied
                      ? 'bg-emerald-700/85 border-emerald-600 text-white'
                      : 'bg-black/45 hover:bg-[#A2482B] border-white/20 text-white'
                  }`}
                  title="Partager ce témoignage"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-white" />
                  ) : (
                    <ShareIcon className="w-4 h-4 text-white" />
                  )}
                </button>
              </div>

              {/* =========================================================== */}
              {/* BAS : PRÉNOM DE LA PERSONNE & STATUT SIMPLE (Fondateur...)  */}
              {/* ET SYMBOLE MUTE EN BAS À DROITE                             */}
              {/* =========================================================== */}
              <div className="relative z-20 pt-2 mt-auto flex items-end justify-between gap-2 pointer-events-auto">
                <div className="space-y-0.5 min-w-0 pr-2">
                  <h3 className="font-editorial text-[15px] sm:text-base md:text-lg font-bold text-white tracking-wider leading-tight drop-shadow-md">
                    {currentStakeholder.name.split(' ')[0]}
                  </h3>
                  <span className="text-[11px] sm:text-xs text-white/85 font-medium block truncate">
                    {currentStakeholder.roleCategory}
                  </span>
                </div>

                {/* Symbole Muet en bas à droite */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsStakeholderMuted(prev => !prev);
                  }}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/50 hover:bg-[#A2482B] backdrop-blur-md border border-white/20 hover:border-[#A2482B] text-white flex items-center justify-center cursor-pointer transition-all shadow-md hover:scale-105 active:scale-95 shrink-0"
                  title={isStakeholderMuted ? 'Activer le son' : 'Couper le son'}
                >
                  {isStakeholderMuted ? <VolumeX className="w-3.5 h-3.5 text-white" /> : <Volume2 className="w-3.5 h-3.5 text-white" />}
                </button>
              </div>
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
