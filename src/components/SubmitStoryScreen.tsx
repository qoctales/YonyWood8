import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Pause,
  Volume2,
  VolumeX,
  DoorOpen,
  Scroll,
  X,
  UploadCloud,
  CheckCircle2,
  ArrowLeft
} from 'lucide-react';
import { ViewScreen } from '../types';
import { STUDIO_PILLARS, StudioPillar, StudioPillarItem } from '../data/studioPillarsData';
import { TvPlayerIcon } from './YonywoodBrandIcons';
import { celestialAudio } from '../utils/celestialAudio';

interface SubmitStoryScreenProps {
  preselectedDocumentaryId?: string;
  initialPillarId?: string;
  initialCastingCategoryId?: string;
  initialFinalChoiceId?: string;
  onNavigate: (screen: ViewScreen) => void;
}

export const SubmitStoryScreen: React.FC<SubmitStoryScreenProps> = ({
  preselectedDocumentaryId,
  initialPillarId,
  initialCastingCategoryId,
  initialFinalChoiceId,
  onNavigate
}) => {
  // 1. Niveau 0 : 4 Portes (Miroir, Casting, Lumière, Portrait)
  const [selectedPillarIndex, setSelectedPillarIndex] = useState(0);
  const [activePillar, setActivePillar] = useState<StudioPillar | null>(null);

  // 2. Niveau 1 : Catégories au sein de la porte
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);

  // 3. Niveau 2 : Uniquement pour Casting -> les 8 sous-catégories de la catégorie choisie
  const [activeCastingCategory, setActiveCastingCategory] = useState<StudioPillarItem | null>(null);
  const [selectedSubThemeIndex, setSelectedSubThemeIndex] = useState(0);

  // 4. Choix final sélectionné -> déclenche l'affichage du Duo de vidéos
  const [selectedFinalChoice, setSelectedFinalChoice] = useState<StudioPillarItem | null>(null);

  // 5. Média vidéo en arrière-plan
  const [playingCardId, setPlayingCardId] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  // 6. Modale Synopsis (Papyrus) - largeur ajustée à la carte vidéo
  const [synopsisModalItem, setSynopsisModalItem] = useState<StudioPillar | StudioPillarItem | null>(null);

  // 7. Modale de téléversement vidéo
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadSuccessToast, setUploadSuccessToast] = useState(false);
  const [uploadedStoryTitle, setUploadedStoryTitle] = useState('');
  const [uploadedStoryAuthor, setUploadedStoryAuthor] = useState('');
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [duoPreviewVideo, setDuoPreviewVideo] = useState<'upload' | 'expert' | null>(null);

  // 8. Toast d'information
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 9. Gestures tactiles rapides et fluides
  const touchStartXRef = useRef<number>(0);
  const touchStartYRef = useRef<number>(0);
  const touchStartTimeRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const [dragOffset, setDragOffset] = useState<number>(0);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  };

  // Pré-sélection éventuelle venant d'une série documentaire externe
  useEffect(() => {
    if (preselectedDocumentaryId) {
      const duoPillar = STUDIO_PILLARS.find(p => p.id === 'duos');
      if (duoPillar) {
        setActivePillar(duoPillar);
        setActiveCastingCategory(null);
        setSelectedFinalChoice(null);
        const matchIdx = duoPillar.items.findIndex(it => it.id === preselectedDocumentaryId);
        if (matchIdx >= 0) setSelectedCategoryIndex(matchIdx);
      }
    }
  }, [preselectedDocumentaryId]);

  // Restauration de l'état précédent après un retour depuis la sélection des vidéastes
  useEffect(() => {
    if (initialFinalChoiceId) {
      let foundPillar = STUDIO_PILLARS.find(p => p.id === initialPillarId);
      let foundCastingCat: StudioPillarItem | undefined;
      let foundItem: StudioPillarItem | undefined;

      for (const pillar of STUDIO_PILLARS) {
        for (const item of pillar.items) {
          if (item.id === initialFinalChoiceId) {
            foundItem = item;
            if (!foundPillar) foundPillar = pillar;
            break;
          }
          if (item.subCategories) {
            for (const sub of item.subCategories) {
              if (sub.id === initialFinalChoiceId) {
                foundItem = sub;
                foundCastingCat = item;
                if (!foundPillar) foundPillar = pillar;
                break;
              }
            }
          }
        }
        if (foundItem) break;
      }

      if (foundPillar) setActivePillar(foundPillar);
      if (foundCastingCat) setActiveCastingCategory(foundCastingCat);
      if (foundItem) setSelectedFinalChoice(foundItem);
    }
  }, [initialFinalChoiceId, initialPillarId, initialCastingCategoryId]);

  // Détermination du niveau hiérarchique actif
  const isLevel0 = !activePillar && !selectedFinalChoice;
  const isLevel1 = activePillar !== null && !activeCastingCategory && !selectedFinalChoice;
  const isLevel2 = activePillar?.id === 'itinerant' && activeCastingCategory !== null && !selectedFinalChoice;

  // Liste et index actifs selon le niveau
  const currentList: (StudioPillar | StudioPillarItem)[] = isLevel2
    ? (activeCastingCategory?.subCategories || [])
    : isLevel1
      ? activePillar.items
      : STUDIO_PILLARS;

  const currentIndex = isLevel2
    ? selectedSubThemeIndex
    : isLevel1
      ? selectedCategoryIndex
      : selectedPillarIndex;

  const setCurrentIndex = isLevel2
    ? setSelectedSubThemeIndex
    : isLevel1
      ? setSelectedCategoryIndex
      : setSelectedPillarIndex;

  // Actions de navigation hiérarchique
  const handleSelectPillar = (pillar: StudioPillar) => {
    setActivePillar(pillar);
    setSelectedCategoryIndex(0);
    setActiveCastingCategory(null);
    setSelectedSubThemeIndex(0);
    setSelectedFinalChoice(null);
    setPlayingCardId(null);
    celestialAudio?.playOrbSelect?.();
  };

  const handleSelectCastingCategory = (categoryItem: StudioPillarItem) => {
    if (categoryItem.subCategories && categoryItem.subCategories.length > 0) {
      setActiveCastingCategory(categoryItem);
      setSelectedSubThemeIndex(0);
      setSelectedFinalChoice(null);
      setPlayingCardId(null);
      celestialAudio?.playOrbSelect?.();
    } else {
      handleSelectFinalChoice(categoryItem);
    }
  };

  const handleSelectFinalChoice = (item: StudioPillarItem) => {
    setSelectedFinalChoice(item);
    setPlayingCardId(null);
    setDuoPreviewVideo(null);
    celestialAudio?.playOrbSelect?.();
  };

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

  // Navigation clavier flèches gauche / droite / Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (synopsisModalItem || uploadModalOpen) {
        if (e.key === 'Escape') {
          setSynopsisModalItem(null);
          setUploadModalOpen(false);
        }
        return;
      }

      if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'ArrowLeft') {
        goToPrev();
      } else if (e.key === 'Escape') {
        if (selectedFinalChoice) {
          setSelectedFinalChoice(null);
          setDuoPreviewVideo(null);
        } else if (activeCastingCategory) {
          setActiveCastingCategory(null);
          setPlayingCardId(null);
        } else if (activePillar) {
          setActivePillar(null);
          setPlayingCardId(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrev, activePillar, activeCastingCategory, selectedFinalChoice, synopsisModalItem, uploadModalOpen]);

  // Gestion des événements tactiles
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

  // Gestion souris (drag desktop)
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
      {/* 1. EN-TÊTE HARMONISÉ AVEC FIL D'ARIANE SELON LE NIVEAU ACTIF              */}
      {/* ========================================================================= */}
      <div className="relative flex items-center justify-between h-8 sm:h-10 shrink-0 gap-2 mb-0.5 sm:mb-1">
        <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0 flex-1 h-full">
          {/* Niveau 0 : 4 portes pour partager son histoire */}
          {isLevel0 && (
            <div className="relative flex items-center h-full overflow-visible">
              <h1 className="font-editorial text-xs sm:text-sm md:text-base font-semibold text-[#1C1917] tracking-normal leading-none whitespace-nowrap pr-2">
                4 portes pour partager son histoire
              </h1>
              <div className="absolute left-0 -bottom-1.5 w-8 h-0.5 bg-[#A2482B] rounded-full" />
            </div>
          )}

          {/* Niveau 1 : 4 Portes › Nom de la Porte */}
          {isLevel1 && activePillar && (
            <div className="flex items-center gap-1.5 sm:gap-2 h-full min-w-0">
              <button
                onClick={() => {
                  setActivePillar(null);
                  setActiveCastingCategory(null);
                  setSelectedFinalChoice(null);
                  setPlayingCardId(null);
                }}
                className="font-normal text-stone-500 hover:text-stone-900 transition-colors cursor-pointer flex items-center gap-1 group py-1 shrink-0"
                title="Revenir aux 4 Portes"
              >
                <ChevronLeft className="w-4 h-4 text-stone-400 group-hover:text-stone-700 group-hover:-translate-x-0.5 transition-transform" />
                <span className="text-xs sm:text-sm">4 Portes</span>
              </button>

              <span className="text-stone-300 font-light text-xs" aria-hidden="true">›</span>

              <div className="relative flex items-center h-full overflow-visible">
                <span className="font-editorial text-xs sm:text-sm md:text-base font-semibold text-[#1C1917] tracking-normal leading-none whitespace-nowrap pr-2 select-none">
                  {activePillar.title}
                </span>
                <div className="absolute left-0 -bottom-1.5 w-8 h-0.5 bg-[#A2482B] rounded-full" />
              </div>
            </div>
          )}

          {/* Niveau 2 : 4 Portes › Casting › Catégorie */}
          {isLevel2 && activePillar && activeCastingCategory && (
            <div className="flex items-center gap-1.5 sm:gap-2 h-full min-w-0">
              <button
                onClick={() => {
                  setActivePillar(null);
                  setActiveCastingCategory(null);
                  setSelectedFinalChoice(null);
                  setPlayingCardId(null);
                }}
                className="font-normal text-stone-500 hover:text-stone-900 transition-colors cursor-pointer items-center gap-1 group py-1 shrink-0 hidden sm:flex"
                title="Revenir aux 4 Portes"
              >
                <span className="text-xs">4 Portes</span>
              </button>

              <span className="text-stone-300 font-light text-xs hidden sm:inline" aria-hidden="true">›</span>

              <button
                onClick={() => {
                  setActiveCastingCategory(null);
                  setSelectedFinalChoice(null);
                  setPlayingCardId(null);
                }}
                className="font-normal text-stone-500 hover:text-stone-900 transition-colors cursor-pointer flex items-center gap-1 group py-1 shrink-0"
                title="Revenir aux catégories Casting"
              >
                <ChevronLeft className="w-4 h-4 text-stone-400 group-hover:text-stone-700 group-hover:-translate-x-0.5 transition-transform" />
                <span className="text-xs sm:text-sm font-medium">Casting</span>
              </button>

              <span className="text-stone-300 font-light text-xs" aria-hidden="true">›</span>

              <div className="relative flex items-center h-full overflow-visible">
                <span className="font-editorial text-xs sm:text-sm md:text-base font-semibold text-[#1C1917] tracking-normal leading-none whitespace-nowrap pr-2 select-none">
                  {activeCastingCategory.title}
                </span>
                <div className="absolute left-0 -bottom-1.5 w-8 h-0.5 bg-[#A2482B] rounded-full" />
              </div>
            </div>
          )}

          {/* Niveau Duo de vidéos (Option finale choisie) */}
          {selectedFinalChoice && (
            <div className="flex items-center gap-1.5 sm:gap-2 h-full min-w-0">
              <button
                onClick={() => {
                  setSelectedFinalChoice(null);
                  setDuoPreviewVideo(null);
                }}
                className="font-normal text-stone-500 hover:text-stone-900 transition-colors cursor-pointer flex items-center gap-1 group py-1 shrink-0"
                title="Changer de thématique"
              >
                <ArrowLeft className="w-4 h-4 text-stone-400 group-hover:text-stone-700 group-hover:-translate-x-0.5 transition-transform" />
                <span className="text-xs sm:text-sm font-medium">Changer de thématique</span>
              </button>

              <span className="text-stone-300 font-light text-xs" aria-hidden="true">›</span>

              <div className="relative flex items-center h-full overflow-visible">
                <span className="font-editorial text-xs sm:text-sm md:text-base font-semibold text-[#1C1917] tracking-normal leading-none whitespace-nowrap pr-2 select-none">
                  {selectedFinalChoice.title}
                </span>
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
      {/* 2. ZONE CENTRALE : DUO DE VIDÉOS CENTRÉ (AUCUN TEXTE ENCOMBRANT)          */}
      {/* ========================================================================= */}
      {selectedFinalChoice ? (
        <div className="relative flex-1 flex flex-col justify-center items-center w-full min-h-0 py-2 sm:py-3 animate-in fade-in duration-200">
          <div className="w-full max-w-2xl flex items-center justify-center h-full max-h-[540px]">
            {/* DUO DE VIDÉOS FACE-À-FACE CENTRÉ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full max-w-[620px] justify-items-center">
              
              {/* CARTE 1 : TÉLÉCHARGER SA VIDÉO */}
              <div 
                className="relative aspect-[9/16] w-[min(calc(100vw-64px),calc((100dvh-230px)*9/16))] max-w-[228px] sm:max-w-[270px] md:max-w-[290px] h-[min(410px,calc(100dvh-230px))] sm:h-[min(480px,calc(100dvh-200px))] md:h-[min(520px,calc(100dvh-180px))] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between p-3 sm:p-4 bg-[#151513] text-white border border-stone-200/90 group"
              >
                {/* Image selfie vidéo afro-futuriste OU Vidéo si lecture */}
                {duoPreviewVideo === 'upload' ? (
                  <video
                    src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
                    autoPlay
                    loop
                    playsInline
                    muted={isMuted}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src="/assets/images/selfie_video_story.jpg"
                    alt="Télécharger sa vidéo"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.onerror = null;
                      target.src = '/src/assets/images/selfie_video_story_1792918744207.jpg';
                    }}
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none group-hover:scale-105 transition-transform duration-500"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/85 pointer-events-none" />

                {/* Haut de carte : Titre à gauche + Lecteur & Mute à droite */}
                <div className="relative z-10 flex items-center justify-between w-full min-w-0">
                  <span className="inline-flex items-center px-2.5 sm:px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-[10px] sm:text-[11px] font-semibold text-white tracking-wide shadow-sm shrink-0 whitespace-nowrap leading-none select-none max-w-[calc(100%-80px)] truncate">
                    Télécharger sa vidéo
                  </span>
                  
                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Icône mute si vidéo active */}
                    {duoPreviewVideo === 'upload' && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsMuted(prev => !prev);
                        }}
                        className="w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-full bg-black/50 hover:bg-[#A2482B] active:bg-[#8A3B22] backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
                        title={isMuted ? 'Activer le son' : 'Couper le son'}
                      >
                        {isMuted ? <VolumeX className="w-3.5 h-3.5 text-white" /> : <Volume2 className="w-3.5 h-3.5 text-white" />}
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setDuoPreviewVideo(prev => prev === 'upload' ? null : 'upload')}
                      className="w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-xl bg-black/55 hover:bg-[#A2482B] active:bg-[#8A3B22] text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-200 cursor-pointer shadow-md hover:scale-105 active:scale-95"
                      title={duoPreviewVideo === 'upload' ? "Arrêter la vidéo" : "Visionner l'exemple"}
                    >
                      {duoPreviewVideo === 'upload' ? (
                        <Pause className="w-3.5 h-3.5 fill-white text-white" />
                      ) : (
                        <TvPlayerIcon className="w-4 h-4 text-white" strokeWidth={1.7} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Bas de carte : Uniquement le bouton Choisir en bas à droite */}
                <div className="relative z-10 w-full flex items-center justify-end pointer-events-auto pt-2">
                  <button
                    type="button"
                    onClick={() => setUploadModalOpen(true)}
                    className="px-3 py-1.5 sm:py-2 rounded-xl bg-black/50 hover:bg-[#A2482B] active:bg-[#8A3B22] text-white font-medium text-xs sm:text-[12px] shadow-md flex items-center gap-1.5 transition-all duration-200 cursor-pointer border border-white/20 hover:border-[#A2482B] backdrop-blur-md hover:scale-105 active:scale-95"
                  >
                    <DoorOpen className="w-3.5 h-3.5 text-white/90" />
                    <span>Choisir</span>
                  </button>
                </div>
              </div>

              {/* CARTE 2 : CHOISIR UN EXPERT */}
              <div 
                className="relative aspect-[9/16] w-[min(calc(100vw-64px),calc((100dvh-230px)*9/16))] max-w-[228px] sm:max-w-[270px] md:max-w-[290px] h-[min(410px,calc(100dvh-230px))] sm:h-[min(480px,calc(100dvh-200px))] md:h-[min(520px,calc(100dvh-180px))] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between p-3 sm:p-4 bg-[#151513] text-white border border-stone-200/90 group"
              >
                {/* Image personne filmée par un pro OU Vidéo si lecture */}
                {duoPreviewVideo === 'expert' ? (
                  <video
                    src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
                    autoPlay
                    loop
                    playsInline
                    muted={isMuted}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src="/assets/images/pro_shoot_story.jpg"
                    alt="Choisir un expert"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.onerror = null;
                      target.src = '/src/assets/images/pro_shoot_story_1792918744384.jpg';
                    }}
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none group-hover:scale-105 transition-transform duration-500"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/85 pointer-events-none" />

                {/* Haut de carte : Titre à gauche + Lecteur & Mute à droite */}
                <div className="relative z-10 flex items-center justify-between w-full min-w-0">
                  <span className="inline-flex items-center px-2.5 sm:px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-[10px] sm:text-[11px] font-semibold text-white tracking-wide shadow-sm shrink-0 whitespace-nowrap leading-none select-none max-w-[calc(100%-80px)] truncate">
                    Choisir un expert
                  </span>
                  
                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Icône mute si vidéo active */}
                    {duoPreviewVideo === 'expert' && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsMuted(prev => !prev);
                        }}
                        className="w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-full bg-black/50 hover:bg-[#A2482B] active:bg-[#8A3B22] backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
                        title={isMuted ? 'Activer le son' : 'Couper le son'}
                      >
                        {isMuted ? <VolumeX className="w-3.5 h-3.5 text-white" /> : <Volume2 className="w-3.5 h-3.5 text-white" />}
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setDuoPreviewVideo(prev => prev === 'expert' ? null : 'expert')}
                      className="w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-xl bg-black/55 hover:bg-[#A2482B] active:bg-[#8A3B22] text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-200 cursor-pointer shadow-md hover:scale-105 active:scale-95"
                      title={duoPreviewVideo === 'expert' ? "Arrêter la vidéo" : "Visionner l'exemple"}
                    >
                      {duoPreviewVideo === 'expert' ? (
                        <Pause className="w-3.5 h-3.5 fill-white text-white" />
                      ) : (
                        <TvPlayerIcon className="w-4 h-4 text-white" strokeWidth={1.7} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Bas de carte : Uniquement le bouton Choisir en bas à droite */}
                <div className="relative z-10 w-full flex items-center justify-end pointer-events-auto pt-2">
                  <button
                    type="button"
                    onClick={() => onNavigate({ 
                      type: 'request_videographer',
                      returnPillarId: activePillar?.id,
                      returnCastingCategoryId: activeCastingCategory?.id,
                      returnFinalChoiceId: selectedFinalChoice?.id
                    })}
                    className="px-3 py-1.5 sm:py-2 rounded-xl bg-black/50 hover:bg-[#A2482B] active:bg-[#8A3B22] text-white font-medium text-xs sm:text-[12px] shadow-md flex items-center gap-1.5 transition-all duration-200 cursor-pointer border border-white/20 hover:border-[#A2482B] backdrop-blur-md hover:scale-105 active:scale-95"
                  >
                    <DoorOpen className="w-3.5 h-3.5 text-white/90" />
                    <span>Choisir</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* 3. ZONE CENTRALE : CARROUSEL 3D DES PORTES / CATÉGORIES / SOUS-CATÉGORIES */
        /* ========================================================================= */
        <div 
          className="relative flex-1 flex flex-col items-center justify-center min-h-0 py-1 sm:py-2 select-none overflow-hidden touch-pan-y"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
        >
          {/* Flèche Gauche */}
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
                const n = currentList.length;
                const rawDiff = (idx - currentIndex) % n;
                const diff = rawDiff > n / 2 ? rawDiff - n : rawDiff < -n / 2 ? rawDiff + n : rawDiff;
                const isCenter = diff === 0;

                let transformStyle = '';
                let zIndex = 10;
                let opacity = 0;
                let pointerEvents: 'auto' | 'none' = 'none';

                if (diff === 0) {
                  // Carte active au centre
                  transformStyle = `translateX(${dragOffset}px) translateZ(60px) rotateY(${dragOffset * -0.15}deg) scale(1)`;
                  zIndex = 30;
                  opacity = 1;
                  pointerEvents = 'auto';
                } else if (diff === 1) {
                  // Carte voisine droite
                  transformStyle = `translateX(calc(55% + ${dragOffset}px)) translateZ(-60px) rotateY(-26deg) scale(0.86)`;
                  zIndex = 20;
                  opacity = 0.75;
                  pointerEvents = 'auto';
                } else if (diff === -1) {
                  // Carte voisine gauche
                  transformStyle = `translateX(calc(-55% + ${dragOffset}px)) translateZ(-60px) rotateY(26deg) scale(0.86)`;
                  zIndex = 20;
                  opacity = 0.75;
                  pointerEvents = 'auto';
                } else if (diff === 2) {
                  // Carte droite plus éloignée
                  transformStyle = `translateX(calc(100% + ${dragOffset}px)) translateZ(-140px) rotateY(-40deg) scale(0.72)`;
                  zIndex = 10;
                  opacity = 0.35;
                  pointerEvents = 'auto';
                } else if (diff === -2) {
                  // Carte gauche plus éloignée
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
                const castingItem = item as StudioPillarItem;
                const hasSubCategories = isLevel1 && activePillar?.id === 'itinerant' && castingItem.subCategories && castingItem.subCategories.length > 0;

                return (
                  <div
                    key={`carousel-card-${item.id}`}
                    onClick={() => {
                      if (isCenter) {
                        if (isLevel0) {
                          handleSelectPillar(item as StudioPillar);
                        } else if (isLevel1 && activePillar?.id === 'itinerant') {
                          handleSelectCastingCategory(item as StudioPillarItem);
                        } else {
                          // Pour les feuilles terminales (Miroir, Lumière, Portrait ou sous-thème Casting)
                          handleSelectFinalChoice(item as StudioPillarItem);
                        }
                      } else {
                        // Clic sur une carte latérale : la faire pivoter immédiatement au centre
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
                    className={`absolute aspect-[9/16] w-[min(calc(100vw-64px),calc((100dvh-230px)*9/16))] max-w-[228px] sm:max-w-[270px] md:max-w-[290px] h-[min(410px,calc(100dvh-230px))] sm:h-[min(480px,calc(100dvh-200px))] md:h-[min(520px,calc(100dvh-180px))] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between p-3 sm:p-4 cursor-pointer select-none bg-[#151513] text-white border transition-colors ${
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
                        muted={isMuted}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={item.posterUrl}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.onerror = null;
                          target.src = '/assets/images/pillar_casting_phoenix.png';
                        }}
                        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                      />
                    )}

                    {/* Voile cinématographique pour une visibilité optimale */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/85 pointer-events-none" />

                    {/* ========================================================= */}
                    {/* HAUT : Badge Titre à gauche + Télévision lecteur à droite */}
                    {/* ========================================================= */}
                    <div className="relative z-10 flex items-center justify-between gap-1.5 pointer-events-auto w-full min-w-0">
                      <span 
                        className="inline-flex items-center px-2.5 sm:px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-[10px] sm:text-[11px] font-semibold tracking-wide text-white shadow-sm shrink-0 whitespace-nowrap leading-none select-none max-w-[calc(100%-80px)] truncate"
                        title={item.title}
                      >
                        {item.title}
                      </span>

                      {/* Déclencheur lecteur vidéo « Petite Télé » en haut à droite */}
                      <div 
                        className="flex items-center gap-1.5 shrink-0"
                        onMouseDown={(e) => e.stopPropagation()}
                        onTouchStart={(e) => e.stopPropagation()}
                      >
                        {/* Bouton Muet discret (si vidéo en cours) */}
                        {isPlaying && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setIsMuted((prev) => !prev);
                            }}
                            onMouseDown={(e) => e.stopPropagation()}
                            onTouchStart={(e) => e.stopPropagation()}
                            className="w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-full bg-black/50 hover:bg-[#A2482B] active:bg-[#8A3B22] backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
                            title={isMuted ? 'Activer le son' : 'Couper le son'}
                          >
                            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-white" /> : <Volume2 className="w-3.5 h-3.5 text-white" />}
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (!isCenter) {
                              setCurrentIndex(idx);
                            } else {
                              setPlayingCardId(isPlaying ? null : item.id);
                            }
                          }}
                          onMouseDown={(e) => e.stopPropagation()}
                          onTouchStart={(e) => e.stopPropagation()}
                          className="w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-xl bg-black/55 hover:bg-[#A2482B] active:bg-[#8A3B22] text-white backdrop-blur-md border border-white/20 hover:border-[#A2482B] flex items-center justify-center transition-all duration-200 cursor-pointer shadow-md hover:scale-105 active:scale-95 shrink-0"
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

                    {/* ========================================================= */}
                    {/* BAS : ÉPURÉ (Pas de texte encombrant)                      */}
                    {/* À gauche : Papyrus (synopsis)                             */}
                    {/* À droite : Bouton discret « Choisir » avec icône de porte */}
                    {/* ========================================================= */}
                    <div 
                      className="relative z-10 w-full flex items-center justify-between pointer-events-auto pt-2"
                      onMouseDown={(e) => e.stopPropagation()}
                      onTouchStart={(e) => e.stopPropagation()}
                    >
                      {/* GROUPE GAUCHE : Uniquement le Papyrus pour le synopsis */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSynopsisModalItem(item);
                            celestialAudio?.playOrbSelect?.();
                          }}
                          className="w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-xl bg-black/50 hover:bg-[#A2482B] active:bg-[#8A3B22] text-white backdrop-blur-md border border-white/20 hover:border-[#A2482B] flex items-center justify-center transition-all duration-200 cursor-pointer shadow-md hover:scale-105 active:scale-95"
                          title="Lire le synopsis"
                        >
                          <Scroll className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                        </button>
                      </div>

                      {/* GROUPE DROIT : Bouton discret « Choisir » avec icône porte */}
                      <div>
                        {/* 1. Niveau 0 : Choisir */}
                        {isLevel0 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              if (!isCenter) {
                                setCurrentIndex(idx);
                              } else {
                                handleSelectPillar(item as StudioPillar);
                              }
                            }}
                            className="px-3 py-1.5 sm:py-2 rounded-xl bg-black/50 hover:bg-[#A2482B] active:bg-[#8A3B22] text-white font-medium text-xs sm:text-[12px] shadow-md flex items-center gap-1.5 transition-all duration-200 cursor-pointer border border-white/20 hover:border-[#A2482B] backdrop-blur-md hover:scale-105 active:scale-95"
                          >
                            <DoorOpen className="w-3.5 h-3.5 text-white/90" />
                            <span>Choisir</span>
                          </button>
                        )}

                        {/* 2. Niveau 1 (Casting avec sous-catégories) : Choisir */}
                        {hasSubCategories && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              if (!isCenter) {
                                setCurrentIndex(idx);
                              } else {
                                handleSelectCastingCategory(item as StudioPillarItem);
                              }
                            }}
                            className="px-3 py-1.5 sm:py-2 rounded-xl bg-black/50 hover:bg-[#A2482B] active:bg-[#8A3B22] text-white font-medium text-xs sm:text-[12px] shadow-md flex items-center gap-1.5 transition-all duration-200 cursor-pointer border border-white/20 hover:border-[#A2482B] backdrop-blur-md hover:scale-105 active:scale-95"
                          >
                            <DoorOpen className="w-3.5 h-3.5 text-white/90" />
                            <span>Choisir</span>
                          </button>
                        )}

                        {/* 3. Choix final (Miroir, Lumière, Portrait ou sous-thématiques Casting) */}
                        {(!isLevel0 && !hasSubCategories) && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              if (!isCenter) {
                                setCurrentIndex(idx);
                              } else {
                                handleSelectFinalChoice(item as StudioPillarItem);
                              }
                            }}
                            className="px-3 py-1.5 sm:py-2 rounded-xl bg-black/50 hover:bg-[#A2482B] active:bg-[#8A3B22] text-white font-medium text-xs sm:text-[12px] shadow-md flex items-center gap-1.5 transition-all duration-200 cursor-pointer border border-white/20 hover:border-[#A2482B] backdrop-blur-md hover:scale-105 active:scale-95"
                          >
                            <DoorOpen className="w-3.5 h-3.5 text-white/90" />
                            <span>Choisir</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Flèche Droite */}
          <button
            onClick={goToNext}
            className="flex absolute right-1 sm:right-3 lg:right-6 z-40 w-8.5 h-8.5 sm:w-11 sm:h-11 rounded-full bg-white/95 hover:bg-[#A2482B] text-[#1C1917] hover:text-white border border-[#E7E5E4] hover:border-[#A2482B] shadow-lg items-center justify-center transition-all cursor-pointer transform hover:scale-105 active:scale-95"
            title="Suivant"
            id="next-carousel-btn"
          >
            <ChevronRight className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. MODALE SYNOPSIS ÉPURÉE (LARGEUR CALQUÉE SUR LA CARTE VIDÉO)           */}
      {/* ========================================================================= */}
      {synopsisModalItem && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSynopsisModalItem(null)}
        >
          {/* Largeur strictement égale à la largeur d'une carte vidéo */}
          <div 
            className="w-[min(calc(100vw-64px),290px)] max-w-[290px] bg-[#FAF7F2] rounded-3xl p-4 sm:p-5 shadow-2xl border border-stone-200 space-y-3 animate-in zoom-in-95 duration-200 text-stone-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header épuré : Papyrus + Titre + Croix fermer discrète */}
            <div className="flex items-center justify-between gap-2 border-b border-stone-200 pb-2.5">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <div className="w-7.5 h-7.5 rounded-xl bg-[#A2482B]/10 text-[#A2482B] flex items-center justify-center shrink-0">
                  <Scroll className="w-3.5 h-3.5" />
                </div>
                <h3 className="font-editorial text-sm sm:text-base font-semibold text-stone-900 truncate">
                  {synopsisModalItem.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSynopsisModalItem(null)}
                className="w-7 h-7 rounded-full bg-stone-200/70 hover:bg-stone-300 text-stone-700 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                title="Fermer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Corps du synopsis naturel (pas de fioritures ni boutons lourds) */}
            <div className="py-1">
              <p className="text-stone-700 text-xs sm:text-[13px] leading-relaxed">
                {synopsisModalItem.subtitle}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. MODALE DE TÉLÉVERSEMENT VIDÉO (TÉLÉCHARGER SA VIDÉO)                  */}
      {/* ========================================================================= */}
      {uploadModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setUploadModalOpen(false)}
        >
          <div 
            className="w-full max-w-lg bg-[#FAF7F2] rounded-3xl p-5 sm:p-6 shadow-2xl border border-stone-200 space-y-4 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 border-b border-stone-200 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-[#A2482B]/10 text-[#A2482B] flex items-center justify-center shrink-0">
                  <UploadCloud className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-[10.5px] font-semibold uppercase tracking-wider text-[#A2482B]">
                    Studio de contribution
                  </span>
                  <h3 className="font-editorial text-base sm:text-lg font-semibold text-stone-900 leading-tight">
                    Téléverser votre vidéo • {selectedFinalChoice?.title}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setUploadModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-200/70 hover:bg-stone-300 text-stone-700 flex items-center justify-center transition-colors cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Zone de drop du fichier */}
            <div className="border-2 border-dashed border-stone-300 hover:border-[#A2482B] rounded-2xl p-6 text-center bg-white cursor-pointer transition-colors relative">
              <input 
                type="file" 
                accept="video/mp4,video/quicktime,video/webm"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setSelectedFileName(e.target.files[0].name);
                  }
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <UploadCloud className="w-8 h-8 text-[#A2482B] mx-auto mb-2" />
              {selectedFileName ? (
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-stone-900">{selectedFileName}</p>
                  <p className="text-[11px] text-green-600 font-medium">Fichier vidéo sélectionné avec succès</p>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-stone-700">
                    Glissez votre fichier vidéo ici ou <span className="text-[#A2482B] underline">parcourez vos fichiers</span>
                  </p>
                  <p className="text-[10.5px] text-stone-400">
                    Format vertical 9:16 recommandé (MP4, MOV jusqu’à 500 Mo)
                  </p>
                </div>
              )}
            </div>

            {/* Formulaire complémentaire */}
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  Titre ou sujet de votre vidéo
                </label>
                <input
                  type="text"
                  value={uploadedStoryTitle}
                  onChange={(e) => setUploadedStoryTitle(e.target.value)}
                  placeholder={`Ex: Mon témoignage sur ${selectedFinalChoice?.title || 'mon parcours'}`}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#A2482B]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  Votre nom / prénom ou pseudonyme
                </label>
                <input
                  type="text"
                  value={uploadedStoryAuthor}
                  onChange={(e) => setUploadedStoryAuthor(e.target.value)}
                  placeholder="Ex: Kwame D., Cotonou"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#A2482B]"
                />
              </div>
            </div>

            {/* Rappel bienveillant */}
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-900 leading-snug">
              Votre vidéo sera vérifiée par le comité de la forêt avant sa publication officielle dans les duos et miroirs.
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-2 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setUploadModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-semibold cursor-pointer transition-colors"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => {
                  setUploadModalOpen(false);
                  setUploadSuccessToast(true);
                  setSelectedFileName(null);
                  setUploadedStoryTitle('');
                  setUploadedStoryAuthor('');
                  setTimeout(() => {
                    setUploadSuccessToast(false);
                  }, 3500);
                }}
                className="px-5 py-2 rounded-xl bg-[#A2482B] hover:bg-[#8A3B22] text-white text-xs font-semibold cursor-pointer transition-colors shadow-md flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Envoyer ma vidéo</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast de succès téléversement */}
      {uploadSuccessToast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-[#1C1917] text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-2xl border border-stone-700 flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Vidéo envoyée avec succès au comité de révision !</span>
        </div>
      )}

      {/* Toast d'information temporaire */}
      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-[#A2482B] text-white text-xs font-semibold py-2 px-4 rounded-xl shadow-xl animate-in fade-in duration-150">
          {toastMessage}
        </div>
      )}

    </div>
  );
};
