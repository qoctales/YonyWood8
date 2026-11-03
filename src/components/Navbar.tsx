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
    <header 
      className="shrink-0 z-40 w-full select-none border-none shadow-none rounded-none"
      style={{ backgroundColor: 'var(--color-header-logo, #F4ECE1)' }}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4 lg:py-5 flex items-center justify-center relative">
        {/* Logo officiel YonyWood centré au milieu avec transition fluide clamp() */}
        <div 
          onClick={() => onNavigate({ type: 'duo_feed' })}
          className="flex items-center justify-center cursor-pointer group select-none transition-transform active:scale-[0.99]"
          id="nav-logo"
          title="YonyWood"
        >
          <img 
            src="/yonywood-logo-espace.svg" 
            alt="YonyWood" 
            width={2046}
            height={420}
            loading="eager"
            decoding="async"
            className="yonywood-header-logo object-contain select-none group-hover:opacity-90 transition-opacity"
          />
        </div>
      </div>
    </header>
  );
};
