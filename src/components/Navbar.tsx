import React from 'react';
import { 
  User, 
  LogOut
} from 'lucide-react';
import { ViewScreen } from '../types';
import { useAuth } from '../services/authContext';

interface NavbarProps {
  currentScreen: ViewScreen;
  onNavigate: (screen: ViewScreen) => void;
  onOpenAuth?: (mode: 'login' | 'register') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentScreen, onNavigate, onOpenAuth }) => {
  const { currentUser, logout } = useAuth();

  // Ne pas afficher pendant le lecteur vidéo plein écran
  if (currentScreen.type === 'video_player') {
    return null;
  }

  return (
    <header className="shrink-0 z-40 w-full backdrop-blur-md bg-white/95 border-b border-stone-200 shadow-2xs">
      <div className="w-full px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2 relative">
        
        {/* Gauche : Logo officiel YonyWood aligné à gauche sur mobile et desktop */}
        <div 
          onClick={() => onNavigate({ type: 'duo_feed' })}
          className="flex items-center cursor-pointer group select-none py-1 shrink-0 z-20"
          id="nav-logo"
          title="YonyWood — Accueil"
        >
          <img 
            src="/yonywood-logo-espaces-70.svg" 
            alt="YonyWood" 
            className="h-8 sm:h-10 md:h-12 w-auto object-contain select-none group-hover:opacity-90 transition-all"
          />
        </div>

        {/* Droite : Bouton Présentation + Connexion / Inscription ou Profil connecté */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 z-20 shrink-0 ml-auto">
          
          {/* Bouton Présentation (ex Co-construire, présente le projet global) */}
          {currentScreen.type !== 'participate' && (
            <button
              onClick={() => onNavigate({ type: 'participate' })}
              id="nav-presentation-btn"
              className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-bold text-[11px] sm:text-xs md:text-sm shadow-xs transition-all cursor-pointer flex items-center justify-center whitespace-nowrap active:scale-95 bg-[#A2482B] hover:bg-[#8A3B22] text-white hover:scale-102 hover:shadow-sm"
              title="Découvrir la présentation du projet"
            >
              <span>Présentation</span>
            </button>
          )}

          {/* Mode Visiteur non connecté : Inscription et Connexion */}
          {!currentUser ? (
            <div className="flex items-center gap-1 sm:gap-1.5">
              <button
                type="button"
                onClick={() => onOpenAuth?.('login')}
                className="px-2.5 sm:px-3 py-1.5 rounded-full font-semibold text-[11px] sm:text-xs text-stone-700 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
                title="Se connecter"
              >
                Connexion
              </button>
              <button
                type="button"
                onClick={() => onOpenAuth?.('register')}
                className="px-3 sm:px-3.5 py-1.5 rounded-full font-bold text-[11px] sm:text-xs bg-stone-900 hover:bg-stone-800 text-white shadow-xs transition-all cursor-pointer hover:scale-102 active:scale-95"
                title="Créer un compte Individu ou Organisation"
              >
                Inscription
              </button>
            </div>
          ) : (
            /* Mode Membre connecté */
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => onNavigate({ type: 'profile' })}
                className="px-2 sm:px-3 py-1.5 rounded-full border border-stone-200 hover:border-stone-300 bg-stone-50 hover:bg-stone-100 text-stone-800 text-[11px] sm:text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Accéder à mon portrait"
              >
                {currentUser.avatarUrl ? (
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="w-4 h-4 rounded-full object-cover shrink-0 border border-stone-200"
                  />
                ) : (
                  <User className="w-3.5 h-3.5 text-[#A2482B]" />
                )}
                <span className="max-w-[70px] sm:max-w-[120px] truncate">{currentUser.name}</span>
                {currentUser.accountType === 'ORGANIZATION' && (
                  <span className="text-[10px] text-amber-700 hidden sm:inline">(Org)</span>
                )}
              </button>
              <button
                onClick={logout}
                className="p-1 sm:p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
                title="Se déconnecter"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

