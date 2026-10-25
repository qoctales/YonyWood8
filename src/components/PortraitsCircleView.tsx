import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  ChevronLeft, 
  RotateCw, 
  X,
  MessageSquare,
  Send
} from 'lucide-react';
import { ShareIcon } from './ShareIcon';
import { CompanyEntity, CompanyStakeholder } from '../data/companyPortraitsData';
import { ResonanceModal } from './ResonanceModal';
import { UnifiedVideoCardOverlay } from './UnifiedVideoCardOverlay';
import { celestialAudio } from '../utils/celestialAudio';
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

  // Modale vidéo pour l'entreprise (ouverte au centre du portail)
  const [activeCompanyModal, setActiveCompanyModal] = useState<CompanyEntity | null>(null);
  const [isCompanyPlaying, setIsCompanyPlaying] = useState<boolean>(false);
  const [isCompanyMuted, setIsCompanyMuted] = useState<boolean>(false);
  const [isCompanyResonanceOpen, setIsCompanyResonanceOpen] = useState<boolean>(false);
  const [companyResonancePct, setCompanyResonancePct] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modale de prise de contact avec l'organisation
  const [isContactCompanyModalOpen, setIsContactCompanyModalOpen] = useState<boolean>(false);
  const [companyContactSubject, setCompanyContactSubject] = useState<'partenariat' | 'mécénat' | 'projet' | 'presse' | 'autre'>('partenariat');
  const [companyContactName, setCompanyContactName] = useState<string>('');
  const [companyContactEmail, setCompanyContactEmail] = useState<string>('');
  const [companyContactMessage, setCompanyContactMessage] = useState<string>('');

  // Partage de l'espace Lumière de l'organisation
  const handleShareCompany = (company: CompanyEntity) => {
    const url = `${window.location.origin}?company=${company.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
    }
    setToastMessage(`Lien de l'espace Lumière « ${company.companyName} » copié !`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSendCompanyMessage = (e: React.FormEvent) => {
    e.preventDefault();
    setIsContactCompanyModalOpen(false);
    setToastMessage(`Votre message a été transmis à l'équipe de ${curOrg?.companyName || 'l’organisation'} !`);
    setTimeout(() => setToastMessage(null), 3500);
    setCompanyContactMessage('');
  };

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
  const R = W * 0.38; // Rayon orbital (38% de la largeur, distance du centre au milieu d'une vignette)
  // Taille des 16 vignettes rigoureusement identique entre le Niveau 1 et le Niveau 2 (gabarit officiel Niveau 2)
  const bubblePx = Math.max(38, W * 0.078);
  const orgPx = bubblePx;
  const colPx = bubblePx;

  // Niveau 1 : dimensionnement précis lumieres-halo-centre.svg (≈ 1,6 × R)
  const lumieresSvgWidth = 1.6 * R;
  const discRadius = (100 / 760) * lumieresSvgWidth;
  const discDiameter = 2 * discRadius;

  // Niveau 2 : dimensionnement précis medaillon-organisation.svg (≈ 1,7 × R)
  const medaillonWidth = 1.7 * R;
  const medaillonDiscRadius = (185 / 640) * medaillonWidth;
  const medaillonDiscDiameter = 2 * medaillonDiscRadius;

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
      {/* ========================================================================= */}
      {/* EN-TÊTE UNIFIÉ : FIL D'ARIANE LUMIÈRE & TEXTE D'AIDE                     */}
      {/* ========================================================================= */}
      <header className="w-full relative flex items-center justify-between h-9 sm:h-10 shrink-0 gap-2 mb-1">
        {/* Fil d'Ariane en haut à gauche avec tiret terracotta signature sous le titre */}
        <nav aria-label="Fil d’Ariane" className="flex items-center gap-2 text-sm sm:text-base h-full">
          {level === 0 ? (
            <div className="relative flex items-center h-full">
              <h1 className="font-editorial text-xs sm:text-sm md:text-base font-semibold text-[#1C1917] tracking-normal leading-none whitespace-nowrap">
                Une histoire commune, plusieurs regards
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
                title="Revenir à Lumières (constellation des 16 organisations)"
              >
                <ChevronLeft className="w-4 h-4 text-stone-400 group-hover:text-stone-700 group-hover:-translate-x-0.5 transition-transform" />
                <span>Lumières</span>
              </button>
              <span className="text-stone-300 font-light text-xs" aria-hidden="true">
                ›
              </span>
              <div className="relative flex items-center h-full">
                <span
                  className="font-editorial text-base sm:text-lg font-semibold text-[#1C1917] tracking-normal truncate max-w-[150px] sm:max-w-[260px]"
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

        {/* Droite : Texte d'aide discret, actions organisation (contact + partage) & Bascule externe (Swipe) */}
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-xs text-stone-400 font-normal hidden md:inline select-none">
            {level === 0 
              ? "Touchez le centre pour d'autres choix" 
              : "Touchez le centre pour d'autres voix"}
          </span>

          {/* Actions spécifiques au niveau organisation (niveau 1) : [Messagerie] -> [Partage] -> [Logo] */}
          {level === 1 && curOrg && (
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* 1. Contacter l'organisation */}
              <button
                type="button"
                onClick={() => setIsContactCompanyModalOpen(true)}
                id="btn-contact-organisation"
                className="w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-xl bg-white hover:bg-[#A2482B] border border-stone-200 hover:border-[#A2482B] text-stone-700 hover:text-white flex items-center justify-center transition-all shadow-xs cursor-pointer active:scale-95 shrink-0"
                title={`Contacter ${curOrg.companyName}`}
                aria-label={`Contacter ${curOrg.companyName}`}
              >
                <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[1.8] transition-colors" />
              </button>

              {/* 3. Partager l'espace Lumière de l'organisation */}
              <button
                type="button"
                onClick={() => handleShareCompany(curOrg)}
                id="btn-share-organisation-space"
                className="w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-xl bg-white hover:bg-[#A2482B] border border-stone-200 hover:border-[#A2482B] text-stone-700 hover:text-white flex items-center justify-center transition-all shadow-xs cursor-pointer active:scale-95 shrink-0"
                title={`Partager l'espace Lumière de ${curOrg.companyName}`}
                aria-label={`Partager l'espace Lumière de ${curOrg.companyName}`}
              >
                <ShareIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors" />
              </button>

              {/* 4. Petite diapositive carrée épurée avec le logo de l'organisation */}
              <div 
                className="w-7.5 h-7.5 sm:w-8 sm:h-8 p-0.5 bg-white border border-stone-200/90 rounded-sm sm:rounded shadow-xs shrink-0 flex items-center justify-center"
                title={`Organisation ${curOrg.companyName}`}
              >
                <div className="w-full h-full overflow-hidden bg-stone-100 rounded-[1px] aspect-square">
                  <img
                    src={curOrg.photoUrl}
                    alt={curOrg.companyName}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          )}

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
          {/* ===================================================================== */}
          {/* NIVEAU 1 : 16 RAYONS FINS ENTRE DISQUE CENTRAL ET BORD DES VIGNETTES  */}
          {/*    -> 1,2 px, couleur --gold-spoke (#d4a93f), opacité 0,45            */}
          {/* ===================================================================== */}
          <svg
            id="rays"
            className="absolute inset-0 w-full h-full pointer-events-none select-none z-0"
            viewBox={`0 0 ${W} ${W}`}
            aria-hidden="true"
            style={{
              opacity: level === 0 ? 1 : 0,
              transition: 'opacity 0.45s ease',
            }}
          >
            {Array.from({ length: 16 }).map((_, i) => {
              const a = (-90 + (i * 360) / 16) * (Math.PI / 180);
              const cosA = Math.cos(a);
              const sinA = Math.sin(a);
              const rStart = discRadius;
              const rEnd = Math.max(rStart, R - (bubblePx + 2) / 2);
              const x1 = W / 2 + cosA * rStart;
              const y1 = W / 2 + sinA * rStart;
              const x2 = W / 2 + cosA * rEnd;
              const y2 = W / 2 + sinA * rEnd;
              return (
                <line
                  key={`ray-${i}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="var(--gold-spoke,#d4a93f)"
                  strokeWidth="1.2"
                  opacity="0.45"
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}
          </svg>

          {/* ===================================================================== */}
          {/* NIVEAU 1 : HALO & SOLEIL LUMIÈRES (lumieres-halo-centre.svg)          */}
          {/*    -> Largeur ≈ 1,6 × R, cercles fins, vector-effect non-scaling     */}
          {/* ===================================================================== */}
          <div
            className="absolute left-1/2 top-1/2 pointer-events-none select-none z-0"
            style={{
              width: `${lumieresSvgWidth}px`,
              height: `${lumieresSvgWidth}px`,
              opacity: level === 0 ? 1 : 0,
              pointerEvents: 'none',
              transform: `translate(-50%, -50%) scale(${level === 0 ? (isSunRotating ? 1.05 : 1) : 0.75}) ${
                isSunRotating ? 'rotate(45deg)' : 'rotate(0deg)'
              }`,
              transition: 'opacity 0.45s ease, transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <svg
              viewBox="0 0 760 760"
              className="w-full h-full"
              aria-hidden="true"
            >
              {/* Cercles fins extérieurs */}
              <circle
                cx="380"
                cy="380"
                r="350"
                fill="none"
                stroke="var(--gold,#c9962b)"
                strokeOpacity="0.18"
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
              />
              <circle
                cx="380"
                cy="380"
                r="280"
                fill="none"
                stroke="var(--gold,#c9962b)"
                strokeOpacity="0.28"
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
              />
              {/* Cercle fin qui pulse doucement (opacité 0.25 -> 0.6, 3.2s) */}
              <circle
                cx="380"
                cy="380"
                r="205"
                fill="none"
                stroke="var(--gold,#c9962b)"
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
                className="animate-pulse-halo"
              />
              <circle
                cx="380"
                cy="380"
                r="130"
                fill="none"
                stroke="var(--gold,#c9962b)"
                strokeOpacity="0.55"
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
              />
              {/* Disque blanc central avec contour or */}
              <circle
                cx="380"
                cy="380"
                r="100"
                fill="#ffffff"
                stroke="var(--gold,#c9962b)"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
              {/* Point or solaire au centre exact du disque */}
              <circle
                cx="380"
                cy="380"
                r="9"
                fill="var(--gold,#c9962b)"
              />
            </svg>
          </div>

          {/* ===================================================================== */}
          {/* BOUTON CLIC CENTRE NIVEAU 1 : DISQUE CENTRAL (INTERACTIF SANS TEXTE)  */}
          {/*    -> Au survol : scale 1.04, 350ms ; focus-visible anneau or         */}
          {/* ===================================================================== */}
          {level === 0 && (
            <button
              type="button"
              onClick={handleShuffleCompanies}
              aria-label="Choisir une organisation"
              title="Choisir une organisation"
              className="absolute left-1/2 top-1/2 rounded-full cursor-pointer z-10 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold,#c9962b)] focus-visible:ring-offset-3 focus-visible:ring-offset-white transition-all duration-[350ms] ease-out hover:scale-[1.04] active:scale-95"
              style={{
                width: `${discDiameter}px`,
                height: `${discDiameter}px`,
                transform: 'translate(-50%, -50%)',
              }}
            />
          )}

          {/* ===================================================================== */}
          {/* NIVEAU 2 : MÉDAILLON ORGANISATION (medaillon-organisation.svg)        */}
          {/*    -> Largeur ≈ 1,7 × R, disque blanc, contour or 3px, filet 1px     */}
          {/*    -> Logo en cercle (diamètre ≈ 92%), 3 cercles fins fondu 500ms     */}
          {/* ===================================================================== */}
          <div
            className="absolute left-1/2 top-1/2 pointer-events-none select-none z-10"
            style={{
              width: `${medaillonWidth}px`,
              height: `${medaillonWidth}px`,
              opacity: level === 1 ? 1 : 0,
              pointerEvents: 'none',
              transform: `translate(-50%, -50%) scale(${level === 1 ? 1 : 0.8})`,
              transition: 'opacity 0.45s ease, transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <svg
              viewBox="0 0 640 640"
              className="w-full h-full"
              aria-hidden="true"
            >
              <defs>
                <clipPath id="medaillonOrgLogoClip">
                  <circle cx="320" cy="320" r="170" />
                </clipPath>
                <filter id="medaillonGoldShadow" x="-20%" y="-20%" width="140%" height="150%">
                  <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#a8791a" floodOpacity=".22" />
                </filter>
              </defs>

              {/* 3 cercles fins autour avec apparition en fondu de 500 ms décalés de 80 ms */}
              <circle
                cx="320"
                cy="320"
                r="290"
                fill="none"
                stroke="var(--gold,#c9962b)"
                strokeOpacity="0.18"
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
                className={level === 1 ? 'animate-fade-in-ring-1' : ''}
              />
              <circle
                cx="320"
                cy="320"
                r="250"
                fill="none"
                stroke="var(--gold,#c9962b)"
                strokeOpacity="0.28"
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
                className={level === 1 ? 'animate-fade-in-ring-2' : ''}
              />
              <circle
                cx="320"
                cy="320"
                r="215"
                fill="none"
                stroke="var(--gold,#c9962b)"
                strokeOpacity="0.42"
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
                className={level === 1 ? 'animate-fade-in-ring-3' : ''}
              />

              {/* Disque blanc, contour or 3 px, ombre dorée douce */}
              <circle
                cx="320"
                cy="320"
                r="185"
                fill="#ffffff"
                stroke="var(--gold,#c9962b)"
                strokeWidth="3"
                filter="url(#medaillonGoldShadow)"
                vectorEffect="non-scaling-stroke"
              />

              {/* Filet intérieur */}
              <circle
                cx="320"
                cy="320"
                r="177"
                fill="none"
                stroke="var(--gold,#c9962b)"
                strokeOpacity="0.5"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />

              {/* Logo de l'organisation dans un cercle (diamètre ≈ 92 % du disque doré) */}
              <g clipPath="url(#medaillonOrgLogoClip)">
                <circle cx="320" cy="320" r="170" fill="#ffffff" />
                {curOrg?.photoUrl && (
                  <image
                    href={curOrg.photoUrl}
                    x="150"
                    y="150"
                    width="340"
                    height="340"
                    preserveAspectRatio="xMidYMid meet"
                  />
                )}
              </g>
            </svg>
          </div>

          {/* ===================================================================== */}
          {/* BOUTON CLIC CENTRE NIVEAU 2 : MÉDAILLON INTERACTIF                    */}
          {/* ===================================================================== */}
          {level === 1 && (
            <button
              type="button"
              onClick={() => {
                if (totalBatches > 1) {
                  handleNextBatch();
                }
                celestialAudio.playOrbSelect();
              }}
              aria-label={`Organisation ${curOrg?.companyName} — Toucher pour d'autres regards`}
              title={`Organisation ${curOrg?.companyName}`}
              className="absolute left-1/2 top-1/2 rounded-full cursor-pointer z-10 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold,#c9962b)] focus-visible:ring-offset-3 focus-visible:ring-offset-white transition-all duration-[350ms] ease-out hover:scale-[1.03] active:scale-95"
              style={{
                width: `${medaillonDiscDiameter}px`,
                height: `${medaillonDiscDiameter}px`,
                transform: 'translate(-50%, -50%)',
              }}
            />
          )}

          {/* ===================================================================== */}
          {/* COURONNE DES 16 ORGANISATIONS (NIVEAU 1)                              */}
          {/*    -> Habillage préservé : bord blanc et ombre                        */}
          {/* ===================================================================== */}
          {displayedCompanies.map((org, k) => {
            const p = pos(k, 16);

            let transform = '';
            let opacity = 1;
            let zIndex = 1;
            let pointerEvents: 'auto' | 'none' = 'auto';

            if (level === 0) {
              transform = `translate(-50%, -50%) translate(${p.x}px, ${p.y}px)`;
              opacity = 1;
              zIndex = 2;
              pointerEvents = 'auto';
            } else {
              // Au passage au niveau 2, repli fluide vers le centre
              transform = `translate(-50%, -50%) translate(${p.x * 0.4}px, ${p.y * 0.4}px) scale(0)`;
              opacity = 0;
              zIndex = 0;
              pointerEvents = 'none';
            }

            return (
              <div
                key={`org-${org.id}`}
                className="absolute left-1/2 top-1/2 flex items-center justify-center"
                style={{
                  width: `${bubblePx + 10}px`,
                  height: `${bubblePx + 10}px`,
                  transform,
                  opacity,
                  zIndex,
                  pointerEvents,
                  transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.45s ease',
                  willChange: 'transform, opacity',
                }}
              >
                <button
                  type="button"
                  onClick={() => enter(k)}
                  aria-label={`Marque ${org.companyName} (${org.category})`}
                  title={`${org.companyName} · ${org.category}`}
                  className="w-full h-full rounded-full flex items-center justify-center p-1 min-w-[44px] min-h-[44px] cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold,#c9962b)] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                >
                  <div 
                    className="relative w-full h-full rounded-full overflow-hidden border-2 border-white shadow-md group-hover:scale-110 group-hover:shadow-xl group-active:scale-95 transition-all duration-300 ease-out transform-gpu bg-white flex items-center justify-center"
                  >
                    <img
                      src={org.photoUrl}
                      alt={`Logo ${org.companyName}`}
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.onerror = null;
                        target.src = '/assets/brand-logos/logo-bouclier-terroir.png';
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
          {/* COURONNE DES COLLABORATEURS / REGARDS (NIVEAU 2)                      */}
          {/*    -> Filet or de 2 px (--gold) et ombre 0 2px 8px rgba(168,121,26,.18) */}
          {/*    -> Déploiement progressif de 40ms par élément                      */}
          {/* ===================================================================== */}
          {displayedCollabs.map((collab, k) => {
            const p = pos(k, 16);
            const isShown = level === 1 && colsShown;

            const transform = isShown
              ? `translate(-50%, -50%) translate(${p.x}px, ${p.y}px)`
              : `translate(-50%, -50%) translate(0px, 0px) scale(0)`;
            const opacity = isShown ? 1 : 0;
            const pointerEvents: 'auto' | 'none' = isShown ? 'auto' : 'none';

            const transitionDelay = isShown ? `${k * 40}ms` : '0ms';
            const transitionDuration = isShown ? '600ms' : '320ms';

            return (
              <div
                key={`collab-${collab.id}-${k}`}
                className="absolute left-1/2 top-1/2 flex items-center justify-center"
                style={{
                  width: `${colPx + 10}px`,
                  height: `${colPx + 10}px`,
                  transform,
                  opacity,
                  pointerEvents,
                  zIndex: 3,
                  transition: `transform ${transitionDuration} cubic-bezier(0.4, 0, 0.2, 1) ${transitionDelay}, opacity ${transitionDuration} ease ${transitionDelay}`,
                  willChange: 'transform, opacity',
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setActiveStakeholderModal(collab);
                    setIsStakeholderPlaying(false);
                  }}
                  aria-label={`${collab.name} — ${collab.roleDetail || collab.roleCategory}`}
                  title={`${collab.name} · ${collab.roleDetail || collab.roleCategory}`}
                  className="w-full h-full rounded-full flex items-center justify-center p-1 cursor-pointer group min-w-[44px] min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold,#c9962b)] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                >
                  <div 
                    className="w-full h-full rounded-full overflow-hidden transition-all duration-200 ease-out transform-gpu group-hover:scale-105 group-active:scale-95"
                    style={{
                      border: '2px solid var(--gold, #c9962b)',
                      boxShadow: '0 2px 8px rgba(168, 121, 26, 0.18)'
                    }}
                  >
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

      {/* ========================================================================= */}
      {/* MODALE CARTE VIDÉO DE L'ENTREPRISE (OUVERTE DEPUIS LE CENTRE DU PORTAIL) */}
      {/* Structure, composants et comportement 100% identiques aux cartes de personne */}
      {/* ========================================================================= */}
      {activeCompanyModal && (
        <div
          onClick={() => {
            setActiveCompanyModal(null);
            setIsCompanyPlaying(false);
          }}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="group relative rounded-2xl sm:rounded-3xl overflow-hidden bg-[#151513] text-white shadow-2xl border border-stone-200/40 flex flex-col justify-between 
              aspect-[9/16] 
              w-[min(calc(100vw-32px),calc((100dvh-200px)*9/16))] 
              max-w-[280px] sm:max-w-[290px] 
              h-[min(500px,calc(100dvh-200px))] 
              mx-auto shrink-0 select-none animate-in zoom-in-95 duration-200 cursor-pointer"
          >
            {/* Vidéo de fond ou photo HD */}
            {isCompanyPlaying ? (
              <video
                src={activeCompanyModal.manifestoVideoUrl || activeCompanyModal.videoUrl}
                autoPlay
                loop
                playsInline
                muted={isCompanyMuted}
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              />
            ) : (
              <img
                src={activeCompanyModal.photoUrl}
                alt={activeCompanyModal.companyName}
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              />
            )}

            {/* Dégradé cinématique sombre */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50 pointer-events-none" />

            {/* Overlay standardisé identique à celui d'une personne :
                - En haut à gauche : le domaine d'activité
                - En bas : le nom de l'entreprise avec la même police et le même style
                - Évaluation, Question, Profil de l'entreprise, Partager, Menu 3 points (Signaler / Bloquer)
            */}
            <UnifiedVideoCardOverlay
              videoId={`company-${activeCompanyModal.id}`}
              titleBadge={activeCompanyModal.category}
              displayName={activeCompanyModal.companyName}
              preserveFullName={true}
              isPlaying={isCompanyPlaying}
              onTogglePlay={() => setIsCompanyPlaying((prev) => !prev)}
              isMuted={isCompanyMuted}
              onToggleMute={() => setIsCompanyMuted((prev) => !prev)}
              questionText={activeCompanyModal.manifestoQuestion || activeCompanyModal.tagline}
              factText={activeCompanyModal.manifestoDescription || activeCompanyModal.description}
              onOpenProfile={() => {
                setActiveCompanyModal(null);
                if (onSelectCompany) {
                  onSelectCompany(activeCompanyModal);
                }
              }}
              onShare={() => handleShareCompany(activeCompanyModal)}
              isShareCopied={copied}
              onReportVideo={() => {
                setToastMessage('Vidéo signalée à la modération.');
                setTimeout(() => setToastMessage(null), 2500);
              }}
              onBlockVideo={() => {
                setActiveCompanyModal(null);
                setToastMessage('Cette entreprise a été masquée.');
                setTimeout(() => setToastMessage(null), 2500);
              }}
            />

            {/* MODALE ÉVALUATION DE L'ENTREPRISE */}
            <ResonanceModal
              isOpen={isCompanyResonanceOpen}
              onClose={() => setIsCompanyResonanceOpen(false)}
              storyId={`company-${activeCompanyModal.id}`}
              topicId={activeCompanyModal.companyName}
              personName={activeCompanyModal.companyName}
              initialPercentage={companyResonancePct}
              onRatingSubmitted={(pct) => setCompanyResonancePct(pct)}
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODALE DE PRISE DE CONTACT AVEC L'ORGANISATION                           */}
      {/* ========================================================================= */}
      {isContactCompanyModalOpen && curOrg && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white max-w-md w-full rounded-3xl p-5 sm:p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden border border-stone-200 shadow-xs bg-white shrink-0 p-1 flex items-center justify-center">
                  <img
                    src={curOrg.photoUrl}
                    alt={curOrg.companyName}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-editorial text-base sm:text-lg font-bold text-[#1C1917]">
                    Contacter {curOrg.companyName}
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Espace Lumière & Partenariats
                  </p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setIsContactCompanyModalOpen(false)} 
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed bg-amber-50/60 p-3 rounded-xl border border-amber-200/60">
              Envoyez un message direct à la direction ou au pôle partenariats de <span className="font-semibold text-stone-900">{curOrg.companyName}</span>.
            </p>

            <form onSubmit={handleSendCompanyMessage} className="space-y-3.5 text-xs">
              <div>
                <label className="text-stone-800 font-semibold block mb-1.5">
                  Objet de votre prise de contact :
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'partenariat', label: 'Partenariat stratégique', icon: '🤝' },
                    { id: 'mécénat', label: 'Mécénat & Impact', icon: '🌿' },
                    { id: 'projet', label: 'Projet de coproduction', icon: '🎬' },
                    { id: 'presse', label: 'Presse & Médias', icon: '📰' }
                  ].map((m) => {
                    const isSel = companyContactSubject === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setCompanyContactSubject(m.id as any)}
                        className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all flex items-center gap-2 ${
                          isSel
                            ? 'bg-[#A2482B] text-white border-[#A2482B] shadow-2xs'
                            : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                        }`}
                      >
                        <span className="text-sm">{m.icon}</span>
                        <span className="font-semibold text-[11px] leading-tight">{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-stone-800 font-semibold block mb-1">Votre nom :</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Roméo Nonvide"
                    value={companyContactName}
                    onChange={(e) => setCompanyContactName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-stone-50 focus:bg-white focus:outline-none focus:border-[#A2482B]"
                  />
                </div>
                <div>
                  <label className="text-stone-800 font-semibold block mb-1">Votre email :</label>
                  <input
                    type="email"
                    required
                    placeholder="contact@exemple.com"
                    value={companyContactEmail}
                    onChange={(e) => setCompanyContactEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-stone-50 focus:bg-white focus:outline-none focus:border-[#A2482B]"
                  />
                </div>
              </div>

              <div>
                <label className="text-stone-800 font-semibold block mb-1">
                  Votre message :
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder={`Présentez brièvement votre démarche à ${curOrg.companyName}...`}
                  value={companyContactMessage}
                  onChange={(e) => setCompanyContactMessage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-stone-50 focus:bg-white focus:outline-none focus:border-[#A2482B] resize-none"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  className="flex-1 h-11 bg-[#A2482B] hover:bg-[#8A3B22] text-white font-bold text-xs rounded-xl transition-all shadow-md active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Envoyer à {curOrg.companyName}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsContactCompanyModalOpen(false)}
                  className="px-4 h-11 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs rounded-xl border border-stone-200/60 transition-all active:scale-[0.98] cursor-pointer"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast de confirmation */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-stone-900/95 backdrop-blur-md text-white border border-white/20 px-4 py-2 rounded-full text-xs font-semibold shadow-2xl animate-in fade-in pointer-events-none">
          {toastMessage}
        </div>
      )}
    </div>
  );
};
