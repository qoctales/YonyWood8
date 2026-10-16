import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { useAuth } from '../services/authContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  onSuccess
}) => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (mode === 'login') {
        if (!email.trim()) {
          setError('Veuillez saisir votre adresse e-mail.');
          setIsLoading(false);
          return;
        }
        const res = await login(email, password);
        if (res.success) {
          onSuccess?.();
          onClose();
        } else {
          setError(res.message || 'Identifiants invalides.');
        }
      } else {
        if (!email.trim() || !name.trim()) {
          setError('Veuillez renseigner votre nom et votre adresse e-mail.');
          setIsLoading(false);
          return;
        }
        const res = await register(name, email, password);
        if (res.success) {
          onSuccess?.();
          onClose();
        } else {
          setError(res.message || "Erreur lors de l'inscription.");
        }
      }
    } catch {
      setError('Une erreur est survenue lors de la connexion.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-[#1C1917] border border-stone-800 rounded-3xl shadow-2xl overflow-hidden text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Bandeau d'en-tête décoratif */}
        <div className="relative px-6 pt-6 pb-4 bg-gradient-to-b from-[#A2482B]/20 to-transparent">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
            title="Fermer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#A2482B]" />
            <span className="text-xs font-mono font-bold tracking-widest text-[#E8926F] uppercase">
              Espace Membre YonyWood
            </span>
          </div>

          <h3 className="text-2xl font-serif font-bold text-white tracking-tight">
            {mode === 'login' ? 'Connexion' : 'Créer un compte'}
          </h3>
          <p className="text-xs text-stone-400 mt-1">
            {mode === 'login' 
              ? 'Accédez à votre espace coproducteur, vos messages et réglages.'
              : 'Rejoignez la communauté des spectateurs engagés et coproducteurs.'}
          </p>

          {/* Onglets Connexion / Inscription */}
          <div className="flex items-center p-1 bg-stone-900/80 rounded-xl mt-4 border border-stone-800">
            <button
              type="button"
              onClick={() => { setMode('login'); setError(null); }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                mode === 'login' 
                  ? 'bg-[#A2482B] text-white shadow-xs' 
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              Se connecter
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setError(null); }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                mode === 'register' 
                  ? 'bg-[#A2482B] text-white shadow-xs' 
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              Créer un compte
            </button>
          </div>
        </div>

        {/* Corps du formulaire */}
        <form onSubmit={handleSubmit} className="p-6 pt-2 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-800/80 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1.5">
                Nom complet
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex : Romeo Nonvide"
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-stone-900 border border-stone-800 focus:border-[#A2482B] focus:ring-1 focus:ring-[#A2482B] text-white text-xs placeholder:text-stone-500 outline-hidden transition-all"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1.5">
              Adresse e-mail
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre-email@domaine.com"
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-stone-900 border border-stone-800 focus:border-[#A2482B] focus:ring-1 focus:ring-[#A2482B] text-white text-xs placeholder:text-stone-500 outline-hidden transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1.5">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-stone-900 border border-stone-800 focus:border-[#A2482B] focus:ring-1 focus:ring-[#A2482B] text-white text-xs placeholder:text-stone-500 outline-hidden transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 rounded-xl bg-[#A2482B] hover:bg-[#8A3B22] text-white text-xs font-bold shadow-lg shadow-[#A2482B]/20 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98 disabled:opacity-50"
          >
            {isLoading ? (
              <span>Traitement en cours...</span>
            ) : (
              <>
                <span>{mode === 'login' ? 'Se connecter' : 'Valider mon inscription'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>


        </form>
      </div>
    </div>
  );
};
