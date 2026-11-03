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

// Ordre explicite et immuable des 4 quadrants :
// 1. Haut gauche (col 1, row 1)
// 2. Haut droite (col 2, row 1)
// 3. Bas gauche (col 1, row 2)
// 4. Bas droite (col 2, row 2)
const QUADRANT_POSITIONS = [
  'col-start-1 row-start-1', // 1. Haut à gauche
  'col-start-2 row-start-1', // 2. Haut à droite
  'col-start-1 row-start-2', // 3. Bas à gauche
  'col-start-2 row-start-2', // 4. Bas à droite
];

// Durée de 8 secondes par participant (8s x 4 = 32s au total)
const STEP_DURATION_SECONDS = 8;

export const FourFacesCard: React.FC<FourFacesCardProps> = ({
  publication,
  isActive,
  onComplete
}) => {
  // Index de la séquence en cours (0: Haut-gauche, 1: Haut-droite, 2: Bas-gauche, 3: Bas-droite)
  const [activeStep, setActiveStep] = useState<0 | 1 | 2 | 3>(0);
  // Temps écoulé dans la séquence courante (0 à 8 secondes)
  const [stepElapsed, setStepElapsed] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const activeStepRef = useRef<0 | 1 | 2 | 3>(0);
  activeStepRef.current = activeStep;

  const currentParticipant: FourFacesParticipant = publication.participants[activeStep] || publication.participants[0];
  const activeFirstName = currentParticipant?.firstName || '';
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

  // Horloge de la séquence des 4 participants (8s par personne = 32s au total)
  // Progression ordonnée stricte : 0 (Haut-gauche) -> 1 (Haut-droite) -> 2 (Bas-gauche) -> 3 (Bas-droite)
  useEffect(() => {
    if (!isPlaying || !isActive || isCompleted) {
      return;
    }

    const timer = setInterval(() => {
      setStepElapsed(prev => {
        const nextTime = prev + 0.1;
        if (nextTime >= STEP_DURATION_SECONDS) {
          const current = activeStepRef.current;
          // Passer fluidement au participant suivant (0 -> 1 -> 2 -> 3 -> 0)
          const nextStep = ((current + 1) % 4) as 0 | 1 | 2 | 3;
          activeStepRef.current = nextStep;
          setActiveStep(nextStep);
          celestialAudio.playOrbSelect();
          return 0;
        }
        return nextTime;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [isPlaying, isActive, isCompleted]);

  // Relance de la vidéo lors d'un changement d'étape
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      if (isPlaying) {
        videoRef.current.play().catch(() => {});
      }
    }
  }, [activeStep, isPlaying]);

  const handleRestart = (e: React.MouseEvent) => {
    e.stopPropagation();
    activeStepRef.current = 0;
    setActiveStep(0);
    setStepElapsed(0);
    setIsCompleted(false);
    setIsPlaying(true);
    celestialAudio.playOrbSelect();
  };

  const handleSelectParticipant = (idx: 0 | 1 | 2 | 3, e: React.MouseEvent) => {
    e.stopPropagation();
    activeStepRef.current = idx;
    setActiveStep(idx);
    setStepElapsed(0);
    setIsCompleted(false);
    setIsPlaying(true);
    celestialAudio.playOrbSelect();
  };

  return (
    <div className="relative aspect-[9/16] w-[min(calc(100vw-64px),calc((100dvh-230px)*9/16))] max-w-[228px] sm:max-w-[270px] md:max-w-[290px] h-[min(410px,calc(100dvh-230px))] sm:h-[min(480px,calc(100dvh-200px))] md:h-[min(520px,calc(100dvh-180px))] rounded-2xl sm:rounded-3xl overflow-hidden border border-[#C86747]/60 bg-gradient-to-b from-[#A84A2C] via-[#943F24] to-[#7B321B] text-white flex flex-col justify-between select-none shadow-2xl">
      
      {/* Halo lumineux chaleureux en fond terracotta */}
      <div 
        className="absolute inset-0 opacity-25 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 25%, rgba(255, 215, 175, 0.25) 0%, rgba(162, 72, 43, 0) 75%)'
        }}
      />

      {/* ========================================================================= */}
      {/* 1. EN-TÊTE DE CARTE : THÈME EN HAUT À GAUCHE & CONTRÔLES DE LECTURE        */}
      {/* ========================================================================= */}
      <div className="relative z-30 pt-3.5 px-3.5 flex items-center justify-between gap-1 pointer-events-auto">
        {/* Titre thématique dans un bandeau sombre translucide */}
        <div className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 shadow-md max-w-[75%]">
          <span className="font-editorial text-xs font-semibold text-white whitespace-nowrap tracking-wide select-none truncate">
            {formatFirstLetterOnly(themeTitle)}
          </span>
        </div>

        {/* Boutons son et lecture en haut à droite */}
        <div className="flex items-center gap-1.5">
          {isPlaying && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsMuted(m => !m);
              }}
              className="w-7 h-7 rounded-xl bg-black/40 backdrop-blur-md text-white border border-white/20 flex items-center justify-center transition-all cursor-pointer hover:bg-black/60 shadow-md active:scale-95"
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
                ? 'bg-white text-[#A2482B] border border-white shadow-lg' 
                : 'bg-black/40 backdrop-blur-md text-white border border-white/20 hover:bg-black/60'
            }`}
            title={isPlaying ? 'Mettre en pause' : 'Lancer la lecture'}
          >
            <TvPlayerIcon className="w-4.5 h-4.5 text-current" strokeWidth={1.7} />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. ZONE CENTRALE : LES 4 QUADRANTS DANS L'ORDRE STRICT SANS NUMÉROTATION  */}
      {/* 1. Haut-gauche -> 2. Haut-droite -> 3. Bas-gauche -> 4. Bas-droite        */}
      {/* ========================================================================= */}
      <div 
        className="relative flex-1 w-full h-full p-2.5 grid grid-cols-2 grid-rows-2 gap-2 z-10 cursor-pointer"
        onClick={() => setIsPlaying(p => !p)}
      >
        {publication.participants.slice(0, 4).map((participant, idx) => {
          const isThisActive = idx === activeStep && !isCompleted;
          const posClass = QUADRANT_POSITIONS[idx] || '';

          return (
            <div
              key={participant.id}
              onClick={(e) => handleSelectParticipant(idx as 0 | 1 | 2 | 3, e)}
              className={`relative rounded-2xl overflow-hidden transition-all duration-300 border bg-stone-900 ${posClass} ${
                isThisActive 
                  ? 'border-2 border-[#A2482B] ring-2 ring-[#A2482B]/30 shadow-2xl scale-[1.02] z-20 opacity-100' 
                  : 'border-white/10 opacity-70 hover:opacity-90 z-10'
              }`}
            >
              {/* Image de couverture toujours présente en fond pour éviter tout écran vide */}
              <img 
                src={participant.avatarUrl} 
                alt={participant.name}
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                loading="eager"
              />

              {/* Vidéo de la personne active en superposition avec boucle */}
              {isThisActive && isPlaying && (
                <video
                  ref={videoRef}
                  key={`fourface-video-${participant.id}-${idx}-${activeStep}`}
                  src={participant.videoUrl || '/sample.mp4'}
                  poster={participant.avatarUrl}
                  autoPlay
                  loop={true}
                  muted={isMuted}
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                />
              )}

              {/* Voile sombre en dégradé pour faire ressortir l'ambiance */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />
            </div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 3. BAS DE CARTE : PRÉNOM ACTIF & PROGRESSION DES 4 SÉQUENCES (16s x 4)    */}
      {/* ========================================================================= */}
      <div className="relative z-30 px-3.5 sm:px-4 pb-3.5 sm:pb-4 pt-1 pointer-events-auto flex items-end justify-between">
        <div className="flex flex-col items-start">
          {/* Prénom de la personne active */}
          <h2 className="font-editorial text-base sm:text-lg font-bold text-white tracking-wide drop-shadow-md truncate max-w-[170px] sm:max-w-[210px] leading-tight">
            {activeFirstName}
          </h2>

          {/* Curseur de lecture à 4 segments ordonnés (1 -> 2 -> 3 -> 4) calibré sur 16s */}
          <div className="h-2 flex items-center mt-1">
            <div className="flex items-center gap-1.5 w-24 sm:w-28 h-1 bg-white/25 rounded-full overflow-hidden shadow-xs">
              {publication.participants.slice(0, 4).map((_, pIdx) => {
                let pPercent = 0;
                if (pIdx < activeStep) pPercent = 100;
                else if (pIdx === activeStep) pPercent = Math.min(100, (stepElapsed / STEP_DURATION_SECONDS) * 100);

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

        {/* Bouton de relecture si terminé */}
        {isCompleted && (
          <button
            type="button"
            onClick={handleRestart}
            className="p-2 rounded-xl bg-white text-[#A2482B] shrink-0 transition-all shadow-md hover:bg-stone-100 active:scale-95 cursor-pointer"
            title="Revoir la séquence des 4 cartes (64s)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </div>

    </div>
  );
};
