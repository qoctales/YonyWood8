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
  ArrowLeft,
  Check,
  AtSign
} from 'lucide-react';
import { ViewScreen } from '../types';
import { STUDIO_PILLARS, StudioPillar, StudioPillarItem } from '../data/studioPillarsData';
import { DOCUMENTARIES } from '../data/mockData';
import { TvPlayerIcon } from './YonywoodBrandIcons';
import { celestialAudio } from '../utils/celestialAudio';

export interface TaggedCollaborator {
  id: string;
  name: string;
  handle: string;
  role: string;
  avatarUrl?: string;
}

export interface PlatformMember {
  id: string;
  name: string;
  handle: string;
  role: string;
  avatarUrl?: string;
  category: 'realisation' | 'protagoniste' | 'post_production' | 'tous';
}

export const PLATFORM_MEMBERS: PlatformMember[] = [
  // Équipe et créateurs
  { id: 'usr-romeo', name: 'Romeo Nonvide', handle: '@romeo', role: 'Fondateur & Réalisateur', avatarUrl: '/assets/images/romeo_avatar_1792698425983.jpg', category: 'realisation' },
  { id: 'v-armel', name: 'Armel Hounkpatin', handle: '@armel_h', role: 'Cadreur & Réalisateur documentaire', avatarUrl: '/assets/protagonists/armel-hounkpatin.jpg', category: 'realisation' },
  { id: 'v-amara', name: 'Amara Traoré', handle: '@amara_t', role: 'Cadreuse & Documentariste', avatarUrl: '/assets/protagonists/amara-tisserande.jpg', category: 'realisation' },
  { id: 'v-kwame', name: 'Kwame Mensah', handle: '@kwame_m', role: 'Réalisateur & Chef opérateur', avatarUrl: '/assets/duos/kwame-mensah.jpg', category: 'realisation' },
  { id: 'v-koffi', name: 'Koffi Badou', handle: '@koffi_b', role: 'Chef opérateur & Cadreur', avatarUrl: '/assets/duos/chef-koffi.jpg', category: 'realisation' },
  { id: 'v-sarah', name: 'Sarah Lawson', handle: '@sarah_l', role: 'Cadreuse & Documentariste nomade', avatarUrl: '/assets/protagonists/eleonore-vance.jpg', category: 'realisation' },
  { id: 'v-helene', name: 'Hélène Saint-Amand', handle: '@helene_sa', role: 'Réalisatrice de création', avatarUrl: '/assets/protagonists/helene-saint-amand.jpg', category: 'realisation' },

  // Protagonistes inscrits
  { id: 'p-mahougnon', name: 'Mahougnon Zounon', handle: '@mahougnon_z', role: 'Gardien Vodun Rays', avatarUrl: '/assets/duos/mahougnon_esu_portrait_1791701582891.jpg', category: 'protagoniste' },
  { id: 'p-dieudonne', name: 'Dieudonné Dossou', handle: '@dieudonne_d', role: 'Prêtre & Théologien Autre Foi', avatarUrl: '/assets/duos/duo_pere_matthieu_1791655226601.jpg', category: 'protagoniste' },
  { id: 'p-tobi', name: 'Tobi Houndégla', handle: '@tobi_h', role: 'Pêcheur Toffinou (Ganvié)', avatarUrl: '/assets/duos/tobi-houndegla.jpg', category: 'protagoniste' },
  { id: 'p-sika', name: 'Sika Dossou', handle: '@sika_d', role: 'Commerçante & Sage de Dantokpa', avatarUrl: '/assets/images/beninoise_femme_sika_1792164985263.jpg', category: 'protagoniste' },
  { id: 'p-senan', name: 'Sénan Agossa', handle: '@senan_a', role: 'Entrepreneure & Innovatrice', avatarUrl: '/assets/images/beninoise_jeune_senan_1792165025309.jpg', category: 'protagoniste' },
  { id: 'p-codjo', name: 'Codjo Dah-Zounon', handle: '@codjo_dz', role: 'Témoin de la lumière intérieure', avatarUrl: '/assets/duos/codjo-blind.jpg', category: 'protagoniste' },
  { id: 'p-malik', name: 'Malik Diop', handle: '@malik_d', role: 'Orateur & Leader d’émancipation', avatarUrl: '/assets/duos/malik-diop.jpg', category: 'protagoniste' },
  { id: 'p-eleonore', name: 'Éléonore Vance', handle: '@eleonore_v', role: 'Oratrice & Souveraineté des femmes', avatarUrl: '/assets/duos/eleonore-vance.jpg', category: 'protagoniste' },
  { id: 'p-mawuna', name: 'Mawuna Houénou', handle: '@mawuna_h', role: 'Passeuse de mémoire & Clairvoyante', avatarUrl: '/assets/duos/mawuna-medium.jpg', category: 'protagoniste' },
  { id: 'p-sayri', name: 'Sayri Quispe', handle: '@sayri_q', role: 'Tisseur des Andes (Pérou)', avatarUrl: '/assets/duos/sayri-quispe.jpg', category: 'protagoniste' },
  { id: 'p-pascal', name: 'Pascal Tisserand', handle: '@pascal_t', role: 'Maître tisseur & Bâtisseur', avatarUrl: '/assets/protagonists/koffi-tisserand.jpg', category: 'protagoniste' },
  { id: 'p-adjovi', name: 'Adjovi Blandine', handle: '@adjovi_b', role: 'Guérisseuse aux herbes sacrées', avatarUrl: '/assets/protagonists/adjovi-blandine.jpg', category: 'protagoniste' },

  // Post-production
  { id: 'post-malik-sy', name: 'Malik Sy', handle: '@malik_s', role: 'Monteur & Étalonneur', avatarUrl: '/assets/duos/photographer-focus.jpg', category: 'post_production' },
  { id: 'post-christian', name: 'Christian Dossou', handle: '@christian_d', role: 'Ingénieur du son & Mixeur', avatarUrl: '/assets/duos/athlete-hurdle.jpg', category: 'post_production' },
  { id: 'post-fatou', name: 'Fatou Diallo', handle: '@fatou_d', role: 'Monteuse & Story Editor', avatarUrl: '/assets/duos/fatou-diallo.jpg', category: 'post_production' },
  { id: 'post-dossou', name: 'Dossou Gbaguidi', handle: '@dossou_g', role: 'Sound designer & Compositeur', avatarUrl: '/assets/images/beninois_sage_dossou_1792165004493.jpg', category: 'post_production' },
  { id: 'post-senou', name: 'Ayaba Senou', handle: '@ayaba_s', role: 'Monteuse chef & Mixeuse', avatarUrl: '/assets/protagonists/amara-tisserande.jpg', category: 'post_production' }
];

export const getSeriesParts = (choice: StudioPillarItem | null): { 
  partA: { id: 'part-a'; name: string; description?: string; number: string }; 
  partB: { id: 'part-b'; name: string; description?: string; number: string };
} => {
  if (!choice) {
    return {
      partA: { id: 'part-a', name: 'Partie 1', description: 'Premier volet de la série', number: 'Partie 1' },
      partB: { id: 'part-b', name: 'Partie 2', description: 'Deuxième volet de la série', number: 'Partie 2' }
    };
  }

  // 1. Chercher dans les documentaires officiels
  const doc = DOCUMENTARIES.find((d) => d.id === choice.id || d.slug === choice.id);
  if (doc && doc.universes && doc.universes.length >= 2) {
    return {
      partA: {
        id: 'part-a',
        name: doc.universes[0].name,
        description: doc.universes[0].tagline || doc.universes[0].description,
        number: 'Partie 1'
      },
      partB: {
        id: 'part-b',
        name: doc.universes[1].name,
        description: doc.universes[1].tagline || doc.universes[1].description,
        number: 'Partie 2'
      }
    };
  }

  // 2. Découpage du titre s'il contient un séparateur de diptyque (‹ › ou < >)
  const title = choice.title;
  if (title.includes('‹ ›') || title.includes('< >')) {
    const rawParts = title.split(/‹ ›|< >/).map((s) => s.trim()).filter(Boolean);
    if (rawParts.length >= 2) {
      return {
        partA: {
          id: 'part-a',
          name: rawParts[0],
          description: 'Premier univers du diptyque',
          number: 'Partie 1'
        },
        partB: {
          id: 'part-b',
          name: rawParts[1],
          description: 'Deuxième univers en miroir',
          number: 'Partie 2'
        }
      };
    }
  }

  return {
    partA: {
      id: 'part-a',
      name: `${title} (Volet 1)`,
      description: 'Volet initial de la thématique',
      number: 'Partie 1'
    },
    partB: {
      id: 'part-b',
      name: `${title} (Volet 2)`,
      description: 'Volet miroir et dialogue',
      number: 'Partie 2'
    }
  };
};

interface CollaboratorMentionInputProps {
  label: string;
  sublabel: string;
  category: 'realisation' | 'protagoniste' | 'post_production';
  tagged: TaggedCollaborator[];
  onAdd: (collaborator: TaggedCollaborator) => void;
  onRemove: (id: string) => void;
  placeholder: string;
}

const CollaboratorMentionInput: React.FC<CollaboratorMentionInputProps> = ({
  label,
  sublabel,
  category,
  tagged,
  onAdd,
  onRemove,
  placeholder,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const query = inputValue.replace(/^@/, '').toLowerCase().trim();

  const suggestions = PLATFORM_MEMBERS.filter((member) => {
    if (tagged.some((t) => t.id === member.id)) return false;
    if (!query) {
      return member.category === category || member.category === 'tous';
    }
    return (
      member.name.toLowerCase().includes(query) ||
      member.handle.toLowerCase().includes(query) ||
      member.role.toLowerCase().includes(query)
    );
  }).slice(0, 5);

  const handleSelect = (member: PlatformMember) => {
    onAdd({
      id: member.id,
      name: member.name,
      handle: member.handle,
      role: member.role,
      avatarUrl: member.avatarUrl,
    });
    setInputValue('');
    setWarningMessage(null);
    setIsFocused(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (suggestions.length > 0) {
        handleSelect(suggestions[0]);
      } else if (inputValue.trim()) {
        setWarningMessage('Seules les personnes inscrites sur la plateforme peuvent être identifiées avec le @.');
        setTimeout(() => setWarningMessage(null), 3500);
      }
    }
  };

  return (
    <div ref={containerRef} className="space-y-1.5 relative">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-stone-800">
          {label}
        </label>
        <span className="text-[11px] text-stone-400 font-normal">
          {sublabel}
        </span>
      </div>

      {tagged.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-1">
          {tagged.map((item) => (
            <span
              key={item.id}
              className="inline-flex items-center gap-1.5 pl-2 pr-2.5 py-1 rounded-xl bg-stone-100 border border-stone-200 text-xs text-stone-800 shadow-xs"
            >
              {item.avatarUrl ? (
                <img
                  src={item.avatarUrl}
                  alt={item.name}
                  className="w-4 h-4 rounded-full object-cover shrink-0"
                />
              ) : (
                <span className="w-4 h-4 rounded-full bg-[#A2482B]/15 text-[#A2482B] flex items-center justify-center text-[9px] font-bold shrink-0">
                  {item.name.charAt(0)}
                </span>
              )}
              <span className="font-semibold text-[#A2482B]">{item.handle}</span>
              <span className="text-stone-600 text-[11px] truncate max-w-[110px]">
                {item.name}
              </span>
              <button
                type="button"
                onClick={() => onRemove(item.id)}
                className="w-3.5 h-3.5 rounded-full hover:bg-stone-200 text-stone-400 hover:text-stone-700 flex items-center justify-center transition-colors cursor-pointer ml-0.5"
                title="Retirer"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
          <AtSign className="w-4 h-4 text-stone-400" />
        </div>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            if (warningMessage) setWarningMessage(null);
          }}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-9 pr-3 py-2 sm:py-2.5 rounded-xl bg-white border border-stone-300 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1.5 focus:ring-[#A2482B] focus:border-[#A2482B] transition-all shadow-xs"
        />
      </div>

      {warningMessage && (
        <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200/70 px-2.5 py-1 rounded-lg">
          ⚠️ {warningMessage}
        </p>
      )}

      {isFocused && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white rounded-xl shadow-xl border border-stone-200 py-1 max-h-52 overflow-y-auto">
          <div className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-stone-400 border-b border-stone-100">
            Membres inscrits sur la plateforme
          </div>
          {suggestions.map((member) => (
            <button
              key={member.id}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelect(member);
              }}
              className="w-full px-2.5 py-1.5 text-left flex items-center gap-2.5 hover:bg-stone-50 cursor-pointer transition-colors"
            >
              {member.avatarUrl ? (
                <img
                  src={member.avatarUrl}
                  alt={member.name}
                  className="w-6 h-6 rounded-full object-cover shrink-0"
                />
              ) : (
                <span className="w-6 h-6 rounded-full bg-[#A2482B]/15 text-[#A2482B] flex items-center justify-center text-xs font-bold shrink-0">
                  {member.name.charAt(0)}
                </span>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-xs text-stone-900 truncate">
                    {member.name}
                  </span>
                  <span className="text-[11px] font-medium text-[#A2482B]">
                    {member.handle}
                  </span>
                </div>
                <div className="text-[10px] text-stone-500 truncate">
                  {member.role}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

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

  // 7. Écran direct sur la plateforme : Télécharger sa vidéo (NON MODAL)
  const [isUploadScreenActive, setIsUploadScreenActive] = useState(false);
  const [uploadSuccessToast, setUploadSuccessToast] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [selectedPartId, setSelectedPartId] = useState<'part-a' | 'part-b'>('part-a');
  const [creditsRealisation, setCreditsRealisation] = useState<TaggedCollaborator[]>([]);
  const [creditsProtagonistes, setCreditsProtagonistes] = useState<TaggedCollaborator[]>([]);
  const [creditsPostProd, setCreditsPostProd] = useState<TaggedCollaborator[]>([]);
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
      if (synopsisModalItem) {
        if (e.key === 'Escape') {
          setSynopsisModalItem(null);
        }
        return;
      }

      if (isUploadScreenActive) {
        if (e.key === 'Escape') {
          setIsUploadScreenActive(false);
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
  }, [goToNext, goToPrev, activePillar, activeCastingCategory, selectedFinalChoice, synopsisModalItem, isUploadScreenActive]);

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

  const handleSubmitVideo = () => {
    if (!selectedFileName) {
      showToast('Veuillez sélectionner un fichier vidéo avant d’envoyer.');
      return;
    }
    const isMirrorTheme = activePillar?.id === 'duos' || (!activePillar && Boolean(selectedFinalChoice?.title.includes('‹ ›') || selectedFinalChoice?.title.includes('< >')));
    if (isMirrorTheme && !selectedPartId) {
      showToast('Veuillez choisir la partie de la série.');
      return;
    }

    // Remise à zéro et notification
    setSelectedFileName(null);
    setCreditsRealisation([]);
    setCreditsProtagonistes([]);
    setCreditsPostProd([]);
    setIsUploadScreenActive(false);
    setUploadSuccessToast(true);
    setTimeout(() => {
      setUploadSuccessToast(false);
    }, 4500);
  };

  // =========================================================================
  // ÉCRAN DIRECT SUR LA PLATEFORME : TÉLÉCHARGER SA VIDÉO (AUCUNE MODALE)
  // =========================================================================
  if (isUploadScreenActive && selectedFinalChoice) {
    const isMirrorTheme = activePillar?.id === 'duos' || (!activePillar && Boolean(selectedFinalChoice.title.includes('‹ ›') || selectedFinalChoice.title.includes('< >')));
    const parts = isMirrorTheme ? getSeriesParts(selectedFinalChoice) : null;

    return (
      <div className="w-full max-w-3xl mx-auto px-3 sm:px-6 pt-2 pb-24 sm:pb-28 pt-safe pb-safe h-full max-h-full overflow-hidden flex flex-col justify-between text-[#1C1917] select-none bg-white">
        {/* EN-TÊTE HARMONISÉ AVEC RETOUR VERS LE DUO DE CHOIX */}
        <div className="relative flex items-center justify-between h-9 sm:h-11 shrink-0 gap-2 mb-1.5 sm:mb-2">
          <div className="flex items-center gap-1.5 sm:gap-2 h-full min-w-0">
            <button
              onClick={() => setIsUploadScreenActive(false)}
              className="font-normal text-stone-500 hover:text-stone-900 transition-colors cursor-pointer flex items-center gap-1 group py-1 shrink-0"
              title="Revenir au choix précédent"
            >
              <ArrowLeft className="w-4 h-4 text-stone-400 group-hover:text-stone-700 group-hover:-translate-x-0.5 transition-transform" />
              <span className="text-xs sm:text-sm font-medium">Retour</span>
            </button>

            {/* Titre intermédiaire : affiché sur grand écran uniquement pour éviter toute troncature sur mobile */}
            <span className="text-stone-300 font-light text-xs hidden sm:inline" aria-hidden="true">›</span>

            <span className="text-xs sm:text-sm text-stone-500 truncate max-w-[180px] hidden sm:inline" title={selectedFinalChoice.title}>
              {selectedFinalChoice.title}
            </span>

            <span className="text-stone-300 font-light text-xs" aria-hidden="true">›</span>

            <div className="relative flex items-center h-full overflow-visible">
              <span className="font-editorial text-xs sm:text-sm md:text-base font-semibold text-[#1C1917] tracking-normal leading-none whitespace-nowrap pr-2 select-none">
                Télécharger sa vidéo
              </span>
              <div className="absolute left-0 -bottom-1.5 w-8 h-0.5 bg-[#A2482B] rounded-full" />
            </div>
          </div>
        </div>

        {/* CORPS DU FORMULAIRE : DIRECTEMENT SUR LA PLATEFORME (NON MODAL) */}
        <div className="flex-1 min-h-0 overflow-y-auto pr-1 sm:pr-2 py-1 sm:py-2 flex flex-col">
          <div className="space-y-3 sm:space-y-3.5">
            {/* 1A. CHOIX DE LA PARTIE DE LA SÉRIE (UNIQUEMENT LORSQU'ON PASSE PAR LA CASE MIROIR) */}
            {isMirrorTheme && parts && (
              <div className="space-y-2">
                <p className="text-xs sm:text-sm font-semibold text-stone-700">
                  À quelle partie de la série se rattache votre vidéo ?
                </p>

                <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5">
                  {/* Bouton Partie A */}
                  <button
                    type="button"
                    onClick={() => setSelectedPartId('part-a')}
                    className={`px-4 py-3 sm:py-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 text-left shadow-xs hover:shadow-sm ${
                      selectedPartId === 'part-a'
                        ? 'bg-[#A2482B]/10 border-[#A2482B] text-stone-900 ring-1 ring-[#A2482B]'
                        : 'bg-white border-stone-200 hover:border-stone-300 text-stone-800'
                    }`}
                  >
                    <span className="font-editorial text-xs sm:text-sm font-semibold truncate">
                      {parts.partA.name}
                    </span>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                      selectedPartId === 'part-a' ? 'border-[#A2482B] bg-[#A2482B] text-white' : 'border-stone-300 bg-white'
                    }`}>
                      {selectedPartId === 'part-a' && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </button>

                  {/* Bouton Partie B */}
                  <button
                    type="button"
                    onClick={() => setSelectedPartId('part-b')}
                    className={`px-4 py-3 sm:py-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 text-left shadow-xs hover:shadow-sm ${
                      selectedPartId === 'part-b'
                        ? 'bg-[#A2482B]/10 border-[#A2482B] text-stone-900 ring-1 ring-[#A2482B]'
                        : 'bg-white border-stone-200 hover:border-stone-300 text-stone-800'
                    }`}
                  >
                    <span className="font-editorial text-xs sm:text-sm font-semibold truncate">
                      {parts.partB.name}
                    </span>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                      selectedPartId === 'part-b' ? 'border-[#A2482B] bg-[#A2482B] text-white' : 'border-stone-300 bg-white'
                    }`}>
                      {selectedPartId === 'part-b' && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* 1B. RAPPEL DE LA DIRECTION POUR LES THÉMATIQUES HORS MIROIR (CASTING, LUMIÈRE, PORTRAIT) */}
            {!isMirrorTheme && (
              <div className="rounded-2xl border border-stone-200/90 bg-stone-50/70 p-3 sm:p-3.5 shadow-xs">
                <div className="mb-1.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                    Rappel de la direction
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  {/* Direction principale (ex: Casting, Lumière, Portrait) */}
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-xs sm:text-[13px] font-semibold text-stone-800 shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#A2482B]" />
                    {activePillar?.title || 'Studio'}
                  </span>

                  {/* Catégorie intermédiaire (ex: Sagesses) si applicable */}
                  {activeCastingCategory && (
                    <>
                      <span className="text-stone-300 font-light text-xs" aria-hidden="true">›</span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-xs sm:text-[13px] font-semibold text-stone-800 shadow-2xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
                        {activeCastingCategory.title}
                      </span>
                    </>
                  )}

                  {/* Thématique ou sujet sélectionné (ex: Sens de la vie) */}
                  <span className="text-stone-300 font-light text-xs" aria-hidden="true">›</span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#A2482B]/10 border border-[#A2482B]/30 text-xs sm:text-[13px] font-semibold text-[#A2482B] shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#A2482B]" />
                    {selectedFinalChoice.title}
                  </span>
                </div>
              </div>
            )}

            {/* 2. SÉLECTION DU FICHIER VIDÉO (BARRE HORIZONTALE PLEINE LARGEUR HARMONIEUSE) */}
            <div className="relative border border-dashed border-stone-300 hover:border-[#A2482B] rounded-2xl px-4 sm:px-5 py-3 sm:py-3.5 bg-stone-50/70 hover:bg-stone-50 transition-all cursor-pointer group flex items-center justify-between gap-3.5 shadow-xs">
              <input 
                type="file" 
                accept="video/mp4,video/quicktime,video/webm"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setSelectedFileName(e.target.files[0].name);
                  }
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#A2482B]/10 text-[#A2482B] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <UploadCloud className="w-4.5 h-4.5" />
                </div>
                {selectedFileName ? (
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-stone-900 truncate">{selectedFileName}</p>
                    <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-0.5">
                      <Check className="w-3 h-3 stroke-[3]" />
                      Fichier prêt à être envoyé
                    </p>
                  </div>
                ) : (
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-stone-700 font-medium truncate">
                      Glissez votre vidéo ici ou <span className="text-[#A2482B] underline font-semibold">parcourez vos fichiers</span>
                    </p>
                    <p className="text-[11px] text-stone-400 mt-0.5">
                      MP4, MOV (9:16 recommandé jusqu'à 500 Mo)
                    </p>
                  </div>
                )}
              </div>
              <span className="text-xs font-semibold text-[#A2482B] bg-[#A2482B]/10 hover:bg-[#A2482B]/15 px-3.5 py-1.5 rounded-xl shrink-0 transition-colors">
                {selectedFileName ? 'Changer' : 'Sélectionner'}
              </span>
            </div>

            {/* 3. CRÉDITS D'ÉQUIPE ÉPURÉS (RÉALISATION, PROTAGONISTES, POST-PRODUCTION VIA @) */}
            <div className="space-y-2.5 sm:space-y-3 pt-1 sm:pt-2 border-t border-stone-200/80">

              {/* A. Réalisation */}
              <CollaboratorMentionInput
                label="Réalisation"
                sublabel="Cadreur, réalisateur, prise de vue"
                category="realisation"
                tagged={creditsRealisation}
                onAdd={(collab) => setCreditsRealisation((prev) => [...prev, collab])}
                onRemove={(id) => setCreditsRealisation((prev) => prev.filter((c) => c.id !== id))}
                placeholder="Tapez @ pour mentionner cadreur, réalisateur..."
              />

              {/* B. Protagonistes de la vidéo */}
              <CollaboratorMentionInput
                label="Protagonistes de la vidéo"
                sublabel="Témoins, intervenants face caméra"
                category="protagoniste"
                tagged={creditsProtagonistes}
                onAdd={(collab) => setCreditsProtagonistes((prev) => [...prev, collab])}
                onRemove={(id) => setCreditsProtagonistes((prev) => prev.filter((c) => c.id !== id))}
                placeholder="Tapez @ pour mentionner les protagonistes..."
              />

              {/* C. Post-production */}
              <CollaboratorMentionInput
                label="Post-production"
                sublabel="Monteur, mixage son, étalonnage"
                category="post_production"
                tagged={creditsPostProd}
                onAdd={(collab) => setCreditsPostProd((prev) => [...prev, collab])}
                onRemove={(id) => setCreditsPostProd((prev) => prev.filter((c) => c.id !== id))}
                placeholder="Tapez @ pour mentionner monteur, ingénieur son..."
              />
            </div>
          </div>

          {/* 4. ACTIONS EN BAS */}
          <div className="pt-2.5 sm:pt-3 flex items-center justify-between gap-3 border-t border-stone-200/80 mt-3 sm:mt-4 pb-1">
            <button
              type="button"
              onClick={() => setIsUploadScreenActive(false)}
              className="px-4.5 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs sm:text-sm font-semibold cursor-pointer transition-colors"
            >
              Retour
            </button>
            <button
              type="button"
              onClick={handleSubmitVideo}
              className="px-5 sm:px-6 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-[#A2482B] hover:bg-[#8A3B22] text-white text-xs sm:text-sm font-semibold cursor-pointer transition-all shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Envoyer ma vidéo</span>
            </button>
          </div>
        </div>

        {/* Toast d'information temporaire */}
        {toastMessage && (
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-[#A2482B] text-white text-xs font-semibold py-2 px-4 rounded-xl shadow-xl animate-in fade-in duration-150">
            {toastMessage}
          </div>
        )}
      </div>
    );
  }

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
                <span className="text-xs sm:text-sm font-medium">
                  <span className="hidden sm:inline">Changer de thématique</span>
                  <span className="sm:hidden">Retour</span>
                </span>
              </button>

              <span className="text-stone-300 font-light text-xs" aria-hidden="true">›</span>

              <div className="relative flex items-center h-full overflow-visible min-w-0">
                <span className="font-editorial text-xs sm:text-sm md:text-base font-semibold text-[#1C1917] tracking-normal leading-none whitespace-nowrap pr-2 select-none truncate max-w-[130px] sm:max-w-[280px]">
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
      {/* 2. ZONE CENTRALE : DUO DE VIDÉOS CENTRÉ (TOUJOURS CÔTE À CÔTE MÊME SUR MOBILE) */}
      {/* ========================================================================= */}
      {selectedFinalChoice ? (
        <div className="relative flex-1 flex flex-col justify-center items-center w-full min-h-0 py-1 sm:py-3 animate-in fade-in duration-200">
          <div className="w-full max-w-4xl flex items-center justify-center h-full max-h-[560px]">
            {/* DUO DE VIDÉOS FACE-À-FACE CENTRÉ (STRICTEMENT CÔTE À CÔTE COMME SUR LE FEED MIROIR) */}
            <div className="flex items-center justify-center gap-2 sm:gap-5 md:gap-8 relative w-full px-1">
              
              {/* CARTE 1 : TÉLÉCHARGER SA VIDÉO */}
              <div 
                className="relative aspect-[9/16] w-[min(calc((100vw-28px)/2),calc((100dvh-230px)*9/16))] max-w-[185px] max-h-[min(480px,calc(100dvh-230px))] sm:max-w-none sm:max-h-none sm:w-[min(280px,calc((100dvh-210px)*9/16))] sm:h-[min(520px,calc(100dvh-210px))] lg:w-[min(310px,calc((100dvh-200px)*9/16))] lg:h-[min(550px,calc(100dvh-200px))] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between p-2.5 sm:p-4 bg-[#151513] text-white border border-stone-200/90 group shrink-0"
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
                  <span className="inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-[9px] sm:text-[11px] font-semibold text-white tracking-wide shadow-sm shrink-0 whitespace-nowrap leading-none select-none max-w-[calc(100%-60px)] truncate">
                    <span className="hidden sm:inline">Télécharger sa vidéo</span>
                    <span className="sm:hidden">Télécharger</span>
                  </span>
                  
                  <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                    {/* Icône mute si vidéo active */}
                    {duoPreviewVideo === 'upload' && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsMuted(prev => !prev);
                        }}
                        className="w-6.5 h-6.5 sm:w-8 sm:h-8 rounded-full bg-black/50 hover:bg-[#A2482B] active:bg-[#8A3B22] backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
                        title={isMuted ? 'Activer le son' : 'Couper le son'}
                      >
                        {isMuted ? <VolumeX className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" /> : <Volume2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />}
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setDuoPreviewVideo(prev => prev === 'upload' ? null : 'upload')}
                      className="w-6.5 h-6.5 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-black/55 hover:bg-[#A2482B] active:bg-[#8A3B22] text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-200 cursor-pointer shadow-md hover:scale-105 active:scale-95"
                      title={duoPreviewVideo === 'upload' ? "Arrêter la vidéo" : "Visionner l'exemple"}
                    >
                      {duoPreviewVideo === 'upload' ? (
                        <Pause className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-white text-white" />
                      ) : (
                        <TvPlayerIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" strokeWidth={1.7} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Bas de carte : Uniquement le bouton Choisir en bas à droite */}
                <div className="relative z-10 w-full flex items-center justify-end pointer-events-auto pt-1 sm:pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsUploadScreenActive(true);
                      setDuoPreviewVideo(null);
                    }}
                    className="px-2.5 sm:px-3 py-1 sm:py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-black/50 hover:bg-[#A2482B] active:bg-[#8A3B22] text-white font-medium text-[10.5px] sm:text-[12px] shadow-md flex items-center gap-1 sm:gap-1.5 transition-all duration-200 cursor-pointer border border-white/20 hover:border-[#A2482B] backdrop-blur-md hover:scale-105 active:scale-95"
                  >
                    <DoorOpen className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white/90" />
                    <span>Choisir</span>
                  </button>
                </div>
              </div>

              {/* CARTE 2 : CHOISIR UN EXPERT */}
              <div 
                className="relative aspect-[9/16] w-[min(calc((100vw-28px)/2),calc((100dvh-230px)*9/16))] max-w-[185px] max-h-[min(480px,calc(100dvh-230px))] sm:max-w-none sm:max-h-none sm:w-[min(280px,calc((100dvh-210px)*9/16))] sm:h-[min(520px,calc(100dvh-210px))] lg:w-[min(310px,calc((100dvh-200px)*9/16))] lg:h-[min(550px,calc(100dvh-200px))] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between p-2.5 sm:p-4 bg-[#151513] text-white border border-stone-200/90 group shrink-0"
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
                  <span className="inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-[9px] sm:text-[11px] font-semibold text-white tracking-wide shadow-sm shrink-0 whitespace-nowrap leading-none select-none max-w-[calc(100%-60px)] truncate">
                    <span className="hidden sm:inline">Choisir un expert</span>
                    <span className="sm:hidden">Un expert</span>
                  </span>
                  
                  <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                    {/* Icône mute si vidéo active */}
                    {duoPreviewVideo === 'expert' && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsMuted(prev => !prev);
                        }}
                        className="w-6.5 h-6.5 sm:w-8 sm:h-8 rounded-full bg-black/50 hover:bg-[#A2482B] active:bg-[#8A3B22] backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
                        title={isMuted ? 'Activer le son' : 'Couper le son'}
                      >
                        {isMuted ? <VolumeX className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" /> : <Volume2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />}
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setDuoPreviewVideo(prev => prev === 'expert' ? null : 'expert')}
                      className="w-6.5 h-6.5 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-black/55 hover:bg-[#A2482B] active:bg-[#8A3B22] text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-200 cursor-pointer shadow-md hover:scale-105 active:scale-95"
                      title={duoPreviewVideo === 'expert' ? "Arrêter la vidéo" : "Visionner l'exemple"}
                    >
                      {duoPreviewVideo === 'expert' ? (
                        <Pause className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-white text-white" />
                      ) : (
                        <TvPlayerIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" strokeWidth={1.7} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Bas de carte : Uniquement le bouton Choisir en bas à droite */}
                <div className="relative z-10 w-full flex items-center justify-end pointer-events-auto pt-1 sm:pt-2">
                  <button
                    type="button"
                    onClick={() => onNavigate({ 
                      type: 'request_videographer',
                      returnPillarId: activePillar?.id,
                      returnCastingCategoryId: activeCastingCategory?.id,
                      returnFinalChoiceId: selectedFinalChoice?.id
                    })}
                    className="px-2.5 sm:px-3 py-1 sm:py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-black/50 hover:bg-[#A2482B] active:bg-[#8A3B22] text-white font-medium text-[10.5px] sm:text-[12px] shadow-md flex items-center gap-1 sm:gap-1.5 transition-all duration-200 cursor-pointer border border-white/20 hover:border-[#A2482B] backdrop-blur-md hover:scale-105 active:scale-95"
                  >
                    <DoorOpen className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white/90" />
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

      {/* Toast de succès téléversement */}
      {uploadSuccessToast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-[#1C1917] text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-2xl border border-stone-700 flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Votre vidéo sera vérifiée par le comité de validation avant sa publication officielle.</span>
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
