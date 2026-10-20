export interface CompanyStakeholder {
  id: string;
  name: string;
  roleCategory: 'Fondateur' | 'Collaborateur' | 'Fournisseur' | 'Client' | 'Partenaire' | 'Bénévole' | 'Bienfaiteur';
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
  description?: string;
  manifestoVideoUrl?: string;
  manifestoQuestion?: string;
  foundedYear?: string;
  location?: string;
  stakeholders: CompanyStakeholder[];
}

const SAFE_AVATARS = [
  '/assets/duos/coach-office.jpg',
  '/assets/protagonists/adjovi-blandine.jpg',
  '/assets/protagonists/chef-koffi.jpg',
  '/assets/protagonists/kwame-mensah.jpg',
  '/assets/protagonists/athlete-hurdle.jpg',
  '/assets/protagonists/amara-tisserande.jpg',
  '/assets/protagonists/armel-hounkpatin.jpg',
  '/assets/protagonists/codjo-blind.jpg',
  '/assets/protagonists/dah-zounon.jpg',
  '/assets/protagonists/fatou-diallo.jpg',
  '/assets/protagonists/helene-saint-amand.jpg',
  '/assets/protagonists/koffi-tisserand.jpg',
  '/assets/protagonists/malik-diop.jpg',
  '/assets/protagonists/mawuna-medium.jpg',
  '/assets/protagonists/photographer-focus.jpg',
  '/assets/protagonists/sika-dossou.jpg',
  '/assets/protagonists/tobi-ganvie.jpg',
  '/assets/protagonists/eleonore-vance.jpg',
  '/assets/protagonists/sayri-quispe.jpg',
  '/assets/protagonists/senan-agossa.jpg'
];

const SAMPLE_VIDEOS = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'
];

const STAKEHOLDER_TEMPLATES: { name: string; roleCategory: CompanyStakeholder['roleCategory']; roleDetail: string; question: string }[] = [
  { name: 'Pascal Houndé', roleCategory: 'Fondateur', roleDetail: 'Directeur Général & Fondateur', question: 'Quelle mémoire choisissons-nous de léguer à travers notre entreprise ?' },
  { name: 'Amina Traoré', roleCategory: 'Collaborateur', roleDetail: 'Directrice des Ressources Humaines', question: 'Comment cultiver la fierté et le savoir-faire de nos équipes chaque jour ?' },
  { name: 'Koffi Mensah', roleCategory: 'Fournisseur', roleDetail: 'Fournisseur principal matières premières', question: 'Comment garantir l’exigence éthique et la durabilité de la filière locale ?' },
  { name: 'Marc Houndégla', roleCategory: 'Client', roleDetail: 'Client fidèle & Ambassadeur', question: 'Pourquoi la sincérité d’une marque change-t-elle l’attachement de sa communauté ?' },
  { name: 'Ousmane Sow', roleCategory: 'Partenaire', roleDetail: 'Partenaire stratégique territorial', question: 'Comment mutualiser nos forces pour faire rayonner notre savoir-faire au monde ?' },
  { name: 'Félicité Zannou', roleCategory: 'Collaborateur', roleDetail: 'Responsable R&D et qualité', question: 'En quoi l’innovation respectueuse des traditions crée-t-elle une valeur pérenne ?' },
  { name: 'Benoît Sossou', roleCategory: 'Collaborateur', roleDetail: 'Directeur des opérations', question: 'Comment conjuguer performance économique et dignité humaine sur le terrain ?' },
  { name: 'Diane Dossou', roleCategory: 'Partenaire', roleDetail: 'Coordinatrice logistique & réseaux', question: 'Quel pont construire entre nos ateliers et les grands marchés régionaux ?' },
  { name: 'Sébastien Kiki', roleCategory: 'Collaborateur', roleDetail: 'Responsable engagement sociétal', question: 'Quel impact réel mesurons-nous auprès des familles de nos collaborateurs ?' },
  { name: 'Chantal Houessou', roleCategory: 'Collaborateur', roleDetail: 'Cheffe de projet partenariats', question: 'Comment protéger l’intégrité du projet dans un environnement mondialisé ?' },
  { name: 'Jean-Luc Agbo', roleCategory: 'Client', roleDetail: 'Partenaire distributeur agréé', question: 'Pourquoi choisir des entreprises enracinées plutôt que des marques sans âme ?' },
  { name: 'Rosine Agossou', roleCategory: 'Collaborateur', roleDetail: 'Maître artisane & formatrice', question: 'Comment transmettre le geste juste aux jeunes générations qui débutent ?' },
  { name: 'Gilles Alapini', roleCategory: 'Partenaire', roleDetail: 'Conseiller scientifique & culturel', question: 'Comment fonder le développement futur sur la sagesse de notre passé ?' },
  { name: 'Yvette Ahounou', roleCategory: 'Bénévole', roleDetail: 'Médiatrice solidaire d’ateliers', question: 'Quel épanouissement apporte l’entraide au sein d’un projet d’entreprise ?' },
  { name: 'Thierry Medegan', roleCategory: 'Fournisseur', roleDetail: 'Facteur d’équipements & ingénierie', question: 'Comment adapter les outils de pointe aux réalités concrètes de notre région ?' },
  { name: 'Awa Cissé', roleCategory: 'Bienfaiteur', roleDetail: 'Mécène transmission & jeunesse', question: 'Pourquoi soutenir les entreprises qui investissent dans le capital humain ?' }
];

function generateStakeholders(companyPrefix: string, offset: number): CompanyStakeholder[] {
  return STAKEHOLDER_TEMPLATES.map((tmpl, idx) => ({
    id: `${companyPrefix}-${idx + 1}`,
    name: tmpl.name,
    roleCategory: tmpl.roleCategory,
    roleDetail: tmpl.roleDetail,
    photoUrl: SAFE_AVATARS[(idx + offset) % SAFE_AVATARS.length],
    videoUrl: SAMPLE_VIDEOS[(idx + offset) % SAMPLE_VIDEOS.length],
    question: tmpl.question
  }));
}

// 16 Entreprises et Organisations avec NOMS COURTS et VRAIES IMAGES DISPONIBLES
export const COMPANIES_DATA: CompanyEntity[] = [
  {
    id: 'afrikafun',
    category: 'Audiovisuel',
    companyName: 'AfrikaFun',
    photoUrl: '/assets/directions/personnalites-cinema.jpg',
    videoUrl: SAMPLE_VIDEOS[0],
    manifestoVideoUrl: SAMPLE_VIDEOS[0],
    manifestoQuestion: 'Comment l’image cinématographique réveille-t-elle la souveraineté narrative de nos peuples ?',
    tagline: 'Créer, raconter, inspirer',
    description: 'Agence et studio pionnier de création audiovisuelle, de documentaires immersifs et de séries culturelles.',
    foundedYear: '2019',
    location: 'Cotonou, Bénin',
    stakeholders: generateStakeholders('afrika', 0)
  },
  {
    id: 'transexpress',
    category: 'Transport',
    companyName: 'TransExpress',
    photoUrl: '/assets/directions/projets-aventure.jpg',
    videoUrl: SAMPLE_VIDEOS[1],
    manifestoVideoUrl: SAMPLE_VIDEOS[1],
    manifestoQuestion: 'Comment relier nos territoires et faciliter la libre circulation humaine et marchande ?',
    tagline: 'Connecter les villes, rapprocher les peuples',
    description: 'Compagnie de transport interurbain et multimodal reliant les capitales et villages de la sous-région.',
    foundedYear: '2015',
    location: 'Cotonou & Parakou',
    stakeholders: generateStakeholders('trans', 1)
  },
  {
    id: 'terre-avenir',
    category: 'Agroalimentaire',
    companyName: 'Terre d’Avenir',
    photoUrl: '/assets/directions/territoires-terroirs.jpg',
    videoUrl: SAMPLE_VIDEOS[2],
    manifestoVideoUrl: SAMPLE_VIDEOS[2],
    manifestoQuestion: 'Comment nourrir notre peuple tout en régénérant les sols sacrés de nos terroirs ?',
    tagline: 'La terre féconde, l’alimentation saine',
    description: 'Ferme agroécologique modèle et coopérative de transformation de produits vivriers bio.',
    foundedYear: '2017',
    location: 'Ouidah, Bénin',
    stakeholders: generateStakeholders('terre', 2)
  },
  {
    id: 'enersol',
    category: 'Énergie',
    companyName: 'EnerSol',
    photoUrl: '/assets/directions/projets-innovation.jpg',
    videoUrl: SAMPLE_VIDEOS[3],
    manifestoVideoUrl: SAMPLE_VIDEOS[3],
    manifestoQuestion: 'Comment faire du soleil notre allié premier pour l’autonomie de chaque foyer ?',
    tagline: 'La lumière du ciel au service des foyers',
    description: 'Entreprise pionnière d’électrification solaire rurale et de micro-réseaux communautaires.',
    foundedYear: '2020',
    location: 'Parakou, Bénin',
    stakeholders: generateStakeholders('enersol', 3)
  },
  {
    id: 'tissafrik',
    category: 'Textile',
    companyName: 'TissAfrik',
    photoUrl: '/assets/directions/marques-mode.jpg',
    videoUrl: SAMPLE_VIDEOS[4],
    manifestoVideoUrl: SAMPLE_VIDEOS[4],
    manifestoQuestion: 'Comment perpétuer la noblesse du tissage artisanal dans la mode contemporaine ?',
    tagline: 'Le fil de la tradition, la trame du futur',
    description: 'Manufacture textile artisanale valorisant le coton bio équitable et les teintures végétales.',
    foundedYear: '2018',
    location: 'Abomey, Bénin',
    stakeholders: generateStakeholders('tiss', 4)
  },
  {
    id: 'canal-plus',
    category: 'Audiovisuel',
    companyName: 'Canal+',
    photoUrl: '/assets/directions/marques-tech.jpg',
    videoUrl: SAMPLE_VIDEOS[1],
    manifestoVideoUrl: SAMPLE_VIDEOS[1],
    manifestoQuestion: 'Comment valoriser les talents d’Afrique sur les plus grands écrans mondiaux ?',
    tagline: 'L’Afrique en direct et en création',
    description: 'Groupe média international engagé dans la coproduction et la diffusion.',
    foundedYear: '2001',
    location: 'Cotonou & Paris',
    stakeholders: generateStakeholders('canal', 5)
  },
  {
    id: 'eco-ferme',
    category: 'Agriculture circulaire',
    companyName: 'Éco-Ferme',
    photoUrl: '/assets/directions/projets-culture.jpg',
    videoUrl: SAMPLE_VIDEOS[1],
    manifestoVideoUrl: SAMPLE_VIDEOS[1],
    manifestoQuestion: 'Comment créer de la richesse sans jamais épuiser les ressources de la nature ?',
    tagline: 'Rien ne se perd, tout nourrit la vie',
    description: 'Centre de permaculture, d’aquaponie et de formation de jeunes agriculteurs résilients.',
    foundedYear: '2018',
    location: 'Allada, Bénin',
    stakeholders: generateStakeholders('eco', 6)
  },
  {
    id: 'biosaveur',
    category: 'Transformation bio',
    companyName: 'BioSaveur',
    photoUrl: '/assets/directions/projets-entreprise.jpg',
    videoUrl: SAMPLE_VIDEOS[2],
    manifestoVideoUrl: SAMPLE_VIDEOS[2],
    manifestoQuestion: 'Comment révéler les arômes purs de nos terroirs sur les tables du monde ?',
    tagline: 'L’or végétal du terroir tropical',
    description: 'Manufacture solidaire de jus de fruits naturels, d’épices rares et de farines locales.',
    foundedYear: '2016',
    location: 'Bohicon, Bénin',
    stakeholders: generateStakeholders('bio', 7)
  },
  {
    id: 'kaicedrat',
    category: 'Santé & Botanique',
    companyName: 'Kaicedrat',
    photoUrl: '/assets/directions/projets-social.jpg',
    videoUrl: SAMPLE_VIDEOS[3],
    manifestoVideoUrl: SAMPLE_VIDEOS[3],
    manifestoQuestion: 'Comment allier la rigueur scientifique moderne aux trésors de notre pharmacopée ?',
    tagline: 'Les plantes médicinales bienfaisantes',
    description: 'Laboratoire de phytothérapie et d’infusions médicinales issues de la forêt sacrée.',
    foundedYear: '2015',
    location: 'Porto-Novo, Bénin',
    stakeholders: generateStakeholders('kai', 8)
  },
  {
    id: 'racine-memoire',
    category: 'Patrimoine & Édition',
    companyName: 'Racine & Mémoire',
    photoUrl: '/assets/directions/projets-communautaire.jpg',
    videoUrl: SAMPLE_VIDEOS[4],
    manifestoVideoUrl: SAMPLE_VIDEOS[4],
    manifestoQuestion: 'Pourquoi sauver les manuscrits et généalogies est le salut de notre identité ?',
    tagline: 'Gardiens des récits de nos souverains',
    description: 'Maison d’édition et centre d’archivage numérique des généalogies royales et cultuelles.',
    foundedYear: '2014',
    location: 'Abomey, Bénin',
    stakeholders: generateStakeholders('rac', 9)
  },
  {
    id: 'artisans-bois',
    category: 'Artisanat d’art',
    companyName: 'Artisans du Bois',
    photoUrl: '/assets/directions/expertises-artisanat.jpg',
    videoUrl: SAMPLE_VIDEOS[0],
    manifestoVideoUrl: SAMPLE_VIDEOS[0],
    manifestoQuestion: 'Comment le bois sculpté raconte-t-il les secrets invisibles du cosmos ?',
    tagline: 'La noblesse du bois d’Iroko et d’Ébène',
    description: 'Atelier de maîtres sculpteurs transmettant l’art séculaire des masques et bas-reliefs.',
    foundedYear: '2012',
    location: 'Ouidah, Bénin',
    stakeholders: generateStakeholders('art', 10)
  },
  {
    id: 'voix-lacs',
    category: 'Écotourisme lacustre',
    companyName: 'Voix des Lacs',
    photoUrl: '/assets/directions/territoires-terroirs.jpg',
    videoUrl: SAMPLE_VIDEOS[1],
    manifestoVideoUrl: SAMPLE_VIDEOS[1],
    manifestoQuestion: 'Comment préserver la cité sur pilotis face aux montées des eaux contemporaines ?',
    tagline: 'La mémoire vivante de l’eau douce',
    description: 'Coopérative de piroguiers solaires et de guides historiens natifs de Ganvié.',
    foundedYear: '2019',
    location: 'Ganvié, Bénin',
    stakeholders: generateStakeholders('voix', 11)
  },
  {
    id: 'or-afrique',
    category: 'Bijouterie & Fonderie',
    companyName: 'Or d’Afrique',
    photoUrl: '/assets/directions/marques-luxe.jpg',
    videoUrl: SAMPLE_VIDEOS[2],
    manifestoVideoUrl: SAMPLE_VIDEOS[2],
    manifestoQuestion: 'Comment marteler le bronze et l’or pour perpétuer les parures royales ?',
    tagline: 'L’éclat immémorial des cours royales',
    description: 'Fonderie d’art et joaillerie traditionnelle travaillant les métaux nobles au feu sacré.',
    foundedYear: '2013',
    location: 'Cotonou, Bénin',
    stakeholders: generateStakeholders('or', 12)
  },
  {
    id: 'trans-benin',
    category: 'Transport & Mobilité',
    companyName: 'Trans-Bénin',
    photoUrl: '/assets/directions/marques-mode.jpg',
    videoUrl: SAMPLE_VIDEOS[3],
    manifestoVideoUrl: SAMPLE_VIDEOS[3],
    manifestoQuestion: 'Comment rapprocher nos régions en toute sécurité et respect des passagers ?',
    tagline: 'Les routes de la fraternité et du progrès',
    description: 'Réseau de transport interurbain éco-responsable reliant les villes et villages du pays.',
    foundedYear: '2016',
    location: 'Cotonou & Parakou',
    stakeholders: generateStakeholders('trans', 13)
  },
  {
    id: 'energie-plus',
    category: 'Réseaux & Énergies',
    companyName: 'Énergie Plus',
    photoUrl: '/assets/directions/projets-aventure.jpg',
    videoUrl: SAMPLE_VIDEOS[4],
    manifestoVideoUrl: SAMPLE_VIDEOS[4],
    manifestoQuestion: 'Comment apporter la force motrice et l’eau potable aux confins du Sahel ?',
    tagline: 'La puissance utile au cœur des villages',
    description: 'Ingénierie de pompage solaire et d’électrification décentralisée à haut rendement.',
    foundedYear: '2017',
    location: 'Natitingou, Bénin',
    stakeholders: generateStakeholders('eng', 14)
  },
  {
    id: 'tissage-royal',
    category: 'Textile & Tissage Kanvô',
    companyName: 'Tissage Royal',
    photoUrl: '/assets/doors/door-marques.jpg',
    videoUrl: SAMPLE_VIDEOS[0],
    manifestoVideoUrl: SAMPLE_VIDEOS[0],
    manifestoQuestion: 'Comment chaque fil tissé préserve-t-il la mémoire et la royauté de nos ancêtres ?',
    tagline: 'Le fil noble du Kanvô tissé main',
    description: 'Manufacture de tissage artisanal royal perpétuant les motifs et teintes d’antan.',
    foundedYear: '2011',
    location: 'Abomey, Bénin',
    stakeholders: generateStakeholders('tis', 15)
  }
];
