import pillarDuosImg from '../assets/images/pillar_duos_afro_1792601147557.jpg';
import pillarRoutesImg from '../assets/images/pillar_routes_afro_1792601148651.jpg';
import pillarOrgImg from '../assets/images/pillar_org_afro_1792601150815.jpg';
import pillarSoiImg from '../assets/images/pillar_soi_afro_1792601150131.jpg';

import sagessesResilienceImg from '../assets/images/sagesses_resilience_1792083778313.jpg';
import territoiresTraditionsImg from '../assets/images/territoires_traditions_1792085253556.jpg';
import expertisesArtisanatImg from '../assets/images/expertises_artisanat_1792085293909.jpg';
import storytellerImg from '../assets/images/home_afro_storyteller_1792193575638.jpg';
import projetsSocialImg from '../assets/images/projets_social_1792086395729.jpg';
import elderMahougnonImg from '../assets/images/mahougnon_ancestral_elder_1792193655638.jpg';
import dahZounonImg from '../assets/images/dah_zounon_vodun_1789590340850.jpg';
import koffiTisserandImg from '../assets/images/koffi_tisserand_benin_1789590473954.jpg';

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
  // 1. LES DUOS (Miroirs & Face-à-face)
  {
    id: 'duos',
    title: 'Duos en miroir',
    subtitle: 'Deux univers face à face, une même question humaine',
    question: 'Face à quel alter ego d’un autre monde souhaitez-vous confronter votre propre vécu ?',
    posterUrl: pillarDuosImg,
    videoUrl: STOCK_VIDEOS[0],
    items: [
      {
        id: 'jesus-legba',
        title: 'Vodun Rays ‹ › Amen',
        subtitle: 'Deux traditions spirituelles face aux épreuves de la foi et au mystère.',
        question: 'Comment votre foi ou votre rapport au sacré vous aide-t-il à traverser le deuil ou l’épreuve ?',
        posterUrl: '/assets/posters/Esu < > Jesus.png',
        videoUrl: STOCK_VIDEOS[0],
        badge: 'Spiritualités'
      },
      {
        id: 'finagnon-qosqorico',
        title: 'Bénin ‹ › ...',
        subtitle: 'Bénin face au monde : pêcheurs toffinou et paysans des terres sacrées.',
        question: 'Quel est votre lien intime avec la terre ou l’eau qui nourrit votre communauté ?',
        posterUrl: '/assets/posters/Benin < >.jpg',
        videoUrl: STOCK_VIDEOS[1],
        badge: 'Terres & Eaux'
      },
      {
        id: 'blacks-one-beyond-eve',
        title: 'Blacks One ‹ › Beyond Eve',
        subtitle: 'Corps en mouvement, affirmation de soi et dépassement des frontières intérieures.',
        question: 'Comment la danse ou l’expression corporelle vous permet-elle de réinventer votre liberté ?',
        posterUrl: '/assets/posters/Blacks One < > Beyond Eve.png',
        videoUrl: STOCK_VIDEOS[2],
        badge: 'Identités'
      },
      {
        id: 'focus-phd',
        title: 'Pictures ‹ › PhD',
        subtitle: 'Le regard photographique de l’instant face à la rigueur de la recherche.',
        question: 'Quel instant décisif a fait surgir la vérité qui a transformé à jamais votre regard ?',
        posterUrl: '/assets/posters/Focus < >  PhD.jpg',
        videoUrl: STOCK_VIDEOS[3],
        badge: 'Création & Savoir'
      },
      {
        id: 'fiat-luxe-sweet-street',
        title: 'Fiat Luxe ‹ › Sweet Street',
        subtitle: 'La haute gastronomie et la cuisine de rue populaire en dialogue.',
        question: 'Comment la saveur d’un plat peut-elle raviver l’histoire et la dignité de tout un peuple ?',
        posterUrl: '/assets/posters/Fiat Luxe < > Street.jpg',
        videoUrl: STOCK_VIDEOS[4],
        badge: 'Saveurs du monde'
      },
      {
        id: 'investors-builders',
        title: 'Investors ‹ › Builders',
        subtitle: 'L’élan d’investir face à l’ancrage de ceux qui bâtissent pierre par pierre.',
        question: 'Bâtir ou financer : quelle trace durable souhaitez-vous imprimer sur le continent ?',
        posterUrl: '/assets/posters/Investors < > Builders.png',
        videoUrl: STOCK_VIDEOS[0],
        badge: 'Économie vivante'
      },
      {
        id: 'coaching-unlimited',
        title: 'Coaching ‹ › Unlimited',
        subtitle: 'Le mental d’acier de l’athlète face à la force d’âme du mentor.',
        question: 'Où puisez-vous l’énergie de continuer lorsque le corps ou les certitudes lâchent ?',
        posterUrl: '/assets/posters/Coaching < > Unlimited.png',
        videoUrl: STOCK_VIDEOS[1],
        badge: 'Dépassement'
      },
      {
        id: 'other-eyes-sixth-sense',
        title: 'Other Eyes ‹ › Sixth Sense',
        subtitle: 'Voir au-delà de la cécité : l’intuition et la perception augmentée du monde.',
        question: 'Comment percevez-vous ce que la vue ordinaire ne permet plus de discerner ?',
        posterUrl: '/assets/posters/Other Eyes < > Third Eye.png',
        videoUrl: STOCK_VIDEOS[2],
        badge: 'Perceptions'
      }
    ]
  },

  // 2. DOCUMENTAIRE ITINÉRANT (Sur les routes)
  {
    id: 'itinerant',
    title: 'Sur les routes',
    subtitle: 'Le documentaire itinérant à la rencontre des mémoires et des sagesses',
    question: 'Quel savoir, quel rite ou quelle sagesse locale votre voix doit-elle transmettre ?',
    posterUrl: pillarRoutesImg,
    videoUrl: STOCK_VIDEOS[1],
    items: [
      {
        id: 'sagesses-anciens',
        title: 'Sagesses des anciens',
        subtitle: 'Les paroles immémoriales transmises de bouche à oreille au crépuscule.',
        question: 'Quel proverbe ou leçon de vie reçu de vos aïeux guide encore chacun de vos choix ?',
        posterUrl: sagessesResilienceImg,
        videoUrl: STOCK_VIDEOS[0],
        badge: 'Mémoire orale'
      },
      {
        id: 'memoires-terroirs',
        title: 'Mémoires des terroirs',
        subtitle: 'Les rites, les fêtes et les lieux sacrés qui forgent l’âme d’une terre.',
        question: 'Quel lieu secret ou tradition de votre enfance porte l’empreinte de votre lignée ?',
        posterUrl: territoiresTraditionsImg,
        videoUrl: STOCK_VIDEOS[1],
        badge: 'Territoires'
      },
      {
        id: 'gestes-matieres',
        title: 'Gestes et matières',
        subtitle: 'La main qui tisse, forge ou façonne la terre pour résister à l’oubli.',
        question: 'Quel savoir-faire manuel protégez-vous contre l’uniformisation du monde moderne ?',
        posterUrl: expertisesArtisanatImg,
        videoUrl: STOCK_VIDEOS[2],
        badge: 'Artisanat d’art'
      },
      {
        id: 'voix-itinerance',
        title: 'Voix de l’itinérance',
        subtitle: 'Les récits de nomades, voyageurs et témoins des grandes routes migratoires.',
        question: 'Que vous a appris la traversée des frontières sur la fraternité humaine ?',
        posterUrl: storytellerImg,
        videoUrl: STOCK_VIDEOS[3],
        badge: 'Grand voyage'
      }
    ]
  },

  // 3. LES ORGANISATIONS (4 Sous-catégories)
  {
    id: 'organisations',
    title: 'Organisations',
    subtitle: 'Entreprises, collectifs et coopératives racontés par celles et ceux qui les font vivre',
    question: 'Quel défi collectif et quelle fierté humaine soudent votre organisation de l’intérieur ?',
    posterUrl: pillarOrgImg,
    videoUrl: STOCK_VIDEOS[2],
    items: [
      {
        id: 'metiers-savoir-faire',
        title: 'Métiers & Savoir-faire',
        subtitle: 'L’excellence des gestes, l’apprentissage et la transmission au quotidien.',
        question: 'Quel geste d’excellence ou savoir unique vos équipes cultivent-elles avec passion jour après jour ?',
        posterUrl: pillarOrgImg,
        videoUrl: STOCK_VIDEOS[0],
        badge: 'Excellence'
      },
      {
        id: 'racines-fondations',
        title: 'Racines & Fondations',
        subtitle: 'L’étincelle pionnière, les pionniers fondateurs et l’héritage de la maison.',
        question: 'Quelle étincelle visionnaire ou épreuve fondatrice a donné naissance à votre organisation ?',
        posterUrl: '/assets/doors/door-marques.jpg',
        videoUrl: STOCK_VIDEOS[1],
        badge: 'Héritage'
      },
      {
        id: 'force-collectif',
        title: 'La force du collectif',
        subtitle: 'La solidarité au travail, l’esprit de corps et les liens humains indéfectibles.',
        question: 'Comment le lien humain entre vos collaborateurs dépasse-t-il le simple cadre contractuel ?',
        posterUrl: expertisesArtisanatImg,
        videoUrl: STOCK_VIDEOS[2],
        badge: 'Collectif'
      },
      {
        id: 'impact-solidarite',
        title: 'Impact & Solidarité',
        subtitle: 'L’engagement sociétal, l’ancrage territorial et la redistribution positive.',
        question: 'En quoi votre activité transforme-t-elle concrètement et durablement la vie de votre communauté ?',
        posterUrl: projetsSocialImg,
        videoUrl: STOCK_VIDEOS[3],
        badge: 'Solidarité'
      }
    ]
  },

  // 4. RÉCIT DE SOI (4 Sous-catégories)
  {
    id: 'soi',
    title: 'Récit de soi',
    subtitle: 'Tout le monde mérite d’avoir un documentaire sur soi',
    question: 'Quel tournant ou épreuve de votre existence constitue l’héritage vivant que vous léguez ?',
    posterUrl: pillarSoiImg,
    videoUrl: STOCK_VIDEOS[3],
    items: [
      {
        id: 'origines-lignee',
        title: 'Origines & Lignée',
        subtitle: 'Les racines familiales, les noms portés et les ancêtres qui veillent.',
        question: 'Quels ancêtres et quelles valeurs familiales fondatrices continuent d’habiter votre vie ?',
        posterUrl: dahZounonImg,
        videoUrl: STOCK_VIDEOS[0],
        badge: 'Racines'
      },
      {
        id: 'epreuves-renaissances',
        title: 'Épreuves & Renaissances',
        subtitle: 'Les blessures surmontées, les deuils et le courage de se réinventer.',
        question: 'Quel abîme avez-vous traversé, et qui a fait émerger la personne que vous êtes aujourd’hui ?',
        posterUrl: pillarSoiImg,
        videoUrl: STOCK_VIDEOS[1],
        badge: 'Résilience'
      },
      {
        id: 'vocations-passions',
        title: 'Vocations & Passions',
        subtitle: 'La flamme intérieure, l’art, l’engagement ou le métier de toute une vie.',
        question: 'Quel est ce feu intérieur qui donne un sens irremplaçable à chacune de vos journées ?',
        posterUrl: koffiTisserandImg,
        videoUrl: STOCK_VIDEOS[2],
        badge: 'Vocation'
      },
      {
        id: 'sagesses-heritage',
        title: 'Sagesses & Héritage',
        subtitle: 'Le testament moral, l’amour transmis et la parole laissée aux générations futures.',
        question: 'Quelle vérité essentielle et universelle souhaitez-vous léguer à celles et ceux qui viendront après vous ?',
        posterUrl: '/assets/aistudio/Capture_d_e_cran_2026-10-21_a__17.44.09_f2cf18c0.png',
        videoUrl: STOCK_VIDEOS[3],
        badge: 'Transmission'
      }
    ]
  }
];
