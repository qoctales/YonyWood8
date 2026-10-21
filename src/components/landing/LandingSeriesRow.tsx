import React, { useState } from 'react';
import { Play, Sparkles, ArrowRight, Eye, Film, Info } from 'lucide-react';
import { ViewScreen } from '../../types';

interface SeriesItem {
  id: string;
  title: string;
  posterUrl: string;
  universes: [string, string];
  territories: string;
  tagline: string;
  description: string;
  partsAvailable: number;
}

const OFFICIAL_SERIES: SeriesItem[] = [
  {
    id: 'finagnon-qosqorico',
    title: 'Bénin < > Le Monde',
    posterUrl: '/assets/posters/Benin < >.jpg',
    universes: ['Bénin', 'Le Monde'],
    territories: 'Bénin (Ganvié) & Pérou (Cusco)',
    tagline: 'L’eau lagunaire et les cimes sacrées face à l’amour d’une terre.',
    description: 'Des cités lacustres de Ganvié aux terrasses andines de Cusco, pêcheurs toffinou et paysans quechuas dialoguent sur l’enracinement et la mémoire des terres nourricières.',
    partsAvailable: 84
  },
  {
    id: 'investors-builders',
    title: 'Diasporas <> Makers',
    posterUrl: '/assets/posters/Diasporas < > Makers.jpg',
    universes: ['Diasporas', 'Makers'],
    territories: 'Paris, Dakar & Cotonou',
    tagline: 'L’alliance féconde du capital patient et de la rigueur du terrain.',
    description: 'Une rencontre sans filtre entre investisseurs d’impact allouant des capitaux sur le temps long et bâtisseurs d’infrastructures ancrés dans le réel de la matière.',
    partsAvailable: 56
  },
  {
    id: 'dixeat-fiat-luxe',
    title: 'Fiat Luxe <> Sweet Street',
    posterUrl: '/assets/posters/Fiat Luxe < > Street.jpg',
    universes: ['Fiat Luxe', 'Sweet Street'],
    territories: 'Cotonou, Paris & Milan',
    tagline: 'La haute scénographie du détail face à la générosité brute.',
    description: 'Des marmites populaires de Dantokpa aux tables d’exception, artisans de bouche et scénographes révèlent l’art du don, du détail et du souvenir impérissable.',
    partsAvailable: 62
  },
  {
    id: 'jesus-legba',
    title: 'Vodun Rays ‹ › Amen',
    posterUrl: '/assets/posters/Esu < > Jesus.jpg',
    universes: ['Vodun Rays', 'Amen'],
    territories: 'Bénin (Ouidah, Allada)',
    tagline: 'Deux traditions spirituelles face au mystère et au destin.',
    description: 'Dévots de la tradition ancestrale et fidèles de la foi révélée dialoguent d’égal à égal face aux grands mystères humains : l’épreuve, le pardon et la transcendance.',
    partsAvailable: 40
  },
  {
    id: 'other-eyes-sixth-sense',
    title: 'Other Sights <> Third Eye',
    posterUrl: '/assets/posters/Other Eyes < > Third Eye.png',
    universes: ['Other Sights', 'Third Eye'],
    territories: 'Bénin (Ganvié & Ouidah)',
    tagline: 'Ce que l’on perçoit quand le monde ferme les yeux.',
    description: 'Pascal Cossi, maître de l’écho lacustre et prêtre du Fâ, fait résonner sa vision intérieure avec Mawuna, réceptacle des souffles et des mémoires subtiles.',
    partsAvailable: 70
  },
  {
    id: 'blacks-one-beyond-eve',
    title: 'Blacks One <> Beyond Eve',
    posterUrl: '/assets/posters/Blacks One < > Beyond Eve.jpg',
    universes: ['Blacks One', 'Beyond Eve'],
    territories: 'Abidjan, Paris & Londres',
    tagline: 'La souveraineté féminine face aux plafonds invisibles.',
    description: 'Deux figures pionnières confrontent leurs parcours d’émancipation, de leadership et d’affirmation culturelle au-delà des assignations.',
    partsAvailable: 48
  },
  {
    id: 'coaching-unlimited',
    title: 'Coach Me <> If You Can',
    posterUrl: '/assets/posters/Coaching < > Unlimited.jpg',
    universes: ['Coach Me', 'If You Can'],
    territories: 'Nairobi, Lomé & Genève',
    tagline: 'L’exigence du dépassement et la discipline du geste.',
    description: 'De la piste d’athlétisme aux coulisses de décisions complexes, le dialogue intime entre préparation mentale, résilience et quête d’excellence.',
    partsAvailable: 92
  },
  {
    id: 'focus-phd',
    title: 'Pictures <> PhD',
    posterUrl: '/assets/posters/Focus < >  PhD.jpg',
    universes: ['Pictures', 'PhD'],
    territories: 'Dakar, Yaoundé & Bruxelles',
    tagline: 'L’éclair du regard documentaire face au temps long de la recherche.',
    description: 'Le photographe de terrain saisissant la fulgurance du moment présent rencontre le chercheur universitaire analysant la stratification des mémoires.',
    partsAvailable: 65
  }
];

interface LandingSeriesRowProps {
  onNavigate?: (screen: ViewScreen) => void;
}

export const LandingSeriesRow: React.FC<LandingSeriesRowProps> = () => {
  const [selectedSeries, setSelectedSeries] = useState<SeriesItem | null>(null);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  return (
    <section id="series" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-b border-stone-200">
      {/* En-tête de section sobre & épuré */}
      <div className="max-w-3xl mb-12">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#A2482B] bg-[#A2482B]/10 px-2.5 py-1 rounded-full">
            Catalogue Documentaire
          </span>
          <span className="text-xs text-stone-600 font-medium">8 séries officielles</span>
        </div>
        <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-900 leading-tight">
          Huit séries, seize univers, une condition humaine partagée.
        </h2>
        <p className="mt-3 text-base sm:text-lg text-stone-600 font-normal leading-relaxed">
          Chaque série réunit deux univers en miroir pour explorer une interrogation existentielle majeure.
          Découvrez les affiches officielles et l’intention cinématographique de chaque œuvre.
        </p>
      </div>

      {/* Grille 4x2 responsive des 8 séries */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {OFFICIAL_SERIES.map((series, idx) => (
          <div
            key={series.id}
            onClick={() => setSelectedSeries(series)}
            onMouseEnter={() => setActiveTooltip(series.id)}
            onMouseLeave={() => setActiveTooltip(null)}
            className="group relative bg-white rounded-2xl border border-stone-200 hover:border-stone-400 p-2.5 sm:p-3 transition-all duration-300 hover:shadow-lg cursor-pointer flex flex-col justify-between"
          >
            {/* Affiche 9:16 officielle */}
            <div className="relative aspect-[3/4] sm:aspect-[9/14] w-full rounded-xl overflow-hidden bg-stone-100 mb-3">
              <img
                src={series.posterUrl}
                alt={series.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                loading="lazy"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/assets/doors/door-series.jpg';
                }}
              />

              {/* Badge numéro discret */}
              <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold tracking-wider">
                0{idx + 1}
              </div>

              {/* Voile discret au survol avec bouton d'aperçu */}
              <div className="absolute inset-0 bg-stone-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="px-3 py-1.5 rounded-full bg-white text-stone-900 text-xs font-semibold shadow-md flex items-center gap-1.5 transform translate-y-1 group-hover:translate-y-0 transition-transform">
                  <Eye className="w-3.5 h-3.5 text-[#A2482B]" />
                  <span>Détails</span>
                </span>
              </div>
            </div>

            {/* Informations textuelles concises */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-[#A2482B] mb-1">
                  <span>{series.universes[0]}</span>
                  <span className="text-stone-400 font-light">&lt; &gt;</span>
                  <span>{series.universes[1]}</span>
                </div>
                <h3 className="font-editorial text-base sm:text-lg font-bold text-stone-900 leading-snug line-clamp-1">
                  {series.title}
                </h3>
                <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                  {series.tagline}
                </p>
              </div>

              {/* Footer de carte : territoire sobre */}
              <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                <span className="truncate">{series.territories}</span>
                <span className="font-medium text-stone-700 shrink-0">Parts : 50 €</span>
              </div>
            </div>

            {/* Info-bulle pédagogique discrète au survol */}
            {activeTooltip === series.id && (
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-30 pointer-events-none hidden lg:flex items-center gap-1.5 px-3 py-1 bg-stone-900 text-white text-[11px] font-medium rounded-full shadow-lg whitespace-nowrap">
                <Info className="w-3 h-3 text-[#FFE7A3]" />
                <span>Cliquez pour explorer la fiche de la série</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modale d'aperçu sobre et informative */}
      {selectedSeries && (
        <div
          onClick={() => setSelectedSeries(null)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <img
                src={selectedSeries.posterUrl}
                alt={selectedSeries.title}
                className="w-32 sm:w-44 aspect-[9/14] object-cover rounded-2xl shadow-md border border-stone-200 shrink-0"
              />
              <div className="flex-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#A2482B]">
                  {selectedSeries.universes[0]} &lt; &gt; {selectedSeries.universes[1]}
                </span>
                <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
                  {selectedSeries.title}
                </h3>
                <p className="text-xs font-semibold text-stone-500 mt-0.5">
                  Territoires : {selectedSeries.territories}
                </p>
                <p className="mt-3 text-sm text-stone-700 leading-relaxed">
                  {selectedSeries.description}
                </p>
                <div className="mt-4 p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600 space-y-1">
                  <div className="flex justify-between font-medium">
                    <span>Valeur d’une part de coproduction :</span>
                    <strong className="text-stone-900">50,00 €</strong>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Parts disponibles pour coproduction :</span>
                    <span className="text-stone-700">{selectedSeries.partsAvailable} parts</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-200 flex justify-end">
              <button
                onClick={() => setSelectedSeries(null)}
                className="px-5 py-2 rounded-full text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 transition-colors cursor-pointer"
              >
                Fermer l’aperçu
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
