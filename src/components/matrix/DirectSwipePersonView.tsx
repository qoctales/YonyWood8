import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Pause, 
  Volume2, 
  VolumeX, 
  BookOpen, 
  Bookmark, 
  Check, 
  X,
  Award 
} from 'lucide-react';
import { MatrixProfile } from '../../utils/matrixGridService';
import { TvPlayerIcon } from '../YonywoodBrandIcons';
import { ShareIcon } from '../ShareIcon';
import { ResonanceModal } from '../ResonanceModal';
import { UnifiedVideoCardOverlay } from '../UnifiedVideoCardOverlay';
import { ViewScreen } from '../../types';

interface DirectSwipePersonViewProps {
  profiles: MatrixProfile[];
  initialIndex?: number;
  onNavigate?: (screen: ViewScreen) => void;
}

export const DirectSwipePersonView: React.FC<DirectSwipePersonViewProps> = ({
  profiles,
  initialIndex = 0,
  onNavigate
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(initialIndex);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isResonanceModalOpen, setIsResonanceModalOpen] = useState<boolean>(false);
  const [resonancePct, setResonancePct] = useState<number | null>(null);
  const [isQuestionOpen, setIsQuestionOpen] = useState<boolean>(false);
  const [swipeOffset, setSwipeOffset] = useState<number>(0);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);

  const safeProfiles = profiles.length > 0 ? profiles : [];
  const currentPerson = safeProfiles[currentIndex] || null;

  // Réinitialiser la lecture et les popups lors du changement de personne
  useEffect(() => {
    setIsPlaying(false);
    setIsBookmarked(false);
    setIsCopied(false);
    setIsQuestionOpen(false);
    setIsResonanceModalOpen(false);
    setSwipeOffset(0);

    if (currentPerson) {
      try {
        const stored = localStorage.getItem(`yonywood_resonance_story-${currentPerson.id}`);
        if (stored) {
          const val = parseInt(stored, 10);
          setResonancePct(isNaN(val) ? null : val);
        } else {
          setResonancePct(null);
        }
      } catch {
        setResonancePct(null);
      }
    }
  }, [currentIndex, currentPerson]);

  // Synchronisation du son
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Navigation tactile (Swipe horizontal)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchEndXRef.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.touches[0].clientX;
    if (touchStartXRef.current !== null) {
      const diff = e.touches[0].clientX - touchStartXRef.current;
      setSwipeOffset(diff * 0.4);
    }
  };

  const handleTouchEnd = () => {
    if (touchStartXRef.current !== null && touchEndXRef.current !== null) {
      const diff = touchStartXRef.current - touchEndXRef.current;
      if (diff > 45) {
        goToNext();
      } else if (diff < -45) {
        goToPrev();
      }
    }
    touchStartXRef.current = null;
    touchEndXRef.current = null;
    setSwipeOffset(0);
  };

  // Clavier (Flèches Gauche/Droite)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isResonanceModalOpen || isQuestionOpen) return;
      if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'ArrowLeft') {
        goToPrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, isResonanceModalOpen, isQuestionOpen]);

  const goToNext = () => {
    if (safeProfiles.length === 0) return;
    setCurrentIndex(prev => (prev + 1) % safeProfiles.length);
  };

  const goToPrev = () => {
    if (safeProfiles.length === 0) return;
    setCurrentIndex(prev => (prev - 1 + safeProfiles.length) % safeProfiles.length);
  };

  const togglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsPlaying(prev => {
      if (!prev && videoRef.current) {
        videoRef.current.play().catch(() => {});
      } else if (prev && videoRef.current) {
        videoRef.current.pause();
      }
      return !prev;
    });
  };

  const toggleMute = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  if (!currentPerson) {
    return (
      <div className="w-full h-full flex items-center justify-center text-stone-500">
        Aucun récit disponible.
      </div>
    );
  }

  const videoUrl = currentPerson.teaserVideoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
  const tagLabel = currentPerson.directionLabel || 'Résilience';
  const displayName = currentPerson.firstName || currentPerson.name.split(' ')[0] || currentPerson.name;

  return (
    <div className="relative flex-1 w-full min-h-0 flex flex-col items-center justify-center select-none overflow-hidden my-auto">
      
      {/* ZONE CENTRALE : FLÈCHES LATÉRALES + CARTE VIDÉO FORMAT DUO */}
      <div className="relative w-full flex-1 flex items-center justify-center min-h-0 my-auto">
        
        {/* Flèche Personne Précédente (Desktop) */}
        <button
          onClick={goToPrev}
          className="hidden md:flex absolute left-4 lg:left-8 z-30 w-11 h-11 rounded-full bg-white/95 hover:bg-[#A2482B] text-stone-800 hover:text-white border border-stone-200 shadow-xl items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
          title="Histoire précédente (Flèche gauche)"
          id="btn-swipe-matrix-prev"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* CARTE VIDÉO VERTICALE AU GABARIT STANDARD (MODÈLE DIEUDONNÉ) */}
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={(e) => {
            if ((e.target as HTMLElement).closest('button, a')) return;
            togglePlay();
          }}
          style={{ transform: `translateX(${swipeOffset}px)` }}
          className="group relative rounded-2xl sm:rounded-3xl overflow-hidden bg-[#151513] text-white shadow-2xl border border-stone-200/40 flex flex-col justify-between 
            aspect-[9/16] 
            w-[min(calc(100vw-28px),calc((100dvh-230px)*9/16))] 
            max-w-[340px] 
            h-[min(480px,calc(100dvh-230px))] 
            sm:h-[min(520px,calc(100dvh-210px))] 
            lg:h-[min(550px,calc(100dvh-200px))] 
            mx-auto shrink-0 transition-transform duration-100 cursor-pointer select-none my-auto"
        >
          {/* Media de fond : Vidéo ou Photo */}
          {isPlaying ? (
            <video
              ref={videoRef}
              src={videoUrl}
              autoPlay
              loop
              playsInline
              muted={isMuted}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <img
              src={currentPerson.photoUrl}
              alt={currentPerson.name}
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />
          )}

          {/* Voile cinématographique pour lisibilité optimale */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/50 pointer-events-none" />

          {/* Overlay standardisé : alignement vertical strict, 6 actions, pas de croix, titre en haut à gauche et prénom épuré en bas à gauche */}
          <UnifiedVideoCardOverlay
            titleBadge={tagLabel}
            displayName={displayName}
            isPlaying={isPlaying}
            onTogglePlay={togglePlay}
            isMuted={isMuted}
            onToggleMute={toggleMute}
            resonanceScore={resonancePct}
            onOpenResonance={() => setIsResonanceModalOpen(true)}
            questionText={currentPerson.question || currentPerson.centralQuestion || currentPerson.invitationStory || "Quelle mémoire choisissons-nous de transmettre aux générations qui viennent ?"}
            factText={currentPerson.quote || currentPerson.teaserPitch || "Passeur d'un savoir vivant transmis à sa communauté."}
            onOpenProfile={() => {
              if (onNavigate) {
                onNavigate({ type: 'protagonist_profile', protagonistId: currentPerson.id });
              }
            }}
            onShare={handleShare}
            isShareCopied={isCopied}
            onReportVideo={() => {
              // Action de signalement
            }}
            onBlockVideo={() => {
              // Action de blocage
            }}
          />

          {/* Modal d'évaluation de la résonance confinée dans la carte vidéo */}
          <ResonanceModal
            isOpen={isResonanceModalOpen}
            onClose={() => setIsResonanceModalOpen(false)}
            storyId={`story-${currentPerson.id}`}
            topicId={currentPerson.doorId || 'exploration-matrice'}
            personName={currentPerson.name}
            initialPercentage={resonancePct}
            onRatingSubmitted={(pct) => setResonancePct(pct)}
          />
        </div>

        {/* Flèche Personne Suivante (Desktop) */}
        <button
          onClick={goToNext}
          className="hidden md:flex absolute right-4 lg:right-8 z-30 w-11 h-11 rounded-full bg-white/95 hover:bg-[#A2482B] text-stone-800 hover:text-white border border-stone-200 shadow-xl items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
          title="Histoire suivante (Flèche droite)"
          id="btn-swipe-matrix-next"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
