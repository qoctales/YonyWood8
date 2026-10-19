import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, ArrowRight, X, Award, BookOpen, Sparkles, Clapperboard, Check } from 'lucide-react';
import { getLineageTree, LineageMember, LINEAGE_COLORS } from '../utils/lineageService';
import { ResonanceModal } from './ResonanceModal';
import { SequenceCreditsModal } from './SequenceCreditsModal';
import { getSeriesCredits } from '../data/seriesTeamData';
import { ProfileSoloIcon, TvPlayerIcon } from './YonywoodBrandIcons';
import { ShareIcon } from './ShareIcon';

interface ProfileLineageFriseProps {
  personIdOrName: string;
  onNavigateToPerson: (personId: string) => void;
  onClose?: () => void;
}

export const ProfileLineageFrise: React.FC<ProfileLineageFriseProps> = ({
  personIdOrName,
  onNavigateToPerson
}) => {
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [hoveredMemberId, setHoveredMemberId] = useState<string | null>(null);
  const [videoModalMember, setVideoModalMember] = useState<LineageMember | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isResonanceModalOpen, setIsResonanceModalOpen] = useState(false);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [isCreditsModalOpen, setIsCreditsModalOpen] = useState(false);
  const [personResonancePct, setPersonResonancePct] = useState<number | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Récupération de l'arbre de lignée (au moins 4 ascendants -> personne actuelle -> descendants)
  const tree = getLineageTree(personIdOrName);

  // Construction de la liste ordonnée des visages sur la frise
  const items: Array<{
    member: LineageMember;
    isCurrent: boolean;
    type: 'ascendant' | 'current' | 'descendant';
  }> = [
    ...tree.ascendants.map(m => ({ member: m, isCurrent: false, type: 'ascendant' as const })),
    { member: tree.current, isCurrent: true, type: 'current' as const },
    ...tree.descendants.map(m => ({ member: m, isCurrent: false, type: 'descendant' as const }))
  ];

  // Centrage automatique doux sur la personne actuelle pour pouvoir scroller vers le haut et vers le bas
  useEffect(() => {
    const timer = setTimeout(() => {
      const currentElem = document.getElementById(`frise-node-${tree.current.id}`);
      if (currentElem && scrollContainerRef.current) {
        currentElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [personIdOrName, tree.current.id]);

  const handleMemberClick = (member: LineageMember) => {
    // Clic sur un visage : sélectionne et ouvre immédiatement la carte vidéo format Héritage
    setSelectedMemberId(member.id);
    setVideoModalMember(member);
    setIsPlaying(true);
    setIsResonanceModalOpen(false);
    setIsQuestionModalOpen(false);
  };

  const togglePlayback = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div 
      id="profile-lineage-frise-container"
      className="relative w-full max-w-md mx-auto flex-1 min-h-0 h-full flex flex-col items-center justify-center animate-in fade-in duration-200 select-none overflow-hidden"
    >
      {/* Conteneur de la frise verticale (strictement contenu entre le header et la barre de nav) */}
      <div 
        ref={scrollContainerRef}
        id="profile-lineage-frise-scroll"
        className="relative flex-1 w-full h-full overflow-y-auto overflow-x-hidden no-scrollbar px-4 py-8 flex flex-col items-center scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* Liste des visages positionnés sur la ligne */}
        <div className="relative flex flex-col items-center gap-12 sm:gap-14 w-full my-auto py-10 min-h-full">
          {/* Ligne verticale ininterrompue reliant tous les maillons de la lignée du premier au tout dernier */}
          <div 
            className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2.5px] bg-[#A2482B] pointer-events-none z-0"
            style={{
              boxShadow: '0 0 8px rgba(162, 72, 43, 0.35)'
            }}
          />

          {items.map(({ member, isCurrent, type }, idx) => {
            const isSelected = selectedMemberId === member.id;
            const isHovered = hoveredMemberId === member.id;
            const firstName = member.firstName || member.name.split(' ')[0];
            const isFounder = member.isFounder === true;

            return (
              <div 
                key={`frise-node-${member.id}-${idx}`}
                id={`frise-node-${member.id}`}
                className="relative z-10 flex flex-col items-center"
                onMouseEnter={() => setHoveredMemberId(member.id)}
                onMouseLeave={() => setHoveredMemberId(null)}
              >
                {/* Ligne verticale de liaison continue vers le maillon suivant */}
                {idx < items.length - 1 && (
                  <div 
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[2.5px] bg-[#A2482B] pointer-events-none -z-10"
                    style={{
                      height: 'calc(100% + 3.5rem)',
                      boxShadow: '0 0 6px rgba(162, 72, 43, 0.35)'
                    }}
                  />
                )}

                {/* Prolongement vers le haut pour le premier maillon */}
                {idx === 0 && (
                  <div 
                    className="absolute bottom-1/2 left-1/2 -translate-x-1/2 w-[2.5px] h-16 bg-[#A2482B] pointer-events-none -z-10"
                    style={{
                      boxShadow: '0 0 6px rgba(162, 72, 43, 0.35)'
                    }}
                  />
                )}

                {/* Prolongement vers le bas pour le dernier maillon descendant */}
                {idx === items.length - 1 && (
                  <div 
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[2.5px] h-16 bg-[#A2482B] pointer-events-none -z-10"
                    style={{
                      boxShadow: '0 0 6px rgba(162, 72, 43, 0.35)'
                    }}
                  />
                )}
                {/* Bulle prénom épurée : uniquement le prénom, aucune data technique ni mention premier clic */}
                {(isSelected || isHovered || isCurrent) && (
                  <div 
                    className={`absolute -top-7 px-3 py-0.5 rounded-full text-[11px] font-semibold tracking-wide transition-all duration-200 shadow-md pointer-events-none whitespace-nowrap animate-in fade-in slide-in-from-bottom-1 z-30 ${
                      isFounder
                        ? 'bg-[#A2482B] text-white border border-[#E07A5F]/60 shadow-[0_0_12px_rgba(162,72,43,0.45)]'
                        : isCurrent 
                          ? 'bg-[#1C1917] text-white border border-stone-700' 
                          : isSelected 
                            ? 'bg-[#C89B3C] text-white border border-[#E8C576]/50' 
                            : 'bg-white/95 text-stone-800 border border-stone-200'
                    }`}
                  >
                    {firstName}
                    {isFounder && (
                      <span className="ml-1.5 text-[9px] uppercase tracking-wider text-white/80 font-normal">
                        · Premier
                      </span>
                    )}
                  </div>
                )}

                {/* Tête de la personne en alvéole hexagonale */}
                <div className="relative flex items-center justify-center">
                  {/* Halo subtil terre cuite chaud pour les membres fondateurs */}
                  {isFounder && (
                    <div 
                      className="absolute inset-[-14px] pointer-events-none transition-all duration-300 animate-pulse"
                      style={{
                        background: 'radial-gradient(circle, rgba(200, 90, 50, 0.65) 0%, rgba(162, 72, 43, 0.35) 45%, transparent 75%)',
                        filter: 'blur(8px)',
                        transform: 'scale(1.2)'
                      }}
                    />
                  )}

                  {/* Rétro-éclairage lumineux doré pour le profil courant ou sélectionné non-fondateur */}
                  {!isFounder && (isSelected || isCurrent) && (
                    <div 
                      className="absolute inset-[-14px] pointer-events-none transition-all duration-300 animate-pulse"
                      style={{
                        background: 'radial-gradient(circle, rgba(245, 158, 11, 0.75) 0%, rgba(200, 155, 60, 0.4) 50%, transparent 75%)',
                        filter: 'blur(8px)',
                        transform: 'scale(1.2)'
                      }}
                    />
                  )}

                  {/* Bouton Alvéolaire Hexagonal */}
                  <button
                    type="button"
                    id={`frise-avatar-${member.id}`}
                    onClick={() => handleMemberClick(member)}
                    className={`group relative transition-all duration-200 cursor-pointer active:scale-95 flex items-center justify-center ${
                      isCurrent
                        ? 'w-16 h-18 sm:w-18 sm:h-21'
                        : isSelected
                          ? 'w-15 h-17 sm:w-17 sm:h-20 scale-105'
                          : 'w-13 h-15 sm:w-15 sm:h-17 hover:scale-105 opacity-90 hover:opacity-100'
                    }`}
                  >
                    {/* Alvéole SVG arrière-plan & liserés */}
                    <svg 
                      viewBox="0 0 100 115" 
                      className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
                    >
                      {/* Forme hexagonale principale */}
                      <polygon 
                        points="50,2 96,28 96,87 50,113 4,87 4,28" 
                        fill="#FFFFFF" 
                        stroke={
                          isFounder
                            ? '#C85A32' // Double liseré terre cuite chaud pour fondateurs
                            : isSelected 
                              ? '#C89B3C' 
                              : isCurrent 
                                ? '#E5C16C' 
                                : type === 'ascendant' 
                                  ? '#C89B3C' 
                                  : type === 'descendant' 
                                    ? '#A2482B' 
                                    : '#E7E5E4'
                        }
                        strokeWidth={isFounder ? '3' : isSelected || isCurrent ? '2.5' : '1.5'}
                        strokeLinejoin="round"
                        className="transition-colors duration-200"
                      />

                      {/* Deuxième liseré intérieur spécifique pour les fondateurs (Double liseret terre cuite chaud) */}
                      {isFounder && (
                        <polygon 
                          points="50,6 92,30 92,85 50,109 8,85 8,30" 
                          fill="none" 
                          stroke="#E07A5F" 
                          strokeWidth="1.75"
                          strokeLinejoin="round"
                          opacity="0.9"
                        />
                      )}

                      {/* Liseré doré intérieur pour sélection / courant si non-fondateur */}
                      {!isFounder && (isSelected || isCurrent) && (
                        <polygon 
                          points="50,5 93,30 93,85 50,110 7,85 7,30" 
                          fill="none" 
                          stroke="#FDE68A" 
                          strokeWidth="1.2"
                          strokeLinejoin="round"
                          opacity="0.85"
                        />
                      )}
                    </svg>

                    {/* Photo de profil découpée en alvéole hexagonale */}
                    <div 
                      className="w-[88%] h-[88%] overflow-hidden bg-stone-100 transition-transform duration-200"
                      style={{
                        clipPath: 'polygon(50% 2%, 96% 28%, 96% 72%, 50% 98%, 4% 72%, 4% 28%)'
                      }}
                    >
                      <img
                        src={member.photoUrl}
                        alt={firstName}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODALE VIDÉO DE PRÉSENTATION AU CLIC (STRUCTURE & FORME IDENTIQUE AUX PROTAGONISTES HÉRITAGE) */}
      {videoModalMember && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
          onClick={() => {
            setVideoModalMember(null);
            setIsResonanceModalOpen(false);
            setIsQuestionModalOpen(false);
          }}
        >
          {/* Bouton Fermer la modale en haut à droite de l'écran */}
          <button
            type="button"
            id="btn-close-lineage-video-modal"
            onClick={(e) => {
              e.stopPropagation();
              setVideoModalMember(null);
              setIsPlaying(false);
              setIsResonanceModalOpen(false);
              setIsQuestionModalOpen(false);
            }}
            className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-[#A2482B] text-white backdrop-blur-md border border-white/20 hover:border-[#A2482B] flex items-center justify-center transition-all cursor-pointer shadow-xl hover:scale-105 active:scale-95 shrink-0"
            title="Fermer"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          <div 
            className="h-[min(490px,calc(100dvh-210px))] sm:h-[min(540px,calc(100dvh-190px))] lg:h-[min(570px,calc(100dvh-180px))] aspect-[9/16] w-auto mx-auto rounded-3xl overflow-hidden bg-stone-950 text-white shadow-2xl border border-stone-200/40 relative flex flex-col justify-between p-4 sm:p-5 select-none shrink-0 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Poster de fond */}
            <img
              src={videoModalMember.photoUrl}
              alt={videoModalMember.name}
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />

            {/* Vidéo de fond */}
            <video
              ref={videoRef}
              src={videoModalMember.teaserVideoUrl || 'https://assets.mixkit.co/videos/preview/mixkit-african-potter-working-with-clay-41551-large.mp4'}
              poster={videoModalMember.photoUrl}
              autoPlay
              loop
              playsInline
              muted={isMuted}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 pointer-events-none ${
                isPlaying ? 'opacity-100' : 'opacity-0'
              }`}
            />

            {/* Gradient sombre pour lisibilité cinématographique */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/65 pointer-events-none" />

            {/* =========================================================== */}
            {/* HAUT DE CARTE : LECTEUR VINTAGE EN HAUT À DROITE ET C'EST TOUT */}
            {/* (AUCUN TITRE, EXACTEMENT COMME DEMANDÉ)                     */}
            {/* =========================================================== */}
            <div className="relative z-20 flex items-center justify-end w-full pointer-events-auto">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlayback();
                }}
                className="w-8.5 h-8.5 sm:w-9.5 sm:h-9.5 rounded-lg sm:rounded-xl bg-black/45 hover:bg-[#A2482B] backdrop-blur-md border border-white/20 hover:border-[#A2482B] flex items-center justify-center text-white transition-all duration-200 shadow-md cursor-pointer hover:scale-105 active:scale-95 shrink-0"
                title={isPlaying ? "Mettre en pause" : `Regarder la vidéo de ${videoModalMember.firstName || videoModalMember.name.split(' ')[0]}`}
              >
                {isPlaying ? (
                  <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white text-white" />
                ) : (
                  <TvPlayerIcon className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-white transition-transform" strokeWidth={1.6} />
                )}
              </button>
            </div>

            {/* =========================================================== */}
            {/* FLANC DROIT : MÊME CONFIGURATION QUE PROTAGONISTES HÉRITAGE */}
            {/* 1. Résonance, 2. Question, 3. Profil, 4. Partager           */}
            {/* =========================================================== */}
            <div 
              onClick={(e) => e.stopPropagation()}
              className="absolute right-3 sm:right-3.5 top-[60%] -translate-y-1/2 z-20 flex flex-col items-center gap-2.5 sm:gap-3 pointer-events-auto"
            >
              {/* 1. Évaluation résonance */}
              <button
                id={`lineage-btn-resonance-${videoModalMember.id}`}
                onClick={() => setIsResonanceModalOpen(true)}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl backdrop-blur-md border flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer hover:scale-105 active:scale-95 ${
                  personResonancePct !== null
                    ? 'bg-[#A2482B] border-[#A2482B] text-white shadow-[0_0_14px_rgba(162,72,43,0.5)]'
                    : 'bg-black/45 hover:bg-[#A2482B] border-white/20 hover:border-[#A2482B] text-white'
                }`}
                title={personResonancePct !== null ? `Résonance : ${personResonancePct}%` : "Évaluer la résonance"}
              >
                <Award className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </button>

              {/* 2. Question existentielle */}
              <button
                id={`lineage-btn-question-${videoModalMember.id}`}
                onClick={() => setIsQuestionModalOpen(true)}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-black/45 hover:bg-[#A2482B] backdrop-blur-md border border-white/20 hover:border-[#A2482B] text-white flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer hover:scale-105 active:scale-95"
                title="Découvrir la question"
              >
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </button>

              {/* 3. Découvrir son profil complet */}
              <button
                id={`lineage-btn-profile-${videoModalMember.id}`}
                onClick={() => {
                  const targetId = videoModalMember.id;
                  setVideoModalMember(null);
                  onNavigateToPerson(targetId);
                }}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-black/45 hover:bg-[#A2482B] backdrop-blur-md border border-white/20 hover:border-[#A2482B] text-white flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer hover:scale-105 active:scale-95"
                title={`Découvrir le profil de ${videoModalMember.name}`}
              >
                <ProfileSoloIcon className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-white" />
              </button>

              {/* 4. Bouton Partager */}
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: videoModalMember.name,
                      text: `Découvrez la lignée de ${videoModalMember.name} sur YonyWood`,
                      url: window.location.href,
                    }).catch(() => {});
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }
                }}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl border flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95 ${
                  copied
                    ? 'bg-emerald-700/85 border-emerald-600 text-white'
                    : 'bg-black/45 hover:bg-[#A2482B] border-white/20 text-white'
                }`}
                title="Partager ce témoignage"
              >
                {copied ? <Check className="w-4 h-4 text-white" /> : <ShareIcon className="w-4 h-4 text-white" />}
              </button>
            </div>

            {/* =========================================================== */}
            {/* BAS : PRÉNOM SEUL (AUCUNE FONCTION) & SYMBOLE MUTE EN BAS   */}
            {/* =========================================================== */}
            <div className="relative z-10 pt-2 mt-auto flex items-end justify-between gap-2 pointer-events-auto">
              <div className="space-y-0.5">
                <h3 className="font-editorial text-[15px] sm:text-base font-bold text-white tracking-wider leading-snug drop-shadow-md">
                  {videoModalMember.firstName || videoModalMember.name.split(' ')[0]}
                </h3>
              </div>

              {/* Symbole Muet / Son en bas à droite (visible lorsque la vidéo est en lecture) */}
              {isPlaying && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMuted(prev => !prev);
                  }}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/50 hover:bg-[#A2482B] backdrop-blur-md border border-white/20 hover:border-[#A2482B] text-white flex items-center justify-center cursor-pointer transition-all shadow-md hover:scale-105 active:scale-95 shrink-0"
                  title={isMuted ? 'Activer le son' : 'Couper le son'}
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5 text-white" /> : <Volume2 className="w-3.5 h-3.5 text-white" />}
                </button>
              )}
            </div>
          </div>

            {/* Volet d'évaluation de résonance */}
            <ResonanceModal
              isOpen={isResonanceModalOpen}
              onClose={() => setIsResonanceModalOpen(false)}
              storyId={`lineage-${videoModalMember.id}`}
              topicId={videoModalMember.universeTag || 'exploration'}
              personName={videoModalMember.firstName || videoModalMember.name.split(' ')[0]}
              initialPercentage={personResonancePct}
              onRatingSubmitted={(pct) => {
                setPersonResonancePct(pct);
              }}
            />

            {/* Volet modal des crédits & générique de la séquence */}
            <SequenceCreditsModal
              isOpen={isCreditsModalOpen}
              onClose={() => setIsCreditsModalOpen(false)}
              title={videoModalMember.name}
              seriesTitle="Lignée & Transmission"
              credits={getSeriesCredits(videoModalMember.seriesId || 'jesus-legba', videoModalMember.name)}
              onNavigateToProfile={(protagonistId) => {
                setIsCreditsModalOpen(false);
                setVideoModalMember(null);
                onNavigateToPerson(protagonistId);
              }}
            />

            {/* Modale Question à laquelle la personne a répondu */}
            {isQuestionModalOpen && (
              <div 
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsQuestionModalOpen(false);
                }}
              >
                <div 
                  className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-stone-200 text-center animate-in zoom-in-95 duration-200 pointer-events-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => setIsQuestionModalOpen(false)}
                    className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="w-12 h-12 rounded-full bg-[#C89B3C]/15 text-[#C89B3C] flex items-center justify-center mx-auto mb-4 border border-[#C89B3C]/30">
                    <BookOpen className="w-6 h-6" />
                  </div>

                  <h3 className="font-editorial text-base sm:text-lg font-bold text-[#1C1917] mb-2">
                    {videoModalMember.firstName || videoModalMember.name.split(' ')[0]} a répondu :
                  </h3>

                  <p className="font-sans text-xs sm:text-sm font-semibold text-stone-600 mb-4 px-2">
                    « {videoModalMember.questionAnswered?.question || "Quelle vision singulière ce parcours apporte-t-il au monde ?"} »
                  </p>

                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 text-left">
                    <p className="font-serif-editorial text-sm sm:text-base text-stone-800 leading-relaxed italic">
                      « {videoModalMember.questionAnswered?.answer || videoModalMember.quote || "Chaque être lié à la lignée nourrit la sève commune."} »
                    </p>
                  </div>
                </div>
              </div>
            )}
        </div>
      )}
    </div>
  );
};
