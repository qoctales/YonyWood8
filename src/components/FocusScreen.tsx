import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  X, 
  Volume2, 
  VolumeX,
  Play,
  Scroll
} from 'lucide-react';
import { ViewScreen } from '../types';
import { 
  FOCUS_TOPICS, 
  FocusTopic, 
  FocusSequence, 
  getNextSequentialSequence,
  FOCUS_MAX_TITLE_LENGTH,
  clampFocusTitle
} from '../data/focusTopicsData';
import { ENTERPRISE_STORIES } from '../data/thematicStoriesData';
import { 
  ProfileSoloIcon, 
  TvPlayerIcon,
  DoorArchIcon
} from './YonywoodBrandIcons';
import { ShareIcon } from './ShareIcon';
import { StoriesStudioCoverflow } from './StoriesStudioCoverflow';
import { VideoCardShareModal } from './VideoCardShareModal';
import { celestialAudio } from '../utils/celestialAudio';
import { formatFirstLetterOnly } from '../utils/textFormatters';

interface FocusScreenProps {
  onNavigate?: (screen: ViewScreen) => void;
  initialTopicId?: string;
  selectedCompanyId?: string;
}

export const FocusScreen: React.FC<FocusScreenProps> = ({ 
  onNavigate, 
  initialTopicId, 
  selectedCompanyId 
}) => {
  // 1. Sujet actif
  const [topicIndex, setTopicIndex] = useState<number>(() => {
    const targetId = initialTopicId || selectedCompanyId;
    if (targetId) {
      const idx = FOCUS_TOPICS.findIndex(t => t.id === targetId);
      if (idx !== -1) return idx;
    }
    return 0;
  });

  const currentTopic: FocusTopic = FOCUS_TOPICS[topicIndex] || FOCUS_TOPICS[0];

  // 2. État d'entrée dans le sujet (Affiche d'abord -> Vidéos après clic sur la porte)
  const [isTopicOpened, setIsTopicOpened] = useState<boolean>(false);

  // 3. Modale Papyrus (Présentation textuelle du sujet)
  const [showPapyrusModal, setShowPapyrusModal] = useState<boolean>(false);

  // 4. Séquence active par sujet
  const [sequenceIndices, setSequenceIndices] = useState<Record<string, number>>({});
  const currentSequenceIndex = sequenceIndices[currentTopic.id] || 0;
  const currentSequence: FocusSequence = currentTopic.sequences[currentSequenceIndex] || currentTopic.sequences[0];

  // 5. Lecteur vidéo & Contrôles
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [videoProgress, setVideoProgress] = useState<number>(0);

  // 6. Modale Partage & Stories Coverflow
  const [shareItem, setShareItem] = useState<{ title: string; id: string } | null>(null);
  const [isStoryViewerOpen, setIsStoryViewerOpen] = useState(false);
  const [storyViewerIndex, setStoryViewerIndex] = useState(0);

  // 7. Geste tactile et souris Swipe 2D (horizontal = vidéos dans le sujet, vertical = sujets/thématiques)
  const isMouseDownRef = useRef<boolean>(false);
  const touchStartPos = useRef<{ x: number; y: number; time: number } | null>(null);
  const [swipeOffset, setSwipeOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isSwiping, setIsSwiping] = useState<boolean>(false);
  const lastWheelTime = useRef<number>(0);

  // CHANGEMENT DE SUJET (Swipe Vertical)
  // Lorsqu'on swipe vers le haut, on change de sujet et on arrive toujours sur l'affiche du nouveau sujet
  const handleNextTopic = useCallback(() => {
    const total = FOCUS_TOPICS.length;
    const nextIdx = (topicIndex + 1) % total;
    setTopicIndex(nextIdx);
    setIsTopicOpened(false); // Toujours l'affiche pour le nouveau sujet
    setIsPlaying(false);
    setShowPapyrusModal(false);
    setVideoProgress(0);
    celestialAudio.playOrbSelect();
  }, [topicIndex]);

  const handlePrevTopic = useCallback(() => {
    const total = FOCUS_TOPICS.length;
    const prevIdx = (topicIndex - 1 + total) % total;
    setTopicIndex(prevIdx);
    setIsTopicOpened(false); // Toujours l'affiche pour le nouveau sujet
    setIsPlaying(false);
    setShowPapyrusModal(false);
    setVideoProgress(0);
    celestialAudio.playOrbSelect();
  }, [topicIndex]);

  // CHANGEMENT DE SÉQUENCE VIDÉO (Swipe Horizontal une fois dans le sujet)
  const handleNextSequence = useCallback(() => {
    const total = currentTopic.sequences.length;
    const nextIdx = (currentSequenceIndex + 1) % total;
    setSequenceIndices(prev => ({
      ...prev,
      [currentTopic.id]: nextIdx
    }));
    setVideoProgress(0);
    setIsPlaying(true);
    celestialAudio.playOrbSelect();
  }, [currentTopic, currentSequenceIndex]);

  const handlePrevSequence = useCallback(() => {
    const total = currentTopic.sequences.length;
    const prevIdx = (currentSequenceIndex - 1 + total) % total;
    setSequenceIndices(prev => ({
      ...prev,
      [currentTopic.id]: prevIdx
    }));
    setVideoProgress(0);
    setIsPlaying(true);
    celestialAudio.playOrbSelect();
  }, [currentTopic, currentSequenceIndex]);

  // ENTRER DANS LE SUJET (Clic sur la porte)
  const handleEnterSubject = () => {
    setIsTopicOpened(true);
    setIsPlaying(true);
    celestialAudio.playOrbSelect();
  };

  // Gestion du play / pause de la balise vidéo
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    if (isTopicOpened && isPlaying) {
      vid.play().catch(() => {});
    } else {
      vid.pause();
    }
  }, [isTopicOpened, isPlaying, currentSequenceIndex, topicIndex]);

  // Progression de la vidéo
  const handleTimeUpdate = () => {
    const vid = videoRef.current;
    if (!vid) return;
    const cTime = vid.currentTime;
    const dur = vid.duration || 176;
    setVideoProgress((cTime / dur) * 100);
  };

  // Fin de la vidéo : boucle naturelle sur la prochaine séquence
  const handleVideoEnded = () => {
    handleNextSequence();
  };

  // NAVIGATION CLAVIER (Gauche/Droite = vidéos, Haut/Bas = sujets)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isStoryViewerOpen || shareItem || showPapyrusModal) return;

      if (e.key === 'ArrowRight' && isTopicOpened) {
        e.preventDefault();
        handleNextSequence();
      } else if (e.key === 'ArrowLeft' && isTopicOpened) {
        e.preventDefault();
        handlePrevSequence();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleNextTopic();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        handlePrevTopic();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isStoryViewerOpen, shareItem, showPapyrusModal, isTopicOpened, handleNextSequence, handlePrevSequence, handleNextTopic, handlePrevTopic]);

  // MOLETTE SOURIS (Changement de sujet haut / bas)
  const handleWheel = (e: React.WheelEvent) => {
    const now = Date.now();
    if (now - lastWheelTime.current < 400) return;

    if (Math.abs(e.deltaY) > 30) {
      lastWheelTime.current = now;
      if (e.deltaY > 0) {
        handleNextTopic();
      } else {
        handlePrevTopic();
      }
    }
  };

  // =========================================================================
  // GESTES TACTILES (TOUCH) & SOURIS (DRAG DESKTOP) : SWIPE 2D
  // - Swipe horizontal (gauche ⇄ droite) : Séquences vidéo une fois dans le sujet
  // - Swipe vertical (haut ⇄ bas) : Changement de thématique (affiche de cinéma)
  // =========================================================================

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isStoryViewerOpen || shareItem || showPapyrusModal) return;
    if ((e.target as HTMLElement).closest('button, input, a, [role="button"]')) return;
    const touch = e.touches[0];
    touchStartPos.current = { 
      x: touch.clientX, 
      y: touch.clientY, 
      time: Date.now() 
    };
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartPos.current) return;
    const touch = e.touches[0];
    const dx = touch.clientX - touchStartPos.current.x;
    const dy = touch.clientY - touchStartPos.current.y;

    if (Math.abs(dy) > Math.abs(dx)) {
      // Swipe vertical prédominant : aperçu déplacement vertical de la carte
      setSwipeOffset({ x: 0, y: Math.max(-120, Math.min(120, dy * 0.75)) });
    } else if (isTopicOpened) {
      // Swipe horizontal prédominant : aperçu déplacement horizontal des vidéos
      setSwipeOffset({ x: Math.max(-110, Math.min(110, dx * 0.75)), y: 0 });
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartPos.current) return;
    const currentX = e.changedTouches[0].clientX;
    const currentY = e.changedTouches[0].clientY;
    const deltaX = currentX - touchStartPos.current.x;
    const deltaY = currentY - touchStartPos.current.y;
    const elapsed = Math.max(1, Date.now() - touchStartPos.current.time);

    touchStartPos.current = null;
    setIsSwiping(false);
    setSwipeOffset({ x: 0, y: 0 });

    const velocityY = Math.abs(deltaY) / elapsed;
    const velocityX = Math.abs(deltaX) / elapsed;

    // 1. Déclenchement vertical prédominant : CHANGEMENT DE THÉMATIQUE
    if (Math.abs(deltaY) > Math.abs(deltaX) && (Math.abs(deltaY) > 30 || velocityY > 0.18)) {
      if (deltaY < 0) {
        // Swipe vers le haut -> nouvelle thématique avec sa carte d'affiche
        handleNextTopic();
      } else {
        // Swipe vers le bas -> thématique précédente
        handlePrevTopic();
      }
    } 
    // 2. Déclenchement horizontal prédominant : NAVIGATION VIDÉOS DANS LE SUJET
    else if (isTopicOpened && (Math.abs(deltaX) > 30 || velocityX > 0.18)) {
      if (deltaX < 0) {
        // Swipe de droite à gauche -> vidéo suivante
        handleNextSequence();
      } else {
        // Swipe de gauche à droite -> vidéo précédente
        handlePrevSequence();
      }
    }
  };

  // Drag souris desktop (navigateur web)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isStoryViewerOpen || shareItem || showPapyrusModal) return;
    if ((e.target as HTMLElement).closest('button, input, a, [role="button"]')) return;
    isMouseDownRef.current = true;
    touchStartPos.current = {
      x: e.clientX,
      y: e.clientY,
      time: Date.now()
    };
    setIsSwiping(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDownRef.current || !touchStartPos.current) return;
    const dx = e.clientX - touchStartPos.current.x;
    const dy = e.clientY - touchStartPos.current.y;

    if (Math.abs(dy) > Math.abs(dx)) {
      setSwipeOffset({ x: 0, y: Math.max(-120, Math.min(120, dy * 0.75)) });
    } else if (isTopicOpened) {
      setSwipeOffset({ x: Math.max(-110, Math.min(110, dx * 0.75)), y: 0 });
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isMouseDownRef.current || !touchStartPos.current) return;
    const deltaX = e.clientX - touchStartPos.current.x;
    const deltaY = e.clientY - touchStartPos.current.y;
    const elapsed = Math.max(1, Date.now() - touchStartPos.current.time);

    isMouseDownRef.current = false;
    touchStartPos.current = null;
    setIsSwiping(false);
    setSwipeOffset({ x: 0, y: 0 });

    const velocityY = Math.abs(deltaY) / elapsed;
    const velocityX = Math.abs(deltaX) / elapsed;

    if (Math.abs(deltaY) > Math.abs(deltaX) && (Math.abs(deltaY) > 30 || velocityY > 0.18)) {
      if (deltaY < 0) {
        handleNextTopic();
      } else {
        handlePrevTopic();
      }
    } else if (isTopicOpened && (Math.abs(deltaX) > 30 || velocityX > 0.18)) {
      if (deltaX < 0) {
        handleNextSequence();
      } else {
        handlePrevSequence();
      }
    }
  };

  const handleMouseLeave = () => {
    if (isMouseDownRef.current) {
      isMouseDownRef.current = false;
      touchStartPos.current = null;
      setIsSwiping(false);
      setSwipeOffset({ x: 0, y: 0 });
    }
  };

  // Prénom de la personne pour l'affichage en bas de carte vidéo
  const speakerFirstName = currentSequence.speakerName.split(' ')[0];

  return (
    <div 
      onWheel={handleWheel}
      className="w-full h-full max-h-full pb-20 sm:pb-24 pt-safe overflow-hidden flex flex-col justify-between text-[#1C1917] select-none bg-white relative"
    >
      
      {/* ========================================================================= */}
      {/* 1. EN-TÊTE STORIES : FOND NOIR                                            */}
      {/* ========================================================================= */}
      <div 
        className="w-full shrink-0 z-30 border-none shadow-none rounded-none bg-black"
        style={{ 
          backgroundColor: '#000000'
        }}
      >
        <div className="w-full max-w-3xl mx-auto px-3 sm:px-4 pt-1.5 pb-2 shrink-0 h-[68px] sm:h-[76px] flex items-center overflow-hidden">
          <div 
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'auto' }}
            className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar py-1 px-1 pb-5 -mb-4 w-full overscroll-x-contain touch-pan-x"
          >
            {/* Bouton "+" pour proposer une story */}
            <button 
              type="button"
              onClick={() => onNavigate?.({ type: 'submit_story' })}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#A2482B] hover:bg-[#8A3B22] text-white flex items-center justify-center shrink-0 shadow-xs active:scale-95 transition-transform cursor-pointer mr-0.5"
              title="Créer une story"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
            </button>

            {/* Vignettes Stories avec anneaux blancs nets rehaussés d'une ombre élégante sur fond noir */}
            {ENTERPRISE_STORIES.map((story, idx) => (
              <div
                key={story.id}
                onClick={() => {
                  setStoryViewerIndex(idx);
                  setIsStoryViewerOpen(true);
                  celestialAudio.playOrbSelect();
                }}
                className="cursor-pointer group shrink-0"
                title={`${story.authorName} — ${story.themeLabel}`}
              >
                <div 
                  className="w-[52px] h-[52px] sm:w-14 sm:h-14 rounded-2xl p-0.5 border border-stone-800/80 group-hover:border-[#A2482B] transition-all group-hover:scale-105 bg-stone-900"
                  style={{ boxShadow: 'var(--story-ring-shadow, 0 1px 8px rgba(0, 0, 0, 0.6))' }}
                >
                  <div className="w-full h-full rounded-xl overflow-hidden bg-stone-900 relative">
                    <img 
                      src={story.authorAvatar} 
                      alt={story.authorName} 
                      className="w-full h-full object-cover pointer-events-none" 
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. ZONE CENTRALE : CARTE VERTICALE 9:16 CALIBRÉE COMME SUR DIALOGUE/PORTRAIT*/}
      {/* ========================================================================= */}
      <div className="relative flex-1 flex flex-col items-center justify-center min-h-0 py-1 px-3 sm:px-4 my-auto">
        
        {/* Navigation Web Desktop : Flèche Gauche pour les vidéos (dans le sujet) */}
        {isTopicOpened && (
          <button
            onClick={handlePrevSequence}
            className="hidden md:flex absolute left-4 lg:left-8 z-30 w-10 h-10 rounded-full bg-white/90 hover:bg-[#1C1917] text-stone-800 hover:text-white border border-stone-200 shadow-lg items-center justify-center transition-all cursor-pointer transform hover:scale-105 active:scale-95"
            title="Vidéo précédente (←)"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* Navigation Web Desktop : Flèche Droite pour les vidéos (dans le sujet) */}
        {isTopicOpened && (
          <button
            onClick={handleNextSequence}
            className="hidden md:flex absolute right-4 lg:right-8 z-30 w-10 h-10 rounded-full bg-white/90 hover:bg-[#1C1917] text-stone-800 hover:text-white border border-stone-200 shadow-lg items-center justify-center transition-all cursor-pointer transform hover:scale-105 active:scale-95"
            title="Vidéo suivante (→)"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        {/* ======================================================================= */}
        {/* LA CARTE 9:16 UNIQUE                                                    */}
        {/* ======================================================================= */}
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          className="relative aspect-[9/16] w-[min(calc(100vw-64px),calc((100dvh-230px)*9/16))] max-w-[228px] sm:max-w-[270px] md:max-w-[290px] h-[min(410px,calc(100dvh-230px))] sm:h-[min(480px,calc(100dvh-200px))] md:h-[min(520px,calc(100dvh-180px))] rounded-2xl sm:rounded-3xl overflow-hidden border border-stone-200/90 bg-[#12110F] text-white flex flex-col justify-between select-none shadow-2xl ring-1 ring-white/20 touch-none cursor-grab active:cursor-grabbing"
          style={{
            transform: `translate(${swipeOffset.x}px, ${swipeOffset.y}px)`,
            transition: isSwiping ? 'none' : 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          
          {/* ===================================================================== */}
          {/* EN-TÊTE : TITRE EN HAUT À GAUCHE & LECTEUR/SON EN HAUT À DROITE       */}
          {/* ===================================================================== */}
          <div className="relative z-30 pt-3.5 px-3 flex items-center justify-between gap-1 pointer-events-auto">
            {/* Titre du sujet / entreprise / personnalité en haut à gauche */}
            <div 
              className="inline-flex w-fit items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 shadow-md max-w-[calc(100%-52px)]"
              title={currentTopic.title}
            >
              <span className="font-editorial text-xs font-semibold text-white whitespace-nowrap tracking-wide select-none truncate">
                {clampFocusTitle(formatFirstLetterOnly(currentTopic.title), FOCUS_MAX_TITLE_LENGTH)}
              </span>
            </div>

            {/* Haut à droite : Contrôles de lecture */}
            {isTopicOpened ? (
              /* Dans les vidéos : Le bouton activer le son apparaît à gauche du lecteur lorsqu'il y a lecture */
              <div className="flex items-center gap-1.5">
                {isPlaying && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMuted(m => !m);
                    }}
                    className="w-8.5 h-8.5 rounded-xl bg-black/60 backdrop-blur-md text-white hover:bg-black/80 border border-white/20 flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-95"
                    title={isMuted ? 'Activer le son' : 'Couper le son'}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-white" />}
                  </button>
                )}

                {/* Bouton lecteur (Play / Pause avec l'icône TV) */}
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
                  title={isPlaying ? 'Mettre en pause' : 'Lancer la vidéo'}
                >
                  <TvPlayerIcon className="w-4.5 h-4.5 text-current" />
                </button>
              </div>
            ) : (
              /* Sur l'affiche : icône télé vintage comme sur la capture (sans bouton de lecture actif) */
              <div 
                className="w-8.5 h-8.5 rounded-xl bg-black/60 backdrop-blur-md text-white border border-white/20 flex items-center justify-center shadow-md select-none"
              >
                <TvPlayerIcon className="w-4.5 h-4.5 text-white/90" />
              </div>
            )}
          </div>

          {/* ===================================================================== */}
          {/* ÉTAT 1 : L'AFFICHE DE CINÉMA DU SUJET                                 */}
          {/* Juste une image, pas de texte, le papyrus en bas à gauche, la porte    */}
          {/* en bas à droite, et c'est tout !                                      */}
          {/* ===================================================================== */}
          {!isTopicOpened ? (
            <div className="absolute inset-0 z-10 flex flex-col justify-between overflow-hidden">
              {/* Image d'affiche plein cadre */}
              <div 
                onClick={handleEnterSubject}
                className="absolute inset-0 overflow-hidden cursor-pointer group"
              >
                <img 
                  src={currentTopic.posterUrl} 
                  alt={currentTopic.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />
              </div>

              {/* Barre du bas sur l'affiche : PAPYRUS à gauche, PORTE à droite (sans texte) */}
              <div className="mt-auto relative z-20 px-3.5 pb-4 flex items-center justify-between pointer-events-auto">
                {/* Icône du Papyrus (ouvre la description de ce dont il s'agit) */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowPapyrusModal(true);
                  }}
                  className="w-10 h-10 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-lg transition-transform active:scale-95 cursor-pointer"
                  title="À propos de ce sujet"
                >
                  <Scroll className="w-5 h-5 text-white" />
                </button>

                {/* Icône de la PORTE (entre dans les vidéos du sujet, SANS texte Choisir) */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEnterSubject();
                  }}
                  className="w-10 h-10 rounded-xl bg-black/60 hover:bg-[#A2482B] backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-lg transition-all active:scale-95 cursor-pointer group"
                  title="Entrer dans le sujet"
                >
                  <DoorArchIcon className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>
          ) : (
            /* =================================================================== */
            /* ÉTAT 2 : LES CARTES VIDÉO CLASSIQUES DU SUJET                       */
            /* Boutons portrait et partage sur le côté droit au milieu              */
            /* Prénom en bas à gauche avec barre de lecture en dessous             */
            /* =================================================================== */
            <div className="absolute inset-0 z-10 flex flex-col justify-between overflow-hidden">
              {/* Vidéo de témoignage plein cadre */}
              <div 
                onClick={() => setIsPlaying(p => !p)}
                className="absolute inset-0 overflow-hidden cursor-pointer"
              >
                <video
                  ref={videoRef}
                  key={currentSequence.id}
                  src={(!currentSequence.videoUrl || currentSequence.videoUrl.includes('commondatastorage.googleapis.com')) ? '/sample.mp4' : currentSequence.videoUrl}
                  playsInline
                  autoPlay
                  muted={isMuted}
                  loop
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={handleVideoEnded}
                  className="w-full h-full object-cover pointer-events-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/35 pointer-events-none" />

                {/* Bouton Play au centre si en pause */}
                {!isPlaying && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                    <div className="w-14 h-14 rounded-full bg-black/45 backdrop-blur-md border border-white/25 text-white flex items-center justify-center shadow-2xl transition-transform hover:scale-110">
                      <Play className="w-6 h-6 ml-0.5 fill-white text-white opacity-90" />
                    </div>
                  </div>
                )}
              </div>

              {/* BOUTONS SUR LE CÔTÉ DROIT, AU MILIEU : PORTRAIT ET PARTAGE (comme sur la capture) */}
              <div className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-2.5 pointer-events-auto">
                {/* Bouton Portrait Solo */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate?.({ 
                      type: 'profile', 
                      protagonistId: currentSequence.protagonistId || 'senan-agossa' 
                    });
                  }}
                  className="w-8.5 h-8.5 rounded-xl bg-black/60 backdrop-blur-md text-white hover:bg-[#A2482B] border border-white/15 flex items-center justify-center transition-all cursor-pointer shadow-sm group active:scale-95"
                  title={`Portrait de ${currentSequence.speakerName}`}
                >
                  <ProfileSoloIcon className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                </button>

                {/* Bouton Partager */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShareItem({ 
                      title: `Focus : ${currentTopic.title} — ${currentSequence.speakerName}`, 
                      id: currentSequence.id 
                    });
                  }}
                  className="w-8.5 h-8.5 rounded-xl bg-black/60 backdrop-blur-md text-white hover:bg-[#A2482B] border border-white/15 flex items-center justify-center transition-all cursor-pointer shadow-sm group active:scale-95"
                  title="Partager"
                >
                  <ShareIcon className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                </button>
              </div>

              {/* BAS DE CARTE ÉPURÉ : PRÉNOM EN BAS À GAUCHE & BARRE DE LECTURE EN DESSOUS */}
              <div className="absolute bottom-3.5 sm:bottom-4 left-3.5 sm:left-4 z-20 pointer-events-none flex flex-col items-start">
                <h2 className="font-editorial text-base sm:text-lg font-bold text-white tracking-wide drop-shadow-md truncate max-w-[170px] sm:max-w-[210px] leading-tight">
                  {speakerFirstName}
                </h2>

                {/* La barre de lecture disparaît lorsque le bouton lecture n'est pas activé */}
                <div className="h-2 flex items-center mt-1">
                  <div 
                    className={`w-20 sm:w-24 h-1 bg-white/25 rounded-full overflow-hidden shadow-xs transition-opacity duration-200 ${
                      isPlaying ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <div 
                      className="h-full bg-white transition-all duration-100 rounded-full"
                      style={{ width: `${Math.max(2, Math.min(100, videoProgress))}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. MODALE D'INFORMATION ÉPURÉE (CALQUÉE SUR LA MODALE STUDIO)             */}
      {/* ========================================================================= */}
      {showPapyrusModal && (
        <div 
          onClick={() => setShowPapyrusModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        >
          {/* Largeur strictement égale à celle de la carte vidéo */}
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-[min(calc(100vw-64px),290px)] max-w-[290px] bg-[#FAF7F2] rounded-3xl p-4 sm:p-5 shadow-2xl border border-stone-200 space-y-3 animate-in zoom-in-95 duration-200 text-stone-800"
          >
            {/* Header épuré : Icône Scroll + Catégorie & Titre (fermeture au clic extérieur) */}
            <div className="flex items-center gap-2.5 border-b border-stone-200/80 pb-2.5">
              <div className="w-7.5 h-7.5 rounded-xl bg-[#A2482B]/10 text-[#A2482B] flex items-center justify-center shrink-0">
                <Scroll className="w-3.5 h-3.5" />
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#A2482B]">
                  {currentTopic.category}
                </span>
                <h3 className="font-editorial text-sm sm:text-base font-semibold text-stone-900 leading-snug break-words">
                  {currentTopic.title}
                </h3>
              </div>
            </div>

            {/* Texte de présentation : de quoi il s'agit */}
            <div className="py-1">
              <p className="text-stone-700 text-xs sm:text-[13px] leading-relaxed">
                {currentTopic.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. MODALE STORIES STUDIO COVERFLOW                                         */}
      {/* ========================================================================= */}
      <StoriesStudioCoverflow
        isOpen={isStoryViewerOpen}
        stories={ENTERPRISE_STORIES}
        initialIndex={storyViewerIndex}
        onClose={() => setIsStoryViewerOpen(false)}
      />

      {/* ========================================================================= */}
      {/* 5. MODALE DE PARTAGE                                                      */}
      {/* ========================================================================= */}
      {shareItem && (
        <VideoCardShareModal
          isOpen={true}
          onClose={() => setShareItem(null)}
          title={shareItem.title}
          url={typeof window !== 'undefined' ? `${window.location.origin}/focus?topic=${currentTopic.id}` : ''}
        />
      )}

    </div>
  );
};
