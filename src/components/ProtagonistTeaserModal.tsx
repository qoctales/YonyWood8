import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, X, ArrowRight, Sparkles, MapPin, Award } from 'lucide-react';
import { Protagonist } from '../types';
import { ResonanceModal } from './ResonanceModal';
import { ProfileSoloIcon, TvPlayerIcon } from './YonywoodBrandIcons';
import { UnifiedVideoCardOverlay } from './UnifiedVideoCardOverlay';

interface ProtagonistTeaserModalProps {
  protagonist: Protagonist | null;
  storyId?: string;
  topicId?: string;
  onClose: () => void;
  onEnterUniverse: (protagonistId: string) => void;
}

export const ProtagonistTeaserModal: React.FC<ProtagonistTeaserModalProps> = ({
  protagonist,
  storyId,
  topicId,
  onClose,
  onEnterUniverse,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isResonanceModalOpen, setIsResonanceModalOpen] = useState<boolean>(false);
  const [resonancePct, setResonancePct] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Fermeture par la touche Échap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (protagonist) {
      const activeStoryId = storyId || protagonist.stories?.[0]?.id || `story-${protagonist.id}`;
      try {
        const stored = localStorage.getItem(`yonywood_resonance_${activeStoryId}`);
        if (stored) {
          const val = parseInt(stored, 10);
          setResonancePct(isNaN(val) ? null : val);
        } else {
          setResonancePct(null);
        }
      } catch {
        setResonancePct(null);
      }
      setIsResonanceModalOpen(false);
    }
  }, [protagonist, storyId]);

  if (!protagonist) return null;

  const togglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsPlaying(prev => !prev);
  };

  const toggleMute = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  // Video Teaser URL (prioritize story video or standard teaser)
  const teaserVideo = protagonist.stories?.[0]?.videoCoverUrl && protagonist.stories[0].videoCoverUrl.endsWith('.mp4')
    ? protagonist.stories[0].videoCoverUrl
    : 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';

  const posterImg = protagonist.photoUrl || '/assets/protagonists/koffi-tisserand.jpg';

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Container vertical 9:16 standardisé (même gabarit que Matrice Héritage & Lumière) */}
      <div 
        className="group relative rounded-2xl sm:rounded-3xl overflow-hidden bg-[#151513] text-white shadow-2xl border border-stone-200/40 flex flex-col justify-between 
          aspect-[9/16] 
          w-[min(calc(100vw-32px),calc((100dvh-200px)*9/16))] 
          max-w-[280px] sm:max-w-[290px] 
          h-[min(500px,calc(100dvh-200px))] 
          mx-auto shrink-0 select-none animate-in zoom-in-95 duration-200"
      >
        {/* Fond vidéo ou poster */}
        <img
          src={posterImg}
          alt={protagonist.name}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
        {isPlaying && (
          <video
            ref={videoRef}
            src={teaserVideo}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />
        )}

        {/* Voile d'ambiance cinématographique */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/50 pointer-events-none" />

        {/* Overlay standardisé : alignement vertical strict, 6 actions, pas de croix, titre en haut à gauche et prénom épuré en bas à gauche */}
        <UnifiedVideoCardOverlay
          titleBadge={protagonist.role || 'Studio'}
          displayName={protagonist.name}
          isPlaying={isPlaying}
          onTogglePlay={togglePlay}
          isMuted={isMuted}
          onToggleMute={toggleMute}
          questionText={protagonist.stories?.[0]?.question || "Quelle vision singulière ce parcours apporte-t-il au monde ?"}
          factText={protagonist.teaserPitch || protagonist.bio || "Passeur d'un savoir vivant transmis à sa communauté."}
          onOpenProfile={() => {
            onClose();
            onEnterUniverse(protagonist.id);
          }}
          onShare={() => {
            if (navigator.clipboard) {
              navigator.clipboard.writeText(window.location.href);
            }
          }}
        >
          {/* Modale d'évaluation de la résonance */}
          <ResonanceModal
            isOpen={isResonanceModalOpen}
            onClose={() => setIsResonanceModalOpen(false)}
            storyId={storyId || protagonist.stories?.[0]?.id || `story-${protagonist.id}`}
            topicId={topicId || protagonist.documentaryId || 'exploration-generale'}
            personName={protagonist.name}
            initialPercentage={resonancePct}
            onRatingSubmitted={(pct) => setResonancePct(pct)}
          />
        </UnifiedVideoCardOverlay>
      </div>
    </div>
  );
};
