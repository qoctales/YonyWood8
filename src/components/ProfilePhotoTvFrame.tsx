import React, { useId, useState } from 'react';

export interface ProfilePhotoTvFrameProps {
  photoUrl?: string | null;
  alt?: string;
  className?: string;
  strokeColor?: string;
  strokeWidth?: number | string;
}

/**
 * ProfilePhotoTvFrame :
 * Cadre photo de profil officiel YonyWood en forme de petite télé rétro.
 * La photo remplit l'écran de la télé, rognée proprement sans déformation (preserveAspectRatio slice).
 * Le contour arrondi et les petits pieds du cadre sont conservés.
 * En l'absence de photo, affiche un état vide discret avec l'icône Profil d'origine.
 */
export const ProfilePhotoTvFrame: React.FC<ProfilePhotoTvFrameProps> = ({
  photoUrl,
  alt = 'Photo de profil',
  className = 'w-10 h-10',
  strokeColor = '#1C1917',
  strokeWidth = 1.55,
}) => {
  const reactId = useId();
  const clipId = `tv-photo-frame-${reactId.replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const [hasError, setHasError] = useState(false);

  React.useEffect(() => {
    setHasError(false);
  }, [photoUrl]);

  const hasPhoto = Boolean(photoUrl && photoUrl.trim().length > 0 && !hasError);

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 select-none ${className}`}>
      <svg 
        viewBox="0 0 24 24" 
        fill="none" 
        className="w-full h-full drop-shadow-xs"
        aria-label={alt}
        role="img"
      >
        <defs>
          {/* Découpe exacte de l'écran télé aux 4 coins arrondis */}
          <clipPath id={clipId}>
            <rect x="6.25" y="5.5" width="11.5" height="10.5" rx="2.4" />
          </clipPath>
        </defs>

        {/* Fond d'écran discret */}
        <rect 
          x="6.25" 
          y="5.5" 
          width="11.5" 
          height="10.5" 
          rx="2.4" 
          fill="#F5F5F4" 
        />

        {hasPhoto ? (
          <image 
            href={photoUrl!}
            xlinkHref={photoUrl!}
            x="6.25"
            y="5.5"
            width="11.5"
            height="10.5"
            preserveAspectRatio="xMidYMid slice"
            clipPath={`url(#${clipId})`}
            onError={() => setHasError(true)}
          />
        ) : (
          /* État vide discret : l'icône Profil d'origine avec ses 2 yeux */
          <g fill={strokeColor} opacity={0.65}>
            <circle cx="10.3" cy="10.75" r="0.9" stroke="none" />
            <circle cx="13.7" cy="10.75" r="0.9" stroke="none" />
          </g>
        )}

        {/* Contour précis de l'écran télé par-dessus la photo */}
        <rect 
          x="6.25" 
          y="5.5" 
          width="11.5" 
          height="10.5" 
          rx="2.4" 
          fill="none"
          stroke={strokeColor} 
          strokeWidth={strokeWidth} 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />

        {/* Piétement vintage : les deux petits pieds inclinés évasés vers l'extérieur */}
        <path 
          d="M 9.2 16 L 7.4 19.8" 
          stroke={strokeColor} 
          strokeWidth={strokeWidth} 
          strokeLinecap="round" 
        />
        <path 
          d="M 14.8 16 L 16.6 19.8" 
          stroke={strokeColor} 
          strokeWidth={strokeWidth} 
          strokeLinecap="round" 
        />
      </svg>
    </div>
  );
};
