import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  X, 
  Sparkles,
  Plus,
  HelpCircle,
  Volume2,
  VolumeX
} from 'lucide-react';
import { ViewScreen } from '../types';
import { CompanyEntity, CompanyStakeholder, COMPANIES_DATA } from '../data/companyPortraitsData';
import { ProfileSoloIcon, TvPlayerIcon } from './YonywoodBrandIcons';
import { ShareIcon } from './ShareIcon';
import { VideoCardShareModal } from './VideoCardShareModal';
import { celestialAudio } from '../utils/celestialAudio';
import { THEMATIC_VALUES, ThematicValue } from '../data/thematicStoriesData';

export type { CompanyStakeholder, CompanyEntity };
export { COMPANIES_DATA };

interface CompanyHeritageScreenProps {
  onNavigate?: (screen: ViewScreen) => void;
  initialCompanyId?: string;
}

interface CompanyDuo {
  id: string;
  themeQuestion: string;
  category: string;
  companyA: CompanyEntity;
  companyB: CompanyEntity;
}

const COMPANY_DUOS: CompanyDuo[] = [
  {
    id: 'c-duo-1',
    themeQuestion: 'Comment concilier innovation technologique et souveraineté locale ?',
    category: 'Technologie & Énergie',
    companyA: COMPANIES_DATA[0], // Aura Tech
    companyB: COMPANIES_DATA[3], // Bio Solaire
  },
  {
    id: 'c-duo-2',
    themeQuestion: 'Pourquoi l’exigence artisanale surpasse-t-elle l’industrialisation aveugle ?',
    category: 'Luxe & Métiers d’Art',
    companyA: COMPANIES_DATA[2], // Kpèdétin Joaillerie
    companyB: COMPANIES_DATA[4], // Nectar Botanique
  },
  {
    id: 'c-duo-3',
    themeQuestion: 'Comment régénérer nos terroirs à travers une logistique responsable ?',
    category: 'Terroir & Fret Vert',
    companyA: COMPANIES_DATA[1], // Terroirs & Agro
    companyB: COMPANIES_DATA[5], // Dossou Logistique
  },
  {
    id: 'c-duo-4',
    themeQuestion: 'Quel dialogue bâtir entre mémoire ancestrale et architecture de demain ?',
    category: 'Architecture & Patrimoine',
    companyA: COMPANIES_DATA[6], // Sènami Architecture
    companyB: COMPANIES_DATA[7], // Kiki Passeur de Mémoire
  }
];

export const CompanyHeritageScreen: React.FC<CompanyHeritageScreenProps> = ({ 
  onNavigate,
  initialCompanyId
}) => {
  const [currentDuoIdx, setCurrentDuoIdx] = useState(0);
  const [slideIndex, setSlideIndex] = useState<0 | 1 | 2>(0);

  // Mode Story activé in-place
  const [storyModeIndex, setStoryModeIndex] = useState<number | null>(null);
  const [showStoryQuestion, setShowStoryQuestion] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [shareItem, setShareItem] = useState<{ title: string; id: string } | null>(null);

  // Slider d'évaluation 50/50
  const [sliderValue, setSliderValue] = useState<number>(50);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const lastScrollTime = useRef<number>(0);

  const currentDuo = COMPANY_DUOS[currentDuoIdx] || COMPANY_DUOS[0];
  const compA = currentDuo.companyA;
  const compB = currentDuo.companyB;
  const activeCompany = slideIndex === 0 ? compA : compB;

  const percentA = 100 - sliderValue;
  const percentB = sliderValue;

  useEffect(() => {
    setIsPlaying(false);
    setSlideIndex(0);
    setSliderValue(50);
  }, [currentDuoIdx]);

  const handleNextDuo = () => {
    if (storyModeIndex !== null) return;
    setIsPlaying(false);
    setSlideIndex(0);
    setCurrentDuoIdx(prev => (prev + 1) % COMPANY_DUOS.length);
    celestialAudio.playOrbSelect();
  };

  const handlePrevDuo = () => {
    if (storyModeIndex !== null) return;
    setIsPlaying(false);
    setSlideIndex(0);
    setCurrentDuoIdx(prev => (prev - 1 + COMPANY_DUOS.length) % COMPANY_DUOS.length);
    celestialAudio.playOrbSelect();
  };

  const goToSlide = (s: 0 | 1 | 2) => {
    setIsPlaying(false);
    setSlideIndex(s);
    celestialAudio.playOrbSelect();
  };

  const nextSlide = () => {
    if (storyModeIndex !== null) {
      setStoryModeIndex(prev => (prev !== null ? (prev + 1) % THEMATIC_VALUES.length : 0));
      celestialAudio.playOrbSelect();
      return;
    }
    if (slideIndex < 2) {
      goToSlide((slideIndex + 1) as 0 | 1 | 2);
    } else {
      handleNextDuo();
    }
  };

  const prevSlide = () => {
    if (storyModeIndex !== null) {
      setStoryModeIndex(prev => (prev !== null ? (prev - 1 + THEMATIC_VALUES.length) % THEMATIC_VALUES.length : 0));
      celestialAudio.playOrbSelect();
      return;
    }
    if (slideIndex > 0) {
      goToSlide((slideIndex - 1) as 0 | 1 | 2);
    } else {
      handlePrevDuo();
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    const now = Date.now();
    if (now - lastScrollTime.current < 450) return;

    if (Math.abs(e.deltaY) > 30) {
      lastScrollTime.current = now;
      if (e.deltaY > 0) {
        handleNextDuo();
      } else {
        handlePrevDuo();
      }
    } else if (Math.abs(e.deltaX) > 30) {
      lastScrollTime.current = now;
      if (e.deltaX > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const deltaX = e.changedTouches[0].clientX - touchStartRef.current.x;
    const deltaY = e.changedTouches[0].clientY - touchStartRef.current.y;
    touchStartRef.current = null;

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 40) {
      if (deltaX < 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    } else if (Math.abs(deltaY) > 45) {
      if (deltaY < 0) {
        handleNextDuo();
      } else {
        handlePrevDuo();
      }
    }
  };

  const activeThemeStory = storyModeIndex !== null ? THEMATIC_VALUES[storyModeIndex] : null;
  const storyItem = activeThemeStory?.stories[0];

  return (
    <div 
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className={`w-full h-full max-h-full pb-20 sm:pb-24 pt-safe overflow-hidden flex flex-col justify-between select-none transition-colors duration-500 ${
        storyModeIndex !== null 
          ? 'bg-[#0B0908] text-white' 
          : 'bg-white text-[#1C1917]'
      }`}
    >
      
      {/* ========================================================================= */}
      {/* 1. STORIES THÉMATIQUES EN RECTANGLES ARRONDIS (SQUIRCLES)                 */}
      {/* ========================================================================= */}
      <div className="w-full max-w-3xl mx-auto px-3 sm:px-4 pt-1.5 pb-1 shrink-0 h-[84px] sm:h-[90px] flex items-center">
        <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar py-1 px-1 w-full">
          
          {/* Vignette 0 : "+" */}
          <div 
            onClick={() => onNavigate && onNavigate({ type: 'submit_story' })}
            className="flex flex-col items-center gap-1 cursor-pointer group shrink-0"
            title="Créer une story"
          >
            <div className={`w-13 h-14 sm:w-14 sm:h-15 rounded-2xl p-0.5 border-2 border-dashed border-[#A2482B] flex items-center justify-center group-hover:scale-105 transition-transform ${
              storyModeIndex !== null ? 'bg-stone-900' : 'bg-amber-50/50'
            }`}>
              <div className="w-full h-full rounded-xl bg-[#A2482B] text-white flex items-center justify-center shadow-xs">
                <Plus className="w-5 h-5" />
              </div>
            </div>
            <span className={`text-[10px] font-semibold tracking-tight ${storyModeIndex !== null ? 'text-stone-400' : 'text-stone-600'}`}>
              +
            </span>
          </div>

          {/* Les 8 Valeurs de la Semaine */}
          {THEMATIC_VALUES.map((theme, idx) => {
            const hasStories = theme.stories.length > 0;
            const isSelected = storyModeIndex === idx;
            return (
              <div 
                key={theme.id}
                onClick={() => {
                  if (storyModeIndex === idx) {
                    setStoryModeIndex(null);
                  } else {
                    setStoryModeIndex(idx);
                    setIsPlaying(true);
                    celestialAudio.playOrbSelect();
                  }
                }}
                className="flex flex-col items-center gap-1 cursor-pointer group shrink-0"
                title={theme.label}
              >
                <div className={`w-13 h-14 sm:w-14 sm:h-15 rounded-2xl p-0.5 border-2 transition-transform group-hover:scale-105 ${
                  isSelected 
                    ? 'border-amber-400 scale-105 shadow-md shadow-amber-500/20' 
                    : hasStories 
                      ? 'border-[#A2482B]' 
                      : 'border-stone-200/60'
                }`}>
                  <div className="w-full h-full rounded-xl overflow-hidden bg-stone-900 relative">
                    {hasStories ? (
                      <img 
                        src={theme.stories[0].authorAvatar} 
                        alt={theme.label}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-stone-800 text-stone-400">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/15" />
                  </div>
                </div>
                <span className={`text-[9.5px] tracking-tight max-w-[54px] truncate text-center ${
                  isSelected 
                    ? 'font-bold text-amber-400' 
                    : storyModeIndex !== null ? 'text-stone-400' : 'text-stone-700 font-medium'
                }`}>
                  {theme.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. ZONE CENTRALE : PUBLICATION ENTREPRISE OU MODE STORY                   */}
      {/* ========================================================================= */}
      <div className="relative flex-1 flex flex-col items-center justify-center min-h-0 py-1 px-3 sm:px-4 my-auto">
        
        {/* Flèche Desktop Gauche */}
        <button
          onClick={prevSlide}
          className="hidden md:flex absolute left-4 lg:left-8 z-30 w-10 h-10 rounded-full bg-white/90 hover:bg-[#1C1917] text-stone-800 hover:text-white border border-stone-200 shadow-lg items-center justify-center transition-all cursor-pointer transform hover:scale-105 active:scale-95"
          title="Précédent"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Flèche Desktop Droite */}
        <button
          onClick={nextSlide}
          className="hidden md:flex absolute right-4 lg:right-8 z-30 w-10 h-10 rounded-full bg-white/90 hover:bg-[#1C1917] text-stone-800 hover:text-white border border-stone-200 shadow-lg items-center justify-center transition-all cursor-pointer transform hover:scale-105 active:scale-95"
          title="Suivant"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* ======================================================================= */}
        {/* CAS A : LE MODE STORY EST ACTIVÉ                                        */}
        {/* ======================================================================= */}
        {storyModeIndex !== null && activeThemeStory ? (
          <div className="relative aspect-[9/16] w-[min(310px,calc(100vw-36px))] sm:w-[320px] max-h-[min(540px,calc(100dvh-220px))] rounded-3xl overflow-hidden shadow-2xl border border-amber-500/40 bg-[#12110F] text-white flex flex-col justify-between select-none">
            
            {/* Header Mode Story : Thématique + Bouton Quitter Mode Story dans le coin */}
            <div className="relative z-20 pt-4 px-3 flex items-center justify-between gap-1 pointer-events-auto">
              <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                <span className="text-[11px] font-bold text-amber-300 tracking-wide">
                  Story • {activeThemeStory.label}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsMuted(m => !m)}
                  className="w-8 h-8 rounded-xl bg-black/60 backdrop-blur-md text-white border border-white/20 flex items-center justify-center cursor-pointer hover:bg-black/80"
                  title={isMuted ? 'Activer le son' : 'Couper le son'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => setStoryModeIndex(null)}
                  className="w-8 h-8 rounded-xl bg-black/60 backdrop-blur-md text-white border border-white/20 flex items-center justify-center cursor-pointer hover:bg-[#A2482B] transition-colors"
                  title="Revenir aux publications"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Média de la story */}
            <div 
              className="absolute inset-0 z-10 cursor-pointer"
              onClick={() => setIsPlaying(p => !p)}
            >
              {storyItem ? (
                <video
                  ref={videoRef}
                  key={`company-story-${storyItem.id}`}
                  src={storyItem.videoUrl}
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-stone-900 flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-amber-400" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />
            </div>

            {/* Flanc Droit */}
            <div className="absolute right-2.5 bottom-16 z-30 flex flex-col items-center gap-2 pointer-events-auto">
              <button
                onClick={() => setShowStoryQuestion(true)}
                className="w-8 h-8 rounded-xl bg-black/60 backdrop-blur-md text-white hover:bg-[#A2482B] border border-white/15 flex items-center justify-center transition-all cursor-pointer shadow-sm group"
                title="Consulter la question de la story"
              >
                <HelpCircle className="w-4 h-4 text-amber-300" />
              </button>
              <button
                onClick={() => setShareItem({ title: `Story ${activeThemeStory.label}`, id: activeThemeStory.id })}
                className="w-8 h-8 rounded-xl bg-black/60 backdrop-blur-md text-white hover:bg-[#A2482B] border border-white/15 flex items-center justify-center transition-all cursor-pointer shadow-sm group"
                title="Partager"
              >
                <ShareIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Bas de Story */}
            <div className="relative z-20 p-4 space-y-0.5 pointer-events-none">
              <span className="text-[11px] font-medium text-white/80 block tracking-wide">
                {activeThemeStory.label}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
                {storyItem?.authorName.split(' ')[0] || activeThemeStory.label}
              </h2>
            </div>

            {/* Tiroir Question */}
            {showStoryQuestion && (
              <div 
                className="absolute inset-x-0 bottom-0 z-40 bg-white text-stone-900 rounded-t-3xl p-4 shadow-2xl animate-in slide-in-from-bottom duration-200 space-y-2 select-text"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-center justify-between pb-1 border-b border-stone-100">
                  <span className="text-xs font-bold text-[#A2482B] uppercase tracking-wider">
                    Thématique : {activeThemeStory.label}
                  </span>
                  <button 
                    onClick={() => setShowStoryQuestion(false)}
                    className="p-1 rounded-full text-stone-400 hover:text-stone-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-stone-800 leading-relaxed">
                  « {storyItem?.question || activeThemeStory.question || `Racontez comment dans votre entreprise cette valeur est vécue.`} »
                </p>
              </div>
            )}
          </div>
        ) : (
          /* ======================================================================= */
          /* CAS B : PUBLICATION ENTREPRISE NORMALE                                  */
          /* ======================================================================= */
          <div className="relative aspect-[9/16] w-[min(310px,calc(100vw-36px))] sm:w-[320px] max-h-[min(540px,calc(100dvh-220px))] rounded-3xl overflow-hidden shadow-2xl border border-stone-200/90 bg-[#12110F] text-white flex flex-col justify-between select-none">
            
            {/* VOLET 1 (ENTREPRISE A) OU VOLET 2 (ENTREPRISE B) */}
            {slideIndex !== 2 ? (
              <>
                {/* MENU DE NAVIGATION AU-DESSUS DE LA VIDÉO */}
                <div className="relative z-20 pt-4 px-3 flex items-center justify-between gap-1 pointer-events-auto">
                  <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md p-0.5 rounded-full border border-white/15">
                    <button
                      type="button"
                      onClick={() => goToSlide(0)}
                      className={`px-2 py-0.5 rounded-full text-[10px] transition-all cursor-pointer ${
                        slideIndex === 0 
                          ? 'bg-[#A2482B] text-white font-bold shadow-xs' 
                          : 'text-stone-300 hover:text-white font-semibold'
                      }`}
                    >
                      {compA.companyName.split(' ')[0]}
                    </button>
                    <button
                      type="button"
                      onClick={() => goToSlide(1)}
                      className={`px-2 py-0.5 rounded-full text-[10px] transition-all cursor-pointer ${
                        slideIndex === 1 
                          ? 'bg-[#A2482B] text-white font-bold shadow-xs' 
                          : 'text-stone-300 hover:text-white font-semibold'
                      }`}
                    >
                      {compB.companyName.split(' ')[0]}
                    </button>
                    <button
                      type="button"
                      onClick={() => goToSlide(2)}
                      className="px-2 py-0.5 rounded-full text-[10px] font-semibold text-stone-300 hover:text-white transition-all cursor-pointer"
                    >
                      Face-à-face
                    </button>
                  </div>

                  {/* Bouton Télé Vintage de Lecture en haut à droite */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsPlaying(p => !p);
                    }}
                    className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-95 ${
                      isPlaying 
                        ? 'bg-[#A2482B] text-white border border-[#8A3B22]' 
                        : 'bg-black/60 backdrop-blur-md text-white border border-white/20 hover:bg-black/80'
                    }`}
                    title={isPlaying ? 'Pause' : 'Lecture vidéo'}
                  >
                    <TvPlayerIcon className="w-4.5 h-4.5 text-current" />
                  </button>
                </div>

                {/* MEDIA FOND */}
                <div 
                  className="absolute inset-0 z-10 cursor-pointer"
                  onClick={() => setIsPlaying(p => !p)}
                >
                  {isPlaying ? (
                    <video
                      ref={videoRef}
                      key={`company-video-${activeCompany.id}`}
                      src={activeCompany.videoUrl || activeCompany.manifestoVideoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'}
                      autoPlay
                      loop
                      muted={isMuted}
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img 
                      src={activeCompany.photoUrl} 
                      alt={activeCompany.companyName}
                      className="w-full h-full object-cover"
                    />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />
                </div>

                {/* COLONNE D'ICÔNES LATÉRALE DROITE : SQUIRCLES (rounded-xl) */}
                <div className="absolute right-2.5 bottom-16 z-30 flex flex-col items-center gap-2 pointer-events-auto">
                  {/* 1. Question */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowQuestionModal(true);
                    }}
                    className="w-8 h-8 rounded-xl bg-black/60 backdrop-blur-md text-white hover:bg-[#A2482B] border border-white/15 flex items-center justify-center transition-all cursor-pointer shadow-sm group"
                    title="Question de vision"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-white group-hover:scale-110 transition-transform" />
                  </button>

                  {/* 2. Échange ⇄ */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      goToSlide(slideIndex === 0 ? 1 : 0);
                    }}
                    className="w-8 h-8 rounded-xl bg-black/60 backdrop-blur-md text-white hover:bg-[#A2482B] border border-white/15 flex items-center justify-center transition-all cursor-pointer shadow-sm group"
                    title={slideIndex === 0 ? `Voir ${compB.companyName}` : `Voir ${compA.companyName}`}
                  >
                    <span className="font-bold text-xs tracking-tight">⇄</span>
                  </button>

                  {/* 3. Portrait d'entreprise : ouvre la page portrait de CETTE entreprise */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onNavigate) {
                        onNavigate({ type: 'profile', protagonistId: activeCompany.id });
                      }
                    }}
                    className="w-8 h-8 rounded-xl bg-black/60 backdrop-blur-md text-white hover:bg-[#A2482B] border border-white/15 flex items-center justify-center transition-all cursor-pointer shadow-sm group"
                    title={`Portrait de ${activeCompany.companyName}`}
                  >
                    <ProfileSoloIcon className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                  </button>

                  {/* 4. Partage : l'ancienne icône flèche ascendante + arche */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShareItem({ title: `Documentaire Entreprise : ${activeCompany.companyName}`, id: activeCompany.id });
                    }}
                    className="w-8 h-8 rounded-xl bg-black/60 backdrop-blur-md text-white hover:bg-[#A2482B] border border-white/15 flex items-center justify-center transition-all cursor-pointer shadow-sm group"
                    title="Partager"
                  >
                    <ShareIcon className="w-4 h-4" />
                  </button>
                </div>

                {/* BAS DE CARTE ÉPURÉ */}
                <div className="relative z-20 p-4 space-y-0.5 pointer-events-none">
                  <span className="text-[11px] font-medium text-white/80 block tracking-wide">
                    {currentDuo.category}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
                    {activeCompany.companyName}
                  </h2>
                </div>
              </>
            ) : (
              /* VOLET 3 : LE FACE-À-FACE DES ENTREPRISES & CURSEUR 50/50 ÉPURÉ */
              <div className="relative w-full h-full p-4 sm:p-5 flex flex-col justify-between select-none bg-[#12110F]">
                
                {/* Halo d'ambiance */}
                <div 
                  className="absolute inset-0 opacity-25 pointer-events-none transition-all duration-300"
                  style={{
                    background: `radial-gradient(circle at ${sliderValue}% 50%, #A2482B 0%, transparent 70%)`
                  }}
                />

                {/* Menu de navigation direct au-dessus du face-à-face */}
                <div className="relative z-20 flex items-center justify-between gap-1.5">
                  <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/15 max-w-[50%]">
                    <span className="text-[10.5px] font-medium text-white tracking-wide truncate block">
                      {currentDuo.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md p-0.5 rounded-full border border-white/15">
                    <button
                      type="button"
                      onClick={() => goToSlide(0)}
                      className="px-2 py-0.5 rounded-full text-[10px] font-semibold text-stone-300 hover:text-white transition-colors cursor-pointer"
                    >
                      {compA.companyName.split(' ')[0]}
                    </button>
                    <button
                      type="button"
                      onClick={() => goToSlide(1)}
                      className="px-2 py-0.5 rounded-full text-[10px] font-semibold text-stone-300 hover:text-white transition-colors cursor-pointer"
                    >
                      {compB.companyName.split(' ')[0]}
                    </button>
                    <button
                      type="button"
                      onClick={() => goToSlide(2)}
                      className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#A2482B] text-white shadow-xs cursor-pointer"
                    >
                      Face-à-face
                    </button>
                  </div>
                </div>

                {/* Vignettes des deux entreprises */}
                <div className="relative z-10 grid grid-cols-2 gap-3 my-auto py-2">
                  <div 
                    onClick={() => onNavigate && onNavigate({ type: 'profile', protagonistId: compA.id })}
                    className={`relative rounded-2xl overflow-hidden p-2 border transition-all duration-200 cursor-pointer flex flex-col items-center aspect-[3/4] ${
                      percentA > 50 
                        ? 'border-[#A2482B] bg-[#1E1916] shadow-lg shadow-[#A2482B]/20 scale-102' 
                        : 'border-white/10 bg-black/40 hover:border-white/20'
                    }`}
                  >
                    <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-2">
                      <img src={compA.photoUrl} alt={compA.companyName} className="w-full h-full object-cover" />
                      <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-[10px] font-bold text-white">
                        {percentA}%
                      </div>
                    </div>
                    <h4 className="text-xs font-bold text-white tracking-wide truncate w-full text-center">
                      {compA.companyName}
                    </h4>
                  </div>

                  <div 
                    onClick={() => onNavigate && onNavigate({ type: 'profile', protagonistId: compB.id })}
                    className={`relative rounded-2xl overflow-hidden p-2 border transition-all duration-200 cursor-pointer flex flex-col items-center aspect-[3/4] ${
                      percentB > 50 
                        ? 'border-amber-500 bg-[#1E1C15] shadow-lg shadow-amber-500/20 scale-102' 
                        : 'border-white/10 bg-black/40 hover:border-white/20'
                    }`}
                  >
                    <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-2">
                      <img src={compB.photoUrl} alt={compB.companyName} className="w-full h-full object-cover" />
                      <div className="absolute top-1 right-1 px-1.5 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-[10px] font-bold text-amber-300">
                        {percentB}%
                      </div>
                    </div>
                    <h4 className="text-xs font-bold text-white tracking-wide truncate w-full text-center">
                      {compB.companyName}
                    </h4>
                  </div>
                </div>

                {/* Curseur de résonance tactile : avec point au milieu à la place de BALANCE */}
                <div className="relative z-10 bg-black/60 backdrop-blur-md p-3.5 rounded-2xl border border-white/15 space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className={percentA > 50 ? 'text-[#C8603C]' : 'text-stone-300'}>
                      {compA.companyName.split(' ')[0]} {percentA}%
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-white/50" title="Milieu" />
                    <span className={percentB > 50 ? 'text-amber-400' : 'text-stone-300'}>
                      {percentB}% {compB.companyName.split(' ')[0]}
                    </span>
                  </div>
                  <div className="relative flex items-center py-1">
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={sliderValue} 
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        setSliderValue(val);
                        if (val === 50 || val === 75 || val === 25) {
                          celestialAudio.playOrbSelect();
                        }
                      }}
                      className="w-full h-2 bg-stone-700/80 rounded-lg appearance-none cursor-pointer accent-[#A2482B]" 
                    />
                  </div>
                </div>

              </div>
            )}

          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* 3. MODALES : QUESTION ET PARTAGE                                         */}
      {/* ========================================================================= */}
      {showQuestionModal && (
        <div 
          className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs select-none" 
          onClick={() => setShowQuestionModal(false)}
        >
          <div 
            className="w-full max-w-sm bg-white text-stone-900 rounded-3xl p-5 shadow-2xl border border-stone-200 space-y-3" 
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <span className="text-xs font-bold text-[#A2482B] uppercase tracking-wider">
                Question de vision
              </span>
              <button onClick={() => setShowQuestionModal(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm font-semibold text-stone-900 leading-relaxed">
              « {currentDuo.themeQuestion} »
            </p>
            <p className="text-xs text-stone-500 leading-relaxed">
              Deux entreprises et bâtisseurs de terroir répondent à la même question avant d'être mis en miroir.
            </p>
          </div>
        </div>
      )}

      {/* MODALE PARTAGE */}
      {shareItem && (
        <VideoCardShareModal
          isOpen={Boolean(shareItem)}
          onClose={() => setShareItem(null)}
          videoTitle={shareItem.title}
          videoId={shareItem.id}
        />
      )}

    </div>
  );
};
