export interface StudioPillarItem {
  id: string;
  title: string;
  subtitle: string;
  question: string;
  posterUrl: string;
  videoUrl: string;
  badge?: string;
  accentColor?: string;
  subCategories?: StudioPillarItem[];
}

export interface StudioPillar {
  id: 'duos' | 'itinerant' | 'organisations' | 'soi';
  title: string;
  subtitle: string;
  question: string;
  posterUrl: string;
  videoUrl: string;
  items: StudioPillarItem[];
}

const STOCK_VIDEOS = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'
];

export const STUDIO_PILLARS: StudioPillar[] = [
  // =========================================================================
  // 1. MIROIR (8 séries documentaires diptyques)
  // =========================================================================
  {
    id: 'duos',
    title: 'Miroir',
    subtitle: 'Deux univers face à face, une même question humaine universelle',
    question: 'Face à quel alter ego d’un autre monde souhaitez-vous confronter votre propre vécu ?',
    posterUrl: '/assets/images/pillar_duos_afro_1792601147557.jpg',
    videoUrl: STOCK_VIDEOS[0],
    items: [
      {
        id: 'jesus-legba',
        title: 'Vodun Rays ‹ › Autre Foi',
        subtitle: 'Gardiens des traditions ancestrales face aux fidèles de foi révélée.',
        question: 'Comment votre rapport au sacré ou à la foi vous aide-t-il à traverser le mystère et les épreuves ?',
        posterUrl: '/assets/posters/vodun-autre-foi.jpg',
        videoUrl: STOCK_VIDEOS[0]
      },
      {
        id: 'roots-routes',
        title: 'Roots ‹ › Routes',
        subtitle: 'Ancrés sur la terre natale face aux voyageurs de la diaspora.',
        question: 'L’ancrage dans ses racines ou l’envol sur les routes : où se forge votre véritable identité ?',
        posterUrl: '/assets/posters/roots-routes.jpg',
        videoUrl: STOCK_VIDEOS[2]
      },
      {
        id: 'coaching-phd',
        title: 'Coaching ‹ › PhD',
        subtitle: 'Coachs, mentors & gens d’action face aux chercheurs, docteurs & universitaires.',
        question: 'L’instinct pratique du terrain ou la rigueur de la thèse : comment transformez-vous le monde ?',
        posterUrl: '/assets/posters/coaching-phd.jpg',
        videoUrl: STOCK_VIDEOS[3]
      },
      {
        id: 'fiat-luxe-builders',
        title: 'Fiat Luxe ‹ › Builders',
        subtitle: 'Artisans d’art, joailliers & esthètes du détail face aux architectes & bâtisseurs.',
        question: 'L’orfèvrerie du millimètre ou la force des fondations : que construisez-vous qui résiste au temps ?',
        posterUrl: '/assets/posters/fiat-luxe-builders.jpg',
        videoUrl: STOCK_VIDEOS[1]
      },
      {
        id: 'blacks-one-amazones',
        title: 'Blacks One ‹ › Amazones',
        subtitle: 'Mémoire & souveraineté masculine noire face à la puissance & au courage des femmes.',
        question: 'Comment affirmez-vous votre dignité et votre souveraineté intime face aux tempêtes de l’Histoire ?',
        posterUrl: '/assets/posters/blacks-one-amazones.jpg',
        videoUrl: STOCK_VIDEOS[0]
      },
      {
        id: 'benin-monde',
        title: 'Bénin ‹ › Le Monde',
        subtitle: 'Défenseurs du terroir et de la culture béninoise face aux cultures du reste du monde.',
        question: 'Quel est votre lien intime avec la terre ou l’eau qui nourrit votre communauté ?',
        posterUrl: '/assets/posters/benin-monde.jpg',
        videoUrl: STOCK_VIDEOS[1]
      },
      {
        id: 'baobab-bambou',
        title: 'Baobab ‹ › Bambou',
        subtitle: 'Mémoire & enracinement des aînés face à l’agilité & l’audace de la jeunesse.',
        question: 'La solidité des racines centenaires ou la souplesse du vent nouveau : quelle sagesse guide vos pas ?',
        posterUrl: '/assets/posters/baobab-bambou.jpg',
        videoUrl: STOCK_VIDEOS[2]
      },
      {
        id: 'pictures-words',
        title: 'Pictures ‹ › Words',
        subtitle: 'Créateurs du regard visuel face aux maîtres du verbe, de l’écriture et du slam.',
        question: 'L’image qui fige l’instant ou le mot qui réveille la conscience : comment racontez-vous la vérité ?',
        posterUrl: '/assets/posters/pictures-words.jpg',
        videoUrl: STOCK_VIDEOS[4]
      }
    ]
  },

  // =========================================================================
  // 2. CASTING (8 catégories x 8 sous-catégories = 64 thématiques)
  // =========================================================================
  {
    id: 'itinerant',
    title: 'Casting',
    subtitle: 'La voix des témoins et passeurs : plusieurs regards partagent leur point de vue',
    question: 'Quel savoir, quel rite ou quelle sagesse locale votre voix doit-elle transmettre ?',
    posterUrl: '/assets/images/pillar_casting_phoenix.png',
    videoUrl: STOCK_VIDEOS[1],
    items: [
      // -----------------------------------------------------------------------
      // 1. Sagesses (8 sous-thématiques)
      // -----------------------------------------------------------------------
      {
        id: 'cat-sagesses',
        title: 'Sagesses',
        subtitle: 'Sens de la vie, foi, résilience, solidarité, gratitude, bienveillance, pardon, humilité.',
        question: 'Quel enseignement ou leçon de vie reçu de vos aïeux guide encore chacun de vos choix ?',
        posterUrl: '/assets/directions/sagesses-resilience.jpg',
        videoUrl: STOCK_VIDEOS[0],
        subCategories: [
          {
            id: 'sagesses-sens-vie',
            title: 'Sens de la vie',
            subtitle: 'Trouver son cap, donner du sens à son existence et à son chemin.',
            question: 'Qu’est-ce qui donne le plus profondément du sens à votre existence aujourd’hui ?',
            posterUrl: '/assets/directions/sagesses-amour.jpg',
            videoUrl: STOCK_VIDEOS[0]
          },
          {
            id: 'sagesses-foi',
            title: 'Foi',
            subtitle: 'La confiance inébranlable dans le sacré, en la vie ou en l’avenir.',
            question: 'Dans quoi puisez-vous cette foi inaltérable lorsque tout vacille autour de vous ?',
            posterUrl: '/assets/directions/sagesses-perseverance.jpg',
            videoUrl: STOCK_VIDEOS[1]
          },
          {
            id: 'sagesses-resilience',
            title: 'Résilience',
            subtitle: 'Se relever après la tempête, transformer l’épreuve en force motrice.',
            question: 'Quelle tempête intérieure avez-vous traversée qui a révélé votre véritable résilience ?',
            posterUrl: '/assets/directions/sagesses-resilience.jpg',
            videoUrl: STOCK_VIDEOS[2]
          },
          {
            id: 'sagesses-solidarite',
            title: 'Solidarité',
            subtitle: 'La force de l’entraide, la main tendue sans rien attendre en retour.',
            question: 'Quel acte de fraternité ou d’entraide a marqué à jamais votre trajectoire ?',
            posterUrl: '/assets/directions/sagesses-solidarite.jpg',
            videoUrl: STOCK_VIDEOS[3]
          },
          {
            id: 'sagesses-gratitude',
            title: 'Gratitude',
            subtitle: 'Savoir remercier pour l’ordinaire, honorer ce qui a été reçu.',
            question: 'Pour quel cadeau secret de la vie éprouvez-vous chaque matin une profonde gratitude ?',
            posterUrl: '/assets/directions/sagesses-gratitude.jpg',
            videoUrl: STOCK_VIDEOS[4]
          },
          {
            id: 'sagesses-bienveillance',
            title: 'Bienveillance',
            subtitle: 'Le regard qui accueille, la parole douce et le cœur ouvert à l’autre.',
            question: 'Comment cultivez-vous la bienveillance au quotidien, même face aux jugements ?',
            posterUrl: '/assets/directions/sagesses-bienveillance.jpg',
            videoUrl: STOCK_VIDEOS[0]
          },
          {
            id: 'sagesses-pardon',
            title: 'Pardon',
            subtitle: 'Libérer le passé pour faire la paix avec soi-même et avec autrui.',
            question: 'Quel pardon donné ou reçu vous a permis de retrouver votre liberté intérieure ?',
            posterUrl: '/assets/directions/sagesses-pardon.jpg',
            videoUrl: STOCK_VIDEOS[1]
          },
          {
            id: 'sagesses-humilite',
            title: 'Humilité',
            subtitle: 'Reconnaître sa juste place dans le grand cycle de la vie.',
            question: 'Quelle leçon d’humilité a redéfini votre rapport aux autres et à la réussite ?',
            posterUrl: '/assets/directions/sagesses-humilite.jpg',
            videoUrl: STOCK_VIDEOS[2]
          }
        ]
      },

      // -----------------------------------------------------------------------
      // 2. Territoires (8 sous-thématiques)
      // -----------------------------------------------------------------------
      {
        id: 'cat-territoires',
        title: 'Territoires',
        subtitle: 'Patrimoine, tradition, culture, histoire, terroir, langue, diaspora, coutumes.',
        question: 'Quel terroir, lieu sacré ou tradition porte l’empreinte indélébile de votre communauté ?',
        posterUrl: '/assets/directions/territoires-traditions.jpg',
        videoUrl: STOCK_VIDEOS[1],
        subCategories: [
          {
            id: 'territoires-patrimoine',
            title: 'Patrimoine',
            subtitle: 'Les trésors hérités du passé, pierres, œuvres et mémoires vivantes.',
            question: 'Quel monument ou trésor de mémoire portez-vous comme un bien inaliénable ?',
            posterUrl: '/assets/directions/territoires-patrimoine.jpg',
            videoUrl: STOCK_VIDEOS[0]
          },
          {
            id: 'territoires-tradition',
            title: 'Tradition',
            subtitle: 'Les rites séculaires et coutumes qui relient les générations.',
            question: 'Quelle tradition de votre terre continue de scander et bénir votre existence ?',
            posterUrl: '/assets/directions/territoires-traditions.jpg',
            videoUrl: STOCK_VIDEOS[1]
          },
          {
            id: 'territoires-culture',
            title: 'Culture',
            subtitle: 'L’expression vibrante d’une identité, célébrée par les arts et la pensée.',
            question: 'Comment votre culture d’origine irrigue-t-elle votre manière de voir le monde ?',
            posterUrl: '/assets/directions/territoires-culture.jpg',
            videoUrl: STOCK_VIDEOS[2]
          },
          {
            id: 'territoires-histoire',
            title: 'Histoire',
            subtitle: 'Les récits des luttes, des fondations et des victoires collectives.',
            question: 'Quelle page de l’histoire de votre peuple éclaire le plus votre présent ?',
            posterUrl: '/assets/directions/territoires-histoire.jpg',
            videoUrl: STOCK_VIDEOS[3]
          },
          {
            id: 'territoires-terroir',
            title: 'Terroir',
            subtitle: 'La terre nourricière, ses saveurs, ses parfums et ses richesses uniques.',
            question: 'Quel coin de terre ou goût de terroir incarne pour vous la saveur des origines ?',
            posterUrl: '/assets/directions/territoires-terroirs.jpg',
            videoUrl: STOCK_VIDEOS[4]
          },
          {
            id: 'territoires-langue',
            title: 'Langue',
            subtitle: 'La mélodie des mots maternels, véhicule de l’âme et de la transmission.',
            question: 'Quels proverbes ou mots de votre langue maternelle disent ce qu’aucun autre mot ne traduit ?',
            posterUrl: '/assets/directions/territoires-langues.jpg',
            videoUrl: STOCK_VIDEOS[0]
          },
          {
            id: 'territoires-diaspora',
            title: 'Diaspora',
            subtitle: 'Partir au loin tout en gardant intacte la pulsation de son pays natal.',
            question: 'Comment entretenez-vous le pont invisible entre votre terre d’accueil et votre patrie ?',
            posterUrl: '/assets/directions/territoires-diaspora.jpg',
            videoUrl: STOCK_VIDEOS[1]
          },
          {
            id: 'territoires-coutumes',
            title: 'Coutumes',
            subtitle: 'Les habitudes partagées et le code de politesse d’un vivre-ensemble séculaire.',
            question: 'Quelle coutume locale préservez-vous avec ferveur auprès des plus jeunes ?',
            posterUrl: '/assets/directions/territoires-habitudes.jpg',
            videoUrl: STOCK_VIDEOS[2]
          }
        ]
      },

      // -----------------------------------------------------------------------
      // 3. Expertises (8 sous-thématiques)
      // -----------------------------------------------------------------------
      {
        id: 'cat-expertises',
        title: 'Expertises',
        subtitle: 'Artisanat, agriculture, éducation, numérique, justice, santé, sécurité, design.',
        question: 'Quel savoir-faire ou geste d’artisan protégez-vous contre l’oubli et l’uniformisation ?',
        posterUrl: '/assets/directions/expertises-artisanat.jpg',
        videoUrl: STOCK_VIDEOS[2],
        subCategories: [
          {
            id: 'expertises-artisanat',
            title: 'Artisanat',
            subtitle: 'La main qui sculpte, tisse et façonne la matière brute avec passion.',
            question: 'Quel geste minutieux de votre métier protégez-vous contre la standardisation ?',
            posterUrl: '/assets/directions/expertises-artisanat.jpg',
            videoUrl: STOCK_VIDEOS[0]
          },
          {
            id: 'expertises-agriculture',
            title: 'Agriculture',
            subtitle: 'Nourrir les hommes, soigner les sols et respecter les saisons de la terre.',
            question: 'Quel rapport intime cultivez-vous avec les cycles naturels qui nourrissent votre communauté ?',
            posterUrl: '/assets/directions/expertises-business.jpg',
            videoUrl: STOCK_VIDEOS[1]
          },
          {
            id: 'expertises-education',
            title: 'Éducation',
            subtitle: 'Transmettre le savoir, éveiller les consciences et former les bâtisseurs de demain.',
            question: 'Quel pédagogue ou maître a allumé en vous l’étincelle de la connaissance ?',
            posterUrl: '/assets/directions/expertises-education.jpg',
            videoUrl: STOCK_VIDEOS[2]
          },
          {
            id: 'expertises-numerique',
            title: 'Numérique',
            subtitle: 'Coder, connecter et concevoir des outils technologiques émancipateurs.',
            question: 'Comment mettez-vous la technologie au service de l’humain et du progrès partagé ?',
            posterUrl: '/assets/directions/expertises-numerique.jpg',
            videoUrl: STOCK_VIDEOS[3]
          },
          {
            id: 'expertises-justice',
            title: 'Justice',
            subtitle: 'Défendre l’équité, protéger les faibles et garantir le droit pour tous.',
            question: 'Pour quel combat de justice ou d’intégrité refuseriez-vous tout compromis ?',
            posterUrl: '/assets/directions/expertises-justice.jpg',
            videoUrl: STOCK_VIDEOS[4]
          },
          {
            id: 'expertises-sante',
            title: 'Santé',
            subtitle: 'Soigner les corps et les âmes, prévenir le mal et préserver la vie.',
            question: 'Quel dévouement vous anime dans l’art de soulager la souffrance humaine ?',
            posterUrl: '/assets/directions/expertises-sante.jpg',
            videoUrl: STOCK_VIDEOS[0]
          },
          {
            id: 'expertises-securite',
            title: 'Sécurité',
            subtitle: 'Veiller sur la communauté, protéger les biens et préserver la paix civile.',
            question: 'Comment instaurez-vous un climat de confiance et de sécurité durable ?',
            posterUrl: '/assets/directions/expertises-securite.jpg',
            videoUrl: STOCK_VIDEOS[1]
          },
          {
            id: 'expertises-design',
            title: 'Design',
            subtitle: 'Épouser l’usage et la beauté, rendre l’environnement harmonieux et fluide.',
            question: 'Quelle création originale a réconcilié la beauté plastique et l’utilité pratique ?',
            posterUrl: '/assets/directions/expertises-design.jpg',
            videoUrl: STOCK_VIDEOS[2]
          }
        ]
      },

      // -----------------------------------------------------------------------
      // 4. Personnalités (8 sous-thématiques)
      // -----------------------------------------------------------------------
      {
        id: 'cat-personnalites',
        title: 'Personnalités',
        subtitle: 'Engagement, légendes, musique, cinéma, art, sport, influenceurs, littérature.',
        question: 'Quelle figure inspirante ou créateur engagé a éveillé votre propre vocation ?',
        posterUrl: '/assets/directions/personnalites-engagement.jpg',
        videoUrl: STOCK_VIDEOS[3],
        subCategories: [
          {
            id: 'personnalites-engagement',
            title: 'Engagement',
            subtitle: 'Donner sa vie et sa voix pour une cause plus grande que soi.',
            question: 'Pour quelle cause citoyenne avez-vous décidé de ne plus jamais vous taire ?',
            posterUrl: '/assets/directions/personnalites-engagement.jpg',
            videoUrl: STOCK_VIDEOS[0]
          },
          {
            id: 'personnalites-legendes',
            title: 'Légendes',
            subtitle: 'Les figures mythiques dont le nom traverse les âges et inspire les foules.',
            question: 'Quelle légende vivante ou disparue constitue votre modèle d’élévation ?',
            posterUrl: '/assets/directions/personnalites-legendes.jpg',
            videoUrl: STOCK_VIDEOS[1]
          },
          {
            id: 'personnalites-musique',
            title: 'Musique',
            subtitle: 'Faire vibrer les cœurs, porter les rythmes et unir les âmes par le son.',
            question: 'Quelle mélodie ou rythme réveille instantanément votre énergie vitale ?',
            posterUrl: '/assets/directions/personnalites-musique.jpg',
            videoUrl: STOCK_VIDEOS[2]
          },
          {
            id: 'personnalites-cinema',
            title: 'Cinéma',
            subtitle: 'Raconter le réel et l’imaginaire par la magie des images en mouvement.',
            question: 'Quel film ou réalisateur a bouleversé votre façon de percevoir l’humanité ?',
            posterUrl: '/assets/directions/personnalites-cinema.jpg',
            videoUrl: STOCK_VIDEOS[3]
          },
          {
            id: 'personnalites-art',
            title: 'Art',
            subtitle: 'Exprimer l’indicible par les toiles, les sculptures et les matières.',
            question: 'Comment l’art vous permet-il d’accéder à ce que les mots ne savent pas dire ?',
            posterUrl: '/assets/directions/personnalites-arts.jpg',
            videoUrl: STOCK_VIDEOS[4]
          },
          {
            id: 'personnalites-sport',
            title: 'Sport',
            subtitle: 'Dépassement de soi, discipline de fer et fraternité du jeu collectif.',
            question: 'Quelle victoire acquise au prix de l’effort physique a forgé votre mental ?',
            posterUrl: '/assets/directions/personnalites-sport.jpg',
            videoUrl: STOCK_VIDEOS[0]
          },
          {
            id: 'personnalites-influenceurs',
            title: 'Influenceurs',
            subtitle: 'Inspirer, rassembler une communauté et porter des messages d’impact.',
            question: 'Comment utilisez-vous votre visibilité pour semer des graines constructives ?',
            posterUrl: '/assets/directions/personnalites-influenceurs.jpg',
            videoUrl: STOCK_VIDEOS[1]
          },
          {
            id: 'personnalites-litterature',
            title: 'Littérature',
            subtitle: 'La puissance des livres, l’écriture poétique et la profondeur des récits.',
            question: 'Quel livre fondateur a ouvert les portes secrètes de votre pensée ?',
            posterUrl: '/assets/directions/personnalites-foi.jpg',
            videoUrl: STOCK_VIDEOS[2]
          }
        ]
      },

      // -----------------------------------------------------------------------
      // 5. Épreuves (8 sous-thématiques)
      // -----------------------------------------------------------------------
      {
        id: 'cat-epreuves',
        title: 'Épreuves',
        subtitle: 'Guerre, pauvreté, injustice, maladie, handicap, deuil, séparation, échec.',
        question: 'Quelle traversée difficile vous a révélé une force que vous ne soupçonniez pas ?',
        posterUrl: '/assets/directions/sagesses-pardon.jpg',
        videoUrl: STOCK_VIDEOS[4],
        subCategories: [
          {
            id: 'epreuves-guerre',
            title: 'Guerre',
            subtitle: 'Traverser le chaos des conflits et préserver la flamme de la paix.',
            question: 'Comment garde-t-on sa dignité et son humanité au milieu du tumulte ?',
            posterUrl: '/assets/directions/sagesses-perseverance.jpg',
            videoUrl: STOCK_VIDEOS[0]
          },
          {
            id: 'epreuves-pauvrete',
            title: 'Pauvreté',
            subtitle: 'Le dénuement matériel transcendé par la richesse du cœur et l’ingéniosité.',
            question: 'Quelle ingéniosité et solidarité ont permis de vaincre la précarité ?',
            posterUrl: '/assets/images/beninois_pecheur_tobi_1792165042006.jpg',
            videoUrl: STOCK_VIDEOS[1]
          },
          {
            id: 'epreuves-injustice',
            title: 'Injustice',
            subtitle: 'Se relever face à l’arbitraire et transformer la blessure en juste combat.',
            question: 'Quelle épreuve injuste vous a donné la force de défendre les autres ?',
            posterUrl: '/assets/directions/expertises-justice.jpg',
            videoUrl: STOCK_VIDEOS[2]
          },
          {
            id: 'epreuves-maladie',
            title: 'Maladie',
            subtitle: 'La fragilité du corps, le courage du soin et la volonté de guérir.',
            question: 'Qu’avez-vous appris d’essentiel sur la valeur des jours en affrontant la maladie ?',
            posterUrl: '/assets/directions/expertises-sante.jpg',
            videoUrl: STOCK_VIDEOS[3]
          },
          {
            id: 'epreuves-handicap',
            title: 'Handicap',
            subtitle: 'Déjouer les limites physiques, éveiller des sens décuplés et inspirer.',
            question: 'Comment votre différence est-elle devenue votre plus singulière puissance ?',
            posterUrl: '/assets/duos/codjo-blind.jpg',
            videoUrl: STOCK_VIDEOS[4]
          },
          {
            id: 'epreuves-deuil',
            title: 'Deuil',
            subtitle: 'Apprivoiser l’absence, honorer les disparus et célébrer la vie qui continue.',
            question: 'Comment transformez-vous l’absence d’un être cher en présence bienfaisante ?',
            posterUrl: '/assets/duos/dah-zounon.jpg',
            videoUrl: STOCK_VIDEOS[0]
          },
          {
            id: 'epreuves-separation',
            title: 'Séparation',
            subtitle: 'Les ruptures et l’éloignement nécessaires pour se retrouver soi-même.',
            question: 'Comment avez-vous reconstruit votre univers après une séparation marquante ?',
            posterUrl: '/assets/directions/sagesses-pardon.jpg',
            videoUrl: STOCK_VIDEOS[1]
          },
          {
            id: 'epreuves-echec',
            title: 'Échec',
            subtitle: 'Tomber, apprendre, ajuster sa trajectoire et repartir avec lucidité.',
            question: 'En quoi votre plus grand échec a-t-il été en réalité votre plus grand maître ?',
            posterUrl: '/assets/duos/athlete-hurdle.jpg',
            videoUrl: STOCK_VIDEOS[2]
          }
        ]
      },

      // -----------------------------------------------------------------------
      // 6. Produits et services (8 sous-thématiques)
      // -----------------------------------------------------------------------
      {
        id: 'cat-produits-services',
        title: 'Produits et services',
        subtitle: 'Beauté, restauration, mode, bien-être, tourisme, transport, commerce, immobilier.',
        question: 'Comment votre création, votre soin ou votre commerce apporte-t-il du bien au quotidien ?',
        posterUrl: '/assets/directions/produits-services-beaute.jpg',
        videoUrl: STOCK_VIDEOS[0],
        subCategories: [
          {
            id: 'ps-beaute',
            title: 'Beauté',
            subtitle: 'Révéler l’éclat naturel, soins cosmétiques et bienveillance envers son corps.',
            question: 'Comment votre conception de la beauté redonne-t-elle confiance et estime de soi ?',
            posterUrl: '/assets/directions/produits-services-beaute.jpg',
            videoUrl: STOCK_VIDEOS[0]
          },
          {
            id: 'ps-restauration',
            title: 'Restauration',
            subtitle: 'Les délices de la table, le plaisir du partage et l’accueil chaleureux.',
            question: 'Quelle recette emblématique réunit les gens autour de votre table ?',
            posterUrl: '/assets/directions/produits-services-restauration.jpg',
            videoUrl: STOCK_VIDEOS[1]
          },
          {
            id: 'ps-mode',
            title: 'Mode',
            subtitle: 'Couleurs, textiles nobles et coupes qui affirment la fierté identitaire.',
            question: 'Quelle histoire humaine raconte chaque vêtement que vous créez ?',
            posterUrl: '/assets/directions/produits-services-mode.jpg',
            videoUrl: STOCK_VIDEOS[2]
          },
          {
            id: 'ps-bien-etre',
            title: 'Bien-être',
            subtitle: 'Sérénité de l’esprit, détente physique et réconciliation intérieure.',
            question: 'Quelle routine ou soin permet à vos proches de retrouver la paix intérieure ?',
            posterUrl: '/assets/directions/produits-services-bien-etre.jpg',
            videoUrl: STOCK_VIDEOS[3]
          },
          {
            id: 'ps-tourisme',
            title: 'Tourisme',
            subtitle: 'Guider les voyageurs au cœur des merveilles cachées et des cultures locales.',
            question: 'Quel trésor insoupçonné faites-vous découvrir à ceux qui viennent de loin ?',
            posterUrl: '/assets/directions/produits-services-tourisme.jpg',
            videoUrl: STOCK_VIDEOS[4]
          },
          {
            id: 'ps-transport',
            title: 'Transport',
            subtitle: 'Relier les territoires, fluidifier les mobilités et rapprocher les êtres.',
            question: 'Comment votre service de mobilité facilite-t-il la vie de centaines de personnes ?',
            posterUrl: '/assets/directions/produits-services-conciergerie.jpg',
            videoUrl: STOCK_VIDEOS[0]
          },
          {
            id: 'ps-commerce',
            title: 'Commerce',
            subtitle: 'Les échoppes de proximité, la confiance mutuelle et le commerce équitable.',
            question: 'Quelle relation de confiance privilégiée avez-vous bâtie avec vos clients ?',
            posterUrl: '/assets/directions/produits-services-garde-enfants.jpg',
            videoUrl: STOCK_VIDEOS[1]
          },
          {
            id: 'ps-immobilier',
            title: 'Immobilier',
            subtitle: 'Bâtir un toit, aménager des foyers chaleureux et valoriser l’habitat.',
            question: 'Comment créez-vous des espaces de vie où les familles peuvent s’épanouir en sécurité ?',
            posterUrl: '/assets/directions/produits-services-immobilier.jpg',
            videoUrl: STOCK_VIDEOS[2]
          }
        ]
      },

      // -----------------------------------------------------------------------
      // 7. Projets (8 sous-thématiques)
      // -----------------------------------------------------------------------
      {
        id: 'cat-projets',
        title: 'Projets',
        subtitle: 'Jeux, écologie, social, communautaire, innovation, entreprise, aventure, événements.',
        question: 'Quelle aventure, initiative collective ou innovation rêvez-vous de concrétiser ?',
        posterUrl: '/assets/directions/projets-innovation.jpg',
        videoUrl: STOCK_VIDEOS[1],
        subCategories: [
          {
            id: 'projets-jeux',
            title: 'Jeux',
            subtitle: 'Éveil ludique, plaisir de jouer ensemble et stimulation de la créativité.',
            question: 'Quel jeu traditionnel ou moderne avez-vous imaginé pour rassembler petits et grands ?',
            posterUrl: '/assets/directions/projets-jeux.jpg',
            videoUrl: STOCK_VIDEOS[0]
          },
          {
            id: 'projets-ecologie',
            title: 'Écologie',
            subtitle: 'Protéger la biodiversité, recycler et préserver la terre pour les générations futures.',
            question: 'Quelle action concrète menez-vous pour soigner notre écosystème naturel ?',
            posterUrl: '/assets/directions/projets-ecologie.jpg',
            videoUrl: STOCK_VIDEOS[1]
          },
          {
            id: 'projets-social',
            title: 'Social',
            subtitle: 'Tisser du lien solidaire, inclure les oubliés et créer des ponts d’espoir.',
            question: 'Quel impact direct votre initiative sociale apporte-t-elle aux plus vulnérables ?',
            posterUrl: '/assets/directions/projets-social.jpg',
            videoUrl: STOCK_VIDEOS[2]
          },
          {
            id: 'projets-communautaire',
            title: 'Communautaire',
            subtitle: 'La force du collectif qui s’organise pour bâtir son propre avenir.',
            question: 'Comment mobilisez-vous votre village ou quartier autour d’un projet commun ?',
            posterUrl: '/assets/directions/projets-communautaire.jpg',
            videoUrl: STOCK_VIDEOS[3]
          },
          {
            id: 'projets-innovation',
            title: 'Innovation',
            subtitle: 'Penser en dehors des sentiers battus, inventer de nouvelles solutions d’avenir.',
            question: 'Quelle trouvaille ingénieuse a résolu un problème réputé insurmontable ?',
            posterUrl: '/assets/directions/projets-innovation.jpg',
            videoUrl: STOCK_VIDEOS[4]
          },
          {
            id: 'projets-entreprise',
            title: 'Entreprise',
            subtitle: 'Créer de la valeur durable, entreprendre avec éthique et générer des emplois.',
            question: 'Quel cap stratégique et éthique guide le développement de votre entreprise ?',
            posterUrl: '/assets/directions/projets-entreprise.jpg',
            videoUrl: STOCK_VIDEOS[0]
          },
          {
            id: 'projets-aventure',
            title: 'Aventure',
            subtitle: 'Partir à la découverte de l’inconnu, repousser les frontières et explorer.',
            question: 'Quelle expédition ou défi audacieux a élargi votre vision du possible ?',
            posterUrl: '/assets/directions/projets-aventure.jpg',
            videoUrl: STOCK_VIDEOS[1]
          },
          {
            id: 'projets-evenements',
            title: 'Événements',
            subtitle: 'Fédérer les foules, célébrer les talents et vivre des moments inoubliables.',
            question: 'Quel festival ou rassemblement magique rêvez-vous d’organiser pour marquer les esprits ?',
            posterUrl: '/assets/directions/projets-culture.jpg',
            videoUrl: STOCK_VIDEOS[2]
          }
        ]
      },

      // -----------------------------------------------------------------------
      // 8. Liens (8 sous-thématiques)
      // -----------------------------------------------------------------------
      {
        id: 'cat-liens',
        title: 'Liens',
        subtitle: 'Couple, parents, enfants, grands-parents, fratrie, amitié, communauté, animaux.',
        question: 'Quel lien d’amour, de famille ou d’amitié constitue le pilier inébranlable de votre existence ?',
        posterUrl: '/assets/images/home_afro_storyteller_1792193575638.jpg',
        videoUrl: STOCK_VIDEOS[2],
        subCategories: [
          {
            id: 'liens-couple',
            title: 'Couple',
            subtitle: 'L’alliance amoureuse, la complicité des jours et l’aventure à deux.',
            question: 'Quel secret de tendresse et de dialogue consolide votre couple au fil du temps ?',
            posterUrl: '/assets/images/home_afro_storyteller_1792193575638.jpg',
            videoUrl: STOCK_VIDEOS[0]
          },
          {
            id: 'liens-parents',
            title: 'Parents',
            subtitle: 'La responsabilité d’élever, de protéger et de guider avec amour.',
            question: 'Quel principe essentiel souhaitez-vous à tout prix transmettre à vos enfants ?',
            posterUrl: '/assets/images/orga_transm_afro_1792611469008.jpg',
            videoUrl: STOCK_VIDEOS[1]
          },
          {
            id: 'liens-enfants',
            title: 'Enfants',
            subtitle: 'L’innocence, la joie spontanée et l’espoir radieux du futur.',
            question: 'Quelle leçon de pureté ou de curiosité un enfant vous a-t-il enseignée ?',
            posterUrl: '/assets/images/beninoise_jeune_senan_1792165025309.jpg',
            videoUrl: STOCK_VIDEOS[2]
          },
          {
            id: 'liens-grands-parents',
            title: 'Grands-parents',
            subtitle: 'La sagesse des aînés, la tendresse des souvenirs et la bénédiction des anciens.',
            question: 'Quelle histoire ou parole d’or de vos grands-parents résonne encore en vous ?',
            posterUrl: '/assets/images/romeo_dialogue_elders_1792698428934.jpg',
            videoUrl: STOCK_VIDEOS[3]
          },
          {
            id: 'liens-fratrie',
            title: 'Fratrie',
            subtitle: 'Les frères et sœurs, complices d’enfance et piliers face aux épreuves.',
            question: 'Quel pacte de fidélité ou d’entraide vous lie indéfectiblement à vos frères et sœurs ?',
            posterUrl: '/assets/images/beninoise_femme_sika_1792164985263.jpg',
            videoUrl: STOCK_VIDEOS[4]
          },
          {
            id: 'liens-amitie',
            title: 'Amitié',
            subtitle: 'La famille que l’on choisit, la loyauté sans faille et le rire partagé.',
            question: 'Quel ami véritable a répondu présent au moment exact où vous en aviez le plus besoin ?',
            posterUrl: '/assets/images/orga_rencontres_afro_1792611454422.jpg',
            videoUrl: STOCK_VIDEOS[0]
          },
          {
            id: 'liens-communaute',
            title: 'Communauté',
            subtitle: 'Le sentiment d’appartenance à un peuple, un village ou un groupe soudé.',
            question: 'Comment votre communauté vous soutient-elle et comment l’honorez-vous en retour ?',
            posterUrl: '/assets/directions/projets-communautaire.jpg',
            videoUrl: STOCK_VIDEOS[1]
          },
          {
            id: 'liens-animaux',
            title: 'Animaux',
            subtitle: 'La fidélité pure des compagnons de vie et le respect de la faune vivante.',
            question: 'Quel lien extraordinaire avec un animal a transformé votre sensibilité au vivant ?',
            posterUrl: '/assets/images/romeo_lagoon_sunset_1792698428025.jpg',
            videoUrl: STOCK_VIDEOS[2]
          }
        ]
      }
    ]
  },

  // =========================================================================
  // 3. LUMIÈRE (8 thématiques vivantes au cœur des collectifs et entreprises)
  // =========================================================================
  {
    id: 'organisations',
    title: 'Lumière',
    subtitle: 'Les 8 thématiques vivantes au cœur des collectifs et entreprises',
    question: 'Quel défi collectif et quelle fierté humaine soudent votre organisation de l’intérieur ?',
    posterUrl: '/assets/images/pillar_org_afro_1792601150815.jpg',
    videoUrl: STOCK_VIDEOS[2],
    items: [
      {
        id: 'lum-origines',
        title: 'Origines',
        subtitle: 'Pourquoi et comment tout a commencé.',
        question: 'Quelle étincelle visionnaire ou défi initial a donné naissance à votre organisation ?',
        posterUrl: '/assets/images/studio_orga_origines_1792608957920.jpg',
        videoUrl: STOCK_VIDEOS[0]
      },
      {
        id: 'lum-valeurs',
        title: 'Valeurs',
        subtitle: 'Ce qui compte vraiment ici.',
        question: 'Quels principes non négociables guident chaque décision au sein de votre collectif ?',
        posterUrl: '/assets/images/studio_orga_valeurs_1792608959843.jpg',
        videoUrl: STOCK_VIDEOS[1]
      },
      {
        id: 'lum-quotidien',
        title: 'Quotidien',
        subtitle: 'Une journée, un geste, un rituel.',
        question: 'Quel rituel quotidien ou geste d’attention caractérise l’ambiance de vos journées ?',
        posterUrl: '/assets/images/studio_orga_quotidien_1792608958971.jpg',
        videoUrl: STOCK_VIDEOS[2]
      },
      {
        id: 'lum-epreuves',
        title: 'Épreuves',
        subtitle: 'Le moment où l’on a failli tout arrêter.',
        question: 'Quelle crise majeure a testé votre foi dans le projet et comment l’avez-vous surmontée ?',
        posterUrl: '/assets/images/studio_orga_epreuves_1792608979150.jpg',
        videoUrl: STOCK_VIDEOS[3]
      },
      {
        id: 'lum-rencontres',
        title: 'Rencontres',
        subtitle: 'La personne qui a changé quelque chose.',
        question: 'Quelle rencontre décisive a fait basculer le destin de votre entreprise ?',
        posterUrl: '/assets/images/orga_rencontres_afro_1792611454422.jpg',
        videoUrl: STOCK_VIDEOS[4]
      },
      {
        id: 'lum-impact',
        title: 'Impact',
        subtitle: 'Ce que l’organisation a changé, pour soi ou pour d’autres.',
        question: 'Quelle transformation concrète votre organisation apporte-t-elle à sa communauté ?',
        posterUrl: '/assets/images/marques_tech_1792086434196.jpg',
        videoUrl: STOCK_VIDEOS[0]
      },
      {
        id: 'lum-transmission',
        title: 'Transmission',
        subtitle: 'Ce qu’on apprend, ce qu’on lègue, la relève.',
        question: 'Quel savoir précieux transmettez-vous à la nouvelle génération pour assurer la suite ?',
        posterUrl: '/assets/images/orga_transm_afro_1792611469008.jpg',
        videoUrl: STOCK_VIDEOS[1]
      },
      {
        id: 'lum-avenir',
        title: 'Avenir',
        subtitle: 'Ce qu’on rêve de construire.',
        question: 'Quel rêve d’avenir ambitieux et lumineux guide aujourd’hui tous vos efforts ?',
        posterUrl: '/assets/images/projets_ecologie_1792086393821.jpg',
        videoUrl: STOCK_VIDEOS[2]
      }
    ]
  },

  // =========================================================================
  // 4. PORTRAIT (4 directions d’expression et d’affirmation de soi)
  // =========================================================================
  {
    id: 'soi',
    title: 'Portrait',
    subtitle: 'Les 4 directions d’expression et d’affirmation de soi',
    question: 'Quelle dimension intime de votre histoire humaine souhaitez-vous offrir au monde ?',
    posterUrl: '/assets/images/pillar_soi_afro_1792601150131.jpg',
    videoUrl: STOCK_VIDEOS[3],
    items: [
      {
        id: 'soi-parcours',
        title: 'Parcours de vie',
        subtitle: 'Son histoire, les étapes qui l’ont construite.',
        question: 'Quelles étapes fondatrices et quels tournants ont sculpté la personne que vous êtes ?',
        posterUrl: '/assets/images/studio_soi_parcours_1792608978314.jpg',
        videoUrl: STOCK_VIDEOS[3]
      },
      {
        id: 'soi-produits-services',
        title: 'Produits et services',
        subtitle: 'Ce qu’elle fait, vend ou propose.',
        question: 'Quelle offre, création ou savoir-faire d’excellence mettez-vous au service d’autrui ?',
        posterUrl: '/assets/images/ps_mode_1792086355077.jpg',
        videoUrl: STOCK_VIDEOS[0]
      },
      {
        id: 'soi-projets',
        title: 'Projets',
        subtitle: 'Ses projets en cours, éventuellement en financement participatif.',
        question: 'Quel chantier enthousiasmant ou création porteuse souhaitez-vous propulser ?',
        posterUrl: '/assets/images/projets_social_1792086395729.jpg',
        videoUrl: STOCK_VIDEOS[1]
      },
      {
        id: 'soi-besoins-opportunites',
        title: 'Besoins et opportunités',
        subtitle: 'Recherche d’emploi ou de collaborateur, opportunité offerte, etc.',
        question: 'Quel appel à compétences ou quelle opportunité d’alliance lancez-vous à la communauté ?',
        posterUrl: '/assets/images/recruit_videographer_1791825865262.jpg',
        videoUrl: STOCK_VIDEOS[2]
      }
    ]
  }
];
