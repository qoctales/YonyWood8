import React from 'react';
import { ViewScreen } from '../types';

interface NavbarProps {
  currentScreen: ViewScreen;
  onNavigate: (screen: ViewScreen) => void;
  onOpenAuth?: (mode: 'login' | 'register') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentScreen, onNavigate }) => {
  // Ne pas afficher pendant le lecteur vidéo plein écran
  if (currentScreen.type === 'video_player') {
    return null;
  }

  return (
    <header className="shrink-0 z-40 w-full backdrop-blur-md bg-white/95 border-b border-stone-100 shadow-2xs">
      <div className="w-full px-4 h-12 sm:h-14 flex items-center justify-center relative">
        {/* Logo et Nom du projet YonyWood centré au milieu, sans boutons superflus */}
        <div 
          onClick={() => onNavigate({ type: 'duo_feed' })}
          className="flex items-center justify-center cursor-pointer group select-none py-1"
          id="nav-logo"
          title="YonyWood"
        >
          <img 
            src="/yonywood-logo-espaces-70.svg" 
            alt="YonyWood" 
            className="h-7 sm:h-8 md:h-9 w-auto object-contain select-none group-hover:opacity-90 transition-opacity"
          />
        </div>
      </div>
    </header>
  );
};
