import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, X, ArrowRight, Sparkles, MapPin, Award } from 'lucide-react';
import { Protagonist } from '../types';
import { ResonanceModal } from './ResonanceModal';
import { ProfileSoloIcon, TvPlayerIcon } from './YonywoodBrandIcons';

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
      {/* Container vertical 9:16 standardisé */}
      <div 
        className="h-[min(490px,calc(100dvh-210px))] sm:h-[min(540px,calc(100dvh-190px))] lg:h-[min(570px,calc(100dvh-180px))] aspect-[9/16] w-auto mx-auto rounded-3xl overflow-hidden bg-stone-950 text-white shadow-2xl border border-stone-200/40 relative flex flex-col justify-between p-4 sm:p-5 select-none shrink-0 animate-in zoom-in-95 duration-200"
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

        {/* HAUT : Bouton Évaluer à gauche & Lecteur Vidéo vintage seul en haut à droite */}
        <div className="relative z-10 flex items-center justify-between gap-2 w-full">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsResonanceModalOpen(true);
            }}
            className={`w-9 h-9 rounded-xl backdrop-blur-md border flex items-center justify-center shadow-md transition-all cursor-pointer hover:scale-105 active:scale-95 ${
              resonancePct !== null
                ? 'bg-[#A2482B] border-[#A2482B] text-white shadow-[0_0_12px_rgba(162,72,43,0.45)]'
                : 'bg-black/45 hover:bg-[#A2482B] border-white/20 hover:border-[#A2482B] text-white'
            }`}
            title={resonancePct !== null ? `Résonance : ${resonancePct}%` : "Évaluer la résonance"}
          >
            <Award className="w-4 h-4 text-white" />
          </button>

          {/* Déclencheur lecteur vidéo vintage officiel TvPlayerIcon en haut à droite */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              togglePlay(e);
            }}
            className="w-8.5 h-8.5 sm:w-9.5 sm:h-9.5 rounded-xl bg-black/45 hover:bg-[#A2482B] backdrop-blur-md border border-white/20 hover:border-[#A2482B] text-white flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer hover:scale-105 active:scale-95 shrink-0"
            title={isPlaying ? 'Pause' : 'Lecture vidéo'}
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white text-white" />
            ) : (
              <TvPlayerIcon className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-white transition-transform" strokeWidth={1.6} />
            )}
          </button>
        </div>


        {/* Modale d'évaluation de la résonance (au clic sur l'icône) */}
        <ResonanceModal
          isOpen={isResonanceModalOpen}
          onClose={() => setIsResonanceModalOpen(false)}
          storyId={storyId || protagonist.stories?.[0]?.id || `story-${protagonist.id}`}
          topicId={topicId || protagonist.documentaryId || 'exploration-generale'}
          personName={protagonist.name}
          initialPercentage={resonancePct}
          onRatingSubmitted={(pct) => {
            setResonancePct(pct);
          }}
        />

        {/* BAS : Identité & Bouton Muet en bas à droite & Action Entrer dans son univers */}
        <div className="relative z-10 space-y-3 pt-3">
          <div className="flex items-end justify-between gap-2.5">
            <div className="space-y-1 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-editorial text-[15px] sm:text-base font-bold text-white tracking-wider leading-snug drop-shadow-md truncate">
                  {protagonist.name.split(' ')[0]}
                </h3>
                {protagonist.flag && <span className="text-base shrink-0">{protagonist.flag}</span>}
              </div>
            </div>

            {/* Bouton Muet / Son en bas à droite (visible uniquement en lecture) */}
            {isPlaying && (
              <button
                onClick={toggleMute}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/50 hover:bg-[#A2482B] backdrop-blur-md border border-white/20 hover:border-[#A2482B] text-white flex items-center justify-center cursor-pointer transition-all shadow-md hover:scale-105 active:scale-95 shrink-0"
                title={isMuted ? 'Activer le son' : 'Couper le son'}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" /> : <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />}
              </button>
            )}
          </div>

          {/* Action : Entrer dans son univers */}
          <div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEnterUniverse(protagonist.id);
              }}
              id={`enter-universe-btn-${protagonist.id}`}
              className="w-full h-10 sm:h-11 px-4 rounded-xl bg-[#A2482B] hover:bg-[#8A3B22] text-white font-bold text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99]"
            >
              <span>Entrer dans son univers</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
