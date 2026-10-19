import React, { useState, useRef } from 'react';
import { X, Volume2, VolumeX, Pause, Tv } from 'lucide-react';
import { MatrixProfile } from '../../utils/matrixGridService';
import { TvPlayerIcon } from '../YonywoodBrandIcons';

interface DuoFaceToFaceModalProps {
  sun: MatrixProfile;
  counterpoint: MatrixProfile;
  onClose: () => void;
  onSelectPerson?: (person: MatrixProfile) => void;
}

export const DuoFaceToFaceModal: React.FC<DuoFaceToFaceModalProps> = ({
  sun,
  counterpoint,
  onClose,
  onSelectPerson
}) => {
  const [isPlayingSun, setIsPlayingSun] = useState<boolean>(true);
  const [isPlayingCounter, setIsPlayingCounter] = useState<boolean>(false);
  const [isMutedSun, setIsMutedSun] = useState<boolean>(false);
  const [isMutedCounter, setIsMutedCounter] = useState<boolean>(true);

  const videoRefSun = useRef<HTMLVideoElement | null>(null);
  const videoRefCounter = useRef<HTMLVideoElement | null>(null);

  const centralQuestion = sun.centralQuestion || counterpoint.centralQuestion || 'Quelle trace laissons-nous à ceux qui nous suivent ?';

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl bg-stone-900 border border-[#C89B3C]/50 rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-2xl flex flex-col gap-3 max-h-[92dvh] overflow-y-auto no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête : Question existentielle commune */}
        <div className="flex items-center justify-between pb-2 border-b border-white/10 gap-2">
          <div className="min-w-0">
            <span className="text-[10px] sm:text-xs font-bold text-[#FFE7A3] uppercase tracking-wider">
              Duo &lt;&gt; Face-à-face
            </span>
            <h3 className="font-editorial text-sm sm:text-lg font-bold text-white truncate">
              « {centralQuestion} »
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corps : Diptyque 2 cartes côte à côte */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 my-auto">
          
          {/* CARTE 1 : LE SOLEIL */}
          <div className="relative aspect-[9/16] max-h-[460px] sm:max-h-[500px] rounded-2xl overflow-hidden bg-black border-2 border-[#C89B3C] shadow-lg flex flex-col justify-between p-3 select-none">
            {/* Vidéo ou photo */}
            {isPlayingSun ? (
              <video
                ref={videoRefSun}
                src={sun.teaserVideoUrl}
                poster={sun.photoUrl}
                playsInline
                autoPlay
                loop
                muted={isMutedSun}
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              />
            ) : (
              <img 
                src={sun.photoUrl} 
                alt={sun.name}
                className="absolute inset-0 w-full h-full object-cover pointer-events-none" 
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />

            {/* Haut */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold text-[#FFE7A3] border border-white/20">
                Soleil · {sun.flag}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsMutedSun(prev => !prev)}
                  className="p-1 rounded-full bg-black/50 hover:bg-[#A2482B] text-white"
                >
                  {isMutedSun ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => setIsPlayingSun(prev => !prev)}
                  className="p-1 rounded-full bg-black/50 hover:bg-[#A2482B] text-white"
                >
                  {isPlayingSun ? <Pause className="w-3.5 h-3.5" /> : <TvPlayerIcon className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Bas */}
            <div className="relative z-10">
              <h4 className="font-bold text-sm sm:text-base text-white truncate">{sun.name}</h4>
              <p className="text-xs text-stone-300 truncate">{sun.role}</p>
            </div>
          </div>

          {/* CARTE 2 : LE CONTREPOINT */}
          <div className="relative aspect-[9/16] max-h-[460px] sm:max-h-[500px] rounded-2xl overflow-hidden bg-black border-2 border-[#A2482B] shadow-lg flex flex-col justify-between p-3 select-none">
            {/* Vidéo ou photo */}
            {isPlayingCounter ? (
              <video
                ref={videoRefCounter}
                src={counterpoint.teaserVideoUrl}
                poster={counterpoint.photoUrl}
                playsInline
                autoPlay
                loop
                muted={isMutedCounter}
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              />
            ) : (
              <img 
                src={counterpoint.photoUrl} 
                alt={counterpoint.name}
                className="absolute inset-0 w-full h-full object-cover pointer-events-none" 
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />

            {/* Haut */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold text-white border border-white/20">
                Contrepoint · {counterpoint.flag}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsMutedCounter(prev => !prev)}
                  className="p-1 rounded-full bg-black/50 hover:bg-[#A2482B] text-white"
                >
                  {isMutedCounter ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => setIsPlayingCounter(prev => !prev)}
                  className="p-1 rounded-full bg-black/50 hover:bg-[#A2482B] text-white"
                >
                  {isPlayingCounter ? <Pause className="w-3.5 h-3.5" /> : <TvPlayerIcon className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Bas */}
            <div className="relative z-10">
              <h4 className="font-bold text-sm sm:text-base text-white truncate">{counterpoint.name}</h4>
              <p className="text-xs text-stone-300 truncate">{counterpoint.role}</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
