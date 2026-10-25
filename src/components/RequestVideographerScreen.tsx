import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight,
  Focus,
  X,
  MapPin,
  Camera,
  Clock,
  Sparkles,
  Languages
} from 'lucide-react';
import { VIDEOGRAPHERS } from '../data/mockData';
import { ViewScreen } from '../types';
import { ProfileSoloIcon, TvPlayerIcon } from './YonywoodBrandIcons';
import { ShareIcon } from './ShareIcon';
import { VideoCardShareModal } from './VideoCardShareModal';

interface RequestVideographerScreenProps {
  returnPillarId?: string;
  returnCastingCategoryId?: string;
  returnFinalChoiceId?: string;
  onNavigate: (screen: ViewScreen) => void;
}

export const RequestVideographerScreen: React.FC<RequestVideographerScreenProps> = ({ 
  returnPillarId,
  returnCastingCategoryId,
  returnFinalChoiceId,
  onNavigate 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isSpecsModalOpen, setIsSpecsModalOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Swipe tactile et glisser interactif (style Bumble)
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const touchStartXRef = useRef<number | null>(null);
  const mouseStartXRef = useRef<number | null>(null);

  const videographers = VIDEOGRAPHERS;
  const currentVideographer = videographers[currentIndex] || videographers[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : videographers.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < videographers.length - 1 ? prev + 1 : 0));
  };

  const handleBack = () => {
    // Retourne à l'endroit exact précédent (le Duo "Télécharger sa vidéo" vs "Choisir un expert")
    onNavigate({
      type: 'submit_story',
      initialPillarId: returnPillarId,
      initialCastingCategoryId: returnCastingCategoryId,
      initialFinalChoiceId: returnFinalChoiceId
    });
  };

  // Navigation clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'Escape') {
        if (isSpecsModalOpen) setIsSpecsModalOpen(false);
        else if (isShareModalOpen) setIsShareModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [videographers.length, isSpecsModalOpen, isShareModalOpen]);

  // Video autoplay / sync on index change
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      if (isPlaying) {
        videoRef.current.play().catch(() => {
          setIsPlaying(false);
        });
      }
    }
  }, [currentIndex]);

  const togglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.targetTouches[0].clientX;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const currentX = e.targetTouches[0].clientX;
    const diff = currentX - touchStartXRef.current;
    setDragOffset(diff);
  };

  const handleTouchEnd = () => {
    if (touchStartXRef.current !== null) {
      const minSwipeDistance = 50;
      if (dragOffset > minSwipeDistance) {
        handlePrev();
      } else if (dragOffset < -minSwipeDistance) {
        handleNext();
      }
    }
    setDragOffset(0);
    setIsDragging(false);
    touchStartXRef.current = null;
  };

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    mouseStartXRef.current = e.clientX;
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (mouseStartXRef.current === null || !isDragging) return;
    const diff = e.clientX - mouseStartXRef.current;
    setDragOffset(diff);
  };

  const handleMouseUp = () => {
    if (mouseStartXRef.current !== null && isDragging) {
      const minSwipeDistance = 50;
      if (dragOffset > minSwipeDistance) {
        handlePrev();
      } else if (dragOffset < -minSwipeDistance) {
        handleNext();
      }
    }
    setDragOffset(0);
    setIsDragging(false);
    mouseStartXRef.current = null;
  };

  const handleOpenProfile = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentVideographer.protagonistId) {
      onNavigate({ 
        type: 'protagonist_profile', 
        protagonistId: currentVideographer.protagonistId 
      });
    } else {
      onNavigate({ 
        type: 'protagonist_profile', 
        protagonistId: currentVideographer.id 
      });
    }
  };

  const firstName = currentVideographer.firstName || currentVideographer.name.split(' ')[0];
  const rateText = currentVideographer.estimatedRateEuros 
    ? `À partir de ${currentVideographer.estimatedRateEuros} €`
    : (currentVideographer.rate || 'À partir de 180 €');

  return (
    <div className="w-full max-w-3xl mx-auto px-3 sm:px-6 pt-1 sm:pt-2 pb-20 sm:pb-24 pt-safe pb-safe h-full max-h-full overflow-hidden flex flex-col justify-between text-[#1C1917] select-none bg-white">
      
      {/* 1. EN-TÊTE EXACTEMENT ALIGNÉ AVEC LES ÉCRANS PRÉCÉDENTS (RETOUR FLUIDE AU CHOIX PRÉCÉDENT) */}
      <div className="relative flex items-center justify-between h-8 sm:h-10 shrink-0 gap-2 mb-0.5 sm:mb-1">
        <div className="flex items-center gap-1.5 sm:gap-2 h-full min-w-0">
          <button
            onClick={handleBack}
            className="font-normal text-stone-500 hover:text-stone-900 transition-colors cursor-pointer flex items-center gap-1 group py-1 shrink-0"
            title="Revenir au choix précédent (Télécharger sa vidéo ou Choisir un expert)"
          >
            <ArrowLeft className="w-4 h-4 text-stone-400 group-hover:text-stone-700 group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-xs sm:text-sm font-medium">Retour</span>
          </button>

          <span className="text-stone-300 font-light text-xs" aria-hidden="true">›</span>

          <div className="relative flex items-center h-full overflow-visible">
            <span className="font-editorial text-xs sm:text-sm md:text-base font-semibold text-[#1C1917] tracking-normal leading-none whitespace-nowrap pr-2 select-none">
              Choisir un expert
            </span>
            <div className="absolute left-0 -bottom-1.5 w-8 h-0.5 bg-[#A2482B] rounded-full" />
          </div>
        </div>
      </div>

      {/* 2. ZONE CENTRALE : CARTE VIDÉO 9:16 POSITIONNÉE EXACTEMENT COMME TOUTES LES CARTES PRÉCÉDENTES */}
      <div 
        className="relative flex-1 flex flex-col justify-center items-center w-full min-h-0 py-1 sm:py-2 select-none overflow-hidden touch-pan-y"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Flèche Gauche blanche élégante */}
        <button
          onClick={handlePrev}
          aria-label="Vidéaste précédent"
          className="flex absolute left-1 sm:left-3 lg:left-6 z-40 w-8.5 h-8.5 sm:w-11 sm:h-11 rounded-full bg-white/95 hover:bg-[#A2482B] text-[#1C1917] hover:text-white border border-[#E7E5E4] hover:border-[#A2482B] shadow-lg items-center justify-center transition-all cursor-pointer transform hover:scale-105 active:scale-95"
          title="Précédent"
        >
          <ChevronLeft className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
        </button>

        {/* Flèche Droite blanche élégante */}
        <button
          onClick={handleNext}
          aria-label="Vidéaste suivant"
          className="flex absolute right-1 sm:right-3 lg:right-6 z-40 w-8.5 h-8.5 sm:w-11 sm:h-11 rounded-full bg-white/95 hover:bg-[#A2482B] text-[#1C1917] hover:text-white border border-[#E7E5E4] hover:border-[#A2482B] shadow-lg items-center justify-center transition-all cursor-pointer transform hover:scale-105 active:scale-95"
          title="Suivant"
        >
          <ChevronRight className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
        </button>

        {/* CARTE VIDÉO DU VIDÉASTE (DIMENSIONS STRICTEMENT IDENTIQUES AUX AUTRES CARTES DU STUDIO) */}
        <div 
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onClick={togglePlay}
          style={{
            transform: isDragging 
              ? `translateX(${dragOffset}px) rotate(${dragOffset * 0.03}deg)` 
              : 'translateX(0px) rotate(0deg)',
            transition: isDragging ? 'none' : 'transform 0.25s ease-out',
          }}
          className="relative aspect-[9/16] w-[min(calc(100vw-64px),calc((100dvh-230px)*9/16))] max-w-[228px] sm:max-w-[270px] md:max-w-[290px] h-[min(410px,calc(100dvh-230px))] sm:h-[min(480px,calc(100dvh-200px))] md:h-[min(520px,calc(100dvh-180px))] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between p-3 sm:p-4 bg-black text-white border border-stone-200/90 group cursor-grab active:cursor-grabbing"
        >
          {/* Lecteur Vidéo */}
          <video
            ref={videoRef}
            src={currentVideographer.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'}
            poster={currentVideographer.photoUrl || currentVideographer.photo}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />

          {/* Dégradé cinématographique pour garantir la lisibilité */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-black/40 pointer-events-none" />

          {/* HAUT GAUCHE : Badge Note & Nombre de tournages (ex. ★ 4.8 - 9 tournages) */}
          <div className="relative z-10 flex items-center justify-between w-full min-w-0 pointer-events-auto">
            <span 
              className="inline-flex items-center px-2.5 sm:px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-[10px] sm:text-[11px] font-semibold text-white tracking-wide shadow-sm shrink-0 whitespace-nowrap leading-none select-none max-w-[calc(100%-48px)] truncate"
              title={`${currentVideographer.rating || 4.8} - ${currentVideographer.storiesShot || 9} tournages`}
            >
              ★ {currentVideographer.rating || 4.8} - {currentVideographer.storiesShot || currentVideographer.completedShoots || 9} tournages
            </span>

            {/* HAUT DROITE : Icône officielle télé vintage TvPlayerIcon */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                togglePlay(e);
              }}
              className="w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-xl bg-black/55 hover:bg-[#A2482B] active:bg-[#8A3B22] text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-200 cursor-pointer shadow-md hover:scale-105 active:scale-95 shrink-0"
              title={isPlaying ? 'Mettre en pause' : 'Lire la vidéo'}
            >
              <TvPlayerIcon className="w-4 h-4 text-white" strokeWidth={1.6} />
            </button>
          </div>

          {/* COLONNE LATÉRALE DROITE (DOCK D'ACTIONS AU MILIEU DE LA CARTE) */}
          <div 
            className="absolute right-2.5 sm:right-3 top-[56%] -translate-y-1/2 z-30 flex flex-col items-center gap-2 pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 1. Bouton Profil officiel : ProfileSoloIcon (tête télé vintage avec jambes) */}
            <button
              type="button"
              onClick={handleOpenProfile}
              className="w-7.5 h-7.5 sm:w-8.5 sm:h-8.5 rounded-xl bg-black/50 hover:bg-[#A2482B] border border-white/20 hover:border-[#A2482B] text-white backdrop-blur-md flex items-center justify-center shadow-md transition-all cursor-pointer hover:scale-105 active:scale-95"
              title={`Voir le portrait de ${firstName}`}
              aria-label={`Profil de ${firstName}`}
            >
              <ProfileSoloIcon className="w-4 h-4 text-white" />
            </button>

            {/* 2. Bouton Viseur d'objectif : Fiche technique (matériel, conditions, références, ville et pays) */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsSpecsModalOpen(true);
              }}
              className="w-7.5 h-7.5 sm:w-8.5 sm:h-8.5 rounded-xl bg-black/50 hover:bg-[#A2482B] border border-white/20 hover:border-[#A2482B] text-white backdrop-blur-md flex items-center justify-center shadow-md transition-all cursor-pointer hover:scale-105 active:scale-95"
              title={`Matériel & conditions de ${firstName}`}
              aria-label={`Matériel et conditions de ${firstName}`}
            >
              <Focus className="w-4 h-4 text-white" />
            </button>

            {/* 3. Bouton Partager officiel : ShareIcon */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsShareModalOpen(true);
              }}
              className="w-7.5 h-7.5 sm:w-8.5 sm:h-8.5 rounded-xl bg-black/50 hover:bg-[#A2482B] border border-white/20 hover:border-[#A2482B] text-white backdrop-blur-md flex items-center justify-center shadow-md transition-all cursor-pointer hover:scale-105 active:scale-95"
              title="Partager"
              aria-label="Partager"
            >
              <ShareIcon className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* BAS DE LA CARTE : PRÉNOM D'ABORD, TARIF EN DESSOUS */}
          <div className="relative z-10 text-white pointer-events-none mt-auto pr-10">
            <h2 className="font-editorial text-xl sm:text-2xl font-bold text-white drop-shadow-md leading-tight">
              {firstName}
            </h2>
            <div className="text-[11px] sm:text-xs font-medium text-white/90 drop-shadow-sm mt-0.5 tracking-wide">
              {rateText}
            </div>
          </div>

        </div>

      </div>

      {/* 3. MODALE DÉCLENCHÉE PAR LE VISEUR D'OBJECTIF : CALQUÉE SUR LA FORME DE LA CARTE VIDÉO */}
      {isSpecsModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsSpecsModalOpen(false)}
        >
          {/* Même gabarit épuré que la carte vidéo / modale synopsis */}
          <div 
            className="w-[min(calc(100vw-64px),290px)] max-w-[290px] max-h-[85vh] bg-[#FAF7F2] rounded-3xl p-4 sm:p-5 shadow-2xl border border-stone-200 flex flex-col justify-between animate-in zoom-in-95 duration-200 text-stone-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header avec Viseur d'objectif + Titre + Fermer */}
            <div className="flex items-center justify-between gap-2 border-b border-stone-200 pb-2.5 shrink-0">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <div className="w-7.5 h-7.5 rounded-xl bg-[#A2482B]/10 text-[#A2482B] flex items-center justify-center shrink-0">
                  <Focus className="w-4 h-4" />
                </div>
                <div className="min-w-0 truncate">
                  <h3 className="font-editorial text-sm font-semibold text-stone-900 truncate">
                    Fiche réalisateur
                  </h3>
                  <p className="text-[10px] text-stone-500 truncate">{currentVideographer.name}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSpecsModalOpen(false)}
                className="w-7 h-7 rounded-full bg-stone-200/70 hover:bg-stone-300 text-stone-700 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                title="Fermer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Contenu technique défilable proprement */}
            <div className="py-2.5 space-y-3 overflow-y-auto text-xs pr-1">
              {/* Ville et pays */}
              {(currentVideographer.territory || currentVideographer.country) && (
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#A2482B] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-stone-900 block text-[11px]">Localisation</span>
                    <span className="text-stone-600 text-[11px] leading-tight block">
                      {currentVideographer.territory || currentVideographer.country}
                    </span>
                  </div>
                </div>
              )}

              {/* Matériel de tournage */}
              {(currentVideographer.gear || currentVideographer.equipment) && (
                <div className="flex items-start gap-2">
                  <Camera className="w-3.5 h-3.5 text-[#A2482B] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-stone-900 block text-[11px]">Matériel & Caméras</span>
                    <span className="text-stone-600 text-[11px] leading-relaxed block">
                      {currentVideographer.gear || currentVideographer.equipment}
                    </span>
                  </div>
                </div>
              )}

              {/* Conditions & Disponibilité */}
              <div className="flex items-start gap-2">
                <Clock className="w-3.5 h-3.5 text-[#A2482B] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-stone-900 block text-[11px]">Conditions & Disponibilité</span>
                  <span className="text-stone-600 text-[11px] leading-relaxed block">
                    {currentVideographer.availability || 'Disponible sous 48h'} • {rateText}
                    {currentVideographer.rateInfo && ` • ${currentVideographer.rateInfo}`}
                  </span>
                </div>
              </div>

              {/* Références & Spécialités */}
              {currentVideographer.specialties && currentVideographer.specialties.length > 0 && (
                <div className="flex items-start gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#A2482B] shrink-0 mt-0.5" />
                  <div className="w-full">
                    <span className="font-semibold text-stone-900 block text-[11px] mb-1">Références & Univers</span>
                    <div className="flex flex-wrap gap-1">
                      {currentVideographer.specialties.map((spec, sIdx) => (
                        <span 
                          key={sIdx}
                          className="px-2 py-0.5 rounded-md bg-stone-200/70 text-stone-700 text-[10px] font-medium"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Langues parlées */}
              {currentVideographer.languages && currentVideographer.languages.length > 0 && (
                <div className="flex items-start gap-2">
                  <Languages className="w-3.5 h-3.5 text-[#A2482B] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-stone-900 block text-[11px]">Langues</span>
                    <span className="text-stone-600 text-[11px]">
                      {currentVideographer.languages.join(', ')}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Pied de la modale */}
            <div className="pt-2 border-t border-stone-200 flex items-center justify-between gap-2 shrink-0">
              <button
                type="button"
                onClick={handleOpenProfile}
                className="w-full py-1.5 px-3 rounded-xl bg-[#A2482B] hover:bg-[#8A3B22] text-white text-xs font-semibold shadow-xs transition-colors text-center cursor-pointer"
              >
                Voir son portrait complet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. MODALE DE PARTAGE HARMONISÉE */}
      <VideoCardShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        videoTitle={`Vidéaste documentaire YonyWood — ${currentVideographer.name}`}
        videoId={currentVideographer.id}
      />

    </div>
  );
};
