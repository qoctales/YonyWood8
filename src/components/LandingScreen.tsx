import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronLeft,
  ChevronRight,
  LogIn,
  UserPlus,
  Sparkles
} from 'lucide-react';
import { ViewScreen } from '../types';
import { AuthModal } from './AuthModal';
import { Play } from 'lucide-react';
import homeFilmmaker from '../assets/images/home_afro_filmmaker_1792193482817.jpg';
import homeStoryteller from '../assets/images/home_afro_storyteller_1792193575638.jpg';
import homeLibrary from '../assets/images/home_afro_library_1792193591474.jpg';

interface LandingScreenProps {
  onNavigate: (screen: ViewScreen) => void;
}

interface OnboardingItem {
  id: string;
  stepNumber: string;
  title: string;
  tagline: string;
  illustrationUrl: string;
}

const ONBOARDING_CARDS: OnboardingItem[] = [
  {
    id: 'card-1-pourquoi-yonywood',
    stepNumber: '01',
    title: 'Pourquoi YonyWood ?',
    tagline: 'Des histoires vivantes qui nous relient et révèlent nos mémoires.',
    illustrationUrl: homeFilmmaker
  },
  {
    id: 'card-2-comment-ca-marche',
    stepNumber: '02',
    title: 'Comment ça marche ?',
    tagline: 'Deux univers en miroir face à une même question universelle.',
    illustrationUrl: homeStoryteller
  },
  {
    id: 'card-3-pourquoi-participer',
    stepNumber: '03',
    title: 'Pourquoi participer ?',
    tagline: 'Coproduisez, transmettez et faites grandir la plus grande bibliothèque de récits humains.',
    illustrationUrl: homeLibrary
  }
];

export const LandingScreen: React.FC<LandingScreenProps> = ({ onNavigate }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Swipe tactile & drag souris
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const touchCurrentXRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const hasDraggedRef = useRef(false);

  const currentItem = ONBOARDING_CARDS[currentIdx];

  const handlePrev = () => {
    setSwipeOffset(0);
    setIsSwiping(false);
    setCurrentIdx((prev) => (prev - 1 + ONBOARDING_CARDS.length) % ONBOARDING_CARDS.length);
  };

  const handleNext = () => {
    setSwipeOffset(0);
    setIsSwiping(false);
    setCurrentIdx((prev) => (prev + 1) % ONBOARDING_CARDS.length);
  };

  // --- Gestion du Swipe Tactile (Mobile) ---
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.targetTouches[0].clientX;
    touchStartYRef.current = e.targetTouches[0].clientY;
    touchCurrentXRef.current = e.targetTouches[0].clientX;
    setIsSwiping(true);
    hasDraggedRef.current = false;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const currentX = e.targetTouches[0].clientX;
    const currentY = e.targetTouches[0].clientY;
    touchCurrentXRef.current = currentX;

    const diffX = currentX - touchStartXRef.current;
    const diffY = currentY - (touchStartYRef.current || currentY);

    // Priorité au swipe horizontal naturel
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 6) {
      hasDraggedRef.current = true;
      setSwipeOffset(diffX);
    }
  };

  const onTouchEnd = () => {
    setIsSwiping(false);
    if (touchStartXRef.current !== null && touchCurrentXRef.current !== null) {
      const diff = touchCurrentXRef.current - touchStartXRef.current;
      if (diff > 30) {
        handlePrev();
      } else if (diff < -30) {
        handleNext();
      }
    }
    touchStartXRef.current = null;
    touchStartYRef.current = null;
    touchCurrentXRef.current = null;
    setSwipeOffset(0);
  };

  // --- Gestion du Drag Souris (Desktop) ---
  const onMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    setIsSwiping(true);
    touchStartXRef.current = e.clientX;
    touchCurrentXRef.current = e.clientX;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || touchStartXRef.current === null) return;
    touchCurrentXRef.current = e.clientX;
    const diff = touchCurrentXRef.current - touchStartXRef.current;
    if (Math.abs(diff) > 6) {
      hasDraggedRef.current = true;
    }
    setSwipeOffset(diff);
  };

  const onMouseUp = () => {
    setIsSwiping(false);
    if (isDraggingRef.current && touchStartXRef.current !== null && touchCurrentXRef.current !== null) {
      const diff = touchCurrentXRef.current - touchStartXRef.current;
      if (diff > 30) {
        handlePrev();
      } else if (diff < -30) {
        handleNext();
      }
    }
    isDraggingRef.current = false;
    touchStartXRef.current = null;
    touchCurrentXRef.current = null;
    setSwipeOffset(0);
  };

  const openAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = () => {
    // Redirection automatique vers la page des Duos après connexion / inscription
    onNavigate({ type: 'duo_feed' });
  };

  return (
    <div className="h-[100dvh] max-h-[100dvh] bg-white text-[#1C1917] flex flex-col justify-between select-none relative overflow-hidden">
      
      {/* Modale d'authentification sur fond blanc épuré avec profil démo */}
      <AuthModal 
        isOpen={authModalOpen}
        initialMode={authMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* ========================================================================= */}
      {/* 1. EN-TÊTE FIXE SUR FOND BLANC : LOGO, SLOGAN CENTRÉ & BOUTONS ADAPTÉS     */}
      {/* ========================================================================= */}
      <header className="relative z-30 w-full max-w-7xl mx-auto px-3 sm:px-6 md:px-8 py-2 sm:py-2.5 flex items-center justify-between border-b border-stone-200 bg-white shrink-0">
        
        {/* Gauche : Logo officiel YonyWood (taille équilibrée mobile et web) */}
        <div className="flex items-center flex-1 justify-start">
          <img 
            src="/logo%20YonyWood.png?v=5" 
            alt="YonyWood" 
            className="h-8 sm:h-10 md:h-12 w-auto object-contain mix-blend-multiply select-none transition-all cursor-pointer"
            onClick={() => onNavigate({ type: 'landing' })}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/logo-yonywood-clean.png?v=5';
            }}
          />
        </div>

        {/* Milieu : Slogan centré au milieu du header (affiché sur Web / Desktop) */}
        <div className="hidden md:flex flex-1 items-center justify-center text-center px-2">
          <p className="font-editorial text-sm lg:text-base italic text-stone-600 tracking-wide select-none whitespace-nowrap">
            Where Stories Stick Together in Harmony.
          </p>
        </div>

        {/* Droite : Inscription & Connexion (boutons adaptés et élégants) */}
        <div className="flex items-center justify-end flex-1 gap-1.5 sm:gap-2.5">
          <button
            onClick={() => openAuth('login')}
            className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-semibold text-stone-700 hover:text-black hover:bg-stone-100 border border-stone-300 transition-all cursor-pointer flex items-center gap-1 sm:gap-1.5 active:scale-95 whitespace-nowrap"
          >
            <LogIn className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-stone-600" />
            <span>Connexion</span>
          </button>

          <button
            onClick={() => openAuth('register')}
            className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-bold text-white bg-[#A2482B] hover:bg-[#8A3B22] shadow-xs hover:shadow-sm transition-all cursor-pointer flex items-center gap-1 sm:gap-1.5 active:scale-95 whitespace-nowrap"
          >
            <UserPlus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>Inscription</span>
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. CORPS : CARTE UNIQUE 9:16 AVEC ILLUSTRATION ARTISTIQUE DE PERSONNAGE NOIR */}
      {/* ========================================================================= */}
      <main className="relative z-20 flex-1 w-full max-w-4xl mx-auto flex flex-col items-center justify-center px-3 sm:px-6 py-4 sm:py-6 min-h-0 overflow-hidden">
        
        {/* Conteneur de l'écran 9:16 avec swipe et flèches */}
        <div className="relative w-full max-w-xl mx-auto flex items-center justify-center">
          
          {/* Flèche Gauche (Précédente) */}
          <button
            type="button"
            onClick={handlePrev}
            className="absolute -left-2 sm:-left-12 lg:-left-16 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 hover:bg-[#A2482B] text-stone-800 hover:text-white border border-[#E7E5E4] hover:border-[#A2482B] shadow-xl flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
            title="Précédent"
            aria-label="Précédent"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* CARTE FORMAT VERTICAL 9:16 AVEC L'ILLUSTRATION DESSINÉE D'UN PERSONNAGE NOIR */}
          <div
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            className={`aspect-[9/16] w-[min(340px,calc((100dvh-200px)*9/16))] h-[min(560px,calc(100dvh-200px))] max-w-[calc(100vw-32px)] mx-auto touch-pan-y select-none cursor-grab active:cursor-grabbing flex justify-center shrink-0 ${
              isSwiping ? 'transition-none' : 'transition-transform duration-300 ease-out'
            }`}
            style={{ transform: `translateX(${swipeOffset}px)` }}
          >
            <div 
              onClick={(e) => {
                if (hasDraggedRef.current) {
                  hasDraggedRef.current = false;
                  return;
                }
                if ((e.target as HTMLElement).closest('button, a, input')) {
                  return;
                }
                handleNext();
              }}
              className="group relative w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden bg-stone-950 text-white shadow-2xl border border-stone-200/80 flex flex-col justify-between cursor-pointer select-none"
            >
              {/* Illustration de personnage noir soignée et élégante */}
              <img
                src={currentItem.illustrationUrl}
                alt={currentItem.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-102 transition-transform duration-700 pointer-events-none"
              />

              {/* Voile sombre cinématographique pour garantir la lisibilité du titre */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/30 pointer-events-none" />

              {/* Haut : Badge discret d'étape uniquement */}
              <div className="relative z-20 p-3.5 sm:p-4.5 flex items-center justify-start pointer-events-none">
                <span className="px-2.5 py-1 rounded-full bg-black/55 backdrop-blur-md border border-white/20 text-[10px] sm:text-xs font-bold text-white tracking-wider uppercase shadow-sm">
                  {currentItem.stepNumber}
                </span>
              </div>

              {/* Centre : Bouton Play vidéo cinématographique */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-black/45 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-2xl group-hover:scale-108 group-hover:bg-[#A2482B]/85 group-hover:border-white transition-all duration-300">
                  <Play className="w-6 h-6 fill-white text-white translate-x-0.5 opacity-95" />
                </div>
              </div>

              {/* Bas : Titre et accroche claire */}
              <div className="relative z-20 px-5 pb-6 sm:pb-7 pt-2 pointer-events-none">
                <h2 className="font-editorial text-xl sm:text-2xl font-bold tracking-tight text-white drop-shadow-md leading-snug">
                  {currentItem.title}
                </h2>
                <p className="text-xs sm:text-sm text-stone-200/90 mt-1.5 leading-relaxed drop-shadow-xs line-clamp-2">
                  {currentItem.tagline}
                </p>
              </div>

            </div>
          </div>

          {/* Flèche Droite (Suivante) */}
          <button
            type="button"
            onClick={handleNext}
            className="absolute -right-2 sm:-right-12 lg:-right-16 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 hover:bg-[#A2482B] text-stone-800 hover:text-white border border-[#E7E5E4] hover:border-[#A2482B] shadow-xl flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
            title="Suivant"
            aria-label="Suivant"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

        </div>

        {/* Indicateurs de progression (3 cartes) */}
        <div className="flex items-center justify-center gap-2 mt-4 sm:mt-5 shrink-0">
          {ONBOARDING_CARDS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSwipeOffset(0);
                setCurrentIdx(idx);
              }}
              className={`transition-all rounded-full cursor-pointer ${
                idx === currentIdx 
                  ? 'w-7 h-1.5 bg-[#A2482B]' 
                  : 'w-1.5 h-1.5 bg-stone-300 hover:bg-stone-400'
              }`}
              aria-label={`Carte ${idx + 1}`}
            />
          ))}
        </div>

      </main>

    </div>
  );
};
