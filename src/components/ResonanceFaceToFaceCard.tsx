import React, { useState } from 'react';
import { celestialAudio } from '../utils/celestialAudio';
import { Protagonist } from '../types';
import { formatFirstLetterOnly } from '../utils/textFormatters';

interface ResonanceFaceToFaceCardProps {
  protagonistA: Protagonist;
  protagonistB: Protagonist;
  seriesTitle?: string;
  duoQuestion?: string;
  onNavigateToSlide?: (slideIndex: 0 | 1 | 2) => void;
  onNavigateToPortrait: (protagonistId: string) => void;
}

export const ResonanceFaceToFaceCard: React.FC<ResonanceFaceToFaceCardProps> = ({
  protagonistA,
  protagonistB,
  seriesTitle,
  onNavigateToSlide,
  onNavigateToPortrait
}) => {
  // Balance slider: 0 = 100% A, 50 = 50/50, 100 = 100% B
  const [sliderValue, setSliderValue] = useState<number>(50);

  const percentA = 100 - sliderValue;
  const percentB = sliderValue;

  const firstNameA = protagonistA.name.split(' ')[0];
  const firstNameB = protagonistB.name.split(' ')[0];

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setSliderValue(val);
    if (val === 50 || val === 75 || val === 25) {
      celestialAudio.playOrbSelect();
    }
  };

  return (
    <div className="relative w-full h-full max-h-full rounded-3xl overflow-hidden bg-[#12110F] text-white p-4 sm:p-5 flex flex-col justify-between select-none">
      
      {/* Halo lumineux dynamique */}
      <div 
        className="absolute inset-0 opacity-25 pointer-events-none transition-all duration-300"
        style={{
          background: `radial-gradient(circle at ${sliderValue}% 50%, #A2482B 0%, transparent 70%)`
        }}
      />

      {/* En-tête au-dessus du Face-à-face */}
      <div className="relative z-20 flex items-center justify-between gap-1.5">
        <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15 max-w-[70%]">
          <span className="font-editorial text-[11px] font-semibold text-white tracking-wide truncate block">
            {formatFirstLetterOnly(seriesTitle) || 'Dialogue en miroir'}
          </span>
        </div>

        {/* Bouton retour / sortie du face-à-face vers la vidéo */}
        {onNavigateToSlide && (
          <button
            type="button"
            onClick={() => onNavigateToSlide(0)}
            className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#A2482B] hover:bg-[#8A3B22] text-white shadow-xs transition-colors cursor-pointer"
            title="Revenir à la vidéo"
          >
            ← Vidéo
          </button>
        )}
      </div>

      {/* Les Deux Vignettes Face-à-Face A et B */}
      <div className="relative z-10 grid grid-cols-2 gap-3 my-auto py-2">
        {/* Vignette Protagoniste A */}
        <div 
          onClick={() => onNavigateToPortrait(protagonistA.id)}
          className={`relative rounded-2xl overflow-hidden p-2 border transition-all duration-200 cursor-pointer flex flex-col items-center aspect-[3/4] ${
            percentA > 50 
              ? 'border-[#A2482B] bg-[#1E1916] shadow-lg shadow-[#A2482B]/20 scale-102' 
              : 'border-white/10 bg-black/40 hover:border-white/20'
          }`}
        >
          <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-2">
            <img 
              src={protagonistA.photoUrl} 
              alt={firstNameA}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-[10px] font-bold text-white">
              {percentA}%
            </div>
          </div>
          <h4 className="text-xs font-bold text-white tracking-wide truncate w-full text-center">
            {firstNameA}
          </h4>
        </div>

        {/* Vignette Protagoniste B */}
        <div 
          onClick={() => onNavigateToPortrait(protagonistB.id)}
          className={`relative rounded-2xl overflow-hidden p-2 border transition-all duration-200 cursor-pointer flex flex-col items-center aspect-[3/4] ${
            percentB > 50 
              ? 'border-amber-500 bg-[#1E1C15] shadow-lg shadow-amber-500/20 scale-102' 
              : 'border-white/10 bg-black/40 hover:border-white/20'
          }`}
        >
          <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-2">
            <img 
              src={protagonistB.photoUrl} 
              alt={firstNameB}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-1 right-1 px-1.5 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-[10px] font-bold text-amber-300">
              {percentB}%
            </div>
          </div>
          <h4 className="text-xs font-bold text-white tracking-wide truncate w-full text-center">
            {firstNameB}
          </h4>
        </div>
      </div>

      {/* Le Curseur d'Évaluation : sans le mot 'balance', avec juste un petit point au milieu */}
      <div className="relative z-10 bg-black/60 backdrop-blur-md p-3.5 rounded-2xl border border-white/15 space-y-2">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className={percentA > 50 ? 'text-[#C8603C]' : 'text-stone-300'}>
            {firstNameA} {percentA}%
          </span>
          {/* Petit point discret au milieu marquant le 50% */}
          <span className="w-1.5 h-1.5 rounded-full bg-white/50" title="Milieu" />
          <span className={percentB > 50 ? 'text-amber-400' : 'text-stone-300'}>
            {percentB}% {firstNameB}
          </span>
        </div>

        {/* Curseur Range épuré */}
        <div className="relative flex items-center py-1">
          <input 
            type="range"
            min="0"
            max="100"
            value={sliderValue}
            onChange={handleSliderChange}
            className="w-full h-2 bg-stone-700/80 rounded-lg appearance-none cursor-pointer accent-[#A2482B]"
          />
        </div>
      </div>

    </div>
  );
};
