import React, { useState, useEffect, useRef } from 'react';
import { X, Volume2, VolumeX, Sparkles, Share2, HelpCircle } from 'lucide-react';
import { ThematicValue, ThematicStory } from '../data/thematicStoriesData';
import { VideoCardShareModal } from './VideoCardShareModal';

interface ThematicStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeValue: ThematicValue | null;
  onRecordMyStory?: (value: ThematicValue) => void;
}

export const ThematicStoryModal: React.FC<ThematicStoryModalProps> = ({
  isOpen,
  onClose,
  activeValue
}) => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showQuestionSheet, setShowQuestionSheet] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const stories = activeValue?.stories || [];
  const activeStory: ThematicStory | undefined = stories[currentStoryIndex];

  // Reset au changement de valeur
  useEffect(() => {
    setCurrentStoryIndex(0);
    setIsPlaying(true);
    setShowQuestionSheet(false);
    setShowShareModal(false);
  }, [activeValue]);

  if (!isOpen || !activeValue) return null;

  const currentQuestionText = activeStory?.question || activeValue.question || `Racontez comment dans votre vie une expérience vous a appris la valeur de ${activeValue.label.toLowerCase()}.`;

  return (
    <>
      {/* Modale Story affichée à z-[100] bien au-dessus de la barre de navigation (z-50) */}
      <div 
        className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-black/95 backdrop-blur-md select-none animate-in fade-in duration-200"
        onClick={onClose}
      >
        <div 
          className="relative w-full max-w-[340px] sm:max-w-[360px] h-[min(600px,calc(100dvh-40px))] aspect-[9/16] bg-[#12110F] text-white rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between border border-stone-800"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header épuré sans timing chiffré */}
          <div className="relative z-30 pt-4 px-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {activeStory && (
                <img 
                  src={activeStory.authorAvatar} 
                  alt={activeStory.authorName}
                  className="w-8 h-8 rounded-full object-cover border border-white/30 shadow-sm"
                />
              )}
              <div>
                <span className="text-xs font-bold text-white tracking-wide block">
                  {activeStory?.authorName || activeValue.label}
                </span>
                <span className="text-[10px] text-white/70">
                  {activeValue.label}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsMuted(m => !m)}
                className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm text-white/90 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                title={isMuted ? 'Activer le son' : 'Couper le son'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm text-white/90 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                title="Fermer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Vidéo de la story en plein écran sans filigrane */}
          <div 
            className="absolute inset-0 z-10 cursor-pointer"
            onClick={() => setIsPlaying(p => !p)}
          >
            {activeStory ? (
              <video
                ref={videoRef}
                key={activeStory.id}
                src={activeStory.videoUrl}
                autoPlay
                loop
                muted={isMuted}
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-stone-900 flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-amber-400" />
              </div>
            )}

            {/* Dégradé discret pour laisser le champ libre à la vidéo */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />
          </div>

          {/* Bas de carte : Juste l'onglet "Questions" épuré */}
          <div className="relative z-30 p-3.5 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowQuestionSheet(true)}
              className="px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 text-xs font-semibold flex items-center gap-1.5 hover:bg-black/80 transition-all cursor-pointer shadow-md"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-300" />
              <span>Questions</span>
            </button>

            <button
              type="button"
              onClick={() => setShowShareModal(true)}
              className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 flex items-center justify-center hover:bg-black/80 transition-all cursor-pointer shadow-md"
              title="Partager cette story"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Tiroir "Question" déplié sur demande avec la thématique et le texte */}
          {showQuestionSheet && (
            <div 
              className="absolute inset-x-0 bottom-0 z-40 bg-white text-stone-900 rounded-t-3xl p-4 shadow-2xl animate-in slide-in-from-bottom duration-200 space-y-2.5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-1 border-b border-stone-100">
                <span className="text-xs font-bold text-[#A2482B] uppercase tracking-wider">
                  Thématique : {activeValue.label}
                </span>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => setShowShareModal(true)} 
                    className="p-1 rounded-full text-stone-500 hover:text-stone-900 hover:bg-stone-100"
                    title="Partager"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setShowQuestionSheet(false)} 
                    className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100"
                    title="Fermer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-xs sm:text-sm font-semibold text-stone-800 leading-relaxed">
                « {currentQuestionText} »
              </p>
            </div>
          )}

        </div>
      </div>

      {/* Modale Partage */}
      {showShareModal && (
        <VideoCardShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          videoTitle={`Story : ${activeValue.label}`}
          videoId={activeStory?.id || activeValue.id}
        />
      )}
    </>
  );
};
