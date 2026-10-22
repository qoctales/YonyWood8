import React, { useState } from 'react';
import { 
  LogIn,
  UserPlus,
  Clapperboard,
  Film,
  Sparkles
} from 'lucide-react';
import { ViewScreen } from '../types';
import { AuthModal } from './AuthModal';
import { 
  DirectorChairIcon,
  DuocumentairesTvIcon,
  PortraitsViseurIcon,
  ProfileSoloIcon,
  LumiereSunDotsIcon
} from './YonywoodBrandIcons';
import { DemoStudioSection } from './landing/DemoStudioSection';
import { DemoHeritagesSection } from './landing/DemoHeritagesSection';
import { DemoDuocumentairesSection } from './landing/DemoDuocumentairesSection';
import { DemoProductionsSection } from './landing/DemoProductionsSection';
import { DemoEntrepriseSection } from './landing/DemoEntrepriseSection';
import { DemoProfilPascalSection } from './landing/DemoProfilPascalSection';

interface LandingScreenProps {
  onNavigate: (screen: ViewScreen) => void;
}

type DemoTabId = 'studio' | 'heritages' | 'duos' | 'entreprise' | 'productions' | 'profil';

export const LandingScreen: React.FC<LandingScreenProps> = ({ onNavigate }) => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Onglet démo actif
  const [activeDemoTab, setActiveDemoTab] = useState<DemoTabId>('studio');

  const openAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = () => {
    onNavigate({ type: 'duo_feed' });
  };

  const navItems: { id: DemoTabId; label: string; icon: any; screenId: string }[] = [
    { id: 'studio', label: 'Studio', icon: DirectorChairIcon, screenId: 'menu-demo-studio' },
    { id: 'duos', label: 'Miroir', icon: DuocumentairesTvIcon, screenId: 'menu-demo-duo' },
    { id: 'heritages', label: 'Casting', icon: Film, screenId: 'menu-demo-heritage' },
    { id: 'entreprise', label: 'Lumière', icon: LumiereSunDotsIcon, screenId: 'menu-demo-lumiere' },
    { id: 'profil', label: 'Portrait', icon: ProfileSoloIcon, screenId: 'menu-demo-portrait' },
    { id: 'productions', label: 'Action', icon: Clapperboard, screenId: 'menu-demo-production' },
  ];

  return (
    <div className="min-h-screen bg-white text-[#1C1917] flex flex-col font-sans select-none relative">
      
      {/* Modale d'authentification */}
      <AuthModal 
        isOpen={authModalOpen}
        initialMode={authMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* ========================================================================= */}
      {/* 1. HEADER FIXE : LOGO + SLOGAN CENTRÉ + CONNEXION & INSCRIPTION           */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-stone-200">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
          
          {/* Gauche : Logo officiel YonyWood */}
          <div className="flex items-center gap-3">
            <img 
              src="/yonywood-logo-espaces-70.svg" 
              alt="YonyWood" 
              className="h-11 sm:h-14 w-auto object-contain cursor-pointer hover:opacity-90 transition-all"
              onClick={() => setActiveDemoTab('studio')}
            />
          </div>

          {/* Centre : Slogan STRICTEMENT centré par rapport à toute la largeur de page */}
          <div className="absolute left-1/2 -translate-x-1/2 pointer-events-none flex items-center justify-center text-center max-w-[48vw] sm:max-w-md px-2">
            <p className="font-editorial text-sm sm:text-base italic text-stone-600 tracking-wide select-none truncate">
              Where stories stick together in harmony.
            </p>
          </div>

          {/* Droite : Bouton Participer & Connexion (masqué sur l'onglet productions / coproduction) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {activeDemoTab !== 'productions' && (
              <button
                onClick={() => onNavigate({ type: 'participate' })}
                className="px-3.5 sm:px-4.5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold text-white bg-[#A2482B] hover:bg-[#8A3B22] shadow-xs hover:shadow-sm transition-all cursor-pointer flex items-center justify-center active:scale-95 whitespace-nowrap hover:scale-105"
              >
                <span>Co-construire Yonywood</span>
              </button>
            )}
          </div>

        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. ZONE PRINCIPALE : NAVIGATION NATIVE DU CONTENU AU-DESSUS               */}
      {/* ========================================================================= */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 pb-28 flex flex-col items-center">
        
        <div className="w-full flex-1 flex flex-col items-center animate-in fade-in duration-200">
          
          {/* 1. STUDIO */}
          {activeDemoTab === 'studio' && <DemoStudioSection />}

          {/* 2. HÉRITAGES (16 profils en constellation avec double-clic) */}
          {activeDemoTab === 'heritages' && <DemoHeritagesSection />}

          {/* 3. DUOCUMENTAIRES (Swipe des 8 duos, modale évaluation ajustée) */}
          {activeDemoTab === 'duos' && <DemoDuocumentairesSection />}

          {/* 4. PRODUCTIONS (8 productions, jauge de parts, marché) */}
          {activeDemoTab === 'productions' && <DemoProductionsSection />}

          {/* 5. ENTREPRISE (Héritage de marque en capsules 9:16) */}
          {activeDemoTab === 'entreprise' && <DemoEntrepriseSection />}

          {/* 6. PROFIL (Pascal Cossi : Voir Autrement, 10 parts, Fâ, atelier) */}
          {activeDemoTab === 'profil' && <DemoProfilPascalSection />}

        </div>

      </main>

      {/* ========================================================================= */}
      {/* 3. BARRE DE NAVIGATION EN BAS, FIXE (Identique au BottomMenu de l'app)    */}
      {/* ========================================================================= */}
      <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none pb-3 sm:pb-4 px-2 sm:px-6">
        <nav 
          aria-label="Navigation principale démo"
          className="pointer-events-auto max-w-[420px] sm:max-w-[450px] mx-auto bg-white/95 backdrop-blur-xl border border-stone-200/90 rounded-full shadow-2xl shadow-stone-900/10 px-1.5 sm:px-3 py-1.5 flex items-center justify-between gap-0.5"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeDemoTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveDemoTab(item.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                id={item.screenId}
                title={item.label}
                className={`relative flex-1 min-w-0 flex flex-col items-center justify-center px-0.5 sm:px-1.5 py-1 rounded-full transition-colors duration-200 group cursor-pointer ${
                  isActive ? 'text-stone-900' : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                {/* Capsule changeante Terre Cuite (#A2482B) uniquement sur l'icône */}
                <div 
                  className={`w-8 h-8 sm:w-10 sm:h-10 aspect-square shrink-0 rounded-full flex items-center justify-center transition-all duration-200 ${
                    isActive 
                      ? 'bg-[#A2482B] text-white shadow-sm' 
                      : 'bg-transparent text-stone-600 group-hover:bg-stone-100/80'
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0 transition-transform duration-200" strokeWidth={1.75} isActive={isActive} />
                </div>

                {/* Libellé textuel */}
                <span className={`text-[8.5px] min-[380px]:text-[9.5px] sm:text-[10.5px] leading-tight tracking-tight mt-0.5 sm:mt-1 whitespace-nowrap text-center ${
                  isActive ? 'text-[#A2482B] font-semibold' : 'text-stone-500 font-normal'
                }`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

    </div>
  );
};
