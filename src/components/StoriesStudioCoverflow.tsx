import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Volume2, 
  VolumeX,
  Play,
  Pause
} from 'lucide-react';
import { ThematicStory } from '../data/thematicStoriesData';
import { celestialAudio } from '../utils/celestialAudio';
import { TvPlayerIcon } from './YonywoodBrandIcons';
import { formatFirstLetterOnly } from '../utils/textFormatters';

interface StoriesStudioCoverflowProps {
  stories: ThematicStory[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigateToDuo?: (story: ThematicStory) => void;
}

export const StoriesStudioCoverflow: React.FC<StoriesStudioCoverflowProps> = ({
  stories,
  initialIndex = 0,
  isOpen,
  onClose,
  onNavigateToDuo
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [storyElapsed, setStoryElapsed] = useState<number>(0);
  const [dragOffset, setDragOffset] = useState<number>(0);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const timerRef = useRef<any>(null);

  // Swipe / Touch ref
  const touchStartXRef = useRef<number>(0);
  const touchStartYRef = useRef<number>(0);
  const touchStartTimeRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setIsPlaying(true);
      setStoryElapsed(0);
    }
  }, [isOpen, initialIndex]);

  // Synchronisation du chronomètre : maximum 64 secondes par story
  useEffect(() => {
    if (!isOpen || !isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    setStoryElapsed(0);
    timerRef.current = setInterval(() => {
      setStoryElapsed(prev => {
        const nextTime = prev + 0.1;
        // Période maximale de 64 secondes
        if (nextTime >= 64) {
          // Passer à la story suivante
          setCurrentIndex(currentIdx => {
            const nextIdx = (currentIdx + 1) % stories.length;
            celestialAudio.playOrbSelect();
            return nextIdx;
          });
          return 0;
        }
        return nextTime;
      });
    }, 100);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen, currentIndex, isPlaying, stories.length]);

  const goToNext = useCallback(() => {
    if (stories.length <= 1) return;
    setCurrentIndex(prev => (prev + 1) % stories.length);
    setStoryElapsed(0);
    setIsPlaying(true);
    celestialAudio.playOrbSelect();
  }, [stories.length]);

  const goToPrev = useCallback(() => {
    if (stories.length <= 1) return;
    setCurrentIndex(prev => (prev - 1 + stories.length) % stories.length);
    setStoryElapsed(0);
    setIsPlaying(true);
    celestialAudio.playOrbSelect();
  }, [stories.length]);

  // Clavier (Flèches & Échap)
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goToNext();
      else if (e.key === 'ArrowLeft') goToPrev();
      else if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, goToNext, goToPrev, onClose]);

  // Gestes tactiles
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
    touchStartTimeRef.current = Date.now();
    isDraggingRef.current = true;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.touches[0].clientX - touchStartXRef.current;
    const deltaY = e.touches[0].clientY - touchStartYRef.current;
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 6) {
      setDragOffset(Math.max(-80, Math.min(80, deltaX * 0.45)));
    }
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartXRef.current;
    const elapsed = Date.now() - touchStartTimeRef.current;
    const velocity = Math.abs(deltaX) / Math.max(1, elapsed);

    if (Math.abs(deltaX) > 28 || velocity > 0.28) {
      if (deltaX < 0) goToNext();
      else goToPrev();
    }
    setDragOffset(0);
  };

  // Souris (drag desktop)
  const onMouseDown = (e: React.MouseEvent) => {
    touchStartXRef.current = e.clientX;
    touchStartTimeRef.current = Date.now();
    isDraggingRef.current = true;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - touchStartXRef.current;
    if (Math.abs(deltaX) > 6) {
      setDragOffset(Math.max(-80, Math.min(80, deltaX * 0.45)));
    }
  };

  const onMouseUp = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    const deltaX = e.clientX - touchStartXRef.current;
    const elapsed = Date.now() - touchStartTimeRef.current;
    const velocity = Math.abs(deltaX) / Math.max(1, elapsed);

    if (Math.abs(deltaX) > 28 || velocity > 0.28) {
      if (deltaX < 0) goToNext();
      else goToPrev();
    }
    setDragOffset(0);
  };

  if (!isOpen || stories.length === 0) return null;

  const activeStory = stories[currentIndex] || stories[0];
  const activeFirstName = activeStory.authorName.split(' ')[0];

  return (
    <div 
      className="fixed inset-0 z-50 bg-white/85 backdrop-blur-2xl flex flex-col justify-between pt-3 sm:pt-6 pb-20 sm:pb-24 px-2 sm:px-4 select-none text-stone-900 animate-in fade-in duration-200"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    >
      
      {/* ========================================================================= */}
      {/* 1. BARRE SUPÉRIEURE : UNIQUEMENT LA CROIX POUR REVENIR AU MODE NORMAL      */}
      {/* ========================================================================= */}
      <div className="w-full max-w-4xl mx-auto flex items-center justify-between px-3 h-10 shrink-0 z-40 pointer-events-auto">
        <div className="flex items-center gap-2">
          {/* Mute toggle */}
          <button
            onClick={() => setIsMuted(m => !m)}
            className="w-8.5 h-8.5 rounded-full bg-white/90 hover:bg-stone-100 text-stone-700 border border-stone-200/80 shadow-xs flex items-center justify-center transition-all cursor-pointer"
            title={isMuted ? 'Activer le son' : 'Couper le son'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-stone-500" /> : <Volume2 className="w-4 h-4 text-stone-700" />}
          </button>
        </div>

        {/* La croix suffit pour revenir aux publications normales */}
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-white/90 hover:bg-[#A2482B] text-stone-700 hover:text-white border border-stone-200/80 shadow-md flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
          title="Fermer et revenir aux publications normales"
        >
          <X className="w-4.5 h-4.5 text-current" />
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 2. ZONE CENTRALE : SCÈNE 3D DE CARTES QUI SE SUIVENT (PAGE STUDIO)         */}
      {/* ========================================================================= */}
      <div className="relative flex-1 flex items-center justify-center w-full min-h-0 my-auto py-2">
        
        {/* Flèche Gauche Desktop */}
        <button
          onClick={goToPrev}
          className="hidden sm:flex absolute left-2 sm:left-4 md:left-8 z-40 w-10 h-10 rounded-full bg-white/90 hover:bg-[#A2482B] text-stone-800 hover:text-white border border-stone-200 shadow-lg items-center justify-center transition-all cursor-pointer transform hover:scale-105 active:scale-95"
          title="Story précédente"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Flèche Droite Desktop */}
        <button
          onClick={goToNext}
          className="hidden sm:flex absolute right-2 sm:right-4 md:right-8 z-40 w-10 h-10 rounded-full bg-white/90 hover:bg-[#A2482B] text-stone-800 hover:text-white border border-stone-200 shadow-lg items-center justify-center transition-all cursor-pointer transform hover:scale-105 active:scale-95"
          title="Story suivante"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* SCÈNE 3D COVERFLOW (MÊME GÉOMÉTRIE QUE LA PAGE STUDIO) */}
        <div 
          className="relative w-full h-full flex items-center justify-center pointer-events-none"
          style={{ 
            perspective: '1200px',
            perspectiveOrigin: 'center center'
          }}
        >
          <div 
            className="relative w-full h-full flex items-center justify-center pointer-events-none"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {stories.map((story, idx) => {
              const n = stories.length;
              const rawDiff = (idx - currentIndex) % n;
              const diff = rawDiff > n / 2 ? rawDiff - n : rawDiff < -n / 2 ? rawDiff + n : rawDiff;
              const isCenter = diff === 0;

              let transformStyle = '';
              let zIndex = 10;
              let opacity = 0;
              let pointerEvents: 'auto' | 'none' = 'none';

              if (diff === 0) {
                // Carte active au centre
                transformStyle = `translateX(${dragOffset}px) translateZ(60px) rotateY(${dragOffset * -0.15}deg) scale(1)`;
                zIndex = 30;
                opacity = 1;
                pointerEvents = 'auto';
              } else if (diff === 1) {
                // Voisine droite
                transformStyle = `translateX(calc(55% + ${dragOffset}px)) translateZ(-60px) rotateY(-26deg) scale(0.86)`;
                zIndex = 20;
                opacity = 0.75;
                pointerEvents = 'auto';
              } else if (diff === -1) {
                // Voisine gauche
                transformStyle = `translateX(calc(-55% + ${dragOffset}px)) translateZ(-60px) rotateY(26deg) scale(0.86)`;
                zIndex = 20;
                opacity = 0.75;
                pointerEvents = 'auto';
              } else if (diff === 2) {
                transformStyle = `translateX(calc(100% + ${dragOffset}px)) translateZ(-140px) rotateY(-40deg) scale(0.72)`;
                zIndex = 10;
                opacity = 0.35;
                pointerEvents = 'auto';
              } else if (diff === -2) {
                transformStyle = `translateX(calc(-100% + ${dragOffset}px)) translateZ(-140px) rotateY(40deg) scale(0.72)`;
                zIndex = 10;
                opacity = 0.35;
                pointerEvents = 'auto';
              } else {
                transformStyle = `translateX(0px) translateZ(-250px) rotateY(180deg) scale(0.5)`;
                zIndex = 5;
                opacity = 0;
                pointerEvents = 'none';
              }

              const firstName = story.authorName.split(' ')[0];
              // Thématique libre de la story (ex: Persévérance, Transmission, Courage, etc.)
              const storyThemeTitle = story.themeLabel || story.storyTitle;

              return (
                <div
                  key={`story-coverflow-${story.id}`}
                  onClick={() => {
                    if (isCenter) {
                      setIsPlaying(p => !p);
                    } else {
                      setCurrentIndex(idx);
                      setStoryElapsed(0);
                      setIsPlaying(true);
                      celestialAudio.playOrbSelect();
                    }
                  }}
                  style={{
                    transform: transformStyle,
                    zIndex,
                    opacity,
                    pointerEvents,
                    transition: isDraggingRef.current ? 'none' : 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.24s ease'
                  }}
                  className={`absolute aspect-[9/16] w-[min(calc(100vw-64px),calc((100dvh-230px)*9/16))] max-w-[228px] sm:max-w-[270px] md:max-w-[290px] h-[min(410px,calc(100dvh-230px))] sm:h-[min(480px,calc(100dvh-200px))] md:h-[min(520px,calc(100dvh-180px))] rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col justify-between p-3 sm:p-4 cursor-pointer select-none bg-[#151513] text-white shadow-2xl transition-all ${
                    isCenter ? 'border-none ring-0 shadow-[0_12px_40px_rgba(0,0,0,0.85)]' : 'border-none ring-0 opacity-55'
                  }`}
                >
                  
                  {/* VIDÉO OU IMAGE DE FOND (LECTURE AU CENTRE) */}
                  <div className="absolute inset-0 z-0 overflow-hidden">
                    {isCenter && isPlaying ? (
                      <video
                        ref={videoRef}
                        key={`video-story-${story.id}`}
                        src={(!story.videoUrl || story.videoUrl.includes('commondatastorage.googleapis.com')) ? '/sample.mp4' : story.videoUrl}
                        autoPlay
                        loop
                        muted={isMuted}
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img 
                        src={story.authorAvatar} 
                        alt={story.authorName} 
                        className="w-full h-full object-cover" 
                      />
                    )}
                    {/* Voile subtil pour la lisibilité */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/40 pointer-events-none" />
                  </div>

                  {/* Bouton Play au centre si en pause */}
                  {!isPlaying && isCenter && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                      <div className="w-14 h-14 rounded-full bg-black/45 backdrop-blur-md border border-white/25 text-white flex items-center justify-center shadow-2xl transition-transform hover:scale-110">
                        <Play className="w-6 h-6 ml-0.5 fill-white text-white opacity-90" />
                      </div>
                    </div>
                  )}

                  {/* ========================================================================= */}
                  {/* EN-TÊTE DE CARTE : TITRE DE LA THÉMATIQUE À GAUCHE & ICÔNE LECTURE À DROITE */}
                  {/* Structure toujours identique demandée par l'utilisateur                   */}
                  {/* ========================================================================= */}
                  <div className="relative z-20 w-full flex items-center justify-between gap-1 pointer-events-auto">
                    {/* Titre thématique en haut à gauche */}
                    <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 shadow-md max-w-[75%]">
                      <span className="font-editorial text-xs font-semibold text-white whitespace-nowrap tracking-wide select-none truncate">
                        {formatFirstLetterOnly(storyThemeTitle)}
                      </span>
                    </div>

                    {/* Icône de lecture toujours en haut à droite (en face du titre) */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsPlaying(p => !p);
                      }}
                      className={`w-8.5 h-8.5 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-95 ${
                        isPlaying && isCenter
                          ? 'bg-[#A2482B] text-white border border-[#8A3B22]' 
                          : 'bg-black/60 backdrop-blur-md text-white border border-white/20 hover:bg-black/80'
                      }`}
                      title={isPlaying && isCenter ? 'Mettre en pause' : 'Lancer la vidéo'}
                    >
                      <TvPlayerIcon className="w-4.5 h-4.5 text-current" strokeWidth={1.7} />
                    </button>
                  </div>

                  {/* ========================================================================= */}
                  {/* BAS DE CARTE : PRÉNOM EN BAS À GAUCHE & CURSEUR DE LECTURE SANS DÉPLACEMENT */}
                  {/* ========================================================================= */}
                  <div className="absolute bottom-3.5 sm:bottom-4 left-3.5 sm:left-4 z-20 pointer-events-auto flex flex-col items-start">
                    {/* Prénom toujours en bas à gauche */}
                    <h2 className="font-editorial text-base sm:text-lg font-bold text-white tracking-wide drop-shadow-md truncate max-w-[170px] sm:max-w-[210px] leading-tight">
                      {firstName}
                    </h2>

                    {/* Hauteur réservée fixe : le prénom ne bouge JAMAIS lorsque la lecture démarre */}
                    <div className="h-2 flex items-center mt-1">
                      <div 
                        className={`w-24 sm:w-28 h-1 bg-white/25 rounded-full overflow-hidden shadow-xs transition-opacity duration-200 ${
                          isCenter && isPlaying ? 'opacity-100' : 'opacity-0'
                        }`}
                      >
                        <div 
                          className="h-full bg-white transition-all duration-100 rounded-full"
                          style={{ width: `${Math.min(100, (storyElapsed / 64) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
};
