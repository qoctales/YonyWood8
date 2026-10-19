export interface CompanyStakeholder {
  id: string;
  name: string;
  roleCategory: 'Fondateur' | 'Collaborateur' | 'Fournisseur' | 'Client' | 'Partenaire' | 'Bénévole' | 'Bienfaiteur' | 'Membre' | 'Président' | 'Trésorière' | 'Secrétaire';
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
  logoUrl?: string;
  videoUrl: string;
  manifestoVideoUrl?: string;
  manifestoTitle?: string;
  manifestoQuestion?: string;
  manifestoDescription?: string;
  tagline: string;
  stakeholders: CompanyStakeholder[];
}

export const COMPANIES_DATA: CompanyEntity[] = [
  // 1. AFRIKAFUN (Audiovisuel & Récits - 32 intervenants)
  {
    id: 'afrika-fun',
    category: 'Audiovisuel & Médias',
    companyName: 'AFRIKAFUN',
    photoUrl: '/assets/Onboardings/Voyage.png',
    logoUrl: '/assets/Onboardings/Voyage.png',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    manifestoVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    manifestoTitle: 'Manifeste AFRIKAFUN : Transmettre nos mémoires',
    manifestoQuestion: 'Comment faire rayonner la mémoire et les voix vivantes de notre terre ?',
    manifestoDescription: 'Studio audiovisuel indépendant pionnier du documentaire humain et de la valorisation des transmissions patrimoniales africaines.',
    tagline: 'Créer, raconter, inspirer',
    stakeholders: [
      // Volet 1 (1–16)
      {
        id: 'afrika-1',
        name: 'Pascal Houndé',
        roleCategory: 'Fondateur',
        roleDetail: 'Producteur & Réalisateur',
        photoUrl: '/assets/duos/coach-office.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        question: 'Comment faire rayonner la mémoire et les voix vivantes de notre terre ?'
      },
      {
        id: 'afrika-2',
        name: 'Amina Traoré',
        roleCategory: 'Collaborateur',
        roleDetail: 'Cheffe monteuse',
        photoUrl: '/assets/protagonists/adjovi-blandine.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        question: 'Comment le montage cinématographique protège-t-il la vérité d’un récit ?'
      },
      {
        id: 'afrika-3',
        name: 'Koffi Mensah',
        roleCategory: 'Fournisseur',
        roleDetail: 'Directeur photo & drone',
        photoUrl: '/assets/protagonists/chef-koffi.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
        question: 'Quelle exigence technique garantit la souveraineté de nos images ?'
      },
      {
        id: 'afrika-4',
        name: 'Marc Houndégla',
        roleCategory: 'Client',
        roleDetail: 'Diffuseur partenaire',
        photoUrl: '/assets/duos/kwame-mensah.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        question: 'Pourquoi l’authenticité d’un documentaire touche-t-elle plus qu’une simple publicité ?'
      },
      {
        id: 'afrika-5',
        name: 'Ousmane Sow',
        roleCategory: 'Partenaire',
        roleDetail: 'Coproduction panafricaine',
        photoUrl: '/assets/duos/athlete-hurdle.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        question: 'Comment mutualiser nos moyens créatifs pour conquérir les écrans internationaux ?'
      },
      {
        id: 'afrika-6',
        name: 'Mariama Ba',
        roleCategory: 'Collaborateur',
        roleDetail: 'Ingénieure du son',
        photoUrl: '/assets/protagonists/amara-tisserande.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
        question: 'Pourquoi le son direct capte-t-il l’âme invisible d’une cérémonie ?'
      },
      {
        id: 'afrika-7',
        name: 'Sénan Agossa',
        roleCategory: 'Membre',
        roleDetail: 'Documentariste terrain',
        photoUrl: '/assets/protagonists/senan-agossa.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        question: 'Comment se faire oublier pour laisser surgir la parole nue des anciens ?'
      },
      {
        id: 'afrika-8',
        name: 'Tobi Houndégla',
        roleCategory: 'Fournisseur',
        roleDetail: 'Coloriste étalonneur',
        photoUrl: '/assets/protagonists/tobi-houndegla.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        question: 'Comment restituer la lumière dorée des après-midis lagunaires sans artifice ?'
      },
      {
        id: 'afrika-9',
        name: 'Fatou Diallo',
        roleCategory: 'Client',
        roleDetail: 'Directrice de festival',
        photoUrl: '/assets/duos/fatou-diallo.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
        question: 'En quoi les récits authentiques reconstruisent-ils la confiance de notre jeunesse ?'
      },
      {
        id: 'afrika-10',
        name: 'Codjo Gbédji',
        roleCategory: 'Collaborateur',
        roleDetail: 'Régisseur général',
        photoUrl: '/assets/protagonists/codjo-blind.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        question: 'Comment surmonter l’imprévu météorologique sur un tournage fluvial ?'
      },
      {
        id: 'afrika-11',
        name: 'Éléonore Vance',
        roleCategory: 'Partenaire',
        roleDetail: 'Formatrice aux écritures',
        photoUrl: '/assets/duos/eleonore-vance.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        question: 'Comment transmettre la rigueur dramaturgique aux jeunes cinéastes ?'
      },
      {
        id: 'afrika-12',
        name: 'Malik Diop',
        roleCategory: 'Bienfaiteur',
        roleDetail: 'Mécène des arts',
        photoUrl: '/assets/duos/malik-diop.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
        question: 'Pourquoi investir dans la conservation audiovisuelle de nos patrimoines ?'
      },
      {
        id: 'afrika-13',
        name: 'Dah Zounon',
        roleCategory: 'Membre',
        roleDetail: 'Conseiller aux traditions',
        photoUrl: '/assets/duos/dah-zounon.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        question: 'Quelle parole doit rester secrète et laquelle peut être offerte au monde ?'
      },
      {
        id: 'afrika-14',
        name: 'Clara Dossou',
        roleCategory: 'Collaborateur',
        roleDetail: 'Community manager',
        photoUrl: '/assets/duos/photographer-focus.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        question: 'Comment fédérer une communauté internationale autour de récits intimes ?'
      },
      {
        id: 'afrika-15',
        name: 'Armel Hounkpatin',
        roleCategory: 'Client',
        roleDetail: 'Conservateur de musée',
        photoUrl: '/assets/protagonists/armel-hounkpatin.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
        question: 'Pourquoi une capsule vidéo donne-t-elle plus de vie aux objets qu’un cartel ?'
      },
      {
        id: 'afrika-16',
        name: 'Hélène Saint-Amand',
        roleCategory: 'Partenaire',
        roleDetail: 'Avocate des droits d’auteur',
        photoUrl: '/assets/protagonists/helene-saint-amand.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        question: 'Comment protéger les voix traditionnelles contre la spoliation intellectuelle ?'
      },
      // Volet 2 (17–32)
      {
        id: 'afrika-17',
        name: 'Sayri Quispe',
        roleCategory: 'Collaborateur',
        roleDetail: 'Opérateur drone & cartographie',
        photoUrl: '/assets/duos/sayri-quispe.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        question: 'Quelle perspective aérienne révèle la géographie sacrée de nos villages ?'
      },
      {
        id: 'afrika-18',
        name: 'Blandine Adjovi',
        roleCategory: 'Membre',
        roleDetail: 'Traductrice en langues locales',
        photoUrl: '/assets/protagonists/adjovi-blandine.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
        question: 'Comment traduire la poésie du fon sans perdre la métaphore ancestrale ?'
      },
      {
        id: 'afrika-19',
        name: 'Babacar Ndiaye',
        roleCategory: 'Fournisseur',
        roleDetail: 'Loueur matériel cinéma',
        photoUrl: '/assets/duos/kwame-mensah.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        question: 'Quelle logistique permet de tourner sous 40 degrés en pleine brousse ?'
      },
      {
        id: 'afrika-20',
        name: 'Sika Dossou',
        roleCategory: 'Collaborateur',
        roleDetail: 'Chargée de post-production',
        photoUrl: '/assets/protagonists/sika-dossou.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        question: 'Comment garantir l’archivage numérique pérenne sur plusieurs décennies ?'
      },
      {
        id: 'afrika-21',
        name: 'Dieudonné Mensah',
        roleCategory: 'Client',
        roleDetail: 'Directeur d’institut culturel',
        photoUrl: '/assets/duos/athlete-hurdle.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
        question: 'Pourquoi le cinéma documentaire est-il le plus grand diplomate culturel ?'
      },
      {
        id: 'afrika-22',
        name: 'Nadine Tossou',
        roleCategory: 'Partenaire',
        roleDetail: 'Diffuseur web nomade',
        photoUrl: '/assets/duos/eleonore-vance.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        question: 'Comment toucher les publics éloignés des salles de projection ?'
      },
      {
        id: 'afrika-23',
        name: 'Koffi Tisserand',
        roleCategory: 'Bienfaiteur',
        roleDetail: 'Mécène et artisan textile',
        photoUrl: '/assets/protagonists/koffi-tisserand.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        question: 'En quoi filmer un geste ancestral honore-t-il la lignée d’un métier ?'
      },
      {
        id: 'afrika-24',
        name: 'Amara Diabaté',
        roleCategory: 'Membre',
        roleDetail: 'Musicienne compositrice',
        photoUrl: '/assets/protagonists/amara-tisserande.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
        question: 'Comment la kora dialogue-t-elle avec le rythme intérieur d’un film ?'
      },
      {
        id: 'afrika-25',
        name: 'Père Matthieu',
        roleCategory: 'Partenaire',
        roleDetail: 'Médiateur patrimonial',
        photoUrl: '/assets/protagonists/pere-matthieu.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        question: 'Comment concilier foi, histoire locale et transmission interreligieuse ?'
      },
      {
        id: 'afrika-26',
        name: 'Mawuna Agbessi',
        roleCategory: 'Collaborateur',
        roleDetail: 'Scripte & archiviste',
        photoUrl: '/assets/protagonists/mawuna-medium.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        question: 'Pourquoi chaque seconde de rush non retenue a-t-elle une valeur historique ?'
      },
      {
        id: 'afrika-27',
        name: 'Dah Mahougnon',
        roleCategory: 'Bienfaiteur',
        roleDetail: 'Doyen bienfaiteur',
        photoUrl: '/assets/protagonists/mahougnon_esu_portrait_1791701582891.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
        question: 'Quelle promesse faisons-nous aux enfants lorsqu’on enregistre leurs grands-parents ?'
      },
      {
        id: 'afrika-28',
        name: 'Chantal Agbo',
        roleCategory: 'Fournisseur',
        roleDetail: 'Catering biologique de tournage',
        photoUrl: '/assets/duos/fatou-diallo.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        question: 'Pourquoi la convivialité de table cimente-t-elle la cohésion d’une équipe ?'
      },
      {
        id: 'afrika-29',
        name: 'Samuel Koudjo',
        roleCategory: 'Client',
        roleDetail: 'Président d’ONG environnementale',
        photoUrl: '/assets/protagonists/chef-koffi.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        question: 'Comment un film de 4 minutes mobilise-t-il plus d’adhésions qu’un rapport de 100 pages ?'
      },
      {
        id: 'afrika-30',
        name: 'Tariq Al-Mansoor',
        roleCategory: 'Partenaire',
        roleDetail: 'Plateforme de streaming solidaire',
        photoUrl: '/assets/duos/sayri-quispe.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
        question: 'Comment redistribuer 80% des revenus de diffusion directement aux créateurs ?'
      },
      {
        id: 'afrika-31',
        name: 'Jeanne Hounkpatin',
        roleCategory: 'Collaborateur',
        roleDetail: 'Assistante de réalisation',
        photoUrl: '/assets/duos/eleonore-vance.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        question: 'Quelle est la première règle d’or pour rassurer un intervenant intimidé ?'
      },
      {
        id: 'afrika-32',
        name: 'Pascal Cossy',
        roleCategory: 'Fondateur',
        roleDetail: 'Cofondateur émérite',
        photoUrl: '/assets/duos/coach-office.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        question: 'Quelle flamme nous guide quand toutes les portes de financement se ferment ?'
      }
    ]
  },

  // 2. Association « Voir Autrement » (Inclusion, Handicap Visuel & Dignité - 32 intervenants)
  {
    id: 'voir-autrement',
    category: 'Solidarité & Handicap',
    companyName: 'Voir Autrement',
    photoUrl: '/assets/duos/codjo-blind.jpg',
    logoUrl: '/assets/duos/codjo-blind.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
    manifestoVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
    manifestoTitle: 'Manifeste « Voir Autrement » : La vision du cœur',
    manifestoQuestion: 'Comment percevoir la beauté du monde quand les yeux physiques se sont éteints ?',
    manifestoDescription: 'Association engagée pour l’inclusion des personnes non-voyantes et malvoyantes à travers l’accès au numérique, la culture orale et l’autonomie socio-économique.',
    tagline: 'Inclusion, dignité et regards intérieurs',
    stakeholders: [
      // Volet 1 (1–16)
      {
        id: 'voir-1',
        name: 'Pascal Cossi',
        roleCategory: 'Président',
        roleDetail: 'Président fondateur & Prêtre du Fâ',
        photoUrl: '/assets/duos/coach-office.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
        question: 'Qu’est-ce qui, un jour, vous a fait sentir que voir avec l’âme dépasse la lumière physique ?'
      },
      {
        id: 'voir-2',
        name: 'Clarisse Houénou',
        roleCategory: 'Secrétaire',
        roleDetail: 'Secrétaire générale',
        photoUrl: '/assets/protagonists/adjovi-blandine.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        question: 'Comment structurer l’entraide pour qu’aucun adhérent isolé ne reste sans soutien ?'
      },
      {
        id: 'voir-3',
        name: 'Geneviève Agossa',
        roleCategory: 'Trésorière',
        roleDetail: 'Trésorière bénévole',
        photoUrl: '/assets/duos/fatou-diallo.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
        question: 'Quelle rigueur comptable garantit que chaque don parvient directement aux cannes blanches ?'
      },
      {
        id: 'voir-4',
        name: 'Codjo Gbédji',
        roleCategory: 'Membre',
        roleDetail: 'Bénéficiaire & Formateur braille',
        photoUrl: '/assets/protagonists/codjo-blind.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        question: 'Comment la lecture tactile m’a ouvert les portes de l’université et de la liberté ?'
      },
      {
        id: 'voir-5',
        name: 'Dr. Alexis Sossou',
        roleCategory: 'Bienfaiteur',
        roleDetail: 'Ophtalmologiste solidaire',
        photoUrl: '/assets/duos/athlete-hurdle.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        question: 'Pourquoi le dépistage précoce en zone rurale sauve-t-il la vue de milliers d’enfants ?'
      },
      {
        id: 'voir-6',
        name: 'Mireille Kpassassi',
        roleCategory: 'Bénévole',
        roleDetail: 'Accompagnatrice mobilité',
        photoUrl: '/assets/duos/eleonore-vance.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        question: 'Comment guider sans infantiliser, pour que la personne marche la tête haute ?'
      },
      {
        id: 'voir-7',
        name: 'Romain Tossou',
        roleCategory: 'Membre',
        roleDetail: 'Musicien percussionniste',
        photoUrl: '/assets/protagonists/chef-koffi.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        question: 'En quoi l’ouïe développe-t-elle une précision rythmique que les yeux ignorent ?'
      },
      {
        id: 'voir-8',
        name: 'Adélaïde Mensah',
        roleCategory: 'Partenaire',
        roleDetail: 'Directrice école spécialisée',
        photoUrl: '/assets/protagonists/amara-tisserande.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
        question: 'Comment scolariser ensemble enfants voyants et non-voyants pour vaincre la peur ?'
      },
      {
        id: 'voir-9',
        name: 'Inès Houndété',
        roleCategory: 'Collaborateur',
        roleDetail: 'Formatrice outils vocaux',
        photoUrl: '/assets/duos/photographer-focus.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
        question: 'Comment les smartphones à synthèse vocale révolutionnent-ils l’autonomie au quotidien ?'
      },
      {
        id: 'voir-10',
        name: 'Gaston Houndégla',
        roleCategory: 'Bienfaiteur',
        roleDetail: 'Donateur régulier',
        photoUrl: '/assets/duos/kwame-mensah.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        question: 'Quelle responsabilité sociale pour les entrepreneurs béninois envers leurs frères vulnérables ?'
      },
      {
        id: 'voir-11',
        name: 'Béatrice Agbo',
        roleCategory: 'Membre',
        roleDetail: 'Artisane vannerie',
        photoUrl: '/assets/protagonists/senan-agossa.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        question: 'Comment le tressage au toucher transforme-t-il la fibre végétale en œuvre d’art ?'
      },
      {
        id: 'voir-12',
        name: 'Fidèle Zounon',
        roleCategory: 'Bénévole',
        roleDetail: 'Chauffeur accompagnateur',
        photoUrl: '/assets/duos/dah-zounon.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        question: 'Pourquoi consacrer mes dimanches à transporter les membres aux réunions fraternelles ?'
      },
      {
        id: 'voir-13',
        name: 'Viviane Dossou',
        roleCategory: 'Fournisseur',
        roleDetail: 'Importatrice cannes & montures',
        photoUrl: '/assets/protagonists/sika-dossou.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        question: 'Comment réduire le coût du matériel orthoptique importé pour les familles modestes ?'
      },
      {
        id: 'voir-14',
        name: 'Salomon Hounkpatin',
        roleCategory: 'Client',
        roleDetail: 'Bénéficiaire microcrédit',
        photoUrl: '/assets/protagonists/armel-hounkpatin.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
        question: 'Comment avoir créé ma boutique d’épices m’a rendu ma fierté de père de famille ?'
      },
      {
        id: 'voir-15',
        name: 'Thérèse Saint-Amand',
        roleCategory: 'Partenaire',
        roleDetail: 'Représentante ministère de la santé',
        photoUrl: '/assets/protagonists/helene-saint-amand.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        question: 'Quelle politique publique pour rendre chaque bâtiment officiel accessible aux malvoyants ?'
      },
      {
        id: 'voir-16',
        name: 'Stanislas Mensah',
        roleCategory: 'Collaborateur',
        roleDetail: 'Coordinateur des ateliers de sensibilisation',
        photoUrl: '/assets/duos/malik-diop.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
        question: 'Comment faire vivre une heure dans l’obscurité totale à des collégiens pour changer leur regard ?'
      },
      // Volet 2 (17–32)
      {
        id: 'voir-17',
        name: 'Père Matthieu',
        roleCategory: 'Bienfaiteur',
        roleDetail: 'Conseiller spirituel bénévole',
        photoUrl: '/assets/protagonists/pere-matthieu.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        question: 'En quoi l’accueil de la fragilité est-il le plus grand révélateur de notre humanité ?'
      },
      {
        id: 'voir-18',
        name: 'Solange Koudjo',
        roleCategory: 'Membre',
        roleDetail: 'Animatrice de radio locale',
        photoUrl: '/assets/protagonists/adjovi-blandine.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        question: 'Pourquoi la voix est-elle le véhicule le plus pur de la fraternité humaine ?'
      },
      {
        id: 'voir-19',
        name: 'Blandine Adjovi',
        roleCategory: 'Bénévole',
        roleDetail: 'Lectrice de livres audio',
        photoUrl: '/assets/duos/eleonore-vance.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        question: 'Quelle émotion naît lorsqu’on prête sa voix pour donner accès aux grands romans ?'
      },
      {
        id: 'voir-20',
        name: 'Koffi Tisserand',
        roleCategory: 'Membre',
        roleDetail: 'Masseur kinésithérapeute non-voyant',
        photoUrl: '/assets/protagonists/koffi-tisserand.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
        question: 'Comment mes mains détectent-elles les nœuds de tension mieux que n’importe quel scanner ?'
      },
      {
        id: 'voir-21',
        name: 'Mawuna Agbessi',
        roleCategory: 'Secrétaire',
        roleDetail: 'Secrétaire adjointe',
        photoUrl: '/assets/protagonists/mawuna-medium.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
        question: 'Comment tenir un registre d’adhésions parfaitement à jour avec un lecteur d’écran ?'
      },
      {
        id: 'voir-22',
        name: 'Dah Mahougnon',
        roleCategory: 'Bienfaiteur',
        roleDetail: 'Doyen bienfaiteur de la lagune',
        photoUrl: '/assets/protagonists/mahougnon_esu_portrait_1791701582891.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        question: 'Pourquoi dans nos contes ancestraux les aveugles sont-ils les vrais devins ?'
      },
      {
        id: 'voir-23',
        name: 'Amara Diabaté',
        roleCategory: 'Partenaire',
        roleDetail: 'Professeure de chant choral',
        photoUrl: '/assets/protagonists/amara-tisserande.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        question: 'Comment la chorale de l’association unifie-t-elle les cœurs au-delà des épreuves ?'
      },
      {
        id: 'voir-24',
        name: 'Sayri Quispe',
        roleCategory: 'Bénévole',
        roleDetail: 'Ingénieur bénévole en domotique sonore',
        photoUrl: '/assets/duos/sayri-quispe.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        question: 'Comment adapter une maison avec des balises sonores à coût quasi nul ?'
      },
      {
        id: 'voir-25',
        name: 'Chantal Agbo',
        roleCategory: 'Trésorière',
        roleDetail: 'Auditrice bénévole',
        photoUrl: '/assets/duos/fatou-diallo.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        question: 'Pourquoi la transparence totale des comptes attire-t-elle la confiance des fondations ?'
      },
      {
        id: 'voir-26',
        name: 'Tobi Houndégla',
        roleCategory: 'Membre',
        roleDetail: 'Étudiant en droit',
        photoUrl: '/assets/protagonists/tobi-houndegla.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
        question: 'Comment plaider demain au barreau sans voir le visage des juges mais en sentant leur voix ?'
      },
      {
        id: 'voir-27',
        name: 'Babacar Ndiaye',
        roleCategory: 'Bienfaiteur',
        roleDetail: 'Donateur d’équipements solaires',
        photoUrl: '/assets/duos/kwame-mensah.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
        question: 'Pourquoi garantir la lumière et le ventilateur solaire dans le centre d’accueil ?'
      },
      {
        id: 'voir-28',
        name: 'Marc Houndégla',
        roleCategory: 'Partenaire',
        roleDetail: 'Juriste référent handicap',
        photoUrl: '/assets/duos/athlete-hurdle.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        question: 'Comment faire appliquer concrètement la loi d’embauche des personnes handicapées ?'
      },
      {
        id: 'voir-29',
        name: 'Nadine Tossou',
        roleCategory: 'Bénévole',
        roleDetail: 'Psychologue clinicienne bénévole',
        photoUrl: '/assets/duos/eleonore-vance.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        question: 'Comment accompagner une personne qui perd la vue brutalement à l’âge adulte ?'
      },
      {
        id: 'voir-30',
        name: 'Samuel Koudjo',
        roleCategory: 'Membre',
        roleDetail: 'Champion handisport de cécifoot',
        photoUrl: '/assets/protagonists/chef-koffi.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        question: 'Quelle adrénaline ressent-on lorsqu’on tire dans un ballon à clochette en pleine course ?'
      },
      {
        id: 'voir-31',
        name: 'Tariq Al-Mansoor',
        roleCategory: 'Bienfaiteur',
        roleDetail: 'Fondateur mécène tech inclusive',
        photoUrl: '/assets/duos/sayri-quispe.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        question: 'Comment l’IA et la reconnaissance d’images redonnent-elles une description en direct du monde ?'
      },
      {
        id: 'voir-32',
        name: 'Pascal Cossi',
        roleCategory: 'Président',
        roleDetail: 'Mot d’espérance finale',
        photoUrl: '/assets/duos/coach-office.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
        question: 'Pourquoi l’obscurité physique peut-elle révéler la plus grande clarté intérieure ?'
      }
    ]
  },

  // 3. Association « Doli Doli » (Culture, Enfance & Traditions Orales - 32 intervenants)
  {
    id: 'doli-doli',
    category: 'Culture & Enfance',
    companyName: 'Association Doli Doli',
    photoUrl: '/assets/directions/tradition-orale.jpg',
    logoUrl: '/assets/directions/tradition-orale.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    manifestoVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    manifestoTitle: 'Manifeste Doli Doli : Éveiller l’enfance par le conte',
    manifestoQuestion: 'Comment semer les valeurs de nos aïeux dans le cœur des enfants d’aujourd’hui ?',
    manifestoDescription: 'Mouvement associatif d’éveil culturel, d’initiation aux contes ancestraux et d’éducation populaire pour les enfants et familles.',
    tagline: 'Contes, rires d’enfants et racines vivantes',
    stakeholders: [
      {
        id: 'doli-1',
        name: 'Aïcha Dossou',
        roleCategory: 'Président',
        roleDetail: 'Conteuse & Présidente',
        photoUrl: '/assets/protagonists/adjovi-blandine.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
        question: 'Pourquoi un conte transmis le soir sous l’arbre à palabres forge-t-il le caractère pour la vie ?'
      },
      {
        id: 'doli-2',
        name: 'Gérard Hountondji',
        roleCategory: 'Secrétaire',
        roleDetail: 'Animateur pédagogique',
        photoUrl: '/assets/duos/kwame-mensah.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        question: 'Comment amener les écoles urbaines à réintégrer les légendes locales dans leurs programmes ?'
      },
      {
        id: 'doli-3',
        name: 'Victoire Mensah',
        roleCategory: 'Trésorière',
        roleDetail: 'Gestionnaire des tournées de contes',
        photoUrl: '/assets/duos/fatou-diallo.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        question: 'Comment financer des spectacles de marionnettes gratuits dans les villages lacustres ?'
      },
      {
        id: 'doli-4',
        name: 'Koffi Mensah',
        roleCategory: 'Membre',
        roleDetail: 'Joueur de sanza et percussionniste',
        photoUrl: '/assets/protagonists/chef-koffi.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        question: 'Comment la musique capte-t-elle l’attention d’une assemblée de 200 enfants émerveillés ?'
      },
      {
        id: 'doli-5',
        name: 'Solange Koudjo',
        roleCategory: 'Bénévole',
        roleDetail: 'Illustratrice de contes',
        photoUrl: '/assets/protagonists/amara-tisserande.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
        question: 'Comment dessiner les animaux totémiques avec les couleurs de nos terres ocres ?'
      },
      {
        id: 'doli-6',
        name: 'Dah Zounon',
        roleCategory: 'Bienfaiteur',
        roleDetail: 'Mémoire vivante des récits oubliés',
        photoUrl: '/assets/duos/dah-zounon.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        question: 'Quelle fable sur la tortue et la ruse éclaire le mieux les dilemmes du pouvoir ?'
      },
      {
        id: 'doli-7',
        name: 'Pascal Houndé',
        roleCategory: 'Partenaire',
        roleDetail: 'Cinéaste pour l’enfance',
        photoUrl: '/assets/duos/coach-office.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        question: 'Comment adapter les contes de Doli Doli en courts métrages animés ?'
      },
      {
        id: 'doli-8',
        name: 'Sika Dossou',
        roleCategory: 'Collaborateur',
        roleDetail: 'Médiatrice des bibliothèques de rue',
        photoUrl: '/assets/protagonists/sika-dossou.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
        question: 'Pourquoi poser une natte et une malle de livres dans un marché déclenche une ruée d’enfants ?'
      },
      {
        id: 'doli-9',
        name: 'Armel Hounkpatin',
        roleCategory: 'Client',
        roleDetail: 'Directeur de centre aéré',
        photoUrl: '/assets/protagonists/armel-hounkpatin.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        question: 'Quel impact observez-vous sur l’empathie des enfants après une semaine de contes ?'
      },
      {
        id: 'doli-10',
        name: 'Éléonore Vance',
        roleCategory: 'Bienfaiteur',
        roleDetail: 'Donatrice de nattes et malles de livres',
        photoUrl: '/assets/duos/eleonore-vance.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        question: 'Pourquoi le droit à l’émerveillement est-il aussi vital que le droit à la nutrition ?'
      },
      {
        id: 'doli-11',
        name: 'Codjo Gbédji',
        roleCategory: 'Membre',
        roleDetail: 'Conteur en langues régionales',
        photoUrl: '/assets/protagonists/codjo-blind.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
        question: 'Comment faire vibrer la sonorité d’une onomatopée ancestrale auprès des tout-petits ?'
      },
      {
        id: 'doli-12',
        name: 'Hélène Saint-Amand',
        roleCategory: 'Partenaire',
        roleDetail: 'Défenseure des droits de l’enfant',
        photoUrl: '/assets/protagonists/helene-saint-amand.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        question: 'Comment le conte apprend-il aux enfants à dire non à la violence et à l’injustice ?'
      },
      {
        id: 'doli-13',
        name: 'Tobi Houndégla',
        roleCategory: 'Collaborateur',
        roleDetail: 'Photographe des tournées',
        photoUrl: '/assets/protagonists/tobi-houndegla.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        question: 'Comment immortaliser l’éclat de rire spontané d’un enfant sans déranger la magie ?'
      },
      {
        id: 'doli-14',
        name: 'Malik Diop',
        roleCategory: 'Membre',
        roleDetail: 'Comédien mime',
        photoUrl: '/assets/duos/malik-diop.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
        question: 'Pourquoi le corps du comédien doit-il devenir tour à tour lion, crocodile ou vent ?'
      },
      {
        id: 'doli-15',
        name: 'Clara Dossou',
        roleCategory: 'Bénévole',
        roleDetail: 'Animatrice d’ateliers d’écriture',
        photoUrl: '/assets/duos/photographer-focus.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        question: 'Comment encourager un enfant timide à inventer la fin d’une histoire ?'
      },
      {
        id: 'doli-16',
        name: 'Père Matthieu',
        roleCategory: 'Bienfaiteur',
        roleDetail: 'Mécène d’espaces d’accueil paroissiaux',
        photoUrl: '/assets/protagonists/pere-matthieu.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
        question: 'Pourquoi ouvrir les cours d’églises aux contes profanes réconcilie foi et tradition ?'
      }
    ]
  },

  // 4. MTN Bénin (Télécommunications, Inclusion financière & Fondation - 16 intervenants)
  {
    id: 'mtn-benin',
    category: 'Télécoms & Numérique',
    companyName: 'MTN Bénin',
    photoUrl: '/assets/directions/marques-tech.jpg',
    logoUrl: '/assets/directions/marques-tech.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    manifestoVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    manifestoTitle: 'Manifeste MTN Bénin : Relier chaque vie',
    manifestoQuestion: 'Comment la connectivité mobile brise-t-elle l’isolement géographique de nos terroirs ?',
    manifestoDescription: 'Opérateur leader des télécommunications et pionnier du paiement mobile avec Mobile Money, soutenant l’éducation et les créateurs locaux via sa Fondation.',
    tagline: 'Partout où vous allez, la vie connectée',
    stakeholders: [
      {
        id: 'mtn-1',
        name: 'Uche Ofodile',
        roleCategory: 'Fondateur',
        roleDetail: 'Directrice Générale',
        photoUrl: '/assets/duos/eleonore-vance.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        question: 'Comment faire du numérique le plus grand accélérateur d’inclusion pour les femmes rurales ?'
      },
      {
        id: 'mtn-2',
        name: 'Serge Houndégla',
        roleCategory: 'Collaborateur',
        roleDetail: 'Directeur Réseau & Infrastructures',
        photoUrl: '/assets/duos/coach-office.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        question: 'Quel défi technique pour déployer la fibre optique à travers les zones inondables du lac Nokoué ?'
      },
      {
        id: 'mtn-3',
        name: 'Fatou Diallo',
        roleCategory: 'Partenaire',
        roleDetail: 'Responsable Fondation MTN',
        photoUrl: '/assets/duos/fatou-diallo.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
        question: 'Comment équiper 100 salles de classe numériques dans les collèges les plus reculés ?'
      },
      {
        id: 'mtn-4',
        name: 'Kwame Mensah',
        roleCategory: 'Client',
        roleDetail: 'Agent Mobile Money',
        photoUrl: '/assets/duos/kwame-mensah.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        question: 'Comment le kiosque de paiement est devenu le cœur battant du commerce de notre quartier ?'
      },
      {
        id: 'mtn-5',
        name: 'Blandine Adjovi',
        roleCategory: 'Collaborateur',
        roleDetail: 'Cheffe de projet Fintech',
        photoUrl: '/assets/protagonists/adjovi-blandine.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
        question: 'Comment concevoir une application de micro-épargne accessible aux non-lettrés ?'
      },
      {
        id: 'mtn-6',
        name: 'Codjo Gbédji',
        roleCategory: 'Fournisseur',
        roleDetail: 'Installateur pylônes solaires',
        photoUrl: '/assets/protagonists/codjo-blind.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        question: 'Comment alimenter les antennes relais en énergie 100% solaire sans coupure ?'
      },
      {
        id: 'mtn-7',
        name: 'Marc Houndégla',
        roleCategory: 'Partenaire',
        roleDetail: 'Directeur d’incubateur de startups',
        photoUrl: '/assets/duos/athlete-hurdle.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        question: 'Comment l’accès aux API télécoms permet aux jeunes développeurs béninois de créer des licornes ?'
      },
      {
        id: 'mtn-8',
        name: 'Sika Dossou',
        roleCategory: 'Client',
        roleDetail: 'Commerçante de tissus au marché Dantokpa',
        photoUrl: '/assets/protagonists/sika-dossou.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        question: 'Pourquoi recevoir mes paiements par QR code a mis fin aux vols et aux faux billets ?'
      },
      {
        id: 'mtn-9',
        name: 'Armel Hounkpatin',
        roleCategory: 'Collaborateur',
        roleDetail: 'Support technique client',
        photoUrl: '/assets/protagonists/armel-hounkpatin.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
        question: 'Quelle écoute bienveillante résout l’inquiétude d’un client face à une transaction suspendue ?'
      },
      {
        id: 'mtn-10',
        name: 'Hélène Saint-Amand',
        roleCategory: 'Partenaire',
        roleDetail: 'Régulatrice des télécoms',
        photoUrl: '/assets/protagonists/helene-saint-amand.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        question: 'Comment équilibrer concurrence loyale et protection absolue des données personnelles ?'
      },
      {
        id: 'mtn-11',
        name: 'Koffi Mensah',
        roleCategory: 'Fournisseur',
        roleDetail: 'Distributeur de routeurs ruraux',
        photoUrl: '/assets/protagonists/chef-koffi.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
        question: 'Comment connecter les coopératives agricoles pour leur donner le cours du maïs en temps réel ?'
      },
      {
        id: 'mtn-12',
        name: 'Malik Diop',
        roleCategory: 'Bienfaiteur',
        roleDetail: 'Parrain des bourses d’excellence étudiantes',
        photoUrl: '/assets/duos/malik-diop.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        question: 'Pourquoi financer les études d’ingénierie des jeunes filles scientifiques ?'
      },
      {
        id: 'mtn-13',
        name: 'Clara Dossou',
        roleCategory: 'Collaborateur',
        roleDetail: 'Responsable communication de marque',
        photoUrl: '/assets/duos/photographer-focus.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        question: 'Comment parler la langue vivante de la rue tout en incarnant un standard mondial ?'
      },
      {
        id: 'mtn-14',
        name: 'Tobi Houndégla',
        roleCategory: 'Membre',
        roleDetail: 'Créateur de contenu partenaire',
        photoUrl: '/assets/protagonists/tobi-houndegla.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        question: 'Comment la 4G a permis aux vidéastes locaux d’être diffusés sans complexe dans le monde entier ?'
      },
      {
        id: 'mtn-15',
        name: 'Sayri Quispe',
        roleCategory: 'Fournisseur',
        roleDetail: 'Auditeur cybersécurité',
        photoUrl: '/assets/duos/sayri-quispe.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
        question: 'Comment veiller 24h/24 contre les attaques frauduleuses pour sécuriser l’épargne populaire ?'
      },
      {
        id: 'mtn-16',
        name: 'Pascal Cossi',
        roleCategory: 'Partenaire',
        roleDetail: 'Président association d’usagers',
        photoUrl: '/assets/duos/coach-office.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        question: 'Quelle alliance citoyenne garantit la continuité de service lors des intempéries ?'
      }
    ]
  },

  // 5. Canal+ Bénin (Cinéma, Création & Diffusion - 16 intervenants)
  {
    id: 'canal-plus',
    category: 'Cinéma & Diffusion',
    companyName: 'Canal+ Bénin',
    photoUrl: '/assets/directions/marques-services.jpg',
    logoUrl: '/assets/directions/marques-services.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    manifestoVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    manifestoTitle: 'Manifeste Canal+ Bénin : Écrans des talents d’ici',
    manifestoQuestion: 'Comment faire des créateurs africains les premiers narrateurs de leurs destins ?',
    manifestoDescription: 'Acteur majeur de la production audiovisuelle et du rayonnement du cinéma béninois, coproduisant des séries emblématiques et formant les cinéastes de demain.',
    tagline: 'Révéler la grandeur de nos histoires',
    stakeholders: [
      {
        id: 'cplus-1',
        name: 'Yacine Alao',
        roleCategory: 'Fondateur',
        roleDetail: 'Directrice Générale Canal+ Bénin',
        photoUrl: '/assets/protagonists/adjovi-blandine.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        question: 'Pourquoi l’investissement dans la fiction locale est-il le moteur de l’identité africaine ?'
      },
      {
        id: 'cplus-2',
        name: 'Pascal Houndé',
        roleCategory: 'Collaborateur',
        roleDetail: 'Showrunner de série originale',
        photoUrl: '/assets/duos/coach-office.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        question: 'Comment écrire une série chorale ancrée à Cotonou qui passionne Abidjan et Dakar ?'
      },
      {
        id: 'cplus-3',
        name: 'Blandine Adjovi',
        roleCategory: 'Partenaire',
        roleDetail: 'Comédienne principale',
        photoUrl: '/assets/duos/eleonore-vance.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
        question: 'Quel honneur d’incarner une femme de pouvoir africaine sans tomber dans les stéréotypes ?'
      },
      {
        id: 'cplus-4',
        name: 'Koffi Mensah',
        roleCategory: 'Fournisseur',
        roleDetail: 'Directeur de studio de doublage',
        photoUrl: '/assets/protagonists/chef-koffi.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        question: 'Comment adapter les grands films mondiaux en langue fon avec fidélité et gouaille ?'
      },
      {
        id: 'cplus-5',
        name: 'Marc Houndégla',
        roleCategory: 'Client',
        roleDetail: 'Abonné fidèle depuis 15 ans',
        photoUrl: '/assets/duos/kwame-mensah.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
        question: 'En quoi les soirées cinéma en famille rassemblent-elles trois générations sous le même toit ?'
      },
      {
        id: 'cplus-6',
        name: 'Sénan Agossa',
        roleCategory: 'Collaborateur',
        roleDetail: 'Chargée des acquisitions de documentaires',
        photoUrl: '/assets/protagonists/senan-agossa.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        question: 'Quelle pépite narrative recherche-t-on lorsqu’on visionne 500 dossiers de jeunes auteurs ?'
      },
      {
        id: 'cplus-7',
        name: 'Codjo Gbédji',
        roleCategory: 'Partenaire',
        roleDetail: 'Responsable de salle de cinéma',
        photoUrl: '/assets/protagonists/codjo-blind.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        question: 'Pourquoi la magie du grand écran noir partagé en salle ne sera jamais remplacée par la télé ?'
      },
      {
        id: 'cplus-8',
        name: 'Fatou Diallo',
        roleCategory: 'Membre',
        roleDetail: 'Lauréate du concours jeunes talents',
        photoUrl: '/assets/duos/fatou-diallo.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        question: 'Comment ce prix m’a permis de réaliser mon premier court-métrage à 22 ans ?'
      },
      {
        id: 'cplus-9',
        name: 'Armel Hounkpatin',
        roleCategory: 'Fournisseur',
        roleDetail: 'Constructeur de décors de cinéma',
        photoUrl: '/assets/protagonists/armel-hounkpatin.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
        question: 'Comment reconstituer un palais royal d’Abomey du XIXe siècle avec des matériaux locaux ?'
      },
      {
        id: 'cplus-10',
        name: 'Hélène Saint-Amand',
        roleCategory: 'Partenaire',
        roleDetail: 'Conseillère juridique audiovisuelle',
        photoUrl: '/assets/protagonists/helene-saint-amand.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        question: 'Comment structurer des contrats de coproduction équitables pour nos réalisateurs ?'
      },
      {
        id: 'cplus-11',
        name: 'Malik Diop',
        roleCategory: 'Bienfaiteur',
        roleDetail: 'Président du jury des festivals de films',
        photoUrl: '/assets/duos/malik-diop.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
        question: 'Pourquoi le cinéma béninois est-il à l’aube de son âge d’or continental ?'
      },
      {
        id: 'cplus-12',
        name: 'Tobi Houndégla',
        roleCategory: 'Collaborateur',
        roleDetail: 'Technicien de transmission satellite',
        photoUrl: '/assets/protagonists/tobi-houndegla.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        question: 'Comment maintenir le signal HD impeccable pendant les tornades de la saison des pluies ?'
      },
      {
        id: 'cplus-13',
        name: 'Clara Dossou',
        roleCategory: 'Client',
        roleDetail: 'Propriétaire de maquis diffuseur des matchs',
        photoUrl: '/assets/duos/photographer-focus.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        question: 'Comment les retransmissions sportives transforment-elles mon restaurant en fête populaire ?'
      },
      {
        id: 'cplus-14',
        name: 'Dah Zounon',
        roleCategory: 'Membre',
        roleDetail: 'Conseiller historique aux scénarios',
        photoUrl: '/assets/duos/dah-zounon.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        question: 'Comment veiller à ce qu’une fiction respecte la dignité des ancêtres représentés ?'
      },
      {
        id: 'cplus-15',
        name: 'Sayri Quispe',
        roleCategory: 'Fournisseur',
        roleDetail: 'Ingénieur effets spéciaux numériques',
        photoUrl: '/assets/duos/sayri-quispe.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
        question: 'Comment créer des créatures de contes en 3D qui émeuvent sans trahir l’imaginaire d’ici ?'
      },
      {
        id: 'cplus-16',
        name: 'Pascal Cossi',
        roleCategory: 'Partenaire',
        roleDetail: 'Réalisateur invité de la collection Héritages',
        photoUrl: '/assets/duos/coach-office.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        question: 'Quelle joie de voir un récit intime de pêcheur diffusé dans 25 pays d’Afrique ?'
      }
    ]
  },

  // 6. Suno Solaire (Énergie & Lacustre - 16 intervenants)
  {
    id: 'suno-solaire',
    category: 'Énergie & Climat',
    companyName: 'Suno Solaire',
    photoUrl: '/assets/directions/marques-tech.jpg',
    logoUrl: '/assets/directions/marques-tech.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
    manifestoVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
    manifestoTitle: 'Manifeste Suno Solaire : L’énergie du fleuve',
    manifestoQuestion: 'Comment le soleil peut-il apporter l’indépendance énergétique aux berges ?',
    manifestoDescription: 'Entreprise sociale pionnière de l’électrification solaire pour les villages lacustres et les écoles insulaires du Bénin.',
    tagline: 'L’électricité solaire pour chaque berge',
    stakeholders: [
      {
        id: 'suno-1',
        name: 'Babacar Ndiaye',
        roleCategory: 'Fondateur',
        roleDetail: 'Ingénieur énergie solaire',
        photoUrl: '/assets/duos/kwame-mensah.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
        question: 'Comment le soleil peut-il apporter l’indépendance énergétique aux berges ?'
      },
      {
        id: 'suno-2',
        name: 'Senan Agossa',
        roleCategory: 'Collaborateur',
        roleDetail: 'Cheffe de projet écoles lacustres',
        photoUrl: '/assets/protagonists/senan-agossa.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        question: 'Comment garantir l’accès continu à l’électricité pour les écoles lacustres ?'
      },
      {
        id: 'suno-3',
        name: 'Tobi Houndégla',
        roleCategory: 'Fournisseur',
        roleDetail: 'Recycleur de batteries au lithium',
        photoUrl: '/assets/protagonists/tobi-houndegla.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
        question: 'Quel avenir pour le recyclage local de nos batteries solaires ?'
      },
      {
        id: 'suno-4',
        name: 'Fatou Diallo',
        roleCategory: 'Client',
        roleDetail: 'Maraîchère coopérative',
        photoUrl: '/assets/duos/fatou-diallo.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        question: 'En quoi les glacières solaires ont-elles sauvé la récolte de nos maraîchers ?'
      },
      {
        id: 'suno-5',
        name: 'Chantal Agbo',
        roleCategory: 'Partenaire',
        roleDetail: 'Coordinatrice partenariats verts',
        photoUrl: '/assets/protagonists/adjovi-blandine.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        question: 'Quelle alliance public-privé garantit la durabilité de nos parcs solaires ?'
      },
      {
        id: 'suno-6',
        name: 'Armel Hounkpatin',
        roleCategory: 'Collaborateur',
        roleDetail: 'Installateur sur pirogue atelier',
        photoUrl: '/assets/protagonists/armel-hounkpatin.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        question: 'Comment arrimer des panneaux photovoltaïques sur des toits de chaume lacustres ?'
      },
      {
        id: 'suno-7',
        name: 'Koffi Mensah',
        roleCategory: 'Client',
        roleDetail: 'Pêcheur à la nasse',
        photoUrl: '/assets/protagonists/chef-koffi.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
        question: 'Comment la lumière solaire sur les quais a diminué les accidents de nuit ?'
      },
      {
        id: 'suno-8',
        name: 'Hélène Saint-Amand',
        roleCategory: 'Bienfaiteur',
        roleDetail: 'Fondatrice fondation climat',
        photoUrl: '/assets/protagonists/helene-saint-amand.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        question: 'Pourquoi l’accès à l’énergie propre est la condition première de l’éducation ?'
      },
      {
        id: 'suno-9',
        name: 'Codjo Gbédji',
        roleCategory: 'Partenaire',
        roleDetail: 'Maire adjoint de commune lacustre',
        photoUrl: '/assets/protagonists/codjo-blind.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
        question: 'Comment co-gérer les micro-réseaux avec les conseils de sages du village ?'
      },
      {
        id: 'suno-10',
        name: 'Éléonore Vance',
        roleCategory: 'Collaborateur',
        roleDetail: 'Ingénieure logicielle de télémesure',
        photoUrl: '/assets/duos/eleonore-vance.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        question: 'Comment anticiper les pannes d’onduleurs à distance par capteurs IoT ?'
      },
      {
        id: 'suno-11',
        name: 'Malik Diop',
        roleCategory: 'Fournisseur',
        roleDetail: 'Fabricant de câbles marinisés',
        photoUrl: '/assets/duos/malik-diop.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        question: 'Comment protéger le cuivre de la corrosion saline continue ?'
      },
      {
        id: 'suno-12',
        name: 'Dah Zounon',
        roleCategory: 'Membre',
        roleDetail: 'Gardien des sanctuaires de l’eau',
        photoUrl: '/assets/duos/dah-zounon.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
        question: 'Comment bénir l’énergie du soleil pour qu’elle respecte les esprits de l’eau ?'
      },
      {
        id: 'suno-13',
        name: 'Clara Dossou',
        roleCategory: 'Client',
        roleDetail: 'Institutrice école de Ganvié',
        photoUrl: '/assets/duos/photographer-focus.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        question: 'Quel bonheur de voir mes élèves étudier le soir sous une ampoule LED fiable !'
      },
      {
        id: 'suno-14',
        name: 'Sayri Quispe',
        roleCategory: 'Partenaire',
        roleDetail: 'Chercheur en micro-réseaux isolés',
        photoUrl: '/assets/duos/sayri-quispe.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        question: 'Pourquoi le modèle lacustre béninois inspire les îles du Pacifique et d’Amazonie ?'
      },
      {
        id: 'suno-15',
        name: 'Marc Houndégla',
        roleCategory: 'Collaborateur',
        roleDetail: 'Responsable maintenance préventive',
        photoUrl: '/assets/duos/athlete-hurdle.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
        question: 'Comment former les jeunes du village pour qu’ils soient les réparateurs de demain ?'
      },
      {
        id: 'suno-16',
        name: 'Pascal Houndé',
        roleCategory: 'Bienfaiteur',
        roleDetail: 'Cinéaste témoin de la lumière',
        photoUrl: '/assets/duos/coach-office.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        question: 'Comment la tombée de la nuit éclairée a changé la conversation sous les vérandas ?'
      }
    ]
  },

  // 7. Trans-Lagoon (Transport & Mobilité durable - 16 intervenants)
  {
    id: 'trans-lagoon',
    category: 'Transport & Mobilité',
    companyName: 'Trans-Lagoon',
    photoUrl: '/assets/directions/marques-services.jpg',
    logoUrl: '/assets/directions/marques-services.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    manifestoVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    manifestoTitle: 'Manifeste Trans-Lagoon : Naviguer en paix',
    manifestoQuestion: 'Comment concilier vitesse de navigation et respect des écosystèmes marins ?',
    manifestoDescription: 'Flotte de navettes lacustres à propulsion électrique et hybride reliant Cotonou, Porto-Novo et Ganvié sans bruit ni pollution d’hydrocarbures.',
    tagline: 'Liaisons lacustres écologiques et rapides',
    stakeholders: [
      {
        id: 'trans-1',
        name: 'Armel Hounkpatin',
        roleCategory: 'Fondateur',
        roleDetail: 'Capitaine de marine marchande',
        photoUrl: '/assets/protagonists/armel-hounkpatin.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
        question: 'Comment concilier vitesse de navigation et respect des écosystèmes marins ?'
      },
      {
        id: 'trans-2',
        name: 'Sika Dossou',
        roleCategory: 'Collaborateur',
        roleDetail: 'Cheffe de bord navette rapide',
        photoUrl: '/assets/protagonists/sika-dossou.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        question: 'Quelle discipline quotidienne permet de sécuriser nos traversées nocturnes ?'
      },
      {
        id: 'trans-3',
        name: 'Codjo Gbédji',
        roleCategory: 'Fournisseur',
        roleDetail: 'Constructeur de coques en bois composite',
        photoUrl: '/assets/protagonists/codjo-blind.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        question: 'Pourquoi le moteur électrique est-il la révolution attendue sur nos lagunes ?'
      },
      {
        id: 'trans-4',
        name: 'Malik Diop',
        roleCategory: 'Client',
        roleDetail: 'Usager quotidien Porto-Novo / Cotonou',
        photoUrl: '/assets/duos/malik-diop.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        question: 'Comment le transport propre transforme-t-il la cadence du commerce local ?'
      },
      {
        id: 'trans-5',
        name: 'Nadine Tossou',
        roleCategory: 'Partenaire',
        roleDetail: 'Coordonnatrice sécurité portuaire',
        photoUrl: '/assets/duos/eleonore-vance.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
        question: 'En quoi les corridors fluviaux réinventent-ils l’intégration sous-régionale ?'
      },
      {
        id: 'trans-6',
        name: 'Fatou Diallo',
        roleCategory: 'Collaborateur',
        roleDetail: 'Mécanicienne navale',
        photoUrl: '/assets/duos/fatou-diallo.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
        question: 'Comment entretenir les batteries immergées face à la salinité de l’eau ?'
      },
      {
        id: 'trans-7',
        name: 'Koffi Mensah',
        roleCategory: 'Fournisseur',
        roleDetail: 'Fournisseur de gilets de sauvetage certifiés',
        photoUrl: '/assets/protagonists/chef-koffi.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        question: 'Pourquoi la culture du gilet de sauvetage automatique a sauvé des vies ?'
      },
      {
        id: 'trans-8',
        name: 'Blandine Adjovi',
        roleCategory: 'Client',
        roleDetail: 'Guide touristique lagunaire',
        photoUrl: '/assets/protagonists/adjovi-blandine.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        question: 'Quel plaisir de faire découvrir Ganvié aux voyageurs dans un silence absolu !'
      },
      {
        id: 'trans-9',
        name: 'Pascal Cossi',
        roleCategory: 'Bienfaiteur',
        roleDetail: 'Parrain de l’accessibilité des pontons',
        photoUrl: '/assets/duos/coach-office.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        question: 'Comment aménager chaque embarcadère pour que les non-voyants montent en sécurité ?'
      },
      {
        id: 'trans-10',
        name: 'Marc Houndégla',
        roleCategory: 'Partenaire',
        roleDetail: 'Assureur maritime solidaire',
        photoUrl: '/assets/duos/athlete-hurdle.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        question: 'Comment mutualiser les risques climatiques pour garantir un tarif abordable ?'
      },
      {
        id: 'trans-11',
        name: 'Tobi Houndégla',
        roleCategory: 'Collaborateur',
        roleDetail: 'Pilote de bateau ambulance',
        photoUrl: '/assets/protagonists/tobi-houndegla.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
        question: 'Quelle émotion lorsqu’on transporte une femme sur le point d’accoucher à l’hôpital ?'
      },
      {
        id: 'trans-12',
        name: 'Dah Zounon',
        roleCategory: 'Membre',
        roleDetail: 'Doyen des piroguiers de Ganvié',
        photoUrl: '/assets/duos/dah-zounon.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        question: 'Comment transmettre le secret des chenaux invisibles aux jeunes capitaines ?'
      },
      {
        id: 'trans-13',
        name: 'Clara Dossou',
        roleCategory: 'Client',
        roleDetail: 'Étudiante navetteuse',
        photoUrl: '/assets/duos/photographer-focus.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        question: 'Comment 25 minutes sur l’eau sans embouteillages ont sauvé mon année universitaire ?'
      },
      {
        id: 'trans-14',
        name: 'Sayri Quispe',
        roleCategory: 'Fournisseur',
        roleDetail: 'Développeur billetterie sans contact',
        photoUrl: '/assets/duos/sayri-quispe.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        question: 'Comment valider 500 passagers en 3 minutes grâce à des badges RFID robustes ?'
      },
      {
        id: 'trans-15',
        name: 'Hélène Saint-Amand',
        roleCategory: 'Partenaire',
        roleDetail: 'Présidente association de protection du lac',
        photoUrl: '/assets/protagonists/helene-saint-amand.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
        question: 'Comment le retour des moteurs silencieux a permis aux hérons de nidifier à nouveau ?'
      },
      {
        id: 'trans-16',
        name: 'Kwame Mensah',
        roleCategory: 'Bienfaiteur',
        roleDetail: 'Mécène des navettes scolaires gratuites',
        photoUrl: '/assets/duos/kwame-mensah.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        question: 'Pourquoi aucun enfant du lac ne doit manquer l’école faute de transport ?'
      }
    ]
  },

  // 8. FinSecure Africa (Finance Solidaire & Micro-assurance - 16 intervenants)
  {
    id: 'finsecure-africa',
    category: 'Finance Solidaire',
    companyName: 'FinSecure Africa',
    photoUrl: '/assets/directions/marques-finance.jpg',
    logoUrl: '/assets/directions/marques-finance.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    manifestoVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    manifestoTitle: 'Manifeste FinSecure : La confiance mutualisée',
    manifestoQuestion: 'Comment financer nos créateurs sans les déposséder de leur vision ?',
    manifestoDescription: 'Institution de micro-assurance et de financement participatif dédiée aux coopératives d’artisans, créateurs et agriculteurs familiaux.',
    tagline: 'Micro-assurance et financement des créateurs',
    stakeholders: [
      {
        id: 'fin-1',
        name: 'Hélène Saint-Amand',
        roleCategory: 'Fondateur',
        roleDetail: 'Directrice fondatrice',
        photoUrl: '/assets/protagonists/helene-saint-amand.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        question: 'Comment financer nos créateurs sans les déposséder de leur vision ?'
      },
      {
        id: 'fin-2',
        name: 'Dieudonné Mensah',
        roleCategory: 'Collaborateur',
        roleDetail: 'Analyste crédit éthique',
        photoUrl: '/assets/duos/athlete-hurdle.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        question: 'Quel modèle d’évaluation honore le talent réel des artisans ?'
      },
      {
        id: 'fin-3',
        name: 'Kwame Mensah',
        roleCategory: 'Fournisseur',
        roleDetail: 'Architecte systèmes sécurisés',
        photoUrl: '/assets/duos/kwame-mensah.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        question: 'Comment bâtir une infrastructure financière inviolable et inclusive ?'
      },
      {
        id: 'fin-4',
        name: 'Adjovi Blandine',
        roleCategory: 'Client',
        roleDetail: 'Cheffe d’atelier textile',
        photoUrl: '/assets/protagonists/adjovi-blandine.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        question: 'Qu’a changé pour mon atelier le déblocage d’un micro-crédit solidaire ?'
      },
      {
        id: 'fin-5',
        name: 'Samuel Koudjo',
        roleCategory: 'Partenaire',
        roleDetail: 'Médiateur bancaire coopératif',
        photoUrl: '/assets/protagonists/chef-koffi.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        question: 'Comment connecter les coopératives rurales aux banques régionales ?'
      },
      {
        id: 'fin-6',
        name: 'Fatou Diallo',
        roleCategory: 'Collaborateur',
        roleDetail: 'Gestionnaire de risques tontines',
        photoUrl: '/assets/duos/fatou-diallo.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
        question: 'Comment digitaliser la tontine sans briser la confiance du cercle humain ?'
      },
      {
        id: 'fin-7',
        name: 'Codjo Gbédji',
        roleCategory: 'Client',
        roleDetail: 'Pêcheur assuré contre les tempêtes',
        photoUrl: '/assets/protagonists/codjo-blind.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
        question: 'Comment l’assurance paramétrique m’a indemnisé en 48 heures après la tornade ?'
      },
      {
        id: 'fin-8',
        name: 'Éléonore Vance',
        roleCategory: 'Partenaire',
        roleDetail: 'Experte en finance d’impact',
        photoUrl: '/assets/duos/eleonore-vance.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        question: 'Pourquoi l’impact social doit être mesuré avec la même rigueur que le rendement ?'
      },
      {
        id: 'fin-9',
        name: 'Armel Hounkpatin',
        roleCategory: 'Fournisseur',
        roleDetail: 'Évaluateur d’équipements gagés',
        photoUrl: '/assets/protagonists/armel-hounkpatin.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        question: 'Comment estimer la valeur juste d’une pirogue ou d’un métier à tisser ?'
      },
      {
        id: 'fin-10',
        name: 'Malik Diop',
        roleCategory: 'Bienfaiteur',
        roleDetail: 'Garant du fonds d’amorçage jeunes',
        photoUrl: '/assets/duos/malik-diop.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
        question: 'Pourquoi faire confiance à la parole d’honneur d’un jeune sans garantie matérielle ?'
      },
      {
        id: 'fin-11',
        name: 'Sika Dossou',
        roleCategory: 'Collaborateur',
        roleDetail: 'Conseillère en éducation financière',
        photoUrl: '/assets/protagonists/sika-dossou.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        question: 'Comment enseigner la tenue d’un livre de caisse avec des symboles visuels simples ?'
      },
      {
        id: 'fin-12',
        name: 'Tobi Houndégla',
        roleCategory: 'Client',
        roleDetail: 'Maraîcher biologique financé',
        photoUrl: '/assets/protagonists/tobi-houndegla.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        question: 'Comment mon forage solaire a triplé mes rendements sans m’endetter à l’usure ?'
      },
      {
        id: 'fin-13',
        name: 'Pascal Cossi',
        roleCategory: 'Bienfaiteur',
        roleDetail: 'Administrateur éthique',
        photoUrl: '/assets/duos/coach-office.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        question: 'Pourquoi l’argent doit-il toujours rester le serviteur de la dignité humaine ?'
      },
      {
        id: 'fin-14',
        name: 'Clara Dossou',
        roleCategory: 'Membre',
        roleDetail: 'Sociétaire de la coopérative de crédit',
        photoUrl: '/assets/duos/photographer-focus.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
        question: 'Quel pouvoir de voter sur les orientations du taux d’intérêt lors de l’assemblée générale !'
      },
      {
        id: 'fin-15',
        name: 'Sayri Quispe',
        roleCategory: 'Fournisseur',
        roleDetail: 'Développeur blockchain solidaire',
        photoUrl: '/assets/duos/sayri-quispe.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        question: 'Comment tracer chaque franc prêté pour garantir l’absence totale de corruption ?'
      },
      {
        id: 'fin-16',
        name: 'Dah Zounon',
        roleCategory: 'Partenaire',
        roleDetail: 'Garant moral coutumier',
        photoUrl: '/assets/duos/dah-zounon.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
        question: 'Pourquoi le serment sous l’arbre sacré est plus respecté que n’importe quel papier timbré ?'
      }
    ]
  },

  // 9. AfriCode Tech (Technologie & Code souverain - 16 intervenants)
  {
    id: 'africode-tech',
    category: 'Technologie & Code',
    companyName: 'AfriCode Tech',
    photoUrl: '/assets/directions/expertises-numerique.jpg',
    logoUrl: '/assets/directions/expertises-numerique.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    manifestoVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    manifestoTitle: 'Manifeste AfriCode : Le code source de nos destins',
    manifestoQuestion: 'Pourquoi l’Afrique doit-elle posséder son propre code source ?',
    manifestoDescription: 'Collectif d’ingénieurs logiciels développant des infrastructures informatiques souveraines, résilientes et adaptées aux réalités énergétiques et réseau d’Afrique.',
    tagline: 'Plateformes logicielles souveraines et résilientes',
    stakeholders: [
      {
        id: 'tech-1',
        name: 'Éléonore Vance',
        roleCategory: 'Fondateur',
        roleDetail: 'Directrice technique & architecte',
        photoUrl: '/assets/duos/eleonore-vance.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        question: 'Pourquoi l’Afrique doit-elle posséder son propre code source ?'
      },
      {
        id: 'tech-2',
        name: 'Clara Dossou',
        roleCategory: 'Collaborateur',
        roleDetail: 'Lead designer UI/UX',
        photoUrl: '/assets/duos/photographer-focus.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        question: 'Comment le design d’interface peut-il refléter notre sensibilité esthétique ?'
      },
      {
        id: 'tech-3',
        name: 'Sayri Quispe',
        roleCategory: 'Fournisseur',
        roleDetail: 'Constructeur de mini-serveurs hors réseau',
        photoUrl: '/assets/duos/sayri-quispe.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
        question: 'Quel rôle pour les serveurs basse consommation face aux coupures réseau ?'
      },
      {
        id: 'tech-4',
        name: 'Mahougnon Zounon',
        roleCategory: 'Client',
        roleDetail: 'Directeur de centre de recherche',
        photoUrl: '/assets/duos/dah-zounon.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        question: 'Comment la technologie réconcilie-t-elle traditions et futur ?'
      },
      {
        id: 'tech-5',
        name: 'Tariq Al-Mansoor',
        roleCategory: 'Partenaire',
        roleDetail: 'Fondateur communauté open source',
        photoUrl: '/assets/duos/sayri-quispe.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
        question: 'Comment l’interopérabilité open source décuple-t-elle l’innovation africaine ?'
      },
      {
        id: 'tech-6',
        name: 'Fatou Diallo',
        roleCategory: 'Collaborateur',
        roleDetail: 'Ingénieure en intelligence artificielle locale',
        photoUrl: '/assets/duos/fatou-diallo.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        question: 'Comment entraîner des modèles de langage sur nos 50 langues nationales ?'
      },
      {
        id: 'tech-7',
        name: 'Kwame Mensah',
        roleCategory: 'Client',
        roleDetail: 'Fondateur d’école de code',
        photoUrl: '/assets/duos/kwame-mensah.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        question: 'Pourquoi former 10 000 jeunes au Python change la géopolitique du continent ?'
      },
      {
        id: 'tech-8',
        name: 'Blandine Adjovi',
        roleCategory: 'Collaborateur',
        roleDetail: 'Responsable assurance qualité logicielle',
        photoUrl: '/assets/protagonists/adjovi-blandine.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        question: 'Pourquoi zéro bug critique est la condition absolue pour les logiciels de santé ?'
      },
      {
        id: 'tech-9',
        name: 'Armel Hounkpatin',
        roleCategory: 'Fournisseur',
        roleDetail: 'Hébergeur vert à Cotonou',
        photoUrl: '/assets/protagonists/armel-hounkpatin.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
        question: 'Comment garder nos données stockées physiquement sur notre sol national ?'
      },
      {
        id: 'tech-10',
        name: 'Hélène Saint-Amand',
        roleCategory: 'Partenaire',
        roleDetail: 'Avocate spécialiste RGPD africain',
        photoUrl: '/assets/protagonists/helene-saint-amand.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        question: 'Comment empêcher les géants étrangers d’aspirer gratuitement nos données génétiques et culturelles ?'
      },
      {
        id: 'tech-11',
        name: 'Koffi Mensah',
        roleCategory: 'Membre',
        roleDetail: 'Développeur mobile offline-first',
        photoUrl: '/assets/protagonists/chef-koffi.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
        question: 'Comment faire tourner une app complexe avec 0 ko de connexion pendant 3 semaines ?'
      },
      {
        id: 'tech-12',
        name: 'Malik Diop',
        roleCategory: 'Bienfaiteur',
        roleDetail: 'Business angel tech',
        photoUrl: '/assets/duos/malik-diop.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        question: 'Pourquoi je préfère investir dans nos codeurs locaux que dans les valeurs boursières occidentales ?'
      },
      {
        id: 'tech-13',
        name: 'Sika Dossou',
        roleCategory: 'Collaborateur',
        roleDetail: 'Administratrice de bases de données',
        photoUrl: '/assets/protagonists/sika-dossou.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        question: 'Comment concevoir des schémas résilients capables de synchronisation pair-à-pair ?'
      },
      {
        id: 'tech-14',
        name: 'Tobi Houndégla',
        roleCategory: 'Client',
        roleDetail: 'Entrepreneur agricole connecté',
        photoUrl: '/assets/protagonists/tobi-houndegla.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        question: 'Comment l’application météo développée par AfriCode a sauvé mes 50 hectares d’ananas ?'
      },
      {
        id: 'tech-15',
        name: 'Codjo Gbédji',
        roleCategory: 'Partenaire',
        roleDetail: 'Accessibilité numérique pour aveugles',
        photoUrl: '/assets/protagonists/codjo-blind.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
        question: 'Comment auditer chaque ligne de CSS pour que les lecteurs d’écran ne trébuchent jamais ?'
      },
      {
        id: 'tech-16',
        name: 'Pascal Houndé',
        roleCategory: 'Bienfaiteur',
        roleDetail: 'Documentariste des révolutions numériques',
        photoUrl: '/assets/duos/coach-office.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        question: 'Comment filmer la beauté invisible des lignes de code qui changent un continent ?'
      }
    ]
  },

  // 10. Coopérative Ganvié Indigo (Artisanat d'art & Tisseuses - 16 intervenants)
  {
    id: 'coop-ganvie',
    category: 'Artisanat & Textile',
    companyName: 'Coopérative Ganvié Indigo',
    photoUrl: '/assets/protagonists/amara-tisserande.jpg',
    logoUrl: '/assets/protagonists/amara-tisserande.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
    manifestoVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
    manifestoTitle: 'Manifeste Ganvié Indigo : Le fil de nos mères',
    manifestoQuestion: 'Comment le geste séculaire de la teinture protège-t-il la poésie de notre identité ?',
    manifestoDescription: 'Coopérative de 120 tisseuses et artisanes de la lagune, perpétuant le tissage traditionnel au métier à tisser manuel et la teinture à l’indigo naturel.',
    tagline: 'L’art du tissage et de la teinture lagunaire',
    stakeholders: [
      {
        id: 'indigo-1',
        name: 'Amara Diabaté',
        roleCategory: 'Président',
        roleDetail: 'Maîtresse tisseuse & Présidente',
        photoUrl: '/assets/protagonists/amara-tisserande.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
        question: 'Comment chaque motif tissé raconte l’histoire de notre lignée de femmes lagunaires ?'
      },
      {
        id: 'indigo-2',
        name: 'Koffi Tisserand',
        roleCategory: 'Collaborateur',
        roleDetail: 'Maître teinturier à l’indigo',
        photoUrl: '/assets/protagonists/koffi-tisserand.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        question: 'Quel secret végétal donne à notre bleu indigo cette profondeur qui ne déteint jamais ?'
      },
      {
        id: 'indigo-3',
        name: 'Fatou Diallo',
        roleCategory: 'Secrétaire',
        roleDetail: 'Responsable exportation solidaire',
        photoUrl: '/assets/duos/fatou-diallo.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        question: 'Comment vendre nos pièces d’exception à Paris et Tokyo au juste prix pour nos tisseuses ?'
      },
      {
        id: 'indigo-4',
        name: 'Blandine Adjovi',
        roleCategory: 'Trésorière',
        roleDetail: 'Trésorière du fonds mutuel',
        photoUrl: '/assets/protagonists/adjovi-blandine.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
        question: 'Comment assurer une retraite décente et des soins médicaux complets à chaque artisane ?'
      },
      {
        id: 'indigo-5',
        name: 'Dah Zounon',
        roleCategory: 'Bienfaiteur',
        roleDetail: 'Gardien des symboles Fâ tissés',
        photoUrl: '/assets/duos/dah-zounon.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        question: 'Quelle est la signification cachée des losanges et spirales brodés sur les pagnes d’apparat ?'
      },
      {
        id: 'indigo-6',
        name: 'Clara Dossou',
        roleCategory: 'Collaborateur',
        roleDetail: 'Styliste contemporaine associée',
        photoUrl: '/assets/duos/photographer-focus.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        question: 'Comment marier le pagne traditionnel lourd aux coupes épurées de la mode contemporaine ?'
      },
      {
        id: 'indigo-7',
        name: 'Armel Hounkpatin',
        roleCategory: 'Fournisseur',
        roleDetail: 'Piroguier transporteur de feuilles d’indigo',
        photoUrl: '/assets/protagonists/armel-hounkpatin.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
        question: 'Comment récolter les feuilles fraîches à l’aube pour préserver la pigmentation vivante ?'
      },
      {
        id: 'indigo-8',
        name: 'Hélène Saint-Amand',
        roleCategory: 'Partenaire',
        roleDetail: 'Présidente label commerce équitable',
        photoUrl: '/assets/protagonists/helene-saint-amand.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        question: 'Pourquoi labelliser l’artisanat d’art protège les créatrices contre la contrefaçon industrielle ?'
      },
      {
        id: 'indigo-9',
        name: 'Pascal Cossi',
        roleCategory: 'Bienfaiteur',
        roleDetail: 'Mécène d’ateliers d’apprentissage',
        photoUrl: '/assets/duos/coach-office.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        question: 'Comment donner envie aux jeunes filles déscolarisées d’apprendre la noblesse du métier ?'
      },
      {
        id: 'indigo-10',
        name: 'Sika Dossou',
        roleCategory: 'Membre',
        roleDetail: 'Apprentie tisseuse de 19 ans',
        photoUrl: '/assets/protagonists/sika-dossou.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
        question: 'Quelle fierté de manier la navette de bois et d’entendre son claquement rythmé dans l’atelier !'
      },
      {
        id: 'indigo-11',
        name: 'Marc Houndégla',
        roleCategory: 'Client',
        roleDetail: 'Collectionneur d’art textile',
        photoUrl: '/assets/duos/athlete-hurdle.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        question: 'Pourquoi une pièce de Ganvié Indigo a plus de valeur spirituelle qu’une toile de maître ?'
      },
      {
        id: 'indigo-12',
        name: 'Éléonore Vance',
        roleCategory: 'Partenaire',
        roleDetail: 'Curatrice d’exposition internationale',
        photoUrl: '/assets/duos/eleonore-vance.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
        question: 'Comment porter les tissages du Bénin au pavillon d’honneur de la biennale de Venise ?'
      },
      {
        id: 'indigo-13',
        name: 'Tobi Houndégla',
        roleCategory: 'Collaborateur',
        roleDetail: 'Photographe officiel des collections',
        photoUrl: '/assets/protagonists/tobi-houndegla.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        question: 'Comment capturer la texture serrée du coton sauvage sous les reflets de l’eau lagunaire ?'
      },
      {
        id: 'indigo-14',
        name: 'Codjo Gbédji',
        roleCategory: 'Fournisseur',
        roleDetail: 'Menuisier fabricant de métiers à tisser',
        photoUrl: '/assets/protagonists/codjo-blind.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        question: 'Quel bois imputrescible choisir pour que le métier résiste 40 ans à l’humidité du lac ?'
      },
      {
        id: 'indigo-15',
        name: 'Malik Diop',
        roleCategory: 'Bienfaiteur',
        roleDetail: 'Mécène pour la construction de l’atelier sur pilotis',
        photoUrl: '/assets/duos/malik-diop.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        question: 'Pourquoi bâtir un atelier lumineux sur pilotis pour préserver la santé des tisseuses ?'
      },
      {
        id: 'indigo-16',
        name: 'Sayri Quispe',
        roleCategory: 'Partenaire',
        roleDetail: 'Ingénieur en teintures végétales écologiques',
        photoUrl: '/assets/duos/sayri-quispe.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
        question: 'Comment recycler les bains de teinture pour que pas une goutte toxique ne finisse dans la lagune ?'
      }
    ]
  },

  // 11. Éco-Ferme de Ouidah (Agro-écologie & Semences paysannes - 16 intervenants)
  {
    id: 'ecoferme-ouidah',
    category: 'Agro-écologie & Terroir',
    companyName: 'Éco-Ferme de Ouidah',
    photoUrl: '/assets/directions/terroir-vivant.jpg',
    logoUrl: '/assets/directions/terroir-vivant.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    manifestoVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    manifestoTitle: 'Manifeste Éco-Ferme : Nourrir la terre pour nourrir l’homme',
    manifestoQuestion: 'Comment régénérer la terre de nos ancêtres sans engrais chimiques ?',
    manifestoDescription: 'Centre pilote d’agroforesterie, de conservation des semences locales et de formation des jeunes maraîchers aux pratiques permacoles durables.',
    tagline: 'Semences paysannes et souveraineté alimentaire',
    stakeholders: [
      {
        id: 'ferme-1',
        name: 'Tobi Houndégla',
        roleCategory: 'Fondateur',
        roleDetail: 'Agronome permaculteur',
        photoUrl: '/assets/protagonists/tobi-houndegla.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        question: 'Comment régénérer la terre de nos ancêtres sans engrais chimiques ?'
      },
      {
        id: 'ferme-2',
        name: 'Fatou Diallo',
        roleCategory: 'Collaborateur',
        roleDetail: 'Responsable de la banque de semences',
        photoUrl: '/assets/duos/fatou-diallo.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        question: 'Pourquoi protéger nos variétés de maïs blanc ancien contre les hybrides stériles ?'
      },
      {
        id: 'ferme-3',
        name: 'Pascal Houndé',
        roleCategory: 'Partenaire',
        roleDetail: 'Formateur en compostage bokashi',
        photoUrl: '/assets/duos/coach-office.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
        question: 'Comment transformer les déchets de marché en or noir pour les cultures ?'
      },
      {
        id: 'ferme-4',
        name: 'Koffi Mensah',
        roleCategory: 'Client',
        roleDetail: 'Restaurateur du terroir',
        photoUrl: '/assets/protagonists/chef-koffi.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
        question: 'Quel goût incomparable apporte un piment poussé sans aucun pesticide !'
      },
      {
        id: 'ferme-5',
        name: 'Blandine Adjovi',
        roleCategory: 'Membre',
        roleDetail: 'Pépiniériste d’arbres fruitiers',
        photoUrl: '/assets/protagonists/adjovi-blandine.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        question: 'Comment greffer les manguiers sauvages pour assurer des récoltes échelonnées ?'
      },
      {
        id: 'ferme-6',
        name: 'Codjo Gbédji',
        roleCategory: 'Fournisseur',
        roleDetail: 'Fabricant de ruches traditionnelles',
        photoUrl: '/assets/protagonists/codjo-blind.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        question: 'Pourquoi les abeilles sont les véritables ouvrières de la pollinisation maraîchère ?'
      },
      {
        id: 'ferme-7',
        name: 'Dah Zounon',
        roleCategory: 'Bienfaiteur',
        roleDetail: 'Doyen des semailles sacrées',
        photoUrl: '/assets/duos/dah-zounon.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        question: 'Quelle prière accompagne la mise en terre de la première graine d’igname ?'
      },
      {
        id: 'ferme-8',
        name: 'Armel Hounkpatin',
        roleCategory: 'Collaborateur',
        roleDetail: 'Responsable de l’irrigation goutte-à-goutte solaire',
        photoUrl: '/assets/protagonists/armel-hounkpatin.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
        question: 'Comment économiser 80% d’eau tout en multipliant la vigueur des plants ?'
      },
      {
        id: 'ferme-9',
        name: 'Éléonore Vance',
        roleCategory: 'Partenaire',
        roleDetail: 'Coordinatrice réseau permaculture ouest-africain',
        photoUrl: '/assets/duos/eleonore-vance.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        question: 'Comment essaimer 50 éco-fermes familiales à travers le Bénin d’ici 2030 ?'
      },
      {
        id: 'ferme-10',
        name: 'Sika Dossou',
        roleCategory: 'Client',
        roleDetail: 'Mère de famille adhérente panier bio',
        photoUrl: '/assets/protagonists/sika-dossou.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
        question: 'Comment nourrir mes quatre enfants sainement sans dépasser mon budget modeste ?'
      },
      {
        id: 'ferme-11',
        name: 'Marc Houndégla',
        roleCategory: 'Fournisseur',
        roleDetail: 'Éleveur fournisseur de fumier composté',
        photoUrl: '/assets/duos/athlete-hurdle.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        question: 'Comment boucler la boucle entre polyculture et élevage pastoral respectueux ?'
      },
      {
        id: 'ferme-12',
        name: 'Hélène Saint-Amand',
        roleCategory: 'Bienfaiteur',
        roleDetail: 'Juriste protectrice des terres agricoles communales',
        photoUrl: '/assets/protagonists/helene-saint-amand.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        question: 'Comment sanctuariser les terres paysannes face à la spéculation immobilière sauvage ?'
      },
      {
        id: 'ferme-13',
        name: 'Clara Dossou',
        roleCategory: 'Collaborateur',
        roleDetail: 'Animatrice de la ferme pédagogique enfants',
        photoUrl: '/assets/duos/photographer-focus.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        question: 'Pourquoi faire toucher la terre vivante à un enfant de la ville change son avenir ?'
      },
      {
        id: 'ferme-14',
        name: 'Malik Diop',
        roleCategory: 'Partenaire',
        roleDetail: 'Président association des marchés bio',
        photoUrl: '/assets/duos/malik-diop.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
        question: 'Comment créer des circuits courts directs du champ à l’assiette à Cotonou ?'
      },
      {
        id: 'ferme-15',
        name: 'Sayri Quispe',
        roleCategory: 'Fournisseur',
        roleDetail: 'Installateur capteurs d’humidité du sol',
        photoUrl: '/assets/duos/sayri-quispe.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        question: 'Comment mesurer la vitalité mycorhizienne des racines par des sondes artisanales ?'
      },
      {
        id: 'ferme-16',
        name: 'Pascal Cossi',
        roleCategory: 'Bienfaiteur',
        roleDetail: 'Mécène de la forêt sanctuaire attenante',
        photoUrl: '/assets/duos/coach-office.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
        question: 'Pourquoi préserver un bosquet sacré sauvage au milieu de chaque exploitation agricole ?'
      }
    ]
  },

  // 12. Théâtre Vivant de Cotonou (Arts de la scène & Récits oraux - 16 intervenants)
  {
    id: 'theatre-cotonou',
    category: 'Théâtre & Scène',
    companyName: 'Théâtre Vivant de Cotonou',
    photoUrl: '/assets/directions/arts-vivants.jpg',
    logoUrl: '/assets/directions/arts-vivants.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    manifestoVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    manifestoTitle: 'Manifeste Théâtre Vivant : La scène comme miroir du peuple',
    manifestoQuestion: 'Comment le verbe et le geste sur scène éveillent-ils la conscience politique et poétique ?',
    manifestoDescription: 'Troupe théâtrale engagée dans la création chorale, le théâtre d’intervention sociale et la valorisation du répertoire dramatique africain contemporain.',
    tagline: 'L’émotion partagée au cœur de la cité',
    stakeholders: [
      {
        id: 'th-1',
        name: 'Malik Diop',
        roleCategory: 'Fondateur',
        roleDetail: 'Metteur en scène & Comédien',
        photoUrl: '/assets/duos/malik-diop.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
        question: 'Comment le verbe et le geste sur scène éveillent-ils la conscience politique et poétique ?'
      },
      {
        id: 'th-2',
        name: 'Blandine Adjovi',
        roleCategory: 'Collaborateur',
        roleDetail: 'Comédienne tragédienne',
        photoUrl: '/assets/protagonists/adjovi-blandine.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        question: 'Quel courage exige d’incarner la douleur collective d’une nation sur les planches ?'
      },
      {
        id: 'th-3',
        name: 'Pascal Houndé',
        roleCategory: 'Partenaire',
        roleDetail: 'Scénographe et dramaturge',
        photoUrl: '/assets/duos/coach-office.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        question: 'Comment concevoir un espace scénique en terre crue et bambous qui respire avec les acteurs ?'
      },
      {
        id: 'th-4',
        name: 'Koffi Mensah',
        roleCategory: 'Collaborateur',
        roleDetail: 'Maître percussionniste de scène',
        photoUrl: '/assets/protagonists/chef-koffi.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
        question: 'Comment le tambour dialogue avec la respiration de l’acteur sans couvrir sa voix ?'
      },
      {
        id: 'th-5',
        name: 'Fatou Diallo',
        roleCategory: 'Secrétaire',
        roleDetail: 'Administratrice de tournée',
        photoUrl: '/assets/duos/fatou-diallo.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        question: 'Comment organiser un convoi de 25 comédiens et décors sur 3000 kilomètres de pistes ?'
      },
      {
        id: 'th-6',
        name: 'Codjo Gbédji',
        roleCategory: 'Fournisseur',
        roleDetail: 'Créateur de masques rituels de scène',
        photoUrl: '/assets/protagonists/codjo-blind.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        question: 'Pourquoi sculpter un masque exige d’abord de demander la permission à l’arbre coupé ?'
      },
      {
        id: 'th-7',
        name: 'Éléonore Vance',
        roleCategory: 'Bienfaiteur',
        roleDetail: 'Présidente fondation théâtre pour tous',
        photoUrl: '/assets/duos/eleonore-vance.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        question: 'Pourquoi chaque représentation doit être accessible à tarif libre pour les habitants du quartier ?'
      },
      {
        id: 'th-8',
        name: 'Armel Hounkpatin',
        roleCategory: 'Fournisseur',
        roleDetail: 'Régisseur lumière et son plein air',
        photoUrl: '/assets/protagonists/armel-hounkpatin.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
        question: 'Comment éclairer une scène sous les étoiles avec des projecteurs basse consommation ?'
      },
      {
        id: 'th-9',
        name: 'Sika Dossou',
        roleCategory: 'Collaborateur',
        roleDetail: 'Costumière textile traditionnel',
        photoUrl: '/assets/protagonists/sika-dossou.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        question: 'Comment chaque pli de tissu révèle la psychologie et le rang du personnage ?'
      },
      {
        id: 'th-10',
        name: 'Dah Zounon',
        roleCategory: 'Membre',
        roleDetail: 'Aède et mémoire des panégyriques',
        photoUrl: '/assets/duos/dah-zounon.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
        question: 'Quelle force surgit quand un comédien clame la devise orikí de sa famille ?'
      },
      {
        id: 'th-11',
        name: 'Marc Houndégla',
        roleCategory: 'Client',
        roleDetail: 'Spectateur assidu et débatteur',
        photoUrl: '/assets/duos/athlete-hurdle.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        question: 'Pourquoi le débat public de 45 minutes après la pièce est-il aussi vital que le spectacle ?'
      },
      {
        id: 'th-12',
        name: 'Clara Dossou',
        roleCategory: 'Collaborateur',
        roleDetail: 'Comédienne jeune espoir',
        photoUrl: '/assets/duos/photographer-focus.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        question: 'Comment surmonter le trac pour donner sa voix à la jeunesse révoltée ?'
      },
      {
        id: 'th-13',
        name: 'Hélène Saint-Amand',
        roleCategory: 'Partenaire',
        roleDetail: 'Médiatrice culturelle scolaire',
        photoUrl: '/assets/protagonists/helene-saint-amand.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        question: 'Comment initier 1500 lycéens au théâtre pour développer leur éloquence républicaine ?'
      },
      {
        id: 'th-14',
        name: 'Tobi Houndégla',
        roleCategory: 'Fournisseur',
        roleDetail: 'Vidéaste capteur de pièces d’archives',
        photoUrl: '/assets/protagonists/tobi-houndegla.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
        question: 'Comment filmer une pièce sans aplatir l’énergie brute transmise au public en direct ?'
      },
      {
        id: 'th-15',
        name: 'Sayri Quispe',
        roleCategory: 'Partenaire',
        roleDetail: 'Ingénieur acoustique de cour',
        photoUrl: '/assets/duos/sayri-quispe.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        question: 'Comment concevoir des réflecteurs en bois pour porter le murmure jusqu’au dernier rang ?'
      },
      {
        id: 'th-16',
        name: 'Pascal Cossi',
        roleCategory: 'Bienfaiteur',
        roleDetail: 'Président d’honneur',
        photoUrl: '/assets/duos/coach-office.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
        question: 'Pourquoi une société sans théâtre vivant perd la faculté d’imaginer sa réconciliation ?'
      }
    ]
  },

  // 13. Mains Solidaires (Santé communautaire & Entraide - 16 intervenants)
  {
    id: 'mains-solidaires',
    category: 'Santé & Entraide',
    companyName: 'Mains Solidaires Bénin',
    photoUrl: '/assets/directions/marques-services.jpg',
    logoUrl: '/assets/directions/marques-services.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    manifestoVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    manifestoTitle: 'Manifeste Mains Solidaires : Soigner ensemble',
    manifestoQuestion: 'Comment garantir l’accès aux soins d’urgence pour chaque famille des zones enclavées ?',
    manifestoDescription: 'Réseau associatif de santé communautaire, dispensaires itinérants et mutuelles villageoises de santé pour les zones rurales et périurbaines.',
    tagline: 'La santé et la dignité pour chaque foyer',
    stakeholders: [
      {
        id: 'ms-1',
        name: 'Dr. Alexis Sossou',
        roleCategory: 'Président',
        roleDetail: 'Médecin généraliste humanitaire',
        photoUrl: '/assets/duos/athlete-hurdle.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        question: 'Comment garantir l’accès aux soins d’urgence pour chaque famille des zones enclavées ?'
      },
      {
        id: 'ms-2',
        name: 'Geneviève Agossa',
        roleCategory: 'Secrétaire',
        roleDetail: 'Sage-femme coordinatrice',
        photoUrl: '/assets/duos/fatou-diallo.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        question: 'Pourquoi la surveillance prénatale de proximité a fait chuter la mortalité maternelle de 70% ?'
      },
      {
        id: 'ms-3',
        name: 'Pascal Cossi',
        roleCategory: 'Bienfaiteur',
        roleDetail: 'Parrain des dispensaires lacustres',
        photoUrl: '/assets/duos/coach-office.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
        question: 'Comment mobiliser les dons pour approvisionner les trousses d’urgence en sérums antivenimeux ?'
      },
      {
        id: 'ms-4',
        name: 'Armel Hounkpatin',
        roleCategory: 'Collaborateur',
        roleDetail: 'Pilote de la pirogue dispensaire',
        photoUrl: '/assets/protagonists/armel-hounkpatin.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        question: 'Quelle émotion lorsqu’on accoste dans un village isolé où le médecin n’était pas venu depuis un an ?'
      },
      {
        id: 'ms-5',
        name: 'Blandine Adjovi',
        roleCategory: 'Membre',
        roleDetail: 'Relais communautaire de santé',
        photoUrl: '/assets/protagonists/adjovi-blandine.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
        question: 'Comment dépister le paludisme chez les nourrissons dès les premiers frissons ?'
      },
      {
        id: 'ms-6',
        name: 'Codjo Gbédji',
        roleCategory: 'Client',
        roleDetail: 'Patient guéri et ambassadeur',
        photoUrl: '/assets/protagonists/codjo-blind.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        question: 'Comment la mutuelle villageoise a pris en charge mon opération sans ruiner ma famille ?'
      },
      {
        id: 'ms-7',
        name: 'Hélène Saint-Amand',
        roleCategory: 'Partenaire',
        roleDetail: 'Représentante fonds mondial santé',
        photoUrl: '/assets/protagonists/helene-saint-amand.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        question: 'Pourquoi soutenir les ONG locales de santé est 10 fois plus efficace que les structures lourdes ?'
      },
      {
        id: 'ms-8',
        name: 'Koffi Mensah',
        roleCategory: 'Fournisseur',
        roleDetail: 'Pharmacien grossiste éthique',
        photoUrl: '/assets/protagonists/chef-koffi.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        question: 'Comment garantir l’authenticité des médicaments essentiels contre le trafic de faux produits ?'
      },
      {
        id: 'ms-9',
        name: 'Sika Dossou',
        roleCategory: 'Collaborateur',
        roleDetail: 'Infirmière en chef itinérante',
        photoUrl: '/assets/protagonists/sika-dossou.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
        question: 'Quelle douceur et autorité morale pour convaincre les familles de faire vacciner leurs bébés ?'
      },
      {
        id: 'ms-10',
        name: 'Dah Zounon',
        roleCategory: 'Bienfaiteur',
        roleDetail: 'Herboriste et sage guérisseur',
        photoUrl: '/assets/duos/dah-zounon.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        question: 'Comment allier les vertus thérapeutiques des plantes de nos forêts aux protocoles médicaux modernes ?'
      },
      {
        id: 'ms-11',
        name: 'Malik Diop',
        roleCategory: 'Partenaire',
        roleDetail: 'Organisateur de marathons solidaires',
        photoUrl: '/assets/duos/malik-diop.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
        question: 'Comment courir 20 km pour financer 100 couveuses artisanales solaires ?'
      },
      {
        id: 'ms-12',
        name: 'Éléonore Vance',
        roleCategory: 'Collaborateur',
        roleDetail: 'Développeuse du carnet de santé numérique',
        photoUrl: '/assets/duos/eleonore-vance.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        question: 'Comment assurer le suivi vaccinal sans connexion internet grâce aux QR codes sur cartes plastifiées ?'
      },
      {
        id: 'ms-13',
        name: 'Tobi Houndégla',
        roleCategory: 'Fournisseur',
        roleDetail: 'Technicien de glacières solaires de vaccins',
        photoUrl: '/assets/protagonists/tobi-houndegla.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        question: 'Comment maintenir la chaîne du froid entre 2°C et 8°C par 42°C à l’ombre ?'
      },
      {
        id: 'ms-14',
        name: 'Clara Dossou',
        roleCategory: 'Bénévole',
        roleDetail: 'Animatrice nutrition infantile',
        photoUrl: '/assets/duos/photographer-focus.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        question: 'Comment confectionner des bouillies enrichies au moringa et au soja pour éradiquer l’anémie ?'
      },
      {
        id: 'ms-15',
        name: 'Sayri Quispe',
        roleCategory: 'Fournisseur',
        roleDetail: 'Opérateur télémédecine par satellite',
        photoUrl: '/assets/duos/sayri-quispe.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
        question: 'Comment permettre à un cardiologue de Cotonou d’analyser un ECG fait dans un village à 500 km ?'
      },
      {
        id: 'ms-16',
        name: 'Pascal Houndé',
        roleCategory: 'Bienfaiteur',
        roleDetail: 'Cinéaste pour la prévention sanitaire',
        photoUrl: '/assets/duos/coach-office.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        question: 'Pourquoi une saynète filmée avec humour éradique plus vite le choléra que les discours moralisateurs ?'
      }
    ]
  },

  // 14. Saveurs du Terroir (Gastronomie & Transformation vivrière - 16 intervenants)
  {
    id: 'bio-benin-saveurs',
    category: 'Gastronomie & Terroir',
    companyName: 'Saveurs du Terroir Bénin',
    photoUrl: '/assets/directions/terroir-vivant.jpg',
    logoUrl: '/assets/directions/terroir-vivant.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    manifestoVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    manifestoTitle: 'Manifeste Saveurs du Terroir : Le goût de notre mémoire',
    manifestoQuestion: 'Comment valoriser nos épices et recettes traditionnelles sur les tables du monde ?',
    manifestoDescription: 'PME agroalimentaire transformant les fruits, épices et céréales locales en produits gastronomiques d’excellence, sans conservateurs chimiques.',
    tagline: 'L’excellence culinaire et vivrière d’Afrique',
    stakeholders: [
      {
        id: 'saveur-1',
        name: 'Koffi Mensah',
        roleCategory: 'Fondateur',
        roleDetail: 'Maître cuisinier & Conservateur des saveurs',
        photoUrl: '/assets/protagonists/chef-koffi.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
        question: 'Comment valoriser nos épices et recettes traditionnelles sur les tables du monde ?'
      },
      {
        id: 'saveur-2',
        name: 'Fatou Diallo',
        roleCategory: 'Collaborateur',
        roleDetail: 'Responsable séchage solaire des fruits',
        photoUrl: '/assets/duos/fatou-diallo.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        question: 'Comment sécher la mangue et l’ananas tout en préservant leurs vitamines et leur moelleux ?'
      },
      {
        id: 'saveur-3',
        name: 'Adjovi Blandine',
        roleCategory: 'Collaborateur',
        roleDetail: 'Maîtresse de fermentation moutarde néré',
        photoUrl: '/assets/protagonists/adjovi-blandine.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        question: 'Pourquoi l’afitin traditionnel est-il l’umami le plus puissant de la gastronomie africaine ?'
      },
      {
        id: 'saveur-4',
        name: 'Armel Hounkpatin',
        roleCategory: 'Client',
        roleDetail: 'Hôtelier engagé produits locaux',
        photoUrl: '/assets/protagonists/armel-hounkpatin.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
        question: 'Pourquoi nos clients étrangers raffolent de notre confiture de papaye au gingembre sauvage ?'
      },
      {
        id: 'saveur-5',
        name: 'Tobi Houndégla',
        roleCategory: 'Fournisseur',
        roleDetail: 'Producteur de curcuma et poivre noir',
        photoUrl: '/assets/protagonists/tobi-houndegla.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        question: 'Quelle fierté de voir nos grains de poivre sélectionnés par les grands chefs étoilés !'
      },
      {
        id: 'saveur-6',
        name: 'Hélène Saint-Amand',
        roleCategory: 'Partenaire',
        roleDetail: 'Experte en certification biologique',
        photoUrl: '/assets/protagonists/helene-saint-amand.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        question: 'Comment garantir l’origine équitable de chaque bocal vendu ?'
      },
      {
        id: 'saveur-7',
        name: 'Codjo Gbédji',
        roleCategory: 'Fournisseur',
        roleDetail: 'Potier fabricant de jarres de fermentation',
        photoUrl: '/assets/protagonists/codjo-blind.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
        question: 'Pourquoi l’argile cuite naturelle régule la température de fermentation mieux que l’inox ?'
      },
      {
        id: 'saveur-8',
        name: 'Dah Zounon',
        roleCategory: 'Bienfaiteur',
        roleDetail: 'Gardien des recettes de cour royale',
        photoUrl: '/assets/duos/dah-zounon.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        question: 'Quelle potion de jouvence composait le bouillon des reines mères de Danxomè ?'
      },
      {
        id: 'saveur-9',
        name: 'Éléonore Vance',
        roleCategory: 'Partenaire',
        roleDetail: 'Directrice réseau épiceries fines africaines',
        photoUrl: '/assets/duos/eleonore-vance.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
        question: 'Comment installer durablement nos produits béninois dans les rayons premium internationaux ?'
      },
      {
        id: 'saveur-10',
        name: 'Sika Dossou',
        roleCategory: 'Collaborateur',
        roleDetail: 'Cheffe de conditionnement sous vide',
        photoUrl: '/assets/protagonists/sika-dossou.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        question: 'Quelle rigueur d’hygiène garantit 2 ans de conservation sans aucune chimie ajoutée ?'
      },
      {
        id: 'saveur-11',
        name: 'Marc Houndégla',
        roleCategory: 'Client',
        roleDetail: 'Père de famille amateur de jus de baobab',
        photoUrl: '/assets/duos/athlete-hurdle.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        question: 'Pourquoi remplacer les sodas importés par le jus de baobab a redonné de l’énergie à mes enfants ?'
      },
      {
        id: 'saveur-12',
        name: 'Pascal Cossi',
        roleCategory: 'Bienfaiteur',
        roleDetail: 'Mécène pour l’emploi des femmes transformatrices',
        photoUrl: '/assets/duos/coach-office.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        question: 'Comment la transformation agroalimentaire locale crée 5 fois plus d’emplois que l’exportation brute ?'
      },
      {
        id: 'saveur-13',
        name: 'Clara Dossou',
        roleCategory: 'Collaborateur',
        roleDetail: 'Créatrice de packaging écoresponsable',
        photoUrl: '/assets/duos/photographer-focus.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
        question: 'Comment fabriquer des étiquettes en papier recyclé de tiges de maïs et encres végétales ?'
      },
      {
        id: 'saveur-14',
        name: 'Malik Diop',
        roleCategory: 'Partenaire',
        roleDetail: 'Chroniqueur gastronomique radio',
        photoUrl: '/assets/duos/malik-diop.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
        question: 'Pourquoi vanter la richesse de notre terroir culinaire est le plus beau patriotisme ?'
      },
      {
        id: 'saveur-15',
        name: 'Sayri Quispe',
        roleCategory: 'Fournisseur',
        roleDetail: 'Installateur séchoirs solaires automatisés',
        photoUrl: '/assets/duos/sayri-quispe.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        question: 'Comment réguler l’hygrométrie par extraction d’air solaire thermique ?'
      },
      {
        id: 'saveur-16',
        name: 'Pascal Houndé',
        roleCategory: 'Bienfaiteur',
        roleDetail: 'Réalisateur de documentaires culinaires',
        photoUrl: '/assets/duos/coach-office.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        question: 'Comment filmer la fumée d’une marmite pour donner envie de s’asseoir ensemble ?'
      }
    ]
  },

  // 15. Archi-Terre Afrique (Architecture biosourcée & Briques de terre - 16 intervenants)
  {
    id: 'archi-terre',
    category: 'Architecture & Écologie',
    companyName: 'Archi-Terre Afrique',
    photoUrl: '/assets/directions/arts-visuels.jpg',
    logoUrl: '/assets/directions/arts-visuels.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    manifestoVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    manifestoTitle: 'Manifeste Archi-Terre : Construire avec la terre vivante',
    manifestoQuestion: 'Comment réinventer l’habitat africain avec la fraîcheur naturelle de la terre crue ?',
    manifestoDescription: 'Cabinet d’architecture et coopérative de maçons pionniers de la construction en briques de terre compressée (BTC), bambou et toitures végétalisées.',
    tagline: 'Construire l’Afrique avec sa propre terre',
    stakeholders: [
      {
        id: 'archi-1',
        name: 'Pascal Houndé',
        roleCategory: 'Fondateur',
        roleDetail: 'Architecte en terre crue',
        photoUrl: '/assets/duos/coach-office.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        question: 'Comment réinventer l’habitat africain avec la fraîcheur naturelle de la terre crue ?'
      },
      {
        id: 'archi-2',
        name: 'Blandine Adjovi',
        roleCategory: 'Collaborateur',
        roleDetail: 'Ingénieure en résistance des matériaux',
        photoUrl: '/assets/protagonists/adjovi-blandine.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        question: 'Pourquoi une brique de terre compressée résiste 100 ans tout en restant 5 fois moins chaude que le parpaing ?'
      },
      {
        id: 'archi-3',
        name: 'Koffi Mensah',
        roleCategory: 'Collaborateur',
        roleDetail: 'Maître maçon voûte nubienne',
        photoUrl: '/assets/protagonists/chef-koffi.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
        question: 'Comment bâtir une toiture voûtée sans bois ni tôle qui brûle sous le soleil ?'
      },
      {
        id: 'archi-4',
        name: 'Fatou Diallo',
        roleCategory: 'Client',
        roleDetail: 'Propriétaire de maison bioclimatique',
        photoUrl: '/assets/duos/fatou-diallo.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
        question: 'Quel soulagement de ne plus allumer de climatiseur même par 40 degrés dehors !'
      },
      {
        id: 'archi-5',
        name: 'Codjo Gbédji',
        roleCategory: 'Fournisseur',
        roleDetail: 'Exploitant de carrière d’argile durable',
        photoUrl: '/assets/protagonists/codjo-blind.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        question: 'Comment prélever l’argile sans défigurer le paysage et en revégétalisant le site ?'
      },
      {
        id: 'archi-6',
        name: 'Éléonore Vance',
        roleCategory: 'Partenaire',
        roleDetail: 'Urbaniste villes durables',
        photoUrl: '/assets/duos/eleonore-vance.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        question: 'Comment sortir du mythe du béton armé pour des cités africaines fraîches et humaines ?'
      },
      {
        id: 'archi-7',
        name: 'Armel Hounkpatin',
        roleCategory: 'Fournisseur',
        roleDetail: 'Artisan charpentier bambou',
        photoUrl: '/assets/protagonists/armel-hounkpatin.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        question: 'Pourquoi le bambou géant traité au sel naturel est l’acier végétal du futur ?'
      },
      {
        id: 'archi-8',
        name: 'Dah Zounon',
        roleCategory: 'Bienfaiteur',
        roleDetail: 'Conseiller d’orientation des fondations selon le Fâ',
        photoUrl: '/assets/duos/dah-zounon.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        question: 'Comment orienter une maison face aux vents dominants pour capter la brise bienfaisante ?'
      },
      {
        id: 'archi-9',
        name: 'Sika Dossou',
        roleCategory: 'Collaborateur',
        roleDetail: 'Dessinatrice 3D plans d’architecture',
        photoUrl: '/assets/protagonists/sika-dossou.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
        question: 'Comment modéliser les flux d’air naturels pour optimiser la ventilation passive ?'
      },
      {
        id: 'archi-10',
        name: 'Hélène Saint-Amand',
        roleCategory: 'Partenaire',
        roleDetail: 'Spécialiste normes de construction écologiques',
        photoUrl: '/assets/protagonists/helene-saint-amand.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
        question: 'Comment faire homologuer la brique de terre crue dans les marchés publics nationaux ?'
      },
      {
        id: 'archi-11',
        name: 'Marc Houndégla',
        roleCategory: 'Client',
        roleDetail: 'Directeur d’école construite en terre',
        photoUrl: '/assets/duos/athlete-hurdle.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        question: 'Comment les élèves apprennent mieux dans des salles tempérées et silencieuses ?'
      },
      {
        id: 'archi-12',
        name: 'Tobi Houndégla',
        roleCategory: 'Collaborateur',
        roleDetail: 'Chef d’équipe presseurs de briques',
        photoUrl: '/assets/protagonists/tobi-houndegla.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        question: 'Quel plaisir de presser 1000 briques parfaites par jour avec une presse manuelle robuste !'
      },
      {
        id: 'archi-13',
        name: 'Malik Diop',
        roleCategory: 'Bienfaiteur',
        roleDetail: 'Investisseur éco-quartier pilote',
        photoUrl: '/assets/duos/malik-diop.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        question: 'Pourquoi parier sur l’habitat en terre est l’investissement le plus rentable et durable ?'
      },
      {
        id: 'archi-14',
        name: 'Clara Dossou',
        roleCategory: 'Collaborateur',
        roleDetail: 'Spécialiste enduits à la chaux et ocres',
        photoUrl: '/assets/duos/photographer-focus.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        question: 'Comment donner des teintes chaudes et chatoyantes aux façades sans peinture synthétique ?'
      },
      {
        id: 'archi-15',
        name: 'Sayri Quispe',
        roleCategory: 'Fournisseur',
        roleDetail: 'Fabricant de presses hydrauliques mobiles',
        photoUrl: '/assets/duos/sayri-quispe.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
        question: 'Comment amener l’usine de briques directement sur le chantier pour zéro transport de matière ?'
      },
      {
        id: 'archi-16',
        name: 'Pascal Cossi',
        roleCategory: 'Bienfaiteur',
        roleDetail: 'Parrain de l’académie des métiers de la terre',
        photoUrl: '/assets/duos/coach-office.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
        question: 'Pourquoi former 200 jeunes maçons à la terre crue redonne fierté et travail à toute une région ?'
      }
    ]
  },

  // 16. Radio Échos des Lagunes (Médias libres & Voix citoyennes - 16 intervenants)
  {
    id: 'radio-vibrations',
    category: 'Médias & Voix Citoyennes',
    companyName: 'Radio Échos des Lagunes',
    photoUrl: '/assets/directions/marques-finance.jpg',
    logoUrl: '/assets/directions/marques-finance.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    manifestoVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    manifestoTitle: 'Manifeste Échos des Lagunes : L’antenne du peuple',
    manifestoQuestion: 'Comment donner un micro sans filtre à ceux que les grands médias n’écoutent jamais ?',
    manifestoDescription: 'Station de radio associative et communautaire émettant en 6 langues nationales sur toute la zone littorale et lacustre du Bénin.',
    tagline: 'Les ondes libres de la mémoire et du débat',
    stakeholders: [
      {
        id: 'radio-1',
        name: 'Solange Koudjo',
        roleCategory: 'Président',
        roleDetail: 'Directrice d’antenne & Journaliste',
        photoUrl: '/assets/protagonists/adjovi-blandine.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        question: 'Comment donner un micro sans filtre à ceux que les grands médias n’écoutent jamais ?'
      },
      {
        id: 'radio-2',
        name: 'Pascal Cossi',
        roleCategory: 'Collaborateur',
        roleDetail: 'Chroniqueur philosophique & sagesse Fâ',
        photoUrl: '/assets/duos/coach-office.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
        question: 'Comment apaiser les tensions villageoises par une parole de réconciliation diffusée à l’aube ?'
      },
      {
        id: 'radio-3',
        name: 'Koffi Mensah',
        roleCategory: 'Collaborateur',
        roleDetail: 'Animateur émission pêche & marées',
        photoUrl: '/assets/protagonists/chef-koffi.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        question: 'Pourquoi l’annonce des prévisions météo en langue fon est attendue par 10 000 piroguiers chaque matin ?'
      },
      {
        id: 'radio-4',
        name: 'Fatou Diallo',
        roleCategory: 'Secrétaire',
        roleDetail: 'Responsable des tribunes citoyennes',
        photoUrl: '/assets/duos/fatou-diallo.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
        question: 'Comment organiser un standard téléphonique ouvert où chaque auditeur a 2 minutes de parole libre ?'
      },
      {
        id: 'radio-5',
        name: 'Codjo Gbédji',
        roleCategory: 'Client',
        roleDetail: 'Auditeur fidèle avec son poste à piles',
        photoUrl: '/assets/protagonists/codjo-blind.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        question: 'En quoi la radio est mon unique compagne et ma fenêtre sur le monde sur ma barque ?'
      },
      {
        id: 'radio-6',
        name: 'Armel Hounkpatin',
        roleCategory: 'Fournisseur',
        roleDetail: 'Technicien émetteur FM solaire',
        photoUrl: '/assets/protagonists/armel-hounkpatin.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        question: 'Comment faire porter les ondes à 150 km de portée avec seulement 500 watts solaires ?'
      },
      {
        id: 'radio-7',
        name: 'Dah Zounon',
        roleCategory: 'Bienfaiteur',
        roleDetail: 'Conteur des contes du crépuscule',
        photoUrl: '/assets/duos/dah-zounon.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        question: 'Pourquoi quand le son de la flûte démarre à 19h, le silence se fait dans tout le village ?'
      },
      {
        id: 'radio-8',
        name: 'Hélène Saint-Amand',
        roleCategory: 'Partenaire',
        roleDetail: 'Avocate des droits des journalistes communautaires',
        photoUrl: '/assets/protagonists/helene-saint-amand.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
        question: 'Comment préserver l’indépendance éditoriale face aux pressions politiques locales ?'
      },
      {
        id: 'radio-9',
        name: 'Éléonore Vance',
        roleCategory: 'Collaborateur',
        roleDetail: 'Responsable du streaming web et podcasts',
        photoUrl: '/assets/duos/eleonore-vance.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        question: 'Comment connecter la diaspora béninoise de Montréal et Paris au direct de la lagune ?'
      },
      {
        id: 'radio-10',
        name: 'Sika Dossou',
        roleCategory: 'Collaborateur',
        roleDetail: 'Animatrice de l’heure des femmes',
        photoUrl: '/assets/protagonists/sika-dossou.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
        question: 'Comment aborder les sujets tabous de santé intime et d’héritage sans choquer mais en libérant les femmes ?'
      },
      {
        id: 'radio-11',
        name: 'Marc Houndégla',
        roleCategory: 'Partenaire',
        roleDetail: 'Directeur d’institut de sondage populaire',
        photoUrl: '/assets/duos/athlete-hurdle.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        question: 'Pourquoi les débats de cette radio reflètent le pouls réel du peuple mieux que tous les sondages ?'
      },
      {
        id: 'radio-12',
        name: 'Tobi Houndégla',
        roleCategory: 'Fournisseur',
        roleDetail: 'Preneur de son des bruits de la nature',
        photoUrl: '/assets/protagonists/tobi-houndegla.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        question: 'Comment enregistrer le clapotis de l’eau et le chant des martins-pêcheurs pour nos jingles ?'
      },
      {
        id: 'radio-13',
        name: 'Malik Diop',
        roleCategory: 'Bienfaiteur',
        roleDetail: 'Mécène pour l’achat de 500 récepteurs solaires pour les écoles',
        photoUrl: '/assets/duos/malik-diop.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        question: 'Pourquoi offrir une radio à chaque classe primaire pour suivre les émissions éducatives ?'
      },
      {
        id: 'radio-14',
        name: 'Clara Dossou',
        roleCategory: 'Collaborateur',
        roleDetail: 'Jeune reporter de quartier',
        photoUrl: '/assets/duos/photographer-focus.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
        question: 'Quelle émotion lorsqu’un reportage sur une école inondée déclenche des travaux d’urgence en 48 heures !'
      },
      {
        id: 'radio-15',
        name: 'Sayri Quispe',
        roleCategory: 'Fournisseur',
        roleDetail: 'Ingénieur console de mixage basse tension',
        photoUrl: '/assets/duos/sayri-quispe.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        question: 'Comment faire fonctionner un studio radio complet sur une seule batterie 12 volts ?'
      },
      {
        id: 'radio-16',
        name: 'Pascal Houndé',
        roleCategory: 'Bienfaiteur',
        roleDetail: 'Cofondateur d’honneur',
        photoUrl: '/assets/duos/coach-office.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
        question: 'Pourquoi tant qu’une voix libre parle sur les ondes, aucun peuple ne peut être réduit au silence ?'
      }
    ]
  }
];
