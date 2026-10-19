import { PROTAGONISTS, DUOS } from '../data/mockData';
import { MATRIX_SERIES_DATA } from '../data/matrixData';
import { AffiliationPerson, Protagonist } from '../types';

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
  invitedById?: string;
  invitedByName?: string;
  invitedPeopleIds?: string[];
  doorId: string; // Dimension/Porte (series, sagesses, territoires, expertises, etc.)
  allowedToAppear: boolean;
  placeholder?: boolean;
}

export type NeighborSourceType = 'counterpoint' | 'lineage' | 'theme' | 'discovery';

export interface SunNeighbor {
  person: MatrixProfile;
  sourceType: NeighborSourceType;
  sourceLabel: string; // Mini-légende de 2 mots
  strokeColor: string;
  strokeDash: string;
  strokeWidth: number;
}

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

  // Assurer la liaison mutuelle des contrepoints
  const allList = Array.from(profileMap.values());
  allList.forEach(prof => {
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
  });

  return allList;
}

// Mapper une thématique vers l'une des 8 Portes principales
export function mapUniverseToDoor(universe: string): string {
  const u = (universe || '').toLowerCase();
  if (u.includes('sagesse') || u.includes('philosophie') || u.includes('pensée') || u.includes('science')) return 'sagesses';
  if (u.includes('territoire') || u.includes('terroir') || u.includes('tradition') || u.includes('paysage')) return 'territoires';
  if (u.includes('expertise') || u.includes('artisanat') || u.includes('metier') || u.includes('savoir')) return 'expertises';
  if (u.includes('produit') || u.includes('service') || u.includes('gastronomie') || u.includes('vin')) return 'produits-services';
  if (u.includes('projet') || u.includes('ecologie') || u.includes('foret') || u.includes('arbre')) return 'projets';
  if (u.includes('marque') || u.includes('entreprise') || u.includes('patrimoine')) return 'marques';
  if (u.includes('personnalit') || u.includes('art') || u.includes('musique') || u.includes('sport')) return 'personnalites';
  return 'series';
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

// 3. Calcul des 16 voisins du Soleil (Niveau 2)
export function get16SunNeighbors(
  sun: MatrixProfile, 
  allProfiles: MatrixProfile[], 
  recentVisitedIds: string[] = []
): SunNeighbor[] {
  const result: SunNeighbor[] = [];
  const usedIds = new Set<string>([sun.id]);
  const recentSet = new Set<string>(recentVisitedIds);

  // Mini-légendes et styles visuels distincts
  const SOURCE_CONFIGS = {
    counterpoint: {
      sourceLabel: 'Contrepoint Duo',
      strokeColor: '#C89B3C', // Or chaud
      strokeDash: 'none',
      strokeWidth: 2.5
    },
    lineage: {
      sourceLabel: 'Lignée cooptée',
      strokeColor: '#A2482B', // Terracotta signature
      strokeDash: 'none',
      strokeWidth: 2.0
    },
    theme: {
      sourceLabel: 'Même thématique',
      strokeColor: '#D97706', // Ambre chaleureux
      strokeDash: '3 3',
      strokeWidth: 1.5
    },
    discovery: {
      sourceLabel: 'Découverte surprise',
      strokeColor: '#78716C', // Pierre discret
      strokeDash: '2 2',
      strokeWidth: 1.2
    }
  };

  // 1. SOURCE 1 : Le Contrepoint (TOUJOURS PRÉSENT EN PRIORITÉ ABSOLUE)
  if (sun.counterpointId) {
    const cp = allProfiles.find(p => p.id === sun.counterpointId);
    if (cp && !usedIds.has(cp.id)) {
      usedIds.add(cp.id);
      result.push({
        person: cp,
        sourceType: 'counterpoint',
        ...SOURCE_CONFIGS.counterpoint
      });
    }
  }

  // 2. SOURCE 2 : Les personnes de sa Lignée (ceux qu'il a fait entrer ou qui l'ont fait entrer)
  const lineageCandidates: MatrixProfile[] = [];
  
  // Personnes cooptées directes
  if (sun.invitedPeopleIds && sun.invitedPeopleIds.length > 0) {
    sun.invitedPeopleIds.forEach(id => {
      const p = allProfiles.find(item => item.id === id);
      if (p && !usedIds.has(p.id)) lineageCandidates.push(p);
    });
  }

  // Personne qui l'a fait entrer (ascendance)
  if (sun.invitedById) {
    const parent = allProfiles.find(item => item.id === sun.invitedById);
    if (parent && !usedIds.has(parent.id)) lineageCandidates.push(parent);
  }

  // Ajouter jusqu'à 5 membres de la lignée en priorité
  lineageCandidates.forEach(p => {
    if (result.length < 6 && !usedIds.has(p.id)) {
      usedIds.add(p.id);
      result.push({
        person: p,
        sourceType: 'lineage',
        ...SOURCE_CONFIGS.lineage
      });
    }
  });

  // 3. SOURCE 3 : Personnes de la même thématique / porte (anti-boucle appliquée)
  const sameThemeProfiles = allProfiles.filter(p => 
    p.doorId === sun.doorId && 
    !usedIds.has(p.id) &&
    !recentSet.has(p.id)
  );

  // Mélanger pour varier les découvertes
  sameThemeProfiles.sort(() => Math.random() - 0.5);

  sameThemeProfiles.forEach(p => {
    if (result.length < 12 && !usedIds.has(p.id)) {
      usedIds.add(p.id);
      result.push({
        person: p,
        sourceType: 'theme',
        ...SOURCE_CONFIGS.theme
      });
    }
  });

  // 4. SOURCE 4 : Découverte surprise (tirées au hasard, en évitant les récents)
  const discoveryCandidates = allProfiles.filter(p => 
    !usedIds.has(p.id) && 
    !recentSet.has(p.id)
  ).sort(() => Math.random() - 0.5);

  discoveryCandidates.forEach(p => {
    if (result.length < 16 && !usedIds.has(p.id)) {
      usedIds.add(p.id);
      result.push({
        person: p,
        sourceType: 'discovery',
        ...SOURCE_CONFIGS.discovery
      });
    }
  });

  // 5. Remplissage de sécurité si le quota de 16 n'est pas encore atteint
  if (result.length < 16) {
    const fallbackProfiles = allProfiles.filter(p => !usedIds.has(p.id));
    for (const fb of fallbackProfiles) {
      if (result.length >= 16) break;
      usedIds.add(fb.id);
      result.push({
        person: fb,
        sourceType: 'discovery',
        ...SOURCE_CONFIGS.discovery
      });
    }
  }

  return result.slice(0, 16);
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
