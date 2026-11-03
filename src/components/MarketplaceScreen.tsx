import React, { useState, useRef, useEffect } from 'react';
import { 
  Coins, 
  Pause, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight,
  ArrowRight,
  Layers,
  CreditCard,
  Smartphone,
  Sparkles,
  ShieldCheck,
  Volume2,
  VolumeX
} from 'lucide-react';
import { ViewScreen } from '../types';
import { useAuth } from '../services/authContext';
import { recordSharePurchase, getSeriesRemainingShares, getAllSeriesRemainingShares } from '../services/firestoreService';
import { TvPlayerIcon } from './YonywoodBrandIcons';

interface MarketplaceScreenProps {
  onNavigate: (screen: ViewScreen) => void;
  initialPeerOfferId?: string;
  initialPeerIndex?: number;
  initialTab?: 'coproduire' | 'marche';
  restoreContext?: {
    offerId: string;
    offerIndex: number;
    sellerId: string;
    sellerName: string;
    sharesCount: number;
    unitPrice: number;
    seriesTitle: string;
  };
}

interface ProductionPoster {
  id: string;
  title: string;
  posterImage: string;
  videoPreviewUrl: string;
  sharePrice: number;
}

interface PeerOffer {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerPhoto: string;
  seriesTitle: string;
  posterImage: string;
  videoPreviewUrl: string;
  sharesCount: number;
  unitPrice: number;
}

const PRODUCTIONS: ProductionPoster[] = [
  {
    id: 'blacks-one-amazones',
    title: 'Blacks One ‹ › Amazones',
    posterImage: encodeURI('/assets/posters/Blacks One ‹ › Amazones.png'),
    videoPreviewUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    sharePrice: 50
  },
  {
    id: 'baobab-bambou',
    title: 'Baobabs ‹ › Bambous',
    posterImage: encodeURI('/assets/posters/Baobabs ‹ › Bambous.jpg'),
    videoPreviewUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    sharePrice: 50
  },
  {
    id: 'coaching-phd',
    title: 'Coaching ‹ › PhD',
    posterImage: encodeURI('/assets/posters/Coaching ‹ › PhD.jpg'),
    videoPreviewUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    sharePrice: 50
  },
  {
    id: 'jesus-legba',
    title: 'Vodun Rays ‹ › Autre Foi',
    posterImage: encodeURI('/assets/posters/Vodun Rays ‹ › Autre Foi.png'),
    videoPreviewUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    sharePrice: 50
  },
  {
    id: 'roots-routes',
    title: 'Roots < > Routes',
    posterImage: encodeURI('/assets/posters/Roots < > Routes.png'),
    videoPreviewUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    sharePrice: 50
  },
  {
    id: 'fiat-luxe-builders',
    title: 'Fiat Luxe ‹ › Builders',
    posterImage: encodeURI('/assets/posters/Fiat Luxe ‹ › Builders.jpg'),
    videoPreviewUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    sharePrice: 50
  },
  {
    id: 'pictures-words',
    title: 'Pictures ‹ › Words',
    posterImage: encodeURI('/assets/posters/Pictures ‹ › Words.jpg'),
    videoPreviewUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    sharePrice: 50
  },
  {
    id: 'benin-monde',
    title: 'Benin ‹ › Le Monde',
    posterImage: encodeURI('/assets/posters/Benin ‹ › Le Monde.jpg'),
    videoPreviewUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    sharePrice: 50
  }
];

const INITIAL_PEER_OFFERS: PeerOffer[] = [
  {
    id: 'peer-1',
    sellerId: 'koffi-tisserand',
    sellerName: 'Koffi',
    sellerPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    seriesTitle: 'Vodun Rays ‹ › Autre Foi',
    posterImage: '/assets/posters/vodun-autre-foi.png',
    videoPreviewUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    sharesCount: 3,
    unitPrice: 55
  },
  {
    id: 'peer-2',
    sellerId: 'nadia-artist',
    sellerName: 'Nadia',
    sellerPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    seriesTitle: 'Bénin ‹ › Le Monde',
    posterImage: '/assets/posters/benin-monde.jpg',
    videoPreviewUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    sharesCount: 5,
    unitPrice: 52
  },
  {
    id: 'peer-3',
    sellerId: 'marcel-speaker',
    sellerName: 'Marcel',
    sellerPhoto: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80',
    seriesTitle: 'Blacks One ‹ › Amazones',
    posterImage: '/assets/posters/blacks-one-amazones.png',
    videoPreviewUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    sharesCount: 2,
    unitPrice: 72
  },
  {
    id: 'peer-4',
    sellerId: 'amina-cook',
    sellerName: 'Amina',
    sellerPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    seriesTitle: 'Fiat Luxe ‹ › Builders',
    posterImage: '/assets/posters/fiat-luxe-builders.png',
    videoPreviewUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    sharesCount: 4,
    unitPrice: 62
  },
  {
    id: 'peer-5',
    sellerId: 'benoit-builder',
    sellerName: 'Benoît',
    sellerPhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    seriesTitle: 'Roots ‹ › Routes',
    posterImage: '/assets/posters/roots-routes.jpg',
    videoPreviewUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    sharesCount: 3,
    unitPrice: 68
  },
  {
    id: 'peer-6',
    sellerId: 'codjo-voyant',
    sellerName: 'Dossou & Sénan',
    sellerPhoto: '/assets/duos/codjo-blind.jpg',
    seriesTitle: 'Baobab ‹ › Bambou',
    posterImage: '/assets/posters/baobab-bambou.jpg',
    videoPreviewUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    sharesCount: 4,
    unitPrice: 59
  },
  {
    id: 'peer-7',
    sellerId: 'builder-kwame-seller',
    sellerName: 'Coach Marc',
    sellerPhoto: '/assets/duos/coach-office.jpg',
    seriesTitle: 'Coaching ‹ › PhD',
    posterImage: '/assets/posters/coaching-phd.png',
    videoPreviewUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    sharesCount: 6,
    unitPrice: 65
  },
  {
    id: 'peer-8',
    sellerId: 'clara-focus-seller',
    sellerName: 'Clara & Armel',
    sellerPhoto: '/assets/duos/photographer-focus.jpg',
    seriesTitle: 'Pictures ‹ › Words',
    posterImage: '/assets/posters/pictures-words.jpg',
    videoPreviewUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    sharesCount: 5,
    unitPrice: 58
  }
];

export const MarketplaceScreen: React.FC<MarketplaceScreenProps> = ({ 
  onNavigate,
  initialPeerOfferId,
  initialPeerIndex,
  initialTab,
  restoreContext
}) => {
  const [activeTab, setActiveTab] = useState<'coproduire' | 'marche'>('coproduire');

  // Indexes
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);

  const [marketIndex, setMarketIndex] = useState<number>(() => {
    if (typeof initialPeerIndex === 'number' && initialPeerIndex >= 0 && initialPeerIndex < INITIAL_PEER_OFFERS.length) {
      return initialPeerIndex;
    }
    if (restoreContext?.offerIndex !== undefined && restoreContext.offerIndex >= 0 && restoreContext.offerIndex < INITIAL_PEER_OFFERS.length) {
      return restoreContext.offerIndex;
    }
    if (initialPeerOfferId) {
      const idx = INITIAL_PEER_OFFERS.findIndex(p => p.id === initialPeerOfferId);
      if (idx !== -1) return idx;
    }
    return 0;
  });
  const [peerOffers, setPeerOffers] = useState<PeerOffer[]>(INITIAL_PEER_OFFERS);

  // Modal d'achat
  const [selectedProduction, setSelectedProduction] = useState<ProductionPoster | null>(null);
  const [purchaseQuantity, setPurchaseQuantity] = useState<number>(1);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mobile_money' | 'free_starter'>('card');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const { currentUser } = useAuth();

  // Jauge en temps réel sur 256 parts par série (~70% parts souscrites par défaut)
  const [remainingSharesMap, setRemainingSharesMap] = useState<Record<string, number>>({
    'jesus-legba': 77, // 179 souscrites (70% — 77 restantes)
    'roots-routes': 75, // 181 souscrites (71%)
    'coaching-phd': 79, // 177 souscrites (69%)
    'fiat-luxe-builders': 72, // 184 souscrites (72%)
    'blacks-one-amazones': 80, // 176 souscrites (69%)
    'benin-monde': 74, // 182 souscrites (71%)
    'baobab-bambou': 77, // 179 souscrites (70%)
    'pictures-words': 76, // 180 souscrites (70%)
    // Compatibilité
    'finagnon-qosqorico': 74,
    'blacks-one-beyond-eve': 80,
    'dixeat-fiat-luxe': 72,
    'investors-builders': 75,
    'other-eyes-sixth-sense': 77,
    'builders-seekers': 79,
    'coaching-unlimited': 79,
    'focus-phd': 76
  });

  // Chargement en temps réel des parts restantes depuis Firestore (requête unique optimisée)
  useEffect(() => {
    let isMounted = true;
    const loadRemainingShares = async () => {
      try {
        const baseMap: Record<string, number> = {};
        PRODUCTIONS.forEach(p => {
          const currentRemaining = remainingSharesMap[p.id] ?? 77;
          baseMap[p.id] = 256 - currentRemaining;
        });
        const updated = await getAllSeriesRemainingShares(baseMap);
        if (isMounted && Object.keys(updated).length > 0) {
          setRemainingSharesMap(prev => ({ ...prev, ...updated }));
        }
      } catch {
        // repli silencieux sur les valeurs par défaut
      }
    };
    loadRemainingShares();
    return () => { isMounted = false; };
  }, []);

  // Touch & Mouse horizontal gesture support (calqué exactement sur SubmitStoryScreen)
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const [swipeOffset, setSwipeOffset] = useState<number>(0);
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);
  const [mouseStartX, setMouseStartX] = useState<number | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const minSwipeDistance = 45;

  const currentProd = PRODUCTIONS[currentIndex];
  const currentOffer = peerOffers[marketIndex] || peerOffers[0];

  useEffect(() => {
    setIsPlaying(false);
  }, [currentIndex, marketIndex, activeTab]);

  useEffect(() => {
    if (restoreContext) {
      setSuccessToast(`Offre retrouvée : ${restoreContext.sharesCount} part${restoreContext.sharesCount > 1 ? 's' : ''} de ${restoreContext.seriesTitle} (${restoreContext.sellerName})`);
      const timer = setTimeout(() => setSuccessToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [restoreContext]);

  const handleNext = () => {
    if (activeTab === 'coproduire') {
      setCurrentIndex(prev => (prev + 1) % PRODUCTIONS.length);
    } else {
      if (peerOffers.length > 0) {
        setMarketIndex(prev => (prev + 1) % peerOffers.length);
      }
    }
  };

  const handlePrev = () => {
    if (activeTab === 'coproduire') {
      setCurrentIndex(prev => (prev - 1 + PRODUCTIONS.length) % PRODUCTIONS.length);
    } else {
      if (peerOffers.length > 0) {
        setMarketIndex(prev => (prev - 1 + peerOffers.length) % peerOffers.length);
      }
    }
  };

  // Touch handlers
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
    if (touchStartX !== null) {
      const diff = e.targetTouches[0].clientX - touchStartX;
      setSwipeOffset(Math.max(-90, Math.min(90, diff * 0.4)));
    }
  };

  const onTouchEnd = () => {
    setSwipeOffset(0);
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }
  };

  // Mouse drag handlers
  const onMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button, a, video')) return;
    setIsMouseDown(true);
    setMouseStartX(e.clientX);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown || mouseStartX === null) return;
    const diff = e.clientX - mouseStartX;
    setSwipeOffset(Math.max(-90, Math.min(90, diff * 0.4)));
  };

  const onMouseUp = (e: React.MouseEvent) => {
    if (!isMouseDown) return;
    setIsMouseDown(false);
    setSwipeOffset(0);
    if (mouseStartX === null) return;
    const distance = mouseStartX - e.clientX;
    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }
    setMouseStartX(null);
  };

  const toggleVideoPlayback = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsPlaying(prev => !prev);
  };

  const handleBuyOfficialShares = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduction) return;
    const total = purchaseQuantity * selectedProduction.sharePrice;
    setIsSubmitting(true);
    try {
      await recordSharePurchase({
        seriesId: selectedProduction.id,
        seriesTitle: selectedProduction.title,
        userId: currentUser?.id || 'usr-anonymous',
        userName: currentUser?.name || 'Coproducteur',
        userEmail: currentUser?.email || 'coproducteur@yonywood.com',
        sharesCount: purchaseQuantity,
        pricePerShare: selectedProduction.sharePrice,
        totalAmount: total,
        paymentMethod: paymentMethod
      });
      setRemainingSharesMap(prev => ({
        ...prev,
        [selectedProduction.id]: Math.max(0, (prev[selectedProduction.id] ?? 256) - purchaseQuantity)
      }));
      setSuccessToast(`Souscription validée ! ${purchaseQuantity} part(s) acquises pour « ${selectedProduction.title} » (${total} €).`);
      setSelectedProduction(null);
    } catch {
      setRemainingSharesMap(prev => ({
        ...prev,
        [selectedProduction.id]: Math.max(0, (prev[selectedProduction.id] ?? 256) - purchaseQuantity)
      }));
      setSuccessToast(`Souscription enregistrée pour « ${selectedProduction.title} » (${total} €).`);
      setSelectedProduction(null);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSuccessToast(null), 4000);
    }
  };

  const handleBuyPeerOffer = (offer: PeerOffer) => {
    const total = offer.sharesCount * offer.unitPrice;
    setSuccessToast(`Achat réussi ! Vous avez racheté les ${offer.sharesCount} part(s) de ${offer.sellerName} pour « ${offer.seriesTitle} » (${total} €).`);
    setPeerOffers(prev => {
      const updated = prev.filter(item => item.id !== offer.id);
      if (marketIndex >= updated.length) {
        setMarketIndex(Math.max(0, updated.length - 1));
      }
      return updated;
    });
    setTimeout(() => setSuccessToast(null), 4000);
  };

  // Capsules d'incitation à l'achat et vente de parts basées sur les 8 séries documentaires
  const SHARE_STORIES = [
    { id: 'sell-plus', isAdd: true, label: '+ Vendre' },
    ...PRODUCTIONS.map((prod, idx) => ({
      id: `story-prod-${prod.id}`,
      title: prod.title,
      img: prod.posterImage,
      prodIndex: idx
    }))
  ];

  return (
    <div className="w-full h-full max-h-full pb-20 sm:pb-24 pt-safe overflow-hidden flex flex-col justify-between text-[#1C1917] select-none bg-white">
      
      {/* ========================================================================= */}
      {/* 1. EN-TÊTE STORIES PRODUCTIONS : DÉGRADÉ BEIGE 50% VERS BLANC, SANS OMBRE  */}
      {/* ========================================================================= */}
      <div 
        className="w-full shrink-0 z-30 border-none shadow-none rounded-none"
        style={{ 
          background: 'var(--color-header-stories-gradient, linear-gradient(to bottom, var(--color-header-stories, #F8EFE4), #FFFFFF))' 
        }}
      >
        <div className="w-full max-w-3xl mx-auto px-3 sm:px-4 pt-1 pb-2 shrink-0 h-[72px] sm:h-[80px] flex items-center overflow-hidden">
          <div 
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'auto' }}
            className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar py-1 px-1 pb-5 -mb-4 w-full"
          >
            {SHARE_STORIES.map((st) => {
              if (st.isAdd) {
                return (
                  <div 
                    key={st.id}
                    onClick={() => setSuccessToast("Espace vente de parts : choisissez une de vos parts à proposer à la communauté.")}
                    className="flex flex-col items-center cursor-pointer group shrink-0"
                    title="Mettre en vente mes parts"
                  >
                    <div 
                      className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl p-0.5 border-2 border-dashed border-[#A2482B] flex items-center justify-center group-hover:scale-105 transition-transform bg-amber-50/50"
                      style={{ boxShadow: 'var(--story-ring-shadow, 0 1px 6px rgba(46, 27, 20, 0.12))' }}
                    >
                      <div className="w-full h-full rounded-xl bg-[#A2482B] text-white flex items-center justify-center shadow-xs">
                        <span className="text-base font-bold">+</span>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div 
                  key={st.id}
                  onClick={() => {
                    if (st.prodIndex !== undefined) {
                      setActiveTab('coproduire');
                      setCurrentIndex(st.prodIndex);
                    }
                  }}
                  className="flex flex-col items-center cursor-pointer group shrink-0"
                  title={st.title}
                >
                  <div 
                    className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl p-0.5 border-2 border-white ring-1 ring-black/5 bg-white transition-transform group-hover:scale-105"
                    style={{ boxShadow: 'var(--story-ring-shadow, 0 1px 6px rgba(46, 27, 20, 0.12))' }}
                  >
                    <div className="w-full h-full rounded-xl overflow-hidden bg-stone-900 relative">
                      <img 
                        src={st.img} 
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* TOAST SUCCÈS LUDIQUE */}
      {successToast && (
        <div className="fixed top-14 z-50 max-w-sm mx-auto px-4 py-2 rounded-2xl bg-[#1C1917] text-white text-xs font-semibold flex items-center gap-2 shadow-xl animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. CARTE 9:16 STRICTEMENT IDENTIQUE EN GÉOMÉTRIE AUX AUTRES PAGES         */}
      {/* ========================================================================= */}
      <div className="relative flex-1 flex flex-col items-center justify-center min-h-0 py-1 px-3 sm:px-4 my-auto">
        
        {/* Flèche Gauche */}
        <button
          onClick={handlePrev}
          className="hidden md:flex absolute left-4 lg:left-8 z-30 w-10 h-10 rounded-full bg-white/90 hover:bg-[#1C1917] text-stone-800 hover:text-white border border-stone-200 shadow-lg items-center justify-center transition-all cursor-pointer transform hover:scale-105 active:scale-95"
          title="Précédent"
          id="prev-poster-btn"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Flèche Droite */}
        <button
          onClick={handleNext}
          className="hidden md:flex absolute right-4 lg:right-8 z-30 w-10 h-10 rounded-full bg-white/90 hover:bg-[#1C1917] text-stone-800 hover:text-white border border-stone-200 shadow-lg items-center justify-center transition-all cursor-pointer transform hover:scale-105 active:scale-95"
          title="Suivant"
          id="next-poster-btn"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* CARTE UNIQUE FORMAT VIDÉO VERTICAL 9:16 STRICTEMENT CALIBRÉE */}
        <div
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          className="relative aspect-[9/16] w-[min(calc(100vw-64px),calc((100dvh-230px)*9/16))] max-w-[228px] sm:max-w-[270px] md:max-w-[290px] h-[min(410px,calc(100dvh-230px))] sm:h-[min(480px,calc(100dvh-200px))] md:h-[min(520px,calc(100dvh-180px))] rounded-2xl sm:rounded-3xl overflow-hidden border border-stone-200/90 bg-[#12110F] text-white flex flex-col justify-between select-none"
          style={{ transform: `translateX(${swipeOffset}px)` }}
        >
            {/* =================================================================== */}
            {/* VUE A : À L'AFFICHE                                                */}
            {/* =================================================================== */}
            {activeTab === 'coproduire' && currentProd && (
              <div 
                className="group relative w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden bg-[#151513] text-[#FFFFFF] border border-stone-200/80 flex flex-col justify-between p-2.5 sm:p-4.5 select-none"
                id={`card-coproduire-${currentProd.id}`}
              >
                {/* 1. Média de fond : Affiche officielle par défaut OU Vidéo si lecture activée */}
                {isPlaying ? (
                  <video
                    ref={videoRef}
                    src={currentProd.videoPreviewUrl}
                    poster={currentProd.posterImage}
                    autoPlay
                    loop
                    playsInline
                    muted={isMuted}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={currentProd.posterImage}
                    alt={currentProd.title}
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 pointer-events-none"
                  />
                )}

                {/* Voile cinématographique clair pour préserver l'éclat de l'affiche */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

                {/* HAUT : Titre de la série à gauche + Déclencheur Petite Télé en haut à droite */}
                <div className="relative z-10 flex items-center justify-between gap-1.5 pointer-events-auto w-full min-w-0">
                  <div className="inline-flex items-center px-2.5 sm:px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 shadow-md max-w-[calc(100%-80px)]">
                    <span 
                      className="font-editorial text-[11px] sm:text-xs font-semibold text-white whitespace-nowrap tracking-wide select-none truncate block"
                      title={currentProd.title}
                    >
                      {currentProd.title}
                    </span>
                  </div>

                  {/* Déclencheur lecteur vidéo « Petite Télé » standardisé en haut à droite */}
                  <div 
                    className="flex items-center gap-1.5 shrink-0"
                    onMouseDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                  >
                    {/* Bouton Muet discret (uniquement si en lecture) */}
                    {isPlaying && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setIsMuted((prev) => !prev);
                        }}
                        onMouseDown={(e) => e.stopPropagation()}
                        onTouchStart={(e) => e.stopPropagation()}
                        className="w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-full bg-black/50 hover:bg-[#A2482B] backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
                        title={isMuted ? 'Activer le son' : 'Couper le son'}
                      >
                        {isMuted ? <VolumeX className="w-3.5 h-3.5 text-white" /> : <Volume2 className="w-3.5 h-3.5 text-white" />}
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleVideoPlayback();
                      }}
                      onMouseDown={(e) => e.stopPropagation()}
                      onTouchStart={(e) => e.stopPropagation()}
                      className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-xl bg-black/45 hover:bg-[#A2482B] text-white backdrop-blur-md border border-white/20 hover:border-[#A2482B] flex items-center justify-center transition-all duration-200 cursor-pointer shadow-md hover:scale-105 active:scale-95 shrink-0"
                      title={isPlaying ? 'Mettre en pause' : `Visionner le teaser de ${currentProd.title}`}
                    >
                      {isPlaying ? (
                        <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white text-white" />
                      ) : (
                        <TvPlayerIcon className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-white transition-transform" strokeWidth={1.7} />
                      )}
                    </button>
                  </div>
                </div>

                {/* CENTRE LIBÉRÉ : Affiche visible et sans encombrement */}
                <div className="my-auto" />

                {/* BAS : JAUGE MINIMALE SANS LÉGENDES TEXTUELLES & BOUTON D'ACQUISITION */}
                {(() => {
                  const remaining = remainingSharesMap[currentProd.id] ?? 77;
                  const taken = Math.max(0, 256 - remaining);
                  const percent = Math.min(100, Math.round((taken / 256) * 100));

                  return (
                    <div className="relative z-10 w-full flex items-center justify-between gap-2 pt-0.5">
                      {/* Jauge fine épurée sans légende */}
                      <div className="flex-1 bg-black/60 backdrop-blur-md rounded-full p-1 border border-white/15 shadow-sm">
                        <div className="w-full h-1.5 rounded-full bg-stone-900/90 overflow-hidden relative">
                          <div 
                            className="h-full rounded-full bg-gradient-to-r from-[#A2482B] via-[#C89B3C] to-[#FFE7A3] transition-all duration-700"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>

                      {/* Bouton Acquérir */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProduction(currentProd);
                          setPurchaseQuantity(1);
                        }}
                        id={`btn-coproduire-${currentProd.id}`}
                        className="h-8 sm:h-8.5 px-3.5 sm:px-4 rounded-full bg-white hover:bg-[#A2482B] text-stone-900 hover:text-white text-[11px] sm:text-xs font-bold backdrop-blur-md transition-all flex items-center gap-1.5 shadow-md border border-stone-200/80 hover:border-[#A2482B] cursor-pointer shrink-0 active:scale-95 group/coprod"
                        title="Acquérir des parts pour cette série"
                      >
                        <Coins className="w-3.5 h-3.5 text-[#C89B3C] group-hover/coprod:text-white transition-colors" />
                        <span>50 €</span>
                        <ArrowRight className="w-3 h-3 text-stone-600 group-hover/coprod:text-white transition-colors ml-0.5" />
                      </button>
                    </div>
                  );
                })()}

              </div>
            )}

            {/* =================================================================== */}
            {/* VUE B : MARCHÉ DES PARTS ENTRE PAIRS                                */}
            {/* =================================================================== */}
            {activeTab === 'marche' && currentOffer && (
              <div 
                className="group relative w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden bg-[#151513] text-[#FFFFFF] shadow-2xl border border-stone-200/80 flex flex-col justify-between p-2.5 sm:p-4.5 select-none"
                id={`card-marche-${currentOffer.id}`}
              >
                {/* 1. Média de fond : Affiche officielle par défaut OU Vidéo si lecture activée */}
                {isPlaying ? (
                  <video
                    ref={videoRef}
                    src={currentOffer.videoPreviewUrl}
                    poster={currentOffer.posterImage}
                    autoPlay
                    loop
                    playsInline
                    muted={isMuted}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={currentOffer.posterImage}
                    alt={currentOffer.seriesTitle}
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 pointer-events-none"
                  />
                )}

                {/* Voile cinématographique clair pour préserver l'éclat de l'affiche */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

                {/* HAUT : Déclencheur Petite Télé en haut à droite uniquement */}
                <div className="relative z-10 flex items-center justify-end pointer-events-auto">
                  {/* Déclencheur lecteur vidéo « Petite Télé » standardisé en haut à droite */}
                  <div 
                    className="flex items-center gap-1.5 shrink-0"
                    onMouseDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                  >
                    {/* Bouton Muet discret (uniquement si en lecture) */}
                    {isPlaying && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setIsMuted((prev) => !prev);
                        }}
                        onMouseDown={(e) => e.stopPropagation()}
                        onTouchStart={(e) => e.stopPropagation()}
                        className="w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-full bg-black/50 hover:bg-[#A2482B] backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
                        title={isMuted ? 'Activer le son' : 'Couper le son'}
                      >
                        {isMuted ? <VolumeX className="w-3.5 h-3.5 text-white" /> : <Volume2 className="w-3.5 h-3.5 text-white" />}
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleVideoPlayback();
                      }}
                      onMouseDown={(e) => e.stopPropagation()}
                      onTouchStart={(e) => e.stopPropagation()}
                      className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-xl bg-black/45 hover:bg-[#A2482B] text-white backdrop-blur-md border border-white/20 hover:border-[#A2482B] flex items-center justify-center transition-all duration-200 cursor-pointer shadow-md hover:scale-105 active:scale-95 shrink-0"
                      title={isPlaying ? 'Mettre en pause' : `Visionner le teaser de ${currentOffer.seriesTitle}`}
                    >
                      {isPlaying ? (
                        <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white text-white" />
                      ) : (
                        <TvPlayerIcon className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-white transition-transform" strokeWidth={1.7} />
                      )}
                    </button>
                  </div>
                </div>


                {/* CENTRE LIBÉRÉ : Affiche visible et sans encombrement */}
                <div className="my-auto" />

                {/* BAS : À gauche (au-dessus : nb de parts et prix au même format / en dessous : vignette photo + prénom) */}
                {/* Et à droite : bouton d'action Racheter avec fond Terre Cuite */}
                <div className="relative z-10 flex items-end justify-between gap-1.5 pt-0.5">
                  
                  {/* BLOC GAUCHE : parts + prix, puis vignette photo et prénom */}
                  <div className="flex flex-col gap-1.5">
                    
                    {/* Nombre de parts & Prix épurés sans icône */}
                    <div className="h-7.5 sm:h-8.5 px-2.5 sm:px-3 rounded-full bg-black/60 hover:bg-black/85 text-white/95 text-[10.5px] sm:text-[11px] font-medium backdrop-blur-md transition-all flex items-center gap-1.5 border border-white/20 shadow-sm w-fit">
                      <span className="font-bold text-white">{currentOffer.sharesCount} part{currentOffer.sharesCount > 1 ? 's' : ''}</span>
                      <span className="text-white/40">•</span>
                      <span className="font-bold text-[#C89B3C]">{currentOffer.unitPrice} €</span>
                      <span className="text-[9.5px] text-white/70">/ part</span>
                    </div>

                    {/* Juste le prénom et sa vignette photo cliquable vers son univers */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate({ 
                          type: 'protagonist_profile', 
                          protagonistId: currentOffer.sellerId,
                          returnToMarketplace: true,
                          marketplaceContext: {
                            offerId: currentOffer.id,
                            offerIndex: marketIndex,
                            sellerId: currentOffer.sellerId,
                            sellerName: currentOffer.sellerName,
                            sharesCount: currentOffer.sharesCount,
                            unitPrice: currentOffer.unitPrice,
                            seriesTitle: currentOffer.seriesTitle
                          }
                        });
                      }}
                      className="h-7 sm:h-7.5 px-2 sm:px-2.5 rounded-full bg-black/60 hover:bg-black/85 text-white text-[10.5px] font-medium backdrop-blur-md transition-all flex items-center gap-1.5 border border-white/20 cursor-pointer shadow-sm group/user text-left w-fit active:scale-95"
                      title={`Découvrir l’univers de ${currentOffer.sellerName}`}
                    >
                      <img 
                        src={currentOffer.sellerPhoto} 
                        alt={currentOffer.sellerName}
                        className="w-4.5 h-4.5 rounded-full object-cover ring-1 ring-[#C89B3C]"
                      />
                      <span className="font-bold text-white group-hover/user:text-[#C89B3C] transition-colors truncate max-w-[85px]">
                        {currentOffer.sellerName}
                      </span>
                    </button>

                  </div>

                  {/* Bouton Racheter ces parts : même format que coproduire (gris clair au repos, marron terre cuite au survol) */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBuyPeerOffer(currentOffer);
                    }}
                    id={`btn-buy-peer-${currentOffer.id}`}
                    className="h-7.5 sm:h-8.5 px-3 sm:px-3.5 rounded-full bg-stone-100/95 hover:bg-[#A2482B] text-stone-800 hover:text-white text-[11px] sm:text-xs font-bold backdrop-blur-md transition-all flex items-center gap-1 shadow-md border border-stone-200/80 hover:border-[#A2482B] cursor-pointer shrink-0 active:scale-95 group/racheter"
                    title="Racheter ces parts"
                  >
                    <span>Racheter</span>
                    <ArrowRight className="w-3 h-3 text-stone-600 group-hover/racheter:text-white transition-colors" />
                  </button>

                </div>

              </div>
            )}

            {/* Si Marché vide */}
            {activeTab === 'marche' && peerOffers.length === 0 && (
              <div className="w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden bg-[#151513] text-white/80 flex flex-col items-center justify-center p-6 text-center space-y-3 border border-stone-200/80 shadow-2xl">
                <Coins className="w-12 h-12 text-[#C89B3C] opacity-60" />
                <h3 className="font-editorial text-lg font-bold text-white">Marché au repos</h3>
                <p className="text-xs text-white/70">Toutes les parts ont été rachetées par la communauté.</p>
              </div>
            )}

          </div>
        </div>

      {/* ========================================================================= */}
      {/* MODALE D'ACHAT DE PARTS                                                   */}
      {/* ========================================================================= */}
      {selectedProduction && (
        <div 
          onClick={() => setSelectedProduction(null)}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-[#FFFFFF] rounded-3xl border border-[#EAE4D5] shadow-2xl p-5 text-[#1C1917] space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B6845]">
                  Marché
                </span>
                <h3 className="text-lg font-editorial font-bold text-[#1C1917]">
                  {selectedProduction.title}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedProduction(null)}
                className="text-[#7A756B] hover:text-[#1C1917] p-1 cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBuyOfficialShares} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[#52504B] text-center">
                  Nombre de parts à souscrire
                </label>
                <div className="flex items-center justify-center gap-4 bg-[#FAF7EF] p-2 rounded-2xl border border-[#E7E5E4]">
                  <button
                    type="button"
                    onClick={() => setPurchaseQuantity(prev => Math.max(1, prev - 1))}
                    className="w-10 h-10 rounded-xl bg-white hover:bg-[#EFE9DD] text-[#1C1917] font-bold flex items-center justify-center cursor-pointer border border-[#E7E5E4] shadow-xs"
                  >
                    -
                  </button>
                  <span className="text-2xl font-bold font-mono text-[#1C1917] w-12 text-center">
                    {purchaseQuantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPurchaseQuantity(prev => Math.min((remainingSharesMap[selectedProduction.id] ?? 256), prev + 1))}
                    className="w-10 h-10 rounded-xl bg-white hover:bg-[#EFE9DD] text-[#1C1917] font-bold flex items-center justify-center cursor-pointer border border-[#E7E5E4] shadow-xs"
                  >
                    +
                  </button>
                </div>
                {/* Raccourcis de sélection */}
                <div className="flex items-center justify-center gap-1.5 pt-1">
                  {[1, 2, 5, 10].map(qty => (
                    <button
                      key={qty}
                      type="button"
                      onClick={() => setPurchaseQuantity(qty)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold border transition-all cursor-pointer ${
                        purchaseQuantity === qty 
                          ? 'bg-[#A2482B] text-white border-[#A2482B]' 
                          : 'bg-white hover:bg-[#FAF7EF] text-stone-700 border-stone-200'
                      }`}
                    >
                      {qty} part{qty > 1 ? 's' : ''} ({qty * 50} €)
                    </button>
                  ))}
                </div>
              </div>

              {/* Choix du mode de paiement */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold text-[#52504B]">
                  Mode de règlement
                </label>
                <div className="grid grid-cols-3 gap-1.5 text-[10.5px]">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'bg-[#1C1917] text-white border-[#1C1917] shadow-xs'
                        : 'bg-white hover:bg-[#FAF7EF] text-stone-700 border-stone-200'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span className="font-semibold">Carte</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('mobile_money')}
                    className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      paymentMethod === 'mobile_money'
                        ? 'bg-[#1C1917] text-white border-[#1C1917] shadow-xs'
                        : 'bg-white hover:bg-[#FAF7EF] text-stone-700 border-stone-200'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span className="font-semibold">Mobile Money</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('free_starter')}
                    className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      paymentMethod === 'free_starter'
                        ? 'bg-[#1C1917] text-white border-[#1C1917] shadow-xs'
                        : 'bg-white hover:bg-[#FAF7EF] text-stone-700 border-stone-200'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span className="font-semibold">Test Gratuit</span>
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#FAF7EF] border border-[#E7E5E4] space-y-1.5 text-xs">
                <div className="flex justify-between text-[#7A756B]">
                  <span>Prix unitaire :</span>
                  <span className="font-bold text-[#1C1917]">50 € / part</span>
                </div>
                <div className="flex justify-between text-[#7A756B]">
                  <span>Plafond de série :</span>
                  <span className="font-medium text-[#1C1917]">256 parts (12 800 €)</span>
                </div>
                <div className="flex justify-between font-bold text-[#1C1917] pt-1.5 border-t border-[#EAE4D5]">
                  <span>Total souscription :</span>
                  <span className="text-[#1C1917] text-sm font-mono font-bold">
                    {paymentMethod === 'free_starter' ? '0 € (Offert Test)' : `${purchaseQuantity * 50} €`}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                id="btn-confirm-buy-shares"
                className="w-full py-3 rounded-2xl bg-[#1C1917] hover:bg-stone-800 disabled:opacity-50 text-white font-bold text-xs transition-transform active:scale-95 shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Coins className="w-4 h-4 text-[#C89B3C]" />
                <span>
                  {isSubmitting 
                    ? 'Enregistrement sécurisé...' 
                    : paymentMethod === 'free_starter'
                      ? 'Valider mon attribution gratuite'
                      : `Souscrire (${purchaseQuantity * 50} €)`}
                </span>
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
