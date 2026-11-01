export interface ThematicStory {
  id: string;
  themeId: string;
  themeLabel: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  authorTerritory: string;
  question: string;
  videoUrl: string;
  durationSeconds: number; // Max 64 secondes
  createdAt: string;
}

export interface ThematicValue {
  id: string;
  label: string;
  tagline: string;
  question: string;
  stories: ThematicStory[];
}

export const THEMATIC_VALUES: ThematicValue[] = [
  {
    id: 'resilience',
    label: 'Résilience',
    tagline: 'Ce qui ne plie jamais sous la tempête',
    question: 'Quel revers a révélé votre plus grande force intérieure ?',
    stories: [
      {
        id: 'story-res-1',
        themeId: 'resilience',
        themeLabel: 'Résilience',
        authorId: 'p-codjo',
        authorName: 'Pascal Cossy',
        authorRole: 'Prêtre Fâ & Guide',
        authorAvatar: '/assets/duos/codjo-blind.jpg',
        authorTerritory: 'Abomey, Bénin',
        question: 'Comment la perte de la vue est devenue mon regard le plus clair.',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        durationSeconds: 58,
        createdAt: 'Il y a 2h'
      },
      {
        id: 'story-res-2',
        themeId: 'resilience',
        themeLabel: 'Résilience',
        authorId: 'p-sika',
        authorName: 'Sika Dossou',
        authorRole: 'Maître Tisserande',
        authorAvatar: '/assets/images/sika_tisserande_1792933605542.jpg',
        authorTerritory: 'Bohicon, Bénin',
        question: 'Quand mon atelier a brûlé, mes mains savaient encore.',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        durationSeconds: 62,
        createdAt: 'Il y a 5h'
      }
    ]
  },
  {
    id: 'courage',
    label: 'Courage',
    tagline: 'Avancer quand tout tremble',
    question: 'Quel est l’acte de courage le plus difficile que vous ayez posé ?',
    stories: [
      {
        id: 'story-cou-1',
        themeId: 'courage',
        themeLabel: 'Courage',
        authorId: 'p-malik',
        authorName: 'Malik Diop',
        authorRole: 'Orateur & Bâtisseur',
        authorAvatar: '/assets/duos/malik-diop.jpg',
        authorTerritory: 'Dakar & Paris',
        question: 'Dire non au contrat qui me demandait d’oublier d’où je venais.',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
        durationSeconds: 61,
        createdAt: 'Il y a 3h'
      }
    ]
  },
  {
    id: 'patience',
    label: 'Patience',
    tagline: 'L’arbre mûrit sans bruit',
    question: 'Qu’avez-vous attendu des années avant de voir éclore ?',
    stories: [
      {
        id: 'story-pat-1',
        themeId: 'patience',
        themeLabel: 'Patience',
        authorId: 'p-koffi-m',
        authorName: 'Koffi Mensah',
        authorRole: 'Maître Tisseur',
        authorAvatar: '/assets/images/koffi_portonovo_1792933660999.jpg',
        authorTerritory: 'Porto-Novo, Bénin',
        question: 'Le premier motif parfait a pris 7 ans d’échecs.',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        durationSeconds: 54,
        createdAt: 'Il y a 6h'
      }
    ]
  },
  {
    id: 'pardon',
    label: 'Pardon',
    tagline: 'Libérer son cœur pour marcher léger',
    question: 'Quel pardon a changé le cours de votre histoire ?',
    stories: [
      {
        id: 'story-par-1',
        themeId: 'pardon',
        themeLabel: 'Pardon',
        authorId: 'p-mahougnon',
        authorName: 'Mahougnon Zounon',
        authorRole: 'Gardien Vodun Rays',
        authorAvatar: '/assets/duos/mahougnon_esu_portrait_1791701582891.jpg',
        authorTerritory: 'Ouidah, Bénin',
        question: 'Pardonner à ceux qui ont méprisé notre mémoire.',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        durationSeconds: 63,
        createdAt: 'Il y a 4h'
      }
    ]
  },
  {
    id: 'gratitude',
    label: 'Gratitude',
    tagline: 'Reconnaître le don secret de la vie',
    question: 'Pour quelle bénédiction invisible rendez-vous grâce aujourd’hui ?',
    stories: [
      {
        id: 'story-gra-1',
        themeId: 'gratitude',
        themeLabel: 'Gratitude',
        authorId: 'p-tobi',
        authorName: 'Tobi Houndégla',
        authorRole: 'Pêcheur Toffinou',
        authorAvatar: '/assets/duos/tobi-houndegla.jpg',
        authorTerritory: 'Ganvié, Bénin',
        question: 'Chaque matin sur la lagune avant le réveil des pirogues.',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        durationSeconds: 52,
        createdAt: 'Il y a 1h'
      }
    ]
  },
  {
    id: 'humilite',
    label: 'Humilité',
    tagline: 'Savoir écouter ce qui nous dépasse',
    question: 'Quelle leçon d’un plus jeune ou d’un aîné vous a désarmé ?',
    stories: [
      {
        id: 'story-hum-1',
        themeId: 'humilite',
        themeLabel: 'Humilité',
        authorId: 'p-dieudonne',
        authorName: 'Dieudonné Dossou',
        authorRole: 'Prêtre & Théologien',
        authorAvatar: '/assets/duos/duo_pere_matthieu_1791655226601.jpg',
        authorTerritory: 'Cotonou, Bénin',
        question: 'Ce qu’un vieillard du village m’a appris sur la prière silencieuse.',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        durationSeconds: 59,
        createdAt: 'Il y a 7h'
      }
    ]
  },
  {
    id: 'transmission',
    label: 'Transmission',
    tagline: 'Le fil invisible des générations',
    question: 'Quelle parole ancestrale portez-vous comme un talisman ?',
    stories: [
      {
        id: 'story-tra-1',
        themeId: 'transmission',
        themeLabel: 'Transmission',
        authorId: 'p-sayri',
        authorName: 'Sayri Quispe',
        authorRole: 'Tisseur des Andes',
        authorAvatar: '/assets/duos/sayri-quispe.jpg',
        authorTerritory: 'Cuzco, Pérou',
        question: 'Le geste que ma grand-mère a transmis à mes doigts.',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
        durationSeconds: 64,
        createdAt: 'Il y a 8h'
      }
    ]
  },
  {
    id: 'verite',
    label: 'Vérité',
    tagline: 'Être soi sans artifice ni masque',
    question: 'Quel mensonge confortable avez-vous refusé de perpétuer ?',
    stories: [
      {
        id: 'story-ver-1',
        themeId: 'verite',
        themeLabel: 'Vérité',
        authorId: 'p-eleonore',
        authorName: 'Éléonore Vance',
        authorRole: 'Oratrice & Souveraineté',
        authorAvatar: '/assets/duos/eleonore-vance.jpg',
        authorTerritory: 'Lomé & Montréal',
        question: 'Assumer ma voix quand tout le monde attendait mon silence.',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        durationSeconds: 60,
        createdAt: 'Il y a 5h'
      }
    ]
  }
];
