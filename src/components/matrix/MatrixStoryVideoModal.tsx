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

      {/* CARTE VIDÉO VERTICALE AU GABARIT STANDARD (CONFORME À LA CAPTURE FOURNIE) */}
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

        {/* Voile cinématographique */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/35 pointer-events-none" />

        {/* Bouton de lecture central discret au repos pour inviter à lancer la vidéo */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-15">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-black/45 backdrop-blur-md border border-white/25 flex items-center justify-center text-white shadow-2xl group-hover:scale-110 group-hover:bg-[#A2482B]/80 transition-all duration-300">
              <TvPlayerIcon className="w-7 h-7 sm:w-8 sm:h-8 text-white drop-shadow-md" strokeWidth={1.7} />
            </div>
          </div>
        )}

        {/* HAUT : Badge Direction à gauche & Icône TvPlayerIcon à droite */}
        <div className="relative z-10 p-3 sm:p-4 flex items-center justify-between gap-2">
          <span className="w-fit max-w-[170px] truncate px-3.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-xs font-semibold text-white shadow-md">
            {tagLabel}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              togglePlay(e);
            }}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-black/45 hover:bg-[#A2482B] backdrop-blur-md border border-white/20 hover:border-[#A2482B] text-white flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer hover:scale-105 active:scale-95 shrink-0"
            title={isPlaying ? "Mettre en pause" : "Lire la vidéo"}
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5 fill-white text-white" />
            ) : (
              <TvPlayerIcon className="w-4.5 h-4.5 text-white" strokeWidth={1.6} />
            )}
          </button>
        </div>

        {/* COLONNE LATÉRALE DROITE D'ICÔNES (AUX 2/3 POUR DÉGAGER LE PORTRAIT) */}
        <div 
          className="absolute right-2 sm:right-3.5 top-[60%] -translate-y-1/2 z-30 flex flex-col items-center gap-2 sm:gap-2.5 pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 1. Bouton Favori / Bookmark */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsBookmarked(prev => !prev);
            }}
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl backdrop-blur-md border flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer hover:scale-105 active:scale-95 ${
              isBookmarked
                ? 'bg-[#A2482B] border-[#A2482B] text-white shadow-[0_0_12px_rgba(162,72,43,0.5)]'
                : 'bg-black/45 hover:bg-[#A2482B] border-white/20 hover:border-[#A2482B] text-white'
            }`}
            title={isBookmarked ? "Enregistré dans vos favoris" : "Ajouter aux favoris"}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-white text-white' : 'text-white'}`} />
          </button>

          {/* 2. Bouton Livre / Question existentielle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsQuestionOpen(prev => !prev);
            }}
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl backdrop-blur-md border flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer hover:scale-105 active:scale-95 ${
              isQuestionOpen
                ? 'bg-[#A2482B] border-[#A2482B] text-white'
                : 'bg-black/45 hover:bg-[#A2482B] border-white/20 hover:border-[#A2482B] text-white'
            }`}
            title="Question & Témoignage"
          >
            <BookOpen className="w-4 h-4 text-white" />
          </button>

          {/* 3. Bouton Évaluation Résonance */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsResonanceModalOpen(true);
            }}
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl backdrop-blur-md border flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer hover:scale-105 active:scale-95 ${
              resonancePct !== null
                ? 'bg-[#A2482B] border-[#A2482B] text-white shadow-[0_0_12px_rgba(162,72,43,0.5)]'
                : 'bg-black/45 hover:bg-[#A2482B] border-white/20 hover:border-[#A2482B] text-white'
            }`}
            title={resonancePct !== null ? `Résonance : ${resonancePct}%` : "Évaluer la résonance"}
          >
            <MessageSquare className="w-4 h-4 text-white" />
          </button>

          {/* 4. Bouton Partager */}
          <button
            onClick={handleShare}
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl backdrop-blur-md border flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer hover:scale-105 active:scale-95 ${
              isCopied
                ? 'bg-emerald-700 border-emerald-500 text-white'
                : 'bg-black/45 hover:bg-[#A2482B] border-white/20 hover:border-[#A2482B] text-white'
            }`}
            title={isCopied ? "Lien copié !" : "Partager"}
          >
            {isCopied ? <Check className="w-4 h-4 text-white" /> : <ShareIcon className="w-4 h-4 text-white" />}
          </button>
        </div>

        {/* POPOVER QUESTION AU CLIC SUR LE LIVRE */}
        {isQuestionOpen && (
          <div 
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-x-3 top-16 z-40 bg-stone-900/95 backdrop-blur-md p-3.5 rounded-2xl border border-[#A2482B]/60 shadow-xl text-white animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between pb-1.5 border-b border-white/10 mb-2">
              <span className="text-[10px] font-semibold text-[#FFE7A3] uppercase tracking-wider">
                {tagLabel} · Question existentielle
              </span>
              <button
                onClick={() => setIsQuestionOpen(false)}
                className="text-stone-400 hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs sm:text-sm font-serif italic text-stone-100 leading-relaxed">
              « {person.question || person.centralQuestion || person.invitationStory || "Quelle mémoire choisissons-nous de transmettre aux générations qui viennent ?"} »
            </p>
          </div>
        )}

        {/* BAS : Prénom à gauche & Bouton Muet / Son à droite */}
        <div className="relative z-10 p-3 sm:p-4 flex items-end justify-between gap-2">
          <div className="space-y-0.5">
            <h3 className="font-editorial text-lg sm:text-xl font-bold text-white tracking-wide leading-none drop-shadow-md">
              {displayName}
            </h3>
            {person.duoPartnerName && (
              <p className="text-[10.5px] text-stone-300 font-medium drop-shadow-xs">
                Duo avec <span className="text-[#FFE7A3]">{person.duoPartnerName}</span>
              </p>
            )}
          </div>

          {/* Bouton Muet / Son en bas à droite */}
          <button
            onClick={toggleMute}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/50 hover:bg-[#A2482B] backdrop-blur-md border border-white/20 hover:border-[#A2482B] text-white flex items-center justify-center cursor-pointer transition-all shadow-md hover:scale-105 active:scale-95 shrink-0"
            title={isMuted ? "Activer le son" : "Couper le son"}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-white" />
            ) : (
              <Volume2 className="w-4 h-4 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Modal d'évaluation de la résonance */}
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
  );
};
