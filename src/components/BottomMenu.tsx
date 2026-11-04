import React from 'react';
import { ViewScreen } from '../types';
import { 
  DirectorChairIcon,
  CameraLensFocusIcon,
  EntrepriseFilmDuoIcon,
  DuocumentairesTvIcon,
  ActionClapperboardIcon,
  ProfileSoloIcon
} from './YonywoodBrandIcons';

interface BottomMenuProps {
  currentScreen: ViewScreen;
  onNavigate: (screen: ViewScreen) => void;
}

export const BottomMenu: React.FC<BottomMenuProps> = ({ currentScreen, onNavigate }) => {
  // Déterminer l'élément actif selon l'écran en cours
  const isStudioActive = currentScreen.type === 'submit_story' || currentScreen.type === 'request_videographer';
  const isFocusActive = currentScreen.type === 'focus' || currentScreen.type === 'enterprise';
  const isDialogueActive = currentScreen.type === 'duo_feed' || currentScreen.type === 'duo_detail' || currentScreen.type === 'landing' || currentScreen.type === 'home';
  const isActionActive = currentScreen.type === 'marketplace';
  const isPortraitActive = 
    currentScreen.type === 'profile' || 
    currentScreen.type === 'settings' || 
    currentScreen.type === 'portfolio' || 
    currentScreen.type === 'transactions' ||
    currentScreen.type === 'protagonist_profile' || 
    currentScreen.type === 'my_forest' || 
    currentScreen.type === 'messaging' ||
    currentScreen.type === 'editorial_backoffice';

  // Ne pas afficher le menu pendant le lecteur vidéo plein écran
  if (currentScreen.type === 'video_player') {
    return null;
  }

  // Exactement cinq rubriques selon la structure YonyWood : Studio · Focus (2ème) · Dialogue (au centre) · Action · Portrait
  const menuItems = [
    {
      id: 'studio',
      label: 'Studio',
      icon: DirectorChairIcon, // Fauteuil réalisateur avec dossier toile terracotta au repos
      isActive: isStudioActive,
      onClick: () => onNavigate({ type: 'submit_story' }),
      screenId: 'menu-item-studio',
      iconClassName: 'w-5 h-5 sm:w-5 sm:h-5 shrink-0',
      strokeWidth: 1.75
    },
    {
      id: 'focus',
      label: 'Focus',
      icon: CameraLensFocusIcon, // Viseur optique avec cible terracotta au repos
      isActive: isFocusActive,
      onClick: () => onNavigate({ type: 'focus' }),
      screenId: 'menu-item-focus',
      iconClassName: 'w-5 h-5 sm:w-5 sm:h-5 shrink-0',
      strokeWidth: 1.75
    },
    {
      id: 'dialogue',
      label: 'Dialogue',
      icon: DuocumentairesTvIcon, // Télé double carré avec pupilles terracotta au repos et pieds courts
      isActive: isDialogueActive,
      onClick: () => onNavigate({ type: 'duo_feed' }),
      screenId: 'menu-item-dialogue',
      iconClassName: 'w-5 h-5 sm:w-5 sm:h-5 shrink-0',
      strokeWidth: 1.75
    },
    {
      id: 'action',
      label: 'Action',
      icon: ActionClapperboardIcon, // Claquette de cinéma avec hachures terracotta au repos
      isActive: isActionActive,
      onClick: () => onNavigate({ type: 'marketplace' }),
      screenId: 'menu-item-action',
      iconClassName: 'w-5 h-5 sm:w-5 sm:h-5 shrink-0',
      strokeWidth: 1.75
    },
    {
      id: 'portrait',
      label: 'Portrait',
      icon: ProfileSoloIcon, // Tête télé vintage avec yeux terracotta au repos
      isActive: isPortraitActive,
      onClick: () => onNavigate({ type: 'profile' }),
      screenId: 'menu-item-portrait',
      iconClassName: 'w-5 h-5 sm:w-5 sm:h-5 shrink-0',
      strokeWidth: 1.75
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
                <Icon 
                  className={`${item.iconClassName} transition-transform duration-200`} 
                  strokeWidth={item.strokeWidth || 1.75} 
                  isActive={item.isActive}
                />
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

