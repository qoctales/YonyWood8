import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Sparkles, 
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

  // Connexion démo immédiate en 1 clic
  const handleDemoLogin = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const res = await login('qoctales@gmail.com');
      if (res.success) {
        onSuccess?.();
        onClose();
      } else {
        setError(res.message || 'Impossible d’activer le compte démo.');
      }
    } catch {
      setError('Erreur lors de la connexion démo.');
    } finally {
      setIsLoading(false);
    }
  };

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-white border border-stone-200 rounded-3xl shadow-2xl overflow-hidden text-stone-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête épuré sur fond blanc */}
        <div className="relative px-6 pt-6 pb-2">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-900 flex items-center justify-center transition-all cursor-pointer"
            title="Fermer"
          >
            <X className="w-4 h-4" />
          </button>

          <h3 className="text-2xl font-serif font-bold text-stone-900 tracking-tight">
            {mode === 'login' ? 'Connexion' : 'Créer un compte'}
          </h3>

          {/* Onglets Connexion / Inscription */}
          <div className="flex items-center p-1 bg-stone-100 rounded-xl mt-4 border border-stone-200">
            <button
              type="button"
              onClick={() => { setMode('login'); setError(null); }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                mode === 'login' 
                  ? 'bg-white text-stone-900 shadow-xs border border-stone-200/60' 
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              Se connecter
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setError(null); }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                mode === 'register' 
                  ? 'bg-white text-stone-900 shadow-xs border border-stone-200/60' 
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              Créer un compte
            </button>
          </div>
        </div>

        {/* Bouton d'accès démo direct en 1 clic */}
        <div className="px-6 pt-3">
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl bg-[#A2482B]/10 hover:bg-[#A2482B]/15 border border-[#A2482B]/30 text-[#A2482B] text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98 shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-[#A2482B]" />
            <span>Connexion Démo Immédiate (1 clic)</span>
          </button>
          
          <div className="relative flex items-center justify-center my-4">
            <div className="border-t border-stone-200 w-full" />
            <span className="bg-white px-2.5 text-[10px] text-stone-400 font-medium uppercase tracking-wider">
              ou
            </span>
          </div>
        </div>

        {/* Corps du formulaire */}
        <form onSubmit={handleSubmit} className="px-6 pb-6 pt-0 space-y-3.5">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Nom complet
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex : Romeo Nonvide"
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-stone-50 border border-stone-300 focus:border-[#A2482B] focus:bg-white text-stone-900 text-xs placeholder:text-stone-400 outline-hidden transition-all"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Adresse e-mail
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre-email@domaine.com"
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-stone-50 border border-stone-300 focus:border-[#A2482B] focus:bg-white text-stone-900 text-xs placeholder:text-stone-400 outline-hidden transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-stone-50 border border-stone-300 focus:border-[#A2482B] focus:bg-white text-stone-900 text-xs placeholder:text-stone-400 outline-hidden transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 rounded-xl bg-[#A2482B] hover:bg-[#8A3B22] text-white text-xs font-bold shadow-md shadow-[#A2482B]/20 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98 disabled:opacity-50"
          >
            {isLoading ? (
              <span>Connexion en cours...</span>
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
