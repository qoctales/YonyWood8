import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  X, 
  Film,
  Sparkles,
  Plus,
  HelpCircle,
  Volume2,
  VolumeX
} from 'lucide-react';
import { celestialAudio } from '../utils/celestialAudio';
import { apiService } from '../services/api';
import { ViewScreen, Duo, Protagonist } from '../types';
import { DOCUMENTARIES as MOCK_DOCS, DUOS as MOCK_DUOS } from '../data/mockData';
import { THEMATIC_VALUES, ThematicValue } from '../data/thematicStoriesData';
import { ResonanceFaceToFaceCard } from './ResonanceFaceToFaceCard';
import { VideoCardShareModal } from './VideoCardShareModal';
import { ProfileSoloIcon, TvPlayerIcon } from './YonywoodBrandIcons';
import { ShareIcon } from './ShareIcon';
import { getBlockedVideoIds } from '../utils/blockedContent';

interface DuoFeedScreenProps {
  onNavigate: (screen: ViewScreen) => void;
  initialDocId?: string;
  initialDuoId?: string;
  initialDuoIndex?: number;
  allowedSeriesIds?: string[];
}

export const DuoFeedScreen: React.FC<DuoFeedScreenProps> = ({
  onNavigate,
  initialDocId,
  initialDuoId,
  initialDuoIndex = 0,
  allowedSeriesIds
}) => {
  const [DUOS, setDuos] = useState<Duo[]>([]);
  const [DOCUMENTARIES, setDocumentaries] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Index du Duo actif (Swipe vertical = 1 publication unique au centre)
  const [currentIndex, setCurrentIndex] = useState(initialDuoIndex);

  // Position dans le diaporama horizontal du Duo (0: Volet A, 1: Volet B, 2: Face-à-face & Curseur 50/50)
  const [slideIndex, setSlideIndex] = useState<0 | 1 | 2>(0);

  // Mode Story activé directement dans le feed
  const [storyModeIndex, setStoryModeIndex] = useState<number | null>(null);
  const [showStoryQuestion, setShowStoryQuestion] = useState(false);

  // Lecture vidéo
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Modales
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [shareModalItem, setShareModalItem] = useState<{ title: string; id: string } | null>(null);

  // Vidéos bloquées
  const [blockedIds, setBlockedIds] = useState<string[]>(() => getBlockedVideoIds());

  // Gestion du swipe tactile et scroll
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const lastScrollTime = useRef<number>(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [fetchedDuos, fetchedDocs] = await Promise.all([
          apiService.getDuos(),
          apiService.getSeries()
        ]);
        setDuos(fetchedDuos && fetchedDuos.length > 0 ? fetchedDuos : MOCK_DUOS);
        setDocumentaries(fetchedDocs && fetchedDocs.length > 0 ? fetchedDocs : MOCK_DOCS);
        if (initialDuoId) {
          const idx = (fetchedDuos || MOCK_DUOS).findIndex((d: any) => d.id === initialDuoId);
          if (idx !== -1) setCurrentIndex(idx);
        }
      } catch {
        setDuos(MOCK_DUOS);
        setDocumentaries(MOCK_DOCS);
      } finally {
        setLoadingData(false);
      }
    };
    loadData();
  }, [initialDuoId]);

  useEffect(() => {
    const handleBlocked = () => setBlockedIds(getBlockedVideoIds());
    window.addEventListener('yonywood_video_blocked', handleBlocked);
    return () => window.removeEventListener('yonywood_video_blocked', handleBlocked);
  }, []);

  // Filtrer les Duos
  const filteredDuos = (allowedSeriesIds && allowedSeriesIds.length > 0
    ? DUOS.filter(d => allowedSeriesIds.includes(d.documentaryId))
    : DUOS
  ).filter(d => !blockedIds.includes(d.protagonistA?.id) && !blockedIds.includes(d.protagonistB?.id));

  const safeIndex = filteredDuos.length > 0 ? (currentIndex % filteredDuos.length) : 0;
  const currentDuo: Duo | undefined = filteredDuos[safeIndex];

  // Reset de la lecture et du volet au changement de duo
  useEffect(() => {
    setIsPlaying(false);
    setSlideIndex(0);
  }, [currentIndex]);

  const handleNextDuo = () => {
    if (storyModeIndex !== null) return;
    if (filteredDuos.length <= 1) return;
    setIsPlaying(false);
    setSlideIndex(0);
    setCurrentIndex(prev => (prev + 1) % filteredDuos.length);
    celestialAudio.playOrbSelect();
  };

  const handlePrevDuo = () => {
    if (storyModeIndex !== null) return;
    if (filteredDuos.length <= 1) return;
    setIsPlaying(false);
    setSlideIndex(0);
    setCurrentIndex(prev => (prev - 1 + filteredDuos.length) % filteredDuos.length);
    celestialAudio.playOrbSelect();
  };

  const goToSlide = (target: 0 | 1 | 2) => {
    setIsPlaying(false);
    setSlideIndex(target);
    celestialAudio.playOrbSelect();
  };

  const nextSlide = () => {
    if (storyModeIndex !== null) {
      // En Mode Story : passer à la story suivante
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
      // En Mode Story : passer à la story précédente
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

  // Gestion du Wheel (Swipe vertical strict = 1 publication change)
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

  // Touch Swipe
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

  if (loadingData) {
    return <div className="min-h-screen bg-white text-stone-900 flex items-center justify-center font-medium">Chargement des dialogues...</div>;
  }

  if (!currentDuo) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center bg-white text-[#1C1917] space-y-3">
        <Film className="w-10 h-10 text-stone-300" />
        <h3 className="font-editorial text-xl font-bold">Aucun dialogue dans cette sélection</h3>
        <p className="text-xs text-stone-500 max-w-xs">Découvrez les duos en réinitialisant vos filtres.</p>
        <button 
          onClick={() => onNavigate({ type: 'profile' })}
          className="mt-2 px-5 py-2.5 rounded-full bg-[#A2482B] text-white font-semibold text-xs shadow-md"
        >
          Personnaliser mes séries
        </button>
      </div>
    );
  }

  const pA = currentDuo.protagonistA;
  const pB = currentDuo.protagonistB;
  const activeProtagonist = slideIndex === 0 ? pA : pB;

  const currentVideoUrl = (slideIndex === 0 ? pA.videoAvatarUrl : pB.videoAvatarUrl)
    || DOCUMENTARIES.find(d => d.id === currentDuo.documentaryId)?.teaserVideoUrl
    || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';

  const rawSeriesTitle = currentDuo.documentaryTitle || 'Dialogue en miroir';
  const duoQuestion = currentDuo.centralQuestion || currentDuo.questionTitle || activeProtagonist.quote || 'Quelle est la leçon fondamentale que la vie vous a enseignée ?';
  const firstName = activeProtagonist.name.split(' ')[0];
  const firstNameA = pA.name.split(' ')[0];
  const firstNameB = pB.name.split(' ')[0];

  // Story active si en Mode Story
  const activeThemeStory = storyModeIndex !== null ? THEMATIC_VALUES[storyModeIndex] : null;
  const storyItem = activeThemeStory?.stories[0];

  return (
    <div 
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="w-full h-full max-h-full pb-20 sm:pb-24 pt-safe overflow-hidden flex flex-col justify-between select-none bg-white text-[#1C1917]"
    >
      
      {/* ========================================================================= */}
      {/* 1. STORIES THÉMATIQUES & DUOS : AUCUN TEXTE SOUS LES VIGNETTES            */}
      {/* ========================================================================= */}
      <div className="w-full max-w-3xl mx-auto px-3 sm:px-4 py-1.5 sm:py-2 shrink-0 h-[68px] sm:h-[76px] flex items-center">
        <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar py-1 px-1 w-full">
          
          {/* Vignette 0 : "+" */}
          <div 
            onClick={() => onNavigate({ type: 'submit_story' })}
            className="cursor-pointer group shrink-0"
            title="Créer une story"
          >
            <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl p-0.5 border-2 border-dashed border-[#A2482B] flex items-center justify-center group-hover:scale-105 transition-transform bg-amber-50/50">
              <div className="w-full h-full rounded-xl bg-[#A2482B] text-white flex items-center justify-center shadow-xs">
                <Plus className="w-4.5 h-4.5" />
              </div>
            </div>
          </div>

          {/* Vignettes Duos : DEUX VIGNETTES COLLÉES (DUO DE PROTAGONISTES) */}
          {filteredDuos.map((duo, idx) => {
            const isSelected = storyModeIndex === null && idx === safeIndex;
            return (
              <div
                key={duo.id}
                onClick={() => {
                  setStoryModeIndex(null);
                  setCurrentIndex(idx);
                  setSlideIndex(0);
                  celestialAudio.playOrbSelect();
                }}
                className="cursor-pointer group shrink-0"
                title={`${duo.protagonistA.name} ‹ › ${duo.protagonistB.name}`}
              >
                <div className={`h-12 sm:h-13 rounded-2xl p-0.5 border-2 transition-all group-hover:scale-105 flex items-center gap-0.5 ${
                  isSelected
                    ? 'border-[#A2482B] shadow-md ring-2 ring-[#A2482B]/20 scale-105 bg-stone-100'
                    : 'border-stone-200 hover:border-stone-400 bg-stone-50'
                }`}>
                  <div className="w-6 sm:w-6.5 h-full rounded-xl overflow-hidden bg-stone-900 relative">
                    <img src={duo.protagonistA.photoUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-6 sm:w-6.5 h-full rounded-xl overflow-hidden bg-stone-900 relative">
                    <img src={duo.protagonistB.photoUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            );
          })}

          {/* Vignettes Stories Personnelles (1 seule personne qui parle) */}
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
                className="cursor-pointer group shrink-0"
                title={`Story • ${theme.label}`}
              >
                <div className={`w-12 h-12 sm:w-13 sm:h-13 rounded-2xl p-0.5 border-2 transition-transform group-hover:scale-105 ${
                  isSelected 
                    ? 'border-amber-500 scale-105 shadow-md shadow-amber-500/20' 
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
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. ZONE CENTRALE : 1 PUBLICATION UNIQUE CALIBRÉE OU MODE STORY 3D JEU VIDÉO */}
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
        {/* CAS A : LE MODE STORY EST ACTIVÉ (MODE 3D CARROUSEL COVERFLOW JEU VIDÉO) */}
        {/* ======================================================================= */}
        {storyModeIndex !== null && activeThemeStory ? (
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            
            {/* Bouton de sortie épuré au sommet des stories */}
            <div className="absolute top-0 z-40 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStoryModeIndex(null)}
                className="px-3.5 py-1.5 rounded-full bg-stone-900/90 hover:bg-[#A2482B] text-white text-xs font-semibold shadow-lg backdrop-blur-md flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                title="Quitter les stories"
              >
                <X className="w-3.5 h-3.5" />
                <span>Quitter les stories</span>
              </button>
            </div>

            {/* SCÈNE 3D PERSPECTIVE JEU VIDÉO */}
            <div 
              className="relative w-full h-full flex items-center justify-center pointer-events-none mt-4"
              style={{ perspective: '1200px', perspectiveOrigin: 'center center' }}
            >
              <div 
                className="relative w-full h-full flex items-center justify-center pointer-events-none"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Carte Précédente en 3D (si existe) */}
                {(() => {
                  const prevIdx = (storyModeIndex - 1 + THEMATIC_VALUES.length) % THEMATIC_VALUES.length;
                  const prevTheme = THEMATIC_VALUES[prevIdx];
                  const prevStory = prevTheme.stories[0];
                  return (
                    <div
                      onClick={() => setStoryModeIndex(prevIdx)}
                      className="absolute aspect-[9/16] w-[min(260px,calc(100vw-60px))] sm:w-[280px] max-h-[min(480px,calc(100dvh-240px))] rounded-3xl overflow-hidden shadow-xl border border-stone-200/60 bg-stone-900 text-white cursor-pointer pointer-events-auto transition-transform duration-300 opacity-60 hover:opacity-85"
                      style={{
                        transform: 'translate3d(-55%, 0, -150px) rotateY(24deg) scale(0.85)',
                        zIndex: 10
                      }}
                    >
                      <img 
                        src={prevStory?.authorAvatar || '/assets/posters/vodun-autre-foi.png'} 
                        alt="" 
                        className="w-full h-full object-cover" 
                      />
                      <div className="absolute inset-0 bg-black/40" />
                    </div>
                  );
                })()}

                {/* Carte Suivante en 3D (si existe) */}
                {(() => {
                  const nextIdx = (storyModeIndex + 1) % THEMATIC_VALUES.length;
                  const nextTheme = THEMATIC_VALUES[nextIdx];
                  const nextStory = nextTheme.stories[0];
                  return (
                    <div
                      onClick={() => setStoryModeIndex(nextIdx)}
                      className="absolute aspect-[9/16] w-[min(260px,calc(100vw-60px))] sm:w-[280px] max-h-[min(480px,calc(100dvh-240px))] rounded-3xl overflow-hidden shadow-xl border border-stone-200/60 bg-stone-900 text-white cursor-pointer pointer-events-auto transition-transform duration-300 opacity-60 hover:opacity-85"
                      style={{
                        transform: 'translate3d(55%, 0, -150px) rotateY(-24deg) scale(0.85)',
                        zIndex: 10
                      }}
                    >
                      <img 
                        src={nextStory?.authorAvatar || '/assets/posters/roots-routes.jpg'} 
                        alt="" 
                        className="w-full h-full object-cover" 
                      />
                      <div className="absolute inset-0 bg-black/40" />
                    </div>
                  );
                })()}

                {/* CARTE CENTRALE ACTIVE */}
                <div 
                  className="relative aspect-[9/16] w-[min(310px,calc(100vw-36px))] sm:w-[320px] max-h-[min(540px,calc(100dvh-220px))] rounded-3xl overflow-hidden shadow-2xl border border-amber-500/40 bg-[#12110F] text-white flex flex-col justify-between select-none pointer-events-auto"
                  style={{
                    transform: 'translate3d(0, 0, 0) scale(1)',
                    zIndex: 20
                  }}
                >
                  {/* Header Story : Thématique à gauche & Mute à droite */}
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
                    </div>
                  </div>

                  {/* Média vidéo ou photo */}
                  <div 
                    className="absolute inset-0 z-10 cursor-pointer"
                    onClick={() => setIsPlaying(p => !p)}
                  >
                    {storyItem ? (
                      <video
                        ref={videoRef}
                        key={`story-video-${storyItem.id}`}
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

                  {/* Flanc Droit : Question et Partage */}
                  <div className="absolute right-2.5 bottom-16 z-30 flex flex-col items-center gap-2 pointer-events-auto">
                    <button
                      onClick={() => setShowStoryQuestion(true)}
                      className="w-8 h-8 rounded-xl bg-black/60 backdrop-blur-md text-white hover:bg-[#A2482B] border border-white/15 flex items-center justify-center transition-all cursor-pointer shadow-sm group"
                      title="Consulter la question de la story"
                    >
                      <HelpCircle className="w-4 h-4 text-amber-300" />
                    </button>
                    <button
                      onClick={() => setShareModalItem({ title: `Story ${activeThemeStory.label}`, id: activeThemeStory.id })}
                      className="w-8 h-8 rounded-xl bg-black/60 backdrop-blur-md text-white hover:bg-[#A2482B] border border-white/15 flex items-center justify-center transition-all cursor-pointer shadow-sm group"
                      title="Partager"
                    >
                      <ShareIcon className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Bas de Story : Prénom */}
                  <div className="relative z-20 p-4 space-y-0.5 pointer-events-none">
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
                        « {storyItem?.question || activeThemeStory.question || `Racontez comment dans votre vie une expérience vous a appris la valeur de ${activeThemeStory.label.toLowerCase()}.`} »
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ======================================================================= */
          /* CAS B : PUBLICATION NORMALE (DUO EN 3 VOLETS)                           */
          /* ======================================================================= */
          <div className="relative aspect-[9/16] w-[min(310px,calc(100vw-36px))] sm:w-[320px] max-h-[min(540px,calc(100dvh-220px))] rounded-3xl overflow-hidden shadow-2xl border border-stone-200/90 bg-[#12110F] text-white flex flex-col justify-between select-none">
            
            {/* VOLET 1 (PROTAGONISTE A) ET VOLET 2 (PROTAGONISTE B) */}
            {slideIndex !== 2 ? (
              <>
                {/* EN-TÊTE DE CARTE : TITRE DE LA SÉRIE EN HAUT À GAUCHE & BOUTON TÉLÉ EN HAUT À DROITE */}
                <div className="relative z-20 pt-3.5 px-3 flex items-center justify-between gap-1 pointer-events-auto">
                  <div className="inline-flex w-fit items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 shadow-md max-w-[75%]">
                    <span className="font-editorial text-xs font-semibold text-white whitespace-nowrap tracking-wide select-none truncate">
                      {rawSeriesTitle}
                    </span>
                  </div>

                  {/* Bouton Télé Vintage de Lecture en haut à droite */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsPlaying(p => !p);
                    }}
                    className={`w-8.5 h-8.5 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-95 ${
                      isPlaying 
                        ? 'bg-[#A2482B] text-white border border-[#8A3B22]' 
                        : 'bg-black/60 backdrop-blur-md text-white border border-white/20 hover:bg-black/80'
                    }`}
                    title={isPlaying ? 'Mettre en pause' : 'Lancer la vidéo'}
                  >
                    <TvPlayerIcon className="w-4.5 h-4.5 text-current" />
                  </button>
                </div>

                {/* MEDIA DE FOND : L'IMAGE S'EFFACE POUR LA VIDÉO LORS DE LA LECTURE */}
                <div 
                  className="absolute inset-0 z-10 cursor-pointer"
                  onClick={() => setIsPlaying(p => !p)}
                >
                  {isPlaying ? (
                    <video
                      ref={videoRef}
                      key={`video-${slideIndex}-${currentDuo.id}`}
                      src={currentVideoUrl}
                      autoPlay
                      loop
                      muted={isMuted}
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img 
                      src={activeProtagonist.photoUrl} 
                      alt={activeProtagonist.name}
                      className="w-full h-full object-cover"
                    />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />
                </div>

                {/* COLONNE D'ICÔNES LATÉRALE DROITE : SQUIRCLES (rounded-xl) */}
                <div className="absolute right-2.5 bottom-16 z-30 flex flex-col items-center gap-2 pointer-events-auto">
                  
                  {/* 1. Icône Question Documentaire */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowQuestionModal(true);
                    }}
                    className="w-8 h-8 rounded-xl bg-black/60 backdrop-blur-md text-white hover:bg-[#A2482B] border border-white/15 flex items-center justify-center transition-all cursor-pointer shadow-sm group"
                    title="Question documentaire"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-white group-hover:scale-110 transition-transform" />
                  </button>

                  {/* 2. Icône Échange ⇄ */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      goToSlide(slideIndex === 0 ? 1 : 0);
                    }}
                    className="w-8 h-8 rounded-xl bg-black/60 backdrop-blur-md text-white hover:bg-[#A2482B] border border-white/15 flex items-center justify-center transition-all cursor-pointer shadow-sm group"
                    title={slideIndex === 0 ? `Voir ${firstNameB}` : `Voir ${firstNameA}`}
                  >
                    <span className="font-bold text-xs tracking-tight">⇄</span>
                  </button>

                  {/* 3. Icône Portrait Solo : ouvre la page portrait de CETTE personne */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigate({ type: 'profile', protagonistId: activeProtagonist.id });
                    }}
                    className="w-8 h-8 rounded-xl bg-black/60 backdrop-blur-md text-white hover:bg-[#A2482B] border border-white/15 flex items-center justify-center transition-all cursor-pointer shadow-sm group"
                    title={`Portrait de ${firstName}`}
                  >
                    <ProfileSoloIcon className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                  </button>

                  {/* 4. Icône Partage : l'ancienne icône flèche ascendante + arche */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShareModalItem({ title: `Duo : ${activeProtagonist.name}`, id: activeProtagonist.id });
                    }}
                    className="w-8 h-8 rounded-xl bg-black/60 backdrop-blur-md text-white hover:bg-[#A2482B] border border-white/15 flex items-center justify-center transition-all cursor-pointer shadow-sm group"
                    title="Partager"
                  >
                    <ShareIcon className="w-4 h-4" />
                  </button>
                </div>

                {/* BAS DE CARTE ÉPURÉ : UNIQUEMENT LE PRÉNOM */}
                <div className="relative z-20 p-4 space-y-0.5 pointer-events-none">
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
                    {firstName}
                  </h2>
                </div>
              </>
            ) : (
              /* VOLET 3 : LE FACE-À-FACE ET LE CURSEUR 50/50 ÉPURÉ */
              <ResonanceFaceToFaceCard
                protagonistA={pA}
                protagonistB={pB}
                seriesTitle={rawSeriesTitle}
                duoQuestion={duoQuestion}
                onNavigateToSlide={goToSlide}
                onNavigateToPortrait={(id) => onNavigate({ type: 'profile', protagonistId: id })}
              />
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
                Question documentaire
              </span>
              <button onClick={() => setShowQuestionModal(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm font-semibold text-stone-900 leading-relaxed">
              « {duoQuestion} »
            </p>
            <p className="text-xs text-stone-500 leading-relaxed">
              Sur YonyWood, la question est posée en amont. Les deux protagonistes y répondent chacun dans leur vérité avant d'être reliés en miroir.
            </p>
          </div>
        </div>
      )}

      {/* Modale Partage */}
      {shareModalItem && (
        <VideoCardShareModal
          isOpen={Boolean(shareModalItem)}
          onClose={() => setShareModalItem(null)}
          videoTitle={shareModalItem.title}
          videoId={shareModalItem.id}
        />
      )}

    </div>
  );
};
