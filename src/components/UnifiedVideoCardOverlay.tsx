import React, { useState } from 'react';
import { 
  Award, 
  BookOpen, 
  Sparkles, 
  Share2, 
  MoreHorizontal, 
  Flag, 
  Ban, 
  Check, 
  Pause, 
  Volume2, 
  VolumeX 
} from 'lucide-react';
import { TvPlayerIcon, ProfileSoloIcon } from './YonywoodBrandIcons';

export interface UnifiedVideoCardOverlayProps {
  // Haut gauche
  titleBadge: string;
  badgeIcon?: React.ReactNode;

  // Bas gauche
  displayName: string;

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

  // 5. Partager (Share2)
  onShare?: () => void;
  isShareCopied?: boolean;

  // 6. Options (...) Signaler & Bloquer
  onReportVideo?: () => void;
  onBlockVideo?: () => void;

  // Enfants optionnels (modales internes spécifiques, etc.)
  children?: React.ReactNode;
}

export const UnifiedVideoCardOverlay: React.FC<UnifiedVideoCardOverlayProps> = ({
  titleBadge,
  badgeIcon,
  displayName,
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
  onShare,
  isShareCopied = false,
  onReportVideo,
  onBlockVideo,
  children
}) => {
  const [internalQuestionOpen, setInternalQuestionOpen] = useState(false);
  const [internalFactOpen, setInternalFactOpen] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

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
    } else {
      setFeedbackToast('Vidéo signalée à la modération.');
      setTimeout(() => setFeedbackToast(null), 2500);
    }
  };

  const handleBlock = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMoreMenu(false);
    if (onBlockVideo) {
      onBlockVideo();
    } else {
      setFeedbackToast('Cette vidéo a été masquée.');
      setTimeout(() => setFeedbackToast(null), 2500);
    }
  };

  // Prénom ou nom épuré
  const cleanDisplayName = displayName ? displayName.split(' ')[0] : '';

  return (
    <>
      {/* =================================================================== */}
      {/* HAUT GAUCHE : TITRE / THÉMATIQUE / ENTREPRISE (BADGE ÉPURÉ)        */}
      {/* =================================================================== */}
      <div className="absolute top-3.5 sm:top-4 left-3.5 sm:left-4 z-20 pointer-events-auto max-w-[calc(100%-100px)]">
        <div className="px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[11px] sm:text-xs font-semibold text-white tracking-wide shadow-md flex items-center gap-1.5 truncate">
          {badgeIcon && <span className="shrink-0">{badgeIcon}</span>}
          <span className="truncate">{titleBadge}</span>
        </div>
      </div>

      {/* =================================================================== */}
      {/* HAUT DROITE : LECTEUR VIDÉO (ALIGNE STRICTEMENT SUR LA COLONNE)     */}
      {/* =================================================================== */}
      <div className="absolute top-3.5 sm:top-4 right-3.5 sm:right-4 z-20 pointer-events-auto flex items-center gap-1.5">
        {/* Bouton Muet discret (uniquement si en lecture et fonction fournie) */}
        {isPlaying && onToggleMute && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleMute();
            }}
            className="w-8 h-8 rounded-full bg-black/50 hover:bg-[#A2482B] backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer shadow-md"
            title={isMuted ? 'Activer le son' : 'Couper le son'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        )}

        {/* Déclencheur lecteur vidéo officiel TvPlayerIcon */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onTogglePlay(e);
          }}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-black/45 hover:bg-[#A2482B] backdrop-blur-md border border-white/20 hover:border-[#A2482B] text-white flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer hover:scale-105 active:scale-95 shrink-0"
          title={isPlaying ? 'Mettre en pause' : 'Lire la vidéo'}
        >
          {isPlaying ? (
            <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white text-white" />
          ) : (
            <TvPlayerIcon className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-white transition-transform" strokeWidth={1.6} />
          )}
        </button>
      </div>

      {/* =================================================================== */}
      {/* COLONNE D'ACTIONS VERTICALE (PARFAITEMENT ALIGNÉE AVEC LE LECTEUR) */}
      {/* =================================================================== */}
      <div 
        className="absolute right-3.5 sm:right-4 top-[56%] sm:top-[58%] -translate-y-1/2 z-30 flex flex-col items-center gap-2 sm:gap-2.5 pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. ÉVALUATION (Award) */}
        {onOpenResonance && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenResonance();
            }}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl border flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer hover:scale-105 active:scale-95 ${
              resonanceScore !== null && resonanceScore !== undefined
                ? 'bg-[#A2482B] border-[#A2482B] text-white shadow-[0_0_12px_rgba(162,72,43,0.5)]'
                : 'bg-black/45 hover:bg-[#A2482B] border-white/20 hover:border-[#A2482B] text-white backdrop-blur-md'
            }`}
            title={resonanceScore !== null && resonanceScore !== undefined ? `Résonance : ${resonanceScore}%` : 'Évaluer la vidéo'}
          >
            <Award className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </button>
        )}

        {/* 2. LA QUESTION (BookOpen) */}
        <button
          type="button"
          onClick={handleQuestionClick}
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl border flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer hover:scale-105 active:scale-95 ${
            internalQuestionOpen
              ? 'bg-[#FFE7A3] text-stone-900 border-[#FFE7A3] shadow-md'
              : 'bg-black/45 hover:bg-[#A2482B] border-white/20 hover:border-[#A2482B] text-white backdrop-blur-md'
          }`}
          title="Découvrir la question"
        >
          <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* 3. LE FAIT (Sparkles) */}
        <button
          type="button"
          onClick={handleFactClick}
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl border flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer hover:scale-105 active:scale-95 ${
            internalFactOpen
              ? 'bg-[#FFE7A3] text-stone-900 border-[#FFE7A3] shadow-md'
              : 'bg-black/45 hover:bg-[#A2482B] border-white/20 hover:border-[#A2482B] text-white backdrop-blur-md'
          }`}
          title="Découvrir le fait marquant"
        >
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* 4. LE PROFIL (ProfileSoloIcon) */}
        {onOpenProfile && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenProfile();
            }}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-black/45 hover:bg-[#A2482B] backdrop-blur-md border border-white/20 hover:border-[#A2482B] text-white flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer hover:scale-105 active:scale-95"
            title={`Voir le profil`}
          >
            <ProfileSoloIcon className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-white" />
          </button>
        )}

        {/* 5. PARTAGER (Share2) */}
        {onShare && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onShare();
            }}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl border flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer hover:scale-105 active:scale-95 ${
              isShareCopied
                ? 'bg-emerald-600 border-emerald-500 text-white'
                : 'bg-black/45 hover:bg-[#A2482B] border-white/20 hover:border-[#A2482B] text-white backdrop-blur-md'
            }`}
            title={isShareCopied ? 'Lien copié !' : 'Partager'}
          >
            {isShareCopied ? <Check className="w-4 h-4 text-white" /> : <Share2 className="w-4 h-4 text-white" />}
          </button>
        )}

        {/* 6. OPTIONS (...) SIGNALER / BLOQUER */}
        <div className="relative">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowMoreMenu(prev => !prev);
            }}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl border flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer hover:scale-105 active:scale-95 ${
              showMoreMenu
                ? 'bg-white text-stone-900 border-white'
                : 'bg-black/45 hover:bg-stone-800 border-white/20 text-white backdrop-blur-md'
            }`}
            title="Options : Signaler ou Bloquer"
          >
            <MoreHorizontal className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Menu Signaler / Bloquer */}
          {showMoreMenu && (
            <div 
              onClick={(e) => e.stopPropagation()}
              className="absolute right-12 bottom-0 z-40 bg-stone-900/95 backdrop-blur-md border border-white/20 rounded-xl p-1.5 shadow-2xl min-w-[160px] space-y-1 animate-in fade-in zoom-in-95 duration-150"
            >
              <button
                type="button"
                onClick={handleReport}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-stone-200 hover:text-white hover:bg-white/10 transition-colors text-left cursor-pointer"
              >
                <Flag className="w-3.5 h-3.5 text-amber-400" />
                <span>Signaler la vidéo</span>
              </button>
              <button
                type="button"
                onClick={handleBlock}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-red-300 hover:text-red-200 hover:bg-red-500/20 transition-colors text-left cursor-pointer"
              >
                <Ban className="w-3.5 h-3.5 text-red-400" />
                <span>Bloquer cette vidéo</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* =================================================================== */}
      {/* BAS GAUCHE : PRÉNOM OU NOM DE L'ENTREPRISE UNIQUEMENT                */}
      {/* =================================================================== */}
      <div className="absolute bottom-3.5 sm:bottom-4 left-3.5 sm:left-4 z-20 pointer-events-auto pr-16 max-w-[78%]">
        <h3 className="font-editorial text-xl sm:text-2xl font-bold text-white tracking-wider leading-snug drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] truncate">
          {cleanDisplayName}
        </h3>
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
