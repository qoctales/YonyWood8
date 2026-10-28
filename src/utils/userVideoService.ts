import { UserVideoSubmission, AccountType } from '../types';
export type { UserVideoSubmission };

const USER_VIDEOS_KEY = 'yonywood_user_video_submissions';

export const INITIAL_DEMO_SUBMISSIONS: UserVideoSubmission[] = [
  {
    id: 'vid-demo-1',
    userId: 'usr-admin-romeo',
    userType: 'INDIVIDUAL',
    authorName: 'Romeo Nonvide',
    authorAvatarUrl: '/assets/images/romeo_avatar_1792698425983.jpg',
    title: 'Origines & Ancrage à Cotonou',
    synopsis: 'Roméo raconte ses huit années passées à l’étranger, le sentiment de l’éloignement et l’évidence intérieure de revenir à Cotonou pour fonder YonyWood.',
    universe: 'casting',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: '/assets/images/romeo_arriving_cotonou_1792698426939.jpg',
    status: 'APPROVED',
    createdAt: '2026-03-01',
    reviewedAt: '2026-03-02'
  },
  {
    id: 'vid-demo-2',
    userId: 'usr-admin-romeo',
    userType: 'INDIVIDUAL',
    authorName: 'Romeo Nonvide',
    authorAvatarUrl: '/assets/images/romeo_avatar_1792698425983.jpg',
    title: 'Dialogue avec les Sages de Ganvié',
    synopsis: 'Rencontre sur l’eau avec les anciens pour recueillir les paroles du lac Nokoué.',
    universe: 'duo',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnailUrl: '/assets/images/romeo_dialogue_elders_1792698428934.jpg',
    status: 'PENDING',
    createdAt: '2026-03-27'
  },
  {
    id: 'vid-demo-3',
    userId: 'usr-org-biosolaire',
    userType: 'ORGANIZATION',
    authorName: 'Bio Solaire Bénin',
    authorAvatarUrl: '/assets/images/bio_solaire_1792933744556.jpg',
    title: 'L’Énergie propre au cœur des terroirs',
    synopsis: 'Présentation de notre engagement pour l’irrigation solaire paysanne et l’autonomie énergétique au Bénin.',
    universe: 'lumiere',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    thumbnailUrl: '/assets/images/bio_solaire_1792933744556.jpg',
    status: 'APPROVED',
    createdAt: '2026-02-15',
    reviewedAt: '2026-02-16'
  }
];

export function getUserVideoSubmissions(userId?: string): UserVideoSubmission[] {
  try {
    const raw = localStorage.getItem(USER_VIDEOS_KEY);
    const list: UserVideoSubmission[] = raw ? JSON.parse(raw) : INITIAL_DEMO_SUBMISSIONS;
    if (userId) {
      return list.filter(v => v.userId === userId);
    }
    return list;
  } catch {
    return INITIAL_DEMO_SUBMISSIONS;
  }
}

export function saveUserVideoSubmission(submission: Omit<UserVideoSubmission, 'id' | 'createdAt' | 'status'>): UserVideoSubmission {
  const current = getUserVideoSubmissions();
  const newItem: UserVideoSubmission = {
    ...submission,
    id: `vid-${Date.now()}`,
    status: 'PENDING',
    createdAt: new Date().toISOString().split('T')[0]
  };
  const updated = [newItem, ...current];
  try {
    localStorage.setItem(USER_VIDEOS_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
  return newItem;
}

export function deleteUserVideoSubmission(id: string): void {
  const current = getUserVideoSubmissions();
  const updated = current.filter(v => v.id !== id);
  try {
    localStorage.setItem(USER_VIDEOS_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
}

export function updateVideoSubmissionStatus(id: string, status: 'APPROVED' | 'REJECTED' | 'PENDING', reason?: string): void {
  const current = getUserVideoSubmissions();
  const updated = current.map(v => {
    if (v.id === id) {
      return {
        ...v,
        status,
        rejectionReason: reason,
        reviewedAt: new Date().toISOString().split('T')[0]
      };
    }
    return v;
  });
  try {
    localStorage.setItem(USER_VIDEOS_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
}
