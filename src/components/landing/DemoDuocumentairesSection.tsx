import React, { useState, useRef } from 'react';
import { 
  Award, 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Volume2, 
  VolumeX, 
  X, 
  Check
} from 'lucide-react';
import { DUOS } from '../../data/mockData';
import { ShareIcon } from '../ShareIcon';
import { ProfileSoloIcon } from '../YonywoodBrandIcons';

export const DemoDuocumentairesSection: React.FC = () => {
  const [currentDuoIndex, setCurrentDuoIndex] = useState(0);
  const currentDuo = DUOS[currentDuoIndex] || DUOS[0];

  // État de lecture vidéo
  const [playingSide, setPlayingSide] = useState<'A' | 'B' | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  // Modale Question dans la carte
  const [showQuestionCard, setShowQuestionCard] = useState<'A' | 'B' | null>(null);

  // Modale Profil dans la carte
  const [showProfileCard, setShowProfileCard] = useState<'A' | 'B' | null>(null);

  // Modale Évaluation de Résonance confinée strictement à la carte vidéo
  const [resonanceTarget, setResonanceTarget] = useState<'A' | 'B' | null>(null);
  const [resonanceScores, setResonanceScores] = useState({
    A: { authenticity: 65, relevance: 70, impact: 60 },
    B: { authenticity: 70, relevance: 75, impact: 65 },
  });
  const [evaluatedScore, setEvaluatedScore] = useState<{ A?: number; B?: number }>({});

  // Partage
  const [copiedSide, setCopiedSide] = useState<'A' | 'B' | null>(null);

  // Swipe tactile
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);

  const handlePrevDuo = () => {
    setPlayingSide(null);
    setShowQuestionCard(null);
    setShowProfileCard(null);
    setResonanceTarget(null);
    setCurrentDuoIndex((prev) => (prev - 1 + DUOS.length) % DUOS.length);
  };

  const handleNextDuo = () => {
    setPlayingSide(null);
    setShowQuestionCard(null);
    setShowProfileCard(null);
    setResonanceTarget(null);
    setCurrentDuoIndex((prev) => (prev + 1) % DUOS.length);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (touchStartXRef.current !== null && touchEndXRef.current !== null) {
      const diff = touchEndXRef.current - touchStartXRef.current;
      if (diff > 40) {
        handlePrevDuo();
      } else if (diff < -40) {
        handleNextDuo();
      }
    }
    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  const handleShare = (side: 'A' | 'B') => {
    setCopiedSide(side);
    setTimeout(() => setCopiedSide(null), 2000);
  };

  const pA = currentDuo.protagonistA;
  const pB = currentDuo.protagonistB;

  const firstNameA = pA.firstName || pA.name.split(' ')[0];
  const firstNameB = pB.firstName || pB.name.split(' ')[0];

  return (
    <div 
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className="w-full max-w-4xl mx-auto py-4 flex flex-col items-center select-none"
    >
      
      {/* En-tête Duocumentaires : titre à gauche et nom de la série centré */}
      <div className="w-full flex flex-col sm:relative sm:flex-row sm:items-center sm:justify-center mb-4 sm:mb-6 px-3 sm:px-6 gap-2 sm:gap-0 min-h-[40px]">
        <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-stone-900 sm:absolute sm:left-3 md:sm:left-6">
          Duocumentaires
        </h3>

        {/* Pilule avec le nom de la série CENTRÉ */}
        <div className="flex justify-center">
          <button
            onClick={handleNextDuo}
            className="px-4 py-1.5 rounded-full bg-[#A2482B] text-white text-xs font-bold shadow-xs hover:bg-[#8A3B22] transition-colors cursor-pointer tracking-wide"
            title="Cliquer pour afficher la série suivante"
          >
            {currentDuo.documentaryTitle}
          </button>
        </div>
      </div>

      {/* ZONE CENTRALE : Les deux cartes 9:16 rapprochées en miroir avec flèches latérales */}
      <div className="relative w-full flex items-center justify-center">
        
        {/* Flèche gauche */}
        <button
          onClick={handlePrevDuo}
          className="absolute -left-1 sm:-left-3 md:-left-6 lg:-left-10 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 backdrop-blur-xs text-stone-800 border border-stone-200 shadow-md flex items-center justify-center hover:bg-stone-100 transition-all cursor-pointer hover:scale-105 active:scale-95"
          title="Duo précédent"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Diptyque : deux cartes rapprochées avec espacement réduit */}
        <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3.5 justify-center items-center">
          
          {/* ========================================================================= */}
          {/* CARTE GAUCHE : Protagoniste A (Prénom à gauche & Icône vidéo à droite)    */}
          {/* ========================================================================= */}
          <div className="h-[min(490px,calc(100vh-220px))] aspect-[9/16] w-auto rounded-3xl overflow-hidden bg-stone-950 text-white shadow-xl border border-stone-200 relative flex flex-col justify-between p-3.5 sm:p-4 shrink-0">
            
            {playingSide === 'A' ? (
              <div className="absolute inset-0 z-20 bg-black flex flex-col justify-between p-4">
                <video
                  src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
                  autoPlay
                  playsInline
                  muted={isMuted}
                  className="absolute inset-0 w-full h-full object-cover"
                  onEnded={() => setPlayingSide(null)}
                />
                <div className="relative z-30 flex justify-between items-center">
                  <span className="px-2.5 py-0.5 rounded-full bg-black/60 text-[10px] font-bold">
                    {pA.universeTag || 'Univers A'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="w-7 h-7 rounded-full bg-black/60 flex items-center justify-center text-white cursor-pointer"
                    >
                      {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => setPlayingSide(null)}
                      className="w-7 h-7 rounded-full bg-black/60 flex items-center justify-center text-white cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="relative z-30">
                  <h4 className="font-editorial text-base sm:text-lg font-bold text-white drop-shadow-md">
                    {firstNameA}
                  </h4>
                </div>
              </div>
            ) : (
              <>
                <img
                  src={pA.photoUrl}
                  alt={pA.name}
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-black/35 pointer-events-none" />

                {/* Badge univers en haut */}
                <div className="relative z-10 flex justify-between items-center">
                  <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-xs font-bold text-white tracking-wide">
                    {pA.universeTag || 'Univers A'}
                  </span>
                </div>

                {/* LES 4 VRAIES ICÔNES D'ACTION (Award, BookOpen, ProfileSoloIcon, ShareIcon) */}
                <div className="absolute right-3 sm:right-3.5 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-2.5">
                  
                  {/* 1. Évaluation Résonance (Award) */}
                  <button
                    onClick={() => {
                      setShowQuestionCard(null);
                      setShowProfileCard(null);
                      setResonanceTarget(resonanceTarget === 'A' ? null : 'A');
                    }}
                    className={`w-9 h-9 rounded-xl backdrop-blur-md border flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95 ${
                      evaluatedScore.A !== undefined
                        ? 'bg-[#A2482B] border-[#A2482B] text-white'
                        : 'bg-black/45 hover:bg-[#A2482B] border-white/20 text-white'
                    }`}
                    title="Évaluer la résonance"
                  >
                    <Award className="w-4 h-4 text-white" />
                  </button>

                  {/* 2. Question centrale (BookOpen) */}
                  <button
                    onClick={() => {
                      setResonanceTarget(null);
                      setShowProfileCard(null);
                      setShowQuestionCard(showQuestionCard === 'A' ? null : 'A');
                    }}
                    className={`w-9 h-9 rounded-xl backdrop-blur-md border flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95 ${
                      showQuestionCard === 'A'
                        ? 'bg-[#A2482B] border-[#A2482B] text-white'
                        : 'bg-black/45 hover:bg-[#A2482B] border-white/20 text-white'
                    }`}
                    title="Découvrir la question"
                  >
                    <BookOpen className="w-4 h-4 text-white" />
                  </button>

                  {/* 3. Profil (ProfileSoloIcon) */}
                  <button
                    onClick={() => {
                      setResonanceTarget(null);
                      setShowQuestionCard(null);
                      setShowProfileCard(showProfileCard === 'A' ? null : 'A');
                    }}
                    className={`w-9 h-9 rounded-xl backdrop-blur-md border flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95 ${
                      showProfileCard === 'A'
                        ? 'bg-[#A2482B] border-[#A2482B] text-white'
                        : 'bg-black/45 hover:bg-[#A2482B] border-white/20 text-white'
                    }`}
                    title={`Découvrir le profil de ${firstNameA}`}
                  >
                    <ProfileSoloIcon className="w-4 h-4 text-white" />
                  </button>

                  {/* 4. Partager (ShareIcon) */}
                  <button
                    onClick={() => handleShare('A')}
                    className={`w-9 h-9 rounded-xl backdrop-blur-md border flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95 ${
                      copiedSide === 'A'
                        ? 'bg-emerald-700/85 border-emerald-600 text-white'
                        : 'bg-black/45 hover:bg-[#A2482B] border-white/20 text-white'
                    }`}
                    title="Partager"
                  >
                    {copiedSide === 'A' ? (
                      <Check className="w-4 h-4 text-white" />
                    ) : (
                      <ShareIcon className="w-4 h-4 text-white" />
                    )}
                  </button>

                </div>

                {/* BAS DE LA CARTE : Prénom à gauche (taille réduite) & Icône vidéo à droite en face du prénom */}
                <div className="relative z-10 flex items-center justify-between gap-2 pt-2 mt-auto">
                  <h4 className="font-editorial text-base sm:text-lg font-bold text-white drop-shadow-md tracking-wide">
                    {firstNameA}
                  </h4>

                  {/* Déclencheur vidéo signature YonyWood en carré arrondi */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPlayingSide(playingSide === 'A' ? null : 'A');
                    }}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-black/50 hover:bg-[#A2482B] border border-white/25 hover:border-[#A2482B] flex items-center justify-center text-white transition-all duration-200 cursor-pointer shadow-lg hover:scale-105 active:scale-95 shrink-0 group"
                    title={playingSide === 'A' ? "Mettre en pause" : `Regarder le témoignage de ${firstNameA}`}
                  >
                    {playingSide === 'A' ? (
                      <span className="w-3.5 h-3.5 flex items-center justify-center font-bold">||</span>
                    ) : (
                      <ProfileSoloIcon className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-white rotate-180 transition-transform" strokeWidth={1.6} />
                    )}
                  </button>
                </div>

                {/* MODALE QUESTION (Confinée à l'intérieur de la carte vidéo) */}
                {showQuestionCard === 'A' && (
                  <div className="absolute inset-x-2 bottom-2 z-30 bg-stone-900/95 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-white shadow-2xl animate-in fade-in duration-200">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFE7A3]">
                        Question de l'épisode
                      </span>
                      <button 
                        onClick={() => setShowQuestionCard(null)}
                        className="text-stone-400 hover:text-white cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-xs italic leading-relaxed text-stone-100">
                      « {currentDuo.centralQuestion} »
                    </p>
                  </div>
                )}

                {/* MODALE PROFIL (Confinée à l'intérieur de la carte vidéo) */}
                {showProfileCard === 'A' && (
                  <div className="absolute inset-x-2 bottom-2 z-30 bg-stone-900/95 backdrop-blur-md rounded-2xl p-3.5 border border-white/20 text-white shadow-2xl animate-in fade-in duration-200">
                    <div className="flex justify-between items-center mb-2 pb-1 border-b border-white/10">
                      <div className="flex items-center gap-1.5">
                        <ProfileSoloIcon className="w-3.5 h-3.5 text-[#FFE7A3]" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFE7A3]">
                          Profil de {firstNameA}
                        </span>
                      </div>
                      <button 
                        onClick={() => setShowProfileCard(null)}
                        className="text-stone-400 hover:text-white cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="text-xs text-stone-200 space-y-1 leading-relaxed">
                      <p className="font-semibold text-white">{pA.name}</p>
                      <p className="text-[11px] text-stone-300 font-medium">{pA.role}</p>
                      <p className="text-[10px] text-stone-400">{pA.territory || pA.country}</p>
                      {pA.bio && (
                        <p className="italic text-[10px] text-stone-200 mt-1 line-clamp-3">
                          « {pA.bio} »
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* MODALE ÉVALUATION AVEC LES 3 CURSEURS (Confinée strictement à la carte vidéo) */}
                {resonanceTarget === 'A' && (
                  <div className="absolute inset-x-2 bottom-2 z-30 bg-stone-900/95 backdrop-blur-md rounded-2xl p-3.5 border border-white/20 text-white shadow-2xl animate-in fade-in duration-200">
                    <div className="flex justify-between items-center mb-2 pb-1.5 border-b border-white/10">
                      <div className="flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-[#FFE7A3]" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFE7A3]">
                          Évaluer la résonance
                        </span>
                      </div>
                      <button 
                        onClick={() => setResonanceTarget(null)}
                        className="text-stone-400 hover:text-white cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-2 mb-2.5">
                      <div>
                        <div className="flex justify-between text-[10px] text-stone-300 mb-0.5">
                          <span>Authenticité</span>
                          <span className="font-bold text-[#FFE7A3]">{resonanceScores.A.authenticity}%</span>
                        </div>
                        <input 
                          type="range"
                          min="0"
                          max="100"
                          value={resonanceScores.A.authenticity}
                          onChange={(e) => setResonanceScores(prev => ({
                            ...prev,
                            A: { ...prev.A, authenticity: Number(e.target.value) }
                          }))}
                          className="w-full h-1.5 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-[#A2482B]"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-[10px] text-stone-300 mb-0.5">
                          <span>Pertinence</span>
                          <span className="font-bold text-[#FFE7A3]">{resonanceScores.A.relevance}%</span>
                        </div>
                        <input 
                          type="range"
                          min="0"
                          max="100"
                          value={resonanceScores.A.relevance}
                          onChange={(e) => setResonanceScores(prev => ({
                            ...prev,
                            A: { ...prev.A, relevance: Number(e.target.value) }
                          }))}
                          className="w-full h-1.5 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-[#A2482B]"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-[10px] text-stone-300 mb-0.5">
                          <span>Impact</span>
                          <span className="font-bold text-[#FFE7A3]">{resonanceScores.A.impact}%</span>
                        </div>
                        <input 
                          type="range"
                          min="0"
                          max="100"
                          value={resonanceScores.A.impact}
                          onChange={(e) => setResonanceScores(prev => ({
                            ...prev,
                            A: { ...prev.A, impact: Number(e.target.value) }
                          }))}
                          className="w-full h-1.5 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-[#A2482B]"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-white/10">
                      <div className="text-[10px] text-stone-300">
                        Moyenne : <span className="font-bold text-emerald-400">{Math.round((resonanceScores.A.authenticity + resonanceScores.A.relevance + resonanceScores.A.impact) / 3)}%</span>
                      </div>
                      <button
                        onClick={() => {
                          const avg = Math.round((resonanceScores.A.authenticity + resonanceScores.A.relevance + resonanceScores.A.impact) / 3);
                          setEvaluatedScore(prev => ({ ...prev, A: avg }));
                          setResonanceTarget(null);
                        }}
                        className="px-2.5 py-1 rounded-full bg-[#A2482B] hover:bg-[#8A3B22] text-white text-[10px] font-bold cursor-pointer transition-colors shadow-xs"
                      >
                        Valider
                      </button>
                    </div>
                  </div>
                )}

              </>
            )}

          </div>

          {/* ========================================================================= */}
          {/* CARTE DROITE : Protagoniste B (Prénom à gauche & Icône vidéo à droite)   */}
          {/* ========================================================================= */}
          <div className="h-[min(490px,calc(100vh-220px))] aspect-[9/16] w-auto rounded-3xl overflow-hidden bg-stone-950 text-white shadow-xl border border-stone-200 relative flex flex-col justify-between p-3.5 sm:p-4 shrink-0">
            
            {playingSide === 'B' ? (
              <div className="absolute inset-0 z-20 bg-black flex flex-col justify-between p-4">
                <video
                  src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
                  autoPlay
                  playsInline
                  muted={isMuted}
                  className="absolute inset-0 w-full h-full object-cover"
                  onEnded={() => setPlayingSide(null)}
                />
                <div className="relative z-30 flex justify-between items-center">
                  <span className="px-2.5 py-0.5 rounded-full bg-black/60 text-[10px] font-bold">
                    {pB.universeTag || 'Univers B'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="w-7 h-7 rounded-full bg-black/60 flex items-center justify-center text-white cursor-pointer"
                    >
                      {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => setPlayingSide(null)}
                      className="w-7 h-7 rounded-full bg-black/60 flex items-center justify-center text-white cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="relative z-30">
                  <h4 className="font-editorial text-base sm:text-lg font-bold text-white drop-shadow-md">
                    {firstNameB}
                  </h4>
                </div>
              </div>
            ) : (
              <>
                <img
                  src={pB.photoUrl}
                  alt={pB.name}
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-black/35 pointer-events-none" />

                {/* Badge univers en haut */}
                <div className="relative z-10 flex justify-between items-center">
                  <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-xs font-bold text-white tracking-wide">
                    {pB.universeTag || 'Univers B'}
                  </span>
                </div>

                {/* LES 4 VRAIES ICÔNES D'ACTION (Award, BookOpen, ProfileSoloIcon, ShareIcon) */}
                <div className="absolute right-3 sm:right-3.5 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-2.5">
                  
                  {/* 1. Évaluation Résonance (Award) */}
                  <button
                    onClick={() => {
                      setShowQuestionCard(null);
                      setShowProfileCard(null);
                      setResonanceTarget(resonanceTarget === 'B' ? null : 'B');
                    }}
                    className={`w-9 h-9 rounded-xl backdrop-blur-md border flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95 ${
                      evaluatedScore.B !== undefined
                        ? 'bg-[#A2482B] border-[#A2482B] text-white'
                        : 'bg-black/45 hover:bg-[#A2482B] border-white/20 text-white'
                    }`}
                    title="Évaluer la résonance"
                  >
                    <Award className="w-4 h-4 text-white" />
                  </button>

                  {/* 2. Question centrale (BookOpen) */}
                  <button
                    onClick={() => {
                      setResonanceTarget(null);
                      setShowProfileCard(null);
                      setShowQuestionCard(showQuestionCard === 'B' ? null : 'B');
                    }}
                    className={`w-9 h-9 rounded-xl backdrop-blur-md border flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95 ${
                      showQuestionCard === 'B'
                        ? 'bg-[#A2482B] border-[#A2482B] text-white'
                        : 'bg-black/45 hover:bg-[#A2482B] border-white/20 text-white'
                    }`}
                    title="Découvrir la question"
                  >
                    <BookOpen className="w-4 h-4 text-white" />
                  </button>

                  {/* 3. Profil (ProfileSoloIcon) */}
                  <button
                    onClick={() => {
                      setResonanceTarget(null);
                      setShowQuestionCard(null);
                      setShowProfileCard(showProfileCard === 'B' ? null : 'B');
                    }}
                    className={`w-9 h-9 rounded-xl backdrop-blur-md border flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95 ${
                      showProfileCard === 'B'
                        ? 'bg-[#A2482B] border-[#A2482B] text-white'
                        : 'bg-black/45 hover:bg-[#A2482B] border-white/20 text-white'
                    }`}
                    title={`Découvrir le profil de ${firstNameB}`}
                  >
                    <ProfileSoloIcon className="w-4 h-4 text-white" />
                  </button>

                  {/* 4. Partager (ShareIcon) */}
                  <button
                    onClick={() => handleShare('B')}
                    className={`w-9 h-9 rounded-xl backdrop-blur-md border flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95 ${
                      copiedSide === 'B'
                        ? 'bg-emerald-700/85 border-emerald-600 text-white'
                        : 'bg-black/45 hover:bg-[#A2482B] border-white/20 text-white'
                    }`}
                    title="Partager"
                  >
                    {copiedSide === 'B' ? (
                      <Check className="w-4 h-4 text-white" />
                    ) : (
                      <ShareIcon className="w-4 h-4 text-white" />
                    )}
                  </button>

                </div>

                {/* BAS DE LA CARTE : Prénom à gauche (taille réduite) & Icône vidéo à droite en face du prénom */}
                <div className="relative z-10 flex items-center justify-between gap-2 pt-2 mt-auto">
                  <h4 className="font-editorial text-base sm:text-lg font-bold text-white drop-shadow-md tracking-wide">
                    {firstNameB}
                  </h4>

                  {/* Déclencheur vidéo signature YonyWood en carré arrondi */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPlayingSide(playingSide === 'B' ? null : 'B');
                    }}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-black/50 hover:bg-[#A2482B] border border-white/25 hover:border-[#A2482B] flex items-center justify-center text-white transition-all duration-200 cursor-pointer shadow-lg hover:scale-105 active:scale-95 shrink-0 group"
                    title={playingSide === 'B' ? "Mettre en pause" : `Regarder le témoignage de ${firstNameB}`}
                  >
                    {playingSide === 'B' ? (
                      <span className="w-3.5 h-3.5 flex items-center justify-center font-bold">||</span>
                    ) : (
                      <ProfileSoloIcon className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-white rotate-180 transition-transform" strokeWidth={1.6} />
                    )}
                  </button>
                </div>

                {/* MODALE QUESTION (Confinée à l'intérieur de la carte vidéo) */}
                {showQuestionCard === 'B' && (
                  <div className="absolute inset-x-2 bottom-2 z-30 bg-stone-900/95 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-white shadow-2xl animate-in fade-in duration-200">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFE7A3]">
                        Question de l'épisode
                      </span>
                      <button 
                        onClick={() => setShowQuestionCard(null)}
                        className="text-stone-400 hover:text-white cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-xs italic leading-relaxed text-stone-100">
                      « {currentDuo.centralQuestion} »
                    </p>
                  </div>
                )}

                {/* MODALE PROFIL (Confinée à l'intérieur de la carte vidéo) */}
                {showProfileCard === 'B' && (
                  <div className="absolute inset-x-2 bottom-2 z-30 bg-stone-900/95 backdrop-blur-md rounded-2xl p-3.5 border border-white/20 text-white shadow-2xl animate-in fade-in duration-200">
                    <div className="flex justify-between items-center mb-2 pb-1 border-b border-white/10">
                      <div className="flex items-center gap-1.5">
                        <ProfileSoloIcon className="w-3.5 h-3.5 text-[#FFE7A3]" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFE7A3]">
                          Profil de {firstNameB}
                        </span>
                      </div>
                      <button 
                        onClick={() => setShowProfileCard(null)}
                        className="text-stone-400 hover:text-white cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="text-xs text-stone-200 space-y-1 leading-relaxed">
                      <p className="font-semibold text-white">{pB.name}</p>
                      <p className="text-[11px] text-stone-300 font-medium">{pB.role}</p>
                      <p className="text-[10px] text-stone-400">{pB.territory || pB.country}</p>
                      {pB.bio && (
                        <p className="italic text-[10px] text-stone-200 mt-1 line-clamp-3">
                          « {pB.bio} »
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* MODALE ÉVALUATION AVEC LES 3 CURSEURS (Confinée strictement à la carte vidéo) */}
                {resonanceTarget === 'B' && (
                  <div className="absolute inset-x-2 bottom-2 z-30 bg-stone-900/95 backdrop-blur-md rounded-2xl p-3.5 border border-white/20 text-white shadow-2xl animate-in fade-in duration-200">
                    <div className="flex justify-between items-center mb-2 pb-1.5 border-b border-white/10">
                      <div className="flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-[#FFE7A3]" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFE7A3]">
                          Évaluer la résonance
                        </span>
                      </div>
                      <button 
                        onClick={() => setResonanceTarget(null)}
                        className="text-stone-400 hover:text-white cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-2 mb-2.5">
                      <div>
                        <div className="flex justify-between text-[10px] text-stone-300 mb-0.5">
                          <span>Authenticité</span>
                          <span className="font-bold text-[#FFE7A3]">{resonanceScores.B.authenticity}%</span>
                        </div>
                        <input 
                          type="range"
                          min="0"
                          max="100"
                          value={resonanceScores.B.authenticity}
                          onChange={(e) => setResonanceScores(prev => ({
                            ...prev,
                            B: { ...prev.B, authenticity: Number(e.target.value) }
                          }))}
                          className="w-full h-1.5 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-[#A2482B]"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-[10px] text-stone-300 mb-0.5">
                          <span>Pertinence</span>
                          <span className="font-bold text-[#FFE7A3]">{resonanceScores.B.relevance}%</span>
                        </div>
                        <input 
                          type="range"
                          min="0"
                          max="100"
                          value={resonanceScores.B.relevance}
                          onChange={(e) => setResonanceScores(prev => ({
                            ...prev,
                            B: { ...prev.B, relevance: Number(e.target.value) }
                          }))}
                          className="w-full h-1.5 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-[#A2482B]"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-[10px] text-stone-300 mb-0.5">
                          <span>Impact</span>
                          <span className="font-bold text-[#FFE7A3]">{resonanceScores.B.impact}%</span>
                        </div>
                        <input 
                          type="range"
                          min="0"
                          max="100"
                          value={resonanceScores.B.impact}
                          onChange={(e) => setResonanceScores(prev => ({
                            ...prev,
                            B: { ...prev.B, impact: Number(e.target.value) }
                          }))}
                          className="w-full h-1.5 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-[#A2482B]"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-white/10">
                      <div className="text-[10px] text-stone-300">
                        Moyenne : <span className="font-bold text-emerald-400">{Math.round((resonanceScores.B.authenticity + resonanceScores.B.relevance + resonanceScores.B.impact) / 3)}%</span>
                      </div>
                      <button
                        onClick={() => {
                          const avg = Math.round((resonanceScores.B.authenticity + resonanceScores.B.relevance + resonanceScores.B.impact) / 3);
                          setEvaluatedScore(prev => ({ ...prev, B: avg }));
                          setResonanceTarget(null);
                        }}
                        className="px-2.5 py-1 rounded-full bg-[#A2482B] hover:bg-[#8A3B22] text-white text-[10px] font-bold cursor-pointer transition-colors shadow-xs"
                      >
                        Valider
                      </button>
                    </div>
                  </div>
                )}

              </>
            )}

          </div>

        </div>

        {/* Flèche droite */}
        <button
          onClick={handleNextDuo}
          className="absolute -right-1 sm:-right-3 md:-right-6 lg:-right-10 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 backdrop-blur-xs text-stone-800 border border-stone-200 shadow-md flex items-center justify-center hover:bg-stone-100 transition-all cursor-pointer hover:scale-105 active:scale-95"
          title="Duo suivant"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

      </div>

    </div>
  );
};
