import React, { useState } from 'react';
import { Play, Volume2, MessageSquare, ArrowLeftRight, Sparkles, CheckCircle2, Info } from 'lucide-react';
import { ViewScreen } from '../../types';

interface DuoShowcase {
  id: string;
  seriesTitle: string;
  question: string;
  universeA: {
    name: string;
    role: string;
    country: string;
    flag: string;
    photoUrl: string;
    perspective: string;
  };
  universeB: {
    name: string;
    role: string;
    country: string;
    flag: string;
    photoUrl: string;
    perspective: string;
  };
}

const SHOWCASE_DUOS: DuoShowcase[] = [
  {
    id: 'duo-other-sights',
    seriesTitle: 'Other Sights <> Third Eye',
    question: '« Que voit-on quand le monde ferme les yeux ? »',
    universeA: {
      name: 'Pascal Cossi',
      role: 'Président de « Voir Autrement » & Prêtre du Fâ',
      country: 'Bénin (Ganvié)',
      flag: '🇧🇯',
      photoUrl: '/assets/duos/codjo-blind.jpg',
      perspective: '« Mes oreilles et mon cœur captent le souffle de l’air et la résonance des ondes. La sagesse du Fâ nous apprend à voir la trame invisible du destin. »'
    },
    universeB: {
      name: 'Mawuna Houénou',
      role: 'Médium & Guérisseuse d’âmes',
      country: 'Bénin (Ouidah)',
      flag: '🇧🇯',
      photoUrl: '/assets/duos/mawuna-medium.jpg',
      perspective: '« L’invisible n’est pas un vide mais une présence trop subtile pour le regard distrait. Le cœur écoute ce que les yeux ne peuvent enfermer. »'
    }
  },
  {
    id: 'duo-benin-perou',
    seriesTitle: 'Bénin <> ...',
    question: '« Racontez un moment où vous avez compris ce qui rend votre pays unique. »',
    universeA: {
      name: 'Tobi Houndégla',
      role: 'Pêcheur lacustre de Ganvié',
      country: 'Bénin (Ganvié)',
      flag: '🇧🇯',
      photoUrl: '/assets/duos/tobi-ganvie.jpg',
      perspective: '« L’eau est notre sol, notre mémoire et notre berceau. Nulle part ailleurs une ville ne flotte ainsi au ras du ciel. »'
    },
    universeB: {
      name: 'Sayri Quispe',
      role: 'Paysan & Gardien de la terre sacrée',
      country: 'Pérou (Cusco)',
      flag: '🇵🇪',
      photoUrl: '/assets/duos/sayri-quispe.jpg',
      perspective: '« La roche andine à 3 400 mètres porte l’haleine des aïeux. Chaque terrasse de maïs est une promesse faite au soleil. »'
    }
  },
  {
    id: 'duo-diasporas-makers',
    seriesTitle: 'Diasporas <> Makers',
    question: '« Le moment où un lieu a transformé votre façon de construire vos rêves. »',
    universeA: {
      name: 'Fatou Diallo',
      role: 'Investisseuse d’impact & Mécène',
      country: 'France & Sénégal (Paris / Dakar)',
      flag: '🇫🇷',
      photoUrl: '/assets/duos/fatou-diallo.jpg',
      perspective: '« C’est en foulant les chantiers de la lagune que j’ai compris que le capital patient doit épouser le souffle et le courage du terrain. »'
    },
    universeB: {
      name: 'Kwame Mensah',
      role: 'Ingénieur & Maître bâtisseur',
      country: 'Bénin & Rwanda (Cotonou / Kigali)',
      flag: '🇧🇯',
      photoUrl: '/assets/duos/kwame-mensah.jpg',
      perspective: '« Dessiner un pont ne suffit pas : il faut écouter la terre, les ouvriers et faire de chaque poutre un hommage aux générations futures. »'
    }
  },
  {
    id: 'duo-fiat-luxe-street',
    seriesTitle: 'Fiat Luxe <> Sweet Street',
    question: '« Une expérience où vous avez vu la beauté là où vous ne l’attendiez pas. »',
    universeA: {
      name: 'Chef Koffi',
      role: 'Artisan cuisinier de rue (Dantokpa)',
      country: 'Bénin (Cotonou)',
      flag: '🇧🇯',
      photoUrl: '/assets/duos/chef-koffi.jpg',
      perspective: '« Quand les marchandes se pressent à l’aube autour de la marmite fumante, la saveur d’une sauce gombo devient un sacrement populaire. »'
    },
    universeB: {
      name: 'Hélène Saint-Amand',
      role: 'Scénographe de tables d’exception',
      country: 'France & Italie (Paris / Milan)',
      flag: '🇫🇷',
      photoUrl: '/assets/protagonists/helene-saint-amand.jpg',
      perspective: '« Le luxe véritable est une grâce discrète : le pli d’un tissu, la lumière sur la porcelaine, le silence qui accueille un convive. »'
    }
  }
];

interface LandingDuosRowProps {
  onNavigate?: (screen: ViewScreen) => void;
}

export const LandingDuosRow: React.FC<LandingDuosRowProps> = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeDuo = SHOWCASE_DUOS[activeIdx];

  return (
    <section id="duos" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-b border-stone-200">
      {/* En-tête de section */}
      <div className="max-w-3xl mb-12">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#A2482B] bg-[#A2482B]/10 px-2.5 py-1 rounded-full">
            Le Cœur Narratif
          </span>
          <span className="text-xs text-stone-600 font-medium">Format Duo en Miroir</span>
        </div>
        <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-900 leading-tight">
          Deux visages. Deux univers. Une même question universelle.
        </h2>
        <p className="mt-3 text-base sm:text-lg text-stone-600 font-normal leading-relaxed">
          Dans YonyWood, un épisode ne met jamais un témoin isolé en scène : deux personnes que tout semble éloigner
          se répondent en miroir, révélant la richesse et l’universalité de l’expérience vécue.
        </p>
      </div>

      {/* Sélecteur d’exemples de duos (onglets sobres et épurés) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
        {SHOWCASE_DUOS.map((duo, idx) => (
          <button
            key={duo.id}
            onClick={() => setActiveIdx(idx)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
              idx === activeIdx
                ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400 hover:text-stone-900'
            }`}
          >
            {duo.universeA.name} & {duo.universeB.name}
          </button>
        ))}
      </div>

      {/* Cadre de présentation du Duo en miroir */}
      <div className="bg-stone-50 rounded-3xl border border-stone-200 p-6 sm:p-10 shadow-xs">

        {/* Titre de la série et Question centrale */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#A2482B]">
            {activeDuo.seriesTitle}
          </span>
          <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-stone-900 mt-2 italic leading-snug">
            {activeDuo.question}
          </h3>
        </div>

        {/* Miroir 2 colonnes : Protagoniste A vs Protagoniste B */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 relative">

          {/* Séparateur central stylisé &lt; &gt; */}
          <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white border border-stone-300 shadow-md items-center justify-center text-stone-700 font-bold text-sm z-10">
            &lt; &gt;
          </div>

          {/* Côté A : Premier protagoniste */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-stone-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={activeDuo.universeA.photoUrl}
                  alt={activeDuo.universeA.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-stone-200 shadow-xs shrink-0"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">{activeDuo.universeA.flag}</span>
                    <span className="text-xs font-medium text-stone-500">{activeDuo.universeA.country}</span>
                  </div>
                  <h4 className="font-editorial text-xl font-bold text-stone-900 mt-0.5">
                    {activeDuo.universeA.name}
                  </h4>
                  <p className="text-xs font-semibold text-[#A2482B] mt-0.5">
                    {activeDuo.universeA.role}
                  </p>
                </div>
              </div>

              <blockquote className="text-sm text-stone-700 leading-relaxed italic border-l-2 border-[#A2482B]/40 pl-3 my-4">
                {activeDuo.universeA.perspective}
              </blockquote>
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
              <span className="font-medium">Univers A</span>
              <span className="text-[11px] bg-stone-100 px-2 py-0.5 rounded-full">Témoignage 9:16</span>
            </div>
          </div>

          {/* Côté B : Deuxième protagoniste en miroir */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-stone-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={activeDuo.universeB.photoUrl}
                  alt={activeDuo.universeB.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-stone-200 shadow-xs shrink-0"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">{activeDuo.universeB.flag}</span>
                    <span className="text-xs font-medium text-stone-500">{activeDuo.universeB.country}</span>
                  </div>
                  <h4 className="font-editorial text-xl font-bold text-stone-900 mt-0.5">
                    {activeDuo.universeB.name}
                  </h4>
                  <p className="text-xs font-semibold text-stone-700 mt-0.5">
                    {activeDuo.universeB.role}
                  </p>
                </div>
              </div>

              <blockquote className="text-sm text-stone-700 leading-relaxed italic border-l-2 border-stone-400 pl-3 my-4">
                {activeDuo.universeB.perspective}
              </blockquote>
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
              <span className="font-medium">Univers B</span>
              <span className="text-[11px] bg-stone-100 px-2 py-0.5 rounded-full">Témoignage 9:16</span>
            </div>
          </div>

        </div>

        {/* Note pédagogique discrète en bas de carte */}
        <div className="mt-8 text-center text-xs text-stone-500 max-w-lg mx-auto flex items-center justify-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-[#A2482B] shrink-0" />
          <span>Sur l’application, chaque spectateur peut écouter chaque univers indépendamment ou en écoute alternée.</span>
        </div>

      </div>
    </section>
  );
};
