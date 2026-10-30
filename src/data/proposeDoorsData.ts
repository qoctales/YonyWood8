import React from 'react';
import { DimensionIcon } from '../components/DimensionIcon';
import { DIMENSIONS, getSubcategoriesForDimension } from './dimensionsData';

export interface ProposeSubject {
  id: string;
  title: string;
  subtitle: string;
  question?: string;
  synopsis?: string;
  videoUrl: string;
  posterUrl: string;
  actionLabel: string;
  doorId?: string;
  iconName?: string;
  covers?: string[];
  accentColor?: string;
  glowColor?: string;
  bgGradient?: string;
  badge?: string;
}

export interface ProposeDoor {
  id: string;
  label: string;
  icon: React.FC<{ className?: string }>;
  tagline: string;
  videoUrl: string;
  posterUrl: string;
  advantages: string[];
  actionDoorLabel: string;
  subjects: ProposeSubject[];
}

const STOCK_VIDEOS = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'
];

// Les 8 séries documentaires fondatrices
const SERIES_SUBJECTS: ProposeSubject[] = [
  {
    id: 'jesus-legba',
    title: 'Vodun Rays ‹ › Autre Foi',
    subtitle: 'Gardiens des traditions ancestrales face aux fidèles de foi révélée.',
    synopsis: 'Mise en miroir des spiritualités chrétienne et vodun face aux tourments du destin. Deux protagonistes explorent la transcendance, le pardon et la foi face au mystère.',
    question: 'Comment votre foi ou votre rapport au sacré vous aide-t-il à traverser le deuil ou l’épreuve ?',
    videoUrl: STOCK_VIDEOS[0],
    posterUrl: '/assets/posters/vodun-autre-foi.png',
    actionLabel: 'Choisir cette série',
    doorId: 'series',
    iconName: '16-series/jesus-legba',
    accentColor: '#D97706',
    glowColor: 'rgba(217, 119, 6, 0.65)',
    bgGradient: 'from-amber-600 via-orange-700 to-stone-900'
  },
  {
    id: 'roots-routes',
    title: 'Roots ‹ › Routes',
    subtitle: 'Ancrés sur la terre natale face aux voyageurs de la diaspora.',
    synopsis: 'La confrontation sensible entre l’enracinement profond dans la mémoire des terroirs et l’élan d’aller à la rencontre du vaste monde et d’en revenir.',
    question: 'L’ancrage dans ses racines ou l’envol sur les routes : où se forge votre véritable identité ?',
    videoUrl: STOCK_VIDEOS[2],
    posterUrl: '/assets/posters/roots-routes.jpg',
    actionLabel: 'Choisir cette série',
    doorId: 'series',
    iconName: '16-series/roots-routes',
    accentColor: '#0284C7',
    glowColor: 'rgba(2, 132, 199, 0.65)',
    bgGradient: 'from-sky-600 via-blue-800 to-stone-900'
  },
  {
    id: 'coaching-phd',
    title: 'Coaching ‹ › PhD',
    subtitle: 'Coachs, mentors & gens d’action face aux chercheurs, docteurs & universitaires.',
    synopsis: 'L’action immédiate et le pragmatisme des mentors confrontés à la patience méthodologique et à la profondeur des thèses académiques.',
    question: 'L’instinct pratique du terrain ou la rigueur de la thèse : comment transformez-vous le monde ?',
    videoUrl: STOCK_VIDEOS[3],
    posterUrl: '/assets/posters/coaching-phd.png',
    actionLabel: 'Choisir cette série',
    doorId: 'series',
    iconName: '16-series/builders-seekers',
    accentColor: '#F59E0B',
    glowColor: 'rgba(245, 158, 11, 0.65)',
    bgGradient: 'from-amber-500 via-yellow-700 to-stone-900'
  },
  {
    id: 'fiat-luxe-builders',
    title: 'Fiat Luxe ‹ › Builders',
    subtitle: 'Artisans d’art, joailliers & esthètes du détail face aux architectes & bâtisseurs.',
    synopsis: 'La précision millimétrée de la haute joaillerie face à la puissance bâtisseuse des architectes érigeant les fondations durables de demain.',
    question: 'L’orfèvrerie du millimètre ou la force des fondations : que construisez-vous qui résiste au temps ?',
    videoUrl: STOCK_VIDEOS[1],
    posterUrl: '/assets/posters/fiat-luxe-builders.png',
    actionLabel: 'Choisir cette série',
    doorId: 'series',
    iconName: '16-series/dixeat-fiat-luxe',
    accentColor: '#EAB308',
    glowColor: 'rgba(234, 179, 8, 0.65)',
    bgGradient: 'from-yellow-600 via-amber-700 to-stone-900'
  },
  {
    id: 'blacks-one-amazones',
    title: 'Blacks One ‹ › Amazones',
    subtitle: 'Mémoire & souveraineté masculine noire face à la puissance & au courage des femmes.',
    synopsis: 'Entre éloquence civique et bravoure des Amazones, deux voix d’une rare élégance s’unissent pour affirmer nos souverainetés et notre dignité.',
    question: 'Comment affirmez-vous votre dignité et votre souveraineté intime face aux tempêtes de l’Histoire ?',
    videoUrl: STOCK_VIDEOS[0],
    posterUrl: '/assets/posters/blacks-one-amazones.png',
    actionLabel: 'Choisir cette série',
    doorId: 'series',
    iconName: '16-series/blacks-one-beyond-eve',
    accentColor: '#EC4899',
    glowColor: 'rgba(236, 72, 153, 0.65)',
    bgGradient: 'from-pink-600 via-rose-700 to-stone-900'
  },
  {
    id: 'benin-monde',
    title: 'Bénin ‹ › Le Monde',
    subtitle: 'Défenseurs du terroir et de la culture béninoise face aux cultures du monde.',
    synopsis: 'Des cités lacustres de Ganvié aux terrasses sacrées des Andes péruviennes. Le dialogue sensible entre gardiens des mémoires vivantes et terroirs ancestraux.',
    question: 'Quel est votre lien intime avec la terre ou l’eau qui nourrit votre communauté ?',
    videoUrl: STOCK_VIDEOS[1],
    posterUrl: '/assets/posters/benin-monde.jpg',
    actionLabel: 'Choisir cette série',
    doorId: 'series',
    iconName: '16-series/finagnon-qosqorico',
    accentColor: '#10B981',
    glowColor: 'rgba(16, 185, 129, 0.65)',
    bgGradient: 'from-emerald-600 via-teal-700 to-stone-900'
  },
  {
    id: 'baobab-bambou',
    title: 'Baobab ‹ › Bambou',
    subtitle: 'Mémoire & enracinement des aînés face à l’agilité & l’audace de la jeunesse.',
    synopsis: 'Quand la patience séculaire des aînés transmet son souffle à la vivacité et à l’inventivité des jeunes pousses pour affronter l’avenir.',
    question: 'La solidité des racines centenaires ou la souplesse du vent nouveau : quelle sagesse guide vos pas ?',
    videoUrl: STOCK_VIDEOS[2],
    posterUrl: '/assets/posters/baobab-bambou.jpg',
    actionLabel: 'Choisir cette série',
    doorId: 'series',
    iconName: '16-series/other-eyes-sixth-sense',
    accentColor: '#84CC16',
    glowColor: 'rgba(132, 204, 22, 0.65)',
    bgGradient: 'from-lime-600 via-green-700 to-stone-900'
  },
  {
    id: 'pictures-words',
    title: 'Pictures ‹ › Words',
    subtitle: 'Créateurs du regard visuel face aux maîtres du verbe, de l’écriture et du slam.',
    synopsis: 'Une traversée poétique entre l’instinct visuel d’une photographe traquant la vérité et le slam vibrant d’un poète éveillant les consciences.',
    question: 'L’image qui fige l’instant ou le mot qui réveille la conscience : comment racontez-vous la vérité ?',
    videoUrl: STOCK_VIDEOS[3],
    posterUrl: '/assets/posters/pictures-words.jpg',
    actionLabel: 'Choisir cette série',
    doorId: 'series',
    iconName: '16-series/focus-phd',
    accentColor: '#A855F7',
    glowColor: 'rgba(168, 85, 247, 0.65)',
    bgGradient: 'from-purple-600 via-violet-700 to-stone-900'
  }
];

// Helper pour créer l'icône dynamique d'une porte
function createDoorIcon(iconeName: string): React.FC<{ className?: string }> {
  const IconComponent: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => 
    React.createElement(DimensionIcon, {
      name: iconeName,
      className,
      size: 18,
      strokeWidth: 1.8
    });
  IconComponent.displayName = `DoorIcon_${iconeName}`;
  return IconComponent;
}

// Construction des 16 portes officielles
export const PROPOSE_DOORS: ProposeDoor[] = DIMENSIONS.map((dim, idx) => {
  if (dim.id === 'series') {
    return {
      id: 'series',
      label: 'Séries',
      icon: createDoorIcon('16-series/_dimension'),
      tagline: 'Racontez votre histoire face à un alter ego d’un autre continent.',
      videoUrl: STOCK_VIDEOS[0],
      posterUrl: '/assets/doors/door-series.jpg',
      actionDoorLabel: 'Choisir cette porte',
      advantages: [
        'Dialogue face-à-face avec un alter ego d’un autre continent.',
        'Raconter votre histoire intime face aux grandes épreuves humaines.',
        'Mise en miroir de traditions et de spiritualités d’égal à égal.',
        'Réalisation cinématographique 9:16 soignée par Yonywood.',
        'Diffusion pérenne au cœur des séries fondatrices de la plateforme.'
      ],
      subjects: SERIES_SUBJECTS
    };
  }

  const subcats = getSubcategoriesForDimension(dim.id);
  const subjects: ProposeSubject[] = subcats.map((sc, sIdx) => ({
    id: sc.slug,
    title: sc.label,
    subtitle: sc.tagline || `${dim.label} · ${sc.label}`,
    synopsis: sc.description || `Témoignage face caméra explorant la dimension ${dim.label} à travers le prisme de ${sc.label}.`,
    question: sc.question || `Quelle histoire singulière souhaitez-vous partager sur le thème de « ${sc.label} » ?`,
    videoUrl: STOCK_VIDEOS[sIdx % STOCK_VIDEOS.length],
    posterUrl: sc.photoUrl || dim.coverImage,
    actionLabel: `Choisir ce sujet`,
    doorId: dim.id,
    iconName: sc.icone,
    accentColor: sc.accentColor || dim.accentColor,
    glowColor: sc.glowColor || dim.glowColor,
    bgGradient: sc.bgGradient || dim.bgGradient,
    badge: sc.badge
  }));

  return {
    id: dim.id,
    label: dim.label,
    icon: createDoorIcon(dim.icone),
    tagline: dim.tagline,
    videoUrl: STOCK_VIDEOS[idx % STOCK_VIDEOS.length],
    posterUrl: dim.coverImage,
    actionDoorLabel: 'Choisir cette porte',
    advantages: [
      `Diffusion officielle dans la dimension « ${dim.label} » de l'astrolabe.`,
      `Récit court 9:16 face caméra centré sur la transmission et la vérité du vécu.`,
      `Valorisation pérenne de votre mémoire et de votre expérience vécue.`,
      `Référencement parmi les témoins clés cooptés par la communauté.`,
      `Accompagnement par les cinéastes de la communauté Yonywood.`
    ],
    subjects
  };
});

export function getDoorById(id: string): ProposeDoor | undefined {
  return PROPOSE_DOORS.find(d => d.id === id);
}

export function getSubjectByDoorAndId(doorId: string, subjectId: string): ProposeSubject | undefined {
  const door = getDoorById(doorId);
  if (!door) return undefined;
  return door.subjects.find(s => s.id === subjectId);
}
