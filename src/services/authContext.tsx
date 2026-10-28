import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserAccount, UserRole } from '../types';

export const DEFAULT_ADMIN_USER: UserAccount = {
  id: 'usr-admin-romeo',
  email: 'qoctales@gmail.com',
  name: 'Romeo Nonvide',
  role: 'ADMIN',
  accountType: 'INDIVIDUAL',
  handle: '@romeo',
  avatarUrl: '/assets/images/romeo_avatar_1792698425983.jpg',
  bio: 'Béninois de retour d’expatriation après 8 années passées à l’étranger. Réalisateur & Fondateur YonyWood à Cotonou.',
  catchphrase: 'Béninois de retour d’expatriation après 8 années à l’étranger. Réalisateur & Fondateur YonyWood à Cotonou.',
  city: 'Cotonou',
  territory: 'Cotonou',
  country: 'Bénin',
  sharesCount: 125,
  sharesAcquiredDate: '15 Janvier 2026',
  sharesInvestedAmount: 1250000,
  sharesEstimatedDividends: 142500,
  createdAt: '2026-01-15',
  individualDetails: {
    firstName: 'Romeo',
    lastName: 'Nonvide',
    profession: 'Réalisateur & Fondateur'
  }
};

export const INITIAL_DEMO_USERS: UserAccount[] = [
  DEFAULT_ADMIN_USER,
  {
    id: 'usr-org-biosolaire',
    email: 'contact@biosolaire.bj',
    name: 'Bio Solaire Bénin',
    role: 'USER',
    accountType: 'ORGANIZATION',
    handle: '@biosolaire_bj',
    avatarUrl: '/assets/images/bio_solaire_1792933744556.jpg',
    bio: 'Pionnier des solutions d’énergie propre et d’irrigation solaire au service des agriculteurs et artisans du Bénin.',
    territory: 'Cotonou & Parakou',
    country: 'Bénin',
    sharesCount: 80,
    createdAt: '2026-01-20',
    orgDetails: {
      legalName: 'Bio Solaire Bénin SAS',
      orgType: 'ENTERPRISE',
      sector: 'Énergie & Écologie',
      legalRepresentative: 'Senan Agossa',
      foundationYear: 2021,
      website: 'https://biosolaire.bj'
    }
  },
  {
    id: 'usr-org-tissage',
    email: 'association@tissage-ganvie.org',
    name: 'Maison du Tissage Ganvié',
    role: 'USER',
    accountType: 'ORGANIZATION',
    handle: '@tissage_ganvie',
    avatarUrl: '/assets/images/sika_tisserande_1792933605542.jpg',
    bio: 'Coopérative artisanale préservant les techniques ancestrales de tissage sur l’eau.',
    territory: 'Ganvié',
    country: 'Bénin',
    sharesCount: 60,
    createdAt: '2026-02-05',
    orgDetails: {
      legalName: 'Coopérative Artisanale du Tissage Flottant',
      orgType: 'COOPERATIVE',
      sector: 'Artisanat & Textile',
      legalRepresentative: 'Sika Dossou',
      foundationYear: 2018
    }
  },
  {
    id: 'usr-creator-amina',
    email: 'amina.traore@yonywood.com',
    name: 'Amina Traoré',
    role: 'CREATOR',
    accountType: 'INDIVIDUAL',
    handle: '@amina_t',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    bio: 'Passeuse de mémoires sonores et artisane du tissage traditionnel.',
    territory: 'Ganvié',
    country: 'Bénin',
    sharesCount: 45,
    createdAt: '2026-02-01',
    individualDetails: {
      firstName: 'Amina',
      lastName: 'Traoré',
      profession: 'Passeuse de mémoires sonores'
    }
  },
  {
    id: 'usr-creator-koffi',
    email: 'koffi.mensah@yonywood.com',
    name: 'Koffi Mensah',
    role: 'CREATOR',
    accountType: 'INDIVIDUAL',
    handle: '@koffi_m',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    bio: 'Maître forgeron et gardien du feu sacré à Ouidah.',
    territory: 'Ouidah',
    country: 'Bénin',
    sharesCount: 30,
    createdAt: '2026-02-10',
    individualDetails: {
      firstName: 'Koffi',
      lastName: 'Mensah',
      profession: 'Maître forgeron'
    }
  },
  {
    id: 'usr-coproducer-clara',
    email: 'clara.dupont@gmail.com',
    name: 'Clara Dupont',
    role: 'USER',
    accountType: 'INDIVIDUAL',
    handle: '@clara_d',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    bio: 'Coproductrice passionnée par les documentaires écologiques et la transmission.',
    territory: 'Lyon',
    country: 'France',
    sharesCount: 50,
    createdAt: '2026-02-20'
  }
];

export interface RegisterPayload {
  name: string;
  email: string;
  password?: string;
  accountType?: 'INDIVIDUAL' | 'ORGANIZATION';
  orgType?: 'ENTERPRISE' | 'ASSOCIATION' | 'COOPERATIVE' | 'INSTITUTION';
  sector?: string;
  legalRepresentative?: string;
  territory?: string;
  country?: string;
}

interface AuthContextType {
  currentUser: UserAccount | null;
  usersList: UserAccount[];
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  register: (payload: RegisterPayload | string, email?: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  updateProfile: (data: Partial<UserAccount>) => void;
  logout: () => void;
  updateUserRole: (userId: string, newRole: UserRole) => void;
  deleteUser: (userId: string) => void;
}

const defaultAuthContext: AuthContextType = {
  currentUser: null,
  usersList: INITIAL_DEMO_USERS,
  isAuthenticated: false,
  isAdmin: false,
  login: async () => ({ success: false, message: 'Auth non initialisé' }),
  register: async () => ({ success: false, message: 'Auth non initialisé' }),
  updateProfile: () => {},
  logout: () => {},
  updateUserRole: () => {},
  deleteUser: () => {}
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Liste des utilisateurs mémorisée
  const [usersList, setUsersList] = useState<UserAccount[]>(() => {
    try {
      const saved = localStorage.getItem('yonywood_registered_users');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_DEMO_USERS;
  });

  // Utilisateur actuellement connecté
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const savedUser = localStorage.getItem('yonywood_current_user');
      if (savedUser) {
        return JSON.parse(savedUser);
      }
    } catch {
      // ignore
    }
    // Par défaut, pas connecté pour laisser l'onboarding et la connexion s'exprimer
    return null;
  });

  // Sauvegarde des utilisateurs
  useEffect(() => {
    try {
      localStorage.setItem('yonywood_registered_users', JSON.stringify(usersList));
    } catch {
      // ignore
    }
  }, [usersList]);

  // Sauvegarde de l'utilisateur courant
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('yonywood_current_user', JSON.stringify(currentUser));
        localStorage.setItem('yonywood_auth_token', `demo-token-${currentUser.id}`);
      } else {
        localStorage.removeItem('yonywood_current_user');
        localStorage.removeItem('yonywood_auth_token');
      }
    } catch {
      // ignore
    }
  }, [currentUser]);

  const login = async (email: string, _password?: string): Promise<{ success: boolean; message?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    
    // Cas spécial administrateur garanti
    if (cleanEmail === 'qoctales@gmail.com') {
      setCurrentUser(DEFAULT_ADMIN_USER);
      return { success: true };
    }

    // Chercher dans la liste
    const found = usersList.find(u => u.email.toLowerCase() === cleanEmail);
    if (found) {
      setCurrentUser(found);
      return { success: true };
    }

    // Si nouveau compte avec un e-mail inconnu, créer automatiquement comme coproducteur
    const newUser: UserAccount = {
      id: `usr-${Date.now()}`,
      email: cleanEmail,
      name: cleanEmail.split('@')[0].replace('.', ' '),
      accountType: 'INDIVIDUAL',
      role: 'USER',
      sharesCount: 10,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setUsersList(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return { success: true };
  };

  const register = async (payload: RegisterPayload | string, emailArg?: string, _password?: string): Promise<{ success: boolean; message?: string }> => {
    const isPayloadObj = typeof payload === 'object';
    const cleanEmail = (isPayloadObj ? payload.email : (emailArg || '')).trim().toLowerCase();
    const rawName = isPayloadObj ? payload.name : payload;
    const accountType = isPayloadObj && payload.accountType ? payload.accountType : 'INDIVIDUAL';

    const existing = usersList.find(u => u.email.toLowerCase() === cleanEmail);

    if (existing) {
      setCurrentUser(existing);
      return { success: true };
    }

    const isExplicitAdmin = cleanEmail === 'qoctales@gmail.com';
    const handleClean = `@${rawName.trim().toLowerCase().replace(/[^a-z0-9]/g, '_')}`;

    const newUser: UserAccount = {
      id: `usr-${accountType === 'ORGANIZATION' ? 'org-' : ''}${Date.now()}`,
      email: cleanEmail,
      name: rawName.trim() || cleanEmail.split('@')[0],
      handle: handleClean,
      accountType,
      role: isExplicitAdmin ? 'ADMIN' : 'USER',
      territory: (isPayloadObj && payload.territory) ? payload.territory : 'Cotonou',
      country: (isPayloadObj && payload.country) ? payload.country : 'Bénin',
      avatarUrl: accountType === 'ORGANIZATION' 
        ? '/assets/images/marques_tech_1792086434196.jpg'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      sharesCount: 10,
      createdAt: new Date().toISOString().split('T')[0],
      ...(accountType === 'ORGANIZATION' ? {
        orgDetails: {
          legalName: rawName.trim(),
          orgType: isPayloadObj && payload.orgType ? payload.orgType : 'ENTERPRISE',
          sector: isPayloadObj && payload.sector ? payload.sector : 'Culture & Patrimoine',
          legalRepresentative: isPayloadObj && payload.legalRepresentative ? payload.legalRepresentative : '',
          foundationYear: new Date().getFullYear()
        }
      } : {
        individualDetails: {
          firstName: rawName.trim().split(' ')[0] || rawName.trim(),
          lastName: rawName.trim().split(' ').slice(1).join(' ') || '',
          profession: 'Créateur & Conteur'
        }
      })
    };

    setUsersList(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return { success: true };
  };

  const updateProfile = (data: Partial<UserAccount>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...data };
    setCurrentUser(updated);
    setUsersList(prev => prev.map(u => u.id === updated.id ? updated : u));
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateUserRole = (userId: string, newRole: UserRole) => {
    setUsersList(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    if (currentUser?.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, role: newRole } : null);
    }
  };

  const deleteUser = (userId: string) => {
    setUsersList(prev => prev.filter(u => u.id !== userId));
    if (currentUser?.id === userId) {
      setCurrentUser(null);
    }
  };

  const isAuthenticated = !!currentUser;
  const isAdmin = currentUser?.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{
      currentUser,
      usersList,
      isAuthenticated,
      isAdmin,
      login,
      register,
      updateProfile,
      logout,
      updateUserRole,
      deleteUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context ?? defaultAuthContext;
};
