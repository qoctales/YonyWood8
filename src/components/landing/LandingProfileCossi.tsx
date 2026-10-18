import React, { useState } from 'react';
import { User, Sparkles, Heart, GitBranch, ArrowRight, ShieldCheck, CheckCircle2, Info, Building, ShoppingBag, Landmark } from 'lucide-react';
import { ViewScreen } from '../../types';

export const LandingProfileCossi: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profil' | 'lineage'>('profil');
  const [tooltipText, setTooltipText] = useState<string | null>(null);

  return (
    <section id="profil" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-b border-stone-200">
      {/* En-tête de section */}
      <div className="max-w-3xl mb-12">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#A2482B] bg-[#A2482B]/10 px-2.5 py-1 rounded-full">
            Profil & Héritage
          </span>
          <span className="text-xs text-stone-600 font-medium">Étude de Cas : Pascal Cossi</span>
        </div>
        <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-900 leading-tight">
          Un profil vivant, solidaire et transmissible.
        </h2>
        <p className="mt-3 text-base sm:text-lg text-stone-600 font-normal leading-relaxed">
          Sur YonyWood, le profil d'un créateur n’est pas un simple CV. C’est un espace d'impact où il propose ses savoirs, 
          finance des projets concrets et parraine de nouveaux artisans pour faire grandir la lignée de son héritage.
        </p>
      </div>

      {/* Sélecteur d'affichage : Profil de Pascal / Arbre de parrainage */}
      <div className="flex items-center gap-2 mb-8">
        <button
          onClick={() => setActiveTab('profil')}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
            activeTab === 'profil'
              ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
              : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
          }`}
        >
          1. Profil de Pascal Cossi & Offres
        </button>
        <button
          onClick={() => setActiveTab('lineage')}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer border flex items-center gap-1.5 ${
            activeTab === 'lineage'
              ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
              : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
          }`}
        >
          <GitBranch className="w-3.5 h-3.5 text-[#A2482B]" />
          <span>2. La Lignée Vivante : Cécile & Norbert</span>
        </button>
      </div>

      {/* CONTENU 1 : VUE DU PROFIL DE PASCAL COSSI */}
      {activeTab === 'profil' && (
        <div className="bg-stone-50 rounded-3xl border border-stone-200 p-6 sm:p-10 shadow-xs">
          
          {/* Carte d'identité de Pascal */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-stone-200">
            <div className="flex items-center gap-5">
              <img
                src="/assets/duos/codjo-blind.jpg"
                alt="Pascal Cossi"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-stone-200 shadow-sm shrink-0"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">🇧🇯</span>
                  <span className="text-xs font-semibold text-stone-500">Ganvié & Cotonou, Bénin</span>
                  <span className="text-[10px] bg-[#A2482B]/10 text-[#A2482B] px-2 py-0.5 rounded-full font-bold">
                    Égérie Série
                  </span>
                </div>
                <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
                  Pascal Cossi
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-[#A2482B]">
                  Président de l'association « Voir Autrement » & Prêtre du Fâ
                </p>
                <p className="text-xs text-stone-600 mt-1 max-w-xl line-clamp-2">
                  Non-voyant depuis l’enfance, maître de l'écoute vibratoire et engagé pour l'insertion par l'artisanat adapté.
                </p>
              </div>
            </div>

            <div className="w-full md:w-auto flex md:flex-col items-center md:items-end justify-between gap-2 shrink-0">
              <span className="text-xs text-stone-500">Série associée :</span>
              <span className="text-xs font-bold text-stone-800 bg-white px-3 py-1.5 rounded-xl border border-stone-200">
                Other Sights &lt;&gt; Third Eye
              </span>
            </div>
          </div>

          {/* Les 3 piliers concrets du profil de Pascal */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
            
            {/* 1. L'Association Voir Autrement */}
            <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-xl bg-stone-100 flex items-center justify-center text-[#A2482B] mb-3">
                  <Building className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#A2482B]">Engagement</span>
                <h4 className="font-editorial text-lg font-bold text-stone-900 mt-0.5">
                  Association « Voir Autrement »
                </h4>
                <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                  Mission d'intérêt public : sensibiliser au handicap visuel, former aux métiers d'artisanat et créer des espaces de travail dignes pour personnes handicapées.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] font-semibold text-stone-500">
                Président & Fondateur
              </div>
            </div>

            {/* 2. Prêtre du Fâ & Consultations */}
            <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-xl bg-stone-100 flex items-center justify-center text-[#A2482B] mb-3">
                  <Landmark className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#A2482B]">Sagesse Ancestrale</span>
                <h4 className="font-editorial text-lg font-bold text-stone-900 mt-0.5">
                  Consultations du Fâ
                </h4>
                <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                  En tant que prêtre du Fâ, Pascal propose des consultations d'orientation et de guidance spirituelle traditionnelle pour éclairer les décisions de vie et de famille.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] font-semibold text-stone-500">
                Séances individuelles disponibles
              </div>
            </div>

            {/* 3. Projet en Financement Participatif */}
            <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-xl bg-stone-100 flex items-center justify-center text-[#A2482B] mb-3">
                  <Sparkles className="w-4 h-4 text-[#A2482B]" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Chantier Participatif
                </span>
                <h4 className="font-editorial text-lg font-bold text-stone-900 mt-1">
                  Atelier & Centre d’Accueil
                </h4>
                <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                  Construction d’un centre d'accueil et d'ateliers professionnels adaptés aux artisans en situation de handicap pour produire et commercialiser leurs œuvres.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-stone-100">
                <div className="flex justify-between text-[11px] font-bold text-stone-700 mb-1">
                  <span>65 % financé</span>
                  <span>9 750 € / 15 000 €</span>
                </div>
                <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: '65%' }} />
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* CONTENU 2 : LA LIGNÉE VIVANTE (PARRAINAGE CÉCILE & NORBERT) */}
      {activeTab === 'lineage' && (
        <div className="bg-stone-50 rounded-3xl border border-stone-200 p-6 sm:p-10 shadow-xs">
          
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-[#A2482B]">
              Transmission Générationnelle
            </span>
            <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              Comment Pascal transmet et fait entrer de nouveaux talents
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
              Sur YonyWood, une effigie ne reste pas isolée : elle possède le droit d'accueillir et de parrainer ses pairs. 
              Pascal intègre Cécile, qui à son tour introduit Norbert.
            </p>
          </div>

          {/* Arbre de lignée 3 niveaux */}
          <div className="space-y-6">
            
            {/* Niveau 1 : Pascal Cossi */}
            <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src="/assets/duos/codjo-blind.jpg"
                  alt="Pascal Cossi"
                  className="w-14 h-14 rounded-xl object-cover border border-stone-200 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-stone-900 text-white text-[10px] font-bold">
                      Génération 1 · Égérie Initiale
                    </span>
                    <span className="text-xs text-stone-500">🇧🇯 Bénin</span>
                  </div>
                  <h4 className="font-editorial text-lg font-bold text-stone-900 mt-0.5">
                    Pascal Cossi
                  </h4>
                  <p className="text-xs text-stone-600">
                    Président de Voir Autrement · Prêtre du Fâ
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold text-[#A2482B] bg-[#A2482B]/10 px-3 py-1 rounded-full">
                Parrain de Cécile
              </span>
            </div>

            {/* Trait de filiation vertical */}
            <div className="flex items-center gap-3 pl-8 text-xs font-bold text-[#A2482B]">
              <div className="w-0.5 h-6 bg-[#A2482B]" />
              <span>↓ Parraine et intègre dans la communauté :</span>
            </div>

            {/* Niveau 2 : Cécile */}
            <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ml-0 sm:ml-6">
              <div className="flex items-center gap-4">
                <img
                  src="/assets/protagonists/adjovi-blandine.jpg"
                  alt="Cécile"
                  className="w-14 h-14 rounded-xl object-cover border border-stone-200 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-[#A2482B] text-white text-[10px] font-bold">
                      Génération 2 · Filleule de Pascal
                    </span>
                    <span className="text-xs text-stone-500">🇧🇯 Bénin</span>
                  </div>
                  <h4 className="font-editorial text-lg font-bold text-stone-900 mt-0.5">
                    Cécile
                  </h4>
                  <p className="text-xs text-stone-600">
                    Artisane maroquinière non-voyante · Confectionneuse de sacs en perles
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold text-stone-700 bg-stone-100 px-3 py-1 rounded-full">
                Parraine à son tour Norbert
              </span>
            </div>

            {/* Trait de filiation vertical */}
            <div className="flex items-center gap-3 pl-8 sm:pl-14 text-xs font-bold text-[#A2482B]">
              <div className="w-0.5 h-6 bg-[#A2482B]" />
              <span>↓ Parraine et intègre dans la communauté :</span>
            </div>

            {/* Niveau 3 : Norbert */}
            <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ml-0 sm:ml-12">
              <div className="flex items-center gap-4">
                <img
                  src="/assets/duos/kwame-mensah.jpg"
                  alt="Norbert"
                  className="w-14 h-14 rounded-xl object-cover border border-stone-200 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-stone-700 text-white text-[10px] font-bold">
                      Génération 3 · Filleul de Cécile
                    </span>
                    <span className="text-xs text-stone-500">🇧🇯 Bénin</span>
                  </div>
                  <h4 className="font-editorial text-lg font-bold text-stone-900 mt-0.5">
                    Norbert
                  </h4>
                  <p className="text-xs text-stone-600">
                    Maître artisan menuisier · Sculpteur de tabourets traditionnels en bois brut
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
                Nouvel artisan en transmission
              </span>
            </div>

          </div>

          <div className="mt-8 text-center text-xs text-stone-500 max-w-lg mx-auto flex items-center justify-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-[#A2482B] shrink-0" />
            <span>Chaque nouvel artisan bénéficie de la visibilité collective de la série et de l'association.</span>
          </div>

        </div>
      )}

    </section>
  );
};
