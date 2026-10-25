import { AffiliationPerson, Protagonist } from '../types';
import { PROTAGONISTS } from '../data/mockData';
import { MATRIX_SERIES_DATA } from '../data/matrixData';
import { BENIN_STORIES } from '../data/explorerTopicsData';
import { COMPANIES_DATA, CompanyEntity } from '../data/companyPortraitsData';

export interface LineageMember {
  id: string;
  name: string;
  firstName?: string;
  age?: number;
  role: string;
  territory: string;
  country: string;
  flag: string;
  photoUrl: string;
  teaserVideoUrl?: string;
  universeTag?: string;
  quote?: string;
  questionAnswered?: {
    question: string;
    answer: string;
  };
  invitationStory?: string;
  acceptanceDate?: string;
  isPioneer?: boolean;
  isFounder?: boolean;
  sharesCount?: number;
  entityType?: 'person' | 'organization';
  organizationId?: string;
  sector?: string;
}

export interface LineageTree {
  current: LineageMember;
  ascendants: LineageMember[]; // Au moins 4 ascendants quand disponible, jusqu'au fondateur
  descendants: LineageMember[]; // Exactement 3 voix (personnes & organisations) cooptées sur la branche
  maxChildren: number; // 3
  sharePercentage: number; // 4%
  ruleSummary: string;
}

// Couleurs canoniques de la Lignée définies avec le créateur
export const LINEAGE_COLORS = {
  honey: '#C89B3C',      // Lignée ascendante (Miel doré chaud : parrain, transmission reçue)
  honeyLight: '#E8C576',
  terracotta: '#A2482B', // Lignée descendante (Terre cuite : enfants cooptés, transmission donnée)
  terracottaLight: '#C46A4D',
  terracottaBorder: '#C85A32', // Double liseré terre cuite chaud pour membres fondateurs
  charcoal: '#1C1917',
  sand: '#F7F5F0',
  cream: '#FCFBF7'
};

// Catalogue étendu d'ancêtres remontant jusqu'aux fondateurs racines
export const ANCESTOR_POOL: LineageMember[] = [
  {
    id: 'anc-dah-zounon',
    name: 'Mahougnon Zounon',
    firstName: 'Mahougnon',
    age: 78,
    role: 'Gardien du sanctuaire d’Èṣù & Passeur d’arcanes',
    territory: 'Ouidah & Allada',
    country: 'Bénin',
    flag: '🇧🇯',
    photoUrl: '/assets/duos/dah-zounon.jpg',
    universeTag: 'Èṣù',
    quote: '« La lignée n’est pas une chaîne qui entrave, c’est une sève qui féconde les racines invisibles. »',
    questionAnswered: {
      question: 'Comment ouvrir les voies quand toutes les portes semblent closes ?',
      answer: 'En honorant les seuils et en n’exigeant jamais que le carrefour s’adapte à notre impatience.'
    },
    invitationStory: 'A transmis les chants des carrefours et le sceau des alliances inviolables.',
    acceptanceDate: 'Alliance ancestrale scellée',
    isPioneer: true,
    isFounder: true
  },
  {
    id: 'anc-kpodan-yeyinou',
    name: 'Yéyinou Kpodan',
    firstName: 'Yéyinou',
    age: 71,
    role: 'Aïeule potière des terres sacrées & Gardienne du feu',
    territory: 'Sé & Mono',
    country: 'Bénin',
    flag: '🇧🇯',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
    universeTag: 'Terre & Argile',
    quote: '« L’argile ne ment jamais : elle garde l’empreinte de l’amour comme celle de la hâte. »',
    questionAnswered: {
      question: 'Quel est le secret de ce qui traverse le temps sans se briser ?',
      answer: 'Laisser sécher l’esprit avant de l’exposer au grand feu du monde.'
    },
    invitationStory: 'A initié le geste du modelage sans tour et le respect des terres d’argile.',
    acceptanceDate: 'Filiation millénaire',
    isPioneer: true,
    isFounder: true
  },
  {
    id: 'anc-mensah-houndete',
    name: 'Mensah Houndété',
    firstName: 'Mensah',
    age: 64,
    role: 'Grand Maître Tisserand des cours royales',
    territory: 'Porto-Novo',
    country: 'Bénin',
    flag: '🇧🇯',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    universeTag: 'Finagnon',
    quote: '« Quand deux âmes se choisissent, le fil ne rompt jamais sous le poids des années. »',
    questionAnswered: {
      question: 'Comment tissez-vous le lien entre générations disparates ?',
      answer: 'En croisant un fil de mémoire solide avec un fil d’espérance libre.'
    },
    invitationStory: 'A transmis le geste du peigne d’acajou et le respect de la parole donnée.',
    acceptanceDate: 'Filiation de savoir'
  },
  {
    id: 'anc-cheikh-amadou',
    name: 'Cheikh Amadou Kane',
    firstName: 'Amadou',
    age: 58,
    role: 'Passeur de mémoire fluviale & Écrivain des rives',
    territory: 'Saint-Louis',
    country: 'Sénégal',
    flag: '🇸🇳',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    universeTag: 'Sagesse des Fleuves',
    quote: '« Ce que tu donnes à ton enfant grandit avec lui, ce que tu retiens s’éteint avec toi. »',
    questionAnswered: {
      question: 'Que vous ont appris les courants du fleuve sur l’oubli ?',
      answer: 'Que l’eau emporte l’écume mais dépose toujours le limon nourricier au rivage.'
    },
    invitationStory: 'A guidé la vocation poétique lors de la grande traversée du fleuve.',
    acceptanceDate: 'Alliance fluviale'
  },
  {
    id: 'anc-pere-matthieu',
    name: 'Dieudonné Dossou',
    firstName: 'Dieudonné',
    age: 52,
    role: 'Prêtre bâtisseur & Théologien du dialogue des mémoires',
    territory: 'Littoral & Diaspora',
    country: 'Bénin',
    flag: '🇧🇯',
    photoUrl: '/assets/duos/pere-matthieu.jpg',
    universeTag: 'Jésus',
    quote: '« Prendre quelqu’un sous ses ailes, c’est lui offrir le ciel sans jamais exiger qu’il vole comme nous. »',
    questionAnswered: {
      question: 'Quelle prière murmurez-vous pour celui que vous accueillez ?',
      answer: 'Qu’il trouve le courage de devenir exactement qui il est promis d’être.'
    },
    invitationStory: 'Parrain spirituel ayant ouvert le dialogue de foi et coopté la première génération.',
    acceptanceDate: 'Cooptation fondatrice',
    isPioneer: true
  },
  {
    id: 'anc-sossou-anani',
    name: 'Anani Sossou',
    firstName: 'Anani',
    age: 49,
    role: 'Forgeron alchimiste des seuils & Ciseleur de cloches',
    territory: 'Ouidah',
    country: 'Bénin',
    flag: '🇧🇯',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
    universeTag: 'Gou & Métal',
    quote: '« Le fer rouge accepte la frappe qui lui donne forme ; il rejette celle qui cherche à l’humilier. »',
    questionAnswered: {
      question: 'Que chante l’enclume à l’aube ?',
      answer: 'Elle réveille les volontés endormies et soude les engagements fidèles.'
    },
    invitationStory: 'A transmis le marteau de forge et le rituel d’apaisement des métaux.',
    acceptanceDate: 'Pacte du soufflet'
  }
];

// Pool de collaborateurs / créateurs humains (100% individus pour les profils)
export const PERSON_DESCENDANT_POOL: LineageMember[] = [
  {
    id: 'coopt-camille-desc-1',
    name: 'Sœur Blandine Dossou',
    firstName: 'Blandine',
    age: 36,
    role: 'Religieuse bénédictine & Botaniste des simples',
    territory: 'Abomey',
    country: 'Bénin',
    flag: '🇧🇯',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    universeTag: 'Jésus',
    entityType: 'person',
    quote: '« Le silence de la prière et celui de la forêt ne font qu’un quand on écoute avec le cœur. »',
    questionAnswered: {
      question: 'Quelle plante guérit l’inquiétude de l’avenir ?',
      answer: 'La verveine sauvage cueillie à la rosée avec une intention de paix.'
    },
    invitationStory: 'Cooptée d’un commun accord lors des soins aux enfants du dispensaire de Toffo.',
    acceptanceDate: 'Printemps 2024 · Acceptation mutuelle'
  },
  {
    id: 'coopt-camille-desc-2',
    name: 'Koffi Mensah',
    firstName: 'Koffi',
    age: 29,
    role: 'Tisserand de motifs sacrés & Conteur',
    territory: 'Porto-Novo',
    country: 'Bénin',
    flag: '🇧🇯',
    photoUrl: '/assets/protagonists/koffi-tisserand.jpg',
    universeTag: 'Finagnon',
    entityType: 'person',
    quote: '« Le métier à tisser répare ce que les mots d’orgueil ont déchiré. »',
    questionAnswered: {
      question: 'Que raconte le motif à quatre étoiles ?',
      answer: 'Les quatre points cardinaux d’une fidélité qui ne dévie jamais.'
    },
    invitationStory: 'Reçu sous ses ailes après la révélation du motif à quatre étoiles.',
    acceptanceDate: 'Automne 2023 · Acceptation mutuelle'
  },
  {
    id: 'coopt-camille-desc-3',
    name: 'Aïssatou Ba',
    firstName: 'Aïssatou',
    age: 32,
    role: 'Cinéaste du réel & Documentariste des mémoires orales',
    territory: 'Dakar',
    country: 'Sénégal',
    flag: '🇸🇳',
    photoUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=600&q=80',
    universeTag: 'Regard Vivant',
    entityType: 'person',
    quote: '« Filmer quelqu’un avec ferveur, c’est lui rendre la souveraineté de son regard. »',
    questionAnswered: {
      question: 'Quand la caméra devient-elle invisible ?',
      answer: 'Quand elle écoute plus fort qu’elle ne regarde.'
    },
    invitationStory: 'Cooptation scellée après le tournage partagé sur les femmes du Fouta.',
    acceptanceDate: 'Hiver 2024 · Acceptation mutuelle'
  },
  {
    id: 'coopt-camille-desc-4',
    name: 'Frère Jean-Baptiste',
    firstName: 'Jean-Baptiste',
    age: 41,
    role: 'Apiculteur de cloître & Gardien d’essaims',
    territory: 'Toffo',
    country: 'Bénin',
    flag: '🇧🇯',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
    universeTag: 'Jésus',
    entityType: 'person',
    quote: '« Les abeilles fabriquent la cire des cierges sans savoir qu’elles éclairent le divin. »',
    questionAnswered: {
      question: 'Que murmurent les abeilles au crépuscule ?',
      answer: 'Que la patience collective fabrique le miel le plus doux de la terre.'
    },
    invitationStory: 'Accueilli sous ses ailes pour perpétuer le miel des carrefours.',
    acceptanceDate: 'Été 2024 · Acceptation mutuelle'
  },
  {
    id: 'coopt-camille-desc-5',
    name: 'Senan Agossa',
    firstName: 'Senan',
    age: 27,
    role: 'Styliste & Créatrice de textiles solaires',
    territory: 'Ouidah',
    country: 'Bénin',
    flag: '🇧🇯',
    photoUrl: '/assets/protagonists/senan-agossa.jpg',
    universeTag: 'Mode & Racines',
    entityType: 'person',
    quote: '« Le vêtement est la première demeure de la dignité. »',
    questionAnswered: {
      question: 'D’où puisez-vous vos teintes naturelles ?',
      answer: 'Des écorces d’acajou et des terres ocres recueillies au crépuscule.'
    },
    invitationStory: 'Cooptée pour sa recherche audacieuse sur les teintures vivantes.',
    acceptanceDate: 'Automne 2024 · Acceptation mutuelle'
  },
  {
    id: 'coopt-camille-desc-6',
    name: 'Armel Hounkpatin',
    firstName: 'Armel',
    age: 38,
    role: 'Écrivain & Chroniqueur des marchés côtiers',
    territory: 'Grand-Popo',
    country: 'Bénin',
    flag: '🇧🇯',
    photoUrl: '/assets/protagonists/armel-hounkpatin.jpg',
    universeTag: 'Littérature',
    entityType: 'person',
    quote: '« Rien de ce qui est dit au marché n’est jamais tout à fait profane. »',
    questionAnswered: {
      question: 'Quel mot béninois porte la promesse de demain ?',
      answer: 'Finagnon : l’aurore qui réconcilie.'
    },
    invitationStory: 'Passeur de mémoire littéraire ayant scellé l’alliance des mots libres.',
    acceptanceDate: 'Printemps 2023 · Acceptation mutuelle'
  },
  {
    id: 'coopt-camille-desc-7',
    name: 'Fatou Diallo',
    firstName: 'Fatou',
    age: 33,
    role: 'Performeuse vocale & Gardienne des polyphonies',
    territory: 'Saint-Louis',
    country: 'Sénégal',
    flag: '🇸🇳',
    photoUrl: '/assets/protagonists/fatou-diallo.jpg',
    universeTag: 'Chant & Souffle',
    entityType: 'person',
    quote: '« La voix porte plus loin que le vent quand le cœur est en paix. »',
    questionAnswered: {
      question: 'Pourquoi chanter ensemble à l’aube ?',
      answer: 'Pour accorder le souffle de l’homme avec la pulsation de la terre.'
    },
    invitationStory: 'Initiée aux chants du fleuve pour enrichir les résonances chorales.',
    acceptanceDate: 'Hiver 2023 · Acceptation mutuelle'
  },
  {
    id: 'coopt-camille-desc-8',
    name: 'Codjo Noumon',
    firstName: 'Codjo',
    age: 44,
    role: 'Sculpteur de bronze sacré & Fondeur à cire perdue',
    territory: 'Abomey',
    country: 'Bénin',
    flag: '🇧🇯',
    photoUrl: '/assets/protagonists/codjo-blind.jpg',
    universeTag: 'Bronze & Feu',
    entityType: 'person',
    quote: '« Le feu ne brûle que ce qui n’est pas digne de subsister. »',
    questionAnswered: {
      question: 'Combien de temps faut-il pour écouter le bronze ?',
      answer: 'Le temps nécessaire pour que la cire s’efface en laissant la trace éternelle.'
    },
    invitationStory: 'Maître fondeur accueilli pour transmettre le secret de l’alliage royal.',
    acceptanceDate: 'Été 2023 · Acceptation mutuelle'
  }
];

// Pool rétrocompatible
export const DESCENDANT_POOL = PERSON_DESCENDANT_POOL;

/**
 * Normalise n'importe quelle entrée (string ID, Protagonist, AffiliationPerson, CompanyEntity)
 * en un LineageMember complet.
 */
export function resolveLineageMember(input: string | AffiliationPerson | Protagonist | CompanyEntity): LineageMember {
  if (typeof input === 'string') {
    // 0. Chercher d'abord dans ANCESTOR_POOL
    const ancFound = ANCESTOR_POOL.find(a => a.id === input);
    if (ancFound) return { ...ancFound, entityType: 'person' };

    // 0b. Chercher dans DESCENDANT_POOL
    const descFound = DESCENDANT_POOL.find(d => d.id === input || input.startsWith(d.id));
    if (descFound) return { ...descFound };

    // 0c. Chercher dans COMPANIES_DATA (Organisations sur Lumières)
    const cleanInputId = input.toLowerCase().replace(/^company-/, '').replace(/-co$/, '');
    const compFound = COMPANIES_DATA.find(c => 
      c.id.toLowerCase() === input.toLowerCase() ||
      c.id.toLowerCase() === cleanInputId ||
      c.companyName.toLowerCase() === input.toLowerCase() ||
      c.id.includes(input.toLowerCase()) ||
      input.toLowerCase().includes(c.id.toLowerCase())
    );
    if (compFound) {
      return {
        id: compFound.id,
        name: compFound.companyName,
        firstName: compFound.companyName,
        role: `${compFound.category} · ${compFound.tagline}`,
        territory: compFound.location || 'Bénin',
        country: 'Bénin',
        flag: '🇧🇯',
        photoUrl: compFound.photoUrl,
        teaserVideoUrl: compFound.videoUrl,
        universeTag: compFound.category,
        quote: compFound.tagline,
        questionAnswered: {
          question: compFound.manifestoQuestion || 'Quelle mémoire choisissons-nous de léguer à travers notre entreprise ?',
          answer: compFound.tagline || 'Créer de la valeur ancrée dans le terroir et la transmission.'
        },
        invitationStory: compFound.description || `Organisation ${compFound.companyName} parrainée et mise en lumière sur YonyWood.`,
        entityType: 'organization',
        organizationId: compFound.id,
        sector: compFound.category
      };
    }

    // 1. Chercher dans PROTAGONISTS
    const pFound = PROTAGONISTS.find(p => p.id === input || p.slug === input);
    if (pFound) {
      return {
        id: pFound.id,
        name: pFound.name,
        firstName: pFound.firstName || pFound.name.split(' ')[0],
        age: (pFound as any).age || 38,
        role: pFound.role,
        territory: pFound.territory,
        country: pFound.country,
        flag: pFound.flag,
        photoUrl: pFound.photoUrl,
        teaserVideoUrl: pFound.teaserVideoUrl,
        universeTag: pFound.universeTag,
        quote: pFound.quote,
        entityType: 'person',
        questionAnswered: {
          question: (pFound as any).question || 'Quelle vision singulière ce parcours apporte-t-il au monde ?',
          answer: pFound.quote || 'Transmettre la sève du récit partagé au-delà des frontières.'
        },
        invitationStory: pFound.bio
      };
    }

    // 2. Chercher dans MATRIX_SERIES_DATA
    for (const series of MATRIX_SERIES_DATA) {
      const pioneer = series.pioneers.find(pi => pi.id === input);
      if (pioneer) {
        return {
          id: pioneer.id,
          name: pioneer.name,
          firstName: pioneer.firstName,
          age: pioneer.age || 46,
          role: pioneer.role,
          territory: pioneer.territory,
          country: pioneer.country,
          flag: pioneer.flag,
          photoUrl: pioneer.photoUrl,
          teaserVideoUrl: pioneer.teaserVideoUrl,
          universeTag: pioneer.universeTag,
          quote: pioneer.teaserPitch,
          questionAnswered: {
            question: pioneer.question || 'Quelle est la clé de votre persévérance face à l’inconnu ?',
            answer: pioneer.teaserPitch || 'L’enracinement dans la mémoire et l’élan vers l’autre.'
          },
          invitationStory: pioneer.invitationStory,
          isPioneer: pioneer.isPioneer,
          isFounder: pioneer.isPioneer
        };
      }
      // Chercher récursivement dans les enfants de MATRIX_SERIES_DATA
      for (const pi of series.pioneers) {
        if (pi.invitedPeople) {
          const rec = findInDescendants(pi.invitedPeople, input);
          if (rec) {
            return {
              id: rec.id,
              name: rec.name,
              firstName: rec.firstName,
              age: rec.age || 34,
              role: rec.role,
              territory: rec.territory,
              country: rec.country,
              flag: rec.flag,
              photoUrl: rec.photoUrl,
              teaserVideoUrl: rec.teaserVideoUrl,
              universeTag: rec.universeTag,
              quote: rec.teaserPitch,
              questionAnswered: {
                question: rec.question || 'Comment faire fleurir l’alliance au quotidien ?',
                answer: rec.teaserPitch || 'Par l’écoute attentive et le respect scellé du geste.'
              },
              invitationStory: rec.invitationStory
            };
          }
        }
      }
    }

    // 3. Chercher dans BENIN_STORIES
    const bFound = BENIN_STORIES.find(b => b.id === input);
    if (bFound) {
      return {
        id: bFound.id,
        name: bFound.name,
        firstName: bFound.firstName,
        age: bFound.age || 40,
        role: bFound.role,
        territory: bFound.territory,
        country: bFound.country,
        flag: bFound.flag,
        photoUrl: bFound.photoUrl,
        teaserVideoUrl: bFound.teaserVideoUrl,
        universeTag: bFound.universeTag,
        quote: bFound.teaserPitch,
        questionAnswered: {
          question: (bFound as any).question || 'Quelle histoire transmettez-vous en premier ?',
          answer: bFound.teaserPitch || 'Celle qui redonne à chacun la dignité de son propre nom.'
        },
        invitationStory: bFound.invitationStory
      };
    }

    // 4. Cas spécial Roméo ou utilisateur connecté par défaut
    if (input.toLowerCase().includes('romeo') || input === 'usr-admin-romeo' || input === 'usr-admin-1' || input === 'default-user') {
      return {
        id: 'usr-admin-romeo',
        name: 'Roméo Nonvide',
        firstName: 'Roméo',
        age: 29,
        role: 'Retour au pays & Créateur de récits',
        territory: 'Cotonou & Diaspora',
        country: 'Bénin',
        flag: '🇧🇯',
        photoUrl: '/assets/images/romeo_avatar_1792698425983.jpg',
        universeTag: 'Bénin & Retour',
        quote: '« Revenir n’est pas recommencer à zéro, c’est apporter ce que le monde nous a appris pour faire grandir la terre de nos ancêtres. »',
        questionAnswered: {
          question: 'Pourquoi avoir choisi de rentrer et de vous installer au Bénin ?',
          answer: 'Pour bâtir ici avec notre génération et transmettre des récits vivants qui résonnent bien au-delà de nos frontières.'
        },
        invitationStory: 'Jeune Béninois à lunettes de retour d’Europe, installant son studio de production de récits à Cotonou.',
        acceptanceDate: 'Retour d’expérience scellé'
      };
    }

    // 4b. Cas spécial Camille
    if (input.toLowerCase().includes('camille')) {
      return {
        id: 'camille-artisan',
        name: 'Camille',
        firstName: 'Camille',
        age: 34,
        role: 'Protagoniste & Passeur de récits',
        territory: 'Bénin & France',
        country: 'Bénin',
        flag: '🇧🇯',
        photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
        universeTag: 'Alliance des Rives',
        quote: '« Nous ne transmettons pas pour retenir, mais pour que l’autre marche plus loin que nous. »',
        questionAnswered: {
          question: 'Pourquoi transmettre sans retenir ?',
          answer: 'Parce que la liberté donnée à l’autre est la seule mesure de la sincérité d’une filiation.'
        },
        invitationStory: 'A pris sous ses ailes 4 bâtisseurs pour perpétuer la flamme du récit partagé.',
        acceptanceDate: 'Parrainage fondateur'
      };
    }

    // Fallback utilisateur connecté ou profil personnalisé
    const nameClean = input.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    return {
      id: input,
      name: nameClean,
      firstName: nameClean.split(' ')[0],
      age: 35,
      role: 'Membre coopté de la Lignée',
      territory: 'Bénin',
      country: 'Bénin',
      flag: '🇧🇯',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      universeTag: 'YonyWood',
      quote: '« Chaque être lié à la lignée nourrit la sève commune. »',
      questionAnswered: {
        question: 'Quelle promesse faites-vous à la communauté ?',
        answer: 'Prendre soin du lien et transmettre ce que j’ai reçu avec ferveur.'
      },
      invitationStory: 'Intégré par cooptation mutuelle et réciproque.'
    };
  }

  // Si c'est déjà un objet CompanyEntity
  if ('companyName' in input) {
    const comp = input as CompanyEntity;
    return {
      id: comp.id,
      name: comp.companyName,
      firstName: comp.companyName,
      role: `${comp.category} · ${comp.tagline}`,
      territory: comp.location || 'Bénin',
      country: 'Bénin',
      flag: '🇧🇯',
      photoUrl: comp.photoUrl,
      teaserVideoUrl: comp.videoUrl,
      universeTag: comp.category,
      quote: comp.tagline,
      questionAnswered: {
        question: comp.manifestoQuestion || 'Quelle mémoire choisissons-nous de léguer à travers notre entreprise ?',
        answer: comp.tagline || 'Créer de la valeur ancrée dans le terroir et la transmission.'
      },
      invitationStory: comp.description || `Organisation ${comp.companyName} parrainée et mise en lumière sur YonyWood.`,
      entityType: 'organization',
      organizationId: comp.id,
      sector: comp.category
    };
  }

  // Si c'est un Protagonist ou AffiliationPerson
  const p = input as (Protagonist | AffiliationPerson);
  return {
    id: p.id,
    name: p.name,
    firstName: (p as any).firstName || (p.name ? p.name.split(' ')[0] : 'Inconnu'),
    age: (p as any).age || 38,
    role: p.role || 'Membre de la lignée',
    territory: p.territory || 'Bénin',
    country: p.country || 'Bénin',
    flag: p.flag || '🇧🇯',
    photoUrl: (p as any).photoUrl || (p as any).photo || '',
    teaserVideoUrl: (p as any).teaserVideoUrl,
    universeTag: (p as any).universeTag,
    quote: (p as any).quote || (p as any).teaserPitch,
    questionAnswered: (p as any).questionAnswered || {
      question: (p as any).question || 'Quelle est votre aspiration profonde pour la lignée ?',
      answer: (p as any).quote || (p as any).teaserPitch || 'Marcher ensemble dans la confiance.'
    },
    invitationStory: (p as any).invitationStory || (p as any).bio,
    isPioneer: (p as any).isPioneer,
    isFounder: (p as any).isFounder || (p as any).isPioneer,
    entityType: 'person'
  };
}

function findInDescendants(list: AffiliationPerson[], targetId: string): AffiliationPerson | null {
  for (const item of list) {
    if (item.id === targetId) return item;
    if (item.invitedPeople && item.invitedPeople.length > 0) {
      const sub = findInDescendants(item.invitedPeople, targetId);
      if (sub) return sub;
    }
  }
  return null;
}

/**
 * Construit l'arbre complet de lignée pour n'importe quel individu.
 * Règles :
 * - Si le membre fait partie des premiers (fondateur/isFounder), il n'a aucun ascendant au-dessus.
 * - Tout autre membre a au moins 4 ascendants au-dessus de lui, remontant jusqu'au fondateur racine.
 * - Défilement vertical fluide le long de la frise.
 * - Double liseré terre cuite chaud pour distinguer les membres fondateurs.
 * - Jusqu'à 4 enfants cooptés maximum en dessous.
 */
export function getLineageTree(personOrId: string | AffiliationPerson | Protagonist): LineageTree {
  const current = resolveLineageMember(personOrId);
  const isOrg = current.entityType === 'organization';

  // 1. Déterminer les ascendants (100% homogènes : soit humains, soit organisations)
  const ascendants: LineageMember[] = [];

  if (isOrg) {
    // Lignée ascendante d'organisations partenaires & fondatrices
    const otherOrgs = COMPANIES_DATA.filter(c => c.id !== current.id && c.companyName.toLowerCase() !== current.name.toLowerCase());
    const hash = Math.abs(hashString(current.id));
    for (let i = 0; i < Math.min(3, otherOrgs.length); i++) {
      const comp = otherOrgs[(hash + i) % otherOrgs.length];
      ascendants.push(resolveLineageMember(comp));
    }
  } else {
    // Lignée ascendante humaine (Mentors & Sages fondateurs)
    const isDirectFounder = current.isFounder === true || 
      current.id === 'anc-dah-zounon' || 
      current.id === 'anc-kpodan-yeyinou';

    if (isDirectFounder) {
      current.isFounder = true;
    } else {
      const hash = Math.abs(hashString(current.id));
      const rootFounder = { ...ANCESTOR_POOL[0], isFounder: true };
      const intermediate1 = ANCESTOR_POOL[1 + (hash % 2)];
      const intermediate2 = ANCESTOR_POOL[3 + (hash % 2)];
      const directSponsor = ANCESTOR_POOL[4 + (hash % 2)];

      const chainCandidates = [rootFounder, intermediate1, intermediate2, directSponsor];
      for (const candidate of chainCandidates) {
        if (candidate.id !== current.id && !ascendants.some(a => a.id === candidate.id)) {
          ascendants.push(candidate);
        }
      }

      if (ascendants.length < 4) {
        for (const poolItem of ANCESTOR_POOL) {
          if (poolItem.id !== current.id && !ascendants.some(a => a.id === poolItem.id)) {
            ascendants.unshift(poolItem);
            if (ascendants.length >= 4) break;
          }
        }
      }
    }
  }

  // 2. Déterminer les descendants (100% personnes OU 100% organisations)
  const descendants: LineageMember[] = [];

  if (isOrg) {
    // Descendance d'alliances entre organisations
    const otherOrgs = COMPANIES_DATA.filter(c => c.id !== current.id && !ascendants.some(a => a.id === c.id));
    const hash = Math.abs(hashString(current.id));
    for (let i = 0; i < otherOrgs.length; i++) {
      const comp = otherOrgs[(hash + 3 + i) % otherOrgs.length];
      if (!descendants.some(d => d.id === comp.id)) {
        descendants.push(resolveLineageMember(comp));
      }
    }
  } else {
    // Descendance humaine de collaborateurs, disciples et créateurs
    const rawMatrixPerson = findPersonInMatrix(current.id);
    if (rawMatrixPerson && rawMatrixPerson.invitedPeople && rawMatrixPerson.invitedPeople.length > 0) {
      for (const child of rawMatrixPerson.invitedPeople.slice(0, 16)) {
        const resolved = resolveLineageMember(child);
        if (resolved.entityType !== 'organization') {
          descendants.push(resolved);
        }
      }
    }

    const rawProtagonist = PROTAGONISTS.find(p => p.id === current.id);
    if (rawProtagonist && rawProtagonist.tree?.heritiers && rawProtagonist.tree.heritiers.length > 0) {
      for (const h of rawProtagonist.tree.heritiers.slice(0, 16)) {
        if (!descendants.some(d => d.id === h.id)) {
          descendants.push({
            id: h.id,
            name: h.name,
            firstName: h.name.split(' ')[0],
            role: h.role,
            territory: h.country,
            country: h.country,
            flag: '🌍',
            photoUrl: h.photo,
            entityType: 'person',
            quote: '« Disciple coopté par transmission directe du maître. »',
            invitationStory: `Accueilli par ${current.name} pour perpétuer son atelier et son savoir.`,
            acceptanceDate: 'Alliance validée bilatéralement'
          });
        }
      }
    }

    // Compléter avec PERSON_DESCENDANT_POOL
    const hash = Math.abs(hashString(current.id));
    let poolIndex = hash % PERSON_DESCENDANT_POOL.length;

    while (descendants.length < 9) {
      const candidate = PERSON_DESCENDANT_POOL[poolIndex % PERSON_DESCENDANT_POOL.length];
      const uniqueChildId = `${candidate.id}-${Math.abs(hashString(`${current.id}-${poolIndex}`)).toString(36).slice(0, 5)}`;
      if (candidate.id !== current.id && !descendants.some(d => d.id === candidate.id || d.id === uniqueChildId)) {
        descendants.push({
          ...candidate,
          id: uniqueChildId,
          invitationStory: `Pris(e) sous ses ailes par ${current.name} suite à une résonance de cœur.`,
          acceptanceDate: 'Acceptation mutuelle scellée'
        });
      }
      poolIndex++;
      if (poolIndex > 50) break;
    }
  }

  return {
    current,
    ascendants,
    descendants: descendants.slice(0, 16),
    maxChildren: 16,
    sharePercentage: 4,
    ruleSummary: isOrg 
      ? "Alliance des Lumières · Réseau d'organisations & studios cooptés" 
      : "Alliance de transmission directe · Collaborateurs & créateurs cooptés"
  };
}

/**
 * Retourne les enfants cooptés d'un membre pour afficher sa descendance immédiate
 * sur la ligne inférieure de l'arbre généalogique.
 */
export function getChildrenForMember(memberOrId: string | LineageMember): LineageMember[] {
  const member = typeof memberOrId === 'string' ? resolveLineageMember(memberOrId) : memberOrId;
  const tree = getLineageTree(member.id);
  return tree.descendants;
}

function findPersonInMatrix(id: string): AffiliationPerson | null {
  for (const series of MATRIX_SERIES_DATA) {
    const p = series.pioneers.find(item => item.id === id);
    if (p) return p;
    for (const pioneer of series.pioneers) {
      if (pioneer.invitedPeople) {
        const found = findInDescendants(pioneer.invitedPeople, id);
        if (found) return found;
      }
    }
  }
  return null;
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return hash;
}
