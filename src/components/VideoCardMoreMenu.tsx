import React, { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Flag, Ban, Check } from 'lucide-react';

export interface VideoCardMoreMenuProps {
  id?: string;
  videoId?: string;
  videoTitle?: string;
  onReport?: () => void;
  onBlock?: () => void;
  className?: string;
  buttonClassName?: string;
  menuPosition?: 'left' | 'right';
}

export const VideoCardMoreMenu: React.FC<VideoCardMoreMenuProps> = ({
  id,
  videoId,
  videoTitle,
  onReport,
  onBlock,
  className = '',
  buttonClassName = '',
  menuPosition = 'left'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fermeture au clic extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleReport = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    if (onReport) {
      onReport();
    }
    setToastMessage('Vidéo signalée à la modération.');
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleBlock = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    if (onBlock) {
      onBlock();
    }
    setToastMessage('Cette vidéo a été masquée pour votre compte.');
    setTimeout(() => setToastMessage(null), 2500);
  };

  const defaultButtonClass = "w-7 h-7 sm:w-8.5 sm:h-8.5 rounded-lg sm:rounded-xl backdrop-blur-md border flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer hover:scale-105 active:scale-95";

  return (
    <div className={`relative ${className}`} ref={menuRef} onClick={(e) => e.stopPropagation()}>
      <button
        id={id}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        className={buttonClassName || `${defaultButtonClass} ${
          isOpen
            ? 'bg-white text-stone-900 border-white shadow-lg'
            : 'bg-black/45 hover:bg-[#A2482B] border-white/20 hover:border-[#A2482B] text-white'
        }`}
        title="Plus d'actions : Signaler ou Bloquer"
      >
        <MoreHorizontal className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
      </button>

      {/* Menu contextuel Signaler / Bloquer */}
      {isOpen && (
        <div 
          onClick={(e) => e.stopPropagation()}
          className={`absolute ${
            menuPosition === 'left' ? 'right-9 sm:right-11' : 'left-9 sm:left-11'
          } bottom-0 z-50 bg-stone-900/95 backdrop-blur-md border border-white/20 rounded-xl p-1.5 shadow-2xl min-w-[155px] space-y-1 animate-in fade-in zoom-in-95 duration-150`}
        >
          <button
            type="button"
            onClick={handleReport}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-stone-200 hover:text-white hover:bg-white/10 transition-colors text-left cursor-pointer active:scale-95"
          >
            <Flag className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Signaler la vidéo</span>
          </button>
          
          <button
            type="button"
            onClick={handleBlock}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-red-300 hover:text-red-200 hover:bg-red-500/20 transition-colors text-left cursor-pointer active:scale-95"
          >
            <Ban className="w-3.5 h-3.5 text-red-400 shrink-0" />
            <span>Bloquer la vidéo</span>
          </button>
        </div>
      )}

      {/* Toast d'action discret et élégant */}
      {toastMessage && (
        <div 
          onClick={(e) => e.stopPropagation()}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[70] bg-stone-900/95 backdrop-blur-md text-white border border-white/20 px-4 py-2 rounded-full text-xs font-medium shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200 flex items-center gap-2 pointer-events-auto"
        >
          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
