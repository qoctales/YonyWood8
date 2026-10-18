import React from 'react';
import { 
  LogIn, 
  UserPlus, 
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

interface TaglineInfo {
  title: string;
  subtitle: string;
}

const getHeaderTagline = (screen: ViewScreen): TaglineInfo => {
  switch (screen.type) {
    case 'duo_feed':
    case 'duo_detail':
    case 'landing':
      return {
        title: "Des histoires qui nous relient",
        subtitle: "Deux univers, une même question existentielle"
      };
    case 'marketplace':
      return {
        title: "Des coproductions qui nous rassemblent",
        subtitle: "Une façon de soutenir la valorisation des histoires"
      };
    case 'enterprise':
      return {
        title: "Un espace de visibilité et de promotion",
        subtitle: "Montrer l'entreprise de l'intérieur grâce à un storytelling collaboratif"
      };
    case 'submit_story':
    case 'request_videographer':
      return {
        title: "L'atelier de création partagée",
        subtitle: "Racontez votre récit ou faites appel à nos cinéastes"
      };
    case 'home':
    case 'matrix_view':
    case 'documentaries':
    case 'documentary_detail':
      return {
        title: "La mémoire vivante de nos terroirs",
        subtitle: "Explorez les lignées, les savoir-faire et les transmissions"
      };
    case 'profile':
    case 'settings':
    case 'portfolio':
    case 'my_forest':
    case 'protagonist_profile':
    case 'lineage':
      return {
        title: "Votre espace personnel et engagé",
        subtitle: "Vos récits, vos parts et votre empreinte culturelle"
      };
    default:
      return {
        title: "Des histoires qui nous relient",
        subtitle: "Deux univers, une même question existentielle"
      };
  }
};

export const Navbar: React.FC<NavbarProps> = ({ currentScreen, onNavigate, onOpenAuth }) => {
  const { user, logout } = useAuth();
  const tagline = getHeaderTagline(currentScreen);

  // Ne pas afficher pendant le lecteur vidéo plein écran
  if (currentScreen.type === 'video_player') {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/95 border-b border-stone-200 shadow-2xs">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 h-14 sm:h-15 flex items-center justify-between gap-2">
        
        {/* Gauche : Logo officiel YonyWood */}
        <div 
          onClick={() => onNavigate({ type: 'duo_feed' })}
          className="flex items-center cursor-pointer group select-none py-1 shrink-0"
          id="nav-logo"
          title="YonyWood — Accueil"
        >
          <img 
            src="/logo%20YonyWood.png?v=5" 
            alt="YonyWood" 
            className="h-7 sm:h-8.5 w-auto object-contain mix-blend-multiply select-none group-hover:opacity-90 transition-opacity"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/logo-yonywood-clean.png?v=5';
            }}
          />
        </div>

        {/* Centre : Titre et tagline éditoriaux dynamiques selon la page */}
        <div className="hidden sm:flex flex-col items-center justify-center text-center select-none pointer-events-none px-2 flex-1 max-w-lg mx-auto">
          <span className="font-editorial text-xs sm:text-[13px] font-bold text-stone-900 tracking-wide line-clamp-1">
            {tagline.title}
          </span>
          <span className="text-[10px] sm:text-[11px] text-stone-500 font-medium line-clamp-1">
            {tagline.subtitle}
          </span>
        </div>

        {/* Droite : Boutons Connexion / Inscription ou Profil Utilisateur */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate({ type: 'profile' })}
                className="px-3 py-1.5 rounded-full border border-stone-200 hover:border-stone-300 bg-stone-50 hover:bg-stone-100 text-stone-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Accéder à mon profil"
              >
                <User className="w-3.5 h-3.5 text-[#A2482B]" />
                <span className="max-w-[100px] truncate">{user.firstName || user.name}</span>
              </button>
              <button
                onClick={logout}
                className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
                title="Se déconnecter"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => onOpenAuth ? onOpenAuth('login') : onNavigate({ type: 'profile' })}
                className="px-3 sm:px-3.5 py-1.5 rounded-full border border-stone-300 hover:border-stone-400 text-stone-700 hover:text-stone-900 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 hover:bg-stone-50"
                id="nav-login-btn"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Connexion</span>
              </button>

              <button
                onClick={() => onOpenAuth ? onOpenAuth('register') : onNavigate({ type: 'profile' })}
                className="px-3 sm:px-4 py-1.5 rounded-full bg-[#A2482B] hover:bg-[#8A3B22] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer flex items-center gap-1.5 hover:scale-105 active:scale-95"
                id="nav-register-btn"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Inscription</span>
              </button>
            </>
          )}
        </div>

      </div>
    </header>
  );
};

