import React, { useState } from 'react';
import { Coins, TrendingUp, RefreshCw, ShieldCheck, ArrowRight, CheckCircle2, Info, Sparkles } from 'lucide-react';
import { ViewScreen } from '../../types';

export const LandingCoproductionExplainer: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <section id="coproduction" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-b border-stone-200">
      {/* En-tête de section */}
      <div className="max-w-3xl mb-12">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#A2482B] bg-[#A2482B]/10 px-2.5 py-1 rounded-full">
            Modèle Économique Circulaire
          </span>
          <span className="text-xs text-stone-600 font-medium">Coproduction Citoyenne</span>
        </div>
        <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-900 leading-tight">
          Devenez coproducteur : financez, percevez et revendez vos parts.
        </h2>
        <p className="mt-3 text-base sm:text-lg text-stone-600 font-normal leading-relaxed">
          Sur YonyWood, la création cinématographique n’est pas réservée à des circuits fermés. 
          Chaque spectateur peut devenir coproducteur d’une des huit séries, participer aux bénéfices générés 
          par la diffusion et la publicité, puis revendre ses parts selon son souhait.
        </p>
      </div>

      {/* 3 piliers pédagogiques simples et concis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        
        {/* Pilier 1 : Achat de parts */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-stone-200 shadow-xs flex flex-col justify-between hover:border-stone-400 transition-colors">
          <div>
            <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-[#A2482B] mb-4">
              <Coins className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#A2482B]">Étape 1</span>
            <h3 className="font-editorial text-xl font-bold text-stone-900 mt-1 mb-2">
              Achat de parts de production
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Acquérez des parts dès 50 € pour financer le tournage, le montage et la production de la série de votre choix. Votre nom figure officiellement au générique de l’œuvre.
            </p>
          </div>
          <div className="mt-5 pt-4 border-t border-stone-100 text-xs font-semibold text-stone-500">
            50 € la part · Attribution immédiate
          </div>
        </div>

        {/* Pilier 2 : Rétrocessions publicitaires & diffusion */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-stone-200 shadow-xs flex flex-col justify-between hover:border-stone-400 transition-colors">
          <div>
            <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-[#A2482B] mb-4">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#A2482B]">Étape 2</span>
            <h3 className="font-editorial text-xl font-bold text-stone-900 mt-1 mb-2">
              Rétrocessions & Dividendes
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Chaque série génère des flux financiers issus de la publicité, des sponsors et des droits de diffusion. Ces rétrocessions sont reversées proportionnellement aux coproducteurs.
            </p>
          </div>
          <div className="mt-5 pt-4 border-t border-stone-100 text-xs font-semibold text-stone-500">
            Revenus publicitaires & droits de diffusion
          </div>
        </div>

        {/* Pilier 3 : Liquidité & Revente ultérieure */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-stone-200 shadow-xs flex flex-col justify-between hover:border-stone-400 transition-colors">
          <div>
            <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-[#A2482B] mb-4">
              <RefreshCw className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#A2482B]">Étape 3</span>
            <h3 className="font-editorial text-xl font-bold text-stone-900 mt-1 mb-2">
              Liquidité & Revente de parts
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Vos parts ne sont jamais bloquées. À tout moment, vous pouvez les mettre en vente sur le marché secondaire de la plateforme à destination d’autres membres de la communauté.
            </p>
          </div>
          <div className="mt-5 pt-4 border-t border-stone-100 text-xs font-semibold text-stone-500">
            Marché de pair à pair sans intermédiaire
          </div>
        </div>

      </div>

      {/* Aperçu concret d'une fiche de coproduction (simulation réaliste sur fond blanc) */}
      <div className="bg-stone-50 rounded-3xl border border-stone-200 p-6 sm:p-8 max-w-4xl mx-auto shadow-xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          
          {/* Affiche et titre de la série */}
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <img
              src="/assets/posters/Benin < >.jpg"
              alt="Benin <> ..."
              className="w-20 sm:w-24 aspect-[9/14] object-cover rounded-xl border border-stone-200 shadow-sm shrink-0"
            />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#A2482B]">
                Exemple de série en coproduction
              </span>
              <h4 className="font-editorial text-xl sm:text-2xl font-bold text-stone-900 leading-tight">
                Benin &lt;&gt; ...
              </h4>
              <p className="text-xs text-stone-500 mt-0.5">
                Pêcheurs de Ganvié & Paysans de Cusco
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  Série active
                </span>
                <span className="text-xs font-semibold text-stone-800">50,00 € / part</span>
              </div>
            </div>
          </div>

          {/* Jauge de coproduction & Bouton démonstratif */}
          <div className="w-full sm:w-72 bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center text-xs font-semibold text-stone-600 mb-1.5">
                <span>Financement participatif</span>
                <strong className="text-stone-900">72 %</strong>
              </div>
              
              {/* Barre de progression */}
              <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden mb-2">
                <div className="h-full bg-[#A2482B] rounded-full" style={{ width: '72%' }} />
              </div>

              <div className="flex justify-between text-[11px] text-stone-500 mb-3">
                <span>144 parts souscrites</span>
                <span>Objectif : 200 parts</span>
              </div>
            </div>

            {/* Bouton démonstratif avec info-bulle au survol */}
            <div className="relative">
              <button
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="w-full py-2 px-3 rounded-full bg-stone-200 text-stone-600 text-xs font-bold cursor-not-allowed flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Acheter des parts (Démo)</span>
                <Info className="w-3.5 h-3.5 text-stone-500" />
              </button>

              {showTooltip && (
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-30 pointer-events-none px-3 py-1.5 bg-stone-900 text-white text-[11px] font-medium rounded-xl shadow-lg whitespace-nowrap">
                  Fonctionnel avec portefeuille réel une fois connecté
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
