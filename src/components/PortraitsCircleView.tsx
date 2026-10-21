import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  ChevronLeft, 
  RotateCw, 
  X
} from 'lucide-react';
import { CompanyEntity, CompanyStakeholder } from '../data/companyPortraitsData';
import { ResonanceModal } from './ResonanceModal';
import { UnifiedVideoCardOverlay } from './UnifiedVideoCardOverlay';
import { ViewScreen } from '../types';

interface PortraitsCircleViewProps {
  companies: CompanyEntity[];
  selectedCompanyId?: string | null;
  onSelectCompany?: (company: CompanyEntity | null) => void;
  onNavigate?: (screen: ViewScreen) => void;
  topRightAction?: React.ReactNode;
}

export const PortraitsCircleView: React.FC<PortraitsCircleViewProps> = ({
  companies,
  selectedCompanyId,
  onSelectCompany,
  onNavigate,
  topRightAction,
}) => {
  // Détermination de l'état initial selon selectedCompanyId
  const initialIndex = useMemo(() => {
    if (!selectedCompanyId) return -1;
    return companies.findIndex((c) => c.id === selectedCompanyId);
  }, [selectedCompanyId, companies]);

  // Batch actuel des 16 organisations proposées (cyclable au clic sur le soleil)
  const [companyBatchIndex, setCompanyBatchIndex] = useState<number>(() => {
    if (initialIndex >= 0) return Math.floor(initialIndex / 16);
    return 0;
  });
  const [isSunRotating, setIsSunRotating] = useState<boolean>(false);

  const totalCompanyBatches = Math.max(1, Math.ceil(companies.length / 16));

  // Les 16 organisations actuellement proposées sur le cercle
  const displayedCompanies = useMemo(() => {
    if (companies.length <= 16) return companies;
    const start = (companyBatchIndex * 16) % companies.length;
    let slice = companies.slice(start, start + 16);
    if (slice.length < 16) {
      slice = [...slice, ...companies.slice(0, 16 - slice.length)];
    }
    return slice;
  }, [companies, companyBatchIndex]);

  // Niveau 1 : organisations (0) | Niveau 2 : collaborateurs d'une organisation (1)
  const [level, setLevel] = useState<0 | 1>(initialIndex >= 0 ? 1 : 0);
  const [curIndex, setCurIndex] = useState<number>(initialIndex >= 0 ? initialIndex % 16 : -1);
  const [colsShown, setColsShown] = useState<boolean>(initialIndex >= 0);
  const [collabsInteractive, setCollabsInteractive] = useState<boolean>(initialIndex >= 0);

  // Volet actif des intervenants (16 par volet pour les organisations à 32 intervenants)
  const [activeBatchIndex, setActiveBatchIndex] = useState<number>(0);
  const [isRotatingBatch, setIsRotatingBatch] = useState<boolean>(false);

  // Timer pour orchestrer les transitions entrée / sortie
  const animTimerRef = useRef<NodeJS.Timeout | null>(null);
  const interactiveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Mesure dynamique de la taille du conteneur circulaire (#stage)
  const stageRef = useRef<HTMLDivElement>(null);
  const [stageWidth, setStageWidth] = useState<number>(380);

  // Modale vidéo pour collaborateur (témoignage 9:16)
  const [activeStakeholderModal, setActiveStakeholderModal] = useState<CompanyStakeholder | null>(null);
  const [isStakeholderPlaying, setIsStakeholderPlaying] = useState<boolean>(false);
  const [isStakeholderMuted, setIsStakeholderMuted] = useState<boolean>(false);
  const [isResonanceOpen, setIsResonanceOpen] = useState<boolean>(false);
  const [resonancePct, setResonancePct] = useState<number | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Données de l'organisation active
  const curOrg = curIndex >= 0 && curIndex < displayedCompanies.length ? displayedCompanies[curIndex] : null;
  const allStakeholders = curOrg?.stakeholders || [];
  const totalStakeholdersCount = allStakeholders.length;
  const totalBatches = Math.max(1, Math.ceil(totalStakeholdersCount / 16));

  // Action au clic sur le soleil central : actualiser et proposer 16 autres sociétés
  const handleShuffleCompanies = () => {
    if (level !== 0 || totalCompanyBatches <= 1) return;
    setIsSunRotating(true);
    setTimeout(() => {
      setCompanyBatchIndex((prev) => (prev + 1) % totalCompanyBatches);
      setIsSunRotating(false);
    }, 300);
  };

  // 16 intervenants du volet actif
  const displayedCollabs = useMemo(() => {
    if (!curOrg || allStakeholders.length === 0) return [];
    const start = activeBatchIndex * 16;
    const slice = allStakeholders.slice(start, start + 16);
    // Si moins de 16, compléter harmonieusement pour préserver les 16 rayons réguliers
    if (slice.length < 16 && allStakeholders.length > 0) {
      const full: CompanyStakeholder[] = [];
      for (let i = 0; i < 16; i++) {
        full.push(allStakeholders[i % allStakeholders.length]);
      }
      return full;
    }
    return slice;
  }, [curOrg, allStakeholders, activeBatchIndex]);

  // Suivi de redimensionnement sécurisé (évite les boucles de micro-rebond)
  useEffect(() => {
    const updateSize = () => {
      if (stageRef.current) {
        const measured = Math.round(stageRef.current.clientWidth);
        if (measured > 0) {
          setStageWidth((prev) => (Math.abs(prev - measured) >= 2 ? measured : prev));
        }
      }
    };
    updateSize();

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const measured = Math.round(entry.contentRect.width);
        if (measured > 0) {
          setStageWidth((prev) => (Math.abs(prev - measured) >= 2 ? measured : prev));
        }
      }
    });

    if (stageRef.current) ro.observe(stageRef.current);
    window.addEventListener('resize', updateSize);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateSize);
      if (animTimerRef.current) clearTimeout(animTimerRef.current);
      if (interactiveTimerRef.current) clearTimeout(interactiveTimerRef.current);
    };
  }, []);

  // Synchronisation externe avec selectedCompanyId si modifié depuis le parent
  useEffect(() => {
    if (selectedCompanyId) {
      const idx = companies.findIndex((c) => c.id === selectedCompanyId);
      if (idx >= 0) {
        const batch = Math.floor(idx / 16);
        setCompanyBatchIndex(batch);
        setLevel(1);
        setCurIndex(idx % 16);
        setColsShown(true);
        setCollabsInteractive(true);
        setActiveBatchIndex(0);
      }
    } else if (level === 1 && !selectedCompanyId && curIndex !== -1) {
      exit();
    }
  }, [selectedCompanyId]);

  // Proportions géométriques
  const W = stageWidth || 380;
  const R = W * 0.38; // Rayon orbital (38% de la largeur)
  const orgPx = Math.max(42, W * 0.088); // Taille des vignettes organisations
  const colPx = Math.max(38, W * 0.078); // Taille des vignettes collaborateurs
  const sunPx = W * 0.30; // Taille du centre / soleil (30% de la largeur)
  const zoom = sunPx / orgPx; // Facteur pour que l'organisation au centre remplace exactement le soleil

  // Calcul trigonométrique d'un angle régulier démarrant au sommet (-90°)
  const pos = (k: number, total: number = 16) => {
    const a = (-90 + (k * 360) / total) * (Math.PI / 180);
    return {
      x: Math.cos(a) * R,
      y: Math.sin(a) * R,
    };
  };

  // Animation d'entrée vers le niveau 2 (collaborateurs)
  const enter = (i: number) => {
    if (level !== 0) return;
    if (animTimerRef.current) clearTimeout(animTimerRef.current);
    if (interactiveTimerRef.current) clearTimeout(interactiveTimerRef.current);

    setLevel(1);
    setCurIndex(i);
    setColsShown(false);
    setCollabsInteractive(false);
    setActiveBatchIndex(0);
    onSelectCompany?.(displayedCompanies[i]);

    // Déploiement des 16 intervenants depuis le centre
    animTimerRef.current = setTimeout(() => {
      setColsShown(true);
    }, 450);

    // Fin de transition : lever les délais pour que les survols soient fluides et stables
    interactiveTimerRef.current = setTimeout(() => {
      setCollabsInteractive(true);
    }, 1100);
  };

  // Animation de sortie vers le niveau 1 (organisations / soleil central)
  const exit = () => {
    if (level === 0) return;
    if (animTimerRef.current) clearTimeout(animTimerRef.current);
    if (interactiveTimerRef.current) clearTimeout(interactiveTimerRef.current);

    setColsShown(false);
    setCollabsInteractive(false);

    // Repli vers le centre puis réapparition du soleil et des 16 organisations
    animTimerRef.current = setTimeout(() => {
      setLevel(0);
      setCurIndex(-1);
      setActiveBatchIndex(0);
      onSelectCompany?.(null);
    }, 320);
  };

  // Passage aux 16 regards suivants
  const handleNextBatch = () => {
    if (totalBatches <= 1) return;
    setIsRotatingBatch(true);
    setCollabsInteractive(false);
    setActiveStakeholderModal(null);
    setIsStakeholderPlaying(false);

    setTimeout(() => {
      setActiveBatchIndex((prev) => (prev + 1) % totalBatches);
      setIsRotatingBatch(false);
      setTimeout(() => {
        setCollabsInteractive(true);
      }, 500);
    }, 240);
  };

  // Clavier : touche Échap pour fermer modale ou revenir au niveau 1 (soleil central)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeStakeholderModal) {
          setActiveStakeholderModal(null);
        } else if (level === 1) {
          exit();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [level, activeStakeholderModal]);

  const handleShareStakeholder = (stk: CompanyStakeholder) => {
    const url = `${window.location.origin}?company=${curOrg?.id}&speaker=${stk.id}`;
    navigator.clipboard?.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between min-h-0 select-none">
      
      {/* ========================================================================= */}
      {/* EN-TÊTE HARMONISÉ EXACTEMENT AU MÊME EMPLACEMENT QUE STUDIO, PRODUCTION   */}
      {/* ========================================================================= */}
      <header className="w-full relative flex items-center justify-between h-9 sm:h-10 shrink-0 gap-2 mb-1">
        {/* Fil d'Ariane en haut à gauche avec tiret terracotta signature sous le titre */}
        <nav aria-label="Fil d’Ariane" className="flex items-center gap-2 text-sm sm:text-base h-full">
          {level === 0 ? (
            <div className="relative flex items-center h-full">
              <h1 className="font-editorial italic text-xs sm:text-sm md:text-base font-bold text-[#1C1917] tracking-tight leading-none whitespace-nowrap">
                Une histoire, plusieurs regards
              </h1>
              {/* Petit trait terracotta officiel */}
              <div className="absolute left-0 -bottom-1.5 w-8 h-0.5 bg-[#A2482B] rounded-full" />
            </div>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2 h-full">
              <button
                type="button"
                onClick={exit}
                className="font-normal text-stone-500 hover:text-stone-900 transition-colors cursor-pointer flex items-center gap-1 group py-1"
                title="Revenir à Lumière (constellation des 16 organisations)"
              >
                <ChevronLeft className="w-4 h-4 text-stone-400 group-hover:text-stone-700 group-hover:-translate-x-0.5 transition-transform" />
                <span>Lumière</span>
              </button>
              <span className="text-stone-300 font-light text-xs" aria-hidden="true">
                ›
              </span>
              <div className="relative flex items-center h-full">
                <span
                  className="font-editorial text-base sm:text-lg font-bold text-[#1C1917] tracking-tight truncate max-w-[150px] sm:max-w-[260px]"
                  aria-current="page"
                >
                  {curOrg?.companyName}
                </span>
                {/* Petit trait terracotta officiel */}
                <div className="absolute left-0 -bottom-1.5 w-8 h-0.5 bg-[#A2482B] rounded-full" />
              </div>
            </div>
          )}
        </nav>

        {/* Droite : Bascule externe (Swipe) */}
        <div className="flex items-center gap-2">
          {topRightAction}
        </div>
      </header>

      {/* ========================================================================= */}
      {/* SCÈNE CIRCULAIRE (#stage)                                                */}
      {/* ========================================================================= */}
      <div className="relative w-full flex-1 flex items-center justify-center min-h-[300px] my-auto overflow-hidden">
        <div
          ref={stageRef}
          id="stage"
          className="relative w-[min(100%,620px,calc(100vh-170px))] aspect-square min-w-[280px] mx-auto flex items-center justify-center select-none overflow-hidden"
        >
          {/* ===================================================================== */}
          {/* SVG UNIFIÉ : LE SOLEIL, SES HALOS ET SES 16 RAYONS EXACTEMENT CENTRÉS */}
          {/*    -> cx="50", cy="50" et (x1="50", y1="50") : ALIGNEMENT MATHÉMATIQUE */}
          {/* ===================================================================== */}
          <svg
            id="rays"
            className={`absolute inset-0 w-full h-full pointer-events-none select-none z-0 transition-transform duration-500 ease-out ${
              isSunRotating ? 'scale-105 rotate-45' : ''
            }`}
            viewBox="0 0 100 100"
            aria-hidden="true"
            style={{
              opacity: level === 0 ? 1 : 0,
              transition: 'opacity 0.45s ease, transform 0.5s ease',
            }}
          >
            <defs>
              <radialGradient id="sunAuraGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#F5B921" stopOpacity="0.45" />
                <stop offset="55%" stopColor="#F5B921" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#FAF8F5" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* 1. Halo externe respirant (r=30, exactement centré sur le soleil et les rayons) */}
            <circle
              cx="50"
              cy="50"
              r="30"
              fill="#F5B921"
              className="animate-breathe-svg"
            />

            {/* 2. Halo interne respirant (r=22, exactement centré) */}
            <circle
              cx="50"
              cy="50"
              r="22"
              fill="#F5B921"
              className="animate-breathe-svg-inner"
            />

            {/* 3. Lueur diffuse d'ambiance */}
            <circle cx="50" cy="50" r="26" fill="url(#sunAuraGlow)" />

            {/* 4. Les 16 rayons dorés partant exactement du centre (50, 50) */}
            {Array.from({ length: 16 }).map((_, i) => {
              const a = (-90 + (i * 360) / 16) * (Math.PI / 180);
              const r = 0.38 * 100 * 0.92;
              return (
                <line
                  key={`ray-${i}`}
                  x1="50"
                  y1="50"
                  x2={50 + Math.cos(a) * r}
                  y2={50 + Math.sin(a) * r}
                  stroke="#F0CF73"
                  strokeWidth="0.22"
                  opacity="0.85"
                />
              );
            })}

            {/* 5. Le disque solaire doré pur (r=15 = sunPx/2) posé au centre sur les rayons */}
            <circle
              cx="50"
              cy="50"
              r="15"
              fill="#F5B921"
            />
          </svg>

          {/* ===================================================================== */}
          {/* BOUTON SOLEIL CENTRAL INTERACTIF (NIVEAU 1)                           */}
          {/*    -> Clic sur le soleil actualise et propose 16 autres sociétés      */}
          {/* ===================================================================== */}
          {level === 0 && (
            <button
              type="button"
              onClick={handleShuffleCompanies}
              title="Cliquer pour proposer d'autres sociétés"
              aria-label="Cliquer sur le soleil pour proposer d'autres sociétés"
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full cursor-pointer z-10 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A2482B]/60"
              style={{
                width: `${sunPx}px`,
                height: `${sunPx}px`,
              }}
            >
              <div 
                className={`w-full h-full rounded-full flex items-center justify-center transition-all duration-300 ${
                  isSunRotating ? 'scale-90 rotate-90' : 'group-hover:scale-105 active:scale-95'
                }`}
              >
                {/* Repère discret de rotation au survol */}
                <div className="w-10 h-10 rounded-full bg-white/0 group-hover:bg-[#FFF8E7]/30 transition-all duration-300 flex items-center justify-center pointer-events-none">
                  <RotateCw className="w-4 h-4 text-stone-900/40 opacity-0 group-hover:opacity-75 transition-opacity duration-200" />
                </div>
              </div>
            </button>
          )}

          {/* ===================================================================== */}
          {/* COURONNE DES 16 ORGANISATIONS (NIVEAU 1)                              */}
          {/*    -> Conteneur stable à position fixe                                */}
          {/*    -> Au clic, glisse vers le centre et remplace le soleil            */}
          {/*    -> Au centre (isCur) : clic permet de revenir au soleil central    */}
          {/* ===================================================================== */}
          {displayedCompanies.map((org, k) => {
            const p = pos(k, 16);
            const isCur = k === curIndex;

            let transform = '';
            let opacity = 1;
            let zIndex = 1;
            let pointerEvents: 'auto' | 'none' = 'auto';

            if (level === 0) {
              transform = `translate(-50%, -50%) translate(${p.x}px, ${p.y}px)`;
              opacity = 1;
              zIndex = 2;
              pointerEvents = 'auto';
            } else if (isCur) {
              // L'organisation sélectionnée prend la place du soleil au centre
              transform = `translate(-50%, -50%) translate(0px, 0px) scale(${zoom})`;
              opacity = 1;
              zIndex = 10;
              pointerEvents = 'auto';
            } else {
              // Les 15 autres organisations se replient vers le centre en s'estompant
              transform = `translate(-50%, -50%) translate(${p.x * 0.6}px, ${p.y * 0.6}px) scale(0)`;
              opacity = 0;
              zIndex = 0;
              pointerEvents = 'none';
            }

            return (
              <div
                key={`org-${org.id}`}
                className="absolute left-1/2 top-1/2 flex items-center justify-center"
                style={{
                  width: `${orgPx + 14}px`,
                  height: `${orgPx + 14}px`,
                  transform,
                  opacity,
                  zIndex,
                  pointerEvents,
                  transition: 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease',
                  willChange: 'transform, opacity',
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    if (level === 0) {
                      enter(k);
                    } else if (isCur) {
                      // Au centre : un clic actualise et présente d'autres protagonistes de l'organisation
                      handleNextBatch();
                    }
                  }}
                  aria-label={level === 0 ? org.companyName : `Découvrir d'autres collaborateurs de ${org.companyName}`}
                  title={level === 0 ? org.companyName : (isCur ? `Cliquer pour voir d'autres collaborateurs (${org.companyName})` : '')}
                  className="w-full h-full rounded-full flex items-center justify-center p-1.5 cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5B921]"
                >
                  <div 
                    className={`relative w-full h-full rounded-full overflow-hidden border-2 shadow-md transition-all duration-300 ease-out transform-gpu ${
                      isCur 
                        ? `border-[#A2482B] shadow-xl group-hover:scale-103 group-active:scale-95 ${isRotatingBatch ? 'scale-95' : ''}` 
                        : 'border-white/95 group-hover:border-[#F5B921] group-hover:scale-112 group-hover:shadow-lg group-active:scale-95'
                    }`}
                  >
                    <img
                      src={org.photoUrl}
                      alt={org.companyName}
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.onerror = null;
                        const fallbackOrgPhotos = [
                          '/assets/doors/door-marques.jpg',
                          '/assets/doors/door-memoires.jpg',
                          '/assets/doors/door-projets.jpg',
                          '/assets/doors/door-competences.jpg',
                          '/assets/doors/door-territoires.jpg',
                          '/assets/doors/door-sagesses.jpg'
                        ];
                        target.src = fallbackOrgPhotos[k % fallbackOrgPhotos.length];
                      }}
                      className="w-full h-full object-cover pointer-events-none select-none"
                      style={{ backfaceVisibility: 'hidden' }}
                    />
                  </div>
                </button>
              </div>
            );
          })}

          {/* ===================================================================== */}
          {/* COURONNE DES COLLABORATEURS (NIVEAU 2)                                */}
          {/*    -> Conteneur stable anti-tremblement : la zone de clic est FIXE    */}
          {/*    -> Seul le cercle intérieur s'anime élégamment sans rebond         */}
          {/* ===================================================================== */}
          {displayedCollabs.map((collab, k) => {
            const p = pos(k, 16);
            const isShown = level === 1 && colsShown;

            const transform = isShown
              ? `translate(-50%, -50%) translate(${p.x}px, ${p.y}px)`
              : `translate(-50%, -50%) translate(0px, 0px)`;
            const opacity = isShown ? 1 : 0;
            const pointerEvents: 'auto' | 'none' = isShown ? 'auto' : 'none';

            // Transition d'arrivée étalée puis instantanée après déploiement
            const transitionDelay = collabsInteractive ? '0s' : `${0.04 + k * 0.022}s`;
            const transitionDuration = collabsInteractive ? '0.2s' : '0.45s';

            return (
              <div
                key={`collab-${collab.id}-${k}`}
                className="absolute left-1/2 top-1/2 flex items-center justify-center"
                style={{
                  width: `${colPx + 14}px`,
                  height: `${colPx + 14}px`,
                  transform,
                  opacity,
                  pointerEvents,
                  zIndex: 3,
                  transition: `transform ${transitionDuration} cubic-bezier(0.16, 1, 0.3, 1) ${transitionDelay}, opacity ${transitionDuration} ease ${transitionDelay}`,
                  willChange: 'transform, opacity',
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setActiveStakeholderModal(collab);
                    setIsStakeholderPlaying(false);
                  }}
                  aria-label={collab.name}
                  title={`${collab.name} · ${collab.roleDetail || collab.roleCategory}`}
                  className="w-full h-full rounded-full flex items-center justify-center p-1.5 cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5B921]"
                >
                  <div className="w-full h-full rounded-full overflow-hidden border-2 border-white/95 shadow-md group-hover:border-[#F5B921] group-hover:shadow-lg group-hover:scale-115 group-active:scale-95 transition-all duration-200 ease-out transform-gpu">
                    <img
                      src={collab.photoUrl}
                      alt={collab.name}
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.onerror = null;
                        const fallbackCollabPhotos = [
                          '/assets/protagonists/adjovi-blandine.jpg',
                          '/assets/protagonists/chef-koffi.jpg',
                          '/assets/protagonists/kwame-mensah.jpg',
                          '/assets/protagonists/amara-tisserande.jpg',
                          '/assets/protagonists/dah-zounon.jpg'
                        ];
                        target.src = fallbackCollabPhotos[k % fallbackCollabPhotos.length];
                      }}
                      className="w-full h-full object-cover pointer-events-none select-none"
                      style={{ backfaceVisibility: 'hidden' }}
                    />
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODALE CARTE VIDÉO DU TÉMOIGNAGE AU CLIC D'UN COLLABORATEUR              */}
      {/* ========================================================================= */}
      {activeStakeholderModal && (
        <div
          onClick={() => setActiveStakeholderModal(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="group relative rounded-2xl sm:rounded-3xl overflow-hidden bg-[#151513] text-white shadow-2xl border border-stone-200/40 flex flex-col justify-between 
              aspect-[9/16] 
              w-[min(calc(100vw-32px),calc((100dvh-200px)*9/16))] 
              max-w-[280px] sm:max-w-[290px] 
              h-[min(500px,calc(100dvh-200px))] 
              mx-auto shrink-0 select-none animate-in zoom-in-95 duration-200"
          >
            {/* Vidéo de fond ou photo HD */}
            {isStakeholderPlaying ? (
              <video
                src={activeStakeholderModal.videoUrl}
                autoPlay
                loop
                playsInline
                muted={isStakeholderMuted}
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              />
            ) : (
              <img
                src={activeStakeholderModal.photoUrl}
                alt={activeStakeholderModal.name}
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              />
            )}

            {/* Dégradé cinématique sombre */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50 pointer-events-none" />

            {/* Overlay standardisé */}
            <UnifiedVideoCardOverlay
              titleBadge={curOrg?.companyName || 'Organisation'}
              displayName={activeStakeholderModal.name}
              isPlaying={isStakeholderPlaying}
              onTogglePlay={() => setIsStakeholderPlaying((prev) => !prev)}
              isMuted={isStakeholderMuted}
              onToggleMute={() => setIsStakeholderMuted((prev) => !prev)}
              resonanceScore={resonancePct}
              onOpenResonance={() => setIsResonanceOpen(true)}
              questionText={activeStakeholderModal.question}
              factText={`${activeStakeholderModal.roleCategory} : ${
                activeStakeholderModal.roleDetail || 'partenaire engagé dans la transmission locale'
              }`}
              onOpenProfile={() => {
                if (onNavigate) {
                  onNavigate({ type: 'profile' });
                }
              }}
              onShare={() => handleShareStakeholder(activeStakeholderModal)}
              isShareCopied={copied}
            />

            {/* MODALE ÉVALUATION */}
            <ResonanceModal
              isOpen={isResonanceOpen}
              onClose={() => setIsResonanceOpen(false)}
              storyId={`stakeholder-${activeStakeholderModal.id}`}
              topicId={curOrg?.companyName || 'lumiere'}
              personName={activeStakeholderModal.name}
              initialPercentage={resonancePct}
              onRatingSubmitted={(pct) => setResonancePct(pct)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
