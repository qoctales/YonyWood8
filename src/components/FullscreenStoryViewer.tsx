import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Volume2, 
  VolumeX, 
  Film, 
  ArrowRight, 
  ChevronUp, 
  ChevronDown,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { ThematicStory } from '../data/thematicStoriesData';
import { celestialAudio } from '../utils/celestialAudio';

interface FullscreenStoryViewerProps {
  stories: ThematicStory[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigateToDuo: (story: ThematicStory) => void;
}

export const FullscreenStoryViewer: React.FC<FullscreenStoryViewerProps> = ({
  stories,
  initialIndex = 0,
  isOpen,
  onClose,
  onNavigateToDuo
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showQuestionDrawer, setShowQuestionDrawer] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const touchStartY = useRef<number | null>(null);
  const lastScrollTime = useRef<number>(0);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setIsPlaying(true);
    }
  }, [isOpen, initialIndex]);

  useEffect(() => {
    setIsPlaying(true);
    setShowQuestionDrawer(false);
  }, [currentIndex]);

  if (!isOpen || stories.length === 0) return null;

  const currentStory = stories[currentIndex] || stories[0];

  const handleNextStory = () => {
    if (stories.length <= 1) return;
    setCurrentIndex(prev => (prev + 1) % stories.length);
    celestialAudio.playOrbSelect();
  };

  const handlePrevStory = () => {
    if (stories.length <= 1) return;
    setCurrentIndex(prev => (prev - 1 + stories.length) % stories.length);
    celestialAudio.playOrbSelect();
  };

  const handleWheel = (e: React.WheelEvent) => {
    const now = Date.now();
    if (now - lastScrollTime.current < 400) return;
    if (Math.abs(e.deltaY) > 30) {
      lastScrollTime.current = now;
      if (e.deltaY > 0) handleNextStory();
      else handlePrevStory();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    touchStartY.current = null;
    if (Math.abs(deltaY) > 45) {
      if (deltaY < 0) handleNextStory();
      else handlePrevStory();
    }
  };

  return (
    <div 
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center select-none"
    >
      {/* Flèches de navigation verticale Desktop */}
      <div className="hidden md:flex flex-col gap-2 absolute right-8 top-1/2 -translate-y-1/2 z-40">
        <button
          onClick={handlePrevStory}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#A2482B] text-white border border-white/20 flex items-center justify-center transition-all cursor-pointer shadow-lg hover:scale-105"
          title="Story précédente (Haut)"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
        <button
          onClick={handleNextStory}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#A2482B] text-white border border-white/20 flex items-center justify-center transition-all cursor-pointer shadow-lg hover:scale-105"
          title="Story suivante (Bas)"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>

      {/* Cadre de la story au ratio 9:16 */}
      <div className="relative aspect-[9/16] w-full max-w-[380px] h-[min(94dvh,680px)] rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-[#12110F] text-white flex flex-col justify-between">
        
        {/* Segments d'avancement des stories en haut */}
        <div className="absolute top-2 inset-x-3 z-30 flex items-center gap-1 pointer-events-none">
          {stories.map((st, idx) => (
            <div 
              key={st.id} 
              className={`h-1 rounded-full flex-1 transition-all duration-300 ${
                idx === currentIndex 
                  ? 'bg-white shadow-xs' 
                  : idx < currentIndex 
                  ? 'bg-white/50' 
                  : 'bg-white/20'
              }`} 
            />
          ))}
        </div>

        {/* En-tête de la Story : Thématique, Auteur et Commandes */}
        <div className="relative z-30 pt-5 px-3 flex items-center justify-between gap-2 pointer-events-auto">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-9 h-9 rounded-full overflow-hidden border border-white/30 shrink-0 bg-stone-800">
              <img 
                src={currentStory.authorAvatar} 
                alt={currentStory.authorName} 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white truncate">
                  {currentStory.authorName}
                </span>
                <span className="px-1.5 py-0.2 rounded-sm bg-[#A2482B] text-[9.5px] font-bold uppercase tracking-wider text-white shrink-0">
                  {currentStory.themeLabel}
                </span>
              </div>
              <p className="text-[10.5px] text-white/70 truncate">
                {currentStory.authorTerritory}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setIsMuted(m => !m)}
              className="w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/20 flex items-center justify-center transition-all cursor-pointer"
              title={isMuted ? 'Activer le son' : 'Couper le son'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-black/50 hover:bg-[#A2482B] text-white border border-white/20 flex items-center justify-center transition-all cursor-pointer"
              title="Fermer la story"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Vidéo ou Image de fond */}
        <div 
          onClick={() => setIsPlaying(p => !p)}
          className="absolute inset-0 z-10 cursor-pointer"
        >
          {currentStory.videoUrl ? (
            <video
              ref={videoRef}
              key={`fullscreen-story-${currentStory.id}`}
              src={currentStory.videoUrl}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <img 
              src={currentStory.authorAvatar} 
              alt={currentStory.authorName} 
              className="w-full h-full object-cover" 
            />
          )}
          {/* Voiles pour contraste */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-black/40 pointer-events-none" />
        </div>

        {/* Bouton Question Flottant à droite */}
        <div className="absolute right-3 bottom-24 z-30 pointer-events-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowQuestionDrawer(prev => !prev);
            }}
            className="w-8.5 h-8.5 rounded-full bg-black/50 hover:bg-[#A2482B] border border-white/20 flex items-center justify-center text-white transition-all shadow-md cursor-pointer"
            title="Consulter l'invitation / question"
          >
            <HelpCircle className="w-4 h-4 text-amber-300" />
          </button>
        </div>

        {/* Tiroir explicatif de la question / invitation */}
        {showQuestionDrawer && (
          <div 
            onClick={e => e.stopPropagation()}
            className="absolute inset-x-0 bottom-16 z-40 bg-white text-stone-900 rounded-2xl p-3.5 mx-3 shadow-2xl border border-stone-200 animate-in slide-in-from-bottom duration-150 space-y-1.5"
          >
            <div className="flex items-center justify-between pb-1 border-b border-stone-100">
              <span className="text-[11px] font-bold text-[#A2482B] uppercase tracking-wider">
                Thématique : {currentStory.themeLabel}
              </span>
              <button 
                onClick={() => setShowQuestionDrawer(false)}
                className="p-0.5 text-stone-400 hover:text-stone-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs font-medium text-stone-800 leading-relaxed italic">
              « {currentStory.question} »
            </p>
          </div>
        )}

        {/* Pied de Story : Titre du récit & Passerelle vers les duos documentaires */}
        <div className="relative z-30 p-4 space-y-2.5 pointer-events-auto">
          <div className="space-y-0.5">
            <span className="text-[10.5px] font-semibold text-amber-300 uppercase tracking-wider block">
              {currentStory.themeLabel}
            </span>
            <h3 className="font-editorial text-lg sm:text-xl font-bold text-white leading-snug drop-shadow-md">
              {currentStory.storyTitle}
            </h3>
          </div>

          {/* PASSERELLE VERS LES DUOS DOCUMENTAIRES (Bouton d'action discret en bas de story) */}
          <button
            onClick={() => onNavigateToDuo(currentStory)}
            className="w-full py-2 px-3.5 rounded-full bg-white/20 hover:bg-[#A2482B] backdrop-blur-md border border-white/30 hover:border-[#A2482B] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg active:scale-95 group"
            title="Découvrir cet auteur dans ses duos documentaires"
          >
            <Film className="w-3.5 h-3.5 text-[#C89B3C] group-hover:text-white" />
            <span className="truncate">
              {currentStory.partnerName 
                ? `Découvrir son duo avec ${currentStory.partnerName.split(' ')[0]}` 
                : 'Découvrir en duo documentaire'}
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-white/80 group-hover:translate-x-0.5 transition-transform shrink-0" />
          </button>
        </div>

      </div>
    </div>
  );
};
