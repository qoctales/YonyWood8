import React from 'react';
import { 
  Clapperboard,
  Film
} from 'lucide-react';
import { ViewScreen } from '../types';
import { 
  DirectorChairIcon,
  DuocumentairesTvIcon,
  LumiereSunDotsIcon,
  PortraitsViseurIcon,
  ProfileSoloIcon
} from './YonywoodBrandIcons';
import { PROTAGONISTS } from '../data/mockData';
import { useAuth } from '../services/authContext';

interface BottomMenuProps {
  currentScreen: ViewScreen;
  onNavigate: (screen: ViewScreen) => void;
}

export const BottomMenu: React.FC<BottomMenuProps> = ({ currentScreen, onNavigate }) => {
  const { currentUser } = useAuth();

  // Déterminer l'élément actif selon l'écran en cours
  const isStudioActive = currentScreen.type === 'submit_story' || currentScreen.type === 'request_videographer';
  const isHeritageActive = currentScreen.type === 'home' || currentScreen.type === 'matrix_view' || currentScreen.type === 'documentaries' || currentScreen.type === 'documentary_detail';
  const isDuoActive = currentScreen.type === 'duo_feed' || currentScreen.type === 'duo_detail' || currentScreen.type === 'landing';
  const isLumiereActive = currentScreen.type === 'enterprise';
  const isProductionActive = currentScreen.type === 'marketplace';
  const isProfilActive = 
    currentScreen.type === 'profile' || 
    currentScreen.type === 'settings' || 
    currentScreen.type === 'portfolio' || 
    currentScreen.type === 'transactions' ||
    currentScreen.type === 'protagonist_profile' || 
    currentScreen.type === 'my_forest' || 
    currentScreen.type === 'messaging' ||
    currentScreen.type === 'editorial_backoffice';

  // Identité du profil affiché (Pascal par défaut)
  const profileFirstName = React.useMemo(() => {
    if (currentScreen.type === 'protagonist_profile' && currentScreen.protagonistId) {
      const p = PROTAGONISTS.find(prot => prot.id === currentScreen.protagonistId);
      if (p) {
        return p.name.split(' ')[0];
      }
    }
    return currentUser?.name?.split(' ')[0] || 'Pascal';
  }, [currentScreen, currentUser]);

  // Ne pas afficher le menu pendant le lecteur vidéo plein écran
  if (currentScreen.type === 'video_player') {
    return null;
  }

  // Exactement six rubriques au singulier : Studio · Duo · Héritage · Lumière · Portrait · Production
  const menuItems = [
    {
      id: 'studio',
      label: 'Studio',
      icon: DirectorChairIcon,
      isActive: isStudioActive,
      onClick: () => onNavigate({ type: 'submit_story' }),
      screenId: 'menu-item-studio',
      iconClassName: 'w-5 h-5 sm:w-5 sm:h-5 shrink-0',
      strokeWidth: 1.5
    },
    {
      id: 'duo',
      label: 'Miroir',
      icon: DuocumentairesTvIcon, // deux écrans (télé divisée en deux)
      isActive: isDuoActive,
      onClick: () => onNavigate({ type: 'duo_feed' }),
      screenId: 'menu-item-duo',
      iconClassName: 'w-5 h-5 sm:w-5 sm:h-5 shrink-0',
      strokeWidth: 1.75
    },
    {
      id: 'heritage',
      label: 'Héritage',
      icon: Film, // bande de pellicule
      isActive: isHeritageActive,
      onClick: () => onNavigate({ type: 'home' }),
      screenId: 'menu-item-heritage',
      iconClassName: 'w-[17px] h-[17px] sm:w-[17px] sm:h-[17px] shrink-0',
      strokeWidth: 1.5
    },
    {
      id: 'lumiere',
      label: 'Lumière',
      icon: LumiereSunDotsIcon, // Soleil et constellations
      isActive: isLumiereActive,
      onClick: () => onNavigate({ type: 'enterprise' }),
      screenId: 'menu-item-lumiere',
      iconClassName: 'w-[19px] h-[19px] sm:w-[20px] sm:h-[20px] shrink-0',
      strokeWidth: 1.5
    },
    {
      id: 'portrait',
      label: 'Portrait',
      icon: ProfileSoloIcon, // petite télé / profil solo (icône singulière officielle)
      isActive: isProfilActive,
      onClick: () => onNavigate({ type: 'profile' }),
      screenId: 'menu-item-portrait',
      iconClassName: 'w-5 h-5 sm:w-5 sm:h-5 shrink-0',
      strokeWidth: 1.6
    },
    {
      id: 'production',
      label: 'Action',
      icon: Clapperboard, // claquette
      isActive: isProductionActive,
      onClick: () => onNavigate({ type: 'marketplace' }),
      screenId: 'menu-item-production',
      iconClassName: 'w-5 h-5 sm:w-5 sm:h-5 shrink-0',
      strokeWidth: 1.5
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none pb-3 sm:pb-5 px-2 sm:px-6">
      <nav 
        id="yonywood-main-menu"
        aria-label="Navigation principale"
        className="pointer-events-auto max-w-[420px] sm:max-w-[450px] mx-auto bg-white/95 backdrop-blur-xl border border-stone-200/90 rounded-full shadow-2xl shadow-stone-900/10 px-1.5 sm:px-3 py-1 sm:py-1.5 flex items-center justify-between gap-0.5"
      >
        {menuItems.map((item) => {
          const Icon = item.icon as any;

          return (
            <button
              key={item.id}
              onClick={item.onClick}
              id={item.screenId}
              title={item.label}
              className={`relative flex-1 min-w-0 flex flex-col items-center justify-center px-0.5 sm:px-1.5 py-0.5 sm:py-1 rounded-full transition-colors duration-200 group cursor-pointer ${
                item.isActive
                  ? 'text-stone-900'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              {/* Capsule changeante : icône en Terre Cuite (#A2482B) pour rubriques actives */}
              <div 
                className={`w-8 h-8 sm:w-10 sm:h-10 aspect-square shrink-0 rounded-full flex items-center justify-center transition-all duration-200 ${
                  item.isActive 
                    ? 'bg-[#A2482B] text-white shadow-sm' 
                    : 'bg-transparent text-stone-600 group-hover:bg-stone-100/80'
                }`}
              >
                {item.id === 'lumiere' ? (
                  <LumiereSunDotsIcon 
                    className={`${item.iconClassName} transition-transform duration-200`} 
                    strokeWidth={item.strokeWidth} 
                    isActive={item.isActive}
                  />
                ) : item.id === 'duo' ? (
                  <DuocumentairesTvIcon 
                    className={`${item.iconClassName} transition-transform duration-200`} 
                    strokeWidth={item.strokeWidth || 1.75} 
                    isActive={item.isActive}
                  />
                ) : item.id === 'studio' ? (
                  <DirectorChairIcon 
                    className={`${item.iconClassName} transition-transform duration-200`} 
                    strokeWidth={item.strokeWidth || 1.75} 
                    isActive={item.isActive}
                  />
                ) : (
                  <Icon 
                    className={`${item.iconClassName} transition-transform duration-200`} 
                    strokeWidth={item.strokeWidth} 
                  />
                )}
              </div>

              {/* Libellé textuel en noms communs uniformes, toujours affiché en entier sans troncature */}
              <span className={`text-[8.5px] min-[380px]:text-[9.5px] sm:text-[10.5px] leading-tight tracking-tight mt-0.5 sm:mt-1 transition-colors duration-200 whitespace-nowrap text-center ${
                item.isActive 
                  ? 'text-[#A2482B] font-semibold' 
                  : 'text-stone-500 font-normal'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

