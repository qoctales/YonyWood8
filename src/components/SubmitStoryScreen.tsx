import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Pause 
} from 'lucide-react';
import { ViewScreen } from '../types';
import { STUDIO_PILLARS, StudioPillar, StudioPillarItem } from '../data/studioPillarsData';
import { TvPlayerIcon } from './YonywoodBrandIcons';
import { celestialAudio } from '../utils/celestialAudio';

interface SubmitStoryScreenProps {
  preselectedDocumentaryId?: string;
  onNavigate: (screen: ViewScreen) => void;
}

export const SubmitStoryScreen: React.FC<SubmitStoryScreenProps> = ({
  preselectedDocumentaryId,
  onNavigate
}) => {
  // 1. État du pilier sélectionné (0 à 3)
  const [selectedPillarIndex, setSelectedPillarIndex] = useState(0);
  const [activePillar, setActivePillar] = useState<StudioPillar | null>(null);

  // 2. État du carrousel des sous-catégories / séries au sein du pilier choisi
  const [selectedThemeIndex, setSelectedThemeIndex] = useState(0);

  // 3. Média vidéo en arrière-plan
  const [playingCardId, setPlayingCardId] = useState<string | null>(null);

  // 4. Gestures tactiles rapides et précises
  const touchStartXRef = useRef<number>(0);
  const touchStartYRef = useRef<number>(0);
  const touchStartTimeRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const [dragOffset, setDragOffset] = useState<number>(0);

  // Pré-sélection éventuelle venant d'une série documentaire externe
  useEffect(() => {
    if (preselectedDocumentaryId) {
      const duoPillar = STUDIO_PILLARS.find(p => p.id === 'duos');
      if (duoPillar) {
        setActivePillar(duoPillar);
        const matchIdx = duoPillar.items.findIndex(it => it.id === preselectedDocumentaryId);
        if (matchIdx >= 0) setSelectedThemeIndex(matchIdx);
      }
    }
  }, [preselectedDocumentaryId]);

  // Éléments actifs selon la vue (soit les 4 piliers, soit les sous-catégories du pilier)
  const currentList = activePillar ? activePillar.items : STUDIO_PILLARS;
  const currentIndex = activePillar ? selectedThemeIndex : selectedPillarIndex;
  const setCurrentIndex = activePillar ? setSelectedThemeIndex : setSelectedPillarIndex;

  // Navigation dans le Carrousel 3D
  const goToNext = useCallback(() => {
    setPlayingCardId(null);
    setCurrentIndex((prev) => (prev + 1) % currentList.length);
    celestialAudio?.playOrbSelect?.();
  }, [currentList.length, setCurrentIndex]);

  const goToPrev = useCallback(() => {
    setPlayingCardId(null);
    setCurrentIndex((prev) => (prev - 1 + currentList.length) % currentList.length);
    celestialAudio?.playOrbSelect?.();
  }, [currentList.length, setCurrentIndex]);

  // Navigation clavier flèches gauche / droite
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'ArrowLeft') {
        goToPrev();
      } else if (e.key === 'Escape' && activePillar) {
        setActivePillar(null);
        setPlayingCardId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrev, activePillar]);

  // Gestion des événements tactiles ultra-réactive
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
    touchStartTimeRef.current = Date.now();
    isDraggingRef.current = true;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.touches[0].clientX - touchStartXRef.current;
    const deltaY = e.touches[0].clientY - touchStartYRef.current;

    // Déplacement horizontal prédominant
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 6) {
      setDragOffset(Math.max(-75, Math.min(75, deltaX * 0.45)));
    }
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartXRef.current;
    const elapsed = Date.now() - touchStartTimeRef.current;
    const velocity = Math.abs(deltaX) / Math.max(1, elapsed); // vitesse en px/ms

    // Déclenchement réactif : seuil bas (24px) ou coup de doigt rapide (flick)
    if (Math.abs(deltaX) > 24 || velocity > 0.28) {
      if (deltaX < 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }
    setDragOffset(0);
  };

  // Gestion souris (drag pour desktop)
  const onMouseDown = (e: React.MouseEvent) => {
    touchStartXRef.current = e.clientX;
    touchStartTimeRef.current = Date.now();
    isDraggingRef.current = true;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - touchStartXRef.current;
    if (Math.abs(deltaX) > 6) {
      setDragOffset(Math.max(-75, Math.min(75, deltaX * 0.45)));
    }
  };

  const onMouseUp = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    const deltaX = e.clientX - touchStartXRef.current;
    const elapsed = Date.now() - touchStartTimeRef.current;
    const velocity = Math.abs(deltaX) / Math.max(1, elapsed);

    if (Math.abs(deltaX) > 24 || velocity > 0.28) {
      if (deltaX < 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }
    setDragOffset(0);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-3 sm:px-6 pt-1 sm:pt-2 pb-20 sm:pb-24 pt-safe pb-safe h-full max-h-full overflow-hidden flex flex-col justify-between text-[#1C1917] select-none">
      
      {/* ========================================================================= */}
      {/* 1. EN-TÊTE HARMONISÉ STRICTEMENT AU MÊME NIVEAU SUR TOUTES LES PAGES     */}
      {/* ========================================================================= */}
      <div className="relative flex items-center justify-between h-8 sm:h-10 shrink-0 gap-2 mb-0.5 sm:mb-1">
        <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0 flex-1 h-full">
          {!activePillar ? (
            /* Accueil Studio : 4 façons de partager son histoire en Nunito non-italique avec tiret terracotta */
            <div className="relative flex items-center h-full overflow-visible">
              <h1 className="font-editorial text-xs sm:text-sm md:text-base font-semibold text-[#1C1917] tracking-normal leading-none whitespace-nowrap pr-2">
                4 façons de partager son histoire
              </h1>
              {/* Petit trait terracotta officiel */}
              <div className="absolute left-0 -bottom-1.5 w-8 h-0.5 bg-[#A2482B] rounded-full" />
            </div>
          ) : (
            /* Fil d'ariane épuré avec retour vers les 4 Piliers */
            <div className="flex items-center gap-1.5 sm:gap-2 h-full min-w-0">
              <button
                onClick={() => {
                  setActivePillar(null);
                  setPlayingCardId(null);
                }}
                className="font-normal text-stone-500 hover:text-stone-900 transition-colors cursor-pointer flex items-center gap-1 group py-1 shrink-0"
                title="Revenir aux 4 Piliers"
              >
                <ChevronLeft className="w-4 h-4 text-stone-400 group-hover:text-stone-700 group-hover:-translate-x-0.5 transition-transform" />
                <span className="text-xs sm:text-sm">4 Piliers</span>
              </button>

              <span className="text-stone-300 font-light text-xs" aria-hidden="true">
                ›
              </span>

              <div className="relative flex items-center h-full overflow-visible">
                <span
                  className="font-editorial text-xs sm:text-sm md:text-base font-semibold text-[#1C1917] tracking-normal leading-none whitespace-nowrap pr-2 select-none"
                  aria-current="page"
                >
                  {activePillar.title}
                </span>
                {/* Petit trait terracotta officiel */}
                <div className="absolute left-0 -bottom-1.5 w-8 h-0.5 bg-[#A2482B] rounded-full" />
              </div>
            </div>
          )}
        </div>

        {/* Côté droit épuré : Quitter si préselection externe */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {preselectedDocumentaryId && (
            <button
              onClick={() => onNavigate({ type: 'duo_feed' })}
              className="text-[11px] sm:text-xs text-stone-500 hover:text-stone-900 font-medium underline cursor-pointer shrink-0"
              title="Revenir aux duos"
            >
              Quitter
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. ZONE CENTRALE : CARROUSEL 3D ROTATIF (JEU VIDÉO) SANS TEXTE SUR L'IMAGE */}
      {/* ========================================================================= */}
      <div 
        className="relative flex-1 flex flex-col items-center justify-center min-h-0 py-1 sm:py-2 select-none overflow-hidden touch-pan-y"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
      >
        {/* Flèche Gauche (accessible sur mobile et desktop) */}
        <button
          onClick={goToPrev}
          className="flex absolute left-1 sm:left-3 lg:left-6 z-40 w-8.5 h-8.5 sm:w-11 sm:h-11 rounded-full bg-white/95 hover:bg-[#A2482B] text-[#1C1917] hover:text-white border border-[#E7E5E4] hover:border-[#A2482B] shadow-lg items-center justify-center transition-all cursor-pointer transform hover:scale-105 active:scale-95"
          title="Précédent"
          id="prev-carousel-btn"
        >
          <ChevronLeft className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
        </button>

        {/* SCÈNE 3D AVEC PERSPECTIVE JEU VIDÉO */}
        <div 
          className="relative w-full h-full flex items-center justify-center pointer-events-none"
          style={{ 
            perspective: '1200px',
            perspectiveOrigin: 'center center'
          }}
        >
          <div 
            className="relative w-full h-full flex items-center justify-center pointer-events-none"
            style={{
              transformStyle: 'preserve-3d'
            }}
          >
            {currentList.map((item, idx) => {
              // Calcul de la distance relative circulaire
              const n = currentList.length;
              const rawDiff = (idx - currentIndex) % n;
              const diff = rawDiff > n / 2 ? rawDiff - n : rawDiff < -n / 2 ? rawDiff + n : rawDiff;
              const isCenter = diff === 0;

              // Transformations 3D fluides et dimension strictement égale aux cartes vidéo de l'application
              let transformStyle = '';
              let zIndex = 10;
              let opacity = 0;
              let pointerEvents: 'auto' | 'none' = 'none';

              if (diff === 0) {
                // Carte active au centre, face à l'utilisateur
                transformStyle = `translateX(${dragOffset}px) translateZ(60px) rotateY(${dragOffset * -0.15}deg) scale(1)`;
                zIndex = 30;
                opacity = 1;
                pointerEvents = 'auto';
              } else if (diff === 1) {
                // Carte voisine droite (inclinée)
                transformStyle = `translateX(calc(55% + ${dragOffset}px)) translateZ(-60px) rotateY(-26deg) scale(0.86)`;
                zIndex = 20;
                opacity = 0.75;
                pointerEvents = 'auto';
              } else if (diff === -1) {
                // Carte voisine gauche (inclinée)
                transformStyle = `translateX(calc(-55% + ${dragOffset}px)) translateZ(-60px) rotateY(26deg) scale(0.86)`;
                zIndex = 20;
                opacity = 0.75;
                pointerEvents = 'auto';
              } else if (diff === 2) {
                // Carte droite plus éloignée (pour les piliers à 8 éléments)
                transformStyle = `translateX(calc(100% + ${dragOffset}px)) translateZ(-140px) rotateY(-40deg) scale(0.72)`;
                zIndex = 10;
                opacity = 0.35;
                pointerEvents = 'auto';
              } else if (diff === -2) {
                // Carte gauche plus éloignée (pour les piliers à 8 éléments)
                transformStyle = `translateX(calc(-100% + ${dragOffset}px)) translateZ(-140px) rotateY(40deg) scale(0.72)`;
                zIndex = 10;
                opacity = 0.35;
                pointerEvents = 'auto';
              } else {
                // Cartes masquées à l'arrière
                transformStyle = `translateX(0px) translateZ(-250px) rotateY(180deg) scale(0.5)`;
                zIndex = 5;
                opacity = 0;
                pointerEvents = 'none';
              }

              const isPlaying = playingCardId === item.id;

              return (
                <div
                  key={`carousel-card-${item.id}`}
                  onClick={() => {
                    if (isCenter) {
                      if (!activePillar) {
                        // Au clic sur un pilier central : entrer dans ce pilier
                        setActivePillar(item as StudioPillar);
                        setSelectedThemeIndex(0);
                        setPlayingCardId(null);
                        celestialAudio?.playOrbSelect?.();
                      } else {
                        // Au clic sur une thématique centrale : lancer la proposition d'histoire
                        onNavigate({ 
                          type: 'participate', 
                          preselectedSeriesId: item.id 
                        });
                      }
                    } else {
                      // Clic direct sur une carte latérale : la faire pivoter immédiatement au centre
                      setCurrentIndex(idx);
                      setPlayingCardId(null);
                      celestialAudio?.playOrbSelect?.();
                    }
                  }}
                  style={{
                    transform: transformStyle,
                    zIndex,
                    opacity,
                    pointerEvents,
                    transition: isDraggingRef.current ? 'none' : 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.24s ease'
                  }}
                  className={`absolute aspect-[9/16] w-[min(calc(100vw-72px),calc((100dvh-240px)*9/16))] max-w-[218px] sm:max-w-[260px] md:max-w-[280px] h-[min(388px,calc(100dvh-240px))] sm:h-[min(460px,calc(100dvh-210px))] md:h-[min(500px,calc(100dvh-190px))] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between p-3 sm:p-4 cursor-pointer select-none bg-[#151513] text-white border transition-colors ${
                    isCenter ? 'border-stone-200/90 ring-1 ring-white/30' : 'border-white/15'
                  }`}
                >
                  {/* Image d'illustration cinéma OU Vidéo si lecture activée */}
                  {isPlaying ? (
                    <video
                      src={item.videoUrl}
                      poster={item.posterUrl}
                      autoPlay
                      loop
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={item.posterUrl}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                    />
                  )}

                  {/* Voile cinématographique pour une visibilité optimale */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/75 pointer-events-none" />

                  {/* HAUT : Titre épuré en haut à gauche + Déclencheur Petite Télé en haut à droite */}
                  <div className="relative z-10 flex items-center justify-between gap-1.5 pointer-events-auto w-full min-w-0">
                    <span 
                      className="inline-flex items-center px-2.5 sm:px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-[10px] sm:text-[11px] font-semibold tracking-wide text-white shadow-sm shrink-0 whitespace-nowrap leading-none select-none max-w-[calc(100%-48px)] truncate"
                      title={item.title}
                    >
                      {item.title}
                    </span>

                    {/* Déclencheur lecteur vidéo « Petite Télé » standardisé en haut à droite */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isCenter) {
                          setCurrentIndex(idx);
                        } else {
                          setPlayingCardId(isPlaying ? null : item.id);
                        }
                      }}
                      className="w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-xl bg-black/55 hover:bg-[#A2482B] text-white backdrop-blur-md border border-white/20 hover:border-[#A2482B] flex items-center justify-center transition-all duration-200 cursor-pointer shadow-md hover:scale-105 active:scale-95 shrink-0"
                      title={isPlaying ? 'Mettre en pause' : `Visionner ${item.title}`}
                    >
                      {isPlaying ? (
                        <Pause className="w-3.5 h-3.5 fill-white text-white" />
                      ) : (
                        <TvPlayerIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white transition-transform" strokeWidth={1.7} />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Flèche Droite (accessible sur mobile et desktop) */}
        <button
          onClick={goToNext}
          className="flex absolute right-1 sm:right-3 lg:right-6 z-40 w-8.5 h-8.5 sm:w-11 sm:h-11 rounded-full bg-white/95 hover:bg-[#A2482B] text-[#1C1917] hover:text-white border border-[#E7E5E4] hover:border-[#A2482B] shadow-lg items-center justify-center transition-all cursor-pointer transform hover:scale-105 active:scale-95"
          title="Suivant"
          id="next-carousel-btn"
        >
          <ChevronRight className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
        </button>
      </div>

    </div>
  );
};
