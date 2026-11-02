import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  X, 
  Film,
  Plus,
  Award
} from 'lucide-react';
import { celestialAudio } from '../utils/celestialAudio';
import { apiService } from '../services/api';
import { ViewScreen, Duo, Protagonist, FeedPublicationItem } from '../types';
import { DOCUMENTARIES as MOCK_DOCS, DUOS as MOCK_DUOS } from '../data/mockData';
import { PERSON_STORIES, ThematicStory } from '../data/thematicStoriesData';
import { FOUR_FACES_PUBLICATIONS } from '../data/fourFacesFeedData';
import { ResonanceFaceToFaceCard } from './ResonanceFaceToFaceCard';
import { VideoCardShareModal } from './VideoCardShareModal';
import { StoriesStudioCoverflow } from './StoriesStudioCoverflow';
import { FourFacesCard } from './FourFacesCard';
import { ProfileSoloIcon, TvPlayerIcon, RoundedSwipeArrowsIcon } from './YonywoodBrandIcons';
import { ShareIcon } from './ShareIcon';
import { getBlockedVideoIds } from '../utils/blockedContent';
import { formatFirstLetterOnly } from '../utils/textFormatters';

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

  // Index de la publication active dans le Feed (Duo ou Carte 4 visages)
  const [currentIndex, setCurrentIndex] = useState(initialDuoIndex);

  // Position dans le diaporama horizontal du Duo (0: Volet A, 1: Question & Curseur au centre par défaut, 2: Volet B)
  const [slideIndex, setSlideIndex] = useState<0 | 1 | 2>(1);

  // Visionneuse de stories immersives style Coverflow Studio
  const [isStoryViewerOpen, setIsStoryViewerOpen] = useState(false);
  const [storyViewerIndex, setStoryViewerIndex] = useState(0);

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
      } catch {
        setDuos(MOCK_DUOS);
        setDocumentaries(MOCK_DOCS);
      } finally {
        setLoadingData(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const handleBlocked = () => setBlockedIds(getBlockedVideoIds());
    window.addEventListener('yonywood_video_blocked', handleBlocked);
    return () => window.removeEventListener('yonywood_video_blocked', handleBlocked);
  }, []);

  // 1. Filtrer les Duos
  const filteredDuos = useMemo(() => {
    return (allowedSeriesIds && allowedSeriesIds.length > 0
      ? DUOS.filter(d => allowedSeriesIds.includes(d.documentaryId))
      : DUOS
    ).filter(d => !blockedIds.includes(d.protagonistA?.id) && !blockedIds.includes(d.protagonistB?.id));
  }, [DUOS, allowedSeriesIds, blockedIds]);

  // 2. Construire le Feed unifié : Duos documentaires avec Cartes à 4 visages intercalées par intermittence
  const feedItems = useMemo<FeedPublicationItem[]>(() => {
    const items: FeedPublicationItem[] = [];
    let ffIndex = 0;

    filteredDuos.forEach((duo, idx) => {
      items.push({ type: 'duo', data: duo });
      // Par intermittence : insérer une Carte à quatre visages tous les 2 duos
      if ((idx + 1) % 2 === 0 && FOUR_FACES_PUBLICATIONS.length > 0) {
        items.push({
          type: 'four_faces',
          data: FOUR_FACES_PUBLICATIONS[ffIndex % FOUR_FACES_PUBLICATIONS.length]
        });
        ffIndex++;
      }
    });

    // S'assurer qu'au moins une carte à 4 visages est présente dans le feed
    if (items.length > 0 && !items.some(it => it.type === 'four_faces') && FOUR_FACES_PUBLICATIONS.length > 0) {
      items.push({
        type: 'four_faces',
        data: FOUR_FACES_PUBLICATIONS[0]
      });
    }

    return items;
  }, [filteredDuos]);

  // Calibrer l'index initial si initialDuoId spécifié
  useEffect(() => {
    if (initialDuoId && feedItems.length > 0) {
      const idx = feedItems.findIndex(item => item.type === 'duo' && item.data.id === initialDuoId);
      if (idx !== -1) setCurrentIndex(idx);
    }
  }, [initialDuoId, feedItems]);

  const safeIndex = feedItems.length > 0 ? (currentIndex % feedItems.length) : 0;
  const currentItem: FeedPublicationItem | undefined = feedItems[safeIndex];

  // Arrivée par défaut sur la carte Question au centre pour chaque publication Duo
  useEffect(() => {
    setIsPlaying(false);
    setSlideIndex(currentItem?.type === 'duo' ? 1 : 0);
  }, [currentIndex, currentItem?.type]);

  const handleNextPublication = () => {
    if (feedItems.length <= 1) return;
    setIsPlaying(false);
    setSlideIndex(1);
    setCurrentIndex(prev => (prev + 1) % feedItems.length);
    celestialAudio.playOrbSelect();
  };

  const handlePrevPublication = () => {
    if (feedItems.length <= 1) return;
    setIsPlaying(false);
    setSlideIndex(1);
    setCurrentIndex(prev => (prev - 1 + feedItems.length) % feedItems.length);
    celestialAudio.playOrbSelect();
  };

  const goToSlide = (target: 0 | 1 | 2) => {
    setIsPlaying(false);
    setSlideIndex(target);
    celestialAudio.playOrbSelect();
  };

  const nextSlide = () => {
    if (!currentItem) return;
    if (currentItem.type === 'duo') {
      if (slideIndex < 2) {
        goToSlide((slideIndex + 1) as 0 | 1 | 2);
      } else {
        handleNextPublication();
      }
    } else {
      // Pour une Carte à 4 visages, le swipe horizontal avance à la publication suivante
      handleNextPublication();
    }
  };

  const prevSlide = () => {
    if (!currentItem) return;
    if (currentItem.type === 'duo') {
      if (slideIndex > 0) {
        goToSlide((slideIndex - 1) as 0 | 1 | 2);
      } else {
        handlePrevPublication();
      }
    } else {
      handlePrevPublication();
    }
  };

  // Passerelle Story -> Duo documentaire de l'auteur
  const handleGatewayToDuo = (story: ThematicStory) => {
    setIsStoryViewerOpen(false);
    let targetIndex = -1;
    let preferredSlide: 0 | 1 | 2 = 0;

    // 1. Chercher par duoId
    if (story.duoId) {
      targetIndex = feedItems.findIndex(item => 
        item.type === 'duo' && (item.data.id === story.duoId || item.data.slug === story.duoId)
      );
    }

    // 2. Chercher par authorId ou authorName
    if (targetIndex === -1 && story.authorId) {
      targetIndex = feedItems.findIndex(item => {
        if (item.type !== 'duo') return false;
        const d = item.data;
        if (d.protagonistA?.id?.toLowerCase().includes(story.authorId.toLowerCase()) || 
            d.protagonistA?.name?.toLowerCase().includes(story.authorName.toLowerCase())) {
          preferredSlide = 0;
          return true;
        }
        if (d.protagonistB?.id?.toLowerCase().includes(story.authorId.toLowerCase()) || 
            d.protagonistB?.name?.toLowerCase().includes(story.authorName.toLowerCase())) {
          preferredSlide = 2;
          return true;
        }
        return false;
      });
    }

    // 3. Chercher par documentaryId
    if (targetIndex === -1 && story.documentaryId) {
      targetIndex = feedItems.findIndex(item => item.type === 'duo' && item.data.documentaryId === story.documentaryId);
    }

    if (targetIndex !== -1) {
      setCurrentIndex(targetIndex);
      setSlideIndex(preferredSlide);
    } else if (feedItems.length > 0) {
      setCurrentIndex(0);
      setSlideIndex(0);
    }
    celestialAudio.playOrbSelect();
  };

  // Gestion du Wheel (Swipe vertical = 1 publication change, horizontal = séquence)
  const handleWheel = (e: React.WheelEvent) => {
    if (isStoryViewerOpen) return;
    const now = Date.now();
    if (now - lastScrollTime.current < 450) return;

    if (Math.abs(e.deltaY) > 30) {
      lastScrollTime.current = now;
      if (e.deltaY > 0) {
        handleNextPublication();
      } else {
        handlePrevPublication();
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

  // Progression de lecture vidéo (curseur qui apparaît lors de la lecture)
  const [videoProgress, setVideoProgress] = useState(0);

  // Déplacement visuel en temps réel lors du swipe 2D (vertical = publication, horizontal = séquence)
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const touchStartPos = useRef<{ x: number; y: number; time: number } | null>(null);
  const isMouseDownRef = useRef(false);

  // Synchronisation du curseur de progression pendant la lecture
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        if (videoRef.current && videoRef.current.duration) {
          const pct = (videoRef.current.currentTime / videoRef.current.duration) * 100;
          setVideoProgress(pct);
        }
      }, 100);
    } else {
      setVideoProgress(0);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Touch Swipe avec retour visuel immédiat (drag)
  const handleCardTouchStart = (e: React.TouchEvent) => {
    if (isStoryViewerOpen) return;
    if ((e.target as HTMLElement).closest('button, input, [role="button"]')) return;
    touchStartPos.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      time: Date.now()
    };
    setIsDragging(true);
  };

  const handleCardTouchMove = (e: React.TouchEvent) => {
    if (!touchStartPos.current) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const deltaX = currentX - touchStartPos.current.x;
    const deltaY = currentY - touchStartPos.current.y;

    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      // Swipe vertical prédominant : déplacer la carte de haut en bas
      setDragOffset({ x: 0, y: Math.max(-130, Math.min(130, deltaY * 0.75)) });
    } else {
      // Swipe horizontal prédominant : déplacer la carte de gauche à droite
      setDragOffset({ x: Math.max(-110, Math.min(110, deltaX * 0.75)), y: 0 });
    }
  };

  const handleCardTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartPos.current) return;
    const currentX = e.changedTouches[0].clientX;
    const currentY = e.changedTouches[0].clientY;
    const deltaX = currentX - touchStartPos.current.x;
    const deltaY = currentY - touchStartPos.current.y;
    const elapsed = Math.max(1, Date.now() - touchStartPos.current.time);
    touchStartPos.current = null;
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });

    const velocityY = Math.abs(deltaY) / elapsed;
    const velocityX = Math.abs(deltaX) / elapsed;

    // Déclenchement vertical : publication suivante ou précédente
    if (Math.abs(deltaY) > Math.abs(deltaX) && (Math.abs(deltaY) > 35 || velocityY > 0.22)) {
      if (deltaY < 0) {
        handleNextPublication();
      } else {
        handlePrevPublication();
      }
    } else if (Math.abs(deltaX) > 35 || velocityX > 0.22) {
      // Déclenchement horizontal : protagoniste suivant ou précédent
      if (deltaX < 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  };

  // Drag souris desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isStoryViewerOpen) return;
    if ((e.target as HTMLElement).closest('button, input, [role="button"]')) return;
    touchStartPos.current = {
      x: e.clientX,
      y: e.clientY,
      time: Date.now()
    };
    isMouseDownRef.current = true;
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDownRef.current || !touchStartPos.current) return;
    const deltaX = e.clientX - touchStartPos.current.x;
    const deltaY = e.clientY - touchStartPos.current.y;
    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      setDragOffset({ x: 0, y: Math.max(-130, Math.min(130, deltaY * 0.75)) });
    } else {
      setDragOffset({ x: Math.max(-110, Math.min(110, deltaX * 0.75)), y: 0 });
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isMouseDownRef.current || !touchStartPos.current) return;
    const deltaX = e.clientX - touchStartPos.current.x;
    const deltaY = e.clientY - touchStartPos.current.y;
    const elapsed = Math.max(1, Date.now() - touchStartPos.current.time);
    isMouseDownRef.current = false;
    touchStartPos.current = null;
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });

    const velocityY = Math.abs(deltaY) / elapsed;
    const velocityX = Math.abs(deltaX) / elapsed;

    if (Math.abs(deltaY) > Math.abs(deltaX) && (Math.abs(deltaY) > 35 || velocityY > 0.22)) {
      if (deltaY < 0) {
        handleNextPublication();
      } else {
        handlePrevPublication();
      }
    } else if (Math.abs(deltaX) > 35 || velocityX > 0.22) {
      if (deltaX < 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  };

  if (loadingData) {
    return <div className="min-h-screen bg-white text-stone-900 flex items-center justify-center font-medium">Chargement des dialogues...</div>;
  }

  if (!currentItem) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center bg-white text-[#1C1917] space-y-3">
        <Film className="w-10 h-10 text-stone-300" />
        <h3 className="font-editorial text-xl font-bold">Aucune publication dans cette sélection</h3>
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

  // Cas 1 : DUO DOCUMENTAIRE
  const currentDuo = currentItem.type === 'duo' ? currentItem.data : null;
  const pA = currentDuo?.protagonistA;
  const pB = currentDuo?.protagonistB;

  const rawSeriesTitle = currentDuo?.documentaryTitle || 'Dialogue en miroir';
  const duoQuestion = currentDuo?.centralQuestion || currentDuo?.questionTitle || pA?.quote || 'Quelle est la leçon fondamentale que la vie vous a enseignée ?';

  const docTeaser = currentDuo ? DOCUMENTARIES.find(d => d.id === currentDuo.documentaryId)?.teaserVideoUrl : undefined;
  const videoUrlA = pA?.videoAvatarUrl || docTeaser || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
  const videoUrlB = pB?.videoAvatarUrl || docTeaser || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';

  return (
    <div 
      onWheel={handleWheel}
      className="w-full h-full max-h-full pb-20 sm:pb-24 pt-safe overflow-hidden flex flex-col justify-between select-none bg-white text-[#1C1917]"
    >
      
      {/* ========================================================================= */}
      {/* 1. EN-TÊTE STORIES : FOND BEIGE #F7EFE6 PLEINE LARGEUR & COINS ARRONDIS    */}
      {/* ========================================================================= */}
      <div 
        className="w-full shrink-0 z-30 rounded-b-[22px]"
        style={{ 
          backgroundColor: 'var(--color-header-bg, #F7EFE6)',
          boxShadow: '0 2px 12px rgba(46, 27, 20, 0.06)' 
        }}
      >
        <div className="w-full max-w-3xl mx-auto px-3 sm:px-4 pt-1 pb-2 shrink-0 h-[68px] sm:h-[76px] flex items-center overflow-hidden">
          <div 
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'auto' }}
            className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar py-1 px-1 pb-5 -mb-4 w-full overscroll-x-contain touch-pan-x"
          >
            
            {/* Bouton "+" deux fois plus petit, sans contour superflu */}
            <button 
              type="button"
              onClick={() => onNavigate({ type: 'submit_story' })}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#A2482B] hover:bg-[#8A3B22] text-white flex items-center justify-center shrink-0 shadow-xs active:scale-95 transition-transform cursor-pointer mr-0.5"
              title="Créer une story"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
            </button>

            {/* Vignettes Stories Individuelles avec anneau blanc net sur fond beige */}
            {PERSON_STORIES.map((story, idx) => (
              <div
                key={story.id}
                onClick={() => {
                  setStoryViewerIndex(idx);
                  setIsStoryViewerOpen(true);
                  celestialAudio.playOrbSelect();
                }}
                className="cursor-pointer group shrink-0"
                title={`${story.authorName} — Story ${story.themeLabel}`}
              >
                <div className="w-[52px] h-[52px] sm:w-14 sm:h-14 rounded-2xl p-0.5 border-2 border-white ring-1 ring-black/5 group-hover:border-[#A2482B] transition-all group-hover:scale-105 bg-white shadow-xs">
                  <div className="w-full h-full rounded-xl overflow-hidden bg-stone-900 relative">
                    <img 
                      src={story.authorAvatar} 
                      alt="" 
                      className="w-full h-full object-cover pointer-events-none" 
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. ZONE CENTRALE DU FEED : DUO DOCUMENTAIRE OU CARTE À QUATRE VISAGES      */}
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

        {/* BRANCHE A : CARTE À QUATRE VISAGES (PAR INTERMITTENCE) */}
        {currentItem.type === 'four_faces' ? (
          <FourFacesCard
            publication={currentItem.data}
            isActive={!isStoryViewerOpen}
            onComplete={handleNextPublication}
          />
        ) : currentDuo && pA && pB ? (
          /* BRANCHE B : CARROUSEL 3D DU TRIPTYQUE DU DUO (A, ÉVALUATION, B) */
          <div 
            onTouchStart={handleCardTouchStart}
            onTouchMove={handleCardTouchMove}
            onTouchEnd={handleCardTouchEnd}
            onTouchCancel={() => { touchStartPos.current = null; setIsDragging(false); setDragOffset({ x: 0, y: 0 }); }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            className="relative w-full flex-1 flex items-center justify-center min-h-0 select-none touch-none"
            style={{ 
              perspective: '1200px',
              perspectiveOrigin: 'center center'
            }}
          >
            <div 
              className="relative w-full h-full flex items-center justify-center pointer-events-none"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {[0, 1, 2].map((idx) => {
                const diff = idx - slideIndex;
                const isCenter = diff === 0;

                let transformStyle = '';
                let zIndex = 10;
                let opacity = 0;
                let pointerEvents: 'auto' | 'none' = 'none';

                if (diff === 0) {
                  // Carte active au centre
                  transformStyle = `translateX(${dragOffset.x}px) translateY(${dragOffset.y}px) translateZ(45px) rotateY(${dragOffset.x * -0.1}deg) scale(1)`;
                  zIndex = 30;
                  opacity = 1;
                  pointerEvents = 'auto';
                } else if (diff === 1) {
                  // Voisine droite (ex: Évaluation quand sur A, ou B quand sur Évaluation)
                  transformStyle = `translateX(calc(58% + ${dragOffset.x}px)) translateY(${dragOffset.y * 0.4}px) translateZ(-50px) rotateY(-22deg) scale(0.86)`;
                  zIndex = 20;
                  opacity = 0.78;
                  pointerEvents = 'auto';
                } else if (diff === -1) {
                  // Voisine gauche (ex: A quand sur Évaluation, ou Évaluation quand sur B)
                  transformStyle = `translateX(calc(-58% + ${dragOffset.x}px)) translateY(${dragOffset.y * 0.4}px) translateZ(-50px) rotateY(22deg) scale(0.86)`;
                  zIndex = 20;
                  opacity = 0.78;
                  pointerEvents = 'auto';
                } else {
                  // Carte éloignée
                  transformStyle = `translateX(calc(${diff > 0 ? '110%' : '-110%'} + ${dragOffset.x}px)) translateZ(-160px) rotateY(${diff > 0 ? '-35deg' : '35deg'}) scale(0.72)`;
                  zIndex = 10;
                  opacity = 0;
                  pointerEvents = 'none';
                }

                return (
                  <div
                    key={`duo-slide-${currentDuo.id}-${idx}`}
                    onClick={() => {
                      if (!isCenter) {
                        goToSlide(idx as 0 | 1 | 2);
                      }
                    }}
                    style={{
                      transform: transformStyle,
                      zIndex,
                      opacity,
                      pointerEvents,
                      transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.26s ease'
                    }}
                    className={`absolute aspect-[9/16] w-[min(calc(100vw-64px),calc((100dvh-230px)*9/16))] max-w-[228px] sm:max-w-[270px] md:max-w-[290px] h-[min(410px,calc(100dvh-230px))] sm:h-[min(480px,calc(100dvh-200px))] md:h-[min(520px,calc(100dvh-180px))] rounded-2xl sm:rounded-3xl overflow-hidden border ${
                      idx === 1 ? 'bg-[#A2482B]' : 'bg-[#12110F]'
                    } text-white flex flex-col justify-between select-none ${
                      isCenter 
                        ? idx === 1
                          ? 'border-[#C86747] shadow-2xl ring-1 ring-[#E27857]/40'
                          : 'border-stone-200/90 shadow-2xl ring-1 ring-white/20' 
                        : 'border-white/15 shadow-lg cursor-pointer hover:border-white/30'
                    }`}
                  >
                    {idx === 1 ? (
                      /* VOLET 2 : LA CARTE D'ÉVALUATION ET DE RÉSONANCE AU CENTRE DU TRIPTYQUE */
                      <ResonanceFaceToFaceCard
                        protagonistA={pA}
                        protagonistB={pB}
                        seriesTitle={rawSeriesTitle}
                        duoQuestion={duoQuestion}
                        duoId={currentDuo.id}
                        onNavigateToSlide={goToSlide}
                        onNavigateToPortrait={(id) => onNavigate({ type: 'profile', protagonistId: id })}
                      />
                    ) : (
                      /* VOLET 1 (idx === 0, A) OU VOLET 3 (idx === 2, B) : CARTES VIDÉO DES PROTAGONISTES */
                      (() => {
                        const protagonist = idx === 0 ? pA : pB;
                        const otherProtagonist = idx === 0 ? pB : pA;
                        const otherSlideTarget = idx === 0 ? 2 : 0;
                        const videoUrl = idx === 0 ? videoUrlA : videoUrlB;
                        const pFirstName = protagonist.name.split(' ')[0];
                        const otherFirstName = otherProtagonist.name.split(' ')[0];
                        const isThisVideoPlaying = isCenter && isPlaying;

                        return (
                          <>
                            {/* EN-TÊTE DE CARTE : TITRE DE LA SÉRIE EN HAUT À GAUCHE & BOUTON TÉLÉ EN HAUT À DROITE */}
                            <div className="relative z-20 pt-3.5 px-3 flex items-center justify-between gap-1 pointer-events-auto">
                              <div className="inline-flex w-fit items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 shadow-md max-w-[75%]">
                                <span className="font-editorial text-xs font-semibold text-white whitespace-nowrap tracking-wide select-none truncate">
                                  {formatFirstLetterOnly(rawSeriesTitle)}
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
                                  isThisVideoPlaying 
                                    ? 'bg-[#A2482B] text-white border border-[#8A3B22]' 
                                    : 'bg-black/60 backdrop-blur-md text-white border border-white/20 hover:bg-black/80'
                                }`}
                                title={isThisVideoPlaying ? 'Mettre en pause' : 'Lancer la vidéo'}
                              >
                                <TvPlayerIcon className="w-4.5 h-4.5 text-current" />
                              </button>
                            </div>

                            {/* MEDIA DE FOND : VIDÉO OU PHOTO HD */}
                            <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
                              {isThisVideoPlaying ? (
                                <video
                                  ref={videoRef}
                                  key={`video-${idx}-${currentDuo.id}`}
                                  src={videoUrl}
                                  autoPlay
                                  loop
                                  muted={isMuted}
                                  playsInline
                                  className="w-full h-full object-cover pointer-events-none"
                                />
                              ) : (
                                <img
                                  src={protagonist.photoUrl}
                                  alt={protagonist.name}
                                  className="w-full h-full object-cover pointer-events-none"
                                />
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />
                            </div>


                            {/* COLONNE D'ACTIONS LATÉRALE DROITE (ÉPURÉE : MUTE, PROTAGONISTE MIROIR, PORTRAIT, PARTAGE) */}
                            <div className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-2.5 pointer-events-auto">
                              {/* 1. Mute toggle si vidéo en lecture */}
                              {isThisVideoPlaying && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setIsMuted(m => !m);
                                  }}
                                  className="w-8.5 h-8.5 rounded-xl bg-black/60 backdrop-blur-md text-white hover:bg-[#A2482B] border border-white/15 flex items-center justify-center transition-all cursor-pointer shadow-sm group"
                                  title={isMuted ? 'Activer le son' : 'Couper le son'}
                                >
                                  {isMuted ? <span className="text-xs">🔇</span> : <span className="text-xs">🔊</span>}
                                </button>
                              )}

                              {/* 2. Photo de profil du second protagoniste : bascule directement vers sa vidéo */}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  goToSlide(otherSlideTarget as 0 | 2);
                                }}
                                className="w-9 h-9 rounded-xl overflow-hidden p-0.5 border border-white/30 hover:border-[#A2482B] shadow-md flex items-center justify-center transition-all cursor-pointer group active:scale-95 bg-black/60 backdrop-blur-md"
                                title={`Passer à la vidéo de ${otherFirstName}`}
                              >
                                <img 
                                  src={otherProtagonist.photoUrl} 
                                  alt={otherFirstName}
                                  className="w-full h-full object-cover rounded-lg group-hover:scale-110 transition-transform pointer-events-none"
                                />
                              </button>

                              {/* 3. Icône Portrait Solo */}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onNavigate({ type: 'profile', protagonistId: protagonist.id });
                                }}
                                className="w-8.5 h-8.5 rounded-xl bg-black/60 backdrop-blur-md text-white hover:bg-[#A2482B] border border-white/15 flex items-center justify-center transition-all cursor-pointer shadow-sm group"
                                title={`Portrait de ${pFirstName}`}
                              >
                                <ProfileSoloIcon className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                              </button>

                              {/* 4. Icône Partage */}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShareModalItem({ title: `Duo : ${protagonist.name}`, id: protagonist.id });
                                }}
                                className="w-8.5 h-8.5 rounded-xl bg-black/60 backdrop-blur-md text-white hover:bg-[#A2482B] border border-white/15 flex items-center justify-center transition-all cursor-pointer shadow-sm group"
                                title="Partager"
                              >
                                <ShareIcon className="w-4 h-4" />
                              </button>
                            </div>

                            {/* BAS DE CARTE ÉPURÉ : PRÉNOM EN BAS À GAUCHE & CURSEUR EN DESSOUS */}
                            <div className="absolute bottom-3.5 sm:bottom-4 left-3.5 sm:left-4 z-20 pointer-events-none flex flex-col items-start">
                              <h2 className="font-editorial text-base sm:text-lg font-bold text-white tracking-wide drop-shadow-md truncate max-w-[170px] sm:max-w-[210px] leading-tight">
                                {pFirstName}
                              </h2>

                              <div className="h-2 flex items-center mt-1">
                                <div 
                                  className={`w-20 sm:w-24 h-1 bg-white/25 rounded-full overflow-hidden shadow-xs transition-opacity duration-200 ${
                                    isThisVideoPlaying ? 'opacity-100' : 'opacity-0'
                                  }`}
                                >
                                  <div 
                                    className="h-full bg-white transition-all duration-100 rounded-full"
                                    style={{ width: `${Math.max(2, Math.min(100, videoProgress))}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          </>
                        );
                      })()
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}

      </div>

      {/* ========================================================================= */}
      {/* 3. VISIONNEUSE DE STORIES EN CARROUSEL 3D (STYLE PAGE STUDIO, 64s MAX)     */}
      {/* ========================================================================= */}
      <StoriesStudioCoverflow
        stories={PERSON_STORIES}
        initialIndex={storyViewerIndex}
        isOpen={isStoryViewerOpen}
        onClose={() => setIsStoryViewerOpen(false)}
        onNavigateToDuo={handleGatewayToDuo}
      />

      {/* ========================================================================= */}
      {/* 4. MODALES : QUESTION ET PARTAGE                                         */}
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
                Question
              </span>
              <button onClick={() => setShowQuestionModal(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm font-semibold text-stone-900 leading-relaxed">
              « {duoQuestion} »
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
