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

        {/* HAUT : Badge Thématique/Direction à gauche & Déclencheur TV unique à droite (AUCUNE question sur la vidéo) */}
        <div className="relative z-20 flex items-center justify-between p-3.5 sm:p-4 pointer-events-auto">
          <span className="w-fit max-w-[200px] truncate px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-xs font-semibold text-white shadow-md">
            {tagLabel}
          </span>

          {/* Bouton lecteur TV officiel en haut à droite (UNIQUE déclencheur visuel) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              togglePlay(e);
            }}
            className="w-8.5 h-8.5 sm:w-9.5 sm:h-9.5 rounded-xl bg-black/45 hover:bg-[#A2482B] backdrop-blur-md border border-white/20 hover:border-[#A2482B] text-white flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer hover:scale-105 active:scale-95 shrink-0"
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

          {/* 2. Bouton Livre / Question existentielle (s'affiche en bas au clic) */}
          <button
            id="matrix-modal-btn-question"
            onClick={(e) => {
              e.stopPropagation();
              setIsQuestionOpen(prev => !prev);
            }}
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl backdrop-blur-md border flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer hover:scale-105 active:scale-95 ${
              isQuestionOpen
                ? 'bg-[#A2482B] border-[#A2482B] text-white shadow-[0_0_12px_rgba(162,72,43,0.5)]'
                : 'bg-black/45 hover:bg-[#A2482B] border-white/20 hover:border-[#A2482B] text-white'
            }`}
            title="Découvrir la question"
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

        {/* QUESTION EN BAS : N'apparaît QUE lorsqu'on clique sur l'icône livre ouvert */}
        {isQuestionOpen && (
          <div 
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-x-3 bottom-16 sm:bottom-20 z-40 bg-stone-900/95 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 shadow-2xl text-white animate-in fade-in slide-in-from-bottom-3 duration-200 pointer-events-auto"
          >
            <div className="flex items-center justify-between pb-1.5 border-b border-white/10 mb-2">
              <span className="text-[10px] font-semibold text-[#FFE7A3] uppercase tracking-wider">
                {tagLabel} · Question d'héritage
              </span>
              <button
                onClick={() => setIsQuestionOpen(false)}
                className="w-5 h-5 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors text-xs"
                title="Fermer"
              >
                ✕
              </button>
            </div>
            <p className="text-xs sm:text-[13px] font-serif italic text-stone-100 leading-snug drop-shadow-sm">
              « {storyQuestion || person.invitationStory || "Quelle mémoire choisissons-nous de transmettre aux générations qui viennent ?"} »
            </p>
          </div>
        )}

        {/* BAS : STRICTEMENT LE PRÉNOM AU GABARIT STANDARD (MODÈLE DIEUDONNÉ) & BOUTON MUTE UNIQUEMENT SI VIDÉO EN LECTURE */}
        <div className="relative z-20 flex items-end justify-between pointer-events-auto pb-4 sm:pb-5 px-3.5 sm:px-4 mt-auto gap-2">
          <div className="flex flex-col min-w-0">
            <h3 className="font-editorial text-[15px] sm:text-base font-bold text-white tracking-wider leading-snug pb-0.5 drop-shadow-md truncate">
              {displayName}
            </h3>
          </div>

          {/* Bouton Muet / Son : N'apparaît QUE lorsque la vidéo est lancée à partir du lecteur TV vintage */}
          {isPlaying && (
            <button
              id="matrix-modal-btn-mute"
              onClick={toggleMute}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/50 hover:bg-[#A2482B] text-white backdrop-blur-md border border-white/20 hover:border-[#A2482B] flex items-center justify-center cursor-pointer transition-colors shadow-md hover:scale-105 active:scale-95 shrink-0 animate-in fade-in duration-150"
              title={isMuted ? "Activer le son" : "Couper le son"}
            >
              {isMuted ? (
                <VolumeX className="w-3.5 h-3.5 text-white" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-white" />
              )}
            </button>
          )}
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
