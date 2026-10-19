import React, { useState, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Pause, 
  Volume2, 
  VolumeX, 
  X, 
  CheckCircle2, 
  MessageCircle, 
  ArrowRight,
  Sparkles,
  Building2,
  Handshake
} from 'lucide-react';
import { ViewScreen } from '../types';
import { db } from '../services/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { TvPlayerIcon } from './YonywoodBrandIcons';

interface ParticipateScreenProps {
  onNavigate: (screen: ViewScreen) => void;
  initialRole?: 'effigie' | 'coproducteur' | 'entreprise' | 'partenaire';
  preselectedSeriesId?: string;
}

interface ParticipateCard {
  id: 'egerie' | 'coproduction' | 'entreprise' | 'partenaire';
  title: string;
  photoUrl: string;
  videoUrl: string;
}

const CARDS_DATA: ParticipateCard[] = [
  {
    id: 'egerie',
    title: 'Devenir égérie',
    photoUrl: '/assets/directions/personnalites-cinema.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
  },
  {
    id: 'coproduction',
    title: 'Coproduction',
    photoUrl: '/assets/directions/projets-communautaire.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
  },
  {
    id: 'entreprise',
    title: 'Entreprises',
    photoUrl: '/assets/directions/marques-tech.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4'
  },
  {
    id: 'partenaire',
    title: 'Partenaires',
    photoUrl: '/assets/directions/projets-innovation.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'
  }
];

export const ParticipateScreen: React.FC<ParticipateScreenProps> = ({ 
  initialRole = 'coproducteur'
}) => {
  // Navigation entre les 4 cartes (0: égérie, 1: coproduction, 2: entreprise, 3: partenaire)
  const initialIndex = initialRole === 'effigie' 
    ? 0 
    : initialRole === 'entreprise' 
      ? 2 
      : initialRole === 'partenaire'
        ? 3
        : 1;
  const [currentIndex, setCurrentIndex] = useState<number>(initialIndex);
  
  // Lecture / Pause (AUCUN DÉCLENCHEMENT AUTOMATIQUE - Clic requis sur le lecteur)
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Swipe tactile
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);

  // Modal d'inscription
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Champs du formulaire (allégé, sans audio ni vidéo)
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    phoneWhatsApp: '',
    email: '',
    nomEntreprise: '',
    domaineActivite: '',
    nomOrganisation: '',
    domainePartenariat: '',
    raison: ''
  });

  const currentCard = CARDS_DATA[currentIndex];

  // Navigation précédente / suivante (arrête la lecture automatique)
  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsPlaying(false);
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : CARDS_DATA.length - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsPlaying(false);
    setCurrentIndex(prev => (prev < CARDS_DATA.length - 1 ? prev + 1 : 0));
  };

  // Gestion swipe tactile horizontal
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStartXRef.current || !touchEndXRef.current) return;
    const diff = touchStartXRef.current - touchEndXRef.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (db) {
        await addDoc(collection(db, 'participations'), {
          cardId: currentCard.id,
          cardTitle: currentCard.title,
          prenom: formData.prenom.trim(),
          nom: formData.nom.trim(),
          phoneWhatsApp: formData.phoneWhatsApp.trim(),
          email: formData.email.trim() || null,
          nomEntreprise: currentCard.id === 'entreprise' ? formData.nomEntreprise.trim() : null,
          domaineActivite: currentCard.id === 'entreprise' ? formData.domaineActivite.trim() : null,
          nomOrganisation: currentCard.id === 'partenaire' ? formData.nomOrganisation.trim() : null,
          domainePartenariat: currentCard.id === 'partenaire' ? formData.domainePartenariat.trim() : null,
          raison: formData.raison.trim(),
          createdAt: serverTimestamp()
        });
      }
    } catch (err) {
      console.warn('Enregistrement local de secours :', err);
    }

    try {
      const existing = JSON.parse(localStorage.getItem('yonywood_participations') || '[]');
      existing.push({
        cardId: currentCard.id,
        cardTitle: currentCard.title,
        ...formData,
        date: new Date().toISOString()
      });
      localStorage.setItem('yonywood_participations', JSON.stringify(existing));
    } catch {
      // Ignorer
    }

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const shareOnWhatsApp = () => {
    let details = '';
    if (currentCard.id === 'entreprise' && formData.nomEntreprise) {
      details = `\nEntreprise : ${formData.nomEntreprise} (${formData.domaineActivite})`;
    } else if (currentCard.id === 'partenaire' && formData.nomOrganisation) {
      details = `\nOrganisation : ${formData.nomOrganisation} (${formData.domainePartenariat})`;
    }

    const text = encodeURIComponent(
      `Bonjour, je viens de m'inscrire pour « ${currentCard.title} » sur Yonywood !\nNom : ${formData.prenom} ${formData.nom}${details}\nWhatsApp : ${formData.phoneWhatsApp}\nOn est ensemble ! 🎬`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const isFormValid = () => {
    if (!formData.nom.trim() || !formData.prenom.trim() || !formData.phoneWhatsApp.trim()) return false;
    if (currentCard.id === 'entreprise' && (!formData.nomEntreprise.trim() || !formData.domaineActivite.trim())) return false;
    if (currentCard.id === 'partenaire' && (!formData.nomOrganisation.trim() || !formData.domainePartenariat.trim())) return false;
    return true;
  };

  return (
    <div 
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className="w-full max-w-4xl mx-auto px-4 py-3 pb-18 sm:pb-20 pt-safe pb-safe h-[calc(100dvh-56px)] max-h-[calc(100dvh-56px)] overflow-hidden flex flex-col justify-between text-[#1C1917] select-none"
    >
      {/* ========================================================= */}
      {/* LIGNE DU HAUT : TITRE AVEC TIRET ROUGE (SANS 1/3, 2/3, 3/3) */}
      {/* Exactement comme sur les pages Studio / Héritage          */}
      {/* ========================================================= */}
      <div className="flex items-center justify-between h-9 sm:h-10 shrink-0 mb-1">
        <div className="relative flex items-center h-full">
          <h1 className="font-editorial text-base sm:text-lg font-bold text-[#1C1917] tracking-tight leading-none">
            {currentCard.title}
          </h1>
          {/* Petit trait terracotta officiel */}
          <div className="absolute left-0 -bottom-1.5 w-8 h-0.5 bg-[#A2482B] rounded-full" />
        </div>
      </div>

      {/* ========================================================= */}
      {/* ZONE CENTRALE : CARTE VIDÉO & FLÈCHES GAUCHE/DROITE       */}
      {/* ========================================================= */}
      <div className="relative flex-1 flex items-center justify-center px-4 w-full min-h-0 select-none overflow-hidden">
        
        {/* Flèche gauche */}
        <button
          onClick={handlePrev}
          className="absolute left-1 sm:left-3 md:left-6 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white text-stone-800 hover:bg-[#A2482B] hover:text-white border border-stone-200 shadow-md flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
          title="Précédent"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* CARTE VIDÉO 9:16 : MÊME TAILLE EXACTE QUE SUR HÉRITAGE / STUDIO */}
        <div 
          onClick={() => {
            setIsPlaying(!isPlaying);
          }}
          className="h-[min(490px,calc(100dvh-210px))] sm:h-[min(540px,calc(100dvh-190px))] lg:h-[min(570px,calc(100dvh-180px))] aspect-[9/16] w-auto mx-auto rounded-3xl overflow-hidden bg-stone-950 text-white shadow-2xl border border-stone-200/40 relative flex flex-col justify-between p-4 sm:p-5 cursor-pointer group select-none shrink-0"
        >
          {/* Média de fond : Vidéo (clic requis) ou Photo (AUCUN TEXTE SUR LA CARTE) */}
          {isPlaying ? (
            <video
              ref={videoRef}
              src={currentCard.videoUrl}
              autoPlay
              loop
              playsInline
              muted={isMuted}
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />
          ) : (
            <img
              src={currentCard.photoUrl}
              alt={currentCard.title}
              className="absolute inset-0 w-full h-full object-cover pointer-events-none group-hover:scale-103 transition-transform duration-500 ease-out"
            />
          )}

          {/* Dégradé léger cinématique sans texte */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/35 pointer-events-none" />

          {/* =========================================================== */}
          {/* HAUT DROITE : BOUTON PRÉCIS DE LECTURE VIDÉO               */}
          {/* Exactement le même que sur les pages Héritage / Studio      */}
          {/* =========================================================== */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsPlaying(prev => !prev);
            }}
            className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-30 w-8.5 h-8.5 sm:w-9.5 sm:h-9.5 rounded-lg sm:rounded-xl bg-black/45 hover:bg-[#A2482B] backdrop-blur-md border border-white/20 hover:border-[#A2482B] flex items-center justify-center text-white transition-all duration-200 shadow-md cursor-pointer hover:scale-105 active:scale-95 shrink-0 pointer-events-auto"
            title={isPlaying ? "Mettre en pause" : "Regarder la vidéo"}
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white text-white" />
            ) : (
              <TvPlayerIcon className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-white transition-transform" strokeWidth={1.6} />
            )}
          </button>

          {/* Spacer central */}
          <div className="my-auto" />

          {/* =========================================================== */}
          {/* BAS DE LA CARTE : BOUTON « PARTICIPER » & MUTE (SI LECTURE) */}
          {/* Même style graphique que « Choisir cette porte »             */}
          {/* =========================================================== */}
          <div className="relative z-20 flex items-center justify-between w-full pt-1 pointer-events-auto">
            {/* Bouton Participer */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsFormOpen(true);
                setIsSubmitted(false);
              }}
              id={`btn-participate-${currentCard.id}`}
              className="h-7.5 sm:h-8.5 px-3.5 sm:px-4 rounded-full bg-black/60 hover:bg-[#A2482B] active:bg-[#8A3B22] text-white text-[11px] sm:text-xs font-bold backdrop-blur-md transition-all flex items-center gap-1.5 shadow-md border border-white/20 hover:border-[#A2482B] cursor-pointer active:scale-95 group/btn shrink-0"
              title="Participer et ouvrir le formulaire"
            >
              <span>Participer</span>
              <ArrowRight className="w-3.5 h-3.5 text-white/90 group-hover/btn:translate-x-0.5 transition-transform shrink-0" />
            </button>

            {/* Icône Son / Mute : N'APPARAÎT QUE LORSQU'ON A CLIQUÉ SUR LE BOUTON LECTURE */}
            {isPlaying && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMuted(prev => !prev);
                }}
                className="w-7.5 h-7.5 sm:w-8.5 sm:h-8.5 rounded-full bg-black/60 hover:bg-[#A2482B] backdrop-blur-md border border-white/20 hover:border-[#A2482B] text-white flex items-center justify-center cursor-pointer transition-all shadow-md hover:scale-105 active:scale-95 shrink-0"
                title={isMuted ? "Activer le son" : "Couper le son"}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5 text-white" /> : <Volume2 className="w-3.5 h-3.5 text-white" />}
              </button>
            )}
          </div>
        </div>

        {/* Flèche droite */}
        <button
          onClick={handleNext}
          className="absolute right-1 sm:right-3 md:right-6 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white text-stone-800 hover:bg-[#A2482B] hover:text-white border border-stone-200 shadow-md flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
          title="Suivant"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* =========================================================== */}
      {/* MODAL DU FORMULAIRE D'INSCRIPTION ALLÉGÉ                     */}
      {/* Sans titres "Inscription et action", sans module audio/vidéo */}
      {/* Adapté selon la carte (Entreprise, Partenaire, etc.)         */}
      {/* =========================================================== */}
      {isFormOpen && (
        <div 
          onClick={() => setIsFormOpen(false)}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[92vh] flex flex-col text-[#1C1917]"
          >
            {/* En-tête du modal épuré (sans titres superflus "Inscription et action") */}
            <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/80 shrink-0">
              <div className="relative">
                <h3 className="font-editorial text-lg sm:text-xl font-bold text-[#1C1917]">
                  {currentCard.title}
                </h3>
                <div className="absolute left-0 -bottom-1 w-7 h-0.5 bg-[#A2482B] rounded-full" />
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-200/80 hover:bg-stone-300 flex items-center justify-center text-stone-700 transition-colors cursor-pointer"
                title="Fermer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Corps du modal */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1">
              {isSubmitted ? (
                /* Écran de confirmation de l'inscription */
                <div className="py-6 sm:py-8 text-center flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="font-editorial text-xl font-bold text-stone-900 mb-2">
                    Inscription enregistrée !
                  </h4>
                  <p className="text-sm text-stone-600 max-w-sm mb-6 leading-relaxed">
                    Merci <strong className="text-stone-900">{formData.prenom} {formData.nom}</strong>. Votre demande pour <em>{currentCard.title}</em> a bien été prise en compte. L'équipe Yonywood va vous contacter directement par WhatsApp.
                  </p>

                  <div className="w-full space-y-2.5">
                    <button
                      onClick={shareOnWhatsApp}
                      className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Confirmer directement sur WhatsApp</span>
                    </button>

                    <button
                      onClick={() => setIsFormOpen(false)}
                      className="w-full py-2.5 px-4 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-sm transition-all cursor-pointer"
                    >
                      Fermer et continuer
                    </button>
                  </div>
                </div>
              ) : (
                /* Formulaire d'inscription allégé */
                <form onSubmit={handleSubmit} className="space-y-3.5">
                  {/* Prénom & Nom */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Prénom <span className="text-[#A2482B]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.prenom}
                        onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                        placeholder="Ex: Kodjo"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-[#A2482B] focus:ring-1 focus:ring-[#A2482B] outline-none text-sm transition-all bg-stone-50/50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Nom <span className="text-[#A2482B]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.nom}
                        onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                        placeholder="Ex: Dossou"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-[#A2482B] focus:ring-1 focus:ring-[#A2482B] outline-none text-sm transition-all bg-stone-50/50"
                      />
                    </div>
                  </div>

                  {/* Numéro de téléphone WhatsApp & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Numéro WhatsApp <span className="text-[#A2482B]">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phoneWhatsApp}
                        onChange={(e) => setFormData({ ...formData, phoneWhatsApp: e.target.value })}
                        placeholder="Ex: +229 97 00 00 00"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-[#A2482B] focus:ring-1 focus:ring-[#A2482B] outline-none text-sm transition-all bg-stone-50/50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Email (optionnel)
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Ex: contact@exemple.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-[#A2482B] focus:ring-1 focus:ring-[#A2482B] outline-none text-sm transition-all bg-stone-50/50"
                      />
                    </div>
                  </div>

                  {/* =========================================================== */}
                  {/* CHAMPS SPÉCIFIQUES : ENTREPRISE                             */}
                  {/* Nom de l'entreprise et Domaine d'activité                   */}
                  {/* =========================================================== */}
                  {currentCard.id === 'entreprise' && (
                    <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/90 space-y-3">
                      <div className="flex items-center gap-2 text-stone-800 font-bold text-xs">
                        <Building2 className="w-3.5 h-3.5 text-[#A2482B]" />
                        <span>Informations Entreprise</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                            Nom de l'entreprise <span className="text-[#A2482B]">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.nomEntreprise}
                            onChange={(e) => setFormData({ ...formData, nomEntreprise: e.target.value })}
                            placeholder="Ex: Bénin Bio Tech"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-[#A2482B] focus:ring-1 focus:ring-[#A2482B] outline-none text-sm transition-all bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                            Domaine d'activité <span className="text-[#A2482B]">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.domaineActivite}
                            onChange={(e) => setFormData({ ...formData, domaineActivite: e.target.value })}
                            placeholder="Ex: Agroalimentaire, Tech, Textile..."
                            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-[#A2482B] focus:ring-1 focus:ring-[#A2482B] outline-none text-sm transition-all bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* =========================================================== */}
                  {/* CHAMPS SPÉCIFIQUES : PARTENAIRES                            */}
                  {/* Nom de l'organisation et Type de partenariat                */}
                  {/* =========================================================== */}
                  {currentCard.id === 'partenaire' && (
                    <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/90 space-y-3">
                      <div className="flex items-center gap-2 text-stone-800 font-bold text-xs">
                        <Handshake className="w-3.5 h-3.5 text-[#A2482B]" />
                        <span>Informations Partenaire</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                            Nom de l'organisation <span className="text-[#A2482B]">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.nomOrganisation}
                            onChange={(e) => setFormData({ ...formData, nomOrganisation: e.target.value })}
                            placeholder="Ex: Fondation Culture & Récits"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-[#A2482B] focus:ring-1 focus:ring-[#A2482B] outline-none text-sm transition-all bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                            Domaine / Type d'alliance <span className="text-[#A2482B]">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.domainePartenariat}
                            onChange={(e) => setFormData({ ...formData, domainePartenariat: e.target.value })}
                            placeholder="Ex: Mécénat, Diffusion, Institutionnel..."
                            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-[#A2482B] focus:ring-1 focus:ring-[#A2482B] outline-none text-sm transition-all bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Raison de la participation */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Raison de votre participation
                    </label>
                    <textarea
                      rows={3}
                      value={formData.raison}
                      onChange={(e) => setFormData({ ...formData, raison: e.target.value })}
                      placeholder="Pourquoi souhaitez-vous participer ? Racontez-nous ce qui vous motive..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-[#A2482B] focus:ring-1 focus:ring-[#A2482B] outline-none text-sm transition-all bg-stone-50/50 resize-none"
                    />
                  </div>

                  {/* Bouton de validation de l'inscription */}
                  <button
                    type="submit"
                    disabled={isSubmitting || !isFormValid()}
                    className="w-full py-3 px-4 rounded-2xl bg-[#A2482B] hover:bg-[#8A3B22] disabled:bg-stone-300 disabled:cursor-not-allowed text-white font-bold text-sm sm:text-base shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95"
                  >
                    {isSubmitting ? (
                      <span>Enregistrement en cours...</span>
                    ) : (
                      <span>Valider mon inscription</span>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
