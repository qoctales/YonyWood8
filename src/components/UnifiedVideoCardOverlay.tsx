import React, { useState, useRef, useEffect } from 'react';
import { 
  Award, 
  BookOpen, 
  Sparkles, 
  Star,
  MoreHorizontal, 
  Flag, 
  Ban, 
  Check, 
  Pause, 
  Volume2, 
  VolumeX 
} from 'lucide-react';
import { TvPlayerIcon, ProfileSoloIcon } from './YonywoodBrandIcons';
import { ShareIcon } from './ShareIcon';
import { blockVideo } from '../utils/blockedContent';

export interface UnifiedVideoCardOverlayProps {
  // Identifiant optionnel pour le blocage effectif
  videoId?: string;

  // Haut gauche
  titleBadge: string;
  badgeIcon?: React.ReactNode;

  // Bas gauche
  displayName: string;
  preserveFullName?: boolean;
  roleSubtitle?: string;

  // Lecteur vidéo en haut à droite
  isPlaying: boolean;
  onTogglePlay: (e?: React.MouseEvent) => void;
  isMuted?: boolean;
  onToggleMute?: () => void;

  // 1. Évaluation (Award)
  resonanceScore?: number | null;
  onOpenResonance?: () => void;

  // 2. Question (BookOpen)
  questionText?: string;
  onOpenQuestionModal?: () => void; // Si géré en externe

  // 3. Fait (Sparkles)
  factText?: string;
  onOpenFactModal?: () => void; // Si géré en externe

  // 4. Profil (ProfileSoloIcon)
  onOpenProfile?: () => void;

  // Lignée (Star)
  onOpenLineage?: () => void;

  // 5. Partager (ShareIcon)
  onShare?: () => void;
  isShareCopied?: boolean;

  // 6. Options (...) Signaler & Bloquer
  onReportVideo?: () => void;
  onBlockVideo?: () => void;

  // Colonne d'actions personnalisée (ex: boutons de navigation du profil)
  customActionButtons?: React.ReactNode;

  // Enfants optionnels (modales internes spécifiques, etc.)
  children?: React.ReactNode;
}

export const UnifiedVideoCardOverlay: React.FC<UnifiedVideoCardOverlayProps> = ({
  videoId,
  titleBadge,
  badgeIcon,
  displayName,
  preserveFullName = false,
  roleSubtitle,
  isPlaying,
  onTogglePlay,
  isMuted = false,
  onToggleMute,
  resonanceScore,
  onOpenResonance,
  questionText,
  onOpenQuestionModal,
  factText,
  onOpenFactModal,
  onOpenProfile,
  onOpenLineage,
  onShare,
  isShareCopied = false,
  onReportVideo,
  onBlockVideo,
  customActionButtons,
  children
}) => {
  const [internalQuestionOpen, setInternalQuestionOpen] = useState(false);
  const [internalFactOpen, setInternalFactOpen] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  // Fermeture automatique du menu 3-points au clic extérieur
  useEffect(() => {
    if (!showMoreMenu) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
        setShowMoreMenu(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [showMoreMenu]);

  // Gestion du clic sur Question
  const handleQuestionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onOpenQuestionModal) {
      onOpenQuestionModal();
    } else {
      setInternalFactOpen(false);
      setInternalQuestionOpen(prev => !prev);
    }
  };

  // Gestion du clic sur Fait
  const handleFactClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onOpenFactModal) {
      onOpenFactModal();
    } else {
      setInternalQuestionOpen(false);
      setInternalFactOpen(prev => !prev);
    }
  };

  const handleReport = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMoreMenu(false);
    if (onReportVideo) {
      onReportVideo();
    }
    setFeedbackToast('Vidéo signalée à la modération.');
    setTimeout(() => setFeedbackToast(null), 2500);
  };

  const handleBlock = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMoreMenu(false);
    if (videoId) {
      blockVideo(videoId);
    }
    if (onBlockVideo) {
      onBlockVideo();
    }
    setFeedbackToast('Cette vidéo a été masquée pour votre compte.');
    setTimeout(() => setFeedbackToast(null), 2500);
  };

  // Prénom ou nom épuré
  const cleanDisplayName = displayName ? displayName.split(' ')[0] : '';

  return (
    <>
      {/* =================================================================== */}
      {/* HAUT GAUCHE : TITRE / THÉMATIQUE / ENTREPRISE (BADGE ÉPURÉ)        */}
      {/* =================================================================== */}
      <div className="absolute top-3 sm:top-3.5 left-3 sm:left-3.5 z-20 pointer-events-auto max-w-[calc(100%-80px)]">
        <div className="px-2.5 sm:px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[10px] sm:text-[11px] font-semibold text-white tracking-wide shadow-md flex items-center gap-1.5 truncate">
          {badgeIcon && <span className="shrink-0">{badgeIcon}</span>}
          <span className="truncate">{titleBadge}</span>
        </div>
      </div>

      {/* =================================================================== */}
      {/* =================================================================== */}
      {/* HAUT DROITE : LECTEUR VIDÉO (BOUTON ÉLÉGANT LÉGÈREMENT AGRANDI)     */}
      {/* =================================================================== */}
      <div className="absolute top-3 sm:top-3.5 right-3 sm:right-3.5 z-20 pointer-events-auto flex items-center gap-1.5">
        {/* Bouton Muet discret (uniquement si en lecture et fonction fournie) */}
        {isPlaying && onToggleMute && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleMute();
            }}
            className="w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-full bg-black/50 hover:bg-[#A2482B] backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
            title={isMuted ? 'Activer le son' : 'Couper le son'}
          >
            {isMuted ? <VolumeX className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> : <Volume2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
          </button>
        )}

        {/* Déclencheur lecteur vidéo officiel TvPlayerIcon légèrement augmenté */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onTogglePlay(e);
          }}
          className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-xl bg-black/45 hover:bg-[#A2482B] backdrop-blur-md border border-white/20 hover:border-[#A2482B] text-white flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer hover:scale-105 active:scale-95 shrink-0"
          title={isPlaying ? 'Mettre en pause' : 'Lire la vidéo'}
        >
          {isPlaying ? (
            <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white text-white" />
          ) : (
            <TvPlayerIcon className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-white transition-transform" strokeWidth={1.7} />
          )}
        </button>
      </div>

      {/* =================================================================== */}
      {/* COLONNE D'ACTIONS VERTICALE (BOUTONS LÉGÈREMENT AGRANDIS ET SOBRES) */}
      {/* =================================================================== */}
      <div 
        className="absolute right-2.5 sm:right-3.5 top-[56%] sm:top-[58%] -translate-y-1/2 z-30 flex flex-col items-center gap-1.5 sm:gap-2 pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {customActionButtons ? (
          customActionButtons
        ) : (
          <>
            {/* 1. ÉVALUATION (Award) */}
        {onOpenResonance && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenResonance();
            }}
            className={`w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-xl border flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer hover:scale-105 active:scale-95 ${
              resonanceScore !== null && resonanceScore !== undefined
                ? 'bg-[#A2482B] border-[#A2482B] text-white shadow-[0_0_10px_rgba(162,72,43,0.5)]'
                : 'bg-black/45 hover:bg-[#A2482B] border-white/20 hover:border-[#A2482B] text-white backdrop-blur-md'
            }`}
            title={resonanceScore !== null && resonanceScore !== undefined ? `Résonance : ${resonanceScore}%` : 'Évaluer la vidéo'}
          >
            <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
          </button>
        )}

        {/* 2. LA QUESTION (BookOpen) */}
        <button
          type="button"
          onClick={handleQuestionClick}
          className={`w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-xl border flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer hover:scale-105 active:scale-95 ${
            internalQuestionOpen
              ? 'bg-[#FFE7A3] text-stone-900 border-[#FFE7A3] shadow-md'
              : 'bg-black/45 hover:bg-[#A2482B] border-white/20 hover:border-[#A2482B] text-white backdrop-blur-md'
          }`}
          title="Découvrir la question"
        >
          <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>

        {/* 3. LE PROFIL (ProfileSoloIcon) */}
        {onOpenProfile && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenProfile();
            }}
            className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-xl bg-black/45 hover:bg-[#A2482B] backdrop-blur-md border border-white/20 hover:border-[#A2482B] text-white flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer hover:scale-105 active:scale-95"
            title={`Voir le profil`}
          >
            <ProfileSoloIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white" />
          </button>
        )}

        {/* 5. PARTAGER (ShareIcon) */}
        {onShare && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onShare();
            }}
            className={`w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-xl border flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer hover:scale-105 active:scale-95 ${
              isShareCopied
                ? 'bg-emerald-600 border-emerald-500 text-white'
                : 'bg-black/45 hover:bg-[#A2482B] border-white/20 hover:border-[#A2482B] text-white backdrop-blur-md'
            }`}
            title={isShareCopied ? 'Lien copié !' : 'Partager'}
          >
            {isShareCopied ? <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" /> : <ShareIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />}
          </button>
        )}

        {/* 6. OPTIONS (...) SIGNALER / BLOQUER */}
        <div className="relative" ref={moreMenuRef}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowMoreMenu(prev => !prev);
            }}
            className={`w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-xl border flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer hover:scale-105 active:scale-95 ${
              showMoreMenu
                ? 'bg-white text-stone-900 border-white'
                : 'bg-black/45 hover:bg-stone-800 border-white/20 text-white backdrop-blur-md'
            }`}
            title="Options : Signaler ou Bloquer"
          >
            <MoreHorizontal className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* Menu Signaler / Bloquer */}
          {showMoreMenu && (
            <div 
              onClick={(e) => e.stopPropagation()}
              className="absolute right-10 bottom-0 z-40 bg-stone-900/95 backdrop-blur-md border border-white/20 rounded-xl p-1.5 shadow-2xl min-w-[160px] space-y-1 animate-in fade-in zoom-in-95 duration-150"
            >
              <button
                type="button"
                onClick={handleReport}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-stone-200 hover:text-white hover:bg-white/10 transition-colors text-left cursor-pointer"
              >
                <Flag className="w-3 h-3 text-amber-400" />
                <span>Signaler la vidéo</span>
              </button>
              <button
                type="button"
                onClick={handleBlock}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-red-300 hover:text-red-200 hover:bg-red-500/20 transition-colors text-left cursor-pointer"
              >
                <Ban className="w-3 h-3 text-red-400" />
                <span>Bloquer cette vidéo</span>
              </button>
            </div>
          )}
        </div>
          </>
        )}
      </div>

      {/* =================================================================== */}
      {/* BAS GAUCHE : PRÉNOM ET NOM HARMONISÉS, POLICE LÉGÈREMENT RÉDUITE    */}
      {/* =================================================================== */}
      <div className="absolute bottom-3 sm:bottom-3.5 left-3 sm:left-3.5 z-20 pointer-events-auto pr-12 max-w-[75%]">
        <h3 className="font-editorial text-[15px] sm:text-[17px] md:text-[18px] font-bold text-white tracking-[0.08em] sm:tracking-[0.1em] leading-snug drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] truncate">
          {preserveFullName ? displayName : cleanDisplayName}
        </h3>
        {roleSubtitle && (
          <p className="text-[11px] sm:text-xs text-stone-300 font-medium tracking-wide drop-shadow-md truncate mt-0.5">
            {roleSubtitle}
          </p>
        )}
      </div>

      {/* =================================================================== */}
      {/* VOLETS DÉPLIANTS INTERNES : LA QUESTION OU LE FAIT                  */}
      {/* =================================================================== */}
      {internalQuestionOpen && (
        <div 
          onClick={(e) => e.stopPropagation()}
          className="absolute inset-x-3.5 sm:inset-x-4 bottom-14 sm:bottom-16 z-40 bg-black/85 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 text-white shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200 pointer-events-auto"
        >
          <div className="flex items-center justify-between pb-1 mb-1.5 border-b border-white/10">
            <span className="text-[10px] sm:text-[11px] font-bold text-[#FFE7A3] uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              Question posée
            </span>
            <button 
              type="button"
              onClick={() => setInternalQuestionOpen(false)}
              className="text-white/60 hover:text-white text-xs px-1 cursor-pointer"
            >
              Fermer
            </button>
          </div>
          <p className="font-serif italic text-xs sm:text-sm text-stone-100 leading-relaxed">
            « {questionText || "Quelle vision singulière ce parcours apporte-t-il au monde ?"} »
          </p>
        </div>
      )}

      {internalFactOpen && (
        <div 
          onClick={(e) => e.stopPropagation()}
          className="absolute inset-x-3.5 sm:inset-x-4 bottom-14 sm:bottom-16 z-40 bg-black/85 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 text-white shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200 pointer-events-auto"
        >
          <div className="flex items-center justify-between pb-1 mb-1.5 border-b border-white/10">
            <span className="text-[10px] sm:text-[11px] font-bold text-[#FFE7A3] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Le fait marquant
            </span>
            <button 
              type="button"
              onClick={() => setInternalFactOpen(false)}
              className="text-white/60 hover:text-white text-xs px-1 cursor-pointer"
            >
              Fermer
            </button>
          </div>
          <p className="text-xs sm:text-sm text-stone-100 leading-relaxed font-sans">
            {factText || "Ce passeur de savoir incarne une tradition vivante et une transmission concrète auprès de sa communauté."}
          </p>
        </div>
      )}

      {/* Feedback Toast (signalement / blocage) */}
      {feedbackToast && (
        <div className="absolute inset-x-4 top-16 z-40 bg-stone-900/95 border border-white/25 text-white px-3 py-2 rounded-xl text-center text-xs shadow-xl animate-in fade-in pointer-events-none">
          {feedbackToast}
        </div>
      )}

      {/* Enfants supplémentaires */}
      {children}
    </>
  );
};
