import React, { useState, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  Film
} from 'lucide-react';
import { TvPlayerIcon } from '../YonywoodBrandIcons';

interface CompanyCard {
  id: string;
  type: 'intro' | 'member';
  companyName: string;
  firstName?: string;
  role?: string;
  photoUrl: string;
  videoUrl?: string;
  title?: string;
  quote?: string;
}

const AFRIKA_FUN_CARDS: CompanyCard[] = [
  {
    id: 'intro',
    type: 'intro',
    companyName: 'Africafun',
    title: 'Espace Entreprise',
    photoUrl: '/assets/Onboardings/Voyage.png',
    quote: 'Un espace vivant dédié à la valorisation authentique de l’entreprise. Ici, collaborateurs, créateurs et partenaires racontent l’histoire humaine, les savoir-faire et l’âme qui font votre réalité.'
  },
  {
    id: 'member-1',
    type: 'member',
    companyName: 'Africafun',
    firstName: 'Amina',
    role: 'Monteuse & Réalisatrice',
    photoUrl: '/assets/protagonists/adjovi-blandine.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    quote: '« Chez Africafun, chaque montage préserve la vérité des regards et le rythme noble de nos récits. »'
  },
  {
    id: 'member-2',
    type: 'member',
    companyName: 'Africafun',
    firstName: 'Sèdjro',
    role: 'Chef opérateur & Cadreur',
    photoUrl: '/assets/duos/kwame-mensah.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    quote: '« Capter la lumière naturelle des ateliers et des lagunes pour révéler la dignité du geste. »'
  },
  {
    id: 'member-3',
    type: 'member',
    companyName: 'Africafun',
    firstName: 'Armel',
    role: 'Producteur délégué',
    photoUrl: '/assets/protagonists/armel-hounkpatin.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    quote: '« Transmettre une mémoire vivante et offrir à l’entreprise une empreinte culturelle durable. »'
  }
];

export const DemoEntrepriseSection: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Swipe tactile
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);

  const currentCard = AFRIKA_FUN_CARDS[currentIdx];

  const handlePrev = () => {
    setIsPlaying(false);
    setCurrentIdx((prev) => (prev - 1 + AFRIKA_FUN_CARDS.length) % AFRIKA_FUN_CARDS.length);
  };

  const handleNext = () => {
    setIsPlaying(false);
    setCurrentIdx((prev) => (prev + 1) % AFRIKA_FUN_CARDS.length);
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
        handlePrev();
      } else if (diff < -40) {
        handleNext();
      }
    }
    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  return (
    <div
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className="w-full max-w-4xl mx-auto py-4 flex flex-col items-center select-none"
    >

      {/* En-tête Entreprises : titre exactement au même endroit que Studio */}
      <div className="w-full flex items-center justify-between mb-4 sm:mb-6 px-3 sm:px-6">
        <h3 className="font-editorial text-3xl font-bold text-stone-900">
          Entreprises
        </h3>
      </div>

      {/* CARTE 9:16 INTERACTIVE AVEC FLÈCHES LATÉRALES */}
      <div className="relative w-full max-w-md mx-auto flex items-center justify-center my-2">

        {/* Flèche gauche */}
        <button
          onClick={handlePrev}
          className="absolute -left-3 sm:-left-12 z-20 w-10 h-10 rounded-full bg-white text-stone-800 border border-stone-200 shadow-md flex items-center justify-center hover:bg-stone-100 transition-all cursor-pointer hover:scale-105 active:scale-95"
          title="Carte précédente"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Carte 9:16 : hauteur bornée pour rester au-dessus de la nav bar */}
        <div className="h-[min(490px,calc(100vh-220px))] aspect-[9/16] w-auto mx-auto rounded-3xl overflow-hidden bg-stone-950 text-white shadow-xl border border-stone-200 relative flex flex-col justify-between p-3.5 sm:p-4 shrink-0">

          {isPlaying && currentCard.videoUrl ? (
            <div className="absolute inset-0 z-20 bg-black flex flex-col justify-between p-4">
              <video
                src={currentCard.videoUrl}
                autoPlay
                playsInline
                muted={isMuted}
                className="absolute inset-0 w-full h-full object-cover"
                onEnded={() => setIsPlaying(false)}
              />
              <div className="relative z-30 flex justify-between items-center">
                <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-xs font-bold tracking-wide text-white">
                  {currentCard.companyName}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="w-7 h-7 rounded-full bg-black/60 flex items-center justify-center text-white cursor-pointer"
                  >
                    {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => setIsPlaying(false)}
                    className="w-7 h-7 rounded-full bg-black/60 flex items-center justify-center text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="relative z-30 pb-2">
                <h4 className="font-editorial text-2xl font-bold text-white drop-shadow-md">
                  {currentCard.firstName}
                </h4>
                <p className="text-xs text-stone-300 mt-1">{currentCard.role}</p>
              </div>
            </div>
          ) : (
            <>
              <img
                src={currentCard.photoUrl}
                alt={currentCard.companyName}
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/40 pointer-events-none" />

              {/* Haut : Nom de l'entreprise "Africafun" & Déclencheur lecture */}
              <div className="relative z-10 flex justify-between items-center pointer-events-auto">
                <span className="px-3.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-xs font-bold text-white tracking-wider">
                  {currentCard.companyName}
                </span>

                {currentCard.type === 'member' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsPlaying(!isPlaying);
                    }}
                    className="w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-black/45 hover:bg-[#A2482B] text-white backdrop-blur-md border border-white/20 hover:border-[#A2482B] flex items-center justify-center transition-all duration-200 cursor-pointer shadow-md hover:scale-105 active:scale-95 shrink-0"
                    title={isPlaying ? "Mettre en pause" : `Regarder la vidéo de ${currentCard.firstName}`}
                  >
                    {isPlaying ? (
                      <Pause className="w-3.5 h-3.5 fill-white text-white" />
                    ) : (
                      <TvPlayerIcon className="w-5 h-5 text-white transition-transform" strokeWidth={1.6} />
                    )}
                  </button>
                )}
              </div>

              {/* Centre : Play pour les vidéos des collaborateurs, ou icône élégante pour la carte intro */}
              <div className="relative z-10 flex items-center justify-center my-auto">
                {currentCard.type === 'member' ? (
                  <button
                    onClick={() => setIsPlaying(true)}
                    className="w-14 h-14 rounded-full bg-black/40 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:scale-110 transition-transform cursor-pointer shadow-lg"
                    title={`Écouter le mot de ${currentCard.firstName}`}
                  >
                    <Play className="w-6 h-6 fill-white text-white translate-x-0.5" />
                  </button>
                ) : (
                  <div className="w-14 h-14 rounded-full bg-[#A2482B]/60 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-lg">
                    <Film className="w-7 h-7 text-white" />
                  </div>
                )}
              </div>

              {/* Bas de carte bien aéré : Prénom, rôle sobre et citation concise */}
              <div className="relative z-10 space-y-2.5 pb-1">
                {currentCard.type === 'intro' ? (
                  <>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFE7A3]">
                        Présentation
                      </span>
                      <h4 className="font-editorial text-2xl font-bold text-white drop-shadow-md mt-0.5">
                        {currentCard.title}
                      </h4>
                    </div>

                    <div className="bg-black/60 backdrop-blur-md rounded-2xl p-3 border border-white/15">
                      <p className="text-xs text-stone-200 leading-relaxed">
                        {currentCard.quote}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-0.5">
                      <h4 className="font-editorial text-2xl sm:text-3xl font-bold text-white drop-shadow-md tracking-wide">
                        {currentCard.firstName}
                      </h4>
                      <p className="text-xs font-semibold text-[#FFE7A3] tracking-wide">
                        {currentCard.role}
                      </p>
                    </div>

                    <div className="bg-black/60 backdrop-blur-md rounded-2xl p-3 border border-white/15">
                      <p className="text-xs text-stone-100 leading-relaxed italic">
                        {currentCard.quote}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </>
          )}

        </div>

        {/* Flèche droite */}
        <button
          onClick={handleNext}
          className="absolute -right-3 sm:-right-12 z-20 w-10 h-10 rounded-full bg-white text-stone-800 border border-stone-200 shadow-md flex items-center justify-center hover:bg-stone-100 transition-all cursor-pointer hover:scale-105 active:scale-95"
          title="Carte suivante"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

      </div>

    </div>
  );
};
