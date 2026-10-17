import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  updateDoc, 
  deleteDoc,
  doc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';

export interface VideoSubmission {
  id?: string;
  userId: string;
  userName: string;
  userEmail: string;
  seriesId: string;
  seriesTitle: string;
  question: string;
  videoUrl: string;
  protagonistName: string;
  protagonistRole: string;
  territory: string;
  country: string;
  pitch: string;
  viewsCount?: number;
  completionRate?: number;
  thumbnail?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt?: any;
}

export interface VideoReport {
  id?: string;
  targetType: 'video' | 'duo' | 'protagonist';
  targetId: string;
  targetTitle: string;
  reason: string;
  reasonLabel: string;
  details?: string;
  reportedBy: string;
  createdAt?: any;
  status: 'PENDING' | 'RESOLVED' | 'DISMISSED';
}

export interface SharePurchaseRecord {
  id?: string;
  seriesId: string;
  seriesTitle: string;
  userId: string;
  userName: string;
  userEmail: string;
  sharesCount: number;
  pricePerShare: number;
  totalAmount: number;
  paymentMethod: 'card' | 'mobile_money' | 'free_starter';
  createdAt?: any;
}

// 1. Enregistrement d'un achat de part (50 € / 256 parts)
export async function recordSharePurchase(data: Omit<SharePurchaseRecord, 'id' | 'createdAt'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'share_purchases'), {
      ...data,
      createdAt: serverTimestamp()
    });

    // Mémoriser aussi localement pour réactivité instantanée
    const localPurchases = JSON.parse(localStorage.getItem('yonywood_local_share_purchases') || '[]');
    localPurchases.unshift({ ...data, id: docRef.id, createdAt: new Date().toISOString() });
    localStorage.setItem('yonywood_local_share_purchases', JSON.stringify(localPurchases));

    return docRef.id;
  } catch (error) {
    console.warn('Fallback local pour achat de parts (mode hors-ligne ou développement):', error);
    const localId = `share-${Date.now()}`;
    const localPurchases = JSON.parse(localStorage.getItem('yonywood_local_share_purchases') || '[]');
    localPurchases.unshift({ ...data, id: localId, createdAt: new Date().toISOString() });
    localStorage.setItem('yonywood_local_share_purchases', JSON.stringify(localPurchases));
    return localId;
  }
}

// 2. Calcul du nombre de parts restantes sur 256 par série
export async function getSeriesRemainingShares(seriesId: string, initialTaken: number = 32): Promise<number> {
  const maxShares = 256;
  try {
    const q = query(collection(db, 'share_purchases'), where('seriesId', '==', seriesId));
    const snapshot = await getDocs(q);
    let bought = initialTaken;
    snapshot.forEach(doc => {
      bought += Number(doc.data().sharesCount || 0);
    });
    return Math.max(0, maxShares - bought);
  } catch (err) {
    // Calcul local de secours
    const localPurchases = JSON.parse(localStorage.getItem('yonywood_local_share_purchases') || '[]');
    const seriesPurchases = localPurchases.filter((p: any) => p.seriesId === seriesId);
    const bought = initialTaken + seriesPurchases.reduce((acc: number, p: any) => acc + (p.sharesCount || 0), 0);
    return Math.max(0, maxShares - bought);
  }
}

// 3. Soumission d'une vidéo selon la direction éditoriale
export async function submitVideoToForest(data: Omit<VideoSubmission, 'id' | 'status' | 'createdAt'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'submitted_videos'), {
      ...data,
      status: 'pending',
      createdAt: serverTimestamp()
    });

    // Stockage local synchronisé
    const localVideos = JSON.parse(localStorage.getItem('yonywood_local_submitted_videos') || '[]');
    localVideos.unshift({ ...data, id: docRef.id, status: 'pending', createdAt: new Date().toISOString() });
    localStorage.setItem('yonywood_local_submitted_videos', JSON.stringify(localVideos));

    return docRef.id;
  } catch (error) {
    console.warn('Fallback local pour soumission vidéo:', error);
    const localId = `video-${Date.now()}`;
    const localVideos = JSON.parse(localStorage.getItem('yonywood_local_submitted_videos') || '[]');
    localVideos.unshift({ ...data, id: localId, status: 'pending', createdAt: new Date().toISOString() });
    localStorage.setItem('yonywood_local_submitted_videos', JSON.stringify(localVideos));
    return localId;
  }
}

// 4. Récupération des vidéos soumises pour l'administrateur
export async function fetchSubmittedVideos(): Promise<VideoSubmission[]> {
  try {
    const q = query(collection(db, 'submitted_videos'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const results: VideoSubmission[] = [];
    snapshot.forEach(d => {
      results.push({ id: d.id, ...d.data() } as VideoSubmission);
    });
    return results;
  } catch (err) {
    const localVideos = JSON.parse(localStorage.getItem('yonywood_local_submitted_videos') || '[]');
    return localVideos;
  }
}

// 5. Récupération des vidéos d'un créateur (pour son historique dans le Studio)
export async function fetchUserSubmittedVideos(userId?: string, userEmail?: string): Promise<VideoSubmission[]> {
  const localKey = 'yonywood_local_submitted_videos';
  const rawLocal = localStorage.getItem(localKey);
  
  // Récits d'exemple de départ pour initialiser le compte créateur si aucun récit n'est présent
  const DEFAULT_CREATOR_VIDEOS: VideoSubmission[] = [
    {
      id: 'vid-demo-user-1',
      userId: userId || 'usr-creator',
      userName: 'Sika Dossou',
      userEmail: userEmail || 'createur@yonywood.com',
      seriesId: 'ancestral-revealed',
      seriesTitle: 'Ancestral <> Révélé',
      question: 'Ce qui vous a fait ressentir quelque chose de plus grand que vous',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
      protagonistName: 'Sika Dossou',
      protagonistRole: 'Artisane tisseuse de Porto-Novo',
      territory: 'Bénin (Porto-Novo)',
      country: 'Bénin',
      pitch: 'La transmission silencieuse du bleu indigo selon les rituels d’immersion des grands-mères de l’Ouémé.',
      viewsCount: 1420,
      completionRate: 88,
      status: 'approved',
      createdAt: '2026-10-12T10:30:00Z'
    },
    {
      id: 'vid-demo-user-2',
      userId: userId || 'usr-creator',
      userName: 'Mahougnon Zounon',
      userEmail: userEmail || 'createur@yonywood.com',
      seriesId: 'jesus-legba',
      seriesTitle: 'Jésus <> Legba',
      question: 'La première fois que vous avez compris que le monde ne pensait pas comme vous',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
      protagonistName: 'Mahougnon Zounon',
      protagonistRole: 'Gardien des rythmes de Ouidah',
      territory: 'Bénin (Ouidah)',
      country: 'Bénin',
      pitch: 'Dialogue fraternel entre cloches de paroisse et roulements du tambour sacrifié au carrefour.',
      viewsCount: 890,
      completionRate: 74,
      status: 'pending',
      createdAt: '2026-10-15T16:45:00Z'
    }
  ];

  let localVideos: VideoSubmission[] = [];
  if (!rawLocal) {
    localVideos = DEFAULT_CREATOR_VIDEOS;
    localStorage.setItem(localKey, JSON.stringify(localVideos));
  } else {
    try {
      localVideos = JSON.parse(rawLocal);
    } catch {
      localVideos = DEFAULT_CREATOR_VIDEOS;
    }
  }

  try {
    const q = query(collection(db, 'submitted_videos'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const remoteList: VideoSubmission[] = [];
    snapshot.forEach(d => {
      const data = d.data() as VideoSubmission;
      // Filtrer pour l'utilisateur courant si spécifié
      if (!userId || data.userId === userId || data.userEmail === userEmail) {
        remoteList.push({ id: d.id, ...data });
      }
    });

    if (remoteList.length > 0) {
      // Fusionner avec les vidéos locales pour garder la réactivité
      const mergedMap = new Map<string, VideoSubmission>();
      remoteList.forEach(v => mergedMap.set(v.id || '', v));
      localVideos.forEach(v => {
        if (v.id && !mergedMap.has(v.id)) {
          mergedMap.set(v.id, v);
        }
      });
      return Array.from(mergedMap.values());
    }
  } catch (err) {
    console.warn('Mode hors-ligne ou fallback local pour vidéos créateur:', err);
  }

  // Filtrer localement par utilisateur si possible
  if (userId) {
    const userFiltered = localVideos.filter(v => v.userId === userId || v.userEmail === userEmail);
    return userFiltered.length > 0 ? userFiltered : localVideos;
  }
  return localVideos;
}

// 6. Mise à jour du titre d'une vidéo soumise (Édition créateur)
export async function updateSubmittedVideoTitle(videoId: string, newTitle: string, newPitch?: string): Promise<void> {
  // 1. Mise à jour locale immédiate
  const localKey = 'yonywood_local_submitted_videos';
  const localList: VideoSubmission[] = JSON.parse(localStorage.getItem(localKey) || '[]');
  const updatedList = localList.map(v => {
    if (v.id === videoId) {
      return {
        ...v,
        pitch: newTitle || v.pitch,
        seriesTitle: newTitle || v.seriesTitle
      };
    }
    return v;
  });
  localStorage.setItem(localKey, JSON.stringify(updatedList));

  // 2. Synchronisation Firestore si possible
  try {
    const docRef = doc(db, 'submitted_videos', videoId);
    await updateDoc(docRef, {
      pitch: newTitle,
      updatedAt: serverTimestamp()
    });
  } catch (err) {
    console.warn('Mise à jour Firestore en attente (mise à jour locale effectuée):', err);
  }
}

// 7. Suppression définitive d'une vidéo soumise par le créateur
export async function deleteSubmittedVideo(videoId: string): Promise<void> {
  // 1. Suppression locale immédiate
  const localKey = 'yonywood_local_submitted_videos';
  const localList: VideoSubmission[] = JSON.parse(localStorage.getItem(localKey) || '[]');
  const updatedList = localList.filter(v => v.id !== videoId);
  localStorage.setItem(localKey, JSON.stringify(updatedList));

  // 2. Suppression Firestore
  try {
    const docRef = doc(db, 'submitted_videos', videoId);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('Suppression Firestore en attente (suppression locale effectuée):', err);
  }
}

// 8. Envoi d'un signalement de vidéo (modération)
export async function submitVideoReport(report: Omit<VideoReport, 'id' | 'createdAt' | 'status'>): Promise<string> {
  const reportPayload = {
    ...report,
    status: 'PENDING' as const,
    createdAt: new Date().toISOString()
  };

  // 1. Sauvegarde dans le stockage de modération locale partagé avec AdminDashboard
  try {
    const localReportsKey = 'yonywood_admin_reports';
    const localReports = JSON.parse(localStorage.getItem(localReportsKey) || '[]');
    const localId = `rep-${Date.now()}`;
    localReports.unshift({
      ...reportPayload,
      id: localId
    });
    localStorage.setItem(localReportsKey, JSON.stringify(localReports));
  } catch (e) {
    console.warn('Erreur sauvegarde locale du signalement:', e);
  }

  // 2. Persistance dans Firestore collection 'reports'
  try {
    const docRef = await addDoc(collection(db, 'reports'), {
      ...report,
      status: 'PENDING',
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (err) {
    console.warn('Persistance Firestore du signalement en attente:', err);
    return `rep-${Date.now()}`;
  }
}
