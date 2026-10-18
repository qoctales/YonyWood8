import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Volume2, 
  VolumeX, 
  X,
  Sparkles,
  Building2,
  Film,
  Compass,
  Check,
  MapPin,
  Calendar,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Video,
  Clapperboard,
  Sliders,
  Send,
  MessageSquare
} from 'lucide-react';
import { ShareIcon } from './ShareIcon';
import { ViewScreen } from '../types';

export interface CompanyEntity {
  id: string;
  category: string;
  companyName: string;
  founderName: string;
  founderRole: string;
  location: string;
  photoUrl: string;
  videoUrl: string;
  tagline: string;
  adn: {
    title: string;
    description: string;
  };
  raisonEtre: {
    title: string;
    chapeau: string;
    performante: string;
    durable: string;
  };
  mission: {
    title: string;
    text: string;
  };
  studioTournage?: {
    title: string;
    subtitle: string;
    description: string;
    locationNote: string;
    features: string[];
  };
}

export const COMPANIES_DATA: CompanyEntity[] = [
  {
    id: 'afrika-fun',
    category: 'Agence & Création Vidéo',
    companyName: 'AFRIKAFUN',
    founderName: 'Stéphane',
    founderRole: 'Fondateur & Producteur Audiovisuel',
    location: 'Fidjrossè · Cotonou (Bénin)',
    photoUrl: '/assets/Onboardings/Voyage.png',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    tagline: 'Créer, raconter, inspirer',
    adn: {
      title: 'Passion, créativité et originalité',
      description: 'Nous sommes des experts dans la création de contenu vidéo attrayant et engageant. Nous comprenons l’importance d’une communication visuelle efficace et savons comment raconter une histoire captivante à travers des vidéos bien conçues. Nous faire appel vous permet de bénéficier de notre expertise, de notre créativité et de nos compétences techniques pour créer des vidéos professionnelles qui suscitent l’intérêt de votre public cible.'
    },
    raisonEtre: {
      title: "Notre raison d'être",
      chapeau: 'Notre cap se traduit à travers notre raison d’être : contribuer, à travers notre métier de créateurs de contenus, à l’évolution performante et durable de la communication des entreprises.',
      performante: 'Nous participons à créer des messages de communication utiles et de plus en plus engagés qui, nous l’espérons, contribuent à bâtir le monde de demain.',
      durable: 'Nous prenons en compte, dans l’exécution de nos métiers, les meilleures pratiques environnementales, sociales et sociétales.'
    },
    mission: {
      title: 'Créer, raconter, inspirer',
      text: 'Parce que chaque histoire mérite d’être entendue, notre travail est de donner vie aux récits qui éveillent la curiosité, touchent les cœurs et nourrissent les esprits. À travers des émissions innovantes et des documentaires authentiques, nous mettons en lumière des parcours singuliers, des initiatives audacieuses et des cultures fascinantes. Notre engagement : écrire avec rigueur, filmer avec passion et partager avec émotion. Chaque épisode est une invitation à découvrir, comprendre et s’inspirer.'
    },
    studioTournage: {
      title: 'Découvrez votre studio de tournage',
      subtitle: 'Un studio de tournage, parfaitement équipé et modulable, conçu pour répondre à tous vos besoins de production',
      description: 'Bienvenue dans la salle de tournage AFRIKAFUN, un espace pensé pour répondre aux besoins des créateurs et professionnels de l’audiovisuel. Entièrement équipé, il offre tout le nécessaire pour concrétiser vos projets dans un cadre moderne et fonctionnel.',
      locationNote: 'Notre studio, idéalement implanté à Fidjrossè, conjugue accessibilité et équipements modernes pour stimuler votre créativité.',
      features: [
        'Plateau de tournage insonorisé et modulable',
        'Éclairage cinéma LED bicolore & DMX piloté',
        'Régie multicam 4K et micros broadcast sans fil',
        'Cyclorama et configurations sur-mesure (interview, plateau TV, fiction)'
      ]
    }
  },
  {
    id: 'studio-afrika-fun',
    category: 'Studio de Tournage & Régie',
    companyName: 'Studio AFRIKAFUN',
    founderName: 'Stéphane',
    founderRole: 'Responsable des Plateaux',
    location: 'Fidjrossè · Cotonou',
    photoUrl: '/assets/Onboardings/Bibliotheque.png',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    tagline: 'Plateau équipé & Post-production',
    adn: {
      title: 'Excellence technique & Modularité',
      description: 'Conçu par des réalisateurs pour des réalisateurs, le Studio AFRIKAFUN offre un cadre technique d’exception pour accueillir interviews intimes, captations de masterclasses, podcasts filmés et clips narratifs.'
    },
    raisonEtre: {
      title: 'Démocratiser la haute production locale',
      chapeau: 'Offrir un hub technique souverain au cœur de Fidjrossè pour que les créateurs africains et internationaux disposent d’infrastructures de calibre mondial.',
      performante: 'Flux de tournage accéléré avec station d’étalonnage et montage en direct.',
      durable: 'Équipements basse consommation, optimisation thermique et engagement éco-responsable.'
    },
    mission: {
      title: 'Un espace vivant pour vos images',
      text: 'Le studio conjugue modularité des décors, confort acoustique et technologie de pointe pour donner à chaque marque une signature visuelle mémorable.'
    },
    studioTournage: {
      title: 'Salle de tournage AFRIKAFUN Fidjrossè',
      subtitle: 'Disponible à la location pour entreprises, créateurs et agences',
      description: 'Espace insonorisé de 100m² avec régie intégrée, loge maquillage et espace détente pour accueillir vos invités en toute sérénité.',
      locationNote: 'Quartier Fidjrossè, à 8 minutes de l’aéroport de Cotonou.',
      features: [
        'Régie Blackmagic Design 4K',
        'Fonds neutres, bois chaleureux et cyclorama',
        'Parc optique cinéma complet',
        'Équipe technique dédiée disponible sur demande'
      ]
    }
  },
  {
    id: 'ecobenin-heritage',
    category: 'Éco-Tourisme & Sauvegarde',
    companyName: 'EcoBénin Heritage',
    founderName: 'Gautier Amoussou',
    founderRole: 'Directeur & Écologue',
    location: 'Ganvié · Ouidah · Grand-Popo',
    photoUrl: '/assets/duos/codjo-blind.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    tagline: 'Voyages conscients & Racines vivantes',
    adn: {
      title: 'Préservation des écosystèmes et des mémoires',
      description: 'EcoBénin accompagne les communautés lacustres et rurales dans le développement d’un tourisme respectueux de la nature, qui valorise les coutumes ancestrales et protège la mangrove.'
    },
    raisonEtre: {
      title: 'Protéger en partageant avec respect',
      chapeau: 'Chaque expédition finance directement la réhabilitation des berges et la scolarisation des enfants des cités lacustres.',
      performante: 'Retombées économiques directes reversées à 100% dans l’économie solidaire locale.',
      durable: 'Zéro empreinte plastique, barques solaires et respect scrupuleux des sanctuaires naturels.'
    },
    mission: {
      title: 'Connecter les voyageurs à l’âme de l’eau',
      text: 'Rencontrer les pêcheurs de Ganvié, écouter le chant des pirogues à l’aube et comprendre le langage secret du lac Nokoué.'
    }
  },
  {
    id: 'kaba-creations',
    category: 'Textile Durable & Savoir-Faire',
    companyName: 'Kaba Créations',
    founderName: 'Awa Diallo',
    founderRole: 'Créatrice & Maître Tisserande',
    location: 'Cotonou · Porto-Novo',
    photoUrl: '/assets/protagonists/adjovi-blandine.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    tagline: 'L’art du tissage végétal réinventé',
    adn: {
      title: 'Fibre locale & Teintures végétales',
      description: 'Kaba Créations sublime le coton équitable d’Afrique de l’Ouest et réhabilite les procédés de teinture à base d’écorces, de feuilles d’indigo et d’argile rouge du Bénin.'
    },
    raisonEtre: {
      title: 'Vêtir le monde avec dignité et éthique',
      chapeau: 'Transmettre le geste du tissage traditionnel aux jeunes femmes pour leur garantir une autonomie financière et créative.',
      performante: 'Atelier certifié commerce équitable exportant dans plus de 14 pays.',
      durable: 'Colorants 100% biodégradables, zéro déchet textile réutilisé en papeterie d’art.'
    },
    mission: {
      title: 'Chaque fil raconte une lignée',
      text: 'Les motifs tissés à la main ne sont pas de simples ornements : ils constituent des écritures vivantes héritées des reines et bâtisseurs du Dahomey.'
    }
  },
  {
    id: 'sunkofa-sol',
    category: 'Énergie Propre & Ingénierie',
    companyName: 'Sunkofa Sol Solutions',
    founderName: 'Babacar Ndiaye',
    founderRole: 'Ingénieur Énergies Renouvelables',
    location: 'Grand-Popo · Mono',
    photoUrl: '/assets/duos/kwame-mensah.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
    tagline: 'L’électricité solaire pour chaque berge',
    adn: {
      title: 'Souveraineté énergétique décentralisée',
      description: 'Conception et déploiement de mini-réseaux solaires autonomes et de glacières photovoltaïques pour les coopératives de pêcheurs et maraîchers le long des fleuves.'
    },
    raisonEtre: {
      title: 'La lumière comme catalyseur de prospérité',
      chapeau: 'Fournir une énergie propre et inépuisable aux territoires isolés pour stopper l’exode et soutenir l’artisanat.',
      performante: 'Rendement énergétique optimisé pour les fortes chaleurs équatoriales.',
      durable: 'Batteries recyclables en circuit court et maintenance assurée par des techniciens locaux formés.'
    },
    mission: {
      title: 'Éclairer sans dénaturer',
      text: 'Remplacer les groupes électrogènes bruyants et polluants par la force silencieuse du soleil d’Afrique.'
    }
  },
  {
    id: 'bioagri-terroirs',
    category: 'Agro-Écologie & Terroirs',
    companyName: 'BioAgri Terroirs',
    founderName: 'Rodrigue Sossou',
    founderRole: 'Agronome & Conservateur de Semences',
    location: 'Allada · Atlantique',
    photoUrl: '/assets/protagonists/armel-hounkpatin.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    tagline: 'Nourrir l’avenir avec nos semences d’origine',
    adn: {
      title: 'Souveraineté semencière et fertilité vivante',
      description: 'Banque vivante de semences locales de maïs violet, niébé ancien, manioc doux et légumes-feuilles oubliés, cultivés sans aucun intrant chimique de synthèse.'
    },
    raisonEtre: {
      title: 'La terre rend ce qu’on lui offre avec amour',
      chapeau: 'Former plus de 200 jeunes exploitants chaque année aux principes de la permaculture et de l’agroforesterie régénérative.',
      performante: 'Rendements stables et résilients face aux dérèglements pluviométriques.',
      durable: 'Régénération des sols épuisés, séquestration du carbone et préservation de la biodiversité d’origine.'
    },
    mission: {
      title: 'Le goût vrai de notre terre',
      text: 'Offrir aux familles urbaines et rurales une nourriture saine, riche en nutriments et porteuse de l’histoire culinaire de nos aïeux.'
    }
  }
];

interface CompanyHeritageScreenProps {
  onNavigate?: (screen: ViewScreen) => void;
}

export const CompanyHeritageScreen: React.FC<CompanyHeritageScreenProps> = ({ onNavigate }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Popups internes à la carte (confinées comme la modale question des protagonistes)
  const [activeInternalPopup, setActiveInternalPopup] = useState<'adn' | 'studio' | null>(null);

  // Modale plein écran dossier complet
  const [showFullDossier, setShowFullDossier] = useState(false);

  // Partage
  const [copied, setCopied] = useState(false);

  // Swipe tactile
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const currentCompany = COMPANIES_DATA[currentIdx];

  const handlePrev = () => {
    setIsPlaying(false);
    setActiveInternalPopup(null);
    setCurrentIdx((prev) => (prev - 1 + COMPANIES_DATA.length) % COMPANIES_DATA.length);
  };

  const handleNext = () => {
    setIsPlaying(false);
    setActiveInternalPopup(null);
    setCurrentIdx((prev) => (prev + 1) % COMPANIES_DATA.length);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
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
      if (diff > 45) {
        handlePrev();
      } else if (diff < -45) {
        handleNext();
      }
    }
    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div 
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className="w-full max-w-3xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3.5 pb-18 sm:pb-20 pt-safe pb-safe h-[calc(100dvh-56px)] max-h-[calc(100dvh-56px)] overflow-hidden flex flex-col justify-between text-[#1C1917] select-none"
    >
      
      {/* =========================================================== */}
      {/* EN-TÊTE : Titre standardisé avec le petit trait signature   */}
      {/* =========================================================== */}
      <div className="flex items-center justify-between h-8 sm:h-9 shrink-0 gap-2 mb-2 sm:mb-2.5">
        <div className="relative flex items-center h-full shrink-0">
          <h1 className="font-editorial text-base sm:text-[18px] font-bold text-[#1C1917] tracking-tight leading-none">
            Entreprises
          </h1>
          <div className="absolute left-0 -bottom-2 w-8 h-0.5 bg-[#A2482B] rounded-full" />
        </div>
      </div>

      {/* =========================================================== */}
      {/* ZONE CENTRALE : CARTE VIDÉO 9:16 (Même gabarit protagoniste) */}
      {/* =========================================================== */}
      <div className="relative w-full flex-1 flex items-center justify-center min-h-0 my-auto">
        
        {/* Flèche gauche (positionnée avec sécurité pour ne jamais être coupée) */}
        <button
          onClick={handlePrev}
          className="absolute left-1 sm:left-3 md:left-6 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white text-stone-800 hover:bg-[#A2482B] hover:text-white border border-stone-200 shadow-md flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
          title="Entreprise précédente"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* CARTE VIDÉO 9:16 UNIQUE - Responsive unifié (mobile 490px, tablette 540px, web 570px) */}
        <div 
          onClick={() => {
            if (!isPlaying && !activeInternalPopup) {
              setIsPlaying(true);
            }
          }}
          className="h-[min(490px,calc(100dvh-210px))] sm:h-[min(540px,calc(100dvh-190px))] lg:h-[min(570px,calc(100dvh-180px))] aspect-[9/16] w-auto mx-auto rounded-3xl overflow-hidden bg-stone-950 text-white shadow-2xl border border-stone-200/40 relative flex flex-col justify-between p-4 sm:p-5 cursor-pointer group"
        >
          
          {/* LECTEUR VIDÉO INTERNE SI ACTIF */}
          {isPlaying ? (
            <div 
              onClick={(e) => e.stopPropagation()}
              className="absolute inset-0 z-20 bg-black flex flex-col justify-between p-4"
            >
              <video
                ref={videoRef}
                src={currentCompany.videoUrl}
                autoPlay
                playsInline
                muted={isMuted}
                onTimeUpdate={(e) => setCurrentTime((e.target as HTMLVideoElement).currentTime)}
                onLoadedMetadata={(e) => setDuration((e.target as HTMLVideoElement).duration)}
                onEnded={() => setIsPlaying(false)}
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Barre haute du lecteur */}
              <div className="relative z-30 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent p-2 -m-4 mb-0">
                <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[11px] font-bold text-white uppercase tracking-wider">
                  {currentCompany.category}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="w-8 h-8 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white hover:bg-[#A2482B] transition-colors cursor-pointer"
                    title={isMuted ? "Activer le son" : "Couper le son"}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => setIsPlaying(false)}
                    className="w-8 h-8 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white hover:bg-stone-800 transition-colors cursor-pointer"
                    title="Fermer la vidéo"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Barre basse du lecteur : Timeline & Identité */}
              <div className="relative z-30 mt-auto bg-gradient-to-t from-black/90 via-black/50 to-transparent p-2 -m-4 mt-0 space-y-2">
                <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#A2482B] h-full transition-all duration-150"
                    style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-stone-300 font-mono">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div>
                    <h4 className="font-editorial text-base sm:text-lg font-bold text-white drop-shadow-md">
                      {currentCompany.companyName}
                    </h4>
                    <p className="text-[11px] text-stone-300 font-medium">
                      {currentCompany.founderName} · {currentCompany.location}
                    </p>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-[#A2482B] text-white">
                    Vidéo en direct
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* IMAGE DE COUVERTURE */}
              <img
                src={currentCompany.photoUrl}
                alt={currentCompany.companyName}
                className="absolute inset-0 w-full h-full object-cover pointer-events-none group-hover:scale-105 transition-transform duration-500 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40 pointer-events-none" />

              {/* =========================================================== */}
              {/* HAUT DE CARTE : Catégorie de l'entreprise en titre */}
              {/* =========================================================== */}
              <div className="relative z-10 flex justify-between items-center">
                <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[11px] sm:text-xs font-bold text-white tracking-wide uppercase drop-shadow-sm">
                  {currentCompany.category}
                </span>

                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" title="Capsule vidéo disponible" />
              </div>

              {/* =========================================================== */}
              {/* LES 4 ICÔNES D'ACTION SUR LE FLANC DROIT (Même alignement) */}
              {/* =========================================================== */}
              <div 
                onClick={(e) => e.stopPropagation()}
                className="absolute right-3 sm:right-3.5 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2.5"
              >
                {/* 1. Dossier complet entreprise (Building2) */}
                <button
                  onClick={() => setShowFullDossier(true)}
                  className="w-9 h-9 sm:w-9.5 sm:h-9.5 rounded-xl bg-black/45 hover:bg-[#A2482B] border border-white/20 hover:border-[#A2482B] text-white flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
                  title="Consulter le dossier d'entreprise"
                >
                  <Building2 className="w-4 h-4 text-white" />
                </button>

                {/* 2. Raison d'être & ADN (Compass) */}
                <button
                  onClick={() => setActiveInternalPopup(activeInternalPopup === 'adn' ? null : 'adn')}
                  className={`w-9 h-9 sm:w-9.5 sm:h-9.5 rounded-xl border flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95 ${
                    activeInternalPopup === 'adn'
                      ? 'bg-[#A2482B] border-[#A2482B] text-white'
                      : 'bg-black/45 hover:bg-[#A2482B] border-white/20 text-white'
                  }`}
                  title="Découvrir l'ADN & la Raison d'être"
                >
                  <Compass className="w-4 h-4 text-white" />
                </button>

                {/* 3. Studio de tournage Fidjrossè (Film) */}
                <button
                  onClick={() => setActiveInternalPopup(activeInternalPopup === 'studio' ? null : 'studio')}
                  className={`w-9 h-9 sm:w-9.5 sm:h-9.5 rounded-xl border flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95 ${
                    activeInternalPopup === 'studio'
                      ? 'bg-[#A2482B] border-[#A2482B] text-white'
                      : 'bg-black/45 hover:bg-[#A2482B] border-white/20 text-white'
                  }`}
                  title="Découvrir le studio de tournage AFRIKAFUN"
                >
                  <Film className="w-4 h-4 text-white" />
                </button>

                {/* 4. Partager (ShareIcon) */}
                <button
                  onClick={handleShare}
                  className={`w-9 h-9 sm:w-9.5 sm:h-9.5 rounded-xl border flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95 ${
                    copied
                      ? 'bg-emerald-700/85 border-emerald-600 text-white'
                      : 'bg-black/45 hover:bg-[#A2482B] border-white/20 text-white'
                  }`}
                  title="Partager cette entreprise"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-white" />
                  ) : (
                    <ShareIcon className="w-4 h-4 text-white" />
                  )}
                </button>
              </div>

              {/* =========================================================== */}
              {/* BAS DE LA CARTE : NOM DE L'ENTREPRISE (à la place du prénom) */}
              {/* et ICÔNE VIDÉO EN FACE À DROITE avec fond terre cuite au survol */}
              {/* =========================================================== */}
              <div className="relative z-10 flex items-end justify-between gap-2 pt-2 mt-auto">
                <div className="space-y-0.5">
                  <h4 className="font-editorial text-lg sm:text-xl font-bold text-white drop-shadow-md tracking-wide">
                    {currentCompany.companyName}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-stone-200 font-medium drop-shadow-sm flex items-center gap-1">
                    <span className="font-semibold text-[#FFE7A3]">{currentCompany.founderName}</span>
                    <span>·</span>
                    <span>{currentCompany.location}</span>
                  </p>
                </div>

                {/* Icône vidéo en bas à droite en face du nom de l'entreprise — fond terre cuite au survol */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsPlaying(true);
                  }}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/50 hover:bg-[#A2482B] border border-white/25 hover:border-[#A2482B] flex items-center justify-center text-white transition-all duration-200 cursor-pointer shadow-lg hover:scale-110 active:scale-95 shrink-0 group/play"
                  title={`Regarder la présentation vidéo de ${currentCompany.companyName}`}
                >
                  <Play className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-white text-white translate-x-0.5 transition-transform group-hover/play:scale-110" />
                </button>
              </div>

              {/* =========================================================== */}
              {/* POPUPS CONFINÉES DANS LA CARTE (ADN / Studio) */}
              {/* =========================================================== */}
              {activeInternalPopup === 'adn' && (
                <div 
                  onClick={(e) => e.stopPropagation()}
                  className="absolute inset-x-2 bottom-2 z-30 bg-stone-900/95 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-white shadow-2xl animate-in fade-in duration-200 max-h-[78%] overflow-y-auto"
                >
                  <div className="flex justify-between items-center mb-2 pb-1 border-b border-white/10">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFE7A3] flex items-center gap-1">
                      <Compass className="w-3.5 h-3.5" />
                      ADN & Raison d'être
                    </span>
                    <button 
                      onClick={() => setActiveInternalPopup(null)}
                      className="text-stone-400 hover:text-white cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-xs font-semibold text-white mb-1.5">
                    {currentCompany.adn.title}
                  </p>
                  <p className="text-[11px] text-stone-200 leading-relaxed mb-3">
                    {currentCompany.adn.description}
                  </p>

                  <div className="pt-2 border-t border-white/10 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-300">
                      Notre cap : Performante & Durable
                    </span>
                    <p className="text-[11px] text-stone-200 leading-relaxed">
                      {currentCompany.raisonEtre.chapeau}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setActiveInternalPopup(null);
                      setShowFullDossier(true);
                    }}
                    className="w-full mt-3 py-1.5 rounded-lg bg-[#A2482B] hover:bg-[#8A3B22] text-white text-[11px] font-bold transition-all text-center cursor-pointer shadow-xs"
                  >
                    Lire le dossier complet
                  </button>
                </div>
              )}

              {activeInternalPopup === 'studio' && (
                <div 
                  onClick={(e) => e.stopPropagation()}
                  className="absolute inset-x-2 bottom-2 z-30 bg-stone-900/95 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-white shadow-2xl animate-in fade-in duration-200 max-h-[78%] overflow-y-auto"
                >
                  <div className="flex justify-between items-center mb-2 pb-1 border-b border-white/10">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFE7A3] flex items-center gap-1">
                      <Film className="w-3.5 h-3.5" />
                      Studio de tournage Fidjrossè
                    </span>
                    <button 
                      onClick={() => setActiveInternalPopup(null)}
                      className="text-stone-400 hover:text-white cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-xs font-semibold text-white mb-1">
                    {currentCompany.studioTournage?.subtitle || "Espace pensé pour répondre aux besoins des créateurs"}
                  </p>
                  <p className="text-[11px] text-stone-200 leading-relaxed mb-2.5">
                    {currentCompany.studioTournage?.description || "Entièrement équipé, il offre tout le nécessaire pour concrétiser vos projets dans un cadre moderne et fonctionnel."}
                  </p>

                  <p className="text-[11px] text-[#FFE7A3] font-medium italic mb-2">
                    {currentCompany.studioTournage?.locationNote || "Idéalement implanté à Fidjrossè, conjuguant accessibilité et équipements modernes."}
                  </p>

                  <button
                    onClick={() => {
                      setActiveInternalPopup(null);
                      setShowFullDossier(true);
                    }}
                    className="w-full mt-2 py-1.5 rounded-lg bg-[#A2482B] hover:bg-[#8A3B22] text-white text-[11px] font-bold transition-all text-center cursor-pointer shadow-xs"
                  >
                    Découvrir tous les équipements
                  </button>
                </div>
              )}

            </>
          )}

        </div>

        {/* Flèche droite (positionnée avec sécurité pour ne jamais être coupée) */}
        <button
          onClick={handleNext}
          className="absolute right-1 sm:right-3 md:right-6 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white text-stone-800 hover:bg-[#A2482B] hover:text-white border border-stone-200 shadow-md flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
          title="Entreprise suivante"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

      </div>

      {/* =========================================================== */}
      {/* MODALE COMPLÈTE DU DOSSIER D'ENTREPRISE (Tous les textes fournis) */}
      {/* =========================================================== */}
      {showFullDossier && (
        <div 
          onClick={() => setShowFullDossier(false)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-white rounded-3xl max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 text-stone-900 p-5 sm:p-8 space-y-6 animate-in zoom-in-95 duration-200"
          >
            {/* Haut de modale */}
            <div className="flex items-start justify-between border-b border-stone-200 pb-4">
              <div>
                <span className="px-3 py-1 rounded-full bg-[#A2482B]/10 text-[#A2482B] text-xs font-bold uppercase tracking-wider">
                  {currentCompany.category}
                </span>
                <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-stone-900 mt-2">
                  {currentCompany.companyName}
                </h3>
                <p className="text-sm text-stone-600 font-medium">
                  {currentCompany.founderName} ({currentCompany.founderRole}) · {currentCompany.location}
                </p>
              </div>

              <button
                onClick={() => setShowFullDossier(false)}
                className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-700 cursor-pointer transition-colors"
                title="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 1. L'agence & Notre ADN */}
            <section className="space-y-2">
              <h4 className="font-editorial text-lg font-bold text-stone-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#A2482B]" />
                L'agence — Notre ADN : {currentCompany.adn.title}
              </h4>
              <p className="text-sm text-stone-700 leading-relaxed font-sans">
                {currentCompany.adn.description}
              </p>
            </section>

            {/* 2. Notre raison d'être */}
            <section className="bg-stone-50 rounded-2xl p-5 border border-stone-200 space-y-3">
              <h4 className="font-editorial text-lg font-bold text-stone-900 flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#A2482B]" />
                {currentCompany.raisonEtre.title}
              </h4>
              <p className="text-sm font-medium text-stone-800 italic">
                {currentCompany.raisonEtre.chapeau}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-white border border-stone-200">
                  <span className="text-xs font-bold text-[#A2482B] uppercase tracking-wider block mb-1">
                    Performante
                  </span>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {currentCompany.raisonEtre.performante}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-stone-200">
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-1">
                    Durable
                  </span>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {currentCompany.raisonEtre.durable}
                  </p>
                </div>
              </div>
            </section>

            {/* 3. Créer, raconter, inspirer */}
            <section className="space-y-2">
              <h4 className="font-editorial text-lg font-bold text-stone-900 flex items-center gap-2">
                <Film className="w-4 h-4 text-[#A2482B]" />
                {currentCompany.mission.title}
              </h4>
              <p className="text-sm text-stone-700 leading-relaxed font-sans">
                {currentCompany.mission.text}
              </p>
            </section>

            {/* 4. DÉCOUVREZ VOTRE STUDIO DE TOURNAGE (AFRIKAFUN Fidjrossè) */}
            {currentCompany.studioTournage && (
              <section className="p-5 rounded-2xl bg-[#A2482B]/5 border border-[#A2482B]/20 space-y-3">
                <div className="flex items-center gap-2 text-[#A2482B]">
                  <Clapperboard className="w-5 h-5" />
                  <h4 className="font-editorial text-lg font-bold">
                    {currentCompany.studioTournage.title}
                  </h4>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-stone-800">
                  {currentCompany.studioTournage.subtitle}
                </p>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                  {currentCompany.studioTournage.description}
                </p>
                <p className="text-xs sm:text-sm text-[#A2482B] font-medium italic">
                  {currentCompany.studioTournage.locationNote}
                </p>

                {currentCompany.studioTournage.features && (
                  <div className="pt-2 border-t border-[#A2482B]/20">
                    <span className="text-xs font-bold text-stone-800 uppercase tracking-wider block mb-2">
                      Équipements & Prestations :
                    </span>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {currentCompany.studioTournage.features.map((feat, idx) => (
                        <li key={idx} className="text-xs text-stone-700 flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-[#A2482B] shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            )}

            {/* 5. Contact & Collaboration */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-stone-200">
              <div className="text-xs text-stone-500 text-center sm:text-left">
                <span>Fondateur référent : </span>
                <span className="font-semibold text-stone-900">{currentCompany.founderName}</span>
                <span> · Implantation : {currentCompany.location}</span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => {
                    setShowFullDossier(false);
                    setIsPlaying(true);
                  }}
                  className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Voir la vidéo</span>
                </button>

                <button
                  onClick={() => {
                    setShowFullDossier(false);
                    if (onNavigate) {
                      onNavigate({ type: 'request_videographer' });
                    }
                  }}
                  className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-[#A2482B] hover:bg-[#8A3B22] text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Contacter l'agence</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
