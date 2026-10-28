import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Film, 
  User, 
  Check, 
  X,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Building2,
  Play,
  RotateCcw
} from 'lucide-react';
import { BACKOFFICE_APPLICATIONS } from '../data/mockData';
import { ViewScreen, BackOfficeApplication, UserVideoSubmission } from '../types';
import { getUserVideoSubmissions, updateVideoSubmissionStatus } from '../utils/userVideoService';

interface EditorialBackOfficeScreenProps {
  onNavigate: (screen: ViewScreen) => void;
}

type FilterStatus = 'ALL' | 'NOUVELLES' | 'CONTROLE_TECHNIQUE' | 'AVIS_FORET' | 'COMITE' | 'REVISIONS' | 'APPROUVEES' | 'PUBLIEES';

export const EditorialBackOfficeScreen: React.FC<EditorialBackOfficeScreenProps> = ({ onNavigate }) => {
  const [activeSection, setActiveSection] = useState<'submissions' | 'applications'>('submissions');

  // 1. Vidéos de la communauté (Individus et Organisations)
  const [submissions, setSubmissions] = useState<UserVideoSubmission[]>(() => getUserVideoSubmissions());
  const [submissionFilter, setSubmissionFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [selectedSubmission, setSelectedSubmission] = useState<UserVideoSubmission | null>(() => {
    const list = getUserVideoSubmissions();
    return list.find(s => s.status === 'PENDING') || list[0] || null;
  });
  const [submissionSearch, setSubmissionSearch] = useState('');
  const [feedbackPrompt, setFeedbackPrompt] = useState<string | null>(null);

  // 2. Dossiers de candidatures officiels
  const [applications, setApplications] = useState<BackOfficeApplication[]>(BACKOFFICE_APPLICATIONS);
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApp, setSelectedApp] = useState<BackOfficeApplication | null>(
    BACKOFFICE_APPLICATIONS[0] || null
  );

  const reloadSubmissions = () => {
    const fresh = getUserVideoSubmissions();
    setSubmissions(fresh);
    if (selectedSubmission) {
      const updatedSelected = fresh.find(s => s.id === selectedSubmission.id);
      if (updatedSelected) setSelectedSubmission(updatedSelected);
    }
  };

  const handleUpdateSubmissionStatus = (id: string, status: 'APPROVED' | 'REJECTED' | 'PENDING', reason?: string) => {
    updateVideoSubmissionStatus(id, status, reason);
    reloadSubmissions();
    setFeedbackPrompt(null);
  };

  const pendingSubmissionsCount = submissions.filter(s => s.status === 'PENDING').length;

  const filteredSubmissions = submissions.filter(item => {
    const matchFilter = submissionFilter === 'ALL' || item.status === submissionFilter;
    const matchQuery = 
      item.title.toLowerCase().includes(submissionSearch.toLowerCase()) ||
      item.authorName.toLowerCase().includes(submissionSearch.toLowerCase()) ||
      item.universe.toLowerCase().includes(submissionSearch.toLowerCase());
    return matchFilter && matchQuery;
  });

  const filterTabs: { id: FilterStatus; label: string; count?: number }[] = [
    { id: 'ALL', label: 'Toutes', count: applications.length },
    { id: 'NOUVELLES', label: 'Nouvelles', count: applications.filter(a => a.status === 'NOUVELLES').length },
    { id: 'CONTROLE_TECHNIQUE', label: 'Contrôle Technique', count: applications.filter(a => a.status === 'CONTROLE_TECHNIQUE').length },
    { id: 'AVIS_FORET', label: 'Avis Forêt', count: applications.filter(a => a.status === 'AVIS_FORET').length },
    { id: 'COMITE', label: 'Comité', count: applications.filter(a => a.status === 'COMITE').length },
    { id: 'REVISIONS', label: 'Révisions', count: applications.filter(a => a.status === 'REVISIONS').length },
    { id: 'APPROUVEES', label: 'Approuvées', count: applications.filter(a => a.status === 'APPROUVEES').length },
    { id: 'PUBLIEES', label: 'Publiées', count: applications.filter(a => a.status === 'PUBLIEES').length },
  ];

  const filteredApps = applications.filter(app => {
    const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;
    const matchesSearch = 
      app.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.documentaryTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.territory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.universeGroup.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleUpdateStatus = (appId: string, newStatus: BackOfficeApplication['status']) => {
    setApplications(prev => prev.map(item => {
      if (item.id === appId) {
        return { ...item, status: newStatus };
      }
      return item;
    }));
    if (selectedApp && selectedApp.id === appId) {
      setSelectedApp(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const getStatusBadge = (status: BackOfficeApplication['status']) => {
    switch (status) {
      case 'NOUVELLES':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">Nouvelle</span>;
      case 'CONTROLE_TECHNIQUE':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">Contrôle tech.</span>;
      case 'AVIS_FORET':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Avis Forêt</span>;
      case 'COMITE':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">Comité</span>;
      case 'REVISIONS':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">Révision</span>;
      case 'APPROUVEES':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-green-50 text-green-700 border border-green-200">Approuvée</span>;
      case 'PUBLIEES':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-stone-900 text-stone-100 border border-stone-800">Publiée</span>;
    }
  };

  const getTechStatusBadge = (techStatus: BackOfficeApplication['technicalStatus']) => {
    switch (techStatus) {
      case 'VALIDE':
        return <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium"><CheckCircle2 className="w-3.5 h-3.5" /> Conforme</span>;
      case 'EN_ATTENTE':
        return <span className="inline-flex items-center gap-1 text-[11px] text-amber-600 font-medium"><Clock className="w-3.5 h-3.5" /> En cours</span>;
      case 'REVISION_REQUISE':
        return <span className="inline-flex items-center gap-1 text-[11px] text-rose-600 font-medium"><AlertCircle className="w-3.5 h-3.5" /> À corriger</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <button
          onClick={() => onNavigate({ type: 'home' })}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#A2482B] hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à l'exploration</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate({ type: 'review_system' })}
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors"
          >
            Avis de la Forêt (Pairs)
          </button>
          <button
            onClick={() => onNavigate({ type: 'site_map' })}
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#C89B3C]/15 text-[#8B6845] hover:bg-[#C89B3C]/25 transition-colors"
          >
            Plan du réseau
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#A2482B]/10 text-[#A2482B] text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Comité Éditorial & Direction des Publications</span>
        </div>
        <h1 className="font-editorial text-2xl sm:text-3xl font-normal text-stone-900">
          Modération & Validation Éditoriale YonyWood
        </h1>
        <p className="text-sm text-stone-600 max-w-3xl leading-relaxed">
          Toutes les vidéos soumises par les individus et organisations (entreprises, associations de l’onglet Lumière)
          sont soumises à la validation éditoriale de Roméo Nonvide et du comité avant diffusion publique sur le réseau.
        </p>

        {/* Navigation Section Switcher */}
        <div className="flex items-center gap-3 pt-4 border-t border-stone-100">
          <button
            onClick={() => setActiveSection('submissions')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeSection === 'submissions'
                ? 'bg-[#A2482B] text-white shadow-sm'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <Film className="w-4 h-4" />
            <span>Vidéos des Membres & Entreprises</span>
            {pendingSubmissionsCount > 0 && (
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                activeSection === 'submissions' ? 'bg-white/20 text-white' : 'bg-[#A2482B] text-white'
              }`}>
                {pendingSubmissionsCount} en attente
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveSection('applications')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeSection === 'applications'
                ? 'bg-[#1C1917] text-white shadow-sm'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Dossiers Candidatures ({applications.length})</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1 : SOUMISSIONS VIDÉOS DES MEMBRES & ENTREPRISES                  */}
      {/* ========================================================================= */}
      {activeSection === 'submissions' && (
        <div className="space-y-6">
          {/* Recherche & Filtres */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:max-w-md">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={submissionSearch}
                onChange={(e) => setSubmissionSearch(e.target.value)}
                placeholder="Rechercher par titre, auteur, entreprise..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-stone-200 rounded-2xl focus:outline-none focus:border-[#A2482B] focus:ring-1 focus:ring-[#A2482B]"
              />
            </div>

            <div className="flex items-center gap-2">
              {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setSubmissionFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    submissionFilter === st
                      ? 'bg-stone-900 text-white'
                      : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  {st === 'ALL' && `Toutes (${submissions.length})`}
                  {st === 'PENDING' && `🟡 En attente (${submissions.filter(s => s.status === 'PENDING').length})`}
                  {st === 'APPROVED' && `🟢 Validées (${submissions.filter(s => s.status === 'APPROVED').length})`}
                  {st === 'REJECTED' && `🔴 Retouches (${submissions.filter(s => s.status === 'REJECTED').length})`}
                </button>
              ))}
            </div>
          </div>

          {/* Grille Liste + Détail */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Liste (7 colonnes) */}
            <div className="lg:col-span-7 space-y-3">
              {filteredSubmissions.length === 0 ? (
                <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center text-stone-500 text-sm">
                  Aucune soumission vidéo ne correspond à ce critère.
                </div>
              ) : (
                filteredSubmissions.map((sub) => (
                  <div
                    key={sub.id}
                    onClick={() => setSelectedSubmission(sub)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer bg-white flex items-center justify-between gap-4 ${
                      selectedSubmission?.id === sub.id
                        ? 'border-[#A2482B] ring-2 ring-[#A2482B]/10 shadow-sm'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-black shrink-0 border border-stone-200">
                        <img
                          src={sub.thumbnailUrl || '/assets/images/selfie_video_story.jpg'}
                          alt={sub.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <Play className="w-4 h-4 text-white fill-white" />
                        </div>
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-bold text-stone-900 truncate">
                            {sub.title}
                          </h3>
                          {sub.userType === 'ORGANIZATION' ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                              <Building2 className="w-3 h-3" /> Organisation
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-100 text-stone-700">
                              <User className="w-3 h-3" /> Individu
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-stone-600 truncate mt-0.5">
                          Par <span className="font-semibold text-stone-800">{sub.authorName}</span> • {sub.universe}
                        </div>

                        <div className="text-[11px] text-stone-400 mt-1 flex items-center gap-2">
                          <span>Déposée le {sub.createdAt}</span>
                          <span>•</span>
                          {sub.status === 'PENDING' && (
                            <span className="text-amber-700 font-semibold">🟡 En attente de validation</span>
                          )}
                          {sub.status === 'APPROVED' && (
                            <span className="text-emerald-700 font-semibold">🟢 Validée pour diffusion</span>
                          )}
                          {sub.status === 'REJECTED' && (
                            <span className="text-rose-700 font-semibold">🔴 Retouche demandée</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-stone-400 shrink-0" />
                  </div>
                ))
              )}
            </div>

            {/* Panneau Détail (5 colonnes) */}
            <div className="lg:col-span-5">
              {selectedSubmission ? (
                <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-5 sticky top-6">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <span className="text-xs font-bold text-[#A2482B] uppercase tracking-wider">
                      Soumission #{selectedSubmission.id}
                    </span>
                    {selectedSubmission.status === 'PENDING' && (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                        🟡 En examen éditorial
                      </span>
                    )}
                    {selectedSubmission.status === 'APPROVED' && (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                        🟢 Validée & En ligne
                      </span>
                    )}
                    {selectedSubmission.status === 'REJECTED' && (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-900 border border-rose-300">
                        🔴 Retouche demandée
                      </span>
                    )}
                  </div>

                  {/* Vidéo / Aperçu */}
                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-black shadow-inner">
                    <video
                      src={selectedSubmission.videoUrl}
                      poster={selectedSubmission.thumbnailUrl}
                      controls
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <h2 className="text-base font-bold text-stone-900">
                      {selectedSubmission.title}
                    </h2>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                      {selectedSubmission.synopsis}
                    </p>
                  </div>

                  {/* Métadonnées de l'auteur */}
                  <div className="bg-stone-50 rounded-2xl p-4 space-y-2 text-xs text-stone-700 border border-stone-200/70">
                    <div className="flex justify-between items-center">
                      <span className="text-stone-500">Auteur :</span>
                      <span className="font-bold text-stone-900">{selectedSubmission.authorName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-stone-500">Statut du compte :</span>
                      <span className="font-semibold text-stone-800">
                        {selectedSubmission.userType === 'ORGANIZATION' ? '🏛️ Organisation (Lumière / Entreprise)' : '👤 Individu'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-stone-500">Porte / Thématique :</span>
                      <span className="font-semibold text-stone-800">{selectedSubmission.universe}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-stone-500">Date de dépôt :</span>
                      <span className="font-medium text-stone-700">{selectedSubmission.createdAt}</span>
                    </div>
                    {selectedSubmission.rejectionReason && (
                      <div className="pt-2 border-t border-stone-200 text-rose-700">
                        <span className="font-bold">Motif de retouche : </span>
                        <span>{selectedSubmission.rejectionReason}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions de validation éditoriale par Roméo */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                      Décision éditoriale de Roméo Nonvide
                    </h4>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleUpdateSubmissionStatus(selectedSubmission.id, 'APPROVED')}
                        className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                      >
                        <Check className="w-4 h-4" />
                        <span>Valider diffusion</span>
                      </button>

                      <button
                        onClick={() => {
                          const reason = prompt('Indiquez au créateur le motif ou les retouches souhaitées :') || 'Retouches sur le cadrage ou l’audio requises avant diffusion.';
                          handleUpdateSubmissionStatus(selectedSubmission.id, 'REJECTED', reason);
                        }}
                        className="py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                        <span>Demander retouche</span>
                      </button>
                    </div>

                    <button
                      onClick={() => handleUpdateSubmissionStatus(selectedSubmission.id, 'PENDING')}
                      className="w-full py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Remettre en examen éditorial</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-3xl border border-stone-200 p-8 text-center text-stone-500 text-sm">
                  Sélectionnez une vidéo pour l'examiner et la valider.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2 : PIPELINE OFFICIEL DES DOSSIERS DE CANDIDATURES                */}
      {/* ========================================================================= */}
      {activeSection === 'applications' && (
        <div className="space-y-6">
          {/* Search & Filters */}
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:max-w-md">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher par candidat, série, univers, territoire..."
                  className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-stone-200 rounded-2xl focus:outline-none focus:border-[#C89B3C] focus:ring-1 focus:ring-[#C89B3C]"
                />
              </div>

              <div className="text-xs text-stone-500 font-medium">
                {filteredApps.length} dossier{filteredApps.length > 1 ? 's' : ''} affiché{filteredApps.length > 1 ? 's' : ''}
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {filterTabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer ${
                    statusFilter === tab.id
                      ? 'bg-stone-900 text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  <span>{tab.label}</span>
                  {typeof tab.count === 'number' && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      statusFilter === tab.id ? 'bg-stone-800 text-stone-200' : 'bg-stone-200 text-stone-700'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Main Grid: List + Detail */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Applications List (7 cols) */}
            <div className="lg:col-span-7 space-y-3">
              {filteredApps.length === 0 ? (
                <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center text-stone-500 text-sm">
                  Aucun dossier ne correspond à vos critères de recherche.
                </div>
              ) : (
                filteredApps.map(app => (
                  <div
                    key={app.id}
                    onClick={() => setSelectedApp(app)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer bg-white flex items-center justify-between gap-4 ${
                      selectedApp?.id === app.id
                        ? 'border-[#C89B3C] ring-2 ring-[#C89B3C]/10 shadow-xs'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <img
                        src={app.candidatePhoto}
                        alt={app.candidateName}
                        className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-bold text-stone-900 truncate">
                            {app.candidateName}
                          </h3>
                          {getStatusBadge(app.status)}
                        </div>
                        <div className="text-xs text-stone-500 truncate mt-0.5">
                          {app.documentaryTitle} • <span className="font-medium text-stone-700">{app.universeGroup}</span>
                        </div>
                        <div className="text-[11px] text-stone-400 mt-1 flex items-center gap-3">
                          <span>{app.territory}</span>
                          <span>•</span>
                          <span>{app.submittedDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      <div className="hidden sm:block text-right">
                        <div className="text-xs font-semibold text-stone-700">{app.videoDuration}</div>
                        <div>{getTechStatusBadge(app.technicalStatus)}</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-stone-400" />
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Detail Panel (5 cols) */}
            <div className="lg:col-span-5">
              {selectedApp ? (
                <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-card space-y-6 sticky top-6">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                    <span className="text-xs font-bold text-[#C89B3C] uppercase tracking-wider">
                      Dossier #{selectedApp.id}
                    </span>
                    <div>{getStatusBadge(selectedApp.status)}</div>
                  </div>

                  {/* Candidate Info */}
                  <div className="flex items-center gap-4">
                    <img
                      src={selectedApp.candidatePhoto}
                      alt={selectedApp.candidateName}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-[#C89B3C]/20 shadow-xs"
                    />
                    <div>
                      <h2 className="text-lg font-bold text-stone-900">{selectedApp.candidateName}</h2>
                      <p className="text-xs text-stone-600">{selectedApp.territory}</p>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-800 text-[11px] font-medium mt-1">
                        <span>{selectedApp.universeGroup}</span>
                      </div>
                    </div>
                  </div>

                  {/* Meta details */}
                  <div className="bg-stone-50 rounded-2xl p-4 space-y-2.5 text-xs text-stone-700">
                    <div className="flex justify-between">
                      <span className="text-stone-500">Série rattachée :</span>
                      <span className="font-semibold text-stone-900">{selectedApp.documentaryTitle}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Date de soumission :</span>
                      <span className="font-medium text-stone-800">{selectedApp.submittedDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Réviseur assigné :</span>
                      <span className="font-medium text-stone-800">{selectedApp.assignedReviewer}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Durée du master :</span>
                      <span className="font-medium text-stone-800">{selectedApp.videoDuration}</span>
                    </div>
                    <div className="flex justify-between items-center pt-1 border-t border-stone-200/60">
                      <span className="text-stone-500">Contrôle technique :</span>
                      <div>{getTechStatusBadge(selectedApp.technicalStatus)}</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2.5 pt-2">
                    <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                      Décision éditoriale
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleUpdateStatus(selectedApp.id, 'APPROUVEES')}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                        <span>Approuver</span>
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(selectedApp.id, 'REVISIONS')}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                        <span>Demander révision</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleUpdateStatus(selectedApp.id, 'AVIS_FORET')}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium transition-colors cursor-pointer"
                      >
                        <span>Passer aux Pairs</span>
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(selectedApp.id, 'PUBLIEES')}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium transition-colors cursor-pointer"
                      >
                        <span>Publier au Duo</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-3xl border border-stone-200 p-8 text-center text-stone-500 text-sm">
                  Sélectionnez une candidature pour afficher les détails.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
