import React, { useState, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause,
  Volume2, 
  VolumeX, 
  X,
  Compass,
  Check,
  Award,
  BookOpen
} from 'lucide-react';
import { ShareIcon } from './ShareIcon';
import { ResonanceModal } from './ResonanceModal';
import { ProfileSoloIcon } from './YonywoodBrandIcons';
import { ViewScreen } from '../types';

export interface CompanyStakeholder {
  id: string;
  name: string;
  roleCategory: 'Fondateur' | 'Collaborateur' | 'Fournisseur' | 'Client' | 'Partenaire';
  roleDetail?: string;
  photoUrl: string;
  videoUrl: string;
  question?: string;
}

export interface CompanyEntity {
  id: string;
  category: string;
  companyName: string;
  photoUrl: string;
  videoUrl: string;
  tagline: string;
  stakeholders: CompanyStakeholder[];
}

export const COMPANIES_DATA: CompanyEntity[] = [
  {
    id: 'afrika-fun',
    category: 'Audiovisuel',
    companyName: 'AFRIKAFUN',
    photoUrl: '/assets/Onboardings/Voyage.png',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    tagline: 'Créer, raconter, inspirer',
    stakeholders: [
      {
        id: 'afrika-1',
        name: 'Pascal Houndé',
        roleCategory: 'Fondateur',
        photoUrl: '/assets/duos/coach-office.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        question: 'Comment faire rayonner la mémoire et les voix vivantes de notre terre ?'
      },
      {
        id: 'afrika-2',
        name: 'Amina Traoré',
        roleCategory: 'Collaborateur',
        photoUrl: '/assets/protagonists/adjovi-blandine.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        question: 'Comment le montage cinématographique protège-t-il la vérité d’un récit ?'
      },
      {
        id: 'afrika-3',
        name: 'Koffi Mensah',
        roleCategory: 'Fournisseur',
        photoUrl: '/assets/protagonists/chef-koffi.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
        question: 'Quelle exigence technique garantit la souveraineté de nos images ?'
      },
      {
        id: 'afrika-4',
        name: 'Marc Houndégla',
        roleCategory: 'Client',
        photoUrl: '/assets/duos/kwame-mensah.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        question: 'Pourquoi l’authenticité d’un documentaire touche-t-elle plus qu’une simple publicité ?'
      },
      {
        id: 'afrika-5',
        name: 'Ousmane Sow',
        roleCategory: 'Partenaire',
        photoUrl: '/assets/duos/athlete-hurdle.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        question: 'Comment mutualiser nos moyens créatifs pour conquérir les écrans internationaux ?'
      }
    ]
  },
  {
    id: 'suno-solaire',
    category: 'Énergie',
    companyName: 'Suno Solaire',
    photoUrl: '/assets/directions/marques-tech.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
    tagline: 'L’électricité solaire pour chaque berge',
    stakeholders: [
      {
        id: 'suno-1',
        name: 'Babacar Ndiaye',
        roleCategory: 'Fondateur',
        photoUrl: '/assets/duos/kwame-mensah.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
        question: 'Comment le soleil peut-il apporter l’indépendance énergétique aux berges ?'
      },
      {
        id: 'suno-2',
        name: 'Senan Agossa',
        roleCategory: 'Collaborateur',
        photoUrl: '/assets/protagonists/senan-agossa.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        question: 'Comment garantir l’accès continu à l’électricité pour les écoles lacustres ?'
      },
      {
        id: 'suno-3',
        name: 'Tobi Houndégla',
        roleCategory: 'Fournisseur',
        photoUrl: '/assets/protagonists/tobi-houndegla.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
        question: 'Quel avenir pour le recyclage local de nos batteries solaires ?'
      },
      {
        id: 'suno-4',
        name: 'Fatou Diallo',
        roleCategory: 'Client',
        photoUrl: '/assets/duos/fatou-diallo.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        question: 'En quoi les glacières solaires ont-elles sauvé la récolte de nos maraîchers ?'
      },
      {
        id: 'suno-5',
        name: 'Chantal Agbo',
        roleCategory: 'Partenaire',
        photoUrl: '/assets/protagonists/adjovi-blandine.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        question: 'Quelle alliance public-privé garantit la durabilité de nos parcs solaires ?'
      }
    ]
  },
  {
    id: 'trans-lagoon',
    category: 'Transport',
    companyName: 'Trans-Lagoon',
    photoUrl: '/assets/directions/marques-services.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    tagline: 'Liaisons lacustres écologiques et rapides',
    stakeholders: [
      {
        id: 'trans-1',
        name: 'Armel Hounkpatin',
        roleCategory: 'Fondateur',
        photoUrl: '/assets/protagonists/armel-hounkpatin.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
        question: 'Comment concilier vitesse de navigation et respect des écosystèmes marins ?'
      },
      {
        id: 'trans-2',
        name: 'Sika Dossou',
        roleCategory: 'Collaborateur',
        photoUrl: '/assets/protagonists/sika-dossou.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        question: 'Quelle discipline quotidienne permet de sécuriser nos traversées nocturnes ?'
      },
      {
        id: 'trans-3',
        name: 'Codjo Gbédji',
        roleCategory: 'Fournisseur',
        photoUrl: '/assets/protagonists/codjo-blind.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        question: 'Pourquoi le moteur électrique est-il la révolution attendue sur nos lagunes ?'
      },
      {
        id: 'trans-4',
        name: 'Malik Diop',
        roleCategory: 'Client',
        photoUrl: '/assets/duos/malik-diop.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        question: 'Comment le transport propre transforme-t-il la cadence du commerce local ?'
      },
      {
        id: 'trans-5',
        name: 'Nadine Tossou',
        roleCategory: 'Partenaire',
        photoUrl: '/assets/duos/eleonore-vance.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
        question: 'En quoi les corridors fluviaux réinventent-ils l’intégration sous-régionale ?'
      }
    ]
  },
  {
    id: 'finsecure-africa',
    category: 'Finance',
    companyName: 'FinSecure Africa',
    photoUrl: '/assets/directions/marques-finance.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    tagline: 'Micro-assurance et financement des créateurs',
    stakeholders: [
      {
        id: 'fin-1',
        name: 'Hélène Saint-Amand',
        roleCategory: 'Fondateur',
        photoUrl: '/assets/protagonists/helene-saint-amand.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        question: 'Comment financer nos créateurs sans les déposséder de leur vision ?'
      },
      {
        id: 'fin-2',
        name: 'Dieudonné Mensah',
        roleCategory: 'Collaborateur',
        photoUrl: '/assets/duos/athlete-hurdle.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        question: 'Quel modèle d’évaluation honore le talent réel des artisans ?'
      },
      {
        id: 'fin-3',
        name: 'Kwame Mensah',
        roleCategory: 'Fournisseur',
        photoUrl: '/assets/duos/kwame-mensah.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        question: 'Comment bâtir une infrastructure financière inviolable et inclusive ?'
      },
      {
        id: 'fin-4',
        name: 'Adjovi Blandine',
        roleCategory: 'Client',
        photoUrl: '/assets/protagonists/adjovi-blandine.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        question: 'Qu’a changé pour mon atelier le déblocage d’un micro-crédit solidaire ?'
      },
      {
        id: 'fin-5',
        name: 'Samuel Koudjo',
        roleCategory: 'Partenaire',
        photoUrl: '/assets/protagonists/chef-koffi.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        question: 'Comment connecter les coopératives rurales aux banques régionales ?'
      }
    ]
  },
  {
    id: 'africode-tech',
    category: 'Technologie',
    companyName: 'AfriCode Tech',
    photoUrl: '/assets/directions/expertises-numerique.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    tagline: 'Plateformes logicielles souveraines et résilientes',
    stakeholders: [
      {
        id: 'tech-1',
        name: 'Éléonore Vance',
        roleCategory: 'Fondateur',
        photoUrl: '/assets/duos/eleonore-vance.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        question: 'Pourquoi l’Afrique doit-elle posséder son propre code source ?'
      },
      {
        id: 'tech-2',
        name: 'Clara Dossou',
        roleCategory: 'Collaborateur',
        photoUrl: '/assets/duos/photographer-focus.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        question: 'Comment le design d’interface peut-il refléter notre sensibilité esthétique ?'
      },
      {
        id: 'tech-3',
        name: 'Sayri Quispe',
        roleCategory: 'Fournisseur',
        photoUrl: '/assets/duos/sayri-quispe.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
        question: 'Quel rôle pour les serveurs basse consommation face aux coupures réseau ?'
      },
      {
        id: 'tech-4',
        name: 'Mahougnon Zounon',
        roleCategory: 'Client',
        photoUrl: '/assets/duos/dah-zounon.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        question: 'Comment la technologie réconcilie-t-elle traditions et futur ?'
      },
      {
        id: 'tech-5',
        name: 'Tariq Al-Mansoor',
        roleCategory: 'Partenaire',
        photoUrl: '/assets/duos/sayri-quispe.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
        question: 'Comment l’interopérabilité open source décuple-t-elle l’innovation africaine ?'
      }
    ]
  }
];

interface CompanyHeritageScreenProps {
  onNavigate?: (screen: ViewScreen) => void;
}

export const CompanyHeritageScreen: React.FC<CompanyHeritageScreenProps> = () => {
  // Navigation Niveau 1 (Entreprises globales)
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Navigation Niveau 2 (Espace de l'entreprise dédié)
  const [selectedCompanyForSpace, setSelectedCompanyForSpace] = useState<CompanyEntity | null>(null);
  const [stakeholderIdx, setStakeholderIdx] = useState(0);
  const [isStakeholderPlaying, setIsStakeholderPlaying] = useState(false);
  const [isStakeholderMuted, setIsStakeholderMuted] = useState(false);

  // Modales d'interaction pour les témoins
  const [resonanceTargetStakeholder, setResonanceTargetStakeholder] = useState<CompanyStakeholder | null>(null);
  const [stakeholderResonances, setStakeholderResonances] = useState<Record<string, number>>({});
  const [questionModalStakeholder, setQuestionModalStakeholder] = useState<CompanyStakeholder | null>(null);

  // Partage
  const [copied, setCopied] = useState(false);

  // Swipe tactile
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const stakeholderVideoRef = useRef<HTMLVideoElement | null>(null);

  const currentCompany = COMPANIES_DATA[currentIdx];
  const activeStakeholders = selectedCompanyForSpace ? selectedCompanyForSpace.stakeholders : [];
  const currentStakeholder = activeStakeholders[stakeholderIdx] || activeStakeholders[0];

  // Gestion des swipes Niveau 1
  const handlePrev = () => {
    setIsPlaying(false);
    setCurrentIdx((prev) => (prev - 1 + COMPANIES_DATA.length) % COMPANIES_DATA.length);
  };

  const handleNext = () => {
    setIsPlaying(false);
    setCurrentIdx((prev) => (prev + 1) % COMPANIES_DATA.length);
  };

  // Gestion des swipes Niveau 2 (Stakeholders)
  const handlePrevStakeholder = () => {
    if (!activeStakeholders.length) return;
    setIsStakeholderPlaying(false);
    setStakeholderIdx((prev) => (prev - 1 + activeStakeholders.length) % activeStakeholders.length);
  };

  const handleNextStakeholder = () => {
    if (!activeStakeholders.length) return;
    setIsStakeholderPlaying(false);
    setStakeholderIdx((prev) => (prev + 1) % activeStakeholders.length);
  };

  const handleShare = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const url = selectedCompanyForSpace 
      ? `${window.location.origin}?company=${selectedCompanyForSpace.id}&speaker=${currentStakeholder.id}`
      : `${window.location.origin}?company=${currentCompany.id}`;
    navigator.clipboard?.writeText(url);
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
        if (selectedCompanyForSpace) {
          handlePrevStakeholder();
        } else {
          handlePrev();
        }
      } else if (diff < -45) {
        if (selectedCompanyForSpace) {
          handleNextStakeholder();
        } else {
          handleNext();
        }
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
      className="w-full max-w-3xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3.5 pb-18 sm:pb-20 pt-safe pb-safe h-[calc(100dvh-56px)] max-h-[calc(100dvh-56px)] overflow-hidden flex flex-col justify-between text-[#1C1917] select-none"
    >
      
      {/* =========================================================== */}
      {/* EN-TÊTE : Titre standardisé ou Barre retour Espace Société   */}
      {/* =========================================================== */}
      {selectedCompanyForSpace ? (
        <div className="flex items-center justify-between h-8 sm:h-9 shrink-0 gap-2 mb-2 sm:mb-2.5">
          <button
            onClick={() => {
              setSelectedCompanyForSpace(null);
              setIsStakeholderPlaying(false);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 hover:bg-[#A2482B] text-stone-700 hover:text-white border border-stone-200 transition-all text-xs font-semibold cursor-pointer shadow-xs group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Entreprises</span>
          </button>

          <div className="relative flex items-center h-full shrink-0">
            <h2 className="font-editorial text-sm sm:text-base font-bold text-[#1C1917] tracking-wider">
              {selectedCompanyForSpace.companyName}
            </h2>
            <div className="absolute left-0 -bottom-2 w-8 h-0.5 bg-[#A2482B] rounded-full" />
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between h-8 sm:h-9 shrink-0 gap-2 mb-2 sm:mb-2.5">
          <div className="relative flex items-center h-full shrink-0">
            <h1 className="font-editorial text-base sm:text-[18px] font-bold text-[#1C1917] tracking-tight leading-none">
              Entreprises
            </h1>
            <div className="absolute left-0 -bottom-2 w-8 h-0.5 bg-[#A2482B] rounded-full" />
          </div>
        </div>
      )}

      {/* =========================================================== */}
      {/* ZONE CENTRALE : CARTE VIDÉO 9:16                            */}
      {/* =========================================================== */}
      <div className="relative w-full flex-1 flex items-center justify-center min-h-0 my-auto">
        
        {/* ========================================================= */}
        {/* CAS 1 : VUE GLOBALE DES ENTREPRISES (NIVEAU 1)            */}
        {/* ========================================================= */}
        {!selectedCompanyForSpace && (
          <>
            {/* Flèche gauche */}
            <button
              onClick={handlePrev}
              className="absolute left-1 sm:left-3 md:left-6 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white text-stone-800 hover:bg-[#A2482B] hover:text-white border border-stone-200 shadow-md flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
              title="Entreprise précédente"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* CARTE VIDÉO ENTREPRISE 9:16 */}
            <div 
              onClick={() => {
                setIsPlaying(!isPlaying);
              }}
              className="h-[min(490px,calc(100dvh-210px))] sm:h-[min(540px,calc(100dvh-190px))] lg:h-[min(570px,calc(100dvh-180px))] aspect-[9/16] w-auto mx-auto rounded-3xl overflow-hidden bg-stone-950 text-white shadow-2xl border border-stone-200/40 relative flex flex-col justify-between p-4 sm:p-5 cursor-pointer group select-none"
            >
              {/* Media de fond : Vidéo ou Image */}
              {isPlaying ? (
                <video
                  ref={videoRef}
                  src={currentCompany.videoUrl}
                  autoPlay
                  loop
                  playsInline
                  muted={isMuted}
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                />
              ) : (
                <img
                  src={currentCompany.photoUrl}
                  alt={currentCompany.companyName}
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none group-hover:scale-103 transition-transform duration-500 ease-out"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/45 pointer-events-none" />

              {/* =========================================================== */}
              {/* HAUT DE CARTE : DOMAINE EN TITRE & LECTEUR EN HAUT À DROITE */}
              {/* Le déclencheur vidéo est TOUJOURS présent en haut à droite  */}
              {/* =========================================================== */}
              <div className="absolute top-3.5 left-3.5 sm:top-4 sm:left-4 z-20 max-w-[calc(100%-60px)] pointer-events-auto">
                <span className="px-3.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[11px] sm:text-xs font-bold text-white tracking-wider uppercase drop-shadow-sm truncate block">
                  {currentCompany.category}
                </span>
              </div>

              {/* Déclencheur vidéo standardisé, permanent et inamovible en haut à droite (format carré arrondi) */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPlaying(prev => !prev);
                }}
                className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-30 w-8.5 h-8.5 sm:w-9.5 sm:h-9.5 rounded-lg sm:rounded-xl bg-black/45 hover:bg-[#A2482B] backdrop-blur-md border border-white/20 hover:border-[#A2482B] flex items-center justify-center text-white transition-all duration-200 shadow-md cursor-pointer hover:scale-105 active:scale-95 shrink-0 pointer-events-auto"
                title={isPlaying ? "Mettre en pause" : `Regarder la vidéo de ${currentCompany.companyName}`}
              >
                {isPlaying ? (
                  <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white text-white" />
                ) : (
                  <ProfileSoloIcon className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-white rotate-180 transition-transform" strokeWidth={1.6} />
                )}
              </button>

              {/* =========================================================== */}
              {/* FLANC DROIT : SEULEMENT 2 BOUTONS (Explorer & Partager)     */}
              {/* =========================================================== */}
              <div 
                onClick={(e) => e.stopPropagation()}
                className="absolute right-3 sm:right-3.5 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3 pointer-events-auto"
              >
                {/* 1. Explorer l'espace de la société */}
                <button
                  onClick={() => {
                    setSelectedCompanyForSpace(currentCompany);
                    setStakeholderIdx(0);
                    setIsStakeholderPlaying(false);
                  }}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-black/45 hover:bg-[#A2482B] border border-white/20 hover:border-[#A2482B] text-white flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
                  title={`Explorer l'espace et les témoignages de ${currentCompany.companyName}`}
                >
                  <Compass className="w-4 h-4 text-white" />
                </button>

                {/* 2. Partager cette entreprise */}
                <button
                  onClick={handleShare}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl border flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95 ${
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
              {/* BAS DE LA CARTE : JUSTE LE NOM DE L'ENTREPRISE              */}
              {/* et icône muet en bas à droite                               */}
              {/* =========================================================== */}
              <div className="relative z-10 pt-2 mt-auto flex items-end justify-between gap-2 pointer-events-auto">
                <h4 className="font-editorial text-[15px] sm:text-base font-bold text-white drop-shadow-md tracking-wider">
                  {currentCompany.companyName}
                </h4>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMuted(prev => !prev);
                  }}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/50 hover:bg-[#A2482B] backdrop-blur-md border border-white/20 hover:border-[#A2482B] text-white flex items-center justify-center cursor-pointer transition-all shadow-md hover:scale-105 active:scale-95 shrink-0"
                  title={isMuted ? "Activer le son" : "Couper le son"}
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5 text-white" /> : <Volume2 className="w-3.5 h-3.5 text-white" />}
                </button>
              </div>
            </div>

            {/* Flèche droite */}
            <button
              onClick={handleNext}
              className="absolute right-1 sm:right-3 md:right-6 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white text-stone-800 hover:bg-[#A2482B] hover:text-white border border-stone-200 shadow-md flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
              title="Entreprise suivante"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </>
        )}

        {/* ========================================================= */}
        {/* CAS 2 : ESPACE DÉDIÉ DE L'ENTREPRISE (NIVEAU 2)           */}
        {/* ========================================================= */}
        {selectedCompanyForSpace && currentStakeholder && (
          <>
            {/* Flèche gauche pour défiler les voix de l'entreprise */}
            <button
              onClick={handlePrevStakeholder}
              className="absolute left-1 sm:left-3 md:left-6 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white text-stone-800 hover:bg-[#A2482B] hover:text-white border border-stone-200 shadow-md flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
              title="Témoignage précédent"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* CARTE VIDÉO DU TÉMOIN 9:16 */}
            <div 
              onClick={() => {
                setIsStakeholderPlaying(!isStakeholderPlaying);
              }}
              className="h-[min(490px,calc(100dvh-210px))] sm:h-[min(540px,calc(100dvh-190px))] lg:h-[min(570px,calc(100dvh-180px))] aspect-[9/16] w-auto mx-auto rounded-3xl overflow-hidden bg-stone-950 text-white shadow-2xl border border-stone-200/40 relative flex flex-col justify-between p-4 sm:p-5 cursor-pointer group select-none"
            >
              {/* Média de fond : Vidéo ou Photo */}
              {isStakeholderPlaying ? (
                <video
                  ref={stakeholderVideoRef}
                  src={currentStakeholder.videoUrl}
                  autoPlay
                  loop
                  playsInline
                  muted={isStakeholderMuted}
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                />
              ) : (
                <img
                  src={currentStakeholder.photoUrl}
                  alt={currentStakeholder.name}
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none group-hover:scale-103 transition-transform duration-500 ease-out"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/65 pointer-events-none" />

              {/* =========================================================== */}
              {/* HAUT DE CARTE : LE TITRE EST LE NOM DE L'ENTREPRISE         */}
              {/* L'ICÔNE VIDÉO EST TOUJOURS PRÉSENTE EN HAUT À DROITE        */}
              {/* =========================================================== */}
              <div className="absolute top-3.5 left-3.5 sm:top-4 sm:left-4 z-20 max-w-[calc(100%-60px)] pointer-events-auto">
                <span className="px-3.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[11px] sm:text-xs font-bold text-white tracking-wider uppercase drop-shadow-sm truncate block">
                  {selectedCompanyForSpace.companyName}
                </span>
              </div>

              {/* Déclencheur lecteur vidéo en haut à droite (format carré arrondi) */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsStakeholderPlaying(prev => !prev);
                }}
                className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-30 w-8.5 h-8.5 sm:w-9.5 sm:h-9.5 rounded-lg sm:rounded-xl bg-black/45 hover:bg-[#A2482B] backdrop-blur-md border border-white/20 hover:border-[#A2482B] flex items-center justify-center text-white transition-all duration-200 shadow-md cursor-pointer hover:scale-105 active:scale-95 shrink-0 pointer-events-auto"
                title={isStakeholderPlaying ? "Mettre en pause" : `Regarder la vidéo de ${currentStakeholder.name}`}
              >
                {isStakeholderPlaying ? (
                  <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white text-white" />
                ) : (
                  <ProfileSoloIcon className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-white rotate-180 transition-transform" strokeWidth={1.6} />
                )}
              </button>

              {/* =========================================================== */}
              {/* FLANC DROIT : MÊME CONFIGURATION QUE PROTAGONISTES HÉRITAGE */}
              {/* 1. Résonance, 2. Question, 3. Partager                     */}
              {/* =========================================================== */}
              <div 
                onClick={(e) => e.stopPropagation()}
                className="absolute right-3 sm:right-3.5 top-[60%] -translate-y-1/2 z-20 flex flex-col items-center gap-2.5 sm:gap-3 pointer-events-auto"
              >
                {/* 1. Évaluation résonance */}
                <button
                  id={`stakeholder-btn-resonance-${currentStakeholder.id}`}
                  onClick={() => setResonanceTargetStakeholder(currentStakeholder)}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl backdrop-blur-md border flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer hover:scale-105 active:scale-95 ${
                    stakeholderResonances[currentStakeholder.id] !== undefined
                      ? 'bg-[#A2482B] border-[#A2482B] text-white shadow-[0_0_14px_rgba(162,72,43,0.5)]'
                      : 'bg-black/45 hover:bg-[#A2482B] border-white/20 hover:border-[#A2482B] text-white'
                  }`}
                  title={stakeholderResonances[currentStakeholder.id] !== undefined ? `Résonance : ${stakeholderResonances[currentStakeholder.id]}%` : "Évaluer la résonance"}
                >
                  <Award className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </button>

                {/* 2. Question existentielle */}
                <button
                  id={`stakeholder-btn-question-${currentStakeholder.id}`}
                  onClick={() => setQuestionModalStakeholder(currentStakeholder)}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-black/45 hover:bg-[#A2482B] backdrop-blur-md border border-white/20 hover:border-[#A2482B] text-white flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer hover:scale-105 active:scale-95"
                  title="Découvrir la question"
                >
                  <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </button>

                {/* 3. Bouton Partager */}
                <button
                  onClick={handleShare}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl border flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95 ${
                    copied
                      ? 'bg-emerald-700/85 border-emerald-600 text-white'
                      : 'bg-black/45 hover:bg-[#A2482B] border-white/20 text-white'
                  }`}
                  title="Partager ce témoignage"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-white" />
                  ) : (
                    <ShareIcon className="w-4 h-4 text-white" />
                  )}
                </button>
              </div>

              {/* =========================================================== */}
              {/* BAS : PRÉNOM DE LA PERSONNE & STATUT SIMPLE (Fondateur...)  */}
              {/* SYMBOLE MUTE EN BAS À DROITE                                */}
              {/* =========================================================== */}
              <div className="relative z-10 pt-2 mt-auto flex items-end justify-between gap-2 pointer-events-auto">
                <div className="space-y-0.5">
                  <h3 className="font-editorial text-[15px] sm:text-base font-bold text-white tracking-wider leading-snug drop-shadow-md">
                    {currentStakeholder.name.split(' ')[0]}
                  </h3>
                  <p className="text-xs text-stone-200 font-medium tracking-wide drop-shadow-sm">
                    {currentStakeholder.roleCategory}
                  </p>
                </div>

                {/* Symbole Muet / Son baissé en bas à droite */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsStakeholderMuted(prev => !prev);
                  }}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/50 hover:bg-[#A2482B] backdrop-blur-md border border-white/20 hover:border-[#A2482B] text-white flex items-center justify-center cursor-pointer transition-all shadow-md hover:scale-105 active:scale-95 shrink-0"
                  title={isStakeholderMuted ? 'Activer le son' : 'Couper le son'}
                >
                  {isStakeholderMuted ? <VolumeX className="w-3.5 h-3.5 text-white" /> : <Volume2 className="w-3.5 h-3.5 text-white" />}
                </button>
              </div>
            </div>

            {/* Flèche droite pour défiler les voix de l'entreprise */}
            <button
              onClick={handleNextStakeholder}
              className="absolute right-1 sm:right-3 md:right-6 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white text-stone-800 hover:bg-[#A2482B] hover:text-white border border-stone-200 shadow-md flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
              title="Témoignage suivant"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </>
        )}

      </div>

      {/* =========================================================== */}
      {/* BAS DE PAGE : INDICATEUR DE POSITION (PAGINATION)           */}
      {/* =========================================================== */}
      <div className="flex items-center justify-center gap-1.5 h-6 shrink-0 mt-1">
        {selectedCompanyForSpace ? (
          activeStakeholders.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => {
                setIsStakeholderPlaying(false);
                setStakeholderIdx(idx);
              }}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                idx === stakeholderIdx ? 'w-6 bg-[#A2482B]' : 'w-1.5 bg-stone-300 hover:bg-stone-400'
              }`}
              title={`${s.name} (${s.roleCategory})`}
            />
          ))
        ) : (
          COMPANIES_DATA.map((c, idx) => (
            <button
              key={c.id}
              onClick={() => {
                setIsPlaying(false);
                setCurrentIdx(idx);
              }}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                idx === currentIdx ? 'w-6 bg-[#A2482B]' : 'w-1.5 bg-stone-300 hover:bg-stone-400'
              }`}
              title={`${c.companyName} (${c.category})`}
            />
          ))
        )}
      </div>

      {/* Modale d'évaluation de la résonance pour les voix de l'entreprise */}
      {resonanceTargetStakeholder && (
        <ResonanceModal
          isOpen={Boolean(resonanceTargetStakeholder)}
          onClose={() => setResonanceTargetStakeholder(null)}
          storyId={`company-${selectedCompanyForSpace?.id || 'co'}-${resonanceTargetStakeholder.id}`}
          topicId={`Entreprise · ${selectedCompanyForSpace?.companyName}`}
          personName={resonanceTargetStakeholder.name.split(' ')[0]}
          initialPercentage={stakeholderResonances[resonanceTargetStakeholder.id]}
          onRatingSubmitted={(pct) => {
            setStakeholderResonances(prev => ({ ...prev, [resonanceTargetStakeholder.id]: pct }));
          }}
        />
      )}

      {/* Modale Question existentielle pour les voix de l'entreprise */}
      {questionModalStakeholder && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setQuestionModalStakeholder(null)}
        >
          <div 
            className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-stone-200 text-center animate-in zoom-in-95 duration-200 pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setQuestionModalStakeholder(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-full bg-[#C89B3C]/15 text-[#C89B3C] flex items-center justify-center mx-auto mb-4 border border-[#C89B3C]/30">
              <BookOpen className="w-6 h-6" />
            </div>

            <h3 className="font-editorial text-base sm:text-lg font-bold text-[#1C1917] mb-1">
              {questionModalStakeholder.name.split(' ')[0]}
            </h3>
            <p className="text-xs text-stone-500 font-semibold mb-3">
              {questionModalStakeholder.roleCategory} · {selectedCompanyForSpace?.companyName}
            </p>

            <p className="font-serif-editorial text-base sm:text-lg text-stone-800 leading-relaxed italic px-2">
              « {questionModalStakeholder.question || "Quelle vision singulière ce parcours apporte-t-il au monde ?"} »
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
