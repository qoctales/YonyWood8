import React from 'react';
import { Building2, Users2, ShieldCheck, HeartHandshake, FileText, Sparkles } from 'lucide-react';

export const LandingCompanyHeritage: React.FC = () => {
  return (
    <section id="entreprises" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-b border-stone-200">
      {/* En-tête de section sobre & épuré - Aucun appel commercial */}
      <div className="max-w-3xl mb-12">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#A2482B] bg-[#A2482B]/10 px-2.5 py-1 rounded-full">
            Espace Héritage
          </span>
          <span className="text-xs text-stone-600 font-medium">Présence pour les Organisations</span>
        </div>
        <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-900 leading-tight">
          L'espace Entreprise au cœur de l'Héritage.
        </h2>
        <p className="mt-3 text-base sm:text-lg text-stone-600 font-normal leading-relaxed">
          Dans la section Héritage, chaque entreprise dispose d’un espace dédié où sa mémoire, ses engagements et sa culture
          sont racontés directement par ceux qui la font vivre : ses collaborateurs, ses cadres, ses artisans et ses clients.
        </p>
      </div>

      {/* 3 facettes factuelles et minimalistes de l'espace Entreprise */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Facette 1 : La parole aux équipes et usagers */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-stone-200 shadow-xs flex flex-col justify-between hover:border-stone-400 transition-colors">
          <div>
            <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-[#A2482B] mb-4">
              <Users2 className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Parole Vivante</span>
            <h3 className="font-editorial text-xl font-bold text-stone-900 mt-1 mb-2">
              Raconter la marque de l’intérieur
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Plutôt qu’une communication institutionnelle conventionnelle, l’espace Entreprise donne la parole aux employés de terrain, aux ingénieurs et aux usagers dans des capsules 9:16 intimistes.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-stone-100 text-xs text-stone-500 font-medium">
            Témoignages authentiques et sincères
          </div>
        </div>

        {/* Facette 2 : Mémoire pérenne et RSE */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-stone-200 shadow-xs flex flex-col justify-between hover:border-stone-400 transition-colors">
          <div>
            <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-[#A2482B] mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Pérennité</span>
            <h3 className="font-editorial text-xl font-bold text-stone-900 mt-1 mb-2">
              Valorisation des engagements RSE
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Les actions à impact sociétal, l’ancrage territorial et la responsabilité écologique sont archivés durablement dans la bibliothèque universelle YonyWood.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-stone-100 text-xs text-stone-500 font-medium">
            Archive documentaire consultable à long terme
          </div>
        </div>

        {/* Facette 3 : Résonance avec les causes et séries */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-stone-200 shadow-xs flex flex-col justify-between hover:border-stone-400 transition-colors">
          <div>
            <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-[#A2482B] mb-4">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Résonances</span>
            <h3 className="font-editorial text-xl font-bold text-stone-900 mt-1 mb-2">
              Écho aux chantiers et sagesses
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              L’espace de la marque s’interconnecte organiquement aux séries documentaires, aux projets d'artisans (comme l'association Voir Autrement) et aux sagesses de l'astrolabe.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-stone-100 text-xs text-stone-500 font-medium">
            Interconnexion native avec la matrice
          </div>
        </div>

      </div>

      {/* Note d'évidence architecturale, sans CTA ni sollicitation */}
      <div className="mt-10 p-5 bg-stone-50 rounded-2xl border border-stone-200 text-center max-w-2xl mx-auto">
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
          L'Espace Entreprise est une composante native de la plateforme YonyWood,
          conçue pour refléter la réalité humaine des organisations sans artifice publicitaire.
        </p>
      </div>

    </section>
  );
};
