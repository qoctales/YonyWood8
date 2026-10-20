import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, getFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialisation unique de l'application Firebase
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

const databaseId = (firebaseConfig as any).firestoreDatabaseId;

// Initialisation de Firestore avec détection automatique du long-polling
// pour assurer une connectivité immédiate et résiliente en environnement conteneur/iframe
function getInitializedFirestore() {
  try {
    return databaseId
      ? initializeFirestore(app, { experimentalAutoDetectLongPolling: true }, databaseId)
      : initializeFirestore(app, { experimentalAutoDetectLongPolling: true });
  } catch {
    return databaseId
      ? getFirestore(app, databaseId)
      : getFirestore(app);
  }
}

export const db = getInitializedFirestore();

