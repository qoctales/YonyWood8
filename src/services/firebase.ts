import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, getFirestore, setLogLevel } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Régler le niveau de journalisation pour éviter les avertissements verbeux du SDK
// liés aux tentatives de streaming WebSockets dans l'environnement iframe/proxy
try {
  setLogLevel('error');
} catch {
  // Ignorer si l'environnement ne le permet pas
}

// Initialisation unique de l'application Firebase
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

const databaseId = (firebaseConfig as any).firestoreDatabaseId;

// Initialisation de Firestore avec experimentalForceLongPolling activé dans le navigateur.
// Cela force le SDK à utiliser immédiatement le transport HTTP long-polling direct,
// éliminant ainsi le délai d'attente de 10 secondes et les alertes de bascule hors-ligne.
function getInitializedFirestore() {
  const isBrowser = typeof window !== 'undefined';
  const settings = isBrowser
    ? { experimentalForceLongPolling: true }
    : {};

  try {
    return databaseId
      ? initializeFirestore(app, settings, databaseId)
      : initializeFirestore(app, settings);
  } catch {
    return databaseId
      ? getFirestore(app, databaseId)
      : getFirestore(app);
  }
}

export const db = getInitializedFirestore();

