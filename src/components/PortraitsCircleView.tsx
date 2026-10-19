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
  Sparkles,
  Building2,
  Compass,
  ArrowRight,
  Info
} from 'lucide-react';
import { CompanyEntity, CompanyStakeholder } from '../data/companyPortraitsData';
import { TvPlayerIcon, ProfileSoloIcon } from './YonywoodBrandIcons';
import { ShareIcon } from './ShareIcon';
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

  // Témoignage intervenant actif en grand format / modale vidéo
  const [activeStakeholderModal, setActiveStakeholderModal] = useState<CompanyStakeholder | null>(null);
  const [isStakeholderPlaying, setIsStakeholderPlaying] = useState<boolean>(false);
  const [isStakeholderMuted, setIsStakeholderMuted] = useState<boolean>(false);
  const [showQuestion, setShowQuestion] = useState<boolean>(false);
  const [resonancePct, setResonancePct] = useState<number | null>(null);

  // Manifeste vidéo de l'organisation centrale
  const [showManifestoModal, setShowManifestoModal] = useState<boolean>(false);
  const [isManifestoPlaying, setIsManifestoPlaying] = useState<boolean>(false);
  const [isManifestoMuted, setIsManifestoMuted] = useState<boolean>(false);

  // Partage
  const [copied, setCopied] = useState<boolean>(false);

  // Sélection d'une organisation (passage au Niveau 2 : Reviens Devient le Soleil)
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
    setShowManifestoModal(false);
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
    // Si moins de 16, combler circulairement pour garantir un cercle plein de 16 regards
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

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between min-h-0 select-none">
      
      {/* ========================================================================= */}
      {/* BARRE SUPÉRIEURE DE CONTRÔLE (RETOUR, TITRE, VOLET 1/2)                   */}
      {/* ========================================================================= */}
      <div className="w-full flex items-center justify-between shrink-0 px-1 py-1 z-20">
        {activeCompany ? (
          <div className="flex items-center gap-2">
            <button
              onClick={handleBackToOrganizations}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 hover:bg-[#A2482B] text-stone-800 hover:text-white border border-stone-200 transition-all text-xs font-semibold cursor-pointer shadow-xs group"
              title="Revenir au cercle des 16 organisations"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span>Toutes les organisations</span>
            </button>
            <span className="hidden sm:inline-block text-xs font-editorial font-bold text-stone-900 border-l border-stone-300 pl-2">
              {activeCompany.companyName}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#A2482B]/10 border border-[#A2482B]/20 text-[#A2482B] text-xs font-bold">
              <Compass className="w-3.5 h-3.5" />
              <span>Constellation des 16 Organisations</span>
            </div>
          </div>
        )}

        {/* Bouton circulaire d'actualisation interactif (Volet 1/2) au Niveau 2 */}
        {activeCompany && totalBatches > 1 && (
          <button
            onClick={handleNextBatch}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-stone-50 border border-stone-200 text-stone-800 hover:text-[#A2482B] text-xs font-semibold transition-all shadow-xs cursor-pointer active:scale-95 ${
              isRotating ? 'scale-95 ring-2 ring-[#A2482B]/30' : ''
            }`}
            title="Faire pivoter les 16 regards de l'organisation"
          >
            <RotateCw className={`w-3.5 h-3.5 text-[#A2482B] transition-transform duration-300 ${isRotating ? 'rotate-180' : ''}`} />
            <span>Volet {stakeholderBatch + 1}/{totalBatches}</span>
            <span className="hidden sm:inline text-[10px] text-stone-600 font-mono">
              ({stakeholderBatch === 0 ? 'Regards 1–16' : 'Regards 17–32'})
            </span>
          </button>
        )}
      </div>

      {/* ========================================================================= */}
      {/* ZONE CIRCULAIRE CENTRALE (ASTROLABE DU SOLEIL ET DES 16 SATELLITES)       */}
      {/* ========================================================================= */}
      <div className="relative w-full flex-1 flex items-center justify-center min-h-[360px] max-h-[580px] my-auto">
        
        {/* Conteneur dimensionné au ratio carré parfait adapté au mobile et desktop */}
        <div className="relative w-[340px] h-[340px] sm:w-[460px] sm:h-[460px] flex items-center justify-center">

          {/* Anneau orbital SVG avec rayons discrets */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 460 460">
            {/* Anneau extérieur */}
            <circle 
              cx="230" 
              cy="230" 
              r="170" 
              fill="none" 
              stroke="#E7E5E4" 
              strokeWidth="1.5" 
              strokeDasharray="3 4"
            />
            {/* Anneau intérieur de résonance */}
            <circle 
              cx="230" 
              cy="230" 
              r="115" 
              fill="none" 
              stroke="#A2482B" 
              strokeWidth="0.8" 
              strokeOpacity="0.2"
            />
            {/* 16 Rayons d'astrolabe délicats */}
            {Array.from({ length: 16 }).map((_, i) => {
              const angle = -90 + (360 / 16) * i;
              const rad = (angle * Math.PI) / 180;
              const x1 = 230 + Math.cos(rad) * 65;
              const y1 = 230 + Math.sin(rad) * 65;
              const x2 = 230 + Math.cos(rad) * 170;
              const y2 = 230 + Math.sin(rad) * 170;
              return (
                <line
                  key={`ray-${i}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#E7E5E4"
                  strokeWidth="0.7"
                  strokeOpacity="0.6"
                />
              );
            })}
          </svg>

          {/* ===================================================================== */}
          {/* PÔLE CENTRAL : SOLEIL DE L'ORGANISATION OU BOUSSOLE IDENTITAIRE       */}
          {/* ===================================================================== */}
          {activeCompany ? (
            /* SOLEIL CENTRAL (NIVEAU 2) : L'organisation sélectionnée */
            <div 
              className="relative z-10 w-28 h-28 sm:w-36 sm:h-36 rounded-full flex flex-col items-center justify-center text-center p-2.5 transition-all duration-300 group cursor-pointer shadow-xl"
              style={{
                background: 'radial-gradient(circle, #FFFFFF 0%, #FAF8F5 80%, #F5F2EB 100%)',
                border: '2px solid #A2482B'
              }}
              onClick={() => setShowManifestoModal(true)}
              title="Cliquer pour regarder le manifeste vidéo de l'organisation"
            >
              {/* Effet halo solaire doux */}
              <div className="absolute inset-0 rounded-full bg-[#A2482B]/10 blur-md pointer-events-none group-hover:bg-[#A2482B]/20 transition-all duration-500" />
              
              <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden border border-[#A2482B]/40 shadow-inner mb-1">
                <img 
                  src={activeCompany.photoUrl} 
                  alt={activeCompany.companyName}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                />
                <div className="absolute inset-0 bg-black/25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="w-5 h-5 fill-white text-white drop-shadow-md" />
                </div>
              </div>

              <span className="relative font-editorial text-[11px] sm:text-xs font-bold text-stone-900 leading-tight line-clamp-1 max-w-[90%]">
                {activeCompany.companyName}
              </span>
              <span className="relative text-[8px] sm:text-[9px] font-semibold text-[#A2482B] tracking-wide uppercase mt-0.5">
                Manifeste
              </span>
            </div>
          ) : (
            /* BOUSSOLE CENTRALE (NIVEAU 1) : Portail des 16 organisations */
            <div 
              className="relative z-10 w-28 h-28 sm:w-36 sm:h-36 rounded-full flex flex-col items-center justify-center text-center p-3 shadow-lg"
              style={{
                background: 'radial-gradient(circle, #FFFFFF 0%, #FAF8F5 80%, #F5F2EB 100%)',
                border: '1.5px solid #E7E5E4'
              }}
            >
              <div className="w-8 h-8 rounded-full bg-[#A2482B]/10 flex items-center justify-center text-[#A2482B] mb-1">
                <Building2 className="w-4 h-4" />
              </div>
              <h3 className="font-editorial text-xs sm:text-sm font-bold text-stone-900 leading-tight">
                Portraits
              </h3>
              <p className="text-[8px] sm:text-[9px] text-stone-600 font-medium leading-tight mt-0.5">
                {hoveredOrg ? hoveredOrg.companyName : '16 Organisations'}
              </p>
            </div>
          )}

          {/* ===================================================================== */}
          {/* LES 16 SATELLITES EN ORBITE                                           */}
          {/* ===================================================================== */}
          {activeCompany ? (
            /* NIVEAU 2 : LES 16 INTERVENANTS DU VOLET ACTIF */
            current16Stakeholders.map((stk, idx) => {
              const angle = -90 + (360 / 16) * idx;
              const rad = (angle * Math.PI) / 180;
              // Rayon orbital adaptatif (125px sur petit écran, 170px sur grand écran)
              const rDesktop = 170;
              const rMobile = 125;
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
                  className="[--r:125px] sm:[--r:170px] z-10"
                >
                  <button
                    onClick={() => {
                      setActiveStakeholderModal(stk);
                      setIsStakeholderPlaying(false);
                      setShowQuestion(false);
                      setResonancePct(null);
                    }}
                    onMouseEnter={() => setHoveredStakeholder(stk)}
                    onMouseLeave={() => setHoveredStakeholder(null)}
                    className="relative group flex flex-col items-center cursor-pointer transition-transform duration-200 hover:scale-125 focus:outline-none"
                    title={`${stk.name} (${stk.roleCategory} - ${stk.roleDetail || ''})`}
                  >
                    {/* Pastille ronde intervenant avec contour Terre Cuite */}
                    <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-white shadow-md group-hover:border-[#A2482B] group-hover:shadow-lg transition-all duration-200 bg-stone-900">
                      <img 
                        src={stk.photoUrl} 
                        alt={stk.name}
                        className="w-full h-full object-cover" 
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                    </div>

                    {/* Prénom sobre en dessous */}
                    <span className="text-[8px] sm:text-[9.5px] font-semibold text-stone-800 bg-white/90 backdrop-blur-xs px-1.5 py-0.2 rounded-full border border-stone-200 shadow-xs mt-0.5 max-w-[62px] sm:max-w-[76px] truncate text-center">
                      {stk.name.split(' ')[0]}
                    </span>

                    {/* Rôle abrégé coloré en badge miniature */}
                    <span 
                      className={`text-[6.5px] sm:text-[7.5px] font-bold uppercase tracking-wider px-1 rounded-sm mt-0.5 ${
                        stk.roleCategory === 'Fondateur'
                          ? 'bg-[#A2482B] text-white'
                          : stk.roleCategory === 'Collaborateur'
                          ? 'bg-amber-100 text-amber-900'
                          : stk.roleCategory === 'Client'
                          ? 'bg-emerald-100 text-emerald-900'
                          : stk.roleCategory === 'Partenaire'
                          ? 'bg-sky-100 text-sky-900'
                          : 'bg-stone-100 text-stone-800'
                      }`}
                    >
                      {stk.roleCategory}
                    </span>
                  </button>
                </div>
              );
            })
          ) : (
            /* NIVEAU 1 : LES 16 ORGANISATIONS EN ORBITE */
            companies.slice(0, 16).map((org, idx) => {
              const angle = -90 + (360 / 16) * idx;
              const rad = (angle * Math.PI) / 180;

              return (
                <div
                  key={`org-satellite-${org.id}`}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: `translate(-50%, -50%) translate(calc(var(--r) * ${Math.cos(rad)}) , calc(var(--r) * ${Math.sin(rad)}))`
                  }}
                  className="[--r:125px] sm:[--r:170px] z-10"
                >
                  <button
                    onClick={() => handleSelectOrg(org)}
                    onMouseEnter={() => setHoveredOrg(org)}
                    onMouseLeave={() => setHoveredOrg(null)}
                    className="relative group flex flex-col items-center cursor-pointer transition-transform duration-200 hover:scale-125 focus:outline-none"
                    title={`${org.companyName} (${org.category})`}
                  >
                    {/* Pastille logo organisation */}
                    <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-white shadow-md group-hover:border-[#A2482B] group-hover:shadow-lg transition-all duration-200 bg-stone-900">
                      <img 
                        src={org.photoUrl} 
                        alt={org.companyName}
                        className="w-full h-full object-cover" 
                      />
                    </div>

                    {/* Nom de l'organisation */}
                    <span className="text-[8px] sm:text-[9.5px] font-bold text-stone-900 bg-white/90 backdrop-blur-xs px-1.5 py-0.2 rounded-full border border-stone-200 shadow-xs mt-0.5 max-w-[65px] sm:max-w-[80px] truncate text-center">
                      {org.companyName}
                    </span>
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* BANDEAU INFORMATIF INFÉRIEUR (APerçu du survol / guide de navigation)     */}
      {/* ========================================================================= */}
      <div className="w-full max-w-md mx-auto text-center shrink-0 pt-1 pb-1">
        {activeCompany ? (
          <div className="px-3 py-1.5 rounded-2xl bg-white border border-stone-200 shadow-xs flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 truncate">
              <span className="w-2 h-2 rounded-full bg-[#A2482B] shrink-0" />
              <span className="font-semibold text-stone-900 truncate">
                {hoveredStakeholder ? `${hoveredStakeholder.name} · ${hoveredStakeholder.roleDetail || hoveredStakeholder.roleCategory}` : activeCompany.tagline}
              </span>
            </div>
            <span className="text-[10px] text-stone-600 font-medium shrink-0">
              16 regards en orbite
            </span>
          </div>
        ) : (
          <div className="px-3 py-1.5 rounded-2xl bg-white border border-stone-200 shadow-xs flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 truncate">
              <span className="w-2 h-2 rounded-full bg-[#C89B3C] shrink-0" />
              <span className="font-semibold text-stone-900 truncate">
                {hoveredOrg ? `${hoveredOrg.companyName} · ${hoveredOrg.tagline}` : 'Cliquez sur une organisation pour explorer son écosystème'}
              </span>
            </div>
            <span className="text-[10px] text-stone-600 font-medium shrink-0">
              16 organisations
            </span>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODALE TÉMOIGNAGE VIDÉO D'UN INTERVENANT EN ORBITE                        */}
      {/* Règles strictes : question masquée par défaut (affichée au clic BookOpen) */}
      {/* Bouton muet actif seulement en cours de lecture, petite télé en haut droit  */}
      {/* ========================================================================= */}
      {activeStakeholderModal && (
        <div 
          onClick={() => setActiveStakeholderModal(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative aspect-[9/16] w-full max-w-[340px] sm:max-w-[380px] h-auto max-h-[calc(100dvh-40px)] rounded-3xl overflow-hidden bg-stone-950 text-white shadow-2xl border border-white/20 flex flex-col justify-between p-4 select-none"
          >
            {/* Arrière-plan photo ou vidéo */}
            <img 
              src={activeStakeholderModal.photoUrl} 
              alt={activeStakeholderModal.name}
              className="absolute inset-0 w-full h-full object-cover pointer-events-none" 
            />
            {isStakeholderPlaying && (
              <video
                src={activeStakeholderModal.videoUrl}
                autoPlay
                playsInline
                loop
                muted={isStakeholderMuted}
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/45 pointer-events-none" />

            {/* HAUT : Badge rôle de l'intervenant + Contrôles (Muet, Petite Télé, Fermer) */}
            <div className="relative z-20 flex items-center justify-between pointer-events-auto">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[10px] sm:text-xs font-bold text-white shadow-sm">
                <span>{activeStakeholderModal.roleCategory}</span>
                {activeStakeholderModal.roleDetail && (
                  <span className="text-stone-300 font-normal">· {activeStakeholderModal.roleDetail}</span>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                {/* Bouton Muet : uniquement visible quand la vidéo joue */}
                {isStakeholderPlaying && (
                  <button
                    onClick={() => setIsStakeholderMuted(!isStakeholderMuted)}
                    className="w-8 h-8 rounded-lg bg-black/50 hover:bg-[#A2482B] backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer shadow-md"
                    title={isStakeholderMuted ? "Activer le son" : "Couper le son"}
                  >
                    {isStakeholderMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  </button>
                )}

                {/* Déclencheur officiel Petite Télé en haut à droite */}
                <button
                  onClick={() => setIsStakeholderPlaying(!isStakeholderPlaying)}
                  className="w-8.5 h-8.5 rounded-lg bg-black/45 hover:bg-[#A2482B] backdrop-blur-md border border-white/20 hover:border-[#A2482B] text-white flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-95 shrink-0"
                  title={isStakeholderPlaying ? "Mettre en pause" : "Regarder le témoignage"}
                >
                  {isStakeholderPlaying ? (
                    <Pause className="w-3.5 h-3.5 fill-white text-white" />
                  ) : (
                    <TvPlayerIcon className="w-5 h-5 text-white transition-transform" strokeWidth={1.6} />
                  )}
                </button>

                {/* Bouton Fermer */}
                <button
                  onClick={() => setActiveStakeholderModal(null)}
                  className="w-8 h-8 rounded-lg bg-black/50 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer shadow-md"
                  title="Fermer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* FLANC DROIT : Actions (Résonance, Question existentielle, Profil officiel, Partage) */}
            <div className="absolute right-3 top-[60%] -translate-y-1/2 z-30 flex flex-col items-center gap-2.5 pointer-events-auto">
              {/* 1. Évaluation Résonance */}
              <button
                onClick={() => setResonancePct(prev => prev === null ? 85 : null)}
                className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-95 ${
                  resonancePct !== null
                    ? 'bg-[#A2482B] border-[#A2482B] text-white shadow-[0_0_12px_rgba(162,72,43,0.5)]'
                    : 'bg-black/45 hover:bg-[#A2482B] border-white/20 hover:border-[#A2482B] text-white backdrop-blur-md'
                }`}
                title="Évaluer la résonance du témoignage"
              >
                <Award className="w-4 h-4 text-white" />
              </button>

              {/* 2. Question : bascule l'affichage du bloc question en bas */}
              <button
                onClick={() => setShowQuestion(!showQuestion)}
                className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-95 ${
                  showQuestion
                    ? 'bg-[#FFE7A3] text-stone-900 border-[#FFE7A3]'
                    : 'bg-black/45 hover:bg-[#A2482B] border-white/20 hover:border-[#A2482B] text-white backdrop-blur-md'
                }`}
                title="Afficher / Masquer la question"
              >
                <BookOpen className="w-4 h-4" />
              </button>

              {/* 3. Profil officiel (ProfileSoloIcon) */}
              <button
                onClick={() => {
                  if (onNavigate) {
                    onNavigate({ type: 'profile' });
                  }
                }}
                className="w-9 h-9 rounded-xl bg-black/45 hover:bg-[#A2482B] backdrop-blur-md border border-white/20 hover:border-[#A2482B] text-white flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-95"
                title={`Profil de ${activeStakeholderModal.name}`}
              >
                <ProfileSoloIcon className="w-4.5 h-4.5 text-white" />
              </button>

              {/* 4. Partager */}
              <button
                onClick={() => handleShareStakeholder(activeStakeholderModal)}
                className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-95 ${
                  copied
                    ? 'bg-emerald-600 border-emerald-500 text-white'
                    : 'bg-black/45 hover:bg-[#A2482B] border-white/20 text-white backdrop-blur-md'
                }`}
                title="Copier le lien direct de ce témoignage"
              >
                <ShareIcon className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* BAS : Prénom + Question dévoilée à la demande */}
            <div className="relative z-20 space-y-2 pointer-events-auto">
              {/* Question dévoilée uniquement au clic sur l'icône BookOpen */}
              {showQuestion && activeStakeholderModal.question && (
                <div className="p-3 rounded-2xl bg-black/80 backdrop-blur-md border border-white/20 text-xs text-stone-100 shadow-xl animate-in slide-in-from-bottom-2 duration-200">
                  <div className="flex items-center gap-1.5 text-[#FFE7A3] font-bold text-[10px] uppercase tracking-wider mb-1">
                    <BookOpen className="w-3 h-3" />
                    <span>Question posée</span>
                  </div>
                  <p className="italic leading-relaxed">
                    « {activeStakeholderModal.question} »
                  </p>
                </div>
              )}

              <div>
                <h3 className="font-editorial text-xl sm:text-2xl font-bold text-white drop-shadow-md">
                  {activeStakeholderModal.name}
                </h3>
                <p className="text-xs text-stone-300 font-medium mt-0.5">
                  {activeCompany?.companyName}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODALE MANIFESTE VIDÉO DE L'ORGANISATION CENTRALE                         */}
      {/* ========================================================================= */}
      {showManifestoModal && activeCompany && (
        <div 
          onClick={() => setShowManifestoModal(false)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative aspect-[9/16] w-full max-w-[340px] sm:max-w-[380px] h-auto max-h-[calc(100dvh-40px)] rounded-3xl overflow-hidden bg-stone-950 text-white shadow-2xl border border-white/20 flex flex-col justify-between p-4 select-none"
          >
            <img 
              src={activeCompany.photoUrl} 
              alt={activeCompany.companyName}
              className="absolute inset-0 w-full h-full object-cover pointer-events-none" 
            />
            {isManifestoPlaying && (
              <video
                src={activeCompany.manifestoVideoUrl || activeCompany.videoUrl}
                autoPlay
                playsInline
                loop
                muted={isManifestoMuted}
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/50 pointer-events-none" />

            {/* HAUT : Badge Manifeste + Déclencheur Petite Télé */}
            <div className="relative z-20 flex items-center justify-between pointer-events-auto">
              <span className="px-3 py-1 rounded-full bg-[#A2482B] text-white text-[10px] sm:text-xs font-bold tracking-wide shadow-sm">
                Manifeste Institutionnel
              </span>

              <div className="flex items-center gap-1.5">
                {isManifestoPlaying && (
                  <button
                    onClick={() => setIsManifestoMuted(!isManifestoMuted)}
                    className="w-8 h-8 rounded-lg bg-black/50 hover:bg-[#A2482B] backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer shadow-md"
                    title={isManifestoMuted ? "Activer le son" : "Couper le son"}
                  >
                    {isManifestoMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  </button>
                )}

                <button
                  onClick={() => setIsManifestoPlaying(!isManifestoPlaying)}
                  className="w-8.5 h-8.5 rounded-lg bg-black/45 hover:bg-[#A2482B] backdrop-blur-md border border-white/20 hover:border-[#A2482B] text-white flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-95 shrink-0"
                  title={isManifestoPlaying ? "Mettre en pause" : "Lancer le manifeste"}
                >
                  {isManifestoPlaying ? (
                    <Pause className="w-3.5 h-3.5 fill-white text-white" />
                  ) : (
                    <TvPlayerIcon className="w-5 h-5 text-white transition-transform" strokeWidth={1.6} />
                  )}
                </button>

                <button
                  onClick={() => setShowManifestoModal(false)}
                  className="w-8 h-8 rounded-lg bg-black/50 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer shadow-md"
                  title="Fermer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* BAS : Carte d'identité et devise fondatrice */}
            <div className="relative z-20 space-y-2 pointer-events-auto">
              <div className="p-3 rounded-2xl bg-black/70 backdrop-blur-md border border-white/15 text-xs text-stone-200 space-y-1.5 shadow-xl">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#FFE7A3] block">
                  Devise & Raison d'être
                </span>
                <p className="italic font-medium text-white leading-relaxed">
                  « {activeCompany.tagline} »
                </p>
                {activeCompany.description && (
                  <p className="text-[11px] text-stone-300 leading-relaxed border-t border-white/10 pt-1.5 mt-1.5">
                    {activeCompany.description}
                  </p>
                )}
                {activeCompany.location && (
                  <div className="text-[10px] text-stone-400 pt-0.5">
                    Implantation : {activeCompany.location} {activeCompany.foundedYear && `· Depuis ${activeCompany.foundedYear}`}
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-editorial text-2xl font-bold text-white drop-shadow-md">
                  {activeCompany.companyName}
                </h3>
                <span className="text-xs text-[#C89B3C] font-semibold">
                  {activeCompany.category}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
