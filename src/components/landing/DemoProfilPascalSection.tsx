import React, { useState, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Sprout,
  Play,
  Pause,
  Volume2,
  VolumeX,
  GitBranch,
  ArrowRight,
  CheckCircle2,
  Info
} from 'lucide-react';
import {
  TvPlayerIcon,
  LineageGenerationsIcon,
  ParcoursDeVieIcon,
  ProduitsServicesIcon,
  ProjetsIcon,
  BesoinsHandsIcon
} from '../YonywoodBrandIcons';

export type DemoProfileCategory = 'parcours' | 'produits' | 'projets' | 'besoins';

export interface VideoSimulationItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  posterUrl: string;
  videoUrl: string;
  duration: string;
  tag?: string;
  extraInfo?: string;
}

export const ROMEO_SIMULATION_DATA: Record<DemoProfileCategory, VideoSimulationItem[]> = {
  parcours: [
    {
      id: 'parcours-1',
      title: 'Le retour au pays natal',
      subtitle: 'Arrivée à Cotonou & retrouvailles',
      description: 'Après 8 années d’expatriation, Roméo pose ses valises à Cotonou. Émotion des retrouvailles avec sa terre natale, la lumière tropicale et l’évidence de revenir bâtir au pays.',
      posterUrl: '/src/assets/images/romeo_arriving_cotonou_1792698426939.jpg',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      duration: '06:15',
      tag: 'Retour au pays'
    },
    {
      id: 'parcours-2',
      title: 'Mémoires d’exil & traversées',
      subtitle: 'Itinéraire & Récit intime',
      description: 'Ce que la distance lui a appris : aiguiser son regard de cinéaste, comprendre l’exil et forger la conviction que les récits d’Afrique méritent une tribune universelle.',
      posterUrl: '/src/assets/images/romeo_lagoon_sunset_1792698428025.jpg',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
      duration: '07:40',
      tag: 'Diaspora & Racines'
    },
    {
      id: 'parcours-3',
      title: 'La redécouverte de Cotonou',
      subtitle: 'Ancrage urbain & renouveau',
      description: 'Caméra à l’épaule, Roméo explore les carrefours, les ateliers d’artisans et les ruelles animées pour capturer l’énergie créative de la jeunesse béninoise.',
      posterUrl: '/src/assets/images/romeo_settling_studio_1792698427492.jpg',
      videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
      duration: '05:20',
      tag: 'Ancrage natal'
    },
    {
      id: 'parcours-4',
      title: 'Le souffle de la lagune',
      subtitle: 'Horizon & Transmission',
      description: 'Méditation face aux pirogues au crépuscule sur le lac Nokoué : poser les fondations d’un espace documentaire où chaque voix trouve son écho.',
      posterUrl: '/src/assets/images/romeo_lagoon_sunset_1792698428025.jpg',
      videoUrl: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
      duration: '08:10',
      tag: 'Transmission'
    }
  ],
  produits: [
    {
      id: 'produits-1',
      title: 'Cercles d’écoute avec les Anciens',
      subtitle: 'Rencontres intergénérationnelles',
      description: 'Partage du thé et recueil de récits avec les maîtres artisans et les sages pour archiver et célébrer leurs précieux savoir-faire.',
      posterUrl: '/src/assets/images/romeo_dialogue_elders_1792698428934.jpg',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      duration: '05:30',
      tag: 'Transmission orale'
    },
    {
      id: 'produits-2',
      title: 'Ateliers de cinéma documentaire',
      subtitle: 'Masterclass image & son de terrain',
      description: 'Formation pratique pour jeunes créateurs aux techniques de l’interview intime, du recueil mémoriel et du montage sensible.',
      posterUrl: '/src/assets/images/romeo_settling_studio_1792698427492.jpg',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
      duration: '04:45',
      tag: '45 € / pers. • Atelier'
    },
    {
      id: 'produits-3',
      title: 'Consultation scénario & récits',
      subtitle: 'Accompagnement de projets de films',
      description: 'Séance individuelle de conseil dramaturgique pour donner force et résonance à votre projet documentaire avant le tournage.',
      posterUrl: '/src/assets/images/romeo_avatar_1792698425983.jpg',
      videoUrl: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
      duration: '06:00',
      tag: '60 € / séance'
    },
    {
      id: 'produits-4',
      title: 'Tirages d’art & photographies',
      subtitle: 'Série argentique « Retour au pays »',
      description: 'Tirages d’art limités et numérotés documentant la lumière et les visages du Bénin contemporain.',
      posterUrl: '/src/assets/images/romeo_arriving_cotonou_1792698426939.jpg',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      duration: '03:50',
      tag: '75 € • Tirage numéroté'
    }
  ],
  projets: [
    {
      id: 'projets-1',
      title: 'L’Atelier Créatif YonyWood Cotonou',
      subtitle: 'Studio documentaire & archivage',
      description: 'Aménagement d’un espace indépendant à Cotonou dédié à la réalisation documentaire, à l’archivage numérique et à l’accueil de résidences créatives.',
      posterUrl: '/src/assets/images/romeo_settling_studio_1792698427492.jpg',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      duration: '05:15',
      tag: '80% financé',
      extraInfo: '8 000 € récoltés • 42 contributeurs'
    },
    {
      id: 'projets-2',
      title: 'Résidence des voix de la lagune',
      subtitle: 'Création collective en bordure d’eau',
      description: 'Tournage documentaire itinérant entre Ganvié et Porto-Novo pour capter la poésie et la vie des communautés lacustres.',
      posterUrl: '/src/assets/images/romeo_lagoon_sunset_1792698428025.jpg',
      videoUrl: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
      duration: '04:10',
      tag: '65% financé',
      extraInfo: '5 200 € récoltés • 28 contributeurs'
    },
    {
      id: 'projets-3',
      title: 'Programme Passeurs d’Avenir',
      subtitle: 'Éducation à l’image en milieu scolaire',
      description: 'Ateliers d’initiation au documentaire dans les lycées et collèges du Sud-Bénin pour apprendre aux jeunes à raconter leurs mémoires.',
      posterUrl: '/src/assets/images/romeo_dialogue_elders_1792698428934.jpg',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
      duration: '06:20',
      tag: '90% financé',
      extraInfo: '6 500 € récoltés • 35 contributeurs'
    },
    {
      id: 'projets-4',
      title: 'Plateforme des mémoires vivantes',
      subtitle: 'Numérisation des savoirs oraux',
      description: 'Création d’une archive numérique ouverte connectant les diasporas aux savoir-faire et récits ancestraux du Bénin.',
      posterUrl: '/src/assets/images/romeo_arriving_cotonou_1792698426939.jpg',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      duration: '04:45',
      tag: '100% financé',
      extraInfo: '12 000 € récoltés • 60 contributeurs'
    }
  ],
  besoins: [
    {
      id: 'besoins-1',
      title: 'Jeunes cadreurs & monteurs béninois',
      subtitle: 'Appel à compétences locales',
      description: 'Recherche de 3 jeunes talents en tournage et montage résidant à Cotonou ou Porto-Novo pour renforcer l’équipe de création documentaire.',
      posterUrl: '/src/assets/images/romeo_settling_studio_1792698427492.jpg',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      duration: '04:00',
      tag: 'Prioritaire'
    },
    {
      id: 'besoins-2',
      title: 'Partenariats avec lieux culturels',
      subtitle: 'Espaces de projection & débats',
      description: 'Recherche de galeries, cours d’artisans et centres culturels pour organiser des projections et cercles d’échanges citoyens.',
      posterUrl: '/src/assets/images/romeo_dialogue_elders_1792698428934.jpg',
      videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
      duration: '03:30',
      tag: 'En cours'
    },
    {
      id: 'besoins-3',
      title: 'Matériel de numérisation audio',
      subtitle: 'Sauvegarde des mémoires sonores',
      description: 'Appel aux dons et prêts de magnétophones et numériseurs pour traiter des archives orales enregistrées sur bandes et cassettes.',
      posterUrl: '/src/assets/images/romeo_arriving_cotonou_1792698426939.jpg',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
      duration: '04:15',
      tag: 'D’ici juin'
    },
    {
      id: 'besoins-4',
      title: 'Coproducteurs & mécènes de la diaspora',
      subtitle: 'Soutien au cinéma indépendant',
      description: 'Recherche de coproducteurs et passionnés de culture pour abonder le fonds de production de la première saison documentaire YonyWood.',
      posterUrl: '/src/assets/images/romeo_lagoon_sunset_1792698428025.jpg',
      videoUrl: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
      duration: '05:00',
      tag: 'Permanente'
    }
  ]
};

// Alias pour compatibilité
export const PASCAL_SIMULATION_DATA = ROMEO_SIMULATION_DATA;

export const DemoProfilPascalSection: React.FC = () => {
  // Catégorie active
  const [activeCategory, setActiveCategory] = useState<DemoProfileCategory>('parcours');
  // Affichage de la vue dédiée à la lignée
  const [showLineage, setShowLineage] = useState<boolean>(false);
  // Index de vidéo active par catégorie (de 0 à 3, soit jusqu'à 4 vidéos)
  const [videoIndices, setVideoIndices] = useState<Record<DemoProfileCategory, number>>({
    parcours: 0,
    produits: 0,
    projets: 0,
    besoins: 0
  });

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Swipe tactile
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);

  const currentVideos = PASCAL_SIMULATION_DATA[activeCategory];
  const currentVideoIdx = videoIndices[activeCategory] || 0;
  const currentVideo = currentVideos[currentVideoIdx] || currentVideos[0];

  const handlePrevVideo = () => {
    setVideoIndices((prev) => ({
      ...prev,
      [activeCategory]: (prev[activeCategory] - 1 + currentVideos.length) % currentVideos.length
    }));
    setIsPlaying(false);
  };

  const handleNextVideo = () => {
    setVideoIndices((prev) => ({
      ...prev,
      [activeCategory]: (prev[activeCategory] + 1) % currentVideos.length
    }));
    setIsPlaying(false);
  };

  const togglePlayback = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
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
        handlePrevVideo();
      } else if (diff < -40) {
        handleNextVideo();
      }
    }
    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  const getCategoryLabel = (cat: DemoProfileCategory) => {
    switch (cat) {
      case 'parcours': return 'Parcours de vie';
      case 'produits': return 'Produits et services';
      case 'projets': return 'Projets';
      case 'besoins': return 'Besoins';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-2 sm:py-4 flex flex-col items-center select-none">

      {/* En-tête : Roméo avec tiret terracotta officiel */}
      <div className="w-full flex items-center justify-between mb-2 sm:mb-4 px-3 sm:px-6">
        <div className="relative flex items-center">
          <h1 className="font-editorial text-xs sm:text-sm md:text-base font-semibold text-[#1C1917] tracking-normal leading-none whitespace-nowrap">
            Roméo Nonvide
          </h1>
          <div className="absolute left-0 -bottom-1.5 w-8 h-0.5 bg-[#A2482B] rounded-full" />
        </div>

        <div className="text-[11px] text-stone-500 font-medium">
          {showLineage ? 'Page Lignée' : `${getCategoryLabel(activeCategory)} • Vidéo ${currentVideoIdx + 1}/4`}
        </div>
      </div>

      {/* ZONE CENTRALE : VUE LIGNÉE DÉDIÉE OU CARTE VIDÉO 9:16 AVEC LES 5 BOUTONS LATÉRAUX */}
      <div className="relative w-full max-w-md mx-auto flex items-center justify-center my-1 sm:my-2">

        {/* Flèche gauche (uniquement en mode vidéo si plusieurs vidéos) */}
        {!showLineage && (
          <button
            type="button"
            onClick={handlePrevVideo}
            className="absolute -left-3 sm:-left-12 z-20 w-10 h-10 rounded-full bg-white text-stone-800 border border-stone-200 shadow-md flex items-center justify-center hover:bg-stone-100 transition-all cursor-pointer hover:scale-105 active:scale-95"
            title="Vidéo précédente"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* CONTENEUR CARTE 9:16 */}
        <div 
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          className="h-[min(510px,calc(100vh-210px))] aspect-[9/16] w-auto mx-auto rounded-3xl overflow-hidden bg-stone-950 shadow-2xl border border-stone-200/50 relative flex flex-col justify-between shrink-0"
        >

          {showLineage ? (
            /* =================================================================== */
            /* 1. VUE DÉDIÉE À LA LIGNÉE (ACTIVÉE PAR LE BOUTON 1 "LA LIGNÉE")     */
            /* =================================================================== */
            <div className="w-full h-full p-4 sm:p-5 flex flex-col justify-between bg-white text-stone-900 overflow-y-auto animate-in fade-in duration-200">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#A2482B]/10 text-[#A2482B] flex items-center justify-center">
                      <LineageGenerationsIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-editorial text-sm font-bold text-stone-900 leading-tight">
                        La Lignée de Roméo
                      </h3>
                      <p className="text-[10px] text-stone-500">Transmission & parrainages</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowLineage(false)}
                    className="text-xs text-[#A2482B] font-semibold hover:underline cursor-pointer"
                  >
                    Retour aux vidéos
                  </button>
                </div>

                <div className="space-y-3 pt-3">
                  {/* Niveau 1 : Pascal */}
                  <div className="p-2.5 rounded-2xl bg-stone-50 border border-stone-200 flex items-center gap-3">
                    <img
                      src="/assets/duos/codjo-blind.jpg"
                      alt="Pascal"
                      className="w-10 h-10 rounded-xl object-cover border border-[#A2482B]/40 shrink-0"
                    />
                    <div>
                      <span className="text-[9px] uppercase font-bold text-[#A2482B] bg-[#A2482B]/10 px-2 py-0.5 rounded-full">
                        Génération 1 • Égérie
                      </span>
                      <h4 className="font-bold text-xs text-stone-900 mt-0.5">Pascal Cossi</h4>
                      <p className="text-[10px] text-stone-600">Président de Voir Autrement • Prêtre du Fâ</p>
                    </div>
                  </div>

                  {/* Filiation */}
                  <div className="flex items-center gap-2 pl-6 text-[10px] font-bold text-[#A2482B]">
                    <div className="w-0.5 h-4 bg-[#A2482B]" />
                    <span>↓ Parraine et intègre dans la communauté :</span>
                  </div>

                  {/* Niveau 2 : Cécile */}
                  <div className="p-2.5 rounded-2xl bg-stone-50 border border-stone-200 flex items-center gap-3 ml-3">
                    <img
                      src="/assets/protagonists/adjovi-blandine.jpg"
                      alt="Cécile"
                      className="w-10 h-10 rounded-xl object-cover border border-stone-200 shrink-0"
                    />
                    <div>
                      <span className="text-[9px] uppercase font-bold text-stone-700 bg-stone-200 px-2 py-0.5 rounded-full">
                        Génération 2 • Filleule
                      </span>
                      <h4 className="font-bold text-xs text-stone-900 mt-0.5">Cécile</h4>
                      <p className="text-[10px] text-stone-600">Artisane maroquinière non-voyante</p>
                    </div>
                  </div>

                  {/* Filiation */}
                  <div className="flex items-center gap-2 pl-9 text-[10px] font-bold text-[#A2482B]">
                    <div className="w-0.5 h-4 bg-[#A2482B]" />
                    <span>↓ Parraine à son tour :</span>
                  </div>

                  {/* Niveau 3 : Norbert */}
                  <div className="p-2.5 rounded-2xl bg-stone-50 border border-stone-200 flex items-center gap-3 ml-6">
                    <img
                      src="/assets/duos/kwame-mensah.jpg"
                      alt="Norbert"
                      className="w-10 h-10 rounded-xl object-cover border border-stone-200 shrink-0"
                    />
                    <div>
                      <span className="text-[9px] uppercase font-bold text-stone-600 bg-stone-200 px-2 py-0.5 rounded-full">
                        Génération 3 • Filleul
                      </span>
                      <h4 className="font-bold text-xs text-stone-900 mt-0.5">Norbert</h4>
                      <p className="text-[10px] text-stone-600">Menuisier sculpteur sur bois noble</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[10px] text-stone-500">
                <span>Réseau d'héritage actif</span>
                <button
                  type="button"
                  onClick={() => setShowLineage(false)}
                  className="px-3 py-1.5 rounded-xl bg-[#1C1917] text-white font-semibold cursor-pointer"
                >
                  Fermer la lignée
                </button>
              </div>
            </div>
          ) : (
            /* =================================================================== */
            /* 2. CARTE VIDÉO IMMERSIVE 9:16 AVEC LE MÊME PERSONNAGE DANS DIVERSES SITUATIONS */
            /* =================================================================== */
            <div 
              onClick={togglePlayback}
              className="relative w-full h-full flex flex-col justify-between cursor-pointer group"
            >
              {/* Image de fond de la situation réaliste */}
              <img
                src={currentVideo.posterUrl}
                alt={currentVideo.title}
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              />

              {/* Vidéo superposée en cas de lecture */}
              <video
                ref={videoRef}
                src={currentVideo.videoUrl}
                loop
                muted={isMuted}
                playsInline
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 pointer-events-none ${
                  isPlaying ? 'opacity-100' : 'opacity-0'
                }`}
              />

              {/* Dégradé cinématographique pour garantir la lisibilité parfaite */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/40 pointer-events-none" />

              {/* HAUT GAUCHE : Badge de la catégorie ou avancement/statut */}
              <div className="absolute top-3 left-3 z-20 pointer-events-auto">
                <div className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[10.5px] font-semibold text-white tracking-wide shadow-md flex items-center gap-1.5">
                  <span>{currentVideo.tag || getCategoryLabel(activeCategory)}</span>
                </div>
              </div>

              {/* HAUT DROITE : Bouton de lecture vidéo officiel (reste en haut à droite) */}
              <div className="absolute top-3 right-3 z-20 pointer-events-auto flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePlayback(e);
                  }}
                  id="btn-demo-play"
                  className="w-8 h-8 rounded-xl bg-black/45 hover:bg-[#A2482B] backdrop-blur-md border border-white/20 hover:border-[#A2482B] text-white flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer hover:scale-105 active:scale-95 shrink-0"
                  title={isPlaying ? 'Mettre en pause' : 'Lire la vidéo'}
                >
                  {isPlaying ? (
                    <Pause className="w-3.5 h-3.5 fill-white text-white" />
                  ) : (
                    <TvPlayerIcon className="w-4.5 h-4.5 text-white transition-transform" strokeWidth={1.7} />
                  )}
                </button>
              </div>

              {/* COLONNE LATÉRALE DROITE (AU MILIEU DE LA CARTE) : LES 5 BOUTONS DANS L'ORDRE STRICT */}
              <div 
                className="absolute right-2.5 top-[56%] -translate-y-1/2 z-30 flex flex-col items-center gap-2 pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* 1. LA LIGNÉE : permet d'accéder à la page dédiée à la lignée de la personne */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowLineage(true);
                  }}
                  className={`w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-xl border flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer hover:scale-105 active:scale-95 ${
                    showLineage
                      ? 'bg-[#A2482B] border-[#A2482B] text-white shadow-[0_0_12px_rgba(162,72,43,0.6)]'
                      : 'bg-black/50 hover:bg-[#A2482B] border-white/20 hover:border-[#A2482B] text-white/90 backdrop-blur-md'
                  }`}
                  title="1. La lignée"
                  aria-label="La lignée"
                >
                  <LineageGenerationsIcon className="w-4 h-4 text-white" />
                </button>

                {/* 2. LE PARCOURS DE VIE : cheminement personnel et professionnel */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowLineage(false);
                    setActiveCategory('parcours');
                  }}
                  className={`w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-xl border flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer hover:scale-105 active:scale-95 ${
                    !showLineage && activeCategory === 'parcours'
                      ? 'bg-[#A2482B] border-[#A2482B] text-white shadow-[0_0_12px_rgba(162,72,43,0.6)]'
                      : 'bg-black/50 hover:bg-[#A2482B] border-white/20 hover:border-[#A2482B] text-white/90 backdrop-blur-md'
                  }`}
                  title="2. Parcours de vie"
                  aria-label="Parcours de vie"
                >
                  <ParcoursDeVieIcon className="w-4 h-4 text-white" />
                </button>

                {/* 3. LES PRODUITS ET SERVICES : conserver le bouton et l'icône déjà existants */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowLineage(false);
                    setActiveCategory('produits');
                  }}
                  className={`w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-xl border flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer hover:scale-105 active:scale-95 ${
                    !showLineage && activeCategory === 'produits'
                      ? 'bg-[#A2482B] border-[#A2482B] text-white shadow-[0_0_12px_rgba(162,72,43,0.6)]'
                      : 'bg-black/50 hover:bg-[#A2482B] border-white/20 hover:border-[#A2482B] text-white/90 backdrop-blur-md'
                  }`}
                  title="3. Produits et services"
                  aria-label="Produits et services"
                >
                  <ProduitsServicesIcon className="w-4 h-4 text-white" />
                </button>

                {/* 4. LES PROJETS : conserver le bouton et l'icône déjà existants */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowLineage(false);
                    setActiveCategory('projets');
                  }}
                  className={`w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-xl border flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer hover:scale-105 active:scale-95 ${
                    !showLineage && activeCategory === 'projets'
                      ? 'bg-[#A2482B] border-[#A2482B] text-white shadow-[0_0_12px_rgba(162,72,43,0.6)]'
                      : 'bg-black/50 hover:bg-[#A2482B] border-white/20 hover:border-[#A2482B] text-white/90 backdrop-blur-md'
                  }`}
                  title="4. Projets"
                  aria-label="Projets"
                >
                  <ProjetsIcon className="w-4 h-4 text-white" />
                </button>

                {/* 5. LES BESOINS : ajouter un nouveau bouton pour représenter les besoins exprimés */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowLineage(false);
                    setActiveCategory('besoins');
                  }}
                  className={`w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-xl border flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer hover:scale-105 active:scale-95 ${
                    !showLineage && activeCategory === 'besoins'
                      ? 'bg-[#A2482B] border-[#A2482B] text-white shadow-[0_0_12px_rgba(162,72,43,0.6)]'
                      : 'bg-black/50 hover:bg-[#A2482B] border-white/20 hover:border-[#A2482B] text-white/90 backdrop-blur-md'
                  }`}
                  title="5. Besoins"
                  aria-label="Besoins"
                >
                  <BesoinsHandsIcon className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* BAS : TEXTE CONTEXTUEL STRICTEMENT ÉPURÉ SELON LA CATÉGORIE */}
              <div className="relative z-10 p-3.5 sm:p-4.5 pr-14 text-white pointer-events-none">
                {activeCategory === 'parcours' && (
                  <div>
                    <h3 className="font-editorial text-base sm:text-lg font-bold leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                      Pascal
                    </h3>
                    <p className="text-[11px] font-semibold text-white/90 mt-0.5 drop-shadow-md line-clamp-1">
                      {currentVideo.title}
                    </p>
                  </div>
                )}

                {activeCategory === 'produits' && (
                  <div>
                    <h3 className="font-editorial text-base sm:text-lg font-bold leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] line-clamp-1">
                      {currentVideo.title}
                    </h3>
                  </div>
                )}

                {activeCategory === 'projets' && (
                  <div>
                    <h3 className="font-editorial text-base sm:text-lg font-bold leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] line-clamp-1">
                      {currentVideo.title}
                    </h3>
                    {currentVideo.extraInfo && (
                      <p className="text-[11px] font-semibold text-[#FFE7A3] mt-0.5 drop-shadow-md line-clamp-1">
                        {currentVideo.extraInfo}
                      </p>
                    )}
                  </div>
                )}

                {activeCategory === 'besoins' && (
                  <div>
                    <h3 className="font-editorial text-base sm:text-lg font-bold leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] line-clamp-1">
                      {currentVideo.title}
                    </h3>
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

        {/* Flèche droite (uniquement en mode vidéo) */}
        {!showLineage && (
          <button
            type="button"
            onClick={handleNextVideo}
            className="absolute -right-3 sm:-right-12 z-20 w-10 h-10 rounded-full bg-white text-stone-800 border border-stone-200 shadow-md flex items-center justify-center hover:bg-stone-100 transition-all cursor-pointer hover:scale-105 active:scale-95"
            title="Vidéo suivante"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

      </div>

      {/* Guide visuel explicatif sous la carte */}
      <div className="w-full max-w-md mx-auto mt-3 px-3 py-2 rounded-2xl bg-stone-50 border border-stone-200/80 text-[11px] text-stone-600 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-[#A2482B] shrink-0" />
          <span>Même personnage (Pascal) dans 4 vidéos par catégorie</span>
        </div>
        <span className="font-mono text-[10px] font-bold text-[#A2482B] bg-[#A2482B]/10 px-2 py-0.5 rounded-full">
          16 vidéos
        </span>
      </div>

    </div>
  );
};
