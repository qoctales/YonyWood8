import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  updateDoc, 
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
  status: 'pending' | 'approved' | 'rejected';
  createdAt?: any;
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
