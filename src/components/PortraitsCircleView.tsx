import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ChevronLeft } from 'lucide-react';
import { CompanyEntity, CompanyStakeholder } from '../data/companyPortraitsData';
import { ResonanceModal } from './ResonanceModal';
import { UnifiedVideoCardOverlay } from './UnifiedVideoCardOverlay';
import { ViewScreen } from '../types';

interface PortraitsCircleViewProps {
  companies: CompanyEntity[];
  selectedCompanyId?: string | null;
  onSelectCompany?: (company: CompanyEntity | null) => void;
  onNavigate?: (screen: ViewScreen) => void;
}

export const PortraitsCircleView: React.FC<PortraitsCircleViewProps> = ({
  companies,
  selectedCompanyId,
  onSelectCompany,
  onNavigate,
}) => {
  // Détermination de l'état initial selon selectedCompanyId
  const initialIndex = useMemo(() => {
    if (!selectedCompanyId) return -1;
    return companies.findIndex((c) => c.id === selectedCompanyId);
  }, [selectedCompanyId, companies]);

  // Niveau 1 : organisations (0) | Niveau 2 : collaborateurs d'une organisation (1)
  const [level, setLevel] = useState<0 | 1>(initialIndex >= 0 ? 1 : 0);
  const [curIndex, setCurIndex] = useState<number>(initialIndex);
  const [colsShown, setColsShown] = useState<boolean>(initialIndex >= 0);

  // Timer pour orchestrer les transitions entrée / sortie
  const animTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Mesure dynamique de la taille du conteneur circulaire (#stage)
  const stageRef = useRef<HTMLDivElement>(null);
  const [stageWidth, setStageWidth] = useState<number>(0);

  // Modale vidéo pour collaborateur (témoignage 9:16)
  const [activeStakeholderModal, setActiveStakeholderModal] = useState<CompanyStakeholder | null>(null);
  const [isStakeholderPlaying, setIsStakeholderPlaying] = useState<boolean>(false);
  const [isStakeholderMuted, setIsStakeholderMuted] = useState<boolean>(false);
  const [isResonanceOpen, setIsResonanceOpen] = useState<boolean>(false);
  const [resonancePct, setResonancePct] = useState<number | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Suivi de redimensionnement pour caler les coordonnées précises
  useEffect(() => {
    const updateSize = () => {
      if (stageRef.current) {
        setStageWidth(stageRef.current.clientWidth);
      }
    };
    updateSize();

    const ro = new ResizeObserver(updateSize);
    if (stageRef.current) ro.observe(stageRef.current);
    window.addEventListener('resize', updateSize);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateSize);
      if (animTimerRef.current) clearTimeout(animTimerRef.current);
    };
  }, []);

  // Synchronisation externe avec selectedCompanyId si modifié depuis le parent
  useEffect(() => {
    if (selectedCompanyId) {
      const idx = companies.findIndex((c) => c.id === selectedCompanyId);
      if (idx >= 0 && idx !== curIndex) {
        setLevel(1);
        setCurIndex(idx);
        setColsShown(true);
      }
    } else if (level === 1 && !selectedCompanyId && curIndex !== -1) {
      exit();
    }
  }, [selectedCompanyId]);

  // Proportions du modèle CFG (maquette de référence)
  const W = stageWidth || 380;
  const R = W * 0.38; // Rayon de la couronne (38% de la largeur)
  const orgPx = Math.max(40, W * 0.085); // Taille des vignettes organisations (8.5%, min 40px)
  const colPx = Math.max(36, W * 0.075); // Taille des vignettes collaborateurs (7.5%, min 36px)
  const sunPx = W * 0.30; // Taille du centre / soleil (30% de la largeur)
  const zoom = sunPx / orgPx; // Facteur d'agrandissement de l'organisation pour occuper exactement la place du soleil

  // Calcul d'angle régulier démarrant au sommet (-90°) dans le sens horaire
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
    setLevel(1);
    setCurIndex(i);
    setColsShown(false);
    onSelectCompany?.(companies[i]);

    // Après 450 ms, les collaborateurs se déploient un à un depuis le centre
    animTimerRef.current = setTimeout(() => {
      setColsShown(true);
    }, 450);
  };

  // Animation de sortie vers le niveau 1 (organisations)
  const exit = () => {
    if (level === 0) return;
    if (animTimerRef.current) clearTimeout(animTimerRef.current);
    setColsShown(false);

    // Après 300 ms (repli des collaborateurs vers le centre), l'organisation revient à sa place et le soleil renaît
    animTimerRef.current = setTimeout(() => {
      setLevel(0);
      setCurIndex(-1);
      onSelectCompany?.(null);
    }, 300);
  };

  // Clavier : touche Échap pour revenir au niveau 1
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

  // Données de l'organisation active
  const curOrg = curIndex >= 0 ? companies[curIndex] : null;
  const collabs = curOrg?.stakeholders || [];
  const displayedCollabs = collabs.slice(0, 16);
  const totalCollabs = Math.max(1, displayedCollabs.length);

  const handleShareStakeholder = (stk: CompanyStakeholder) => {
    const url = `${window.location.origin}?company=${curOrg?.id}&speaker=${stk.id}`;
    navigator.clipboard?.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between min-h-0 select-none pb-2 sm:pb-4">
      {/* ========================================================================= */}
      {/* EN-TÊTE HARMONISÉ : FIL D'ARIANE UNIQUE À GAUCHE & PETIT TEXTE D'AIDE     */}
      {/* ========================================================================= */}
      <header className="w-full max-w-2xl px-2 sm:px-4 pt-1 pb-1 flex items-center justify-between shrink-0 min-h-[44px]">
        {/* Fil d'Ariane en haut à gauche */}
        <nav aria-label="Fil d’Ariane" className="flex items-center gap-2 text-sm sm:text-base">
          {level === 0 ? (
            <span className="font-editorial text-base sm:text-lg font-bold text-stone-900 tracking-tight leading-none">
              Portraits
            </span>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={exit}
                className="font-normal text-stone-500 hover:text-stone-900 transition-colors cursor-pointer flex items-center gap-1 group py-1"
                title="Revenir à Portraits"
              >
                <ChevronLeft className="w-4 h-4 text-stone-400 group-hover:text-stone-700 group-hover:-translate-x-0.5 transition-transform" />
                <span>Portraits</span>
              </button>
              <span className="text-stone-300 font-light text-xs" aria-hidden="true">
                ›
              </span>
              <span
                className="font-semibold text-stone-900 truncate max-w-[170px] sm:max-w-[280px]"
                aria-current="page"
              >
                {curOrg?.companyName}
              </span>
            </div>
          )}
        </nav>

        {/* Petit texte d'aide discret en haut à droite */}
        <span className="text-xs sm:text-[13px] text-stone-400 font-normal select-none">
          {level === 0 ? 'Touchez une organisation' : 'Touchez le centre pour revenir'}
        </span>
      </header>

      {/* ========================================================================= */}
      {/* SCÈNE CIRCULAIRE (#stage)                                                */}
      {/* ========================================================================= */}
      <div className="relative w-full flex-1 flex items-center justify-center min-h-[300px] my-auto">
        <div
          ref={stageRef}
          id="stage"
          className="relative w-[min(100%,620px,calc(100vh-170px))] aspect-square min-w-[280px] mx-auto flex items-center justify-center select-none"
        >
          {/* ===================================================================== */}
          {/* 1. RAYONS SOLAIRES TRÈS FINS (NIVEAU 1)                              */}
          {/* ===================================================================== */}
          <svg
            id="rays"
            className="absolute inset-0 w-full h-full pointer-events-none select-none z-0"
            viewBox="0 0 100 100"
            aria-hidden="true"
            style={{
              opacity: level === 0 ? 0.85 : 0,
              transition: 'opacity 0.45s ease',
            }}
          >
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
          </svg>

          {/* ===================================================================== */}
          {/* 2. LE SOLEIL ET SES DEUX HALOS RESPIRANTS (NIVEAU 1)                 */}
          {/* ===================================================================== */}
          <div
            id="sun"
            className="absolute left-1/2 top-1/2 pointer-events-none select-none z-0"
            aria-hidden="true"
            style={{
              width: `${sunPx}px`,
              height: `${sunPx}px`,
              transform:
                level === 0
                  ? 'translate(-50%, -50%) scale(1)'
                  : 'translate(-50%, -50%) scale(0.2)',
              opacity: level === 0 ? 1 : 0,
              transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.45s ease',
              willChange: 'transform, opacity',
            }}
          >
            {/* Halo 2 externe (200% taille, 16% opacité) */}
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none animate-breathe"
              style={{
                width: '200%',
                height: '200%',
                backgroundColor: '#F5B921',
                opacity: 0.16,
              }}
            />

            {/* Halo 1 interne (148% taille, 30% opacité) */}
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none animate-breathe"
              style={{
                width: '148%',
                height: '148%',
                backgroundColor: '#F5B921',
                opacity: 0.30,
              }}
            />

            {/* Disque jaune doré pur sans image, sans texte, sans anneau décoratif */}
            <div
              className="w-full h-full rounded-full shadow-lg"
              style={{
                backgroundColor: '#F5B921',
              }}
            />
          </div>

          {/* ===================================================================== */}
          {/* 3. COURONNE DES 16 ORGANISATIONS (NIVEAU 1)                          */}
          {/*    -> Au clic, glisse vers le centre et grossit à la taille du soleil*/}
          {/* ===================================================================== */}
          {companies.slice(0, 16).map((org, k) => {
            const p = pos(k, 16);
            const isCur = k === curIndex;

            let transform = '';
            let opacity = 1;
            let zIndex = 1;
            let pointerEvents: 'auto' | 'none' = 'auto';

            if (level === 0) {
              transform = `translate(-50%, -50%) translate(${p.x}px, ${p.y}px) scale(1)`;
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
              // Les 15 autres organisations se déplacent vers le centre en s'estompant
              transform = `translate(-50%, -50%) translate(${p.x * 0.6}px, ${p.y * 0.6}px) scale(0)`;
              opacity = 0;
              zIndex = 0;
              pointerEvents = 'none';
            }

            return (
              <button
                key={`org-${org.id}`}
                type="button"
                onClick={() => {
                  if (level === 0) enter(k);
                  else if (isCur) exit();
                }}
                aria-label={org.companyName}
                title={level === 0 ? org.companyName : (isCur ? 'Touchez pour revenir' : '')}
                className={`absolute left-1/2 top-1/2 rounded-full overflow-hidden border border-white/80 shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5B921] group ${
                  isCur ? 'cursor-pointer' : 'cursor-pointer hover:border-[#F5B921] hover:scale-110 active:scale-95'
                }`}
                style={{
                  width: `${orgPx}px`,
                  height: `${orgPx}px`,
                  transform,
                  opacity,
                  zIndex,
                  pointerEvents,
                  transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.45s ease',
                  willChange: 'transform, opacity',
                }}
              >
                <img
                  src={org.photoUrl}
                  alt={org.companyName}
                  className="w-full h-full object-cover pointer-events-none group-hover:scale-105 transition-transform duration-300"
                />
              </button>
            );
          })}

          {/* ===================================================================== */}
          {/* 4. COURONNE DES COLLABORATEURS (NIVEAU 2)                             */}
          {/*    -> Apparaissent un à un depuis le centre (décalage de 40 ms)      */}
          {/* ===================================================================== */}
          {displayedCollabs.map((collab, k) => {
            const p = pos(k, totalCollabs);
            const isShown = level === 1 && colsShown;

            const transform = isShown
              ? `translate(-50%, -50%) translate(${p.x}px, ${p.y}px) scale(1)`
              : `translate(-50%, -50%) translate(0px, 0px) scale(0)`;
            const opacity = isShown ? 1 : 0;
            const pointerEvents: 'auto' | 'none' = isShown ? 'auto' : 'none';
            const transitionDelay = isShown ? `${k * 40}ms` : '0ms';
            const transitionDuration = isShown ? '0.6s' : '0.3s';

            return (
              <button
                key={`collab-${collab.id}-${k}`}
                type="button"
                onClick={() => {
                  setActiveStakeholderModal(collab);
                  setIsStakeholderPlaying(false);
                }}
                aria-label={collab.name}
                title={`${collab.name} · ${collab.roleDetail || collab.roleCategory}`}
                className="absolute left-1/2 top-1/2 rounded-full overflow-hidden border border-white/80 shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5B921] group cursor-pointer hover:border-[#F5B921] hover:scale-115 active:scale-95"
                style={{
                  width: `${colPx}px`,
                  height: `${colPx}px`,
                  transform,
                  opacity,
                  pointerEvents,
                  zIndex: 5,
                  transitionProperty: 'transform, opacity',
                  transitionDuration,
                  transitionTimingFunction: isShown ? 'cubic-bezier(0.4, 0, 0.2, 1)' : 'ease',
                  transitionDelay,
                  willChange: 'transform, opacity',
                }}
              >
                <img
                  src={collab.photoUrl}
                  alt={collab.name}
                  className="w-full h-full object-cover pointer-events-none group-hover:scale-110 transition-transform duration-200"
                />
              </button>
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

            {/* Overlay standardisé : alignement vertical strict, 6 actions, pas de croix, titre en haut à gauche et prénom épuré en bas à gauche */}
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
              topicId={curOrg?.companyName || 'portraits'}
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
