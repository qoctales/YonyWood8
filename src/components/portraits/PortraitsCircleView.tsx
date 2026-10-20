import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  RotateCw, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  X, 
  Award, 
  BookOpen, 
  Check, 
  ChevronLeft, 
  ChevronRight,
  Info
} from 'lucide-react';
import { CompanyEntity, CompanyStakeholder } from '../../data/companyPortraitsData';
import { ShareIcon } from '../ShareIcon';
import { ResonanceModal } from '../ResonanceModal';
import { ProfileSoloIcon, TvPlayerIcon, PortraitsViseurIcon } from '../YonywoodBrandIcons';
import { ViewScreen } from '../../types';

interface PortraitsCircleViewProps {
  companies: CompanyEntity[];
  selectedCompany: CompanyEntity | null;
  onSelectCompany: (company: CompanyEntity | null) => void;
  onNavigate?: (screen: ViewScreen) => void;
}

export const PortraitsCircleView: React.FC<PortraitsCircleViewProps> = ({
  companies,
  selectedCompany,
  onSelectCompany,
  onNavigate
}) => {
  // Volet actif des intervenants (16 par volet)
  const [activeBatchIndex, setActiveBatchIndex] = useState(0);
  const [isRotating, setIsRotating] = useState(false);

  // Intervenant actuellement sélectionné pour visionnage vidéo
  const [activeStakeholder, setActiveStakeholder] = useState<CompanyStakeholder | null>(null);
  const [isStakeholderPlaying, setIsStakeholderPlaying] = useState(false);
  const [isStakeholderMuted, setIsStakeholderMuted] = useState(false);

  // Modale vidéo manifeste de l'organisation (Soleil central)
  const [showManifestoModal, setShowManifestoModal] = useState(false);
  const [isManifestoPlaying, setIsManifestoPlaying] = useState(true);
  const [isManifestoMuted, setIsManifestoMuted] = useState(false);

  // Modales d'interaction pour les intervenants
  const [resonanceTargetStakeholder, setResonanceTargetStakeholder] = useState<CompanyStakeholder | null>(null);
  const [stakeholderResonances, setStakeholderResonances] = useState<Record<string, number>>({});
  const [questionModalStakeholder, setQuestionModalStakeholder] = useState<CompanyStakeholder | null>(null);

  // Survol discret
  const [hoveredEntity, setHoveredEntity] = useState<{ title: string; subtitle: string } | null>(null);

  // Partage
  const [copied, setCopied] = useState(false);

  // Calcul du nombre de volets de 16 intervenants pour l'organisation sélectionnée
  const totalStakeholders = selectedCompany?.stakeholders.length || 0;
  const totalBatches = Math.max(1, Math.ceil(totalStakeholders / 16));

  // 16 intervenants affichés sur l'orbite selon le volet actif
  const currentBatchStakeholders = useMemo(() => {
    if (!selectedCompany) return [];
    const start = activeBatchIndex * 16;
    const slice = selectedCompany.stakeholders.slice(start, start + 16);
    // Si moins de 16, répéter ou compléter harmonieusement pour préserver les 16 rayons
    if (slice.length < 16 && selectedCompany.stakeholders.length > 0) {
      const full: CompanyStakeholder[] = [];
      for (let i = 0; i < 16; i++) {
        full.push(selectedCompany.stakeholders[i % selectedCompany.stakeholders.length]);
      }
      return full;
    }
    return slice;
  }, [selectedCompany, activeBatchIndex]);

  // Actualisation vers les 16 regards suivants
  const handleNextBatch = () => {
    setIsRotating(true);
    setActiveStakeholder(null);
    setIsStakeholderPlaying(false);
    setTimeout(() => {
      setActiveBatchIndex(prev => (prev + 1) % totalBatches);
      setIsRotating(false);
    }, 280);
  };

  // Copie de lien
  const handleShare = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const url = selectedCompany 
      ? `${window.location.origin}?company=${selectedCompany.id}`
      : `${window.location.origin}?mode=circle`;
    navigator.clipboard?.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Configuration trigonométrique des 16 positions orbitales
  const angleStep = (2 * Math.PI) / 16;
  // Rayon adaptatif pour tenir confortablement dans le cadre sans chevaucher les bordures
  const orbitRadius = 188;

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden select-none">
      
      {/* ========================================================================= */}
      {/* BARRE HAUTE DE CONTRÔLE DU CERCLE                                        */}
      {/* ========================================================================= */}
      <div className="relative z-30 flex items-center justify-between px-2 sm:px-4 py-1.5 bg-white/80 backdrop-blur-md border border-stone-200/70 rounded-2xl mx-auto w-full max-w-[min(100%,calc(2*310px+32px))] shrink-0 mb-1 shadow-2xs">
        <div className="flex items-center gap-2 min-w-0">
          {selectedCompany ? (
            <button
              onClick={() => {
                onSelectCompany(null);
                setActiveStakeholder(null);
                setIsStakeholderPlaying(false);
                setActiveBatchIndex(0);
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-100 hover:bg-[#A2482B] text-stone-700 hover:text-white border border-stone-200 transition-all text-xs font-semibold cursor-pointer shadow-2xs group shrink-0"
              title="Retour au cercle des 16 organisations"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>16 Organisations</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 px-2 py-0.5 text-xs font-semibold text-stone-700">
              <PortraitsViseurIcon className="w-4 h-4 text-[#A2482B]" isActive={false} />
              <span className="truncate">Constellation des 16 Organisations</span>
            </div>
          )}

          {/* Nom de l'entité sélectionnée */}
          {selectedCompany && (
            <span className="text-xs sm:text-[13px] font-bold text-stone-900 font-editorial truncate max-w-[140px] sm:max-w-[200px]">
              {selectedCompany.companyName}
            </span>
          )}
        </div>

        {/* Droite : Bouton circulaire d'actualisation avec compteur de volets & Partage */}
        <div className="flex items-center gap-1.5 shrink-0">
          {selectedCompany && totalBatches > 1 && (
            <button
              onClick={handleNextBatch}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white hover:bg-stone-100 text-stone-800 border border-stone-200 text-[11px] font-semibold transition-all cursor-pointer shadow-2xs group active:scale-95"
              title={`Passer au volet suivant (${totalBatches} volets de 16 regards)`}
            >
              <RotateCw className={`w-3.5 h-3.5 text-[#A2482B] transition-transform duration-300 ${isRotating ? 'rotate-180' : 'group-hover:rotate-45'}`} />
              <span className="hidden sm:inline">Regards {activeBatchIndex * 16 + 1}–{Math.min((activeBatchIndex + 1) * 16, totalStakeholders)} / {totalStakeholders}</span>
              <span className="sm:hidden font-mono text-[10px]">Volet {activeBatchIndex + 1}/{totalBatches}</span>
            </button>
          )}

          {/* Bouton Partager */}
          <button
            onClick={handleShare}
            className="p-1.5 rounded-full border border-stone-200 hover:bg-stone-100 text-stone-600 hover:text-stone-900 transition-all cursor-pointer"
            title="Partager cette vue circulaire"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <ShareIcon className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CADRE CENTRAL : L'ASTROLABE DU SOLEIL ET DES 16 SATELLITES                */}
      {/* ========================================================================= */}
      <div className="relative flex-1 w-full max-w-[min(100%,calc(2*310px+32px))] mx-auto rounded-3xl overflow-hidden bg-[#FAF8F5] border border-stone-200/90 shadow-xl flex items-center justify-center p-2 sm:p-4 min-h-[460px] sm:min-h-[500px]">
        
        {/* Lignes radiales et orbites discrètes en SVG */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="-240 -240 480 480">
          <defs>
            <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#A2482B" stopOpacity="0.12" />
              <stop offset="60%" stopColor="#C89B3C" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#FAF8F5" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Rayonnement central */}
          <circle cx="0" cy="0" r={orbitRadius * 0.72} fill="url(#sunGlow)" />

          {/* Anneau d'orbite subtil */}
          <circle cx="0" cy="0" r={orbitRadius} fill="none" stroke="#E7E2DA" strokeWidth="1.2" strokeDasharray="3 3" />
          <circle cx="0" cy="0" r={orbitRadius * 0.58} fill="none" stroke="#EFECE6" strokeWidth="1" />

          {/* 16 Rayons géométriques */}
          {Array.from({ length: 16 }).map((_, i) => {
            const angle = i * angleStep - Math.PI / 2;
            const x = Math.cos(angle) * orbitRadius;
            const y = Math.sin(angle) * orbitRadius;
            return (
              <line
                key={`ray-${i}`}
                x1="0"
                y1="0"
                x2={x}
                y2={y}
                stroke="#D6CEBE"
                strokeWidth="1"
                strokeDasharray="2 3"
                opacity={0.55}
              />
            );
          })}
        </svg>

        {/* ======================================================================= */}
        {/* PÔLE CENTRAL : NIVEAU 1 (BOUSSOLE) OU NIVEAU 2 (SOLEIL DE L'ORGANISATION)*/}
        {/* ======================================================================= */}
        {!selectedCompany ? (
          /* NIVEAU 1 : Centre de l'univers des Portraits */
          <div className="relative z-20 flex flex-col items-center justify-center text-center max-w-[200px] sm:max-w-[230px] p-4 rounded-3xl bg-white/95 border border-stone-200 shadow-lg transition-transform duration-300 hover:scale-103 cursor-default">
            <div className="w-13 h-13 sm:w-15 sm:h-15 rounded-2xl bg-[#A2482B]/10 border border-[#A2482B]/30 text-[#A2482B] flex items-center justify-center mb-2.5 shadow-inner">
              <PortraitsViseurIcon className="w-7 h-7 sm:w-8 sm:h-8" isActive={true} strokeWidth={2.2} />
            </div>
            <h3 className="font-editorial text-sm sm:text-base font-bold text-stone-900 leading-snug tracking-tight mb-1">
              Portraits de Marques & Associations
            </h3>
            <p className="text-[10px] sm:text-[11px] text-stone-500 font-medium leading-relaxed">
              Cliquez sur une organisation en orbite pour faire entrer son Soleil au centre et révéler ses 16 regards.
            </p>
          </div>
        ) : (
          /* NIVEAU 2 : L'organisation sélectionnée est au centre (« Reviens Devient le Soleil ») */
          <div className="relative z-20 flex flex-col items-center justify-center text-center max-w-[200px] sm:max-w-[230px] p-3 sm:p-4 rounded-3xl bg-white/95 border-2 border-[#A2482B]/40 shadow-xl transition-all duration-300">
            {/* Logo de l'organisation avec halo terracotta */}
            <div 
              onClick={() => setShowManifestoModal(true)}
              className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-[#A2482B] shadow-md mb-2 cursor-pointer group hover:scale-105 active:scale-95 transition-transform"
              title="Cliquez pour lancer le manifeste vidéo de l'organisation"
            >
              <img 
                src={selectedCompany.logoUrl || selectedCompany.photoUrl} 
                alt={selectedCompany.companyName}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Play className="w-6 h-6 text-white fill-white" />
              </div>
            </div>

            {/* Nom & Catégorie */}
            <h3 className="font-editorial text-xs sm:text-sm font-bold text-stone-900 leading-tight mb-0.5 truncate max-w-full">
              {selectedCompany.companyName}
            </h3>
            <span className="text-[10px] sm:text-[10.5px] font-semibold text-[#A2482B] block uppercase tracking-wider mb-2">
              {selectedCompany.category}
            </span>

            {/* Bouton de lecture du manifeste vidéo */}
            <button
              onClick={() => setShowManifestoModal(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#A2482B] hover:bg-[#8A3B22] text-white text-[10.5px] sm:text-xs font-semibold shadow-xs cursor-pointer transition-all hover:scale-103 active:scale-95"
              title="Regarder le manifeste vidéo officiel"
            >
              <TvPlayerIcon className="w-3.5 h-3.5 text-white" strokeWidth={2} />
              <span>Manifeste</span>
            </button>
          </div>
        )}

        {/* ======================================================================= */}
        {/* LES 16 SATELLITES EN ORBITE (NIVEAU 1 : ORGANISATIONS / NIVEAU 2 : REGARDS) */}
        {/* ======================================================================= */}
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isRotating ? 'opacity-30 scale-95' : 'opacity-100 scale-100'}`}>
          {!selectedCompany ? (
            /* 16 ORGANISATIONS EN ORBITE (NIVEAU 1) */
            companies.slice(0, 16).map((comp, i) => {
              const angle = i * angleStep - Math.PI / 2;
              const x = Math.cos(angle) * orbitRadius;
              const y = Math.sin(angle) * orbitRadius;

              return (
                <div
                  key={`company-satellite-${comp.id}`}
                  style={{ transform: `translate(${x}px, ${y}px)` }}
                  onClick={() => {
                    onSelectCompany(comp);
                    setActiveBatchIndex(0);
                    setActiveStakeholder(null);
                  }}
                  onMouseEnter={() => setHoveredEntity({ title: comp.companyName, subtitle: comp.category })}
                  onMouseLeave={() => setHoveredEntity(null)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 hover:z-30 hover:scale-125 transition-all duration-300 group"
                  title={`${comp.companyName} (${comp.category})`}
                >
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden border-2 border-white shadow-md ring-1.5 ring-stone-300 group-hover:ring-[#A2482B] group-hover:border-[#A2482B] transition-all bg-stone-900">
                    <img 
                      src={comp.logoUrl || comp.photoUrl} 
                      alt={comp.companyName} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                </div>
              );
            })
          ) : (
            /* 16 INTERVENANTS / REGARDS EN ORBITE (NIVEAU 2) */
            currentBatchStakeholders.map((person, i) => {
              const angle = i * angleStep - Math.PI / 2;
              const x = Math.cos(angle) * orbitRadius;
              const y = Math.sin(angle) * orbitRadius;
              const isSelected = activeStakeholder?.id === person.id;

              return (
                <div
                  key={`stakeholder-${person.id}-${i}`}
                  style={{ transform: `translate(${x}px, ${y}px)` }}
                  onClick={() => {
                    setActiveStakeholder(person);
                    setIsStakeholderPlaying(true);
                  }}
                  onMouseEnter={() => setHoveredEntity({ 
                    title: person.name, 
                    subtitle: `${person.roleCategory}${person.roleDetail ? ` · ${person.roleDetail}` : ''}` 
                  })}
                  onMouseLeave={() => setHoveredEntity(null)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 hover:z-30 hover:scale-125 transition-all duration-300 group"
                  title={`${person.name} (${person.roleCategory})`}
                >
                  <div className={`w-9.5 h-9.5 sm:w-11 sm:h-11 rounded-full overflow-hidden border-2 border-white shadow-md transition-all ${
                    isSelected
                      ? 'ring-2.5 ring-[#A2482B] ring-offset-2 ring-offset-[#FAF8F5] scale-115'
                      : 'ring-1.5 ring-stone-300 group-hover:ring-[#A2482B]'
                  }`}>
                    <img 
                      src={person.photoUrl} 
                      alt={person.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Info-bulle flottante discrète lors du survol */}
        {hoveredEntity && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 px-3 py-1 rounded-full bg-stone-900/90 text-white backdrop-blur-md border border-white/20 shadow-lg text-center pointer-events-none animate-in fade-in duration-150">
            <span className="text-xs font-bold font-editorial">{hoveredEntity.title}</span>
            <span className="text-[10px] text-stone-300 block">{hoveredEntity.subtitle}</span>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODALE DU MANIFESTE VIDÉO DE L'ORGANISATION (SOLEIL CENTRAL)              */}
      {/* ========================================================================= */}
      {showManifestoModal && selectedCompany && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => {
            setShowManifestoModal(false);
            setIsManifestoPlaying(false);
          }}
        >
          <div 
            className="relative w-full max-w-lg bg-stone-950 text-white rounded-3xl overflow-hidden shadow-2xl border border-stone-800 animate-in zoom-in-95 duration-200 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Haut de modale */}
            <div className="flex items-center justify-between p-3.5 sm:p-4 bg-stone-900/80 border-b border-stone-800">
              <div className="min-w-0 pr-2">
                <span className="text-[10px] font-bold text-[#A2482B] uppercase tracking-wider block">
                  Manifeste Officiel · {selectedCompany.category}
                </span>
                <h3 className="font-editorial text-sm sm:text-base font-bold text-white truncate">
                  {selectedCompany.companyName}
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowManifestoModal(false);
                  setIsManifestoPlaying(false);
                }}
                className="p-1.5 rounded-full hover:bg-stone-800 text-stone-400 hover:text-white transition-colors cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Lecteur Vidéo du Manifeste */}
            <div className="relative aspect-video w-full bg-black flex items-center justify-center">
              <video
                src={selectedCompany.manifestoVideoUrl || selectedCompany.videoUrl}
                autoPlay
                loop
                playsInline
                muted={isManifestoMuted}
                className="w-full h-full object-cover"
              />
              
              {/* Contrôles Vidéo superposés discrets */}
              <div className="absolute bottom-2 right-2 flex items-center gap-2">
                <button
                  onClick={() => setIsManifestoMuted(!isManifestoMuted)}
                  className="p-1.5 rounded-full bg-black/60 hover:bg-[#A2482B] text-white border border-white/20 transition-all cursor-pointer"
                  title={isManifestoMuted ? "Activer le son" : "Couper le son"}
                >
                  {isManifestoMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Contenu et question fondatrice du manifeste */}
            <div className="p-4 sm:p-5 space-y-3 bg-stone-900/60">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-[10px] font-semibold text-stone-400 block mb-1">
                  Question fondatrice de l'organisation :
                </span>
                <p className="font-serif text-sm sm:text-base text-stone-200 italic leading-snug">
                  « {selectedCompany.manifestoQuestion || selectedCompany.tagline} »
                </p>
              </div>

              <p className="text-xs sm:text-[13px] text-stone-300 leading-relaxed">
                {selectedCompany.manifestoDescription || selectedCompany.tagline}
              </p>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-stone-400">
                  Écosystème : {selectedCompany.stakeholders.length} voix enregistrées
                </span>
                <button
                  onClick={() => {
                    setShowManifestoModal(false);
                    setIsManifestoPlaying(false);
                  }}
                  className="px-4 py-1.5 rounded-full bg-[#A2482B] hover:bg-[#8A3B22] text-white text-xs font-semibold cursor-pointer transition-all"
                >
                  Explorer les regards
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODALE DU TÉMOIGNAGE VIDÉO D'UN INTERVENANT EN ORBITE                    */}
      {/* ========================================================================= */}
      {activeStakeholder && selectedCompany && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 select-none"
          onClick={() => {
            setActiveStakeholder(null);
            setIsStakeholderPlaying(false);
          }}
        >
          <div 
            className="group relative rounded-2xl sm:rounded-3xl overflow-hidden bg-[#151513] text-white shadow-2xl border border-stone-200/40 flex flex-col justify-between 
              aspect-[9/16] 
              w-[min(calc(100vw-32px),calc((100dvh-200px)*9/16))] 
              max-w-[280px] sm:max-w-[290px] 
              h-[min(500px,calc(100dvh-200px))] 
              mx-auto shrink-0 select-none animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Vidéo de l'intervenant */}
            {isStakeholderPlaying ? (
              <video
                src={activeStakeholder.videoUrl}
                autoPlay
                loop
                playsInline
                muted={isStakeholderMuted}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <img
                src={activeStakeholder.photoUrl}
                alt={activeStakeholder.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/65 pointer-events-none" />

            {/* Haut : Nom organisation & Contrôles */}
            <div className="absolute top-3 sm:top-3.5 left-3 sm:left-3.5 right-3 sm:right-3.5 z-20 flex items-center justify-between pointer-events-auto">
              <span className="px-2.5 sm:px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[10px] sm:text-[11px] font-semibold text-white tracking-wider truncate max-w-[70%]">
                {selectedCompany.companyName}
              </span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsStakeholderPlaying(prev => !prev)}
                  className="w-6.5 h-6.5 sm:w-7 sm:h-7 rounded-lg sm:rounded-xl bg-black/45 hover:bg-[#A2482B] backdrop-blur-md border border-white/20 hover:border-[#A2482B] text-white flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer hover:scale-105 active:scale-95 shrink-0"
                  title={isStakeholderPlaying ? "Pause" : "Lecture"}
                >
                  {isStakeholderPlaying ? <Pause className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-white" /> : <Play className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-white" />}
                </button>
                <button
                  onClick={() => {
                    setActiveStakeholder(null);
                    setIsStakeholderPlaying(false);
                  }}
                  className="w-6.5 h-6.5 sm:w-7 sm:h-7 rounded-lg sm:rounded-xl bg-black/45 hover:bg-stone-800 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer hover:scale-105 active:scale-95 shrink-0"
                  title="Fermer"
                >
                  <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </button>
              </div>
            </div>

            {/* Flanc droit : Résonance, Question, Profil, Partager (icônes réduites de moitié) */}
            <div 
              onClick={(e) => e.stopPropagation()}
              className="absolute right-2.5 sm:right-3.5 top-[56%] sm:top-[58%] -translate-y-1/2 z-20 flex flex-col items-center gap-1.5 sm:gap-2 pointer-events-auto"
            >
              {/* 1. Évaluation résonance */}
              <button
                onClick={() => setResonanceTargetStakeholder(activeStakeholder)}
                className={`w-6.5 h-6.5 sm:w-7 sm:h-7 rounded-lg sm:rounded-xl border flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer hover:scale-105 active:scale-95 ${
                  stakeholderResonances[activeStakeholder.id] !== undefined
                    ? 'bg-[#A2482B] border-[#A2482B] text-white shadow-[0_0_10px_rgba(162,72,43,0.5)]'
                    : 'bg-black/45 hover:bg-[#A2482B] border-white/20 hover:border-[#A2482B] text-white backdrop-blur-md'
                }`}
                title={stakeholderResonances[activeStakeholder.id] !== undefined ? `Résonance : ${stakeholderResonances[activeStakeholder.id]}%` : "Évaluer la résonance"}
              >
                <Award className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
              </button>

              {/* 2. Question existentielle */}
              <button
                onClick={() => setQuestionModalStakeholder(activeStakeholder)}
                className="w-6.5 h-6.5 sm:w-7 sm:h-7 rounded-lg sm:rounded-xl bg-black/45 hover:bg-[#A2482B] backdrop-blur-md border border-white/20 hover:border-[#A2482B] text-white flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer hover:scale-105 active:scale-95"
                title="Découvrir la question abordée"
              >
                <BookOpen className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
              </button>

              {/* 3. Découvrir le profil */}
              <button
                onClick={() => onNavigate && onNavigate({ type: 'profile' })}
                className="w-6.5 h-6.5 sm:w-7 sm:h-7 rounded-lg sm:rounded-xl bg-black/45 hover:bg-[#A2482B] backdrop-blur-md border border-white/20 hover:border-[#A2482B] text-white flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer hover:scale-105 active:scale-95"
                title={`Découvrir le profil de ${activeStakeholder.name}`}
              >
                <ProfileSoloIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              </button>

              {/* 4. Partager */}
              <button
                onClick={handleShare}
                className="w-6.5 h-6.5 sm:w-7 sm:h-7 rounded-lg sm:rounded-xl bg-black/45 hover:bg-[#A2482B] backdrop-blur-md border border-white/20 hover:border-[#A2482B] text-white flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer hover:scale-105 active:scale-95"
                title="Partager"
              >
                {copied ? <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" /> : <ShareIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />}
              </button>
            </div>

            {/* Bas : Prénom de l'intervenant harmonisé */}
            <div className="absolute bottom-3 sm:bottom-3.5 left-3 sm:left-3.5 z-20 pr-12 max-w-[75%] pointer-events-auto">
              <h3 className="font-editorial text-[15px] sm:text-[17px] md:text-[18px] font-bold text-white tracking-[0.08em] sm:tracking-[0.1em] leading-snug drop-shadow-md truncate">
                {activeStakeholder.name.split(' ')[0]}
              </h3>
              <span className="text-[10px] sm:text-[11px] text-white/80 font-medium block truncate mt-0.5">
                {activeStakeholder.roleCategory}{activeStakeholder.roleDetail ? ` · ${activeStakeholder.roleDetail}` : ''}
              </span>
            </div>

            {/* Symbole Muet (actif uniquement pendant la lecture vidéo) */}
            {isStakeholderPlaying && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsStakeholderMuted(prev => !prev);
                }}
                className="absolute bottom-3 right-3 w-6.5 h-6.5 rounded-full bg-black/50 hover:bg-[#A2482B] backdrop-blur-md border border-white/20 text-white flex items-center justify-center cursor-pointer transition-all shrink-0 z-20"
                title={isStakeholderMuted ? 'Activer le son' : 'Couper le son'}
              >
                {isStakeholderMuted ? <VolumeX className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" /> : <Volume2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Modale Résonance */}
      {resonanceTargetStakeholder && (
        <ResonanceModal
          isOpen={Boolean(resonanceTargetStakeholder)}
          onClose={() => setResonanceTargetStakeholder(null)}
          storyId={`company-${selectedCompany?.id || 'co'}-${resonanceTargetStakeholder.id}`}
          topicId={`Portraits · ${selectedCompany?.companyName}`}
          personName={resonanceTargetStakeholder.name.split(' ')[0]}
          initialPercentage={stakeholderResonances[resonanceTargetStakeholder.id]}
          onRatingSubmitted={(pct) => {
            setStakeholderResonances(prev => ({ ...prev, [resonanceTargetStakeholder.id]: pct }));
          }}
        />
      )}

      {/* Modale Question abordée au clic sur BookOpen */}
      {questionModalStakeholder && selectedCompany && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setQuestionModalStakeholder(null)}
        >
          <div 
            className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-stone-200 text-center animate-in zoom-in-95 duration-200 pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setQuestionModalStakeholder(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-full bg-[#A2482B]/10 text-[#A2482B] flex items-center justify-center mx-auto mb-4 border border-[#A2482B]/20">
              <BookOpen className="w-6 h-6" />
            </div>

            <h3 className="font-editorial text-base sm:text-lg font-bold text-[#1C1917] mb-1">
              {questionModalStakeholder.name.split(' ')[0]}
            </h3>
            <p className="text-xs text-stone-500 font-semibold mb-3">
              {questionModalStakeholder.roleCategory} · {selectedCompany.companyName}
            </p>

            <p className="font-serif-editorial text-base sm:text-lg text-stone-800 leading-relaxed italic px-2">
              « {questionModalStakeholder.question || "Quelle vision singulière ce parcours apporte-t-il à la communauté ?"} »
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
