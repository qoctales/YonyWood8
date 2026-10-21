import pillarDuosImg from '../assets/images/pillar_duos_afro_1792601147557.jpg';
import pillarRoutesImg from '../assets/images/pillar_routes_afro_1792601148651.jpg';
import pillarOrgImg from '../assets/images/pillar_org_afro_1792601150815.jpg';
import pillarSoiImg from '../assets/images/pillar_soi_afro_1792601150131.jpg';

import sagessesResilienceImg from '../assets/images/sagesses_resilience_1792083778313.jpg';
import sagessesPardonImg from '../assets/images/sagesses_pardon_1792083785141.jpg';
import territoiresTraditionsImg from '../assets/images/territoires_traditions_1792085253556.jpg';
import expertisesArtisanatImg from '../assets/images/expertises_artisanat_1792085293909.jpg';
import persArtsImg from '../assets/images/pers_arts_1792086472940.jpg';
import storytellerImg from '../assets/images/home_afro_storyteller_1792193575638.jpg';
import projetsSocialImg from '../assets/images/projets_social_1792086395729.jpg';
import projetsInnovationImg from '../assets/images/projets_innovation_1792086397919.jpg';
import projetsEcologieImg from '../assets/images/projets_ecologie_1792086393821.jpg';
import psBeauteImg from '../assets/images/ps_beaute_1792086353881.jpg';
import psModeImg from '../assets/images/ps_mode_1792086355077.jpg';
import marquesLuxeImg from '../assets/images/marques_luxe_1792086431681.jpg';
import marquesAlimentationImg from '../assets/images/marques_alimentation_1792086435220.jpg';
import marquesFinanceImg from '../assets/images/marques_finance_1792086436922.jpg';
import marquesTechImg from '../assets/images/marques_tech_1792086434196.jpg';
import recruitVideographerImg from '../assets/images/recruit_videographer_1791825865262.jpg';
import studioOrgaOriginesImg from '../assets/images/studio_orga_origines_1792608957920.jpg';
import studioOrgaValeursImg from '../assets/images/studio_orga_valeurs_1792608959843.jpg';
import studioOrgaQuotidienImg from '../assets/images/studio_orga_quotidien_1792608958971.jpg';
import studioOrgaEpreuvesImg from '../assets/images/studio_orga_epreuves_1792608979150.jpg';
import studioOrgaRencontresImg from '../assets/images/orga_rencontres_afro_1792611454422.jpg';
import studioOrgaTransmissionImg from '../assets/images/orga_transm_afro_1792611469008.jpg';
import studioSoiParcoursImg from '../assets/images/studio_soi_parcours_1792608978314.jpg';

export interface StudioPillarItem {
  id: string;
  title: string;
  subtitle: string;
  question: string;
  posterUrl: string;
  videoUrl: string;
  badge?: string;
  accentColor?: string;
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
  // 1. DUOS EN MIROIR (8 séries documentaires diptyques)
  // =========================================================================
  {
    id: 'duos',
    title: 'Duos en miroir',
    subtitle: 'Deux univers face à face, une même question humaine universelle',
    question: 'Face à quel alter ego d’un autre monde souhaitez-vous confronter votre propre vécu ?',
    posterUrl: pillarDuosImg,
    videoUrl: STOCK_VIDEOS[0],
    items: [
      {
        id: 'vodun-rays-autre-foi',
        title: 'Vodun Rays ‹ › Autre Foi',
        subtitle: 'Deux traditions spirituelles face aux épreuves de la foi et au mystère.',
        question: 'Comment votre rapport au sacré ou à la foi vous aide-t-il à traverser le mystère et les épreuves ?',
        posterUrl: '/assets/posters/Esu < > Jesus.png',
        videoUrl: STOCK_VIDEOS[0]
      },
      {
        id: 'benin-monde',
        title: 'Bénin ‹ › Le Monde',
        subtitle: 'Bénin face au monde : pêcheurs toffinou et paysans des terres sacrées.',
        question: 'Quel est votre lien intime avec la terre ou l’eau qui nourrit votre communauté ?',
        posterUrl: '/assets/posters/Benin < >.jpg',
        videoUrl: STOCK_VIDEOS[1]
      },
      {
        id: 'roots-routes',
        title: 'Roots ‹ › Routes',
        subtitle: 'L’ancrage ancestral face à la traversée des frontières et des horizons.',
        question: 'L’ancrage dans ses racines ou l’envol sur les routes : où se forge votre véritable identité ?',
        posterUrl: '/assets/posters/Diasporas < > Makers.jpg',
        videoUrl: STOCK_VIDEOS[2]
      },
      {
        id: 'builders-seekers',
        title: 'Builders ‹ › Seekers',
        subtitle: 'La rigueur de ceux qui bâtissent face à la quête de ceux qui cherchent le sens.',
        question: 'Bâtir pierre par pierre ou chercher sans cesse l’horizon : quelle trace laissez-vous au monde ?',
        posterUrl: '/assets/posters/Investors < > Builders.png',
        videoUrl: STOCK_VIDEOS[3]
      },
      {
        id: 'pictures-phd',
        title: 'Pictures ‹ › PhD',
        subtitle: 'Le regard photographique de l’instant face à la rigueur de la recherche.',
        question: 'Quel instant décisif a fait surgir la vérité qui a transformé à jamais votre regard ?',
        posterUrl: '/assets/posters/Focus < >  PhD.jpg',
        videoUrl: STOCK_VIDEOS[4]
      },
      {
        id: 'blacks-one-beyond-eve',
        title: 'Blacks One ‹ › Beyond Eve',
        subtitle: 'Corps en mouvement, affirmation de soi et dépassement des frontières intérieures.',
        question: 'Comment l’expression du corps et le mouvement réinventent-ils votre liberté intérieure ?',
        posterUrl: '/assets/posters/Blacks One < > Beyond Eve.png',
        videoUrl: STOCK_VIDEOS[0]
      },
      {
        id: 'other-sights-third-eye',
        title: 'Other Sights ‹ › Third Eye',
        subtitle: 'Voir au-delà du visible : l’intuition et la perception augmentée du monde.',
        question: 'Comment percevez-vous avec acuité ce que le regard ordinaire ne permet plus de discerner ?',
        posterUrl: '/assets/posters/Other Eyes < > Third Eye.png',
        videoUrl: STOCK_VIDEOS[1]
      },
      {
        id: 'fiat-luxe-sweet-street',
        title: 'Fiat Luxe ‹ › Sweet Street',
        subtitle: 'La haute gastronomie et la cuisine populaire des rues en dialogue.',
        question: 'Comment la saveur d’un plat peut-elle raviver l’histoire et la dignité de tout un peuple ?',
        posterUrl: '/assets/posters/Fiat Luxe < > Street.jpg',
        videoUrl: STOCK_VIDEOS[2]
      }
    ]
  },

  // =========================================================================
  // 2. SUR LES ROUTES (Héritages : 8 grandes catégories patrimoniales)
  // =========================================================================
  {
    id: 'itinerant',
    title: 'Sur les routes',
    subtitle: 'Le documentaire itinérant à la rencontre des 8 catégories d’héritage',
    question: 'Quel savoir, quel rite ou quelle sagesse locale votre voix doit-elle transmettre ?',
    posterUrl: pillarRoutesImg,
    videoUrl: STOCK_VIDEOS[1],
    items: [
      {
        id: 'cat-sagesses',
        title: 'Sagesses',
        subtitle: 'Sens de la vie, foi, résilience, solidarité, gratitude, bienveillance, pardon, humilité.',
        question: 'Quel enseignement ou leçon de vie reçu de vos aïeux guide encore chacun de vos choix ?',
        posterUrl: sagessesResilienceImg,
        videoUrl: STOCK_VIDEOS[0]
      },
      {
        id: 'cat-territoires',
        title: 'Territoires',
        subtitle: 'Patrimoine, tradition, culture, histoire, terroir, langue, diaspora, coutumes.',
        question: 'Quel terroir, lieu sacré ou tradition porte l’empreinte indélébile de votre communauté ?',
        posterUrl: territoiresTraditionsImg,
        videoUrl: STOCK_VIDEOS[1]
      },
      {
        id: 'cat-expertises',
        title: 'Expertises',
        subtitle: 'Artisanat, agriculture, éducation, numérique, justice, santé, sécurité, design.',
        question: 'Quel savoir-faire ou geste d’artisan protégez-vous contre l’oubli et l’uniformisation ?',
        posterUrl: expertisesArtisanatImg,
        videoUrl: STOCK_VIDEOS[2]
      },
      {
        id: 'cat-personnalites',
        title: 'Personnalités',
        subtitle: 'Engagement, légendes, musique, cinéma, art, sport, influenceurs, littérature.',
        question: 'Quelle figure inspirante ou créateur engagé a éveillé votre propre vocation ?',
        posterUrl: persArtsImg,
        videoUrl: STOCK_VIDEOS[3]
      },
      {
        id: 'cat-epreuves',
        title: 'Épreuves',
        subtitle: 'Guerre, pauvreté, injustice, maladie, handicap, deuil, séparation, échec.',
        question: 'Quelle traversée difficile vous a révélé une force que vous ne soupçonniez pas ?',
        posterUrl: sagessesPardonImg,
        videoUrl: STOCK_VIDEOS[4]
      },
      {
        id: 'cat-produits-services',
        title: 'Produits et services',
        subtitle: 'Beauté, restauration, mode, bien-être, tourisme, transport, commerce, immobilier.',
        question: 'Comment votre création, votre soin ou votre commerce apporte-t-il du bien au quotidien ?',
        posterUrl: psBeauteImg,
        videoUrl: STOCK_VIDEOS[0]
      },
      {
        id: 'cat-projets',
        title: 'Projets',
        subtitle: 'Jeux, écologie, social, communautaire, innovation, entreprise, aventure, événements.',
        question: 'Quelle aventure, initiative collective ou innovation rêvez-vous de concrétiser ?',
        posterUrl: projetsInnovationImg,
        videoUrl: STOCK_VIDEOS[1]
      },
      {
        id: 'cat-liens',
        title: 'Liens',
        subtitle: 'Couple, parents, enfants, grands-parents, fratrie, amitié, communauté, animaux.',
        question: 'Quel lien d’amour, de famille ou d’amitié constitue le pilier inébranlable de votre existence ?',
        posterUrl: storytellerImg,
        videoUrl: STOCK_VIDEOS[2]
      }
    ]
  },

  // =========================================================================
  // 3. ORGANISATION (Lumières : 8 thématiques pures)
  // =========================================================================
  {
    id: 'organisations',
    title: 'Organisations',
    subtitle: 'Les 8 thématiques vivantes au cœur des collectifs et entreprises',
    question: 'Quel défi collectif et quelle fierté humaine soudent votre organisation de l’intérieur ?',
    posterUrl: pillarOrgImg,
    videoUrl: STOCK_VIDEOS[2],
    items: [
      {
        id: 'lum-origines',
        title: 'Origines',
        subtitle: 'Pourquoi et comment tout a commencé.',
        question: 'Quelle étincelle visionnaire ou défi initial a donné naissance à votre organisation ?',
        posterUrl: studioOrgaOriginesImg,
        videoUrl: STOCK_VIDEOS[0]
      },
      {
        id: 'lum-valeurs',
        title: 'Valeurs',
        subtitle: 'Ce qui compte vraiment ici.',
        question: 'Quels principes non négociables guident chaque décision au sein de votre collectif ?',
        posterUrl: studioOrgaValeursImg,
        videoUrl: STOCK_VIDEOS[1]
      },
      {
        id: 'lum-quotidien',
        title: 'Quotidien',
        subtitle: 'Une journée, un geste, un rituel.',
        question: 'Quel rituel quotidien ou geste d’attention caractérise l’ambiance de vos journées ?',
        posterUrl: studioOrgaQuotidienImg,
        videoUrl: STOCK_VIDEOS[2]
      },
      {
        id: 'lum-epreuves',
        title: 'Épreuves',
        subtitle: 'Le moment où l’on a failli tout arrêter.',
        question: 'Quelle crise majeure a testé votre foi dans le projet et comment l’avez-vous surmontée ?',
        posterUrl: studioOrgaEpreuvesImg,
        videoUrl: STOCK_VIDEOS[3]
      },
      {
        id: 'lum-rencontres',
        title: 'Rencontres',
        subtitle: 'La personne qui a changé quelque chose.',
        question: 'Quelle rencontre décisive a fait basculer le destin de votre entreprise ?',
        posterUrl: studioOrgaRencontresImg,
        videoUrl: STOCK_VIDEOS[4]
      },
      {
        id: 'lum-impact',
        title: 'Impact',
        subtitle: 'Ce que l’organisation a changé, pour soi ou pour d’autres.',
        question: 'Quelle transformation concrète votre organisation apporte-t-elle à sa communauté ?',
        posterUrl: marquesTechImg,
        videoUrl: STOCK_VIDEOS[0]
      },
      {
        id: 'lum-transmission',
        title: 'Transmission',
        subtitle: 'Ce qu’on apprend, ce qu’on lègue, la relève.',
        question: 'Quel savoir précieux transmettez-vous à la nouvelle génération pour assurer la suite ?',
        posterUrl: studioOrgaTransmissionImg,
        videoUrl: STOCK_VIDEOS[1]
      },
      {
        id: 'lum-avenir',
        title: 'Avenir',
        subtitle: 'Ce qu’on rêve de construire.',
        question: 'Quel rêve d’avenir ambitieux et lumineux guide aujourd’hui tous vos efforts ?',
        posterUrl: projetsEcologieImg,
        videoUrl: STOCK_VIDEOS[2]
      }
    ]
  },

  // =========================================================================
  // 4. RÉCIT DE SOI (Portrait : 4 directions fondamentales)
  // =========================================================================
  {
    id: 'soi',
    title: 'Récit de soi',
    subtitle: 'Les 4 directions d’expression et d’affirmation de soi',
    question: 'Quelle dimension intime de votre histoire humaine souhaitez-vous offrir au monde ?',
    posterUrl: pillarSoiImg,
    videoUrl: STOCK_VIDEOS[3],
    items: [
      {
        id: 'soi-parcours',
        title: 'Parcours de vie',
        subtitle: 'Son histoire, les étapes qui l’ont construite.',
        question: 'Quelles étapes fondatrices et quels tournants ont sculpté la personne que vous êtes ?',
        posterUrl: studioSoiParcoursImg,
        videoUrl: STOCK_VIDEOS[3]
      },
      {
        id: 'soi-produits-services',
        title: 'Produits et services',
        subtitle: 'Ce qu’elle fait, vend ou propose.',
        question: 'Quelle offre, création ou savoir-faire d’excellence mettez-vous au service d’autrui ?',
        posterUrl: psModeImg,
        videoUrl: STOCK_VIDEOS[0]
      },
      {
        id: 'soi-projets',
        title: 'Projets',
        subtitle: 'Ses projets en cours, éventuellement en financement participatif.',
        question: 'Quel chantier enthousiasmant ou création porteuse souhaitez-vous propulser ?',
        posterUrl: projetsSocialImg,
        videoUrl: STOCK_VIDEOS[1]
      },
      {
        id: 'soi-besoins-opportunites',
        title: 'Besoins et opportunités',
        subtitle: 'Recherche d’emploi ou de collaborateur, opportunité offerte, etc.',
        question: 'Quel appel à compétences ou quelle opportunité d’alliance lancez-vous à la communauté ?',
        posterUrl: recruitVideographerImg,
        videoUrl: STOCK_VIDEOS[2]
      }
    ]
  }
];
