import React, { useState } from 'react';
import { Compass, RotateCw, Sparkles, Layers, BookOpen, User, Globe2, Award, Briefcase, Building2, HeartHandshake } from 'lucide-react';
import { ViewScreen } from '../../types';

interface DoorItem {
  id: string;
  name: string;
  categoryLabel: string;
  description: string;
  icon: any;
  angle: number;
  sampleEntries: string[];
}

const DOORS: DoorItem[] = [
  {
    id: 'sagesses',
    name: 'Sagesses',
    categoryLabel: 'Valeurs & Transmissions',
    description: 'Les interrogations fondatrices : pardon, transmission, foi, deuil, joie et courage face aux épreuves de l’existence.',
    icon: BookOpen,
    angle: 0,
    sampleEntries: ['Le Fâ', 'La Transmission', 'Le Pardon', 'La Foi', 'La Résilience']
  },
  {
    id: 'personnalites',
    name: 'Personnalités',
    categoryLabel: 'Figures & Mentors',
    description: 'Les maîtres, pionniers et figures inspirantes dont la voix éclaire notre époque.',
    icon: User,
    angle: 51.4,
    sampleEntries: ['Pascal Cossi', 'Aké Loba', 'Aimé Césaire', 'Fela Kuti', 'Wangari Maathai']
  },
  {
    id: 'territoires',
    name: 'Territoires',
    categoryLabel: 'Lieux & Enracinements',
    description: 'Des cités lacustres de Ganvié aux hauts plateaux de Cusco et aux capitales cosmopolites de la diaspora.',
    icon: Globe2,
    angle: 102.8,
    sampleEntries: ['Ganvié (Bénin)', 'Cusco (Pérou)', 'Dakar', 'Paris & Diaspora', 'Ouidah']
  },
  {
    id: 'expertises',
    name: 'Expertises',
    categoryLabel: 'Savoir-Faire & Métiers',
    description: 'Acoustique subaquatique, vannerie de perles, sculpture sur bois, finance patiente, scénographie.',
    icon: Award,
    angle: 154.2,
    sampleEntries: ['Navigation sonore', 'Maroquinerie de perles', 'Menuiserie d’art', 'Arts de la table']
  },
  {
    id: 'produits-services',
    name: 'Produits & Métiers',
    categoryLabel: 'Créations & Artisanat',
    description: 'Les créations concrètes nées du geste : sacs artisanaux, tabourets d’aïeux, consultations de sagesse.',
    icon: Briefcase,
    angle: 205.6,
    sampleEntries: ['Sacs en perles (Cécile)', 'Tabourets en bois (Norbert)', 'Consultations Fâ (Pascal)']
  },
  {
    id: 'marques',
    name: 'Entreprises & Marques',
    categoryLabel: 'Récits & RSE',
    description: 'L’histoire vivante des maisons et entreprises racontée de l’intérieur par leurs bâtisseurs et usagers.',
    icon: Building2,
    angle: 257,
    sampleEntries: ['Transmission d’entreprise', 'Impact solidaire', 'Mécénat de conservation', 'Artisanat d’art']
  },
  {
    id: 'projets',
    name: 'Projets & Causes',
    categoryLabel: 'Chantiers Solidaires',
    description: 'Des initiatives concrètes en recherche de soutien, d’investissements et d’équipements adaptés.',
    icon: HeartHandshake,
    angle: 308.4,
    sampleEntries: ['Atelier Voir Autrement', 'Parcours sensoriel Ganvié', 'Préservation des mangroves']
  }
];

export const LandingWheelPreview: React.FC = () => {
  const [selectedDoorIdx, setSelectedDoorIdx] = useState(0);
  const selectedDoor = DOORS[selectedDoorIdx];

  const handleSelect = (idx: number) => {
    setSelectedDoorIdx(idx);
  };

  return (
    <section id="exploration" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-b border-stone-200">
      {/* En-tête de section */}
      <div className="max-w-3xl mb-12">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#A2482B] bg-[#A2482B]/10 px-2.5 py-1 rounded-full">
            Navigation Matrice
          </span>
          <span className="text-xs text-stone-600 font-medium">L'Astrolabe & Les 7 Portes</span>
        </div>
        <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-900 leading-tight">
          Une roue vivante pour explorer les mémoires humaines.
        </h2>
        <p className="mt-3 text-base sm:text-lg text-stone-600 font-normal leading-relaxed">
          Plutôt qu’un moteur de recherche froid, YonyWood est cartographié par sept portes interconnectées.
          En sélectionnant une porte, vous découvrez comment récits, métiers et territoires se répondent.
        </p>
      </div>

      {/* Disposition principale : Roue interactive à gauche, Fiche détaillée à droite */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 shadow-xs flex flex-col lg:flex-row items-center gap-10 lg:gap-16">

        {/* Roue visuelle minimaliste SVG */}
        <div className="relative w-72 h-72 sm:w-88 sm:h-88 shrink-0 flex items-center justify-center">

          {/* Cercle d'orbite extérieur */}
          <div className="absolute inset-0 rounded-full border border-stone-200 border-dashed animate-spin-slow" style={{ animationDuration: '60s' }} />
          <div className="absolute inset-4 rounded-full border border-stone-100" />

          {/* Cadran central */}
          <div className="relative z-10 w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-stone-900 text-white flex flex-col items-center justify-center text-center p-3 shadow-xl border-4 border-white">
            <Compass className="w-6 h-6 text-[#FFE7A3] mb-1" />
            <span className="font-editorial text-xs font-bold tracking-wide">YonyWood</span>
            <span className="text-[9px] text-stone-300 uppercase tracking-widest mt-0.5">Astrolabe</span>
          </div>

          {/* Les 7 boutons de portes positionnés sur le pourtour */}
          {DOORS.map((door, idx) => {
            const isSelected = idx === selectedDoorIdx;
            const radius = 120; // Rayon en px
            const angleRad = (door.angle - 90) * (Math.PI / 180);
            const x = Math.round(radius * Math.cos(angleRad));
            const y = Math.round(radius * Math.sin(angleRad));
            const Icon = door.icon;

            return (
              <button
                key={door.id}
                onClick={() => handleSelect(idx)}
                className={`absolute z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer shadow-md ${
                  isSelected
                    ? 'bg-[#A2482B] text-white scale-115 ring-4 ring-[#A2482B]/20 shadow-lg'
                    : 'bg-white text-stone-700 hover:text-black border border-stone-200 hover:border-stone-400 hover:scale-105'
                }`}
                style={{
                  transform: `translate(${x}px, ${y}px)`
                }}
                title={door.name}
                aria-label={door.name}
              >
                <Icon className="w-5 h-5" />
              </button>
            );
          })}
        </div>

        {/* Fiche explicative de la porte sélectionnée */}
        <div className="flex-1 w-full max-w-xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#A2482B]">
              Porte {selectedDoorIdx + 1} sur 7
            </span>
            <span className="text-xs text-stone-600 font-medium">• {selectedDoor.categoryLabel}</span>
          </div>

          <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-stone-900 leading-snug">
            {selectedDoor.name}
          </h3>

          <p className="mt-3 text-sm sm:text-base text-stone-600 leading-relaxed font-normal">
            {selectedDoor.description}
          </p>

          {/* Exemples concrets d'entrées associées */}
          <div className="mt-6">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-2.5">
              Exemples d'entrées réelles :
            </span>
            <div className="flex flex-wrap gap-2">
              {selectedDoor.sampleEntries.map((entry, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold border border-stone-200 transition-colors"
                >
                  {entry}
                </span>
              ))}
            </div>
          </div>

          {/* Note sur l'interaction avec le profil */}
          <div className="mt-8 pt-5 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
            <span>Chaque profil et série est indexé selon ces 7 axes.</span>
            <button
              onClick={() => setSelectedDoorIdx((prev) => (prev + 1) % DOORS.length)}
              className="text-[#A2482B] hover:text-[#8A3B22] font-semibold flex items-center gap-1 cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Porte suivante</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
