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

interface TaglineInfo {
  title: string;
  subtitle: string;
}

const getHeaderTagline = (screen: ViewScreen): TaglineInfo => {
  switch (screen.type) {
    case 'participate':
      return {
        title: "On est ensemble",
        subtitle: "Choisissez votre mode de contribution et d'action"
      };
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
        subtitle: "Un storytelling dynamique de l'entreprise"
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
      <div className="max-w-6xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2 relative">
        
        {/* Gauche : Logo officiel YonyWood */}
        <div 
          onClick={() => onNavigate({ type: 'duo_feed' })}
          className="flex items-center cursor-pointer group select-none py-1 shrink-0 z-10"
          id="nav-logo"
          title="YonyWood — Accueil"
        >
          <img 
            src="/yonywood-logo-gras.svg" 
            alt="YonyWood" 
            className="h-10 sm:h-12 w-auto object-contain select-none group-hover:opacity-90 transition-all"
          />
        </div>

        {/* Centre : Titre et tagline éditoriaux dynamiques sécurisés sur desktop uniquement pour éviter tout conflit avec les boutons */}
        <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center text-center select-none pointer-events-none px-2 max-w-[280px] xl:max-w-[360px] z-0">
          <span className="font-editorial text-xs font-bold text-stone-900 tracking-wide truncate max-w-full">
            {tagline.title}
          </span>
          <span className="text-[10px] text-stone-500 font-medium truncate max-w-full">
            {tagline.subtitle}
          </span>
        </div>

        {/* Droite : Bouton d'action phare Co-construire Yonywood */}
        <div className="flex items-center gap-2 sm:gap-2.5 z-10">
          
          {/* Bouton Co-construire Yonywood */}
          <button
            onClick={() => onNavigate({ type: 'participate' })}
            id="nav-participate-btn"
            className={`px-3.5 sm:px-4.5 py-1.5 sm:py-2 rounded-full font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer flex items-center justify-center active:scale-95 ${
              currentScreen.type === 'participate'
                ? 'bg-[#8A3B22] text-white ring-2 ring-[#A2482B]/40 shadow-sm'
                : 'bg-[#A2482B] hover:bg-[#8A3B22] text-white hover:scale-105 hover:shadow-sm'
            }`}
            title="Co-construire Yonywood : Devenir égérie, coproduction, entreprises"
          >
            <span>Co-construire Yonywood</span>
          </button>

          {user && (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => onNavigate({ type: 'profile' })}
                className="px-2.5 sm:px-3 py-1.5 rounded-full border border-stone-200 hover:border-stone-300 bg-stone-50 hover:bg-stone-100 text-stone-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Accéder à mon profil"
              >
                <User className="w-3.5 h-3.5 text-[#A2482B]" />
                <span className="max-w-[80px] sm:max-w-[100px] truncate">{user.firstName || user.name}</span>
              </button>
              <button
                onClick={logout}
                className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
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

