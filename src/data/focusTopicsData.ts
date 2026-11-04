/**
 * DONNÉES FICTIVES IDENTIFIÉES (« MOCK ») POUR L'EXPÉRIENCE FOCUS
 * Écran documentaire YonyWood : des personnes viennent raconter des histoires 
 * et anecdotes concrètes autour d'un sujet (une entreprise, une équipe, un artiste,
 * l'intelligence artificielle, etc.).
 */

export interface FocusSubtitle {
  start: number; // en secondes
  end: number;   // en secondes
  text: string;
}

export interface FocusSequence {
  id: string;
  topicId: string;
  number: number;
  title: string;
  speakerName: string;
  speakerRole: string; // Ex: « Co-fondateur & Architecte », « Danseuse & Chorégraphe »
  speakerAvatar: string;
  protagonistId?: string;
  videoUrl: string;
  duration: number; // ~176s = 2 min 56s
  durationFormatted: string; // « 2:56 »
  anecdoteSummary: string;
  subtitles?: FocusSubtitle[];
}

export type FocusCategory = 'Entreprise' | 'Association' | 'Personnalité' | 'Produit du terroir';

/** Longueur maximale recommandée pour les titres Focus afin d'éviter les coupures sur mobile */
export const FOCUS_MAX_TITLE_LENGTH = 20;

/** Formate et tronque proprement un titre si nécessaire */
export const clampFocusTitle = (title: string, maxLength = FOCUS_MAX_TITLE_LENGTH): string => {
  if (!title) return '';
  const trimmed = title.trim();
  if (trimmed.length <= maxLength) return trimmed;
  return `${trimmed.slice(0, maxLength - 1).trimEnd()}…`;
};

export interface FocusTopic {
  id: string;
  title: string;
  category: FocusCategory | string;
  posterUrl: string;
  tagline: string;
  description: string;
  sequences: FocusSequence[];
}

export const FOCUS_TOPICS: FocusTopic[] = [
  {
    id: 'topic-finagnon-tech',
    title: 'Finagnon Tech Hub',
    category: 'Entreprise',
    posterUrl: '/assets/posters/finagnon-qosqorico.jpg',
    tagline: 'L’essor du premier campus technologique lacustre et solaire.',
    description: 'De jeunes ingénieurs et chercheurs déploient des micro-réseaux et de l’intelligence connectée sur les eaux de Ganvié.',
    sequences: [
      {
        id: 'finagnon-seq-1',
        topicId: 'topic-finagnon-tech',
        number: 1,
        title: 'Le premier watt sur la lagune',
        speakerName: 'Adélaïde Kpadonou',
        speakerRole: 'Directrice R&D & Savoirs Traditionnels',
        speakerAvatar: '/assets/protagonists/adjovi-blandine.jpg',
        videoUrl: '/sample.mp4',
        duration: 176,
        durationFormatted: '2:56',
        anecdoteSummary: 'Le jour où notre premier accumulateur photovoltaïque a éclairé les ateliers de nuit sans bruit de générateur.',
        subtitles: [
          { start: 1, end: 5, text: '« Quand l’accumulateur s’est allumé, un silence total est tombé sur la lagune. »' },
          { start: 6, end: 11, text: '« Plus aucun vacarme de moteur à essence : seulement la lumière douce et le clapotis de l’eau. »' },
          { start: 12, end: 18, text: '« C’est là qu’on a su que la technologie pouvait respecter le rythme de nos ancêtres. »' }
        ]
      },
      {
        id: 'finagnon-seq-2',
        topicId: 'topic-finagnon-tech',
        number: 2,
        title: 'Le protocole hors-ligne',
        speakerName: 'Gatien Agossa',
        speakerRole: 'Architecte Systèmes Embarqués',
        speakerAvatar: '/assets/protagonists/kwame-mensah.jpg',
        videoUrl: '/sample.mp4',
        duration: 176,
        durationFormatted: '2:56',
        anecdoteSummary: 'Comment l’équipe a conçu un maillage radio mesh pour maintenir les alertes météo même sans fibre ni 4G.',
        subtitles: [
          { start: 1, end: 6, text: '« Le réseau s’était coupé pendant la grande crue d’octobre. »' },
          { start: 7, end: 13, text: '« Notre boucle mesh a relayé les signaux de pirogue en pirogue automatiquement. »' }
        ]
      },
      {
        id: 'finagnon-seq-3',
        topicId: 'topic-finagnon-tech',
        number: 3,
        title: 'La signature avec les coopératives',
        speakerName: 'Reine Dossou',
        speakerRole: 'Responsable Déploiement Terroir',
        speakerAvatar: '/assets/protagonists/fatou-diallo.jpg',
        videoUrl: '/sample.mp4',
        duration: 176,
        durationFormatted: '2:56',
        anecdoteSummary: 'Gagner la confiance des aînés maraîchers en plaçant les capteurs dans leurs propres jarres de conservation.',
        subtitles: [
          { start: 1, end: 5, text: '« Les mères du marché ne voulaient pas de plastique dans les greniers. »' },
          { start: 6, end: 12, text: '« Alors nous avons encapsulé nos puces dans de la terre cuite locale. »' }
        ]
      },
      {
        id: 'finagnon-seq-4',
        topicId: 'topic-finagnon-tech',
        number: 4,
        title: 'L’autonomie face aux offres de rachat',
        speakerName: 'Marcellin Houessou',
        speakerRole: 'Fondateur & Ingénieur en Chef',
        speakerAvatar: '/assets/protagonists/dah-zounon.jpg',
        videoUrl: '/sample.mp4',
        duration: 176,
        durationFormatted: '2:56',
        anecdoteSummary: 'Pourquoi nous avons décliné un fonds étranger pour distribuer le capital aux artisans locaux.',
        subtitles: [
          { start: 1, end: 6, text: '« Ils voulaient breveter la forme de nos hélices lacustres. »' },
          { start: 7, end: 14, text: '« Nous avons répondu que cette forme appartenait à trois siècles de charpentiers. »' }
        ]
      }
    ]
  },
  {
    id: 'topic-ia-ancestrale',
    title: 'IA & Sagesses du Fâ',
    category: 'Entreprise',
    posterUrl: '/assets/posters/baobab-bambou.jpg',
    tagline: 'Quand les modèles génératifs dialoguent avec la cosmogonie du Fâ.',
    description: 'Chercheurs, prêtresses et informaticiens encodent la mémoire orale et les systèmes de décision binaires traditionnels.',
    sequences: [
      {
        id: 'ia-seq-1',
        topicId: 'topic-ia-ancestrale',
        number: 1,
        title: 'Les 256 signes et le binaire',
        speakerName: 'Pr. Hélène Saint-Amand',
        speakerRole: 'Chercheuse en Éthique Algorithmique',
        speakerAvatar: '/assets/protagonists/helene-saint-amand.jpg',
        videoUrl: '/sample.mp4',
        duration: 176,
        durationFormatted: '2:56',
        anecdoteSummary: 'Découvrir que la géomancie du Fâ reposait déjà sur 8 bits de probabilités combinatoires.',
        subtitles: [
          { start: 1, end: 5, text: '« Le Fâ n’est pas de la superstition, c’est une combinatoire stricte à base 2. »' },
          { start: 6, end: 12, text: '« 16 signes majeurs, 256 déclinaisons : l’exact ancêtre mathématique de nos réseaux de neurones. »' }
        ]
      },
      {
        id: 'ia-seq-2',
        topicId: 'topic-ia-ancestrale',
        number: 2,
        title: 'Traduire la métaphore du Fongbé',
        speakerName: 'Armel Hounkpatin',
        speakerRole: 'Linguiste Computationnel',
        speakerAvatar: '/assets/protagonists/armel-hounkpatin.jpg',
        videoUrl: '/sample.mp4',
        duration: 176,
        durationFormatted: '2:56',
        anecdoteSummary: 'Comment éviter que le modèle ne réduise la richesse poétique d’un proverbe à un simple résumé textuel.',
        subtitles: [
          { start: 1, end: 6, text: '« En Fongbé, dire "la pluie tombe" engage la généalogie des nuages. »' },
          { start: 7, end: 13, text: '« Nous avons réentraîné le transformeur pour qu’il conserve le double sens sacré. »' }
        ]
      },
      {
        id: 'ia-seq-3',
        topicId: 'topic-ia-ancestrale',
        number: 3,
        title: 'Le testament des griots',
        speakerName: 'Sika Dossou',
        speakerRole: 'Archiviste Numérique des Mémoires',
        speakerAvatar: '/assets/protagonists/sika-dossou.jpg',
        videoUrl: '/sample.mp4',
        duration: 176,
        durationFormatted: '2:56',
        anecdoteSummary: 'La collecte audio auprès des conteurs centenaires sous l’arbre à palabres de Savalou.',
        subtitles: [
          { start: 1, end: 5, text: '« Le vieux Dah nous a dit : "Ne gardez pas ma voix dans une boîte morte". »' },
          { start: 6, end: 12, text: '« Faites qu’elle réponde aux enfants du siècle prochain. »' }
        ]
      }
    ]
  },
  {
    id: 'topic-mahougnon-rythme',
    title: 'Mahougnon Rythme',
    category: 'Personnalité',
    posterUrl: '/assets/posters/jesus-esu.jpg',
    tagline: 'L’épopée d’un maître tambour qui transcende le jazz et le vodun.',
    description: 'Une plongée intime dans l’atelier sonore où résonnent peaux de chèvre tendues, gongs doubles et synthétiseurs modulaires.',
    sequences: [
      {
        id: 'mahougnon-seq-1',
        topicId: 'topic-mahougnon-rythme',
        number: 1,
        title: 'La peau qui tremble avant l’impact',
        speakerName: 'Mahougnon Zounon',
        speakerRole: 'Percussionniste & Compositeur',
        speakerAvatar: '/assets/protagonists/mahougnon-zounon.jpg',
        videoUrl: '/sample.mp4',
        duration: 176,
        durationFormatted: '2:56',
        anecdoteSummary: 'L’initiation secrète à Ouidah : apprendre à jouer sans frapper fort, juste par résonance harmonique.',
        subtitles: [
          { start: 1, end: 5, text: '« Le tambour ne se frappe pas, il se réveille. »' },
          { start: 6, end: 11, text: '« Si votre cœur bat trop vite, le rythme se brouille instantanément. »' }
        ]
      },
      {
        id: 'mahougnon-seq-2',
        topicId: 'topic-mahougnon-rythme',
        number: 2,
        title: 'La nuit du solo improvisé',
        speakerName: 'Malik Diop',
        speakerRole: 'Batteur Jazz & Complice de Scène',
        speakerAvatar: '/assets/protagonists/malik-diop.jpg',
        videoUrl: '/sample.mp4',
        duration: 176,
        durationFormatted: '2:56',
        anecdoteSummary: 'Un concert sous un orage tropical à Cotonou où les éclairs ont dicté le tempo du morceau final.',
        subtitles: [
          { start: 1, end: 6, text: '« L’électricité a sauté en plein milieu de la jam session. »' },
          { start: 7, end: 13, text: '« Mahougnon a continué dans l’obscurité, guidé uniquement par la réverbération du tonnerre. »' }
        ]
      },
      {
        id: 'mahougnon-seq-3',
        topicId: 'topic-mahougnon-rythme',
        number: 3,
        title: 'Polyphonies des prêtresses',
        speakerName: 'Clémentine Alapini',
        speakerRole: 'Mère de Chœur & Gardienne des Chants',
        speakerAvatar: '/assets/protagonists/adjovi-blandine.jpg',
        videoUrl: '/sample.mp4',
        duration: 176,
        durationFormatted: '2:56',
        anecdoteSummary: 'Intégrer les modulations vocales sacrées dans une orchestration contemporaine sans perdre l’esprit du temple.',
        subtitles: [
          { start: 1, end: 5, text: '« Chaque note porte le nom d’une rivière ou d’un ancêtre. »' },
          { start: 6, end: 12, text: '« On ne chante pas pour le public, on chante pour faire vibrer le bois du plancher. »' }
        ]
      }
    ]
  },
  {
    id: 'topic-sentinelles-ganvie',
    title: 'Sentinelles Ganvié',
    category: 'Association',
    posterUrl: '/assets/posters/benin-monde.jpg',
    tagline: 'L’alliance solidaire des piroguiers et des biologistes lacustres.',
    description: 'Une communauté sur pilotis qui protège les eaux du lac Nokoué et transmet l’art de naviguer sans moteur.',
    sequences: [
      {
        id: 'ganvie-seq-1',
        topicId: 'topic-sentinelles-ganvie',
        number: 1,
        title: 'Lire la profondeur à la couleur de l’eau',
        speakerName: 'Tobi Houndegla',
        speakerRole: 'Maître Piroguier & Pêcheur',
        speakerAvatar: '/assets/protagonists/tobi-ganvie.jpg',
        videoUrl: '/sample.mp4',
        duration: 176,
        durationFormatted: '2:56',
        anecdoteSummary: 'Comment naviguer dans le brouillard du matin uniquement au parfum des jacinthes d’eau et à la résistance de la pagaie.',
        subtitles: [
          { start: 1, end: 5, text: '« L’eau sombre annonce le fond de vase, l’eau mordorée le passage des bancs de poissons. »' },
          { start: 6, end: 12, text: '« Mes mains connaissent chaque tournant de ce lac mieux que mes yeux. »' }
        ]
      },
      {
        id: 'ganvie-seq-2',
        topicId: 'topic-sentinelles-ganvie',
        number: 2,
        title: 'La barque école des enfants',
        speakerName: 'Séraphine Gbaguidi',
        speakerRole: 'Piroguière et Institutrice Flottante',
        speakerAvatar: '/assets/protagonists/amara-tisserande.jpg',
        videoUrl: '/sample.mp4',
        duration: 176,
        durationFormatted: '2:56',
        anecdoteSummary: 'Apprendre aux tout-petits à nager avant même de savoir courir sur la terre ferme.',
        subtitles: [
          { start: 1, end: 5, text: '« À quatre ans, un enfant de Ganvié sait déjà stabiliser une coque de bois. »' },
          { start: 6, end: 11, text: '« L’équilibre n’est pas une contrainte, c’est notre manière d’habiter le monde. »' }
        ]
      },
      {
        id: 'ganvie-seq-3',
        topicId: 'topic-sentinelles-ganvie',
        number: 3,
        title: 'Le retour des hérons cendrés',
        speakerName: 'Justine Houinato',
        speakerRole: 'Biologiste de la Mangrove',
        speakerAvatar: '/assets/protagonists/senan-agossa.jpg',
        videoUrl: '/sample.mp4',
        duration: 176,
        durationFormatted: '2:56',
        anecdoteSummary: 'La renaissance des frayères protégées après l’interdiction des filets industriels non sélectifs.',
        subtitles: [
          { start: 1, end: 6, text: '« Lorsque les oiseaux reviennent nidifier, la lagune respire à nouveau. »' },
          { start: 7, end: 13, text: '« C’est la preuve vivante que la tradition et l’écologie moderne se rejoignent. »' }
        ]
      }
    ]
  },
  {
    id: 'topic-e-vivi-terroirs',
    title: 'E-Vivi Terroirs',
    category: 'Produit du terroir',
    posterUrl: '/assets/posters/e-vivi-fiat-luxe.png',
    tagline: 'La réhabilitation des semences anciennes et de la gastronomie médicinale.',
    description: 'Une maison culinaire et agricole qui remet au goût du jour le fonio sauvage, le néré et les infusions botaniques du Bénin.',
    sequences: [
      {
        id: 'evivi-seq-1',
        topicId: 'topic-e-vivi-terroirs',
        number: 1,
        title: 'Le secret du bouillon fumé',
        speakerName: 'Chef Koffi',
        speakerRole: 'Maître Cuisinier & Fondateur',
        speakerAvatar: '/assets/protagonists/chef-koffi.jpg',
        videoUrl: '/sample.mp4',
        duration: 176,
        durationFormatted: '2:56',
        anecdoteSummary: 'Trois générations de femmes ont peaufiné ce mélange de 14 racines avant qu’il n’atteigne la table des grands restaurants.',
        subtitles: [
          { start: 1, end: 5, text: '« Ma grand-mère me disait : "Un bouillon qui ne guérit pas le corps n’est pas un bouillon." »' },
          { start: 6, end: 11, text: '« Ici, chaque épice a une fonction digestive, protectrice et savoureuse. »' }
        ]
      },
      {
        id: 'evivi-seq-2',
        topicId: 'topic-e-vivi-terroirs',
        number: 2,
        title: 'Sur les traces du poivre sauvage',
        speakerName: 'Mariama Ba',
        speakerRole: 'Ethnobotaniste de Terrain',
        speakerAvatar: '/assets/protagonists/fatou-diallo.jpg',
        videoUrl: '/sample.mp4',
        duration: 176,
        durationFormatted: '2:56',
        anecdoteSummary: 'Une expédition de deux semaines dans les collines de Dassa pour retrouver la liane du poivre d’Ahoho présumé disparu.',
        subtitles: [
          { start: 1, end: 6, text: '« Les paysans nous guidaient à l’odeur de la sève écrasée entre deux pierres. »' },
          { start: 7, end: 12, text: '« Quand nous l’avons goûté, c’était comme si un siècle d’histoire culinaire réapparaissait. »' }
        ]
      },
      {
        id: 'evivi-seq-3',
        topicId: 'topic-e-vivi-terroirs',
        number: 3,
        title: 'L’école des apprenties fermentatrices',
        speakerName: 'Pascal Dossou',
        speakerRole: 'Maître Artisan Fermentateur',
        speakerAvatar: '/assets/protagonists/koffi-tisserand.jpg',
        videoUrl: '/sample.mp4',
        duration: 176,
        durationFormatted: '2:56',
        anecdoteSummary: 'Former trente jeunes filles déscolarisées à la maîtrise biologique du soumbala et de la moutarde de néré.',
        subtitles: [
          { start: 1, end: 5, text: '« La fermentation exige de la patience et du silence. »' },
          { start: 6, end: 11, text: '« Aujourd’hui, ces femmes sont les cheffes respectées de leur propre chaîne d’approvisionnement. »' }
        ]
      }
    ]
  },
  {
    id: 'topic-amazones-leadership',
    title: 'Amazones Vivantes',
    category: 'Association',
    posterUrl: '/assets/posters/blacks-one-amazones.jpg',
    tagline: 'Héritières du courage d’Agoodjié : athlétisme, sororité et résilience.',
    description: 'Une équipe de jeunes femmes sportives de haut niveau et entrepreneures qui portent haut l’héritage guerrier pacifié.',
    sequences: [
      {
        id: 'amazones-seq-1',
        topicId: 'topic-amazones-leadership',
        number: 1,
        title: 'L’entraînement avant l’aube',
        speakerName: 'Senan Agossa',
        speakerRole: 'Capitaine d’Athlétisme & Médaillée',
        speakerAvatar: '/assets/protagonists/athlete-hurdle.jpg',
        videoUrl: '/sample.mp4',
        duration: 176,
        durationFormatted: '2:56',
        anecdoteSummary: 'Courir pieds nus sur le sable humide d’Akpakpa à 4h30 du matin pour forger le mental de championne.',
        subtitles: [
          { start: 1, end: 5, text: '« Lorsque tout le quartier dort encore, nous entendons la force de nos ancêtres dans nos foulées. »' },
          { start: 6, end: 12, text: '« Rien ne peut arrêter une équipe de femmes décidées à briser leurs propres plafonds. »' }
        ]
      },
      {
        id: 'amazones-seq-2',
        topicId: 'topic-amazones-leadership',
        number: 2,
        title: 'La clinique solidaire itinérante',
        speakerName: 'Blandine Adjovi',
        speakerRole: 'Médecin du Sport & Mentor',
        speakerAvatar: '/assets/protagonists/adjovi-blandine.jpg',
        videoUrl: '/sample.mp4',
        duration: 176,
        durationFormatted: '2:56',
        anecdoteSummary: 'Apporter des soins et des bilans cardiologiques gratuits aux jeunes filles des villages de l’intérieur.',
        subtitles: [
          { start: 1, end: 5, text: '« Le sport est un tremplin de santé avant d’être une quête de trophées. »' },
          { start: 6, end: 11, text: '« Chaque fille en bonne santé est un pilier pour toute sa famille. »' }
        ]
      },
      {
        id: 'amazones-seq-3',
        topicId: 'topic-amazones-leadership',
        number: 3,
        title: 'Transmettre la danse martiale',
        speakerName: 'Diane Sossou',
        speakerRole: 'Chorégraphe de combat rituel',
        speakerAvatar: '/assets/protagonists/eleonore-vance.jpg',
        videoUrl: '/sample.mp4',
        duration: 176,
        durationFormatted: '2:56',
        anecdoteSummary: 'Transformer l’art de l’escrime d’Abomey en discipline de self-défense et d’assurance scénique.',
        subtitles: [
          { start: 1, end: 6, text: '« Le bâton de combat ne sert pas à attaquer, il sert à marquer son espace avec dignité. »' },
          { start: 7, end: 12, text: '« En voyant ces adolescentes tenir la posture, on sent la fierté de tout un peuple. »' }
        ]
      }
    ]
  },
  {
    id: 'topic-senami-architecture',
    title: 'Senami Terres Rouges',
    category: 'Personnalité',
    posterUrl: '/assets/posters/dixeat-fiat-luxe.jpg',
    tagline: 'L’architecture bioclimatique inspirée des palais d’argile du Danxomè.',
    description: 'Une bâtisseuse contemporaine qui réinvente les voûtes nubiennes et les enduits végétaux pour rafraîchir les villes sans climatiseurs.',
    sequences: [
      {
        id: 'senami-seq-1',
        topicId: 'topic-senami-architecture',
        number: 1,
        title: 'L’argile qui respire sous 40 degrés',
        speakerName: 'Senami Hountondji',
        speakerRole: 'Architecte en Terre Crue & Designer',
        speakerAvatar: '/assets/protagonists/coach-office.jpg',
        videoUrl: '/sample.mp4',
        duration: 176,
        durationFormatted: '2:56',
        anecdoteSummary: 'Prouver qu’un mur de briques compressées régule naturellement l’hygrométrie et maintient 23°C à l’intérieur sans un kilowatt.',
        subtitles: [
          { start: 1, end: 5, text: '« Les colons ont apporté le béton et la tôle, qui transforment nos maisons en fournaises. »' },
          { start: 6, end: 11, text: '« La terre crue sous nos pieds est le matériau le plus sophistiqué de notre avenir. »' }
        ]
      },
      {
        id: 'senami-seq-2',
        topicId: 'topic-senami-architecture',
        number: 2,
        title: 'La voûte montée sans coffrage',
        speakerName: 'Kokou Mensah',
        speakerRole: 'Maître Maçon Bâtisseur',
        speakerAvatar: '/assets/protagonists/kwame-mensah.jpg',
        videoUrl: '/sample.mp4',
        duration: 176,
        durationFormatted: '2:56',
        anecdoteSummary: 'La pose délicate de chaque brique inclinée avec un mortier à prise rapide à base de sève de baobab.',
        subtitles: [
          { start: 1, end: 5, text: '« Les ingénieurs disaient que la voûte s’effondrerait avant la nuit. »' },
          { start: 6, end: 11, text: '« Dix ans plus tard, elle est plus solide que jamais, sans un gramme d’acier. »' }
        ]
      },
      {
        id: 'senami-seq-3',
        topicId: 'topic-senami-architecture',
        number: 3,
        title: 'La place ombragée d’Adjarra',
        speakerName: 'Aminata Touré',
        speakerRole: 'Urbaniste d’Éco-quartiers',
        speakerAvatar: '/assets/protagonists/fatou-diallo.jpg',
        videoUrl: '/sample.mp4',
        duration: 176,
        durationFormatted: '2:56',
        anecdoteSummary: 'Transformer un carrefour surchauffé en oasis collective où les artisans viennent jouer au sowli à l’ombre des arcades.',
        subtitles: [
          { start: 1, end: 6, text: '« Construire une ville humaine, c’est redonner de la fraîcheur et de la beauté aux gens qui marchent. »' },
          { start: 7, end: 12, text: '« Quand les anciens s’y installent pour palabrer, c’est que le projet est réussi. »' }
        ]
      }
    ]
  }
];

/**
 * Récupère un sujet par son identifiant
 */
export const getFocusTopicById = (id?: string): FocusTopic | undefined => {
  if (!id) return FOCUS_TOPICS[0];
  return FOCUS_TOPICS.find(t => t.id === id);
};

/**
 * Pagination quasi infinie sans répétition dans la même session.
 * Retourne la prochaine séquence pour le sujet donné.
 */
export const getNextSequentialSequence = (
  topic: FocusTopic, 
  currentIndex: number, 
  sessionSeenSequenceIds: Set<string>
): { nextIndex: number; sequence: FocusSequence; isExhausted: boolean } => {
  const total = topic.sequences.length;
  if (total === 0) {
    throw new Error('Aucune séquence pour ce sujet');
  }

  // Chercher d'abord la séquence suivante non encore vue dans la session
  for (let i = 1; i <= total; i++) {
    const candidateIdx = (currentIndex + i) % total;
    const candidate = topic.sequences[candidateIdx];
    if (!sessionSeenSequenceIds.has(candidate.id)) {
      return { nextIndex: candidateIdx, sequence: candidate, isExhausted: false };
    }
  }

  // Si toutes ont été vues dans cette session, boucler naturellement en reprenant
  const nextIdx = (currentIndex + 1) % total;
  return { nextIndex: nextIdx, sequence: topic.sequences[nextIdx], isExhausted: true };
};
