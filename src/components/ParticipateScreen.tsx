import React, { useState, useEffect, useRef } from 'react';
import { ViewScreen } from '../types';

interface ParticipateScreenProps {
  onNavigate: (screen: ViewScreen) => void;
  initialRole?: string;
  preselectedSeriesId?: string;
}

export interface PosterSlide {
  id: number;
  bgTheme: 'deep_blue' | 'light_ivory' | 'terracotta' | 'emerald_night';
  title: string;
  subtitle: string;
  tagline: string;
  renderIllustration: () => React.ReactNode;
  renderDataViz: () => React.ReactNode;
  punchline: string;
}

const POSTER_SLIDES: PosterSlide[] = [
  // SLIDE 1 : LE MANIFESTE DU RÉSEAU VIVANT (Style Couverture PDF)
  {
    id: 1,
    bgTheme: 'deep_blue',
    title: 'YONYWOOD',
    subtitle: 'RÉSEAU DOCUMENTAIRE VIVANT',
    tagline: 'Des histoires qui nous relient',
    renderIllustration: () => (
      <div className="w-full flex items-center justify-center py-1">
        {/* Diaphragme optique / Iris en spirale multicolore stylisé */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28">
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {[
              { d: 'M50,12 A38,38 0 0,1 78,25 L50,50 Z', fill: '#0284C7' },
              { d: 'M78,25 A38,38 0 0,1 88,50 L50,50 Z', fill: '#38BDF8' },
              { d: 'M88,50 A38,38 0 0,1 78,75 L50,50 Z', fill: '#FDE047' },
              { d: 'M78,75 A38,38 0 0,1 50,88 L50,50 Z', fill: '#F59E0B' },
              { d: 'M50,88 A38,38 0 0,1 22,75 L50,50 Z', fill: '#EA580C' },
              { d: 'M22,75 A38,38 0 0,1 12,50 L50,50 Z', fill: '#DC2626' },
              { d: 'M12,50 A38,38 0 0,1 22,25 L50,50 Z', fill: '#B91C1C' },
              { d: 'M22,25 A38,38 0 0,1 50,12 L50,50 Z', fill: '#1E3A8A' }
            ].map((blade, idx) => (
              <path key={idx} d={blade.d} fill={blade.fill} opacity="0.95" />
            ))}
            <circle cx="50" cy="50" r="14" fill="#0A2558" />
          </svg>
        </div>
      </div>
    ),
    renderDataViz: () => (
      <div className="grid grid-cols-3 gap-1.5 w-full pt-1">
        <div className="bg-white/10 rounded-xl p-1.5 text-center border border-white/10">
          <span className="block text-sm sm:text-base font-extrabold text-[#FDE047] font-mono leading-none">1 024</span>
          <span className="text-[7.5px] sm:text-[8px] uppercase tracking-wider text-white/80 font-medium">Témoins</span>
        </div>
        <div className="bg-white/10 rounded-xl p-1.5 text-center border border-white/10">
          <span className="block text-sm sm:text-base font-extrabold text-white font-mono leading-none">8</span>
          <span className="text-[7.5px] sm:text-[8px] uppercase tracking-wider text-white/80 font-medium">Séries</span>
        </div>
        <div className="bg-white/10 rounded-xl p-1.5 text-center border border-white/10">
          <span className="block text-sm sm:text-base font-extrabold text-[#F97316] font-mono leading-none">256 s</span>
          <span className="text-[7.5px] sm:text-[8px] uppercase tracking-wider text-white/80 font-medium">Par récit</span>
        </div>
      </div>
    ),
    punchline: 'Deux univers. Une même question. Une seule forêt.'
  },

  // SLIDE 2 : LA PAROLE VRAIE (L'Orateur devant l'auditoire)
  {
    id: 2,
    bgTheme: 'light_ivory',
    title: 'LA PAROLE VRAIE',
    subtitle: 'L’ÉMOTION SANS FILTRE',
    tagline: 'Une personne raconte, tout un peuple écoute',
    renderIllustration: () => (
      <div className="w-full flex items-center justify-center py-1">
        <div className="relative w-24 h-24 sm:w-26 sm:h-26 flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Ondes de rayonnement de la parole */}
            <circle cx="50" cy="40" r="18" fill="none" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
            <circle cx="50" cy="40" r="28" fill="none" stroke="#EA580C" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.4" />
            <circle cx="50" cy="40" r="38" fill="none" stroke="#003399" strokeWidth="1.5" strokeDasharray="5 5" opacity="0.25" />
            {/* Silhouette orateur au centre */}
            <circle cx="50" cy="34" r="8" fill="#003399" />
            <path d="M42,52 Q50,44 58,52 L58,68 L42,68 Z" fill="#003399" />
            {/* Auditoire en arc de cercle réceptif */}
            {[20, 32, 68, 80].map((cx, i) => (
              <circle key={i} cx={cx} cy="78" r="5" fill="#EA580C" opacity="0.85" />
            ))}
          </svg>
        </div>
      </div>
    ),
    renderDataViz: () => (
      <div className="grid grid-cols-2 gap-1.5 w-full pt-1">
        <div className="bg-[#003399]/5 rounded-xl p-1.5 border border-[#003399]/15">
          <span className="text-[8px] font-mono font-bold text-[#EA580C] uppercase block">01 • RÉALISME</span>
          <span className="text-[9.5px] font-semibold text-stone-900 leading-tight block mt-0.5">Zéro artifice</span>
        </div>
        <div className="bg-[#003399]/5 rounded-xl p-1.5 border border-[#003399]/15">
          <span className="text-[8px] font-mono font-bold text-[#003399] uppercase block">02 • ÉCOUTE</span>
          <span className="text-[9.5px] font-semibold text-stone-900 leading-tight block mt-0.5">Temps de parole pur</span>
        </div>
        <div className="bg-[#003399]/5 rounded-xl p-1.5 border border-[#003399]/15">
          <span className="text-[8px] font-mono font-bold text-[#10B981] uppercase block">03 • RESPECT</span>
          <span className="text-[9.5px] font-semibold text-stone-900 leading-tight block mt-0.5">Chaque voix compte</span>
        </div>
        <div className="bg-[#003399]/5 rounded-xl p-1.5 border border-[#003399]/15">
          <span className="text-[8px] font-mono font-bold text-[#F59E0B] uppercase block">04 • ARCHIVE</span>
          <span className="text-[9.5px] font-semibold text-stone-900 leading-tight block mt-0.5">Mémoire vivante</span>
        </div>
      </div>
    ),
    punchline: 'Ce qui compte n’est pas le bruit, c’est la sincérité.'
  },

  // SLIDE 3 : LE TEMPO DE 256 SECONDES (Cadran Chiffre & Chrono)
  {
    id: 3,
    bgTheme: 'terracotta',
    title: '256 SECONDES',
    subtitle: 'LE TEMPO PARFAIT',
    tagline: '4 minutes et 16 secondes d’intensité',
    renderIllustration: () => (
      <div className="w-full flex items-center justify-center py-1">
        <div className="relative w-24 h-24 sm:w-26 sm:h-26 flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="4" />
            <circle 
              cx="50" cy="50" r="42" fill="none" stroke="#FDE047" strokeWidth="4"
              strokeDasharray="264" strokeDashoffset="44" strokeLinecap="round"
              transform="rotate(-90 50 50)"
            />
            <circle cx="50" cy="50" r="4" fill="#FFFFFF" />
            <line x1="50" y1="50" x2="68" y2="30" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
            <text x="50" y="66" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontFamily="monospace" fontWeight="bold">4M 16S</text>
          </svg>
        </div>
      </div>
    ),
    renderDataViz: () => (
      <div className="w-full bg-black/25 rounded-xl p-2 border border-white/15">
        <div className="flex items-center justify-between text-[8px] font-mono text-amber-200 mb-1">
          <span>0s • DÉPART</span>
          <span>128s • ÉPREUVE</span>
          <span>256s • TRANSMISSION</span>
        </div>
        <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden flex">
          <div className="bg-[#FDE047] w-1/3 h-full" />
          <div className="bg-[#F97316] w-1/3 h-full" />
          <div className="bg-[#10B981] w-1/3 h-full" />
        </div>
      </div>
    ),
    punchline: 'Ni zapping superficiel, ni longueur inutile : l’essentiel d’une vie.'
  },

  // SLIDE 4 : LE MIROIR (Face-à-Face inspiré de la page 12 du PDF)
  {
    id: 4,
    bgTheme: 'deep_blue',
    title: 'LE MIROIR',
    subtitle: 'TOUJOURS DEUX ŒUVRES FACE À FACE',
    tagline: 'Deux univers réunis par une même question',
    renderIllustration: () => (
      <div className="w-full flex items-center justify-between px-3 py-1">
        {/* Silhouette Rive A */}
        <div className="w-14 h-18 sm:w-16 sm:h-20 bg-[#EA580C] rounded-2xl flex flex-col items-center justify-center p-1 shadow-lg border border-white/20">
          <circle cx="8" cy="8" r="6" className="w-6 h-6 rounded-full bg-[#7C2D12] mx-auto mb-1" />
          <div className="w-8 h-6 bg-[#7C2D12] rounded-t-lg mx-auto" />
          <span className="text-[7.5px] font-bold text-white uppercase mt-1 tracking-wider">RIVE A</span>
        </div>

        {/* Badge central VS & Énigme */}
        <div className="flex flex-col items-center px-1">
          <span className="text-[10px] font-extrabold text-amber-300 font-mono">VS</span>
          <div className="w-10 h-10 rounded-full bg-white/10 border border-amber-300/40 flex items-center justify-center my-0.5">
            <span className="text-[8px] font-bold text-white text-center leading-none">1 QUESTION</span>
          </div>
        </div>

        {/* Silhouette Rive B */}
        <div className="w-14 h-18 sm:w-16 sm:h-20 bg-[#0284C7] rounded-2xl flex flex-col items-center justify-center p-1 shadow-lg border border-white/20">
          <circle cx="8" cy="8" r="6" className="w-6 h-6 rounded-full bg-[#0369A1] mx-auto mb-1" />
          <div className="w-8 h-6 bg-[#0369A1] rounded-t-lg mx-auto" />
          <span className="text-[7.5px] font-bold text-white uppercase mt-1 tracking-wider">RIVE B</span>
        </div>
      </div>
    ),
    renderDataViz: () => (
      <div className="w-full pt-1">
        {/* Curseur de résonance 50-50 inspiré du PDF */}
        <div className="flex items-center justify-between text-[8px] font-mono text-white/80 mb-1 px-1">
          <span className="text-[#F97316] font-bold">16 VOIX</span>
          <span className="text-amber-200">RÉSONANCE 50 · 50</span>
          <span className="text-[#38BDF8] font-bold">16 VOIX</span>
        </div>
        <div className="w-full h-2 rounded-full bg-white/15 relative flex items-center px-0.5">
          <div className="w-1/2 h-1 bg-[#EA580C] rounded-l-full" />
          <div className="w-1/2 h-1 bg-[#0284C7] rounded-r-full" />
          <div className="absolute left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-md border-2 border-amber-400" />
        </div>
      </div>
    ),
    punchline: 'Tout le monde regarde. Seul le récit rassemble.'
  },

  // SLIDE 5 : CASTING (Les 16 Arts & Territoires, comme page 5/7 du PDF)
  {
    id: 5,
    bgTheme: 'emerald_night',
    title: 'CASTING',
    subtitle: 'LA MÉMOIRE VIVE DES TERROIRS',
    tagline: '16 thématiques × 16 histoires citoyennes',
    renderIllustration: () => (
      <div className="w-full flex items-center justify-center py-1">
        {/* Grille 4x4 de pastilles colorées comme page 5 & 7 du PDF */}
        <div className="grid grid-cols-4 gap-1.5 p-1.5 bg-black/20 rounded-2xl border border-white/10">
          {[
            '#EF4444', '#F97316', '#F59E0B', '#10B981',
            '#06B6D4', '#3B82F6', '#6366F1', '#8B5CF6',
            '#EC4899', '#14B8A6', '#84CC16', '#EAB308',
            '#D97706', '#0284C7', '#A855F7', '#E11D48'
          ].map((color, i) => (
            <div key={i} className="w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-lg flex items-center justify-center" style={{ backgroundColor: color }}>
              <span className="text-[7.5px] font-bold text-white font-mono">{String(i + 1).padStart(2, '0')}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    renderDataViz: () => (
      <div className="grid grid-cols-2 gap-1.5 w-full pt-1">
        <div className="bg-white/10 rounded-xl p-1.5 border border-white/10">
          <span className="text-[8px] font-mono text-emerald-200 block">16 SUJETS</span>
          <span className="text-[10px] font-bold text-white block mt-0.5">Sagesses & Métiers</span>
        </div>
        <div className="bg-white/10 rounded-xl p-1.5 border border-white/10">
          <span className="text-[8px] font-mono text-emerald-200 block">256 RÉCITS</span>
          <span className="text-[10px] font-bold text-white block mt-0.5">Paroles de sages</span>
        </div>
      </div>
    ),
    punchline: 'L’encyclopédie orale du Bénin transmise aux générations futures.'
  },

  // SLIDE 6 : LUMIÈRE (L'Écosystème des Entreprises, Fondateur entouré)
  {
    id: 6,
    bgTheme: 'deep_blue',
    title: 'LUMIÈRE',
    subtitle: 'L’ORGANISATION INCARNÉE',
    tagline: '16 entreprises racontées par 16 regards',
    renderIllustration: () => (
      <div className="w-full flex items-center justify-center py-1">
        {/* Fondateur au centre entouré de ses collaborateurs rayonnants */}
        <div className="relative w-24 h-24 sm:w-26 sm:h-26 flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Lignes de reliance */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((ang, i) => {
              const rad = (ang * Math.PI) / 180;
              const x2 = 50 + 34 * Math.cos(rad);
              const y2 = 50 + 34 * Math.sin(rad);
              return (
                <g key={i}>
                  <line x1="50" y1="50" x2={x2} y2={y2} stroke="#FDE047" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
                  <circle cx={x2} cy={y2} r="5" fill="#38BDF8" />
                </g>
              );
            })}
            {/* Fondateur central doré */}
            <circle cx="50" cy="50" r="11" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="2" />
            <circle cx="50" cy="46" r="3.5" fill="#FFFFFF" />
            <path d="M44,56 Q50,51 56,56 Z" fill="#FFFFFF" />
          </svg>
        </div>
      </div>
    ),
    renderDataViz: () => (
      <div className="grid grid-cols-4 gap-1 w-full pt-1 text-center">
        <div className="bg-white/10 rounded-lg p-1 border border-white/10">
          <span className="text-[7.5px] font-bold text-amber-300 block">FONDATEUR</span>
          <span className="text-[8px] text-white">Vision</span>
        </div>
        <div className="bg-white/10 rounded-lg p-1 border border-white/10">
          <span className="text-[7.5px] font-bold text-sky-300 block">ARTISAN</span>
          <span className="text-[8px] text-white">Création</span>
        </div>
        <div className="bg-white/10 rounded-lg p-1 border border-white/10">
          <span className="text-[7.5px] font-bold text-emerald-300 block">APPRENTI</span>
          <span className="text-[8px] text-white">Relève</span>
        </div>
        <div className="bg-white/10 rounded-lg p-1 border border-white/10">
          <span className="text-[7.5px] font-bold text-rose-300 block">CLIENT</span>
          <span className="text-[8px] text-white">Impact</span>
        </div>
      </div>
    ),
    punchline: 'Loin du slogan : la vérité des femmes et des hommes au travail.'
  },

  // SLIDE 7 : PORTRAIT (Le Passeport en 4 Vidéos, Style 4 Cartes PDF)
  {
    id: 7,
    bgTheme: 'light_ivory',
    title: 'LE PORTRAIT',
    subtitle: 'LE PASSEPORT D’ACTION EN 4 VIDÉOS',
    tagline: 'Chaque personne dispose de sa vitrine souveraine',
    renderIllustration: () => (
      <div className="w-full flex items-center justify-center py-1">
        <div className="grid grid-cols-2 gap-1.5 w-full max-w-[210px]">
          <div className="bg-[#003399] text-white p-2 rounded-xl shadow-xs">
            <span className="text-[8px] font-mono font-bold text-[#FDE047] block">01</span>
            <span className="text-[9.5px] font-bold block leading-tight">Parcours</span>
            <span className="text-[7.5px] text-white/80 block">D’où je viens</span>
          </div>
          <div className="bg-[#EA580C] text-white p-2 rounded-xl shadow-xs">
            <span className="text-[8px] font-mono font-bold text-white block">02</span>
            <span className="text-[9.5px] font-bold block leading-tight">Produits</span>
            <span className="text-[7.5px] text-white/80 block">Ce que je vends</span>
          </div>
          <div className="bg-[#10B981] text-white p-2 rounded-xl shadow-xs">
            <span className="text-[8px] font-mono font-bold text-white block">03</span>
            <span className="text-[9.5px] font-bold block leading-tight">Projets</span>
            <span className="text-[7.5px] text-white/80 block">Ce que je bâtis</span>
          </div>
          <div className="bg-[#8B5CF6] text-white p-2 rounded-xl shadow-xs">
            <span className="text-[8px] font-mono font-bold text-white block">04</span>
            <span className="text-[9.5px] font-bold block leading-tight">Besoins</span>
            <span className="text-[7.5px] text-white/80 block">Mes partenaires</span>
          </div>
        </div>
      </div>
    ),
    renderDataViz: () => (
      <div className="w-full bg-[#003399]/5 rounded-xl p-2 border border-[#003399]/15 text-center">
        <span className="text-[8.5px] font-mono text-[#003399] font-bold uppercase tracking-wider block">CONTACT DIRECT & OPPORTUNITÉS</span>
        <span className="text-[10px] font-bold text-stone-900 block mt-0.5">Un clic pour joindre le créateur sur WhatsApp</span>
      </div>
    ),
    punchline: 'Ne me dis pas seulement qui tu es : montre-moi ce que tu construis.'
  },

  // SLIDE 8 : COPRODUCTION & AMBITION PLANÉTAIRE (Score & Parts, comme page 14/16 PDF)
  {
    id: 8,
    bgTheme: 'deep_blue',
    title: 'COPRODUCTION',
    subtitle: 'LE BÉNIN AU CŒUR DU MONDE',
    tagline: 'Devenir actionnaire direct des récits',
    renderIllustration: () => (
      <div className="w-full flex items-center justify-center py-1">
        {/* Globe et certificat de part citoyenne */}
        <div className="relative w-24 h-24 sm:w-26 sm:h-26 flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="38" fill="none" stroke="#FDE047" strokeWidth="1.5" />
            <path d="M16,50 Q50,20 84,50 Q50,80 16,50 Z" fill="none" stroke="#38BDF8" strokeWidth="1" opacity="0.6" />
            <path d="M50,12 Q30,50 50,88 Q70,50 50,12 Z" fill="none" stroke="#38BDF8" strokeWidth="1" opacity="0.6" />
            {/* Cœur Bénin rayonnant */}
            <circle cx="50" cy="50" r="8" fill="#EA580C" stroke="#FFFFFF" strokeWidth="1.5" />
            <text x="50" y="53" textAnchor="middle" fill="#FFFFFF" fontSize="6" fontFamily="sans-serif" fontWeight="bold">229</text>
          </svg>
        </div>
      </div>
    ),
    renderDataViz: () => (
      <div className="grid grid-cols-2 gap-1.5 w-full pt-1">
        <div className="bg-white/10 rounded-xl p-1.5 text-center border border-white/10">
          <span className="text-[7.5px] font-mono text-amber-300 uppercase block">1024 RÉUNIS</span>
          <span className="text-xs sm:text-sm font-extrabold text-white block">OUVERTURE</span>
          <span className="text-[7.5px] text-white/70 block">Des parts citoyennes</span>
        </div>
        <div className="bg-white/10 rounded-xl p-1.5 text-center border border-white/10">
          <span className="text-[7.5px] font-mono text-emerald-300 uppercase block">PAR SÉRIE</span>
          <span className="text-xs sm:text-sm font-extrabold text-[#FDE047] block">256 PARTS</span>
          <span className="text-[7.5px] text-white/70 block">50 € la part sociale</span>
        </div>
      </div>
    ),
    punchline: 'Le Bénin, initiateur d’un réseau documentaire pour la Terre.'
  }
];

export const ParticipateScreen: React.FC<ParticipateScreenProps> = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);

  const slide = POSTER_SLIDES[currentSlideIndex];

  const handlePrev = () => {
    setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : POSTER_SLIDES.length - 1));
  };

  const handleNext = () => {
    setCurrentSlideIndex((prev) => (prev < POSTER_SLIDES.length - 1 ? prev + 1 : 0));
  };

  // Keyboard navigation
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // Touch Swipe
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.targetTouches[0].clientX;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.targetTouches[0].clientX;
  };
  const onTouchEnd = () => {
    if (!touchStartXRef.current || !touchEndXRef.current) return;
    const diff = touchStartXRef.current - touchEndXRef.current;
    if (Math.abs(diff) > 35) {
      if (diff > 0) handleNext();
      else handlePrev();
    }
    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  // Clic moitié gauche pour reculer, moitié droite pour avancer
  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    if (clickX < rect.width * 0.4) {
      handlePrev();
    } else {
      handleNext();
    }
  };

  // Styles de fond harmonisés avec le PDF de référence
  const getThemeBg = () => {
    switch (slide.bgTheme) {
      case 'deep_blue':
        return 'bg-[#002B7A] text-white border-blue-900/60 shadow-[0_12px_40px_rgba(0,43,122,0.45)]';
      case 'light_ivory':
        return 'bg-[#FAFAF9] text-[#1C1917] border-stone-200/90 shadow-[0_12px_40px_rgba(0,0,0,0.12)]';
      case 'terracotta':
        return 'bg-[#9A3412] text-white border-amber-900/60 shadow-[0_12px_40px_rgba(154,52,18,0.45)]';
      case 'emerald_night':
        return 'bg-[#064E3B] text-white border-emerald-900/60 shadow-[0_12px_40px_rgba(6,78,59,0.45)]';
      default:
        return 'bg-[#002B7A] text-white';
    }
  };

  return (
    <div 
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className="w-full max-w-4xl mx-auto px-3 sm:px-6 py-2 pt-safe pb-safe h-full max-h-full overflow-hidden flex flex-col justify-center items-center text-[#1C1917] select-none"
    >
      {/* ========================================================================= */}
      {/* CARTE FORMAT VIDÉO CLASSIQUE STRICTE : EXACTEMENT COMME LES AUTRES PAGES  */}
      {/* ========================================================================= */}
      <div 
        onClick={handleCardClick}
        className={`aspect-[9/16] w-[min(calc(100vw-72px),calc((100dvh-240px)*9/16))] max-w-[218px] sm:max-w-[260px] md:max-w-[280px] h-[min(388px,calc(100dvh-240px))] sm:h-[min(460px,calc(100dvh-210px))] md:h-[min(500px,calc(100dvh-190px))] mx-auto rounded-2xl sm:rounded-3xl border relative flex flex-col justify-between p-3.5 sm:p-4.5 select-none shrink-0 transition-all duration-300 cursor-pointer ${getThemeBg()}`}
      >
        {/* ======================================================= */}
        {/* HAUT : 8 BARRES LUMINEUSES DISCRÈTES DE PROGRESSION     */}
        {/* ======================================================= */}
        <div className="w-full space-y-1.5 shrink-0">
          <div className="flex items-center gap-1 w-full">
            {POSTER_SLIDES.map((s, idx) => (
              <div 
                key={s.id} 
                className={`h-0.75 sm:h-1 flex-1 rounded-full transition-all duration-300 ${
                  idx === currentSlideIndex
                    ? slide.bgTheme === 'light_ivory' ? 'bg-[#003399]' : 'bg-white shadow-xs'
                    : idx < currentSlideIndex
                      ? slide.bgTheme === 'light_ivory' ? 'bg-[#003399]/40' : 'bg-white/50'
                      : slide.bgTheme === 'light_ivory' ? 'bg-stone-300/60' : 'bg-white/20'
                }`}
              />
            ))}
          </div>

          {/* En-tête de la fiche : Titre & Surtitre centrés (comme le PDF) */}
          <div className="text-center pt-0.5">
            <h1 className="font-editorial text-sm sm:text-base font-extrabold tracking-tight leading-none uppercase">
              {slide.title}
            </h1>
            <span className={`text-[7.5px] sm:text-[8px] font-mono uppercase tracking-widest font-semibold block mt-0.5 ${
              slide.bgTheme === 'light_ivory' ? 'text-[#003399]' : 'text-[#FDE047]'
            }`}>
              {slide.subtitle}
            </span>
            <div className={`w-6 h-0.5 mx-auto mt-1 rounded-full ${
              slide.bgTheme === 'light_ivory' ? 'bg-[#EA580C]' : 'bg-[#FDE047]'
            }`} />
          </div>
        </div>

        {/* ======================================================= */}
        {/* CENTRE : ILLUSTRATION DATA-VIZ & MODULES INFOGRAPHIQUES  */}
        {/* ======================================================= */}
        <div className="flex-1 flex flex-col justify-center items-center my-auto w-full min-h-0">
          {/* L'illustration visuelle */}
          {slide.renderIllustration()}

          {/* Les données chiffrées & blocs d'information */}
          {slide.renderDataViz()}
        </div>

        {/* ======================================================= */}
        {/* BAS : CITATION PUNCHLINE POÉTIQUE (Exactement comme PDF)*/}
        {/* ======================================================= */}
        <div className={`pt-1.5 border-t text-center shrink-0 ${
          slide.bgTheme === 'light_ivory' ? 'border-stone-200' : 'border-white/15'
        }`}>
          <p className={`text-[8.5px] sm:text-[9.5px] italic leading-tight font-editorial ${
            slide.bgTheme === 'light_ivory' ? 'text-stone-700' : 'text-white/90'
          }`}>
            « {slide.punchline} »
          </p>
        </div>
      </div>
    </div>
  );
};
