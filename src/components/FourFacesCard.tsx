import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, 
  VolumeX, 
  RotateCcw
} from 'lucide-react';
import { FourFacesPublication, FourFacesParticipant } from '../types';
import { TvPlayerIcon } from './YonywoodBrandIcons';
import { celestialAudio } from '../utils/celestialAudio';
import { formatFirstLetterOnly } from '../utils/textFormatters';

interface FourFacesCardProps {
  publication: FourFacesPublication;
  isActive: boolean; // True if this card is currently visible in the feed
  onComplete?: () => void;
}

export const FourFacesCard: React.FC<FourFacesCardProps> = ({
  publication,
  isActive,
  onComplete
}) => {
  // Index de la séquence en cours (0, 1, 2, 3)
  const [activeStep, setActiveStep] = useState<0 | 1 | 2 | 3>(0);
  // Temps écoulé dans la séquence courante (0 à 8 secondes)
  const [stepElapsed, setStepElapsed] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const timerRef = useRef<any>(null);

  const currentParticipant: FourFacesParticipant = publication.participants[activeStep];
  const activeFirstName = currentParticipant.firstName;
  const themeTitle = publication.theme || publication.questionTitle;

  // Gestion de la visibilité dans le feed
  useEffect(() => {
    if (isActive) {
      setIsPlaying(true);
      setActiveStep(0);
      setStepElapsed(0);
      setIsCompleted(false);
    } else {
      setIsPlaying(false);
    }
  }, [isActive, publication.id]);

  // Horloge de la séquence de 8 secondes maximum par personne (32s au total)
  useEffect(() => {
    if (!isPlaying || !isActive || isCompleted) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setStepElapsed(prev => {
        const nextTime = prev + 0.1;
        // 8 secondes maximum par séquence
        if (nextTime >= 8) {
          // Passer à la personne suivante
          setActiveStep(currentStep => {
            if (currentStep < 3) {
              const nextStep = (currentStep + 1) as 0 | 1 | 2 | 3;
              celestialAudio.playOrbSelect();
              return nextStep;
            } else {
              // Fin des 32 secondes (4 x 8s)
              setIsCompleted(true);
              setIsPlaying(false);
              onComplete?.();
              return currentStep;
            }
          });
          return 0;
        }
        return nextTime;
      });
    }, 100);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isActive, isCompleted, onComplete]);

  // Relance de la vidéo lors d'un changement d'étape
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      if (isPlaying) {
        videoRef.current.play().catch(() => {});
      }
    }
  }, [activeStep]);

  const handleRestart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveStep(0);
    setStepElapsed(0);
    setIsCompleted(false);
    setIsPlaying(true);
    celestialAudio.playOrbSelect();
  };

  const handleSelectParticipant = (idx: 0 | 1 | 2 | 3, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveStep(idx);
    setStepElapsed(0);
    setIsCompleted(false);
    setIsPlaying(true);
    celestialAudio.playOrbSelect();
  };

  return (
    <div className="relative aspect-[9/16] w-[min(calc(100vw-64px),calc((100dvh-230px)*9/16))] max-w-[228px] sm:max-w-[270px] md:max-w-[290px] h-[min(410px,calc(100dvh-230px))] sm:h-[min(480px,calc(100dvh-200px))] md:h-[min(520px,calc(100dvh-180px))] rounded-2xl sm:rounded-3xl overflow-hidden border border-stone-200/90 bg-[#12110F] text-white flex flex-col justify-between select-none">
      
      {/* ========================================================================= */}
      {/* 1. EN-TÊTE DE CARTE : TITRE À GAUCHE & ICÔNE DE LECTURE EN HAUT À DROITE   */}
      {/* Structure identique à toutes les publications                             */}
      {/* ========================================================================= */}
      <div className="relative z-30 pt-3.5 px-3.5 flex items-center justify-between gap-1 pointer-events-auto">
        {/* Titre en haut à gauche */}
        <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 shadow-md max-w-[75%]">
          <span className="font-editorial text-xs font-semibold text-white whitespace-nowrap tracking-wide select-none truncate">
            {formatFirstLetterOnly(themeTitle)}
          </span>
        </div>

        {/* Bouton de lecture toujours en haut à droite (en face du titre) */}
        <div className="flex items-center gap-1.5">
          {isPlaying && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsMuted(m => !m);
              }}
              className="w-7 h-7 rounded-xl bg-black/60 backdrop-blur-md text-white border border-white/20 flex items-center justify-center transition-all cursor-pointer hover:bg-black/80 shadow-md active:scale-95"
              title={isMuted ? 'Activer le son' : 'Couper le son'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-white" /> : <Volume2 className="w-3.5 h-3.5 text-white" />}
            </button>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsPlaying(p => !p);
            }}
            className={`w-8.5 h-8.5 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-95 ${
              isPlaying 
                ? 'bg-[#A2482B] text-white border border-[#8A3B22]' 
                : 'bg-black/60 backdrop-blur-md text-white border border-white/20 hover:bg-black/80'
            }`}
            title={isPlaying ? 'Mettre en pause' : 'Lancer la lecture'}
          >
            <TvPlayerIcon className="w-4.5 h-4.5 text-current" strokeWidth={1.7} />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. ZONE CENTRALE : COMPOSITION COLLECTIVE EN 4 VISAGES (QUADRANTS HARMONIEUX) */}
      {/* ========================================================================= */}
      <div 
        className="relative flex-1 w-full h-full p-2.5 grid grid-cols-2 grid-rows-2 gap-2 z-10 cursor-pointer"
        onClick={() => setIsPlaying(p => !p)}
      >
        {publication.participants.map((participant, idx) => {
          const isThisActive = idx === activeStep && !isCompleted;

          return (
            <div
              key={participant.id}
              onClick={(e) => handleSelectParticipant(idx as 0 | 1 | 2 | 3, e)}
              className={`relative rounded-2xl overflow-hidden transition-all duration-300 border ${
                isThisActive 
                  ? 'border-[#C89B3C] ring-2 ring-[#C89B3C]/60 shadow-lg scale-[1.02] z-20' 
                  : 'border-white/15 opacity-65 hover:opacity-90 z-10'
              }`}
            >
              {/* Vidéo de la personne active */}
              {isThisActive && isPlaying ? (
                <video
                  ref={videoRef}
                  src={participant.videoUrl}
                  autoPlay
                  loop={false}
                  muted={isMuted}
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <img 
                  src={participant.avatarUrl} 
                  alt={participant.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}

              {/* Voile dégradé */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none" />

              {/* Badge discret d'ordre (1, 2, 3, 4) */}
              <div className="absolute top-1.5 right-1.5 z-20 pointer-events-none">
                <div className={`w-4.5 h-4.5 rounded-full flex items-center justify-center text-[9px] font-bold shadow-xs ${
                  isThisActive ? 'bg-[#A2482B] text-white' : 'bg-black/40 text-stone-300'
                }`}>
                  {idx + 1}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 3. BAS DE CARTE : PRÉNOM EN BAS À GAUCHE & CURSEUR SANS BOUGER LE TEXTE   */}
      {/* ========================================================================= */}
      <div className="relative z-30 px-3.5 sm:px-4 pb-3.5 sm:pb-4 pt-1 pointer-events-auto flex items-end justify-between">
        <div className="flex flex-col items-start">
          {/* Prénom toujours en bas à gauche */}
          <h2 className="font-editorial text-base sm:text-lg font-bold text-white tracking-wide drop-shadow-md truncate max-w-[170px] sm:max-w-[210px] leading-tight">
            {activeFirstName}
          </h2>

          {/* Curseur de lecture fixe directement sous le prénom (32s au total, 8s par étape) */}
          <div className="h-2 flex items-center mt-1">
            <div className="flex items-center gap-1 w-24 sm:w-28 h-1 bg-white/25 rounded-full overflow-hidden shadow-xs">
              {publication.participants.map((_, pIdx) => {
                let pPercent = 0;
                if (pIdx < activeStep) pPercent = 100;
                else if (pIdx === activeStep) pPercent = Math.min(100, (stepElapsed / 8) * 100);

                return (
                  <div key={`p-step-${pIdx}`} className="h-full flex-1 bg-white/30 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-white transition-all duration-100 rounded-full"
                      style={{ width: `${pPercent}%` }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bouton relecture si terminé */}
        {isCompleted && (
          <button
            type="button"
            onClick={handleRestart}
            className="p-2 rounded-xl bg-[#A2482B] hover:bg-[#8A3B22] text-white shrink-0 transition-colors shadow-sm cursor-pointer"
            title="Revoir la carte (32s)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </div>

    </div>
  );
};
