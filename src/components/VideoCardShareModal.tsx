import React, { useState } from 'react';
import { 
  Bookmark, 
  BookmarkCheck, 
  Share2, 
  Copy, 
  Check, 
  ThumbsDown, 
  Flag, 
  X,
  Send,
  MessageCircle
} from 'lucide-react';
import { ShareIcon } from './ShareIcon';

interface VideoCardShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoTitle?: string;
  videoId?: string;
  onReport?: () => void;
  onNotInterested?: () => void;
  onSaveToList?: (saved: boolean) => void;
  shareUrl?: string;
}

export const VideoCardShareModal: React.FC<VideoCardShareModalProps> = ({
  isOpen,
  onClose,
  videoTitle = 'cette vidéo',
  videoId,
  onReport,
  onNotInterested,
  onSaveToList,
  shareUrl
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isNotInterestedDone, setIsNotInterestedDone] = useState(false);
  const [isReported, setIsReported] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentUrl = shareUrl || (typeof window !== 'undefined' ? window.location.href : '');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
      onClose();
    }, 1800);
  };

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setIsCopied(true);
      showToast('Lien copié dans le presse-papier !');
    }
  };

  const handleToggleSave = () => {
    const nextSaved = !isSaved;
    setIsSaved(nextSaved);
    if (onSaveToList) {
      onSaveToList(nextSaved);
    }
    showToast(nextSaved ? 'Enregistré dans votre liste Ma Forêt' : 'Retiré de votre liste');
  };

  const handleNotInterested = () => {
    setIsNotInterestedDone(true);
    if (onNotInterested) {
      onNotInterested();
    }
    showToast('Moins de contenus similaires vous seront proposés');
  };

  const handleReportAction = () => {
    setIsReported(true);
    if (onReport) {
      onReport();
    }
    showToast('Vidéo signalée à notre équipe de modération');
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`Découvrez ${videoTitle} sur YonyWood : ${currentUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(`Regardez ce récit inspirant sur YonyWood : ${videoTitle}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(currentUrl)}`, '_blank');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <div 
        className="w-full sm:max-w-md bg-stone-900 border border-white/15 rounded-t-3xl sm:rounded-3xl p-5 text-white shadow-2xl space-y-4 animate-in slide-in-from-bottom duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête de la modale */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#A2482B]/30 border border-[#A2482B]/60 flex items-center justify-center text-[#FFE7A3]">
              <ShareIcon className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-editorial text-sm sm:text-base font-semibold text-white tracking-wide leading-tight">
                Options & Partage
              </h3>
              <p className="text-[11px] text-stone-400 truncate max-w-[240px]">
                {videoTitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 4 Actions fondamentales façon YouTube */}
        <div className="space-y-1.5 pt-1">
          {/* 1. Enregistrer dans une liste */}
          <button
            type="button"
            onClick={handleToggleSave}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl transition-all text-left cursor-pointer ${
              isSaved 
                ? 'bg-[#A2482B]/25 border border-[#A2482B]/60 text-white' 
                : 'bg-white/5 hover:bg-white/10 text-stone-200 border border-transparent hover:border-white/10'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isSaved ? 'bg-[#A2482B] text-white' : 'bg-white/10 text-amber-300'}`}>
                {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              </div>
              <div>
                <span className="text-xs sm:text-sm font-semibold block">
                  {isSaved ? 'Enregistré dans ma liste' : 'Enregistrer dans une liste'}
                </span>
                <span className="text-[11px] text-stone-400 block">
                  Ajouter à mes mémoires sauvegardées (Ma Forêt)
                </span>
              </div>
            </div>
            {isSaved && <Check className="w-4 h-4 text-[#FFE7A3]" />}
          </button>

          {/* 2. Partager le lien */}
          <button
            type="button"
            onClick={handleCopyLink}
            className="w-full flex items-center justify-between px-3.5 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-stone-200 border border-transparent hover:border-white/10 transition-all text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-emerald-400">
                {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </div>
              <div>
                <span className="text-xs sm:text-sm font-semibold block">
                  {isCopied ? 'Lien copié !' : 'Partager le lien'}
                </span>
                <span className="text-[11px] text-stone-400 block">
                  Copier l’adresse directe du récit
                </span>
              </div>
            </div>
            <span className="text-[11px] text-stone-400 font-mono px-2 py-0.5 rounded-md bg-white/10">
              Copier
            </span>
          </button>

          {/* 3. Pas intéressé / Dire si on est intéressé ou pas */}
          <button
            type="button"
            onClick={handleNotInterested}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl transition-all text-left cursor-pointer ${
              isNotInterestedDone
                ? 'bg-amber-500/20 border border-amber-500/50 text-white'
                : 'bg-white/5 hover:bg-white/10 text-stone-200 border border-transparent hover:border-white/10'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-stone-300">
                <ThumbsDown className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs sm:text-sm font-semibold block">
                  {isNotInterestedDone ? 'Préférence enregistrée' : 'Pas intéressé(e)'}
                </span>
                <span className="text-[11px] text-stone-400 block">
                  Proposer moins de contenus sur ce thème
                </span>
              </div>
            </div>
          </button>

          {/* 4. Signaler tout simplement */}
          <button
            type="button"
            onClick={handleReportAction}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl transition-all text-left cursor-pointer ${
              isReported
                ? 'bg-red-500/20 border border-red-500/50 text-red-200'
                : 'bg-white/5 hover:bg-red-950/40 text-stone-200 hover:text-red-300 border border-transparent hover:border-red-900/40'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center">
                <Flag className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs sm:text-sm font-semibold block">
                  {isReported ? 'Vidéo signalée' : 'Signaler'}
                </span>
                <span className="text-[11px] text-stone-400 block">
                  Signaler un contenu inapproprié ou trompeur
                </span>
              </div>
            </div>
          </button>
        </div>

        {/* Boutons rapides pour les réseaux sociaux */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="flex-1 py-2 px-3 rounded-xl bg-white/5 hover:bg-emerald-600/30 text-stone-300 hover:text-white border border-white/10 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>WhatsApp</span>
          </button>
          <button
            type="button"
            onClick={handleShareTwitter}
            className="flex-1 py-2 px-3 rounded-xl bg-white/5 hover:bg-sky-600/30 text-stone-300 hover:text-white border border-white/10 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Send className="w-3.5 h-3.5 text-sky-400" />
            <span>X / Twitter</span>
          </button>
        </div>

        {/* Toast confirmation temporaire */}
        {toastMessage && (
          <div className="bg-[#A2482B] text-white text-xs font-semibold py-2 px-3 rounded-xl text-center shadow-lg animate-in fade-in duration-150">
            {toastMessage}
          </div>
        )}
      </div>
    </div>
  );
};
