import React, { useId } from 'react';

interface ProfileAvatarRingProps {
  photoUrl: string;
  alt?: string;
  className?: string;
  onClick?: () => void;
}

/**
 * ProfileAvatarRing:
 * Anneau officiel YonyWood pour la photo de profil d'avatar.
 * Composé d'un anneau noir profond (#0E0C0A), d'un filet doré précieux (#D9A441)
 * et de la photo de profil découpée en cercle parfait (r=78).
 */
export const ProfileAvatarRing: React.FC<ProfileAvatarRingProps> = ({
  photoUrl,
  alt = 'Photo de profil',
  className = 'w-10 h-10 sm:w-11 sm:h-11',
  onClick,
}) => {
  const rawId = useId();
  const clipId = `avatar-ring-clip-${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`;

  const svgContent = (
    <svg
      viewBox="0 0 200 200"
      className="w-full h-full drop-shadow-sm select-none"
      role="img"
      aria-label={alt}
    >
      <defs>
        <clipPath id={clipId}>
          <circle cx="100" cy="100" r="78" />
        </clipPath>
      </defs>

      {/* Anneau noir extérieur */}
      <circle cx="100" cy="100" r="98" fill="#0E0C0A" />

      {/* Emplacement de la photo découpée */}
      <image
        href={photoUrl || '/assets/duos/codjo-blind.jpg'}
        x="22"
        y="22"
        width="156"
        height="156"
        preserveAspectRatio="xMidYMid slice"
        clipPath={`url(#${clipId})`}
      />

      {/* Filet doré autour de la photo */}
      <circle
        cx="100"
        cy="100"
        r="80"
        fill="none"
        stroke="#D9A441"
        strokeWidth="2.5"
      />
    </svg>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        title={alt}
        className={`relative rounded-full transition-transform duration-200 hover:scale-105 active:scale-95 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9A441] shrink-0 ${className}`}
      >
        {svgContent}
      </button>
    );
  }

  return (
    <div className={`relative rounded-full shrink-0 ${className}`}>
      {svgContent}
    </div>
  );
};
