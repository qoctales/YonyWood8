import { PROTAGONISTS, DUOS } from '../data/mockData';
import { MATRIX_SERIES_DATA } from '../data/matrixData';
import { AffiliationPerson, Protagonist } from '../types';
import { DIMENSIONS, getSubcategoriesForDimension, SousCategorie, SOUS_CATEGORIES } from '../data/dimensionsData';

export interface MatrixProfile {
  id: string;
  name: string;
  firstName?: string;
  role: string;
  territory: string;
  country: string;
  flag: string;
  universeTag: string;
  photoUrl: string;
  badge?: string;
  invitationStory?: string;
  teaserPitch?: string;
  teaserVideoUrl?: string;
  question?: string;
  centralQuestion?: string;
  counterpointId?: string;
  counterpointName?: string;
  counterpointPhoto?: string;
  duoId?: string;
  duoPartnerName?: string;
  invitedById?: string;
  invitedByName?: string;
  invitedPeopleIds?: string[];
  doorId: string; // Dimension/Porte (series, sagesses, territoires, expertises, etc.)
  doorLabel?: string; // Libellé de la Porte (ex: 'Sagesses', 'Séries', 'Territoires')
  directionLabel?: string; // Libellé officiel de la direction (ex: 'Résilience', 'Amour', 'Solidarité', 'Vodunrays')
  allowedToAppear: boolean;
  placeholder?: boolean;
}

export type NeighborSourceType = 'counterpoint' | 'parent' | 'descendant' | 'lineage' | 'resonance' | 'theme' | 'discovery';

export interface PersonSatellite {
  kind: 'person';
  person: MatrixProfile;
  sourceType: NeighborSourceType;
  sourceLabel: string; // Mini-légende de 2 mots (ex: 'Contrepoint Duo', 'Filiation', 'Lignée', 'Résonance', 'Découverte')
  strokeColor: string;
  strokeDash: string;
  strokeWidth: number;
}

export interface ThemeSatellite {
  kind: 'theme';
  doorId: string;
  label: string;
  shortLabel: string;
  iconName: string;
  accentColor: string;
  glowColor: string;
  tagline: string;
  subcategories: SousCategorie[];
  isPrimaryForSun?: boolean;
}

export type SunSatellite = PersonSatellite | ThemeSatellite;

// Alias de rétrocompatibilité
export type SunNeighbor = PersonSatellite;

// 1. Extraction et fusion de tous les profils réels disponibles
export function getAllRealProfiles(): MatrixProfile[] {
  const profileMap = new Map<string, MatrixProfile>();

  // A. Construire la table de correspondance des Duos (Contrepoints)
  const duoMap = new Map<string, { partnerId: string; partnerName: string; partnerPhoto: string; duoId: string; question: string }>();
  DUOS.forEach(d => {
    duoMap.set(d.protagonistA.id, {
      partnerId: d.protagonistB.id,
      partnerName: d.protagonistB.name,
      partnerPhoto: d.protagonistB.photoUrl || (d.protagonistB as any).photo,
      duoId: d.id,
      question: d.centralQuestion
    });
    duoMap.set(d.protagonistB.id, {
      partnerId: d.protagonistA.id,
      partnerName: d.protagonistA.name,
      partnerPhoto: d.protagonistA.photoUrl || (d.protagonistA as any).photo,
      duoId: d.id,
      question: d.centralQuestion
    });
  });

  // B. Ajouter les protagonistes de mockData (profils complets)
  PROTAGONISTS.forEach(p => {
    const duoInfo = duoMap.get(p.id);
    const doorId = mapUniverseToDoor(p.universeTag || p.role);
    
    // Récupérer les personnes de sa descendance
    const invitedIds: string[] = [];
    if (p.tree?.heritiers) {
      p.tree.heritiers.forEach(h => invitedIds.push(h.id));
    }

    profileMap.set(p.id, {
      id: p.id,
      name: p.name,
      firstName: p.firstName || p.name.split(' ')[0],
      role: p.role,
      territory: p.territory || p.country,
      country: p.country,
      flag: p.flag || '🌍',
      universeTag: p.universeTag || 'Transmission & Savoir-faire',
      photoUrl: p.photoUrl || (p as any).photo,
      badge: 'Protagoniste',
      invitationStory: p.bio,
      teaserPitch: p.quote,
      teaserVideoUrl: p.teaserVideoUrl || (p.stories && p.stories[0]?.videoCoverUrl) || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      question: p.centralQuestion || (duoInfo?.question),
      centralQuestion: p.centralQuestion || (duoInfo?.question),
      counterpointId: duoInfo?.partnerId,
      counterpointName: duoInfo?.partnerName,
      counterpointPhoto: duoInfo?.partnerPhoto,
      duoId: duoInfo?.duoId,
      invitedPeopleIds: invitedIds,
      doorId,
      allowedToAppear: true,
      placeholder: false
    });
  });

  // C. Récupérer récursivement toutes les personnes de matrixData.ts
  Object.values(MATRIX_SERIES_DATA).forEach(seriesConfig => {
    function traversePerson(p: AffiliationPerson) {
      if (!p || !p.id) return;
      if (!profileMap.has(p.id)) {
        const duoInfo = duoMap.get(p.id);
        const invitedIds: string[] = [];
        if (p.invitedPeople) {
          p.invitedPeople.forEach(child => {
            invitedIds.push(child.id);
            traversePerson(child);
          });
        }

        profileMap.set(p.id, {
          id: p.id,
          name: p.name,
          firstName: p.firstName || p.name.split(' ')[0],
          role: p.role || 'Passeur de mémoire',
          territory: p.territory || p.country || 'France',
          country: p.country || 'France',
          flag: p.flag || '🇫🇷',
          universeTag: p.universeTag || seriesConfig.seriesTitle,
          photoUrl: p.photoUrl,
          badge: p.badge || 'Membre de lignée',
          invitationStory: p.invitationStory,
          teaserPitch: p.teaserPitch,
          teaserVideoUrl: p.teaserVideoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          question: p.question || p.episodeQuestion || duoInfo?.question,
          centralQuestion: p.question || p.episodeQuestion || duoInfo?.question,
          counterpointId: duoInfo?.partnerId || p.duoId,
          counterpointName: duoInfo?.partnerName || p.duoPartnerName,
          counterpointPhoto: duoInfo?.partnerPhoto || p.duoPartnerPhoto,
          duoId: duoInfo?.duoId || p.duoId,
          invitedById: p.invitedById,
          invitedByName: p.invitedByName,
          invitedPeopleIds: invitedIds,
          doorId: mapUniverseToDoor(p.universeTag || seriesConfig.seriesTitle),
          allowedToAppear: true,
          placeholder: false
        });
      } else {
        if (p.invitedPeople) {
          p.invitedPeople.forEach(traversePerson);
        }
      }
    }

    if (seriesConfig.pioneers) {
      seriesConfig.pioneers.forEach(traversePerson);
    }
  });

  // Assurer la liaison mutuelle des contrepoints et assigner les 7 Portes thématiques officielles YonyWood
  const allList = Array.from(profileMap.values());
  const SEVEN_THEMATIC_DOORS = [
    'sagesses',
    'territoires',
    'expertises',
    'produits-services',
    'projets',
    'marques',
    'personnalites'
  ] as const;

  const DOOR_LABELS: Record<string, string> = {
    sagesses: 'Sagesses',
    territoires: 'Territoires',
    expertises: 'Expertises',
    'produits-services': 'Produits et services',
    projets: 'Projets',
    marques: 'Marques',
    personnalites: 'Personnalités'
  };

  allList.forEach((prof, idx) => {
    // 1. Détermination du contrepoint
    if (prof.counterpointId && !prof.counterpointPhoto) {
      const partner = profileMap.get(prof.counterpointId);
      if (partner) {
        prof.counterpointName = partner.name;
        prof.counterpointPhoto = partner.photoUrl;
      }
    }
    // Si pas de contrepoint désigné, jumeler avec un profil de polarité opposée
    if (!prof.counterpointId) {
      const candidate = allList.find(c => c.id !== prof.id && c.doorId !== prof.doorId && (!c.counterpointId || c.counterpointId === prof.id));
      if (candidate) {
        prof.counterpointId = candidate.id;
        prof.counterpointName = candidate.name;
        prof.counterpointPhoto = candidate.photoUrl;
        if (!candidate.counterpointId) {
          candidate.counterpointId = prof.id;
          candidate.counterpointName = prof.name;
          candidate.counterpointPhoto = prof.photoUrl;
        }
      }
    }
    if (prof.counterpointName) {
      prof.duoPartnerName = prof.counterpointName;
    }

    // Assurer que le prénom est toujours isolé proprement
    if (!prof.firstName) {
      prof.firstName = prof.name.split(' ')[0];
    }

    // 2. Strictement assigner à l'une des 7 Portes thématiques (Les séries vont dans Duos)
    let dId = prof.doorId;
    if (!dId || dId === 'series' || !SEVEN_THEMATIC_DOORS.includes(dId as any)) {
      dId = SEVEN_THEMATIC_DOORS[idx % SEVEN_THEMATIC_DOORS.length];
      prof.doorId = dId;
    }
    prof.doorLabel = DOOR_LABELS[dId] || 'Sagesses';

    // 3. Direction et question d'héritage associées
    if (prof.name.toLowerCase().includes('cheikh')) {
      prof.doorId = 'sagesses';
      prof.doorLabel = 'Sagesses';
      prof.directionLabel = 'Résilience';
      const resSub = SOUS_CATEGORIES.find(s => s.slug === 'resilience' || s.label.toLowerCase() === 'résilience');
      if (resSub?.question) {
        prof.question = resSub.question;
        prof.centralQuestion = resSub.question;
      }
    } else if (prof.name.toLowerCase().includes('dieudonné') || prof.name.toLowerCase().includes('dieudonne')) {
      prof.doorId = 'territoires';
      prof.doorLabel = 'Territoires';
      prof.directionLabel = 'Traditions';
      const tradSub = SOUS_CATEGORIES.find(s => s.dimensionId === 'territoires' && s.slug === 'traditions');
      if (tradSub?.question) {
        prof.question = tradSub.question;
        prof.centralQuestion = tradSub.question;
      }
    } else {
      const doorSubs = SOUS_CATEGORIES.filter(s => s.dimensionId === dId);
      if (doorSubs.length > 0) {
        let chosen = doorSubs[idx % doorSubs.length];
        const text = `${prof.name} ${prof.universeTag || ''} ${prof.role || ''}`.toLowerCase();
        const matched = doorSubs.find(s => text.includes(s.slug.toLowerCase()) || text.includes(s.label.toLowerCase()));
        if (matched) {
          chosen = matched;
        }
        prof.directionLabel = chosen.label;
        if (chosen.question) {
          prof.question = chosen.question;
          prof.centralQuestion = chosen.question;
        }
      } else {
        prof.directionLabel = 'Résilience';
        prof.question = 'Quelle épreuve majeure a brisé vos certitudes pour forger votre résilience et votre force intérieure ?';
        prof.centralQuestion = prof.question;
      }
    }
  });

  return allList;
}

// Mapper une thématique vers l'une des 7 Portes principales (Hors séries qui vont dans Duos)
export function mapUniverseToDoor(universe: string): string {
  const u = (universe || '').toLowerCase();
  if (u.includes('sagesse') || u.includes('philosophie') || u.includes('pensée') || u.includes('résilience') || u.includes('amour') || u.includes('solidarité')) return 'sagesses';
  if (u.includes('territoire') || u.includes('terroir') || u.includes('tradition') || u.includes('paysage') || u.includes('patrimoine') || u.includes('benin')) return 'territoires';
  if (u.includes('expertise') || u.includes('artisanat') || u.includes('metier') || u.includes('savoir') || u.includes('phd') || u.includes('science')) return 'expertises';
  if (u.includes('produit') || u.includes('service') || u.includes('gastronomie') || u.includes('vin') || u.includes('dixeat') || u.includes('fiat luxe')) return 'produits-services';
  if (u.includes('projet') || u.includes('ecologie') || u.includes('foret') || u.includes('arbre') || u.includes('investors') || u.includes('makers')) return 'projets';
  if (u.includes('marque') || u.includes('entreprise') || u.includes('sweet street') || u.includes('luxe')) return 'marques';
  if (u.includes('personnalit') || u.includes('art') || u.includes('musique') || u.includes('sport') || u.includes('coaching') || u.includes('blacks one')) return 'personnalites';
  
  // Par défaut, distribuer sur les 7 Portes thématiques de la Matrice
  return 'sagesses';
}

// 2. Génération de la Matrice 16 x 16 = 256 emplacements
export function generateMatrixGrid(profiles: MatrixProfile[], seed: number = 0): MatrixProfile[] {
  const TOTAL_CELLS = 256; // 16 x 16
  const GRID_SIZE = 16;
  const validProfiles = profiles.filter(p => p.allowedToAppear !== false && !!p.photoUrl);

  if (validProfiles.length === 0) return [];

  const grid: (MatrixProfile | null)[] = new Array(TOTAL_CELLS).fill(null);
  
  // Fonction de hachage pseudo-aléatoire basée sur le seed
  let currentSeed = (seed * 9301 + 49297) % 233280;
  function random(): number {
    currentSeed = (currentSeed * 9301 + 49297) % 233280;
    return currentSeed / 233280;
  }

  // Mélanger la liste de profils de départ
  const shuffledProfiles = [...validProfiles].sort(() => random() - 0.5);

  // Vérifier la distance de Manhattan entre deux coordonnées de la grille 16x16
  function getManhattanDist(idxA: number, idxB: number): number {
    const rowA = Math.floor(idxA / GRID_SIZE);
    const colA = idxA % GRID_SIZE;
    const rowB = Math.floor(idxB / GRID_SIZE);
    const colB = idxB % GRID_SIZE;
    return Math.abs(rowA - rowB) + Math.abs(colA - colB);
  }

  // Historique des positions assignées pour chaque ID de profil
  const assignedPositions = new Map<string, number[]>();

  for (let i = 0; i < TOTAL_CELLS; i++) {
    // Sélectionner un candidat qui respecte :
    // 1. Distance d'au moins 4 cases avec une occurrence précédente du même profil
    // 2. Éloignement maximal de son contrepoint (au moins 6 cases si possible)
    // 3. Diversité thématique avec la case immédiatement au-dessus et à gauche
    let bestCandidate: MatrixProfile | null = null;
    let minPenalty = Infinity;

    // Évaluer un échantillon de candidats
    const candidatesToTest = shuffledProfiles.slice(0, Math.min(shuffledProfiles.length, 30));
    // Rotation légère du pool
    shuffledProfiles.push(shuffledProfiles.shift()!);

    for (const candidate of candidatesToTest) {
      let penalty = 0;
      const prevPositions = assignedPositions.get(candidate.id) || [];

      // A. Pénalité sévère si le même visage est à moins de 4 cases
      for (const pos of prevPositions) {
        const dist = getManhattanDist(i, pos);
        if (dist < 4) {
          penalty += (4 - dist) * 1000;
        }
      }

      // B. Pénalité si son contrepoint est trop proche (< 6 cases)
      if (candidate.counterpointId) {
        const counterPositions = assignedPositions.get(candidate.counterpointId) || [];
        for (const pos of counterPositions) {
          const dist = getManhattanDist(i, pos);
          if (dist < 6) {
            penalty += (6 - dist) * 100;
          }
        }
      }

      // C. Pénalité douce si le voisin de gauche ou du haut a la même thématique
      if (i % GRID_SIZE > 0 && grid[i - 1]?.doorId === candidate.doorId) {
        penalty += 15;
      }
      if (i >= GRID_SIZE && grid[i - GRID_SIZE]?.doorId === candidate.doorId) {
        penalty += 15;
      }

      if (penalty < minPenalty) {
        minPenalty = penalty;
        bestCandidate = candidate;
        if (penalty === 0) break;
      }
    }

    const chosen = bestCandidate || shuffledProfiles[i % shuffledProfiles.length];
    grid[i] = chosen;

    const list = assignedPositions.get(chosen.id) || [];
    list.push(i);
    assignedPositions.set(chosen.id, list);
  }

  return grid as MatrixProfile[];
}

// 3. Calcul des 8 satellites Personnes du Soleil selon la charte d'exploration
export function get8PersonSatellites(
  sun: MatrixProfile,
  allProfiles: MatrixProfile[],
  recentVisitedIds: string[] = []
): PersonSatellite[] {
  const result: PersonSatellite[] = [];
  const usedIds = new Set<string>([sun.id]);
  const recentSet = new Set<string>(recentVisitedIds);

  // 1. LE CONTREPOINT (son duo) : toujours présent, trait terracotta épais
  if (sun.counterpointId) {
    const cp = allProfiles.find(p => p.id === sun.counterpointId);
    if (cp && !usedIds.has(cp.id)) {
      usedIds.add(cp.id);
      result.push({
        kind: 'person',
        person: cp,
        sourceType: 'counterpoint',
        sourceLabel: 'Contrepoint Duo',
        strokeColor: '#A2482B', // Terracotta signature épais
        strokeDash: 'none',
        strokeWidth: 3.5
      });
    }
  }

  // Si pas de duo déclaré, repli vers un pair marquant de la même porte
  if (result.length === 0) {
    const fallbackDuo = allProfiles.find(p => p.doorId === sun.doorId && !usedIds.has(p.id));
    if (fallbackDuo) {
      usedIds.add(fallbackDuo.id);
      result.push({
        kind: 'person',
        person: fallbackDuo,
        sourceType: 'counterpoint',
        sourceLabel: 'Contrepoint lié',
        strokeColor: '#A2482B',
        strokeDash: 'none',
        strokeWidth: 3.5
      });
    }
  }

  // 2. CELLE QUI L'A FAIT ENTRER (filiation ascendante) : teinte dorée
  if (sun.invitedById) {
    const parent = allProfiles.find(item => item.id === sun.invitedById);
    if (parent && !usedIds.has(parent.id)) {
      usedIds.add(parent.id);
      result.push({
        kind: 'person',
        person: parent,
        sourceType: 'parent',
        sourceLabel: 'Filiation',
        strokeColor: '#C89B3C', // Or chaud
        strokeDash: 'none',
        strokeWidth: 2.2
      });
    }
  }

  // 3. JUSQU'À 3 PERSONNES QU'ELLE A FAIT ENTRER (lignée descendante)
  if (sun.invitedPeopleIds && sun.invitedPeopleIds.length > 0) {
    for (const childId of sun.invitedPeopleIds) {
      if (result.filter(r => r.sourceType === 'descendant').length >= 3) break;
      const child = allProfiles.find(item => item.id === childId);
      if (child && !usedIds.has(child.id)) {
        usedIds.add(child.id);
        result.push({
          kind: 'person',
          person: child,
          sourceType: 'descendant',
          sourceLabel: 'Lignée',
          strokeColor: '#D97706', // Ambre chaleureux
          strokeDash: 'none',
          strokeWidth: 2.0
        });
      }
    }
  }

  // 4. 2 PERSONNES EN RÉSONANCE (même question, même archétype ou porte)
  const resonanceCandidates = allProfiles.filter(p => {
    if (usedIds.has(p.id)) return false;
    const sameQuestion = (sun.centralQuestion && p.centralQuestion && sun.centralQuestion === p.centralQuestion);
    const sameUniverse = sun.universeTag === p.universeTag;
    const sameDoor = sun.doorId === p.doorId;
    return sameQuestion || sameUniverse || sameDoor;
  }).sort(() => Math.random() - 0.5);

  for (const rc of resonanceCandidates) {
    if (result.filter(r => r.sourceType === 'resonance').length >= 2) break;
    usedIds.add(rc.id);
    result.push({
      kind: 'person',
      person: rc,
      sourceType: 'resonance',
      sourceLabel: 'Résonance',
      strokeColor: '#A855F7', // Violet intuitif & profond
      strokeDash: '3 3',
      strokeWidth: 1.8
    });
  }

  // 5. 1 PERSONNE TIRÉE AU HASARD (pour la surprise, en évitant les récents)
  const discoveryCandidates = allProfiles
    .filter(p => !usedIds.has(p.id) && !recentSet.has(p.id))
    .sort(() => Math.random() - 0.5);

  if (discoveryCandidates.length > 0) {
    const surprise = discoveryCandidates[0];
    usedIds.add(surprise.id);
    result.push({
      kind: 'person',
      person: surprise,
      sourceType: 'discovery',
      sourceLabel: 'Découverte',
      strokeColor: '#78716C', // Pierre discret
      strokeDash: '2 2',
      strokeWidth: 1.4
    });
  }

  // 6. Compléter à 8 personnes si nécessaire
  if (result.length < 8) {
    const fallbackPool = allProfiles.filter(p => !usedIds.has(p.id)).sort(() => Math.random() - 0.5);
    for (const fb of fallbackPool) {
      if (result.length >= 8) break;
      usedIds.add(fb.id);
      result.push({
        kind: 'person',
        person: fb,
        sourceType: 'discovery',
        sourceLabel: 'Exploration',
        strokeColor: '#78716C',
        strokeDash: '2 2',
        strokeWidth: 1.4
      });
    }
  }

  return result.slice(0, 8);
}

// 4. Calcul des 8 satellites Thématiques (les 8 Portes officielles et leurs 8 directions)
export function get8ThemeSatellites(sun: MatrixProfile): ThemeSatellite[] {
  return DIMENSIONS.map(dim => {
    const isPrimary = dim.id === sun.doorId;
    const subcats = getSubcategoriesForDimension(dim.id);
    return {
      kind: 'theme',
      doorId: dim.id,
      label: dim.label,
      shortLabel: dim.shortLabel,
      iconName: dim.icone,
      accentColor: dim.accentColor,
      glowColor: dim.glowColor,
      tagline: dim.tagline,
      subcategories: subcats,
      isPrimaryForSun: isPrimary
    };
  });
}

// 5. Calcul des 16 satellites complets (8 personnes + 8 thématiques)
export function get16SunSatellites(
  sun: MatrixProfile,
  allProfiles: MatrixProfile[],
  recentVisitedIds: string[] = []
): SunSatellite[] {
  const people = get8PersonSatellites(sun, allProfiles, recentVisitedIds);
  const themes = get8ThemeSatellites(sun);

  // Alternance équilibrée 1 personne / 1 thématique pour créer une couronne harmonieuse
  const satellites: SunSatellite[] = [];
  for (let i = 0; i < 8; i++) {
    satellites.push(people[i]);
    satellites.push(themes[i]);
  }
  return satellites;
}

// Alias de rétrocompatibilité : retourne les voisins personnes
export function get16SunNeighbors(
  sun: MatrixProfile, 
  allProfiles: MatrixProfile[], 
  recentVisitedIds: string[] = []
): PersonSatellite[] {
  return get8PersonSatellites(sun, allProfiles, recentVisitedIds);
}

export interface InterNeighborLink {
  id: string;
  fromIndex: number;
  toIndex: number;
  fromPersonId: string;
  toPersonId: string;
  type: 'duo' | 'lineage' | 'theme' | 'territory';
  label: string;
  strokeColor: string;
}

// 6. Calcul des liens transversaux entre les 16 voisins d'un même Soleil
export function computeInterNeighborLinks(
  sun: MatrixProfile, 
  neighbors: SunNeighbor[]
): InterNeighborLink[] {
  const links: InterNeighborLink[] = [];
  const linkKeySet = new Set<string>();

  for (let i = 0; i < neighbors.length; i++) {
    for (let j = i + 1; j < neighbors.length; j++) {
      const a = neighbors[i].person;
      const b = neighbors[j].person;

      const key = [a.id, b.id].sort().join('-');
      if (linkKeySet.has(key)) continue;

      // 1. Duo / Contrepoint
      if (a.counterpointId === b.id || b.counterpointId === a.id || (a.duoId && a.duoId === b.duoId)) {
        linkKeySet.add(key);
        links.push({
          id: `link-duo-${key}`,
          fromIndex: i,
          toIndex: j,
          fromPersonId: a.id,
          toPersonId: b.id,
          type: 'duo',
          label: 'Duo & Contrepoint',
          strokeColor: '#C89B3C'
        });
        continue;
      }

      // 2. Lignée & Cooptation directe ou partagée
      const isDirectLineage = a.invitedById === b.id || b.invitedById === a.id;
      const isSharedLineage = a.invitedById && a.invitedById === b.invitedById;
      if (isDirectLineage || isSharedLineage) {
        linkKeySet.add(key);
        links.push({
          id: `link-lineage-${key}`,
          fromIndex: i,
          toIndex: j,
          fromPersonId: a.id,
          toPersonId: b.id,
          type: 'lineage',
          label: isDirectLineage ? 'Cooptation directe' : 'Même filiation de cooptation',
          strokeColor: '#A2482B'
        });
        continue;
      }

      // 3. Même Porte thématique (Sagesses, Séries, Territoires, etc.)
      if (a.doorId === b.doorId && (a.doorId !== 'series' || a.universeTag === b.universeTag)) {
        linkKeySet.add(key);
        links.push({
          id: `link-theme-${key}`,
          fromIndex: i,
          toIndex: j,
          fromPersonId: a.id,
          toPersonId: b.id,
          type: 'theme',
          label: `Porte ${a.doorId}`,
          strokeColor: '#D97706'
        });
        continue;
      }

      // 4. Même Territoire / Pays
      if (a.country && a.country === b.country && a.country !== 'France') {
        linkKeySet.add(key);
        links.push({
          id: `link-territory-${key}`,
          fromIndex: i,
          toIndex: j,
          fromPersonId: a.id,
          toPersonId: b.id,
          type: 'territory',
          label: `Territoire ${a.country}`,
          strokeColor: '#A8A29E'
        });
      }
    }
  }

  return links;
}
