import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Coins,
  TrendingUp,
  RefreshCw,
  X,
  CheckCircle2
} from 'lucide-react';
import { TvPlayerIcon } from '../YonywoodBrandIcons';

interface ProductionItem {
  id: string;
  title: string;
  posterImage: string;
  sharePrice: number;
  totalShares: number;
  remainingShares: number;
  subscribedShares: number;
  collectedAmount: number;
  goalAmount: number;
}

const ALL_8_PRODUCTIONS: ProductionItem[] = [
  {
    id: 'jesus-legba',
    title: 'Vodun Rays ‹ › Amîn · Amen',
    posterImage: '/assets/posters/Esu < > Jesus.jpg',
    sharePrice: 50,
    totalShares: 256,
    remainingShares: 224,
    subscribedShares: 32,
    collectedAmount: 1600,
    goalAmount: 12800
  },
  {
    id: 'finagnon-qosqorico',
    title: 'Bénin <> ...',
    posterImage: '/assets/posters/Benin < >.jpg',
    sharePrice: 50,
    totalShares: 200,
    remainingShares: 56,
    subscribedShares: 144,
    collectedAmount: 7200,
    goalAmount: 10000
  },
  {
    id: 'investors-builders',
    title: 'Diasporas <> Makers',
    posterImage: '/assets/posters/Diasporas < > Makers.jpg',
    sharePrice: 50,
    totalShares: 200,
    remainingShares: 90,
    subscribedShares: 110,
    collectedAmount: 5500,
    goalAmount: 10000
  },
  {
    id: 'dixeat-fiat-luxe',
    title: 'Fiat Luxe <> Sweet Street',
    posterImage: '/assets/posters/Fiat Luxe < > Street.jpg',
    sharePrice: 50,
    totalShares: 200,
    remainingShares: 120,
    subscribedShares: 80,
    collectedAmount: 4000,
    goalAmount: 10000
  },
  {
    id: 'other-eyes-sixth-sense',
    title: 'Other Sights <> Third Eye',
    posterImage: '/assets/posters/Other Eyes < > Third Eye.png',
    sharePrice: 50,
    totalShares: 250,
    remainingShares: 80,
    subscribedShares: 170,
    collectedAmount: 8500,
    goalAmount: 12500
  },
  {
    id: 'blacks-one-beyond-eve',
    title: 'Blacks One <> Beyond Eve',
    posterImage: '/assets/posters/Blacks One < > Beyond Eve.jpg',
    sharePrice: 50,
    totalShares: 200,
    remainingShares: 130,
    subscribedShares: 70,
    collectedAmount: 3500,
    goalAmount: 10000
  },
  {
    id: 'coaching-unlimited',
    title: 'Coach Me <> If You Can',
    posterImage: '/assets/posters/Coaching < > Unlimited.jpg',
    sharePrice: 50,
    totalShares: 200,
    remainingShares: 95,
    subscribedShares: 105,
    collectedAmount: 5250,
    goalAmount: 10000
  },
  {
    id: 'focus-phd',
    title: 'Pictures <> PhD',
    posterImage: '/assets/posters/Focus < >  PhD.jpg',
    sharePrice: 50,
    totalShares: 200,
    remainingShares: 140,
    subscribedShares: 60,
    collectedAmount: 3000,
    goalAmount: 10000
  }
];

export const DemoProductionsSection: React.FC = () => {
  const [tab, setTab] = useState<'a_l_affiche' | 'marche'>('a_l_affiche');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showDemoModal, setShowDemoModal] = useState(false);

  const currentProd = ALL_8_PRODUCTIONS[currentIdx];
  const percentSubscribed = Math.round((currentProd.subscribedShares / currentProd.totalShares) * 100);

  const handlePrev = () => {
    setCurrentIdx((prev) => (prev - 1 + ALL_8_PRODUCTIONS.length) % ALL_8_PRODUCTIONS.length);
  };

  const handleNext = () => {
    setCurrentIdx((prev) => (prev + 1) % ALL_8_PRODUCTIONS.length);
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-4 flex flex-col items-center select-none">

      {/* En-tête Productions avec onglets [À l'affiche, Marché] (identique Capture 4) */}
      <div className="w-full flex items-center justify-between mb-6 px-3 sm:px-6">
        <h3 className="font-editorial text-3xl font-bold text-stone-900">
          Productions
        </h3>

        <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-full border border-stone-200">
          <button
            onClick={() => setTab('a_l_affiche')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              tab === 'a_l_affiche'
                ? 'bg-[#A2482B] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            À l'affiche
          </button>
          <button
            onClick={() => setTab('marche')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              tab === 'marche'
                ? 'bg-[#A2482B] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Marché
          </button>
        </div>
      </div>

      {/* VUE 1 : À L'AFFICHE (Coproduction officielle) */}
      {tab === 'a_l_affiche' && (
        <div className="relative w-full max-w-md mx-auto flex items-center justify-center my-2">

          <button
            onClick={handlePrev}
            className="absolute -left-3 sm:-left-12 z-20 w-10 h-10 rounded-full bg-white text-stone-800 border border-stone-200 shadow-md flex items-center justify-center hover:bg-stone-100 transition-all cursor-pointer"
            title="Série précédente"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Carte 9:16 avec jauge de coproduction bornée au-dessus de la nav bar */}
          <div className="h-[min(490px,calc(100vh-220px))] aspect-[9/16] w-auto mx-auto rounded-3xl overflow-hidden bg-stone-950 text-white shadow-xl border border-stone-200 relative flex flex-col justify-between p-3.5 sm:p-4 shrink-0">

            <img
              src={currentProd.posterImage}
              alt={currentProd.title}
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40 pointer-events-none" />

            {/* Haut : Badge Titre & Déclencheur lecture */}
            <div className="relative z-10 flex items-center justify-between pointer-events-auto">
              <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-xs font-bold text-white tracking-wide">
                {currentProd.title}
              </span>

              <button
                type="button"
                className="w-8.5 h-8.5 rounded-lg sm:rounded-xl bg-black/45 hover:bg-[#A2482B] text-white backdrop-blur-md border border-white/20 hover:border-[#A2482B] flex items-center justify-center transition-all duration-200 cursor-pointer shadow-md hover:scale-105 active:scale-95 shrink-0"
                title={`Regarder le teaser de ${currentProd.title}`}
              >
                <TvPlayerIcon className="w-5 h-5 text-white transition-transform" strokeWidth={1.6} />
              </button>
            </div>

            {/* Centre : Play */}
            <div className="relative z-10 flex items-center justify-center my-auto">
              <div className="w-14 h-14 rounded-full bg-black/40 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-lg">
                <Play className="w-6 h-6 fill-white text-white translate-x-0.5" />
              </div>
            </div>

            {/* Bas : Bloc de coproduction semi-transparent (identique Capture 4) */}
            <div className="relative z-10 bg-black/65 backdrop-blur-md rounded-2xl p-3.5 border border-white/15 space-y-2.5">

              <div className="flex justify-between items-baseline text-xs">
                <div>
                  <span className="font-bold text-sm text-white">{currentProd.sharePrice} €</span>
                  <span className="text-[10px] text-stone-300 ml-1">/ part</span>
                </div>
                <div className="text-[11px] text-stone-200 font-semibold">
                  <strong>{currentProd.remainingShares}</strong> / {currentProd.totalShares} parts restantes
                </div>
              </div>

              {/* Jauge dorée */}
              <div className="w-full h-2 rounded-full bg-white/20 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#D4AF37] to-[#FFE7A3] rounded-full transition-all duration-500"
                  style={{ width: `${percentSubscribed}%` }}
                />
              </div>

              <div className="flex justify-between text-[10px] text-stone-300">
                <span>{currentProd.subscribedShares} parts ({percentSubscribed}%)</span>
                <span>{currentProd.collectedAmount} € / {currentProd.goalAmount} €</span>
              </div>

              {/* Bouton Acquérir */}
              <button
                onClick={() => setShowDemoModal(true)}
                className="w-full py-2 rounded-full bg-white text-stone-900 hover:bg-[#FFE7A3] text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md active:scale-95"
              >
                <span>Acquérir ({currentProd.sharePrice} €)</span>
                <span>→</span>
              </button>

            </div>

          </div>

          <button
            onClick={handleNext}
            className="absolute -right-3 sm:-right-12 z-20 w-10 h-10 rounded-full bg-white text-stone-800 border border-stone-200 shadow-md flex items-center justify-center hover:bg-stone-100 transition-all cursor-pointer"
            title="Série suivante"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* VUE 2 : MARCHÉ SECONDAIRE (Offres entre pairs) */}
      {tab === 'marche' && (
        <div className="w-full max-w-xl mx-auto space-y-3 my-2">
          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-600 mb-4 flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-[#A2482B] shrink-0" />
            <span>Marché secondaire : Les coproducteurs peuvent revendre leurs parts à d'autres membres à tout moment.</span>
          </div>

          {[
            { id: 'off-1', seller: 'Pascal Cossi', shares: 10, series: 'Other Sights <> Third Eye', price: 50, photo: '/assets/duos/codjo-blind.jpg' },
            { id: 'off-2', seller: 'Koffi', shares: 5, series: 'Fiat Luxe <> Sweet Street', price: 52, photo: '/assets/duos/chef-koffi.jpg' },
            { id: 'off-3', seller: 'Fatou Diallo', shares: 8, series: 'Diasporas <> Makers', price: 50, photo: '/assets/duos/fatou-diallo.jpg' },
          ].map((offer) => (
            <div
              key={offer.id}
              className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs flex items-center justify-between gap-3 hover:border-stone-400 transition-all"
            >
              <div className="flex items-center gap-3">
                <img
                  src={offer.photo}
                  alt={offer.seller}
                  className="w-12 h-12 rounded-xl object-cover border border-stone-200"
                />
                <div>
                  <h4 className="font-editorial text-sm font-bold text-stone-900">
                    {offer.series}
                  </h4>
                  <p className="text-xs text-stone-500">
                    Cédé par <strong>{offer.seller}</strong> · {offer.shares} parts à {offer.price} €
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowDemoModal(true)}
                className="px-3.5 py-1.5 rounded-full bg-stone-100 hover:bg-[#A2482B] hover:text-white text-stone-700 text-xs font-bold transition-colors cursor-pointer"
              >
                Acheter ({offer.shares * offer.price} €)
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modale d'explication démo pour l'acquisition de parts */}
      {showDemoModal && (
        <div
          onClick={() => setShowDemoModal(false)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200"
          >
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#A2482B]">
                Coproduction Démo
              </span>
              <button
                onClick={() => setShowDemoModal(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h4 className="font-editorial text-xl font-bold text-stone-900 mb-2">
              Comment fonctionne l'achat de parts ?
            </h4>

            <p className="text-xs text-stone-600 leading-relaxed mb-4">
              Dans la version connectée, ce bouton permet d'acheter immédiatement une ou plusieurs parts de coproduction (50 € / part) par carte ou portefeuille virtuel.
            </p>

            <div className="space-y-2 text-xs text-stone-700 mb-6 bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Votre nom est inscrit officiellement au générique de la série.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Vous recevez des rétrocessions sur les revenus publicitaires et de diffusion.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Vous pouvez revendre vos parts sur le marché secondaire à tout moment.</span>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowDemoModal(false)}
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
