import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  X, 
  Plus
} from 'lucide-react';
import { ViewScreen } from '../types';
import { CompanyEntity, CompanyStakeholder, COMPANIES_DATA } from '../data/companyPortraitsData';
import { ENTERPRISE_STORIES, ThematicStory } from '../data/thematicStoriesData';
import { ProfileSoloIcon, TvPlayerIcon, RoundedSwipeArrowsIcon } from './YonywoodBrandIcons';
import { ShareIcon } from './ShareIcon';
import { StoriesStudioCoverflow } from './StoriesStudioCoverflow';
import { VideoCardShareModal } from './VideoCardShareModal';
import { celestialAudio } from '../utils/celestialAudio';
import { formatFirstLetterOnly } from '../utils/textFormatters';

export type { CompanyStakeholder, CompanyEntity };
export { COMPANIES_DATA };

interface CompanyHeritageScreenProps {
  onNavigate?: (screen: ViewScreen) => void;
  initialCompanyId?: string;
  selectedCompanyId?: string;
}

export const ENTERPRISE_CATEGORIES = [
  'HISTOIRE',
  'FONDATION',
  'VISION',
  'PHILOSOPHIE',
  'PRODUITS & SERVICES',
  'CRÉATIVITÉ & INNOVATION',
  'IMPACT',
  'ENGAGEMENT'
] as const;

export type EnterpriseCategory = typeof ENTERPRISE_CATEGORIES[number];

export interface CompanyDuo {
  id: string;
  category: EnterpriseCategory;
  themeQuestion: string;
  companyA: CompanyEntity;
  companyB: CompanyEntity;
}

// 8 Publications documentaires en duo ordonnées selon les huit catégories officielles
export const COMPANY_DUOS: CompanyDuo[] = [
  {
    id: 'c-duo-1',
    category: 'HISTOIRE',
    themeQuestion: 'Comment est née votre histoire et quelles racines continuent de vous porter ?',
    companyA: COMPANIES_DATA[2] || COMPANIES_DATA[0], // Aura Tech
    companyB: COMPANIES_DATA[0] || COMPANIES_DATA[1], // Terre Féconde
  },
  {
    id: 'c-duo-2',
    category: 'FONDATION',
    themeQuestion: 'Quelle étincelle fondatrice a donné vie à votre entreprise ?',
    companyA: COMPANIES_DATA[1] || COMPANIES_DATA[0], // Hélios Ray
    companyB: COMPANIES_DATA[3] || COMPANIES_DATA[2], // Kpèdétin Joaillerie
  },
  {
    id: 'c-duo-3',
    category: 'VISION',
    themeQuestion: 'Quelle vision prospective du monde guide vos ambitions ?',
    companyA: COMPANIES_DATA[6] || COMPANIES_DATA[0], // Sènami Architecture
    companyB: COMPANIES_DATA[4] || COMPANIES_DATA[1], // Bio Solaire
  },
  {
    id: 'c-duo-4',
    category: 'PHILOSOPHIE',
    themeQuestion: 'Quelles convictions éthiques et humaines guident chacune de vos décisions ?',
    companyA: COMPANIES_DATA[7] || COMPANIES_DATA[0], // Kiki Passeur de Mémoire
    companyB: COMPANIES_DATA[5] || COMPANIES_DATA[1], // Nectar Botanique
  },
  {
    id: 'c-duo-5',
    category: 'PRODUITS & SERVICES',
    themeQuestion: 'En quoi vos produits et services transforment-ils concrètement le quotidien ?',
    companyA: COMPANIES_DATA[5] || COMPANIES_DATA[0], // Dossou Logistique
    companyB: COMPANIES_DATA[0] || COMPANIES_DATA[1], // Terroirs & Agro
  },
  {
    id: 'c-duo-6',
    category: 'CRÉATIVITÉ & INNOVATION',
    themeQuestion: 'Quelle innovation audacieuse a redéfini votre manière de créer et d’agir ?',
    companyA: COMPANIES_DATA[2] || COMPANIES_DATA[0], // Aura Tech
    companyB: COMPANIES_DATA[1] || COMPANIES_DATA[1], // Hélios Ray
  },
  {
    id: 'c-duo-7',
    category: 'IMPACT',
    themeQuestion: 'Quel impact mesurable apportez-vous à la communauté et aux écosystèmes ?',
    companyA: COMPANIES_DATA[4] || COMPANIES_DATA[0], // Bio Solaire
    companyB: COMPANIES_DATA[0] || COMPANIES_DATA[1], // Terre Féconde
  },
  {
    id: 'c-duo-8',
    category: 'ENGAGEMENT',
    themeQuestion: 'Quels engagements de responsabilité sociale et écologique portez-vous sans compromis ?',
    companyA: COMPANIES_DATA[3] || COMPANIES_DATA[0], // Kpèdétin Joaillerie
    companyB: COMPANIES_DATA[6] || COMPANIES_DATA[1], // Sènami Architecture
  }
];

export const CompanyHeritageScreen: React.FC<CompanyHeritageScreenProps> = ({ 
  onNavigate,
  initialCompanyId,
  selectedCompanyId
}) => {
  const [currentDuoIdx, setCurrentDuoIdx] = useState(0);
  const [slideIndex, setSlideIndex] = useState<0 | 1 | 2>(0);

  // Visionneuse de stories d'entreprises immersives
  const [isStoryViewerOpen, setIsStoryViewerOpen] = useState(false);
  const [storyViewerIndex, setStoryViewerIndex] = useState(0);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [shareItem, setShareItem] = useState<{ title: string; id: string } | null>(null);

  // Curseur d'évaluation 0-100 (50/50 par défaut)
  const [sliderValue, setSliderValue] = useState<number>(50);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const lastScrollTime = useRef<number>(0);

  const targetCompany = selectedCompanyId || initialCompanyId;
  useEffect(() => {
    if (targetCompany) {
      const foundIdx = COMPANY_DUOS.findIndex(
        d => d.companyA.id === targetCompany || d.companyB.id === targetCompany
      );
      if (foundIdx !== -1) {
        setCurrentDuoIdx(foundIdx);
        setSlideIndex(COMPANY_DUOS[foundIdx].companyA.id === targetCompany ? 0 : 1);
      }
    }
  }, [targetCompany]);

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
    setIsPlaying(false);
    setSlideIndex(0);
    setCurrentDuoIdx(prev => (prev + 1) % COMPANY_DUOS.length);
    celestialAudio.playOrbSelect();
  };

  const handlePrevDuo = () => {
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
    if (slideIndex < 2) {
      goToSlide((slideIndex + 1) as 0 | 1 | 2);
    } else {
      handleNextDuo();
    }
  };

  const prevSlide = () => {
    if (slideIndex > 0) {
      goToSlide((slideIndex - 1) as 0 | 1 | 2);
    } else {
      handlePrevDuo();
    }
  };

  // Passerelle Story -> Duo documentaire Entreprise
  const handleGatewayToDuo = (story: ThematicStory) => {
    setIsStoryViewerOpen(false);
    let targetIdx = -1;
    let preferredSlide: 0 | 1 = 0;

    if (story.duoId) {
      targetIdx = COMPANY_DUOS.findIndex(d => d.id === story.duoId);
    }
    if (targetIdx === -1 && story.authorId) {
      targetIdx = COMPANY_DUOS.findIndex(d => {
        if (d.companyA.id === story.authorId || d.companyA.companyName.toLowerCase().includes(story.authorName.toLowerCase())) {
          preferredSlide = 0;
          return true;
        }
        if (d.companyB.id === story.authorId || d.companyB.companyName.toLowerCase().includes(story.authorName.toLowerCase())) {
          preferredSlide = 1;
          return true;
        }
        return false;
      });
    }

    if (targetIdx !== -1) {
      setCurrentDuoIdx(targetIdx);
      setSlideIndex(preferredSlide);
    }
    celestialAudio.playOrbSelect();
  };

  // Gestion du Wheel (Swipe vertical strict = 1 catégorie, horizontal = séquence)
  const handleWheel = (e: React.WheelEvent) => {
    if (isStoryViewerOpen) return;
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

  // Progression de lecture vidéo (curseur qui apparaît lors de la lecture)
  const [videoProgress, setVideoProgress] = useState(0);

  // Déplacement visuel en temps réel lors du swipe 2D (vertical = catégorie, horizontal = séquence)
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
      // Swipe vertical prédominant : déplacer la carte de haut en bas (changement de catégorie)
      setDragOffset({ x: 0, y: Math.max(-130, Math.min(130, deltaY * 0.75)) });
    } else {
      // Swipe horizontal prédominant : déplacer la carte de gauche à droite (changement d'entreprise)
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

    // Déclenchement vertical : catégorie suivante ou précédente
    if (Math.abs(deltaY) > Math.abs(deltaX) && (Math.abs(deltaY) > 35 || velocityY > 0.22)) {
      if (deltaY < 0) {
        handleNextDuo();
      } else {
        handlePrevDuo();
      }
    } else if (Math.abs(deltaX) > 35 || velocityX > 0.22) {
      // Déclenchement horizontal : entreprise suivante ou précédente
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
        handleNextDuo();
      } else {
        handlePrevDuo();
      }
    } else if (Math.abs(deltaX) > 35 || velocityX > 0.22) {
      if (deltaX < 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  };

  return (
    <div 
      onWheel={handleWheel}
      className="w-full h-full max-h-full pb-20 sm:pb-24 pt-safe overflow-hidden flex flex-col justify-between select-none bg-white text-[#1C1917]"
    >
      {/* ========================================================================= */}
      {/* 1. EN-TÊTE STORIES ENTREPRISES : FOND BEIGE #F7EFE6 & COINS ARRONDIS       */}
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
              onClick={() => onNavigate?.({ type: 'submit_story' })}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#A2482B] hover:bg-[#8A3B22] text-white flex items-center justify-center shrink-0 shadow-xs active:scale-95 transition-transform cursor-pointer mr-0.5"
              title="Publier une story entreprise"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
            </button>

            {/* Vignettes Stories Entreprises avec anneaux blancs nets sur fond beige */}
            {ENTERPRISE_STORIES.map((story, idx) => (
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
      {/* 2. ZONE CENTRALE : DUOS ENTREPRISE CONFRONTANT 2 MARQUES SUR 1 CATÉGORIE   */}
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

        {/* CARTE FORMAT 9:16 VERTICAL STANDARDISÉE STUDIO AVEC GESTION DU SWIPE 2D */}
        <div 
          onTouchStart={handleCardTouchStart}
          onTouchMove={handleCardTouchMove}
          onTouchEnd={handleCardTouchEnd}
          onTouchCancel={() => { touchStartPos.current = null; setIsDragging(false); setDragOffset({ x: 0, y: 0 }); }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          style={{
            transform: dragOffset.x !== 0 || dragOffset.y !== 0 ? `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0)` : undefined,
            transition: isDragging ? 'none' : 'transform 0.26s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          className="relative aspect-[9/16] w-[min(calc(100vw-64px),calc((100dvh-230px)*9/16))] max-w-[228px] sm:max-w-[270px] md:max-w-[290px] h-[min(410px,calc(100dvh-230px))] sm:h-[min(480px,calc(100dvh-200px))] md:h-[min(520px,calc(100dvh-180px))] rounded-2xl sm:rounded-3xl overflow-hidden border border-stone-200/90 bg-[#12110F] text-white flex flex-col justify-between select-none touch-none cursor-grab active:cursor-grabbing"
        >
          
          {/* SÉQUENCE 1 (ENTREPRISE A) ET SÉQUENCE 2 (ENTREPRISE B) */}
          {slideIndex !== 2 ? (
            <>
              {/* EN-TÊTE : TITRE DE LA CATÉGORIE À GAUCHE & BOUTON TÉLÉ EN HAUT À DROITE */}
              <div className="relative z-20 pt-3.5 px-3 flex items-center justify-between gap-1 pointer-events-auto">
                <div className="inline-flex w-fit items-center px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 shadow-md max-w-[75%]">
                  <span className="font-editorial text-xs font-semibold text-white whitespace-nowrap tracking-wide select-none truncate">
                    {formatFirstLetterOnly(currentDuo.category)}
                  </span>
                </div>

                {/* Bouton Télé Vintage de Lecture en haut à droite — SEUL DÉCLENCHEUR DE LA VIDÉO */}
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
                  title={isPlaying ? 'Pause' : 'Lecture vidéo'}
                >
                  <TvPlayerIcon className="w-4.5 h-4.5 text-current" strokeWidth={1.7} />
                </button>
              </div>

              {/* MEDIA FOND : UNIQUEMENT DÉCLENCHÉ PAR LA TÉLÉ VINTAGE */}
              <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
                {isPlaying ? (
                  <video
                    ref={videoRef}
                    key={`company-video-${activeCompany.id}`}
                    src={activeCompany.videoUrl || activeCompany.manifestoVideoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'}
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                    className="w-full h-full object-cover pointer-events-none"
                  />
                ) : (
                  <img 
                    src={activeCompany.photoUrl} 
                    alt={activeCompany.companyName}
                    className="w-full h-full object-cover pointer-events-none"
                  />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />
              </div>

              {/* COLONNE D'ICÔNES LATÉRALE DROITE : SQUIRCLES (rounded-xl) PARFAITEMENT ALIGNÉS */}
              <div className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-2 pointer-events-auto">
                {/* 1. Icône Swipe aux flèches arrondies (haut/bas entre duos, gauche/droite entre entreprises) */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextSlide();
                  }}
                  className="w-8 h-8 rounded-xl bg-black/60 backdrop-blur-md text-white hover:bg-[#A2482B] border border-white/15 flex items-center justify-center transition-all cursor-pointer shadow-sm group"
                  title="Changer de séquence ou swiper haut/bas pour changer de catégorie"
                >
                  <RoundedSwipeArrowsIcon className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                </button>

                {/* 2. Question de la catégorie */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowQuestionModal(true);
                  }}
                  className="w-8 h-8 rounded-xl bg-black/60 backdrop-blur-md text-white hover:bg-[#A2482B] border border-white/15 flex items-center justify-center transition-all cursor-pointer shadow-sm group"
                  title="Consulter la question"
                >
                  <BookOpen className="w-3.5 h-3.5 text-white group-hover:scale-110 transition-transform" />
                </button>

                {/* 3. Portrait d'entreprise */}
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

                {/* 4. Partage */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShareItem({ title: `Documentaire Entreprise : ${currentDuo.category} — ${activeCompany.companyName}`, id: activeCompany.id });
                  }}
                  className="w-8 h-8 rounded-xl bg-black/60 backdrop-blur-md text-white hover:bg-[#A2482B] border border-white/15 flex items-center justify-center transition-all cursor-pointer shadow-sm group"
                  title="Partager"
                >
                  <ShareIcon className="w-4 h-4" />
                </button>
              </div>

              {/* BAS DE CARTE ÉPURÉ : NOM DE L'ENTREPRISE EN BAS À GAUCHE & CURSEUR EN DESSOUS SANS DÉPLACEMENT */}
              <div className="absolute bottom-3.5 sm:bottom-4 left-3.5 sm:left-4 z-20 pointer-events-none flex flex-col items-start">
                <h2 className="font-editorial text-base sm:text-lg font-bold text-white tracking-wide drop-shadow-md truncate max-w-[170px] sm:max-w-[210px] leading-tight">
                  {activeCompany.companyName}
                </h2>

                {/* Hauteur réservée fixe : le nom ne bouge JAMAIS lorsque le curseur apparaît */}
                <div className="h-2 flex items-center mt-1">
                  <div 
                    className={`w-24 sm:w-28 h-1 bg-white/25 rounded-full overflow-hidden shadow-xs transition-opacity duration-200 ${
                      isPlaying ? 'opacity-100' : 'opacity-0'
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
          ) : (
            /* SÉQUENCE 3 : LE FACE-À-FACE DES ENTREPRISES & CURSEUR D'ÉVALUATION 0-100 */
            <div className="relative w-full h-full p-4 sm:p-5 flex flex-col justify-between select-none bg-[#12110F]">
              
              {/* Halo d'ambiance */}
              <div 
                className="absolute inset-0 opacity-25 pointer-events-none transition-all duration-300"
                style={{
                  background: `radial-gradient(circle at ${sliderValue}% 50%, #A2482B 0%, transparent 70%)`
                }}
              />

              {/* En-tête de la séquence d'évaluation : Catégorie stricte & retour */}
              <div className="relative z-20 flex items-center justify-between gap-1.5">
                <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/15 max-w-[60%]">
                  <span className="text-[11px] font-bold text-white tracking-wider uppercase truncate block">
                    {currentDuo.category}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => goToSlide(0)}
                  className="px-3 py-1 rounded-full text-[10.5px] font-bold bg-[#A2482B] hover:bg-[#8A3B22] text-white shadow-xs transition-colors cursor-pointer"
                  title="Revenir à la vidéo"
                >
                  ← Vidéo
                </button>
              </div>

              {/* Les Deux Entreprises Face-à-Face A et B */}
              <div className="relative z-10 grid grid-cols-2 gap-3 my-auto py-2">
                {/* Vignette Entreprise A */}
                <div 
                  onClick={() => onNavigate?.({ type: 'profile', protagonistId: compA.id })}
                  className={`relative rounded-2xl overflow-hidden p-2.5 border transition-all duration-200 cursor-pointer flex flex-col items-center aspect-[3/4] ${
                    percentA > 50 
                      ? 'border-[#A2482B] bg-[#1E1916] shadow-lg shadow-[#A2482B]/20 scale-102' 
                      : 'border-white/10 bg-black/40 hover:border-white/20'
                  }`}
                >
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-2 bg-stone-900">
                    <img 
                      src={compA.photoUrl} 
                      alt={compA.companyName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-[10px] font-bold text-white">
                      {percentA}%
                    </div>
                  </div>
                  <h4 className="text-xs font-bold text-white tracking-wide truncate w-full text-center">
                    {compA.companyName}
                  </h4>
                </div>

                {/* Vignette Entreprise B */}
                <div 
                  onClick={() => onNavigate?.({ type: 'profile', protagonistId: compB.id })}
                  className={`relative rounded-2xl overflow-hidden p-2.5 border transition-all duration-200 cursor-pointer flex flex-col items-center aspect-[3/4] ${
                    percentB > 50 
                      ? 'border-amber-500 bg-[#1E1C15] shadow-lg shadow-amber-500/20 scale-102' 
                      : 'border-white/10 bg-black/40 hover:border-white/20'
                  }`}
                >
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-2 bg-stone-900">
                    <img 
                      src={compB.photoUrl} 
                      alt={compB.companyName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1 right-1 px-1.5 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-[10px] font-bold text-amber-300">
                      {percentB}%
                    </div>
                  </div>
                  <h4 className="text-xs font-bold text-white tracking-wide truncate w-full text-center">
                    {compB.companyName}
                  </h4>
                </div>
              </div>

              {/* Curseur d'Évaluation 0 à 100 */}
              <div className="relative z-10 bg-black/60 backdrop-blur-md p-3.5 rounded-2xl border border-white/15 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className={percentA > 50 ? 'text-[#C8603C]' : 'text-stone-300'}>
                    {compA.companyName.split(' ')[0]} {percentA}%
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-white/50" />
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
                    className="w-full h-2 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-[#A2482B]"
                  />
                </div>
                <p className="text-[10px] text-center text-stone-400">
                  Positionnez votre appréciation entre les deux démarches d'entreprise
                </p>
              </div>

            </div>
          )}

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 3. VISIONNEUSE DE STORIES D'ENTREPRISES PLEIN ÉCRAN                       */}
      {/* ========================================================================= */}
      <StoriesStudioCoverflow
        stories={ENTERPRISE_STORIES}
        initialIndex={storyViewerIndex}
        isOpen={isStoryViewerOpen}
        onClose={() => setIsStoryViewerOpen(false)}
        onNavigateToDuo={handleGatewayToDuo}
      />

      {/* ========================================================================= */}
      {/* 4. MODALE QUESTION DE LA CATÉGORIE                                        */}
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
                Catégorie : {currentDuo.category}
              </span>
              <button onClick={() => setShowQuestionModal(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm font-semibold text-stone-900 leading-relaxed">
              « {currentDuo.themeQuestion} »
            </p>
            <p className="text-xs text-stone-500 leading-relaxed">
              Deux entreprises confrontent leurs visions, leurs réalisations et leurs engagements autour de cette même thématique.
            </p>
          </div>
        </div>
      )}

      {/* Modale Partage */}
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
