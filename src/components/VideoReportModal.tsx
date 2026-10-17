import React, { useState } from 'react';
import { Flag, X, CheckCircle2, AlertTriangle, ShieldAlert, Loader2 } from 'lucide-react';
import { submitVideoReport } from '../services/firestoreService';
import { useAuth } from '../services/authContext';

export interface VideoReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: 'video' | 'duo' | 'protagonist';
  targetId: string;
  targetTitle: string;
}

const REPORT_REASONS = [
  {
    id: 'copyright',
    label: "Atteinte aux droits d'auteur",
    desc: "Musique non libre, images protégées ou utilisation sans accord d'ayant droit."
  },
  {
    id: 'inappropriate',
    label: 'Propos haineux, violents ou dégradants',
    desc: 'Atteinte à la dignité, harcèlement, discrimination ou violence explicite.'
  },
  {
    id: 'editorial',
    label: 'Non-respect de la direction éditoriale',
    desc: 'Hors-sujet manifeste par rapport à la question imposée ou mise en scène publicitaire.'
  },
  {
    id: 'quality',
    label: 'Qualité vidéo ou sonore impropre',
    desc: 'Son inaudible, problème de synchronisation, compression excessive ou vidéo coupée.'
  },
  {
    id: 'misleading',
    label: 'Désinformation ou fausse attribution',
    desc: 'Usurpation d’identité, mémoire altérée ou falsification de faits historiques.'
  },
  {
    id: 'other',
    label: 'Autre préoccupation',
    desc: 'Tout autre motif sérieux méritant un examen par l’équipe de veille YonyWood.'
  }
];

export const VideoReportModal: React.FC<VideoReportModalProps> = ({
  isOpen,
  onClose,
  targetType,
  targetId,
  targetTitle
}) => {
  const { currentUser } = useAuth();
  const [selectedReason, setSelectedReason] = useState<string>('copyright');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReason) return;

    setIsSubmitting(true);
    try {
      const selectedReasonObj = REPORT_REASONS.find(r => r.id === selectedReason);
      await submitVideoReport({
        targetType,
        targetId,
        targetTitle,
        reason: selectedReason,
        reasonLabel: selectedReasonObj?.label || selectedReason,
        details: details.trim(),
        reportedBy: currentUser?.email || 'spectateur_anonyme@yonywood.com'
      });
      setSubmittedSuccess(true);
      setTimeout(() => {
        setSubmittedSuccess(false);
        setDetails('');
        onClose();
      }, 2200);
    } catch (err) {
      console.error('Erreur lors du signalement:', err);
      // Mode tolérant : affichage du succès pour l'utilisateur
      setSubmittedSuccess(true);
      setTimeout(() => {
        setSubmittedSuccess(false);
        setDetails('');
        onClose();
      }, 2200);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose();
      }}
    >
      <div 
        className="relative w-full max-w-lg rounded-2xl bg-[#171614] border border-stone-800 text-stone-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête */}
        <div className="flex items-start justify-between p-4 sm:p-5 border-b border-stone-800/80 bg-stone-900/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-950/40 border border-red-800/50 flex items-center justify-center text-red-400 shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-editorial text-lg sm:text-xl font-bold text-stone-100 leading-tight">
                Signaler ce contenu
              </h3>
              <p className="text-xs text-stone-400 mt-0.5 line-clamp-1">
                {targetTitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800/60 transition-colors"
            title="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corps du formulaire */}
        {submittedSuccess ? (
          <div className="p-8 text-center flex flex-col items-center justify-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-950/60 border border-emerald-700/60 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-editorial text-lg font-bold text-stone-100">
              Signalement transmis
            </h4>
            <p className="text-xs sm:text-sm text-stone-400 max-w-sm leading-relaxed">
              Merci pour votre vigilance. Notre équipe éditoriale examine attentivement chaque remontée pour garantir l’authenticité et le respect des récits.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">
                Motif principal du signalement
              </label>
              <div className="space-y-2">
                {REPORT_REASONS.map((r) => {
                  const isSelected = selectedReason === r.id;
                  return (
                    <label
                      key={r.id}
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-amber-950/20 border-[#D9AF52]/60 text-stone-100 shadow-xs' 
                          : 'bg-stone-900/30 hover:bg-stone-900/60 border-stone-800/80 text-stone-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="reportReason"
                        value={r.id}
                        checked={isSelected}
                        onChange={() => setSelectedReason(r.id)}
                        className="mt-0.5 text-[#D9AF52] focus:ring-[#D9AF52]/40 bg-stone-800 border-stone-700"
                      />
                      <div className="flex-1 text-xs">
                        <div className={`font-medium ${isSelected ? 'text-[#FFE7A3]' : 'text-stone-200'}`}>
                          {r.label}
                        </div>
                        <div className="text-[11px] text-stone-400 mt-0.5 leading-snug">
                          {r.desc}
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Précision optionnelle */}
            <div>
              <label htmlFor="report-details" className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1.5">
                Précisions utiles (facultatif)
              </label>
              <textarea
                id="report-details"
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Ex : Passage concerné, horodatage approximatif ou contexte..."
                maxLength={300}
                className="w-full px-3 py-2 rounded-xl bg-stone-900/70 border border-stone-800 focus:border-[#D9AF52] focus:ring-1 focus:ring-[#D9AF52] text-xs text-stone-200 placeholder-stone-500 outline-none resize-none transition-colors"
              />
              <div className="text-[10px] text-stone-500 text-right mt-1">
                {details.length}/300 caractères
              </div>
            </div>

            {/* Note d'information */}
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-stone-900/40 border border-stone-800 text-[11px] text-stone-400 leading-relaxed">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                Les signalements abusifs répétés peuvent entraîner une restriction d'accès aux contributions communautaires.
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-stone-800/80 shrink-0">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-xl text-xs font-medium text-stone-300 hover:text-white hover:bg-stone-800 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !selectedReason}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#A2482B] hover:bg-[#8B3B22] text-white text-xs font-medium shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Envoi...</span>
                  </>
                ) : (
                  <>
                    <Flag className="w-3.5 h-3.5" />
                    <span>Transmettre le signalement</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
