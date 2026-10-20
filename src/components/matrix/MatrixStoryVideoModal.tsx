import React, { useState, useRef, useEffect } from 'react';
import { 
  Pause, 
  Volume2, 
  VolumeX, 
  X, 
  BookOpen, 
  Bookmark, 
  Check, 
  Award,
  MessageSquare
} from 'lucide-react';
import { MatrixProfile } from '../../utils/matrixGridService';
import { TvPlayerIcon, ProfileSoloIcon } from '../YonywoodBrandIcons';
import { ShareIcon } from '../ShareIcon';
import { ResonanceModal } from '../ResonanceModal';
import { UnifiedVideoCardOverlay } from '../UnifiedVideoCardOverlay';
import { ViewScreen } from '../../types';

interface MatrixStoryVideoModalProps {
  person: MatrixProfile | null;
  onClose: () => void;
  onNavigate?: (screen: ViewScreen) => void;
}

export const MatrixStoryVideoModal: React.FC<MatrixStoryVideoModalProps> = ({
  person,
  onClose,
  onNavigate
}) => {
  // Pas d'autoplay automatique : la modale s'ouvre en pause, et c'est à la personne de cliquer sur lecture si elle veut
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isResonanceModalOpen, setIsResonanceModalOpen] = useState<boolean>(false);
  const [resonancePct, setResonancePct] = useState<number | null>(null);
  const [isQuestionOpen, setIsQuestionOpen] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Fermeture par touche Échap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isQuestionOpen) {
          setIsQuestionOpen(false);
        } else if (isResonanceModalOpen) {
          setIsResonanceModalOpen(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, isQuestionOpen, isResonanceModalOpen]);

  // Synchronisation volume
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  if (!person) return null;

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

  const videoUrl = person.teaserVideoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
  const tagLabel = person.directionLabel || 'Résilience';
  const displayName = person.firstName || person.name.split(' ')[0] || person.name;
  const storyQuestion = person.question || person.centralQuestion;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 select-none animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Bouton Fermer discret en haut à droite de l'écran */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center border border-white/20 transition-all cursor-pointer shadow-lg hover:scale-105 active:scale-95"
        title="Fermer et revenir à la Matrice"
      >
        <X className="w-5 h-5" />
      </button>

      {/* CARTE VIDÉO VERTICALE AU GABARIT STANDARD (CONFORME À LA CAPTURE MODÈLE) */}
      <div 
        onClick={(e) => {
          // Clic sur la carte bascule lecture/pause
          if ((e.target as HTMLElement).closest('button, a')) return;
          togglePlay();
        }}
        className="group relative rounded-2xl sm:rounded-3xl overflow-hidden bg-[#151513] text-white shadow-2xl border border-stone-200/40 flex flex-col justify-between 
          aspect-[9/16] 
          w-[min(calc(100vw-32px),calc((100dvh-120px)*9/16))] 
          max-w-[340px] 
          h-[min(580px,calc(100dvh-120px))] 
          mx-auto shrink-0 transition-all duration-300 cursor-pointer animate-in zoom-in-95 duration-200"
      >
        {/* Background Media: Video or Poster Image */}
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
            src={person.photoUrl} 
            alt={person.name} 
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
          questionText={storyQuestion || person.invitationStory || "Quelle mémoire choisissons-nous de transmettre aux générations qui viennent ?"}
          factText={person.quote || person.teaserPitch || "Passeur d'un savoir vivant transmis à sa communauté."}
          onOpenProfile={() => {
            onClose();
            if (onNavigate) {
              onNavigate({ type: 'protagonist_profile', protagonistId: person.id });
            }
          }}
          onShare={handleShare}
          isShareCopied={isCopied}
          onReportVideo={() => {
            onClose();
          }}
          onBlockVideo={() => {
            onClose();
          }}
        />

        {/* Modal d'évaluation de la résonance confinée dans la carte vidéo */}
        <ResonanceModal
          isOpen={isResonanceModalOpen}
          onClose={() => setIsResonanceModalOpen(false)}
          storyId={`story-${person.id}`}
          topicId={person.doorId || 'exploration-matrice'}
          personName={person.name}
          initialPercentage={resonancePct}
          onRatingSubmitted={(pct) => setResonancePct(pct)}
        />
      </div>
    </div>
  );
};
