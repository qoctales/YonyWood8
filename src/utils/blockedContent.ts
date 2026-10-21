// Système unifié de blocage des vidéos et contenus par l'utilisateur
// Les identifiants sont mémorisés dans localStorage et synchronisés via un événement personnalisé

const STORAGE_KEY = 'yonywood_blocked_videos';

export function getBlockedVideoIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function isVideoBlocked(videoId?: string | null): boolean {
  if (!videoId) return false;
  const blocked = getBlockedVideoIds();
  return blocked.includes(videoId);
}

export function blockVideo(videoId?: string | null): void {
  if (!videoId || typeof window === 'undefined') return;
  try {
    const blocked = getBlockedVideoIds();
    if (!blocked.includes(videoId)) {
      blocked.push(videoId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(blocked));
      window.dispatchEvent(new CustomEvent('yonywood_video_blocked', { detail: { videoId } }));
    }
  } catch {
    // ignorer
  }
}

export function unblockVideo(videoId?: string | null): void {
  if (!videoId || typeof window === 'undefined') return;
  try {
    const blocked = getBlockedVideoIds().filter(id => id !== videoId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(blocked));
    window.dispatchEvent(new CustomEvent('yonywood_video_blocked', { detail: { videoId } }));
  } catch {
    // ignorer
  }
}
