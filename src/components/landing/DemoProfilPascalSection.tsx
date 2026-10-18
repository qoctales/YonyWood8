import React, { useState, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Lock
} from 'lucide-react';

interface PascalCard {
  id: string;
  category: string;
  title: string;
  description: string;
  badge?: string;
  extraElement?: 'button_disabled' | 'progress';
}

const PASCAL_CARDS: PascalCard[] = [
  {
    id: 'association',
    category: 'Association',
    title: '« Voir Autrement »',
    description: 'Présidée par Pascal Cossi, l’association sensibilise au handicap visuel, favorise l’insertion et crée des ateliers d’artisanat solidaire pour personnes en situation de handicap.',
    badge: 'Mission Solidaire'
  },
  {
    id: 'production',
    category: 'Coproducteur',
    title: 'Production (10 parts)',
    description: 'Pascal détient 10 parts de coproduction dans la série officielle « Other Sights <> Third Eye », garantissant son intéressement direct aux rétrocessions du modèle circulaire.',
    badge: 'Modèle Circulaire',
    extraElement: 'button_disabled'
  },
  {
    id: 'services',
    category: 'Produits & Services',
    title: 'Consultations du Fâ',
    description: 'Prêtre initié du Fâ, Pascal transmet la guidance des signes oraculaires traditionnels pour orienter les décisions de vie et valoriser la sagesse ancestrale.',
    badge: 'Sagesse & Fâ'
  },
  {
    id: 'projets',
    category: 'Projets Solidaires',
    title: 'Atelier Participatif de Grand Popo',
    description: 'Chantier d’aménagement d’un espace de travail et de vente adapté à Grand Popo, permettant aux artisans déficients visuels de tisser et vendre leurs créations en toute autonomie.',
    badge: 'Chantier en cours',
    extraElement: 'progress'
  }
];

export const DemoProfilPascalSection: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);

  // Swipe tactile
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);

  const currentCard = PASCAL_CARDS[currentIdx];

  const handlePrev = () => {
    setCurrentIdx((prev) => (prev - 1 + PASCAL_CARDS.length) % PASCAL_CARDS.length);
  };

  const handleNext = () => {
    setCurrentIdx((prev) => (prev + 1) % PASCAL_CARDS.length);
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
      
      {/* En-tête Profil : titre exactement au même endroit que Studio */}
      <div className="w-full flex items-center justify-between mb-4 sm:mb-6 px-3 sm:px-6">
        <h3 className="font-editorial text-3xl font-bold text-stone-900">
          Profil
        </h3>
      </div>

      {/* CARTE 9:16 AVEC FLÈCHES LATÉRALES : TÊTE DE PASCAL EN HAUT, CARRÉ BLANC VARIABLE EN BAS */}
      <div className="relative w-full max-w-md mx-auto flex items-center justify-center my-2">
        
        {/* Flèche gauche */}
        <button
          onClick={handlePrev}
          className="absolute -left-3 sm:-left-12 z-20 w-10 h-10 rounded-full bg-white text-stone-800 border border-stone-200 shadow-md flex items-center justify-center hover:bg-stone-100 transition-all cursor-pointer hover:scale-105 active:scale-95"
          title="Carte précédente"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Carte 9:16 : moitié photo de Pascal, moitié contenu blanc - hauteur bornée au-dessus de la nav bar */}
        <div className="h-[min(490px,calc(100vh-220px))] aspect-[9/16] w-auto mx-auto rounded-3xl overflow-hidden bg-white shadow-xl border border-stone-200 relative flex flex-col justify-between shrink-0">
          
          {/* MOITIÉ SUPÉRIEURE : TOUJOURS LA PHOTO DE PASCAL AVEC SON NOM EN HAUT (SANS INDICATEUR 4/4) */}
          <div className="relative h-1/2 w-full bg-stone-900 overflow-hidden shrink-0">
            <img
              src="/assets/duos/codjo-blind.jpg"
              alt="Pascal Cossi"
              className="w-full h-full object-cover pointer-events-none"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40 pointer-events-none" />

            {/* Badge "Pascal Cossi" en haut */}
            <div className="absolute top-3 left-3 z-10">
              <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-xs font-bold text-white tracking-wide">
                Pascal Cossi
              </span>
            </div>
          </div>

          {/* MOITIÉ INFÉRIEURE : CARRÉ BLANC QUI CHANGE SELON LA CARTE */}
          <div className="h-1/2 p-3.5 sm:p-4.5 flex flex-col justify-between bg-white text-stone-900 overflow-y-auto">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#A2482B] block">
                {currentCard.category}
              </span>
              <h4 className="font-editorial text-base sm:text-lg font-bold leading-tight mt-1 text-stone-900">
                {currentCard.title}
              </h4>
              <p className="text-[11px] sm:text-xs text-stone-600 leading-relaxed mt-1.5 line-clamp-3">
                {currentCard.description}
              </p>
            </div>

            {/* Éléments contextuels selon la carte */}
            <div className="pt-2 border-t border-stone-100 mt-auto">
              {currentCard.extraElement === 'button_disabled' && (
                <div className="w-full py-1.5 px-3 rounded-xl bg-stone-100 text-stone-400 border border-stone-200 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-not-allowed select-none">
                  <Lock className="w-3.5 h-3.5 text-stone-400" />
                  <span>10 parts acquises (Verrouillé)</span>
                </div>
              )}

              {currentCard.extraElement === 'progress' && (
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-semibold text-stone-500">
                    <span>Financement participatif</span>
                    <span className="text-[#A2482B] font-bold">65% financé</span>
                  </div>
                  <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#A2482B] rounded-full" style={{ width: '65%' }} />
                  </div>
                </div>
              )}

              {!currentCard.extraElement && (
                <div className="flex items-center justify-between text-[10px] font-medium text-stone-400">
                  <span>Série « Other Sights &lt;&gt; Third Eye »</span>
                  <span className="text-stone-500 font-semibold">Grand Popo 🇧🇯</span>
                </div>
              )}
            </div>

          </div>

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
