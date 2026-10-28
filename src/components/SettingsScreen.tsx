import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Lock, 
  LogOut, 
  ShieldCheck,
  Coins,
  Clapperboard,
  Tv,
  MessageSquare,
  Users,
  BellRing,
  User,
  Building2,
  Video,
  Plus,
  Trash2,
  Sparkles,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sliders,
  Globe,
  Save,
  CheckCheck,
  ExternalLink,
  TrendingUp,
  Wallet,
  ArrowUpRight
} from 'lucide-react';
import { ViewScreen, AccountType, OrgCategoryType } from '../types';
import { DOCUMENTARIES } from '../data/mockData';
import { useAuth } from '../services/authContext';
import { ProfileSoloIcon, TvPlayerIcon } from './YonywoodBrandIcons';
import { 
  getUserVideoSubmissions, 
  deleteUserVideoSubmission, 
  UserVideoSubmission 
} from '../utils/userVideoService';

interface SettingsScreenProps {
  onNavigate: (screen: ViewScreen) => void;
  returnTo?: 'profile' | 'duo_feed';
  selectedDocFilter: string[];
  onUpdateDocFilter: (filter: string[]) => void;
  language: string;
  onUpdateLanguage: (lang: string) => void;
}

type SettingsTab = 'identity' | 'videos' | 'shares' | 'series' | 'messages' | 'security';

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onNavigate,
  returnTo = 'profile',
  selectedDocFilter,
  onUpdateDocFilter,
  language,
  onUpdateLanguage
}) => {
  const { currentUser, updateProfile, logout } = useAuth();

  // Onglet actif : Identité & Compte par défaut
  const [activeTab, setActiveTab] = useState<SettingsTab>('identity');

  // État du formulaire Identité épuré (pas de formulaire lourd)
  const isOrg = currentUser?.accountType === 'ORGANIZATION';
  const [name, setName] = useState<string>(currentUser?.name || 'Romeo Nonvide');
  const [handle, setHandle] = useState<string>(currentUser?.handle || '@romeo');
  const [city, setCity] = useState<string>(currentUser?.city || currentUser?.territory || 'Cotonou');
  const [country, setCountry] = useState<string>(currentUser?.country || 'Bénin');
  const [catchphrase, setCatchphrase] = useState<string>(
    currentUser?.catchphrase || currentUser?.bio || 'Réalisateur & Fondateur YonyWood à Cotonou.'
  );
  const [avatarUrl, setAvatarUrl] = useState<string>(currentUser?.avatarUrl || '/assets/images/romeo_avatar_1792698425983.jpg');

  // Champs organisationnels légers si compte organisation
  const [legalName, setLegalName] = useState<string>(currentUser?.orgDetails?.legalName || currentUser?.name || '');
  const [sector, setSector] = useState<string>(currentUser?.orgDetails?.sector || 'Artisanat, Culture & Énergie');
  const [legalRepresentative, setLegalRepresentative] = useState<string>(currentUser?.orgDetails?.legalRepresentative || '');

  // État des vidéos de l'utilisateur
  const [userVideos, setUserVideos] = useState<UserVideoSubmission[]>(() => {
    return getUserVideoSubmissions(currentUser?.id || 'usr-admin-romeo');
  });

  // État du carrousel des séries
  const [activeSeriesIndex, setActiveSeriesIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Préférences de messagerie & notifications
  const [messagePermission, setMessagePermission] = useState<'none' | 'invitation' | 'all'>(() => {
    return (localStorage.getItem('yonywood_msg_permission') as 'none' | 'invitation' | 'all') || 'all';
  });
  const [pushNewMessage, setPushNewMessage] = useState<boolean>(() => {
    const saved = localStorage.getItem('yonywood_push_msg');
    return saved !== null ? saved === 'true' : true;
  });
  const [messagePreview, setMessagePreview] = useState<boolean>(() => {
    const saved = localStorage.getItem('yonywood_msg_preview');
    return saved !== null ? saved === 'true' : true;
  });

  // Feedback sauvegarde
  const [savedToast, setSavedToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setSavedToast(msg);
    setTimeout(() => setSavedToast(null), 3000);
  };

  const reloadVideos = () => {
    setUserVideos(getUserVideoSubmissions(currentUser?.id || 'usr-admin-romeo'));
  };

  const handleDeleteVideo = (id: string) => {
    if (confirm('Voulez-vous supprimer définitivement cette vidéo de votre espace ?')) {
      deleteUserVideoSubmission(id);
      reloadVideos();
      showToast('Vidéo supprimée.');
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: name.trim(),
      handle: handle.trim(),
      city: city.trim(),
      territory: city.trim(),
      country: country.trim(),
      catchphrase: catchphrase.trim(),
      bio: catchphrase.trim(),
      avatarUrl: avatarUrl.trim(),
      orgDetails: isOrg ? {
        ...currentUser?.orgDetails,
        legalName: legalName.trim(),
        sector: sector.trim(),
        legalRepresentative: legalRepresentative.trim(),
      } : undefined
    });
    showToast('Profil mis à jour avec succès.');
  };

  const sharesCount = currentUser?.sharesCount ?? 125;
  const sharesDate = currentUser?.sharesAcquiredDate || currentUser?.createdAt || '15 Janvier 2026';
  const sharesValue = currentUser?.sharesInvestedAmount ?? (sharesCount * 10000);
  const sharesDividends = currentUser?.sharesEstimatedDividends ?? 142500;

  return (
    <div className="h-[100dvh] max-h-[100dvh] w-full bg-[#FAF7F2] text-[#1C1917] flex flex-col font-sans select-none overflow-hidden">
      
      {/* 1. BARRE SUPÉRIEURE ÉPURÉE */}
      <header className="shrink-0 h-14 sm:h-16 px-4 sm:px-8 border-b border-stone-200/80 bg-white/95 backdrop-blur-md flex items-center justify-between z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (returnTo === 'profile') {
                onNavigate({ type: 'profile' });
              } else {
                onNavigate({ type: 'duo_feed' });
              }
            }}
            className="w-9 h-9 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center transition-all cursor-pointer active:scale-95"
            title="Revenir au portrait"
          >
            <ChevronLeft className="w-5 h-5 text-stone-800" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-editorial text-base sm:text-lg font-bold text-stone-900 leading-none">
                Paramètres & Gestion de Compte
              </h1>
              {isOrg ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200 flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-amber-700" /> Organisation
                </span>
              ) : (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 flex items-center gap-1">
                  <User className="w-3 h-3 text-stone-600" /> Individu
                </span>
              )}
            </div>
            <p className="text-[11px] text-stone-500 mt-0.5 hidden sm:block">
              {name} ({handle}) • {isOrg ? 'Vitrine Lumière & récits d’impact' : 'Portrait personnel & parts de coproduction'}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            logout();
            onNavigate({ type: 'duo_feed' });
          }}
          className="px-3 py-1.5 rounded-xl border border-stone-200 hover:border-red-200 text-stone-500 hover:text-red-700 hover:bg-red-50 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          title="Se déconnecter"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Déconnexion</span>
        </button>
      </header>

      {/* 2. NAVIGATION D'ONGLETS HORIZONTALE */}
      <div className="shrink-0 bg-white border-b border-stone-200 px-4 sm:px-8 flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none z-20">
        {[
          { id: 'identity', label: 'Identité', icon: User },
          { id: 'videos', label: 'Mes Vidéos', count: userVideos.length, icon: Video },
          { id: 'shares', label: 'Mes Parts & Coproduction', count: sharesCount, icon: Coins },
          { id: 'series', label: 'Séries', count: selectedDocFilter.length, icon: Clapperboard },
          { id: 'messages', label: 'Messages', icon: MessageSquare },
          { id: 'security', label: 'Sécurité', icon: Lock },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as SettingsTab)}
              className={`py-3 px-3 sm:px-4 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'border-[#A2482B] text-[#A2482B]'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive ? 'bg-[#A2482B]/15 text-[#A2482B]' : 'bg-stone-100 text-stone-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 3. CORPS DU CONTENU */}
      <main className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-8 py-5 sm:py-7 max-w-5xl mx-auto w-full">
        
        {/* ========================================================================= */}
        {/* ONGLET 1 : IDENTITÉ ÉPURÉE                                                */}
        {/* ========================================================================= */}
        {activeTab === 'identity' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200/90 shadow-xs space-y-6">
              <div>
                <h2 className="text-base font-bold text-stone-900 font-serif">
                  Identité du Compte
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Profil synthétique visible par les autres membres du réseau. Les informations sont volontairement courtes et épurées.
                </p>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-5">
                {/* Photo de profil & Type de compte fixe */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-4 border-b border-stone-100">
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-stone-100 border-2 border-stone-200 shrink-0">
                    <img
                      src={avatarUrl}
                      alt={name}
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.onerror = null;
                        target.src = '/assets/images/romeo_avatar_1792698425983.jpg';
                      }}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-stone-800">Type de profil enregistré :</span>
                      {isOrg ? (
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-amber-700" /> Compte Organisation (Lumière)
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-800 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-stone-700" /> Compte Individu
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-stone-500">
                      {isOrg 
                        ? 'Ce compte représente une structure officielle sur l’onglet Lumière. Les membres individuels peuvent témoigner et documenter vos initiatives.' 
                        : 'Ce compte est personnel. Il vous permet de publier vos récits, de détenir des parts et de témoigner.'}
                    </p>
                  </div>
                </div>

                {/* Champs essentiels légers */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      {isOrg ? "Nom de l'organisation" : 'Nom et prénom'}
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm text-stone-900 focus:bg-white focus:outline-none focus:border-[#A2482B] focus:ring-1 focus:ring-[#A2482B] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Identifiant public
                    </label>
                    <input
                      type="text"
                      value={handle}
                      onChange={(e) => setHandle(e.target.value)}
                      required
                      placeholder="@votreidentifiant"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm text-stone-900 focus:bg-white focus:outline-none focus:border-[#A2482B] focus:ring-1 focus:ring-[#A2482B] transition-all font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Ville ou Territoire d'ancrage
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Ex: Cotonou, Ganvié, Ouidah..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm text-stone-900 focus:bg-white focus:outline-none focus:border-[#A2482B] focus:ring-1 focus:ring-[#A2482B] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Pays
                    </label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm text-stone-900 focus:bg-white focus:outline-none focus:border-[#A2482B] focus:ring-1 focus:ring-[#A2482B] transition-all"
                    />
                  </div>
                </div>

                {/* Phrase d'accroche courte (1-2 phrases maximum) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-stone-700">
                      Phrase d'accroche ou vocation (quelques mots)
                    </label>
                    <span className="text-[10px] text-stone-400">120 caractères max conseillés</span>
                  </div>
                  <textarea
                    rows={2}
                    value={catchphrase}
                    onChange={(e) => setCatchphrase(e.target.value)}
                    placeholder="Résumez votre trajectoire en une phrase percutante..."
                    maxLength={200}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm text-stone-900 focus:bg-white focus:outline-none focus:border-[#A2482B] focus:ring-1 focus:ring-[#A2482B] transition-all resize-none"
                  />
                </div>

                {/* URL Photo / Logo */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {isOrg ? 'Lien du logo ou image officielle' : 'Lien de votre photo portrait'}
                  </label>
                  <input
                    type="url"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:bg-white focus:outline-none focus:border-[#A2482B] focus:ring-1 focus:ring-[#A2482B] transition-all font-mono"
                  />
                </div>

                {/* Spécificités Organisation si compte Organisation */}
                {isOrg && (
                  <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/60 space-y-3">
                    <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block">
                      Informations Légales & Référencement Lumière
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-stone-700 mb-1">Raison sociale officielle</label>
                        <input
                          type="text"
                          value={legalName}
                          onChange={(e) => setLegalName(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-stone-200 text-xs text-stone-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-stone-700 mb-1">Secteur d'activité</label>
                        <input
                          type="text"
                          value={sector}
                          onChange={(e) => setSector(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-stone-200 text-xs text-stone-900"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold text-stone-700 mb-1">Représentant légal ou Fondateur</label>
                        <input
                          type="text"
                          value={legalRepresentative}
                          onChange={(e) => setLegalRepresentative(e.target.value)}
                          placeholder="Nom de la personne habilitée"
                          className="w-full px-3 py-2 rounded-xl bg-white border border-stone-200 text-xs text-stone-900"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#A2482B] hover:bg-[#8A3B22] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer hover:scale-102 active:scale-98"
                  >
                    <Save className="w-4 h-4" />
                    <span>Enregistrer mon profil</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ONGLET 2 : MES VIDÉOS & VALIDATION ÉDITORIALE                              */}
        {/* ========================================================================= */}
        {activeTab === 'videos' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200/90 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
                <div>
                  <h2 className="text-base font-bold text-stone-900 font-serif">
                    Mes Publications & Vidéos Déposées
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Toutes les vidéos soumises passent par l'examen éditorial de Roméo Nonvide avant publication publique.
                  </p>
                </div>

                <button
                  onClick={() => onNavigate({ type: 'submit_story' })}
                  className="px-4 py-2 rounded-xl bg-[#A2482B] hover:bg-[#8A3B22] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0 self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Déposer au Studio</span>
                </button>
              </div>

              {userVideos.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <Video className="w-10 h-10 text-stone-300 mx-auto" />
                  <p className="text-sm font-semibold text-stone-700">Vous n'avez pas encore soumis de vidéo.</p>
                  <p className="text-xs text-stone-400 max-w-sm mx-auto">
                    Partagez votre histoire ou documentez une entreprise pionnière depuis le Studio de création.
                  </p>
                  <button
                    onClick={() => onNavigate({ type: 'submit_story' })}
                    className="px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer"
                  >
                    Ouvrir le Studio
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {userVideos.map((video) => (
                    <div
                      key={video.id}
                      className="p-4 rounded-2xl border border-stone-200 bg-white hover:border-stone-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-3.5 min-w-0">
                        <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-black shrink-0 border border-stone-200">
                          <img
                            src={video.thumbnailUrl || '/assets/images/selfie_video_story.jpg'}
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-sm font-bold text-stone-900 truncate">
                              {video.title}
                            </h3>
                            {video.status === 'PENDING' && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                                <Clock className="w-3 h-3 text-amber-600" /> En examen éditorial
                              </span>
                            )}
                            {video.status === 'APPROVED' && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> En ligne & Validée
                              </span>
                            )}
                            {video.status === 'REJECTED' && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3 text-rose-600" /> Retouche demandée
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-stone-600 line-clamp-2">
                            {video.synopsis}
                          </p>

                          {video.rejectionReason && (
                            <p className="text-[11px] text-rose-700 bg-rose-50 p-2 rounded-lg border border-rose-100">
                              <span className="font-semibold">Note éditoriale :</span> {video.rejectionReason}
                            </p>
                          )}

                          <div className="text-[10px] text-stone-400 flex items-center gap-2 pt-0.5">
                            <span>Soumise le {video.createdAt}</span>
                            <span>•</span>
                            <span className="uppercase font-mono">{video.universe}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <button
                          onClick={() => handleDeleteVideo(video.id)}
                          className="p-2 rounded-xl hover:bg-rose-50 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Supprimer cette vidéo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ONGLET 3 : MES PARTS & COPRODUCTION POPULAIRE                             */}
        {/* ========================================================================= */}
        {activeTab === 'shares' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200/90 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
                <div>
                  <h2 className="text-base font-bold text-stone-900 font-serif flex items-center gap-2">
                    <Coins className="w-5 h-5 text-[#A2482B]" />
                    <span>Mon Portefeuille de Parts & Coproduction</span>
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Chaque part détenue soutient la souveraineté culturelle et ouvre droit aux retombées de diffusion.
                  </p>
                </div>

                <button
                  onClick={() => onNavigate({ type: 'marketplace', initialTab: 'shares' })}
                  className="px-4 py-2 rounded-xl bg-[#A2482B] hover:bg-[#8A3B22] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Acquérir de nouvelles parts</span>
                </button>
              </div>

              {/* 3 Cartes Métriques Clés */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1">
                  <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
                    Parts Détenues
                  </span>
                  <div className="text-2xl font-bold font-serif text-stone-900 flex items-baseline gap-1.5">
                    <span>{sharesCount}</span>
                    <span className="text-xs font-normal text-stone-500 font-sans">parts</span>
                  </div>
                  <span className="text-[10px] text-stone-400 block">Entré(e) le {sharesDate}</span>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1">
                  <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
                    Valeur Nominale Estimée
                  </span>
                  <div className="text-2xl font-bold font-serif text-[#A2482B] flex items-baseline gap-1.5">
                    <span>{sharesValue.toLocaleString()}</span>
                    <span className="text-xs font-normal text-stone-500 font-sans">FCFA</span>
                  </div>
                  <span className="text-[10px] text-stone-400 block">≈ {Math.round(sharesValue / 655.957)} €</span>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1">
                  <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
                    Redevances Estimées
                  </span>
                  <div className="text-2xl font-bold font-serif text-emerald-700 flex items-baseline gap-1.5">
                    <span>{sharesDividends.toLocaleString()}</span>
                    <span className="text-xs font-normal text-stone-500 font-sans">FCFA</span>
                  </div>
                  <span className="text-[10px] text-emerald-600 block">Paiements trimestriels réguliers</span>
                </div>
              </div>

              {/* Explication pédagogique claire */}
              <div className="rounded-2xl bg-[#A2482B]/5 border border-[#A2482B]/20 p-4 space-y-2">
                <h3 className="text-xs font-bold text-[#A2482B] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#A2482B]" />
                  <span>Actionnariat Populaire & Transparence Généalogique</span>
                </h3>
                <p className="text-xs text-stone-700 leading-relaxed">
                  À partir du Bénin vers le monde entier, les premiers acquéreurs de parts sont les co-bâtisseurs fondateurs.
                  Vous participez aux décisions lors des assemblées communautaires et suivez en direct l'impact de vos investissements.
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-2.5">
                  <button
                    onClick={() => onNavigate({ type: 'marketplace' })}
                    className="px-3 py-1.5 rounded-lg bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <span>Explorer les séries du Marché</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onNavigate({ type: 'participate' })}
                    className="px-3 py-1.5 rounded-lg bg-white border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50 transition-colors cursor-pointer"
                  >
                    Lire le manifeste de coproduction
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ONGLET 4 : SÉRIES FAVORITES & FILTRES DU FLUX                             */}
        {/* ========================================================================= */}
        {activeTab === 'series' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200/90 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
                <div>
                  <h2 className="text-base font-bold text-stone-900 font-serif">
                    Séries Documentaires Favorites
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Sélectionnez les séries qui apparaîtront dans votre fil d'actualité Duo et sur vos écrans d'exploration.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onUpdateDocFilter(DOCUMENTARIES.map(d => d.id))}
                    className="text-xs text-[#A2482B] font-semibold hover:underline cursor-pointer"
                  >
                    Tout activer
                  </button>
                  <span className="text-stone-300">•</span>
                  <button
                    onClick={() => onUpdateDocFilter([])}
                    className="text-xs text-stone-500 font-semibold hover:underline cursor-pointer"
                  >
                    Tout désactiver
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {DOCUMENTARIES.map((doc) => {
                  const isChecked = selectedDocFilter.includes(doc.id);
                  return (
                    <div
                      key={doc.id}
                      onClick={() => {
                        if (isChecked) {
                          onUpdateDocFilter(selectedDocFilter.filter(id => id !== doc.id));
                        } else {
                          onUpdateDocFilter([...selectedDocFilter, doc.id]);
                        }
                      }}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
                        isChecked 
                          ? 'border-[#A2482B] bg-[#A2482B]/5 ring-1 ring-[#A2482B]' 
                          : 'border-stone-200 hover:border-stone-300 bg-stone-50/50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={doc.coverImage}
                          alt={doc.title}
                          className="w-10 h-10 rounded-xl object-cover shrink-0 border border-stone-200"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-stone-900 truncate">{doc.title}</p>
                          <p className="text-[10px] text-stone-500 truncate">{doc.subtitle || doc.description}</p>
                        </div>
                      </div>

                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                        isChecked ? 'border-[#A2482B] bg-[#A2482B] text-white' : 'border-stone-300 bg-white'
                      }`}>
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ONGLET 5 : MESSAGERIE & CONFIDENTIALITÉ                                   */}
        {/* ========================================================================= */}
        {activeTab === 'messages' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200/90 shadow-xs space-y-5">
              <div>
                <h2 className="text-base font-bold text-stone-900 font-serif">
                  Préférences de Messagerie & Notifications
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Contrôlez qui peut vous inviter à échanger et vos alertes de contact.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { id: 'all', title: 'Tous les membres inscrits', desc: 'Tout utilisateur ou organisation peut vous envoyer une invitation d’échange.' },
                  { id: 'invitation', title: 'Invitations avec motif validé', desc: 'Seules les sollicitations artistiques ou professionnelles motivées sont transmises.' },
                  { id: 'none', title: 'Messagerie désactivée', desc: 'Personne ne peut vous contacter en direct via la messagerie.' },
                ].map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setMessagePermission(item.id as any);
                      localStorage.setItem('yonywood_msg_permission', item.id);
                      showToast('Préférences de contact mises à jour.');
                    }}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      messagePermission === item.id
                        ? 'border-[#A2482B] bg-[#A2482B]/5 ring-1 ring-[#A2482B]'
                        : 'border-stone-200 hover:border-stone-300 bg-stone-50/50'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold text-stone-900">{item.title}</p>
                      <p className="text-[11px] text-stone-500 mt-0.5">{item.desc}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                      messagePermission === item.id ? 'border-[#A2482B] bg-[#A2482B] text-white' : 'border-stone-300 bg-white'
                    }`}>
                      {messagePermission === item.id && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ONGLET 6 : SÉCURITÉ & COMPTE                                              */}
        {/* ========================================================================= */}
        {activeTab === 'security' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200/90 shadow-xs space-y-5">
              <div>
                <h2 className="text-base font-bold text-stone-900 font-serif">
                  Sécurité & Paramètres de Connexion
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Gestion de votre adresse e-mail et de vos identifiants d'accès.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1">
                  <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider block">
                    Adresse E-mail du Compte
                  </span>
                  <p className="text-sm font-semibold text-stone-800 font-mono">{currentUser?.email || 'qoctales@gmail.com'}</p>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      logout();
                      onNavigate({ type: 'duo_feed' });
                    }}
                    className="w-full py-3 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Se déconnecter de YonyWood</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Toast de confirmation temporaire */}
      {savedToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#1C1917] text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-2xl border border-stone-700 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{savedToast}</span>
        </div>
      )}

    </div>
  );
};
