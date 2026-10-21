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
  const { user, logout } = useAuth();

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
            src="/yonywood-logo-gras.svg" 
            alt="YonyWood" 
            className="h-8 sm:h-10 md:h-12 w-auto object-contain select-none group-hover:opacity-90 transition-all"
          />
        </div>

        {/* Droite : Bouton d'action phare Participer */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 z-20 shrink-0 ml-auto">
          
          {/* Bouton Participer (affiché sur Studio et les autres pages, masqué uniquement quand on est déjà sur la page Participer) */}
          {currentScreen.type !== 'participate' && (
            <button
              onClick={() => onNavigate({ type: 'participate' })}
              id="nav-participate-btn"
              className="px-3 sm:px-4.5 py-1.5 sm:py-2 rounded-full font-bold text-[11px] sm:text-xs md:text-sm shadow-xs transition-all cursor-pointer flex items-center justify-center whitespace-nowrap active:scale-95 bg-[#A2482B] hover:bg-[#8A3B22] text-white hover:scale-102 hover:shadow-sm"
              title="Participer : Devenir égérie, coproduction, entreprises"
            >
              <span>Participer</span>
            </button>
          )}

          {user && (
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => onNavigate({ type: 'profile' })}
                className="px-2 sm:px-3 py-1.5 rounded-full border border-stone-200 hover:border-stone-300 bg-stone-50 hover:bg-stone-100 text-stone-800 text-[11px] sm:text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                title="Accéder à mon profil"
              >
                <User className="w-3.5 h-3.5 text-[#A2482B]" />
                <span className="max-w-[60px] sm:max-w-[100px] truncate">{user.firstName || user.name}</span>
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

