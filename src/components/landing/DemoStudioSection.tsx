import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  UploadCloud,
  Camera,
  Info,
  X,
  ArrowLeft,
  Layers,
  Film,
  Sparkles
} from 'lucide-react';
import { TvPlayerIcon } from '../YonywoodBrandIcons';
import { PROPOSE_DOORS } from '../../data/proposeDoorsData';
import { DOCUMENTARIES } from '../../data/mockData';

export const DemoStudioSection: React.FC = () => {
  // Étape 1 : Choisir la Porte
  // Étape 2 : Choisir la Série
  // Étape 3 : Format vidéo (J'ai ma vidéo VS Recruter un vidéaste)
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Étape 1 : Index de la porte
  const [doorIndex, setDoorIndex] = useState(0);
  const currentDoor = PROPOSE_DOORS[doorIndex] || PROPOSE_DOORS[0];

  // Étape 2 : Index de la série
  const [seriesIndex, setSeriesIndex] = useState(0);
  const currentSeries = DOCUMENTARIES[seriesIndex] || DOCUMENTARIES[0];

  // Étape 3 : Modale explicative Détails
  const [detailModalMode, setDetailModalMode] = useState<'upload' | 'recruit' | null>(null);
  const [showAdvantagesModal, setShowAdvantagesModal] = useState(false);

  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const handlePrevDoor = () => {
    setIsVideoPlaying(false);
    setShowAdvantagesModal(false);
    setDoorIndex((prev) => (prev - 1 + PROPOSE_DOORS.length) % PROPOSE_DOORS.length);
  };

  const handleNextDoor = () => {
    setIsVideoPlaying(false);
    setShowAdvantagesModal(false);
    setDoorIndex((prev) => (prev + 1) % PROPOSE_DOORS.length);
  };

  const handlePrevSeries = () => {
    setIsVideoPlaying(false);
    setSeriesIndex((prev) => (prev - 1 + DOCUMENTARIES.length) % DOCUMENTARIES.length);
  };

  const handleNextSeries = () => {
    setIsVideoPlaying(false);
    setSeriesIndex((prev) => (prev + 1) % DOCUMENTARIES.length);
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-4 flex flex-col items-center">

      {/* En-tête sobre Studio avec retour si étape > 1 */}
      <div className="w-full flex items-center justify-between mb-4 sm:mb-6 px-3 sm:px-6">
        <div className="flex items-center gap-3">
          {step > 1 && (
            <button
              onClick={() => {
                setIsVideoPlaying(false);
                setStep((prev) => (prev - 1) as 1 | 2);
              }}
              className="p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
              title="Retour à l'étape précédente"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <h3 className="font-editorial text-3xl font-bold text-stone-900">
            Studio
          </h3>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ÉTAPE 1 : CHOISIR LA PORTE (Fidèle à la Capture 1)                        */}
      {/* ========================================================================= */}
      {step === 1 && (
        <div className="relative w-full max-w-md mx-auto flex items-center justify-center my-2">

          <button
            onClick={handlePrevDoor}
            className="absolute -left-3 sm:-left-12 z-20 w-10 h-10 rounded-full bg-white text-stone-800 border border-stone-200 shadow-md flex items-center justify-center hover:bg-stone-100 transition-all cursor-pointer"
            title="Porte précédente"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="h-[min(490px,calc(100vh-220px))] aspect-[9/16] w-auto mx-auto rounded-3xl overflow-hidden bg-stone-950 text-white shadow-xl border border-stone-200 relative flex flex-col justify-between p-3.5 sm:p-4 select-none shrink-0">

            <img
              src={currentDoor.posterUrl || '/assets/doors/door-sagesses.jpg'}
              alt={currentDoor.label}
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/40 pointer-events-none" />

            {/* Haut : Badge Porte & Déclencheur lecture */}
            <div className="relative z-10 flex items-center justify-between pointer-events-auto">
              <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-xs font-bold text-white tracking-wide">
                {currentDoor.label}
              </span>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsVideoPlaying(!isVideoPlaying);
                }}
                className="w-8.5 h-8.5 rounded-lg sm:rounded-xl bg-black/45 hover:bg-[#A2482B] text-white backdrop-blur-md border border-white/20 hover:border-[#A2482B] flex items-center justify-center transition-all duration-200 cursor-pointer shadow-md hover:scale-105 active:scale-95 shrink-0"
                title={isVideoPlaying ? "Mettre en pause" : "Lire la vidéo"}
              >
                {isVideoPlaying ? (
                  <Pause className="w-3.5 h-3.5 fill-white text-white" />
                ) : (
                  <TvPlayerIcon className="w-5 h-5 text-white transition-transform" strokeWidth={1.6} />
                )}
              </button>
            </div>

            {/* Centre : Bouton de lecture */}
            <div className="relative z-10 flex items-center justify-center my-auto">
              <button
                onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                className="w-14 h-14 rounded-full bg-black/40 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:scale-110 transition-transform cursor-pointer shadow-lg"
              >
                <Play className="w-6 h-6 fill-white text-white translate-x-0.5" />
              </button>
            </div>

            {/* Bas : Boutons Avantages & Choisir cette porte */}
            <div className="relative z-10">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAdvantagesModal(true)}
                  className="px-3.5 py-2 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-xs font-semibold text-white hover:bg-black/80 transition-colors cursor-pointer"
                >
                  Avantages
                </button>
                <button
                  onClick={() => {
                    setIsVideoPlaying(false);
                    setStep(2);
                  }}
                  className="flex-1 py-2 rounded-full bg-black/80 hover:bg-[#A2482B] backdrop-blur-md border border-white/30 text-xs font-bold text-white transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                >
                  <span>Choisir cette porte</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* Modale interne Avantages */}
            {showAdvantagesModal && (
              <div className="absolute inset-x-2 bottom-2 z-30 bg-stone-900/95 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-white shadow-2xl animate-in fade-in duration-200">
                <div className="flex justify-between items-center mb-2 pb-1 border-b border-white/10">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFE7A3]">
                    Avantages : {currentDoor.label}
                  </span>
                  <button
                    onClick={() => setShowAdvantagesModal(false)}
                    className="text-stone-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <ul className="text-xs text-stone-200 space-y-1.5 leading-relaxed">
                  {currentDoor.advantages.map((adv, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-[#FFE7A3] shrink-0">•</span>
                      <span>{adv}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>

          <button
            onClick={handleNextDoor}
            className="absolute -right-3 sm:-right-12 z-20 w-10 h-10 rounded-full bg-white text-stone-800 border border-stone-200 shadow-md flex items-center justify-center hover:bg-stone-100 transition-all cursor-pointer"
            title="Porte suivante"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ÉTAPE 2 : CHOISIR LA SÉRIE (Fidèle à la Capture 3)                        */}
      {/* ========================================================================= */}
      {step === 2 && (
        <div className="relative w-full max-w-md mx-auto flex items-center justify-center my-2">

          <button
            onClick={handlePrevSeries}
            className="absolute -left-3 sm:-left-12 z-20 w-10 h-10 rounded-full bg-white text-stone-800 border border-stone-200 shadow-md flex items-center justify-center hover:bg-stone-100 transition-all cursor-pointer"
            title="Série précédente"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="h-[min(490px,calc(100vh-220px))] aspect-[9/16] w-auto mx-auto rounded-3xl overflow-hidden bg-stone-950 text-white shadow-xl border border-stone-200 relative flex flex-col justify-between p-3.5 sm:p-4 select-none shrink-0">

            <img
              src={currentSeries.coverImage || currentSeries.posterUrl || '/assets/posters/Benin < >.jpg'}
              alt={currentSeries.title}
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/40 pointer-events-none" />

            {/* Haut : Badge Titre de la série & Déclencheur lecture */}
            <div className="relative z-10 flex items-center justify-between pointer-events-auto">
              <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-xs font-bold text-white tracking-wide">
                {currentSeries.title}
              </span>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsVideoPlaying(!isVideoPlaying);
                }}
                className="w-8.5 h-8.5 rounded-lg sm:rounded-xl bg-black/45 hover:bg-[#A2482B] text-white backdrop-blur-md border border-white/20 hover:border-[#A2482B] flex items-center justify-center transition-all duration-200 cursor-pointer shadow-md hover:scale-105 active:scale-95 shrink-0"
                title={isVideoPlaying ? "Mettre en pause" : "Lire la vidéo"}
              >
                {isVideoPlaying ? (
                  <Pause className="w-3.5 h-3.5 fill-white text-white" />
                ) : (
                  <TvPlayerIcon className="w-5 h-5 text-white transition-transform" strokeWidth={1.6} />
                )}
              </button>
            </div>

            {/* Centre : Bouton de lecture */}
            <div className="relative z-10 flex items-center justify-center my-auto">
              <button
                onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                className="w-14 h-14 rounded-full bg-black/40 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:scale-110 transition-transform cursor-pointer shadow-lg"
              >
                <Play className="w-6 h-6 fill-white text-white translate-x-0.5" />
              </button>
            </div>

            {/* Icônes d'action latérales */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-2">
              <div className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white text-xs">
                <Layers className="w-4 h-4" />
              </div>
              <div className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white text-xs">
                <Film className="w-4 h-4" />
              </div>
              <div className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white text-xs">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>

            {/* Bas : Bouton Choisir cette série */}
            <div className="relative z-10">
              <button
                onClick={() => {
                  setIsVideoPlaying(false);
                  setStep(3);
                }}
                className="w-full py-2.5 rounded-full bg-black/80 hover:bg-[#A2482B] backdrop-blur-md border border-white/30 text-xs font-bold text-white transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
              >
                <span>Choisir cette série</span>
                <span>→</span>
              </button>
            </div>

          </div>

          <button
            onClick={handleNextSeries}
            className="absolute -right-3 sm:-right-12 z-20 w-10 h-10 rounded-full bg-white text-stone-800 border border-stone-200 shadow-md flex items-center justify-center hover:bg-stone-100 transition-all cursor-pointer"
            title="Série suivante"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ÉTAPE 3 : FACE-À-FACE "J'AI MA VIDÉO" VS "RECRUTER UN VIDÉASTE"           */}
      {/* ========================================================================= */}
      {step === 3 && (
        <div className="w-full max-w-3xl mx-auto my-2">

          <div className="text-center mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#A2482B]">
              Série sélectionnée : {currentSeries.title}
            </span>
            <h4 className="font-editorial text-2xl font-bold text-stone-900 mt-1">
              Comment souhaitez-vous produire votre récit ?
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            {/* Option A : J'ai ma vidéo */}
            <div className="bg-stone-50 rounded-3xl p-6 border border-stone-200 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#A2482B]/10 text-[#A2482B] flex items-center justify-center mb-4">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <h5 className="font-editorial text-xl font-bold text-stone-900">
                  J'ai ma vidéo
                </h5>
                <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                  Vous disposez déjà d'un témoignage capté au format 9:16 répondant à la question officielle de la série.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-200 flex items-center gap-2">
                <button
                  disabled
                  className="flex-1 py-2 rounded-full bg-stone-300 text-stone-600 text-xs font-bold cursor-not-allowed text-center"
                >
                  Téléverser (Démo)
                </button>
                <button
                  onClick={() => setDetailModalMode('upload')}
                  className="px-3.5 py-2 rounded-full bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 text-xs font-semibold cursor-pointer flex items-center gap-1 shadow-xs"
                >
                  <Info className="w-3.5 h-3.5 text-[#A2482B]" />
                  <span>Détails</span>
                </button>
              </div>
            </div>

            {/* Option B : Recruter un vidéaste */}
            <div className="bg-stone-50 rounded-3xl p-6 border border-stone-200 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-stone-200 text-stone-800 flex items-center justify-center mb-4">
                  <Camera className="w-6 h-6" />
                </div>
                <h5 className="font-editorial text-xl font-bold text-stone-900">
                  Recruter un vidéaste
                </h5>
                <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                  Faites appel à l'un des cinéastes et directeurs de la photographie accrédités YonyWood sur votre territoire.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-200 flex items-center gap-2">
                <button
                  disabled
                  className="flex-1 py-2 rounded-full bg-stone-300 text-stone-600 text-xs font-bold cursor-not-allowed text-center"
                >
                  Choisir un cinéaste (Démo)
                </button>
                <button
                  onClick={() => setDetailModalMode('recruit')}
                  className="px-3.5 py-2 rounded-full bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 text-xs font-semibold cursor-pointer flex items-center gap-1 shadow-xs"
                >
                  <Info className="w-3.5 h-3.5 text-[#A2482B]" />
                  <span>Détails</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Modale d'explication "Détails" */}
      {detailModalMode && (
        <div
          onClick={() => setDetailModalMode(null)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#A2482B]">
                Comprendre le Studio YonyWood
              </span>
              <button
                onClick={() => setDetailModalMode(null)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {detailModalMode === 'upload' ? (
              <div>
                <h4 className="font-editorial text-xl font-bold text-stone-900 mb-2">
                  Comment fonctionne « J'ai ma vidéo » ?
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed mb-3">
                  Cette option permet à tout témoin, artisan ou narrateur de déposer un fichier vidéo 9:16 déjà capté. Le comité éditorial YonyWood vérifie la résonance avec la question officielle de la série, étalonne le son et l'intègre au catalogue.
                </p>
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-700 space-y-1">
                  <div>✓ Format vertical 9:16 privilégié</div>
                  <div>✓ Droits d'auteur et traçabilité garantis</div>
                  <div>✓ Intégration dans la bibliothèque et l'astrolabe</div>
                </div>
              </div>
            ) : (
              <div>
                <h4 className="font-editorial text-xl font-bold text-stone-900 mb-2">
                  Comment fonctionne « Recruter un vidéaste » ?
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed mb-3">
                  YonyWood dispose d'un réseau de cinéastes formés au cinéma du réel sur 12 territoires (Bénin, Pérou, Sénégal, France, etc.). Vous pouvez réserver une session de tournage clé-en-main avec caméra professionnelle et son haute fidélité.
                </p>
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-700 space-y-1">
                  <div>✓ Tournage in-situ (atelier, lagune, domicile)</div>
                  <div>✓ Montage et étalonnage conformes à la charte</div>
                  <div>✓ Prise en charge directe ou via coproduction</div>
                </div>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-stone-200 flex justify-end">
              <button
                onClick={() => setDetailModalMode(null)}
                className="px-4 py-2 rounded-full text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 transition-colors cursor-pointer"
              >
                Compris
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
