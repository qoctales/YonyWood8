import React, { useState, useEffect } from 'react';
import { Award, X, Check } from 'lucide-react';
import { StoryResonanceRating } from '../types';

interface ResonanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  storyId: string;
  topicId?: string;
  personName?: string;
  initialPercentage?: number | null;
  onRatingSubmitted?: (percentage: number) => void;
}

export const ResonanceModal: React.FC<ResonanceModalProps> = ({
  isOpen,
  onClose,
  storyId,
  topicId = 'exploration',
  personName,
  initialPercentage,
  onRatingSubmitted
}) => {
  // Les 3 évaluations avec curseur de 0 à 100%, par défaut à 50%
  const [authenticity, setAuthenticity] = useState<number>(50);
  const [relevance, setRelevance] = useState<number>(50);
  const [impact, setImpact] = useState<number>(50);

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Score global calculé à partir des 3 critères (moyenne centrée)
  const overallPercentage = Math.round((authenticity + relevance + impact) / 3);

  // Charger les notes existantes si disponibles
  useEffect(() => {
    if (!isOpen) return;

    try {
      const storedObj = localStorage.getItem(`yonywood_resonance_detail_${storyId}`);
      if (storedObj) {
        const parsed = JSON.parse(storedObj);
        if (typeof parsed.authenticity === 'number') setAuthenticity(parsed.authenticity);
        if (typeof parsed.relevance === 'number') setRelevance(parsed.relevance);
        if (typeof parsed.impact === 'number') setImpact(parsed.impact);
        return;
      }

      const storedScore = localStorage.getItem(`yonywood_resonance_${storyId}`);
      if (storedScore) {
        const val = parseInt(storedScore, 10);
        if (!isNaN(val)) {
          setAuthenticity(val);
          setRelevance(val);
          setImpact(val);
          return;
        }
      }

      if (typeof initialPercentage === 'number') {
        setAuthenticity(initialPercentage);
        setRelevance(initialPercentage);
        setImpact(initialPercentage);
        return;
      }
    } catch {
      // noop
    }

    // Par défaut : 50%
    setAuthenticity(50);
    setRelevance(50);
    setImpact(50);
  }, [isOpen, storyId, initialPercentage]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const ratingObj: StoryResonanceRating = {
      storyId,
      topicId,
      percentage: overallPercentage,
      ratings: {
        authenticity: Math.round(authenticity / 20) || 1,
        relevance: Math.round(relevance / 20) || 1,
        impact: Math.round(impact / 20) || 1
      },
      createdAt: new Date().toISOString()
    };

    try {
      localStorage.setItem(`yonywood_resonance_${storyId}`, overallPercentage.toString());
      localStorage.setItem(
        `yonywood_resonance_detail_${storyId}`,
        JSON.stringify({ authenticity, relevance, impact })
      );
      const stored = localStorage.getItem('yonywood_story_ratings') || '[]';
      const arr: StoryResonanceRating[] = JSON.parse(stored);
      arr.push(ratingObj);
      localStorage.setItem('yonywood_story_ratings', JSON.stringify(arr));
    } catch {
      // noop
    }

    setIsSubmitted(true);
    if (onRatingSubmitted) {
      onRatingSubmitted(overallPercentage);
    }

    setTimeout(() => {
      onClose();
      setIsSubmitted(false);
    }, 750);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 pointer-events-auto transition-opacity duration-200"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      {/* Modale élégante, fine et calibrée strictement sur la largeur d'une vidéo 9:16 */}
      <div 
        className="relative w-[min(290px,calc(100vw-36px))] sm:w-[min(310px,calc(100vw-40px))] mx-auto bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-4.5 shadow-2xl border border-stone-200/90 text-[#1C1917] space-y-3 animate-in zoom-in-95 duration-200 select-none shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête épuré et raffiné */}
        <div className="flex items-center justify-between pb-2 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <div className="w-6.5 h-6.5 rounded-lg bg-[#A2482B]/10 border border-[#A2482B]/20 flex items-center justify-center text-[#A2482B] shrink-0">
              <Award className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-bold text-[#1C1917] uppercase tracking-wider block leading-tight">
                Évaluation
              </span>
              {personName && (
                <span className="text-[10px] text-stone-500 font-medium block truncate max-w-[170px] leading-tight mt-0.5">
                  {personName}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 flex items-center justify-center transition-colors cursor-pointer shrink-0"
            title="Fermer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* État après validation */}
        {isSubmitted ? (
          <div className="py-5 text-center space-y-1.5 animate-in zoom-in duration-150">
            <div className="w-9 h-9 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-700 mx-auto flex items-center justify-center">
              <Check className="w-4.5 h-4.5" />
            </div>
            <p className="text-xs font-bold text-[#1C1917]">Résonance enregistrée</p>
            <p className="text-xs text-[#A2482B] font-mono font-bold">{overallPercentage}%</p>
          </div>
        ) : (
          <>
            {/* Score global fin et discret */}
            <div className="flex items-center justify-center py-1.5 px-3 bg-stone-50 rounded-xl border border-stone-200/70">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-extrabold text-[#A2482B] font-mono tracking-tight flex items-baseline justify-center gap-0.5">
                  <span>{overallPercentage}</span>
                  <span className="text-xs text-[#A2482B]/80 font-sans font-bold">%</span>
                </div>
                <span className="text-[9.5px] uppercase font-semibold text-stone-400 tracking-wider">
                  Résonance globale
                </span>
              </div>
            </div>

            {/* Les 3 évaluations : Authenticité, Pertinence, Impact (curseurs fins de 0 à 100%) */}
            <div className="space-y-2 py-0.5">
              
              {/* 1. Authenticité */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10.5px]">
                  <span className="font-semibold text-stone-700">Authenticité</span>
                  <span className="font-mono text-[#A2482B] font-bold text-[10.5px]">
                    {authenticity}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={authenticity}
                  onChange={(e) => setAuthenticity(Number(e.target.value))}
                  className="w-full h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#A2482B]"
                />
              </div>

              {/* 2. Pertinence */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10.5px]">
                  <span className="font-semibold text-stone-700">Pertinence</span>
                  <span className="font-mono text-[#A2482B] font-bold text-[10.5px]">
                    {relevance}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={relevance}
                  onChange={(e) => setRelevance(Number(e.target.value))}
                  className="w-full h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#A2482B]"
                />
              </div>

              {/* 3. Impact émotionnel */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10.5px]">
                  <span className="font-semibold text-stone-700">Impact</span>
                  <span className="font-mono text-[#A2482B] font-bold text-[10.5px]">
                    {impact}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={impact}
                  onChange={(e) => setImpact(Number(e.target.value))}
                  className="w-full h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#A2482B]"
                />
              </div>

            </div>

            {/* Bouton de validation Terre Cuite (#A2482B) */}
            <div className="pt-0.5">
              <button
                onClick={handleSubmit}
                className="w-full h-8 px-4 rounded-xl bg-[#A2482B] hover:bg-[#8A3B22] text-white text-[11px] font-bold uppercase tracking-wider transition-all shadow-xs flex items-center justify-center cursor-pointer active:scale-[0.98]"
              >
                Valider
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
