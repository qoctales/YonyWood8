import React, { useState } from 'react';
import { 
  Bookmark, 
  BookmarkCheck, 
  Share2, 
  Copy, 
  Check, 
  Flag, 
  X,
  Share,
  ChevronDown,
  ChevronUp,
  UserX
} from 'lucide-react';

export interface VideoCardShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoTitle?: string;
  videoId?: string;
  onReport?: () => void;
  onBlockPerson?: () => void;
  onNotInterested?: () => void;
  onSaveToList?: (saved: boolean) => void;
  shareUrl?: string;
}

/* Logos vectoriels fidèles pour les 6 réseaux sociaux */
const WhatsAppIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.711 1.456h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 00-3.48-8.404z"/>
  </svg>
);

const FacebookIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const TikTokIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.46 6.3 6.3 0 0 0 1.87-4.46V8.72a8.28 8.28 0 0 0 4.9 1.58V6.85a4.86 4.86 0 0 1-1-.16Z"/>
  </svg>
);

const InstagramIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const TwitterXIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const LinkedInIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.79v8.37H6.46v-8.37M7.86 6.5a1.63 1.63 0 1 0 1.63 1.63A1.63 1.63 0 0 0 7.86 6.5z"/>
  </svg>
);

export const VideoCardShareModal: React.FC<VideoCardShareModalProps> = ({
  isOpen,
  onClose,
  videoTitle = 'ce récit',
  videoId,
  onReport,
  onBlockPerson,
  onNotInterested,
  onSaveToList,
  shareUrl
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isReported, setIsReported] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [showSocialOptions, setShowSocialOptions] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentUrl = shareUrl || (typeof window !== 'undefined' ? window.location.href : '');

  // Nettoyage de titre pour supprimer toute référence à 'retour au pays natal'
  const cleanTitle = (videoTitle || 'Récit documentaire')
    .replace(/retour au pays natal/gi, 'Origines & Ancrage')
    .trim();

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
      showToast('Lien copié dans le presse-papiers !');
    }
  };

  const handleToggleSave = () => {
    const nextSaved = !isSaved;
    setIsSaved(nextSaved);
    if (onSaveToList) {
      onSaveToList(nextSaved);
    }
    showToast(nextSaved ? 'Ajouté à vos mémoires sauvegardées' : 'Retiré de vos mémoires');
  };

  const handleReportAction = () => {
    setIsReported(true);
    if (onReport) {
      onReport();
    }
    showToast('Contenu signalé à notre équipe éditoriale');
  };

  const handleBlockPersonAction = () => {
    setIsBlocked(true);
    if (onBlockPerson) {
      onBlockPerson();
    }
    if (onNotInterested) {
      onNotInterested();
    }
    showToast('Cette personne a été bloquée');
  };

  // 1. WhatsApp
  const handleShareWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = encodeURIComponent(`Découvrez « ${cleanTitle} » sur YonyWood : ${currentUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  // 2. Facebook
  const handleShareFacebook = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, '_blank');
  };

  // 3. TikTok
  const handleShareTikTok = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
    }
    showToast('Lien copié pour TikTok !');
    window.open('https://www.tiktok.com/', '_blank');
  };

  // 4. Instagram
  const handleShareInstagram = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
    }
    showToast('Lien copié pour Instagram !');
    window.open('https://www.instagram.com/', '_blank');
  };

  // 5. Twitter (X)
  const handleShareTwitter = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = encodeURIComponent(`Découvrez « ${cleanTitle} » sur YonyWood :`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(currentUrl)}`, '_blank');
  };

  // 6. LinkedIn
  const handleShareLinkedIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`, '_blank');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      {/* Modale claire, élégante et calibrée strictement sur l'esprit de la modale d'évaluation */}
      <div 
        className="relative w-[min(340px,calc(100vw-32px))] sm:w-[350px] max-h-[90vh] overflow-y-auto no-scrollbar mx-auto bg-white/98 backdrop-blur-md rounded-3xl p-4.5 sm:p-5 shadow-2xl border border-stone-200/90 text-[#1C1917] space-y-3 animate-in zoom-in-95 duration-200 select-none shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête raffiné avec badge terracotta et fermeture douce */}
        <div className="flex items-center justify-between pb-2.5 border-b border-stone-100">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-xl bg-[#A2482B]/10 border border-[#A2482B]/20 flex items-center justify-center text-[#A2482B] shrink-0">
              <Share2 className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-[11px] sm:text-xs font-bold text-[#1C1917] uppercase tracking-wider block leading-tight">
                Partage et options
              </h3>
              {cleanTitle && (
                <p className="text-[10.5px] text-stone-500 font-medium block truncate max-w-[200px] leading-tight mt-0.5">
                  {cleanTitle}
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 flex items-center justify-center transition-colors cursor-pointer shrink-0"
            title="Fermer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Liste des actions dans l'ordre exact demandé */}
        <div className="space-y-1.5 pt-0.5">
          {/* 1. Partager sur les réseaux sociaux (déplie la liste de haut en bas : WhatsApp, Facebook, TikTok, Instagram, Twitter, LinkedIn) */}
          <div className="rounded-2xl border border-stone-200/70 bg-stone-50/70 overflow-hidden transition-all">
            <button
              type="button"
              onClick={() => setShowSocialOptions((prev) => !prev)}
              className="w-full flex items-center justify-between p-2.5 sm:p-3 text-left cursor-pointer hover:bg-stone-100/70 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-[#A2482B]/10 text-[#A2482B] flex items-center justify-center shrink-0">
                  <Share className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-xs sm:text-[13px] font-semibold text-stone-900 block leading-tight">
                    Partager sur les réseaux sociaux
                  </span>
                  <span className="text-[10px] text-stone-500 block leading-tight mt-0.5">
                    WhatsApp, Facebook, TikTok, Instagram…
                  </span>
                </div>
              </div>
              <div className="text-stone-400">
                {showSocialOptions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>

            {/* Réseaux sociaux dévoilés au clic dans l'ordre strict de haut en bas */}
            {showSocialOptions && (
              <div className="px-2 pb-2.5 pt-1 border-t border-stone-200/70 bg-white/90 flex flex-col gap-1.5 animate-in fade-in duration-150">
                {/* 1. WhatsApp */}
                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-emerald-50/80 hover:bg-emerald-100/90 text-emerald-950 border border-emerald-200/70 text-xs font-semibold transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <WhatsAppIcon className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-semibold text-stone-900 group-hover:text-emerald-950">WhatsApp</span>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-medium px-2 py-0.5 rounded-md bg-emerald-100/70">Partager</span>
                </button>

                {/* 2. Facebook */}
                <button
                  type="button"
                  onClick={handleShareFacebook}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-blue-50/80 hover:bg-blue-100/90 text-blue-950 border border-blue-200/70 text-xs font-semibold transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-[#1877F2] text-white flex items-center justify-center shrink-0 shadow-xs">
                      <FacebookIcon className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-semibold text-stone-900 group-hover:text-blue-950">Facebook</span>
                  </div>
                  <span className="text-[10px] text-blue-700 font-medium px-2 py-0.5 rounded-md bg-blue-100/70">Partager</span>
                </button>

                {/* 3. TikTok */}
                <button
                  type="button"
                  onClick={handleShareTikTok}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-stone-100/80 hover:bg-stone-200/90 text-stone-950 border border-stone-250 text-xs font-semibold transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-black text-white flex items-center justify-center shrink-0 shadow-xs">
                      <TikTokIcon className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-semibold text-stone-900 group-hover:text-stone-950">TikTok</span>
                  </div>
                  <span className="text-[10px] text-stone-600 font-medium px-2 py-0.5 rounded-md bg-stone-200/70">Copier & ouvrir</span>
                </button>

                {/* 4. Instagram */}
                <button
                  type="button"
                  onClick={handleShareInstagram}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-rose-50/80 hover:bg-rose-100/90 text-rose-950 border border-rose-200/70 text-xs font-semibold transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <InstagramIcon className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-semibold text-stone-900 group-hover:text-rose-950">Instagram</span>
                  </div>
                  <span className="text-[10px] text-rose-700 font-medium px-2 py-0.5 rounded-md bg-rose-100/70">Copier & ouvrir</span>
                </button>

                {/* 5. Twitter */}
                <button
                  type="button"
                  onClick={handleShareTwitter}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-stone-100/80 hover:bg-stone-200/90 text-stone-950 border border-stone-300/70 text-xs font-semibold transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-black text-white flex items-center justify-center shrink-0 shadow-xs">
                      <TwitterXIcon className="w-3 h-3" />
                    </div>
                    <span className="font-semibold text-stone-900 group-hover:text-stone-950">Twitter</span>
                  </div>
                  <span className="text-[10px] text-stone-600 font-medium px-2 py-0.5 rounded-md bg-stone-200/70">Partager</span>
                </button>

                {/* 6. LinkedIn */}
                <button
                  type="button"
                  onClick={handleShareLinkedIn}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-sky-50/80 hover:bg-sky-100/90 text-sky-950 border border-sky-200/70 text-xs font-semibold transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-[#0A66C2] text-white flex items-center justify-center shrink-0 shadow-xs">
                      <LinkedInIcon className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-semibold text-stone-900 group-hover:text-sky-950">LinkedIn</span>
                  </div>
                  <span className="text-[10px] text-sky-700 font-medium px-2 py-0.5 rounded-md bg-sky-100/70">Partager</span>
                </button>
              </div>
            )}
          </div>

          {/* 2. Copier le lien / Partager le lien */}
          <button
            type="button"
            onClick={handleCopyLink}
            className="w-full flex items-center justify-between p-2.5 sm:p-3 rounded-2xl bg-stone-50/70 hover:bg-stone-100/80 text-left border border-stone-200/70 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/60 flex items-center justify-center shrink-0">
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </div>
              <div>
                <span className="text-xs sm:text-[13px] font-semibold text-stone-900 block leading-tight">
                  {isCopied ? 'Lien copié !' : 'Copier le lien'}
                </span>
                <span className="text-[10px] text-stone-500 block leading-tight mt-0.5">
                  Copier l’adresse directe du récit
                </span>
              </div>
            </div>
            <span className="text-[10px] font-medium text-stone-500 px-2 py-0.5 rounded-md bg-stone-200/70">
              {isCopied ? 'Copié' : 'Copier'}
            </span>
          </button>

          {/* 3. Enregistrer dans une liste (ajouter à mes mémoires sauvegardées) */}
          <button
            type="button"
            onClick={handleToggleSave}
            className={`w-full flex items-center justify-between p-2.5 sm:p-3 rounded-2xl transition-all text-left border cursor-pointer ${
              isSaved 
                ? 'bg-amber-50/80 border-amber-200/90 text-amber-950' 
                : 'bg-stone-50/70 hover:bg-stone-100/80 border-stone-200/70 text-stone-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 border ${
                isSaved 
                  ? 'bg-[#A2482B] text-white border-[#A2482B]' 
                  : 'bg-amber-50 text-amber-700 border-amber-200/60'
              }`}>
                {isSaved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
              </div>
              <div>
                <span className="text-xs sm:text-[13px] font-semibold block leading-tight">
                  {isSaved ? 'Enregistré dans ma liste' : 'Enregistrer dans une liste'}
                </span>
                <span className="text-[10px] text-stone-500 block leading-tight mt-0.5">
                  Ajouter à mes mémoires sauvegardées
                </span>
              </div>
            </div>
            {isSaved && <Check className="w-4 h-4 text-[#A2482B]" />}
          </button>

          {/* 4. Signaler */}
          <button
            type="button"
            onClick={handleReportAction}
            className={`w-full flex items-center justify-between p-2.5 sm:p-3 rounded-2xl transition-all text-left border cursor-pointer ${
              isReported
                ? 'bg-amber-50/90 border-amber-200 text-amber-800'
                : 'bg-stone-50/70 hover:bg-stone-100/80 border-stone-200/70 text-stone-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-amber-50 text-amber-700 border border-amber-200/70 flex items-center justify-center shrink-0">
                <Flag className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-xs sm:text-[13px] font-semibold block leading-tight">
                  {isReported ? 'Contenu signalé' : 'Signaler'}
                </span>
                <span className="text-[10px] text-stone-500 block leading-tight mt-0.5">
                  Signaler un contenu inapproprié ou trompeur
                </span>
              </div>
            </div>
            {isReported && <Check className="w-4 h-4 text-amber-600" />}
          </button>

          {/* 5. Bloquer la personne (arrive après Signaler) */}
          <button
            type="button"
            onClick={handleBlockPersonAction}
            className={`w-full flex items-center justify-between p-2.5 sm:p-3 rounded-2xl transition-all text-left border cursor-pointer ${
              isBlocked
                ? 'bg-rose-50 border-rose-200 text-rose-800'
                : 'bg-stone-50/70 hover:bg-rose-50/50 border-stone-200/70 hover:border-rose-200/60 text-stone-900 hover:text-rose-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-rose-50 text-rose-600 border border-rose-200/70 flex items-center justify-center shrink-0">
                <UserX className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-xs sm:text-[13px] font-semibold block leading-tight">
                  {isBlocked ? 'Personne bloquée' : 'Bloquer la personne'}
                </span>
                <span className="text-[10px] text-stone-500 block leading-tight mt-0.5">
                  Ne plus voir les contenus de cette personne
                </span>
              </div>
            </div>
            {isBlocked && <Check className="w-4 h-4 text-rose-600" />}
          </button>
        </div>

        {/* Toast confirmation temporaire */}
        {toastMessage && (
          <div className="bg-[#A2482B] text-white text-xs font-semibold py-2 px-3 rounded-xl text-center shadow-md animate-in fade-in duration-150">
            {toastMessage}
          </div>
        )}
      </div>
    </div>
  );
};
