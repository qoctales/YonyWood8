import React from 'react';

interface ShareIconProps {
  className?: string;
}

/**
 * Icône de partage sur-mesure pour YonyWood :
 * Arche d'offrande incurvée et flèche d'envol ascendante,
 * élégante, fluide et aérée (tracé fin 1.75px).
 */
export const ShareIcon: React.FC<ShareIconProps> = ({ className = 'w-4 h-4' }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Flèche d'envol ascendante */}
      <path d="M12 4.5v10" />
      <path d="m8 8.5 4-4 4 4" />
      {/* Arche d'offrande / Ancre incurvée douce */}
      <path d="M6.5 14a5.5 5.5 0 0 0 11 0" />
    </svg>
  );
};
