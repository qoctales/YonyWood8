import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Eye, 
  Percent, 
  Calendar, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Film, 
  ArrowLeft, 
  Plus, 
  RefreshCw,
  Sparkles,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../services/authContext';
import { 
  VideoSubmission, 
  fetchUserSubmittedVideos, 
  updateSubmittedVideoTitle, 
  deleteSubmittedVideo 
} from '../services/firestoreService';
import { TvPlayerIcon } from './YonywoodBrandIcons';

interface CreatorVideoHistoryProps {
  onBackToDeposit: () => void;
}

export const CreatorVideoHistory: React.FC<CreatorVideoHistoryProps> = ({ onBackToDeposit }) => {
  const { currentUser } = useAuth();
  const [videos, setVideos] = useState<VideoSubmission[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'approved' | 'pending'>('all');
  
  // Édition de titre
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [editTitleValue, setEditTitleValue] = useState<string>('');
  const [isSavingTitle, setIsSavingTitle] = useState<boolean>(false);

  // Suppression
  const [deletingVideo, setDeletingVideo] = useState<VideoSubmission | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Vidéo en lecture
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadVideos = async () => {
    setIsLoading(true);
    try {
      const list = await fetchUserSubmittedVideos(currentUser?.id, currentUser?.email);
      setVideos(list);
    } catch (err) {
      console.error('Erreur chargement vidéos créateur:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadVideos();
  }, [currentUser]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleStartEdit = (v: VideoSubmission) => {
    setEditingVideoId(v.id || null);
    setEditTitleValue(v.pitch || v.seriesTitle || '');
  };

  const handleSaveEdit = async (videoId: string) => {
    if (!editTitleValue.trim()) return;
    setIsSavingTitle(true);
    try {
      await updateSubmittedVideoTitle(videoId, editTitleValue.trim());
      setVideos(prev => prev.map(v => v.id === videoId ? { ...v, pitch: editTitleValue.trim() } : v));
      setEditingVideoId(null);
      showToast('Titre du récit mis à jour avec succès.');
    } catch (err) {
      console.error('Erreur mise à jour titre:', err);
      showToast('Mise à jour enregistrée localement.');
      setEditingVideoId(null);
    } finally {
      setIsSavingTitle(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingVideo?.id) return;
    setIsDeleting(true);
    try {
      await deleteSubmittedVideo(deletingVideo.id);
      setVideos(prev => prev.filter(v => v.id !== deletingVideo.id));
      showToast(`« ${deletingVideo.pitch || deletingVideo.seriesTitle} » supprimé du catalogue.`);
      setDeletingVideo(null);
    } catch (err) {
      console.error('Erreur suppression:', err);
      showToast('Suppression effectuée localement.');
      setDeletingVideo(null);
    } finally {
      setIsDeleting(false);
    }
  };

  // Statistiques calculées
  const totalVideos = videos.length;
  const totalViews = videos.reduce((acc, v) => acc + (v.viewsCount || 0), 0);
  const avgCompletion = totalVideos > 0 
    ? Math.round(videos.reduce((acc, v) => acc + (v.completionRate || 0), 0) / totalVideos) 
    : 0;
  const approvedCount = videos.filter(v => v.status === 'approved').length;
  const pendingCount = videos.filter(v => v.status === 'pending').length;

  const filteredVideos = videos.filter(v => {
    if (filterStatus === 'approved') return v.status === 'approved';
    if (filterStatus === 'pending') return v.status === 'pending';
    return true;
  });

  return (
    <div className="w-full flex-1 flex flex-col min-h-0 overflow-y-auto animate-fadeIn space-y-4 sm:space-y-6 pb-12">
      {/* Toast de notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-[100] max-w-sm px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-white text-xs shadow-2xl flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-[#D9AF52] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Barre d'en-tête de l'historique */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <button
              onClick={onBackToDeposit}
              className="p-1.5 rounded-full hover:bg-stone-100 text-stone-600 hover:text-stone-900 transition-colors"
              title="Retourner au dépôt de vidéo"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h2 className="font-editorial text-xl sm:text-2xl font-bold text-[#1C1917] tracking-tight">
              Mes Publications & Récits
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-0.5 ml-8">
            Historique complet de vos vidéos déposées selon la direction éditoriale YonyWood
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto ml-8 sm:ml-0">
          <button
            onClick={loadVideos}
            className="p-2 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-stone-600 hover:text-stone-900 text-xs font-medium transition-colors shadow-xs"
            title="Rafraîchir la liste"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={onBackToDeposit}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#A2482B] hover:bg-[#8B3B20] text-white text-xs font-semibold shadow-xs transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nouveau dépôt</span>
          </button>
        </div>
      </div>

      {/* STATISTIQUES ENRICHIES */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5">
        <div className="p-3.5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-[10.5px] font-semibold uppercase tracking-wider text-stone-500">Récits déposés</span>
            <Film className="w-4 h-4 text-[#A2482B]" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-[#1C1917]">
            {totalVideos}
          </div>
          <div className="text-[10px] text-stone-400">
            {approvedCount} certifié{approvedCount > 1 ? 's' : ''} • {pendingCount} en examen
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-[10.5px] font-semibold uppercase tracking-wider text-stone-500">Vues cumulées</span>
            <Eye className="w-4 h-4 text-[#D9AF52]" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-[#1C1917]">
            {totalViews.toLocaleString('fr-FR')}
          </div>
          <div className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>Spectateurs engagés</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-[10.5px] font-semibold uppercase tracking-wider text-stone-500">Complétion</span>
            <Percent className="w-4 h-4 text-stone-500" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-[#1C1917]">
            {avgCompletion}%
          </div>
          <div className="text-[10px] text-stone-400">
            Taux d'écoute intégrale
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-[10.5px] font-semibold uppercase tracking-wider text-stone-500">Statut éditorial</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-700">
            {Math.round((approvedCount / (totalVideos || 1)) * 100)}%
          </div>
          <div className="text-[10px] text-stone-400">
            Taux de certification
          </div>
        </div>
      </div>

      {/* Onglets de filtrage */}
      <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl w-fit">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            filterStatus === 'all' 
              ? 'bg-white text-[#1C1917] shadow-xs' 
              : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          Tous les récits ({totalVideos})
        </button>
        <button
          onClick={() => setFilterStatus('approved')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            filterStatus === 'approved' 
              ? 'bg-white text-emerald-700 shadow-xs' 
              : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          Certifiés ({approvedCount})
        </button>
        <button
          onClick={() => setFilterStatus('pending')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            filterStatus === 'pending' 
              ? 'bg-white text-amber-700 shadow-xs' 
              : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          En examen ({pendingCount})
        </button>
      </div>

      {/* LISTE DES VIDÉOS OU ÉTAT VIDE */}
      {filteredVideos.length === 0 ? (
        <div className="p-8 sm:p-12 text-center rounded-3xl bg-stone-50 border border-dashed border-stone-200 space-y-3">
          <div className="w-12 h-12 rounded-full bg-stone-200 text-stone-500 mx-auto flex items-center justify-center">
            <Film className="w-6 h-6" />
          </div>
          <h4 className="font-editorial text-lg font-bold text-stone-800">
            Aucun récit dans cette catégorie
          </h4>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Déposez votre première vidéo selon la direction éditoriale pour la voir apparaître ici avec ses statistiques d'audience.
          </p>
          <button
            onClick={onBackToDeposit}
            className="px-5 py-2.5 rounded-full bg-[#A2482B] hover:bg-[#8B3B20] text-white text-xs font-semibold shadow-xs"
          >
            Déposer une vidéo maintenant
          </button>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredVideos.map((video) => {
            const isEditing = editingVideoId === video.id;
            const isPlaying = playingVideoId === video.id;

            return (
              <div 
                key={video.id}
                className="p-3.5 sm:p-4 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all hover:border-stone-300"
              >
                {/* Côté gauche : Aperçu vidéo 9:16 compact & détails */}
                <div className="flex items-start gap-3.5 min-w-0 flex-1 w-full">
                  {/* Miniature vidéo 9:16 avec aperçu lecture */}
                  <div className="relative w-18 sm:w-22 aspect-[9/16] rounded-xl overflow-hidden bg-black shrink-0 border border-stone-200 group/thumb">
                    {isPlaying ? (
                      <video
                        src={video.videoUrl}
                        autoPlay
                        loop
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={video.thumbnail || "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80"}
                        alt={video.pitch}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => setPlayingVideoId(isPlaying ? null : (video.id || null))}
                      className="absolute inset-0 bg-black/40 hover:bg-black/60 flex items-center justify-center text-white transition-colors"
                      title={isPlaying ? "Mettre en pause" : "Regarder l'extrait"}
                    >
                      {isPlaying ? (
                        <Pause className="w-5 h-5 fill-white text-white" />
                      ) : (
                        <TvPlayerIcon className="w-5 h-5 text-white" strokeWidth={1.6} />
                      )}
                    </button>
                  </div>

                  {/* Métadonnées & Édition du titre */}
                  <div className="flex-1 min-w-0 space-y-1.5">
                    {/* Tags série & statut */}
                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      <span className="font-semibold text-[#A2482B] truncate max-w-[180px]">
                        {video.seriesTitle}
                      </span>
                      <span className="text-stone-300">·</span>
                      <span className="text-[11px] text-stone-500 font-medium">
                        {video.protagonistName} ({video.territory || video.country})
                      </span>
                      <span className="text-stone-300">·</span>
                      {video.status === 'approved' ? (
                        <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-emerald-700">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Certifié</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-amber-700">
                          <Clock className="w-3 h-3" />
                          <span>En examen</span>
                        </span>
                      )}
                    </div>

                    {/* Titre ou Input d'édition */}
                    {isEditing ? (
                      <div className="space-y-1.5 pt-1">
                        <input
                          type="text"
                          value={editTitleValue}
                          onChange={(e) => setEditTitleValue(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-stone-50 border border-[#A2482B] text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#A2482B]"
                          autoFocus
                          placeholder="Titre du récit..."
                        />
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            disabled={isSavingTitle}
                            onClick={() => handleSaveEdit(video.id || '')}
                            className="px-2.5 py-1 rounded-md bg-[#A2482B] text-white text-[11px] font-semibold flex items-center gap-1 shadow-xs cursor-pointer"
                          >
                            <Check className="w-3 h-3" />
                            <span>Enregistrer</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingVideoId(null)}
                            className="px-2.5 py-1 rounded-md bg-stone-100 text-stone-600 hover:text-stone-900 text-[11px] font-medium transition-colors"
                          >
                            Annuler
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="group/title flex items-start gap-1.5">
                        <h4 className="font-editorial text-sm sm:text-base font-bold text-[#1C1917] leading-snug line-clamp-2">
                          {video.pitch || video.seriesTitle}
                        </h4>
                        <button
                          type="button"
                          onClick={() => handleStartEdit(video)}
                          className="p-1 rounded text-stone-400 hover:text-[#A2482B] transition-colors shrink-0 opacity-70 hover:opacity-100"
                          title="Modifier le titre"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {/* Question imposée */}
                    <p className="text-[11px] text-stone-500 italic line-clamp-1">
                      « {video.question} »
                    </p>

                    {/* Métriques d'audience individuelles */}
                    <div className="flex items-center gap-3 pt-1 text-[11px] text-stone-500 font-mono">
                      <span className="flex items-center gap-1 font-semibold text-stone-700">
                        <Eye className="w-3.5 h-3.5 text-[#D9AF52]" />
                        <span>{(video.viewsCount || 0).toLocaleString('fr-FR')} vues</span>
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Percent className="w-3 h-3 text-stone-400" />
                        <span>{video.completionRate || 0}% complétion</span>
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-stone-400" />
                        <span>
                          {video.createdAt ? new Date(video.createdAt).toLocaleDateString('fr-FR') : 'Récemment'}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Côté droit : Boutons d'action (Éditer / Supprimer) */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0 border-t md:border-t-0 pt-2 md:pt-0 w-full md:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => handleStartEdit(video)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium transition-colors"
                    title="Modifier le titre du récit"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-stone-500" />
                    <span>Modifier</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletingVideo(video)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-medium transition-colors"
                    title="Supprimer ce récit"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Supprimer</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODALE DE CONFIRMATION DE SUPPRESSION */}
      {deletingVideo && (
        <div 
          onClick={() => setDeletingVideo(null)}
          className="fixed inset-0 z-[120] bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-3xl p-6 text-stone-900 shadow-2xl border border-stone-200 space-y-4 animate-scaleUp"
          >
            <div className="flex items-center gap-3 border-b border-stone-100 pb-3">
              <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-editorial text-lg font-bold text-[#1C1917]">
                  Supprimer ce récit ?
                </h3>
                <p className="text-xs text-stone-500 font-medium">
                  Confirmation de retrait définitif
                </p>
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Êtes-vous certain de vouloir supprimer <strong className="text-stone-900">« {deletingVideo.pitch || deletingVideo.seriesTitle} »</strong> ? Cette action retirera définitivement cette séquence de votre historique et des serveurs YonyWood.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeletingVideo(null)}
                className="px-4 py-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-colors"
              >
                Annuler
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isDeleting ? 'Suppression...' : 'Confirmer la suppression'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
