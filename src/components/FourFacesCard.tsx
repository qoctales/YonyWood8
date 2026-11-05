import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { FourFacesPublication, FourFacesParticipant } from '../types';
import { TvPlayerIcon } from './YonywoodBrandIcons';
import { celestialAudio } from '../utils/celestialAudio';
import { formatFirstLetterOnly } from '../utils/textFormatters';

interface FourFacesCardProps {
  publication: FourFacesPublication;
  isActive: boolean; // Vrai si cette publication est actuellement visible dans le feed
  onComplete?: () => void;
}

// Configuration explicite et immuable des 4 quadrants dans l'ordre strict de lecture :
// 1. Haut à gauche (row 1, col 1)
// 2. Haut à droite (row 1, col 2)
// 3. Bas à gauche (row 2, col 1)
// 4. Bas à droite (row 2, col 2)
const QUADRANT_CONFIG = [
  { index: 0 as const, gridStyle: { gridRow: 1, gridColumn: 1 } },
  { index: 1 as const, gridStyle: { gridRow: 1, gridColumn: 2 } },
  { index: 2 as const, gridStyle: { gridRow: 2, gridColumn: 1 } },
  { index: 3 as const, gridStyle: { gridRow: 2, gridColumn: 2 } },
];

export const FourFacesCard: React.FC<FourFacesCardProps> = ({
  publication,
  isActive,
  onComplete
}) => {
  // Index du quadrant actif (0: Haut-gauche, 1: Haut-droite, 2: Bas-gauche, 3: Bas-droite)
  const [activeStep, setActiveStep] = useState<0 | 1 | 2 | 3>(0);
  
  // Progression de la vidéo active (0 à 100%)
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  
  // État Mute persistant (muet par défaut pour garantir la lecture autoplay sans blocage navigateur)
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('yonywood_fourfaces_mute');
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const activeStepRef = useRef<0 | 1 | 2 | 3>(0);
  activeStepRef.current = activeStep;

  const themeTitle = publication.theme || publication.questionTitle;

  // Réinitialisation lors de l'activation / changement de publication
  useEffect(() => {
    if (isActive) {
      setIsPlaying(true);
      setActiveStep(0);
      setProgressPercent(0);
    } else {
      setIsPlaying(false);
    }
  }, [isActive, publication.id]);

  // Passage automatique au participant suivant dans l'ordre strict :
  // 0: Haut-gauche -> 1: Haut-droite -> 2: Bas-gauche -> 3: Bas-droite -> 0
  const advanceToNextStep = useCallback(() => {
    const current = activeStepRef.current;
    const nextStep = ((current + 1) % 4) as 0 | 1 | 2 | 3;
    activeStepRef.current = nextStep;
    setActiveStep(nextStep);
    setProgressPercent(0);
    celestialAudio.playOrbSelect();

    if (current === 3 && onComplete) {
      onComplete();
    }
  }, [onComplete]);

  // Lancement sécurisé de la vidéo avec gestion anti-blocage autoplay
  const playVideoSafely = (videoEl: HTMLVideoElement | null) => {
    if (!videoEl) return;
    const playPromise = videoEl.play();
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        // Si le navigateur bloque l'autoplay à cause du son non muet, basculer en muet et relancer
        if (error.name === 'NotAllowedError') {
          videoEl.muted = true;
          setIsMuted(true);
          videoEl.play().catch(() => {});
        }
      });
    }
  };

  // Horloge de synchronisation pour faire défiler les 4 cartes automatiquement
  useEffect(() => {
    if (!isPlaying || !isActive) {
      return;
    }

    const nominalDuration = 5.2; // Durée nominale calibrée sur /sample.mp4
    const intervalMs = 100;
    const stepIncrement = (intervalMs / (nominalDuration * 1000)) * 100;

    const timer = setInterval(() => {
      setProgressPercent((prev) => {
        const next = prev + stepIncrement;
        if (next >= 100) {
          advanceToNextStep();
          return 0;
        }
        return next;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlaying, isActive, activeStep, advanceToNextStep]);

  // Relance de la vidéo lors d'un changement de quadrant
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      if (isPlaying) {
        playVideoSafely(videoRef.current);
      }
    }
  }, [activeStep, isPlaying]);

  // Clic sur n'importe quelle carte : elle se met en route immédiatement et le défilement continue ensuite
  const handleSelectCard = (idx: 0 | 1 | 2 | 3, e: React.MouseEvent) => {
    e.stopPropagation();
    activeStepRef.current = idx;
    setActiveStep(idx);
    setProgressPercent(0);
    setIsPlaying(true);
    celestialAudio.playOrbSelect();
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('yonywood_fourfaces_mute', String(next));
      } catch {
        // ignore
      }
      return next;
    });
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
      {/* 1. EN-TÊTE DE CARTE : THÈME EN HAUT À GAUCHE & CONTRÔLES EN HAUT À DROITE */}
      {/* ========================================================================= */}
      <div className="relative z-30 pt-3 px-3 sm:pt-3.5 sm:px-3.5 flex items-center justify-between gap-1 pointer-events-auto">
        {/* Titre thématique dans un bandeau sombre translucide */}
        <div className="inline-flex items-center px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-black/45 backdrop-blur-md border border-white/20 shadow-md max-w-[70%]">
          <span className="font-editorial text-[11px] sm:text-xs font-semibold text-white whitespace-nowrap tracking-wide select-none truncate">
            {formatFirstLetterOnly(themeTitle)}
          </span>
        </div>

        {/* Boutons son et lecture en haut à droite */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={toggleMute}
            className={`w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-xl backdrop-blur-md border flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-95 ${
              isMuted
                ? 'bg-black/40 text-stone-300 border-white/20 hover:bg-black/60'
                : 'bg-[#A2482B] text-white border-white/40 shadow-xs'
            }`}
            title={isMuted ? 'Activer le son' : 'Couper le son'}
            aria-label={isMuted ? 'Activer le son' : 'Couper le son'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-white" /> : <Volume2 className="w-3.5 h-3.5 text-white" />}
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsPlaying((p) => !p);
            }}
            className={`w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-95 ${
              isPlaying 
                ? 'bg-white text-[#A2482B] border border-white shadow-lg' 
                : 'bg-black/40 backdrop-blur-md text-white border border-white/20 hover:bg-black/60'
            }`}
            title={isPlaying ? 'Mettre en pause' : 'Lancer la lecture'}
            aria-label={isPlaying ? 'Mettre en pause' : 'Lancer la lecture'}
          >
            <TvPlayerIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-current" strokeWidth={1.7} />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. ZONE CENTRALE : LES 4 VOIES DANS L'ORDRE STRICT GARANTI                */}
      {/* 1. Haut-gauche -> 2. Haut-droite -> 3. Bas-gauche -> 4. Bas-droite        */}
      {/* ========================================================================= */}
      <div 
        className="relative flex-1 w-full h-full p-2.5 grid grid-cols-2 grid-rows-2 gap-2 z-10"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gridTemplateRows: 'repeat(2, minmax(0, 1fr))',
        }}
      >
        {QUADRANT_CONFIG.map(({ index: qIdx, gridStyle }) => {
          const participant: FourFacesParticipant | undefined = publication.participants[qIdx];
          if (!participant) return null;

          const isThisActive = qIdx === activeStep;

          return (
            <div
              key={`quadrant-${participant.id}-${qIdx}`}
              style={gridStyle}
              onClick={(e) => handleSelectCard(qIdx, e)}
              className={`relative rounded-2xl overflow-hidden transition-all duration-300 border bg-stone-900 cursor-pointer ${
                isThisActive 
                  ? 'border-2 border-[#A2482B] ring-2 ring-[#E27857]/50 shadow-2xl scale-[1.02] z-20 opacity-100' 
                  : 'border-white/15 opacity-70 hover:opacity-95 z-10 hover:scale-[1.01]'
              }`}
            >
              {/* Image de couverture toujours présente en fond */}
              <img 
                src={participant.avatarUrl} 
                alt={participant.name}
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                loading="eager"
              />

              {/* Vidéo de la personne active en superposition */}
              {isThisActive && isPlaying && (
                <video
                  ref={videoRef}
                  key={`video-q-${publication.id}-${qIdx}`}
                  src={participant.videoUrl || '/sample.mp4'}
                  poster={participant.avatarUrl}
                  autoPlay
                  playsInline
                  muted={isMuted}
                  onEnded={advanceToNextStep}
                  onTimeUpdate={(e) => {
                    const v = e.currentTarget;
                    if (v.duration && v.duration > 0) {
                      setProgressPercent(Math.min(100, (v.currentTime / v.duration) * 100));
                    }
                  }}
                  onError={() => {
                    setTimeout(advanceToNextStep, 2000);
                  }}
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                />
              )}

              {/* Voile dégradé sombre léger */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />
            </div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 3. BAS DE CARTE : UNIQUEMENT LE CURSEUR DE LECTURE (AUCUN TEXTE EN BAS)   */}
      {/* ========================================================================= */}
      <div className="relative z-30 px-4 pb-3 sm:pb-3.5 pt-1 flex items-center justify-center w-full pointer-events-none">
        <div className="flex items-center gap-1.5 w-full max-w-[190px] sm:max-w-[220px] h-1 bg-white/20 rounded-full overflow-hidden shadow-xs">
          {QUADRANT_CONFIG.map(({ index: sIdx }) => {
            let sPercent = 0;
            if (sIdx < activeStep) {
              sPercent = 100;
            } else if (sIdx === activeStep) {
              sPercent = progressPercent;
            }

            return (
              <div key={`p-step-${sIdx}`} className="h-full flex-1 bg-white/25 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-100 rounded-full ${
                    sIdx === activeStep ? 'bg-[#FFDEB5]' : 'bg-white'
                  }`}
                  style={{ width: `${sPercent}%` }}
                />
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
