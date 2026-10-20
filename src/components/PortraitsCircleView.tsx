import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  RotateCw, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  BookOpen, 
  Award, 
  X, 
  MoreHorizontal,
  Flag,
  Ban,
  Check
} from 'lucide-react';
import { CompanyEntity, CompanyStakeholder } from '../data/companyPortraitsData';
import { TvPlayerIcon, ProfileSoloIcon } from './YonywoodBrandIcons';
import { ShareIcon } from './ShareIcon';
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
  onNavigate
}) => {
  // Navigation à 2 niveaux : 'organizations' (Niveau 1) ou 'stakeholders' (Niveau 2)
  const [activeCompany, setActiveCompany] = useState<CompanyEntity | null>(() => {
    if (selectedCompanyId) {
      return companies.find(c => c.id === selectedCompanyId) || null;
    }
    return null;
  });

  // Volet de pagination des 16 intervenants (Volet 1: 0–15, Volet 2: 16–31)
  const [stakeholderBatch, setStakeholderBatch] = useState<number>(0);
  const [isRotating, setIsRotating] = useState<boolean>(false);

  // État de survol pour aperçu instantané
  const [hoveredOrg, setHoveredOrg] = useState<CompanyEntity | null>(null);
  const [hoveredStakeholder, setHoveredStakeholder] = useState<CompanyStakeholder | null>(null);

  // Témoignage intervenant actif en grand format / modale vidéo (GABARIT DIEUDONNÉ)
  const [activeStakeholderModal, setActiveStakeholderModal] = useState<CompanyStakeholder | null>(null);
  const [isStakeholderPlaying, setIsStakeholderPlaying] = useState<boolean>(false);
  const [isStakeholderMuted, setIsStakeholderMuted] = useState<boolean>(false);
  const [showQuestion, setShowQuestion] = useState<boolean>(false);
  const [isResonanceOpen, setIsResonanceOpen] = useState<boolean>(false);
  const [resonancePct, setResonancePct] = useState<number | null>(null);
  const [showMoreMenu, setShowMoreMenu] = useState<boolean>(false);
  const [blockMessage, setBlockMessage] = useState<string | null>(null);

  // Partage
  const [copied, setCopied] = useState<boolean>(false);

  // Sélection d'une organisation
  const handleSelectOrg = (org: CompanyEntity) => {
    setActiveCompany(org);
    setStakeholderBatch(0);
    setHoveredOrg(null);
    if (onSelectCompany) {
      onSelectCompany(org);
    }
  };

  // Retour au cercle global (Niveau 1)
  const handleBackToOrganizations = () => {
    setActiveCompany(null);
    setHoveredStakeholder(null);
    setActiveStakeholderModal(null);
    setShowMoreMenu(false);
    if (onSelectCompany) {
      onSelectCompany(null);
    }
  };

  // Actualiser et basculer sur les 16 regards suivants
  const handleNextBatch = () => {
    if (!activeCompany) return;
    setIsRotating(true);
    setTimeout(() => {
      setStakeholderBatch(prev => (prev === 0 ? 1 : 0));
      setIsRotating(false);
    }, 280);
  };

  // Intervenants du volet actif (16 intervenants)
  const current16Stakeholders = useMemo(() => {
    if (!activeCompany) return [];
    const all = activeCompany.stakeholders || [];
    const startIndex = stakeholderBatch * 16;
    let slice = all.slice(startIndex, startIndex + 16);
    if (slice.length < 16 && all.length > 0) {
      const needed = 16 - slice.length;
      slice = [...slice, ...all.slice(0, needed)];
    }
    return slice;
  }, [activeCompany, stakeholderBatch]);

  const totalBatches = useMemo(() => {
    if (!activeCompany) return 1;
    return Math.max(1, Math.ceil((activeCompany.stakeholders?.length || 0) / 16));
  }, [activeCompany]);

  const handleShareStakeholder = (stk: CompanyStakeholder) => {
    const url = `${window.location.origin}?company=${activeCompany?.id}&speaker=${stk.id}`;
    navigator.clipboard?.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Entité affichée au centre en grand (doré ensoleillé, sans texte superflu)
  const centerDisplayEntity = activeCompany || hoveredOrg || companies[0];

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between min-h-0 select-none pb-4">
      
      {/* ========================================================================= */}
      {/* BARRE SUPÉRIEURE DE CONTRÔLE : RETOUR (SI SOCIÉTÉ) & ROTATION 16 REGARDS  */}
      {/* Strictement sans pillule superflue "Constellation des 16 organisations"   */}
      {/* ========================================================================= */}
      <div className="w-full flex items-center justify-between shrink-0 px-2 py-1 z-20 min-h-[36px]">
        {activeCompany ? (
          <div className="flex items-center gap-2">
            <button
              onClick={handleBackToOrganizations}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 hover:bg-[#D4972B] text-stone-800 hover:text-white border border-stone-200 transition-all text-xs font-semibold cursor-pointer shadow-xs group"
              title="Revenir à toutes les organisations"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span>Toutes les organisations</span>
            </button>
            <span className="hidden sm:inline-block text-xs font-editorial font-bold text-stone-900 border-l border-stone-300 pl-2">
              {activeCompany.companyName}
            </span>
          </div>
        ) : (
          <div />
        )}

        {/* Bouton circulaire d'actualisation interactif (Volet 1/2) au Niveau 2 */}
        {activeCompany && totalBatches > 1 && (
          <button
            onClick={handleNextBatch}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-amber-50 border border-stone-200 text-stone-800 hover:text-[#D4972B] text-xs font-semibold transition-all shadow-xs cursor-pointer active:scale-95 ${
              isRotating ? 'scale-95 ring-2 ring-[#D4972B]/30' : ''
            }`}
            title="Faire pivoter les 16 regards de l'organisation"
          >
            <RotateCw className={`w-3.5 h-3.5 text-[#D4972B] transition-transform duration-300 ${isRotating ? 'rotate-180' : ''}`} />
            <span>Volet {stakeholderBatch + 1}/{totalBatches}</span>
          </button>
        )}
      </div>

      {/* ========================================================================= */}
      {/* ZONE CIRCULAIRE CENTRALE (DORÉ ENSOLEILLÉ #E5A93C, PUR ET ÉPURÉ)          */}
      {/* ========================================================================= */}
      <div className="relative w-full flex-1 flex items-center justify-center min-h-[340px] max-h-[560px] my-auto">
        
        {/* Conteneur dimensionné au ratio adapté */}
        <div className="relative w-[320px] h-[320px] sm:w-[440px] sm:h-[440px] flex items-center justify-center">

          {/* Anneau orbital SVG avec rayons discrets */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 440 440">
            {/* Anneau extérieur */}
            <circle 
              cx="220" 
              cy="220" 
              r="165" 
              fill="none" 
              stroke="#E7E5E4" 
              strokeWidth="1.2" 
              strokeDasharray="3 4"
            />
            {/* Anneau intérieur doré ensoleillé */}
            <circle 
              cx="220" 
              cy="220" 
              r="110" 
              fill="none" 
              stroke="#E5A93C" 
              strokeWidth="1" 
              strokeOpacity="0.35"
            />
            {/* 16 Rayons d'astrolabe délicats */}
            {Array.from({ length: 16 }).map((_, i) => {
              const angle = -90 + (360 / 16) * i;
              const rad = (angle * Math.PI) / 180;
              const x1 = 220 + Math.cos(rad) * 65;
              const y1 = 220 + Math.sin(rad) * 65;
              const x2 = 220 + Math.cos(rad) * 165;
              const y2 = 220 + Math.sin(rad) * 165;
              return (
                <line
                  key={`ray-${i}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#E7E5E4"
                  strokeWidth="0.6"
                  strokeOpacity="0.5"
                />
              );
            })}
          </svg>

          {/* ===================================================================== */}
          {/* PÔLE CENTRAL : L'IMAGE EN GRAND AU CENTRE AVEC JUSTE LE NOM           */}
          {/* Doré ensoleillé (#E5A93C / #D4972B), sans Portrait ni Manifeste       */}
          {/* ===================================================================== */}
          <div 
            className="relative z-10 w-32 h-32 sm:w-40 sm:h-40 rounded-full flex flex-col items-center justify-center text-center p-2.5 transition-all duration-300 shadow-xl group"
            style={{
              background: 'radial-gradient(circle, #FFFFFF 0%, #FFFDF7 75%, #FEF8E7 100%)',
              border: '2.5px solid #E5A93C',
              boxShadow: '0 0 24px rgba(229, 169, 60, 0.28)'
            }}
          >
            {/* Halo doré ensoleillé subtil */}
            <div className="absolute inset-0 rounded-full bg-[#E5A93C]/15 blur-lg pointer-events-none group-hover:bg-[#E5A93C]/25 transition-all duration-500" />
            
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-[#E5A93C]/60 shadow-md mb-1.5 bg-stone-900">
              <img 
                src={centerDisplayEntity.photoUrl} 
                alt={centerDisplayEntity.companyName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
              />
            </div>

            {/* JUSTE LE NOM DE LA SOCIÉTÉ (NOM COURT) */}
            <span className="relative font-editorial text-xs sm:text-sm font-bold text-stone-900 leading-tight max-w-[92%] truncate">
              {centerDisplayEntity.companyName}
            </span>
          </div>

          {/* ===================================================================== */}
          {/* LES 16 SATELLITES EN ORBITE : BULLES PURES SANS NOMS/BADGES ENCOMBRANTS*/}
          {/* ===================================================================== */}
          {activeCompany ? (
            /* NIVEAU 2 : LES 16 INTERVENANTS DE LA SOCIÉTÉ (AVATARS PURS SANS TEXTES) */
            current16Stakeholders.map((stk, idx) => {
              const angle = -90 + (360 / 16) * idx;
              const rad = (angle * Math.PI) / 180;
              const isHovered = hoveredStakeholder?.id === stk.id;

              return (
                <div
                  key={`stakeholder-satellite-${stk.id}-${idx}`}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: `translate(-50%, -50%) translate(calc(var(--r) * ${Math.cos(rad)}) , calc(var(--r) * ${Math.sin(rad)}))`
                  }}
                  className="[--r:120px] sm:[--r:165px] z-10"
                >
                  <button
                    onClick={() => {
                      setActiveStakeholderModal(stk);
                      setIsStakeholderPlaying(false);
                      setShowQuestion(false);
                      setResonancePct(null);
                      setShowMoreMenu(false);
                    }}
                    onMouseEnter={() => setHoveredStakeholder(stk)}
                    onMouseLeave={() => setHoveredStakeholder(null)}
                    className="relative group flex items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-125 focus:outline-none"
                    title={`${stk.name} · ${stk.roleDetail || stk.roleCategory}`}
                  >
                    {/* Bulle d'avatar pure et soignée avec liseré doré au survol */}
                    <div className="relative w-8.5 h-8.5 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-white shadow-md group-hover:border-[#E5A93C] group-hover:shadow-[0_0_12px_rgba(229,169,60,0.5)] transition-all duration-200 bg-stone-900">
                      <img 
                        src={stk.photoUrl} 
                        alt={stk.name}
                        className="w-full h-full object-cover" 
                      />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                    </div>
                  </button>
                </div>
              );
            })
          ) : (
            /* NIVEAU 1 : LES 16 ORGANISATIONS EN ORBITE (LOGOS PURS SANS TEXTES) */
            companies.slice(0, 16).map((org, idx) => {
              const angle = -90 + (360 / 16) * idx;
              const rad = (angle * Math.PI) / 180;
              const isHovered = hoveredOrg?.id === org.id;

              return (
                <div
                  key={`org-satellite-${org.id}`}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: `translate(-50%, -50%) translate(calc(var(--r) * ${Math.cos(rad)}) , calc(var(--r) * ${Math.sin(rad)}))`
                  }}
                  className="[--r:120px] sm:[--r:165px] z-10"
                >
                  <button
                    onClick={() => handleSelectOrg(org)}
                    onMouseEnter={() => setHoveredOrg(org)}
                    onMouseLeave={() => setHoveredOrg(null)}
                    className="relative group flex items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-125 focus:outline-none"
                    title={org.companyName}
                  >
                    {/* Pastille ronde du logo pur sans texte accroché */}
                    <div className="relative w-8.5 h-8.5 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-white shadow-md group-hover:border-[#E5A93C] group-hover:shadow-[0_0_12px_rgba(229,169,60,0.5)] transition-all duration-200 bg-stone-900">
                      <img 
                        src={org.photoUrl} 
                        alt={org.companyName}
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODALE CARTE VIDÉO DU TÉMOIGNAGE (GABARIT DIEUDONNÉ / HÉRITAGE EXACT)     */}
      {/* ========================================================================= */}
      {activeStakeholderModal && (
        <div 
          onClick={() => setActiveStakeholderModal(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative aspect-[9/16] w-full max-w-[340px] sm:max-w-[380px] max-h-[calc(100dvh-95px)] rounded-3xl overflow-hidden bg-stone-950 text-white shadow-2xl border border-white/15 flex flex-col justify-between p-4 sm:p-5 select-none"
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
              titleBadge={activeCompany?.companyName || 'Organisation'}
              displayName={activeStakeholderModal.name}
              isPlaying={isStakeholderPlaying}
              onTogglePlay={() => setIsStakeholderPlaying(prev => !prev)}
              isMuted={isStakeholderMuted}
              onToggleMute={() => setIsStakeholderMuted(prev => !prev)}
              resonanceScore={resonancePct}
              onOpenResonance={() => setIsResonanceOpen(true)}
              questionText={activeStakeholderModal.question}
              factText={`${activeStakeholderModal.roleCategory} : ${activeStakeholderModal.roleDetail || 'partenaire engagé dans la transmission locale'}`}
              onOpenProfile={() => {
                if (onNavigate) {
                  onNavigate({ type: 'profile' });
                }
              }}
              onShare={() => handleShareStakeholder(activeStakeholderModal)}
              isShareCopied={copied}
              onReportVideo={() => {
                setBlockMessage('Vidéo signalée à la modération.');
                setTimeout(() => setBlockMessage(null), 2500);
              }}
              onBlockVideo={() => {
                setBlockMessage('Ce contenu a été masqué.');
                setTimeout(() => {
                  setBlockMessage(null);
                  setActiveStakeholderModal(null);
                }, 1200);
              }}
            />

            {/* MODAL ÉVALUATION STRICTEMENT CANTONNÉE DANS LA CARTE */}
            <ResonanceModal
              isOpen={isResonanceOpen}
              onClose={() => setIsResonanceOpen(false)}
              storyId={`stakeholder-${activeStakeholderModal.id}`}
              topicId={activeCompany?.companyName || 'portraits'}
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
