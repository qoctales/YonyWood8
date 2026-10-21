import React, { useState, useEffect } from 'react';
import { ViewScreen } from './types';
import { DOCUMENTARIES } from './data/mockData';
import { HomeScreen } from './components/HomeScreen';
import { MatrixExplorer } from './components/MatrixExplorer';
import { DocumentariesListScreen } from './components/DocumentariesListScreen';
import { DocumentaryDetailScreen } from './components/DocumentaryDetailScreen';
import { DuoFeedScreen } from './components/DuoFeedScreen';
import { DuoScreen } from './components/DuoScreen';
import { VideoPlayerScreen } from './components/VideoPlayerScreen';
import { ProtagonistProfileScreen } from './components/ProtagonistProfileScreen';
import { TransmissionScreen } from './components/TransmissionScreen';
import { MyForestScreen } from './components/MyForestScreen';
import { ProfileSettingsScreen } from './components/ProfileSettingsScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { PortfolioScreen } from './components/PortfolioScreen';
import { TransactionsScreen } from './components/TransactionsScreen';
import { MessagingScreen } from './components/MessagingScreen';
import { MarketplaceScreen } from './components/MarketplaceScreen';
import { SubmitStoryScreen } from './components/SubmitStoryScreen';
import { RequestVideographerScreen } from './components/RequestVideographerScreen';
import { ReviewSystemScreen } from './components/ReviewSystemScreen';
import { EditorialBackOfficeScreen } from './components/EditorialBackOfficeScreen';
import { AdminDashboard } from './components/AdminDashboard';
import { NavigationScreen } from './components/NavigationScreen';
import { LandingScreen } from './components/LandingScreen';
import { BottomMenu } from './components/BottomMenu';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { CompanyHeritageScreen } from './components/CompanyHeritageScreen';
import { ParticipateScreen } from './components/ParticipateScreen';
import { io } from 'socket.io-client';

// Résolution et redirection permanente des routes d'adresses internes
const resolveScreenFromPath = (): { screen: ViewScreen | null; redirectFrom?: string; redirectTo?: string } => {
  if (typeof window === 'undefined') return { screen: null };
  const path = window.location.pathname.toLowerCase().replace(/\/+$/, '');
  
  // Redirections permanentes des anciennes adresses vers les nouvelles
  if (path === '/portraits') {
    return { screen: { type: 'enterprise' }, redirectFrom: '/portraits', redirectTo: '/lumiere' };
  }
  if (path === '/perspectives') {
    return { screen: { type: 'duo_feed' }, redirectFrom: '/perspectives', redirectTo: '/duo' };
  }
  if (path === '/heritages') {
    return { screen: { type: 'home' }, redirectFrom: '/heritages', redirectTo: '/heritage' };
  }

  // Nouvelles adresses officielles
  if (path === '/lumiere') {
    return { screen: { type: 'enterprise' } };
  }
  if (path === '/duo') {
    return { screen: { type: 'duo_feed' } };
  }
  if (path === '/heritage') {
    return { screen: { type: 'home' } };
  }
  if (path === '/studio') {
    return { screen: { type: 'submit_story' } };
  }
  if (path === '/production') {
    return { screen: { type: 'marketplace' } };
  }
  if (path === '/profil') {
    return { screen: { type: 'profile' } };
  }
  if (path === '/co-construction' || path === '/participer') {
    return { screen: { type: 'participate' } };
  }

  return { screen: null };
};

const getScreenRouteInfo = (screen: ViewScreen): { path: string; title: string } => {
  switch (screen.type) {
    case 'home':
    case 'matrix_view':
    case 'documentaries':
    case 'documentary_detail':
      return { path: '/heritage', title: 'Héritage — YonyWood' };
    case 'duo_feed':
    case 'duo_detail':
    case 'landing':
      return { path: '/duo', title: 'Duo — YonyWood' };
    case 'enterprise':
      return { path: '/lumiere', title: 'Lumière — YonyWood' };
    case 'submit_story':
    case 'request_videographer':
      return { path: '/studio', title: 'Studio — YonyWood' };
    case 'marketplace':
      return { path: '/production', title: 'Production — YonyWood' };
    case 'profile':
    case 'settings':
    case 'portfolio':
    case 'transactions':
    case 'protagonist_profile':
    case 'my_forest':
    case 'lineage':
    case 'messaging':
    case 'editorial_backoffice':
      return { path: '/profil', title: 'Profil — YonyWood' };
    case 'participate':
      return { path: '/co-construction', title: 'Co-construction — YonyWood' };
    default:
      return { path: '/duo', title: 'Duo — YonyWood' };
  }
};

export default function App() {
  // Immersion directe : reconnaissance de la route et redirection si ancienne adresse
  const [currentScreen, setCurrentScreen] = useState<ViewScreen>(() => {
    const fromPath = resolveScreenFromPath();
    if (fromPath.redirectFrom && fromPath.redirectTo && typeof window !== 'undefined') {
      window.history.replaceState({ screen: fromPath.screen }, '', fromPath.redirectTo + window.location.search);
    }
    if (fromPath.screen) {
      return fromPath.screen;
    }
    try {
      const savedScreen = localStorage.getItem('yonywood_last_screen');
      if (savedScreen) {
        const parsed = JSON.parse(savedScreen);
        if (parsed && parsed.type && parsed.type !== 'landing') {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return { type: 'duo_feed' };
  });

  // Gestion de la modale d'authentification
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // User preferences & series filter state with localStorage persistence
  const [selectedSeriesFilter, setSelectedSeriesFilter] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('yonywood_selected_series');
      if (saved) {
        let parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          parsed = parsed.map((id: string) => id === 'safer-healer' ? 'focus-phd' : id);
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return DOCUMENTARIES.map(d => d.id);
  });
  const [language, setLanguage] = useState<string>('fr');
  const [hideQuestionByDefault, setHideQuestionByDefault] = useState<boolean>(true);

  const handleUpdateDocFilter = (docIds: string[]) => {
    setSelectedSeriesFilter(docIds);
    try {
      localStorage.setItem('yonywood_selected_series', JSON.stringify(docIds));
    } catch {
      // ignore
    }
  };

  // Écoute de l'historique du navigateur (boutons Précédent / Suivant) avec redirections permanentes
  useEffect(() => {
    const handlePopState = () => {
      const { screen, redirectFrom, redirectTo } = resolveScreenFromPath();
      if (redirectFrom && redirectTo) {
        window.history.replaceState({ screen }, '', redirectTo + window.location.search);
      }
      if (screen) {
        setCurrentScreen(screen);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Synchronisation permanente de l'URL, de la balise title et du défilement
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const { path, title } = getScreenRouteInfo(currentScreen);
    document.title = title;

    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname.toLowerCase().replace(/\/+$/, '');
      const { redirectFrom, redirectTo } = resolveScreenFromPath();
      if (redirectFrom && redirectTo) {
        window.history.replaceState({ screen: currentScreen }, '', redirectTo + window.location.search);
      } else if (currentPath !== path && currentPath !== '') {
        window.history.pushState({ screen: currentScreen }, '', path + window.location.search);
      }
    }

    try {
      if (currentScreen.type !== 'video_player') {
        localStorage.setItem('yonywood_last_screen', JSON.stringify(currentScreen));
      }
    } catch {
      // ignore
    }
  }, [currentScreen]);

  // Initialize Socket.IO
  useEffect(() => {
    const socketEndpoint = import.meta.env.VITE_API_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : '');
    const socket = io(socketEndpoint, {
      path: '/socket.io',
      auth: { token: localStorage.getItem('yonywood_auth_token') },
      reconnectionAttempts: 3,
      timeout: 5000,
    });
    socket.on('connect', () => console.log('Socket.IO connected'));
    socket.on('connect_error', (err) => console.debug('Socket.IO:', err.message));
    socket.on('message', (msg) => console.log('New message:', msg));
    return () => {
      socket.disconnect();
    };
  }, []);

  const isVideoPlayer = currentScreen.type === 'video_player';
  const isDarkScreen = currentScreen.type === 'video_player';
  const isFixedViewportScreen = 
    currentScreen.type === 'duo_feed' || 
    currentScreen.type === 'landing' || 
    currentScreen.type === 'home' || 
    currentScreen.type === 'matrix_view' || 
    currentScreen.type === 'enterprise' ||
    currentScreen.type === 'marketplace' ||
    currentScreen.type === 'submit_story';

  return (
    <div className={`h-[100dvh] max-h-[100dvh] w-full overflow-hidden flex flex-col font-sans antialiased selection:bg-[#C89B3C]/20 selection:text-[#1C1917] relative ${
      isDarkScreen ? 'bg-[#0E0D0B] text-white' : 'bg-white text-[#1C1917]'
    }`}>
      
      {/* Header universel YonyWood avec Logo, Slogan et boutons Connexion/Inscription */}
      {!isVideoPlayer && (
        <Navbar 
          currentScreen={currentScreen} 
          onNavigate={setCurrentScreen} 
          onOpenAuth={(mode) => {
            setAuthMode(mode);
            setAuthModalOpen(true);
          }}
        />
      )}

      {/* Main Content Area - Immersion directe parfaitement calibrée */}
      <main className="flex-1 min-h-0 relative overflow-hidden flex flex-col">
        {currentScreen.type === 'landing' && (
          <DuoFeedScreen 
            onNavigate={setCurrentScreen} 
            allowedSeriesIds={selectedSeriesFilter}
          />
        )}

        {(currentScreen.type === 'home' || currentScreen.type === 'matrix_view') && (
          <MatrixExplorer onNavigate={setCurrentScreen} />
        )}

        {currentScreen.type === 'duo_feed' && (
          <DuoFeedScreen 
            onNavigate={setCurrentScreen} 
            initialDocId={currentScreen.selectedDocId} 
            initialDuoIndex={currentScreen.currentDuoIndex}
            allowedSeriesIds={selectedSeriesFilter}
          />
        )}

        {currentScreen.type === 'enterprise' && (
          <CompanyHeritageScreen onNavigate={setCurrentScreen} />
        )}

        {currentScreen.type === 'marketplace' && (
          <MarketplaceScreen 
            onNavigate={setCurrentScreen} 
            initialPeerOfferId={currentScreen.initialPeerOfferId}
            initialPeerIndex={currentScreen.initialPeerIndex}
            initialTab={currentScreen.initialTab}
            restoreContext={currentScreen.restoreContext}
          />
        )}

        {currentScreen.type === 'profile' && (
          <ProfileSettingsScreen 
            onNavigate={setCurrentScreen}
            selectedDocFilter={selectedSeriesFilter}
            onUpdateDocFilter={handleUpdateDocFilter}
            language={language}
            onUpdateLanguage={setLanguage}
            hideQuestionByDefault={hideQuestionByDefault}
            onToggleHideQuestion={setHideQuestionByDefault}
            returnToDuoId={currentScreen.returnToDuoId}
            returnToDuoIndex={currentScreen.returnToDuoIndex}
            returnToDocId={currentScreen.returnToDocId}
            returnToProtagonistId={currentScreen.returnToProtagonistId}
            initialShowLineage={currentScreen.initialShowLineage}
            initialModal={currentScreen.initialModal}
          />
        )}

        {currentScreen.type === 'lineage' && (
          <ProfileSettingsScreen 
            key={currentScreen.protagonistId || 'default-lineage'}
            protagonistId={currentScreen.protagonistId} 
            onNavigate={setCurrentScreen} 
            selectedDocFilter={selectedSeriesFilter}
            onUpdateDocFilter={handleUpdateDocFilter}
            language={language}
            onUpdateLanguage={setLanguage}
            hideQuestionByDefault={hideQuestionByDefault}
            onToggleHideQuestion={setHideQuestionByDefault}
            returnToDuoId={currentScreen.returnToDuoId}
            returnToDuoIndex={currentScreen.returnToDuoIndex}
            returnToDocId={currentScreen.returnToDocId}
            returnToProtagonistId={currentScreen.returnToProtagonistId}
            initialShowLineage={true}
          />
        )}

        {currentScreen.type === 'settings' && (
          <SettingsScreen 
            onNavigate={setCurrentScreen}
            returnTo={currentScreen.returnTo}
            selectedDocFilter={selectedSeriesFilter}
            onUpdateDocFilter={handleUpdateDocFilter}
            language={language}
            onUpdateLanguage={setLanguage}
          />
        )}

        {currentScreen.type === 'portfolio' && (
          <PortfolioScreen 
            onNavigate={setCurrentScreen}
            returnToDuoId={currentScreen.returnToDuoId}
            returnToDuoIndex={currentScreen.returnToDuoIndex}
            returnToDocId={currentScreen.returnToDocId}
          />
        )}

        {currentScreen.type === 'transactions' && (
          <TransactionsScreen 
            onNavigate={setCurrentScreen}
            initialTab={currentScreen.initialTab}
            returnToDuoId={currentScreen.returnToDuoId}
            returnToDuoIndex={currentScreen.returnToDuoIndex}
            returnToDocId={currentScreen.returnToDocId}
          />
        )}

        {currentScreen.type === 'messaging' && (
          <MessagingScreen onNavigate={setCurrentScreen} />
        )}

        {currentScreen.type === 'documentaries' && (
          <DocumentariesListScreen onNavigate={setCurrentScreen} />
        )}

        {currentScreen.type === 'documentary_detail' && (
          <DocumentaryDetailScreen 
            documentaryId={currentScreen.documentaryId} 
            onNavigate={setCurrentScreen} 
          />
        )}

        {currentScreen.type === 'duo_detail' && (
          <DuoFeedScreen 
            initialDuoId={currentScreen.duoId} 
            allowedSeriesIds={selectedSeriesFilter}
            onNavigate={setCurrentScreen} 
          />
        )}

        {currentScreen.type === 'video_player' && (
          <VideoPlayerScreen
            story={currentScreen.story}
            protagonist={currentScreen.protagonist}
            duoId={currentScreen.duoId}
            documentaryTitle={currentScreen.documentaryTitle}
            onNavigate={setCurrentScreen}
          />
        )}

        {currentScreen.type === 'protagonist_profile' && (
          <ProfileSettingsScreen 
            key={currentScreen.protagonistId || 'default-protagonist'}
            protagonistId={currentScreen.protagonistId} 
            onNavigate={setCurrentScreen} 
            selectedDocFilter={selectedSeriesFilter}
            onUpdateDocFilter={handleUpdateDocFilter}
            language={language}
            onUpdateLanguage={setLanguage}
            hideQuestionByDefault={hideQuestionByDefault}
            onToggleHideQuestion={setHideQuestionByDefault}
            returnToDuoId={currentScreen.returnToDuoId}
            returnToDuoIndex={currentScreen.returnToDuoIndex}
            returnToDocId={currentScreen.returnToDocId}
            returnToProtagonistId={currentScreen.returnToProtagonistId}
            initialShowLineage={currentScreen.initialShowLineage}
            returnToMarketplace={currentScreen.returnToMarketplace}
            marketplaceContext={currentScreen.marketplaceContext}
          />
        )}

        {currentScreen.type === 'transmission_detail' && (
          <TransmissionScreen 
            protagonistId={currentScreen.protagonistId} 
            transmissionId={currentScreen.transmissionId} 
            onNavigate={setCurrentScreen} 
          />
        )}

        {currentScreen.type === 'my_forest' && (
          <MyForestScreen onNavigate={setCurrentScreen} />
        )}

        {currentScreen.type === 'submit_story' && (
          <SubmitStoryScreen 
            preselectedDocumentaryId={currentScreen.preselectedDocumentaryId} 
            onNavigate={setCurrentScreen} 
          />
        )}

        {currentScreen.type === 'request_videographer' && (
          <RequestVideographerScreen onNavigate={setCurrentScreen} />
        )}

        {(currentScreen.type === 'review_system' || currentScreen.type === 'forest_reviews') && (
          <ReviewSystemScreen onNavigate={setCurrentScreen} />
        )}

        {currentScreen.type === 'editorial_backoffice' && (
          <EditorialBackOfficeScreen onNavigate={setCurrentScreen} />
        )}

        {currentScreen.type === 'admin_dashboard' && (
          <AdminDashboard 
            onNavigate={setCurrentScreen} 
            initialTab={currentScreen.tab} 
          />
        )}

        {currentScreen.type === 'site_map' && (
          <NavigationScreen onNavigate={setCurrentScreen} />
        )}

        {currentScreen.type === 'participate' && (
          <ParticipateScreen 
            onNavigate={setCurrentScreen} 
            initialRole={currentScreen.initialRole}
            preselectedSeriesId={currentScreen.preselectedSeriesId}
          />
        )}
      </main>

      {/* Menu de navigation principal : Studio, Héritage, Duo, Lumière, Production, Profil */}
      {!isVideoPlayer && (
        <BottomMenu 
          currentScreen={currentScreen} 
          onNavigate={setCurrentScreen} 
        />
      )}

      {/* Modale d'authentification épurée (Connexion / Inscription) */}
      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
        onSuccess={() => setAuthModalOpen(false)}
      />

    </div>
  );
}
