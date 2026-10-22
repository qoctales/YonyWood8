import React from 'react';

interface IconProps {
  className?: string;
  strokeWidth?: number | string;
}

/**
 * ExplorerEggIcon:
 * Symbole Explorer inspiré d'un œuf ouvert en haut et en bas,
 * formant deux parenthèses ouvertes face à face qui ne se touchent pas.
 */
export const ExplorerEggIcon: React.FC<IconProps> = ({ 
  className = 'w-5 h-5',
  strokeWidth = 1.5 
}) => {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth={strokeWidth} 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
      aria-hidden="true"
    >
      {/* Parenthèse / Coquille gauche (ouverte en haut et en bas) */}
      <path d="M 9 3.5 C 4 7, 4 17, 9 20.5" />
      {/* Parenthèse / Coquille droite (ouverte en haut et en bas) */}
      <path d="M 15 3.5 C 20 7, 20 17, 15 20.5" />
    </svg>
  );
};

/**
 * YonywoodLogoIcon:
 * Logo officiel du projet : les deux parenthèses ouvertes (l'œuf cosmique ouvert)
 * renfermant les symboles inférieur (<) et supérieur (>) qui ne se touchent pas,
 * avec les barres centrales en vis-à-vis qui ne se touchent pas.
 */
export const YonywoodLogoIcon: React.FC<IconProps> = ({ 
  className = 'w-5 h-5',
  strokeWidth = 1.5 
}) => {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth={strokeWidth} 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
      aria-hidden="true"
    >
      {/* Parenthèse / Coquille extérieure gauche */}
      <path d="M 8 3.5 C 3 7, 3 17, 8 20.5" />
      {/* Parenthèse / Coquille extérieure droite */}
      <path d="M 16 3.5 C 21 7, 21 17, 16 20.5" />
      {/* Symbole inférieur (<) tourné vers le centre, ne touche rien */}
      <path d="M 10.5 9.2 L 7.5 12 L 10.5 14.8" />
      {/* Symbole supérieur (>) tourné vers le centre, en vis-à-vis sans se toucher */}
      <path d="M 13.5 9.2 L 16.5 12 L 13.5 14.8" />
    </svg>
  );
};

/**
 * CircleDotsIcon:
 * Symbole « Cercle » : un cercle central entouré d'une couronne de petits points en cercle,
 * symbolisant l'assemblée, le groupe réuni, la communauté chorale et l'astrolabe.
 */
export const CircleDotsIcon: React.FC<IconProps> = ({ 
  className = 'w-5 h-5',
  strokeWidth = 1.5 
}) => {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth={strokeWidth} 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
      aria-hidden="true"
    >
      {/* Cercle central */}
      <circle cx="12" cy="12" r="4.2" />
      
      {/* 8 petits points disposés en couronne circulaire autour */}
      <circle cx="12" cy="3.2" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="18.2" cy="5.8" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="20.8" cy="12" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="18.2" cy="18.2" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="20.8" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="5.8" cy="18.2" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="3.2" cy="12" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="5.8" cy="5.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
};

/**
 * LaurelNominationsIcon:
 * Symbole « Nominations » : lauriers de sélection officielle / festival.
 * Rendu net et ultra-lisible en petite taille, formé de paires de feuilles
 * évasées en haut qui convergent gracieusement vers le bas en pointe en V.
 */
export const LaurelNominationsIcon: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      className={className}
      aria-hidden="true"
    >
      {/* Paire 1 (Haut, feuilles évasées) */}
      <path 
        d="M 6.4 5.2 C 6.8 3.9 8.8 4.2 8.7 5.6 C 8.5 6.8 6.2 6.5 6.4 5.2 Z" 
        fill="currentColor" 
      />
      <path 
        d="M 17.6 5.2 C 17.2 3.9 15.2 4.2 15.3 5.6 C 15.5 6.8 17.8 6.5 17.6 5.2 Z" 
        fill="currentColor" 
      />

      {/* Paire 2 (Inclinée vers l'intérieur) */}
      <path 
        d="M 7.2 8.8 C 7.6 7.6 9.5 8.1 9.2 9.4 C 8.9 10.5 7.0 10.0 7.2 8.8 Z" 
        fill="currentColor" 
      />
      <path 
        d="M 16.8 8.8 C 16.4 7.6 14.5 8.1 14.8 9.4 C 15.1 10.5 17.0 10.0 16.8 8.8 Z" 
        fill="currentColor" 
      />

      {/* Paire 3 (Mi-hauteur, resserrée) */}
      <path 
        d="M 8.5 12.3 C 8.8 11.2 10.6 11.8 10.3 13.0 C 9.9 14.1 8.3 13.4 8.5 12.3 Z" 
        fill="currentColor" 
      />
      <path 
        d="M 15.5 12.3 C 15.2 11.2 13.4 11.8 13.7 13.0 C 14.1 14.1 15.7 13.4 15.5 12.3 Z" 
        fill="currentColor" 
      />

      {/* Paire 4 (Bas, convergence) */}
      <path 
        d="M 10.1 15.8 C 10.3 14.8 12.0 15.5 11.6 16.6 C 11.2 17.5 9.9 16.8 10.1 15.8 Z" 
        fill="currentColor" 
      />
      <path 
        d="M 13.9 15.8 C 13.7 14.8 12.0 15.5 12.4 16.6 C 12.8 17.5 14.1 16.8 13.9 15.8 Z" 
        fill="currentColor" 
      />

      {/* Paire 5 (Pointe en V terminale au centre) */}
      <path 
        d="M 11.4 18.8 C 11.4 18.0 12.5 18.4 12.1 19.6 C 11.7 20.0 11.2 19.5 11.4 18.8 Z" 
        fill="currentColor" 
      />
      <path 
        d="M 12.6 18.8 C 12.6 18.0 11.5 18.4 11.9 19.6 C 12.3 20.0 12.8 19.5 12.6 18.8 Z" 
        fill="currentColor" 
      />
    </svg>
  );
};

/**
 * AgoraAlveolesIcon:
 * Symbole « Agora » : Les trois alvéoles partageant leurs arêtes en rayon de miel,
 * trait fin 1.5, bouts et angles arrondis, sans traits intérieurs superflus.
 */
export const AgoraAlveolesIcon: React.FC<IconProps> = ({ 
  className = 'w-5 h-5',
  strokeWidth = 1.5 
}) => {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth={strokeWidth} 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
      aria-hidden="true"
    >
      {/* Contour extérieur des 3 alvéoles */}
      <path d="M 12 3.6 L 16.16 6.0 L 16.16 10.8 L 20.32 13.2 L 20.32 18.0 L 16.16 20.4 L 12 18.0 L 7.84 20.4 L 3.68 18.0 L 3.68 13.2 L 7.84 10.8 L 7.84 6.0 Z" />
      {/* Les 3 arêtes partagées rayonnant depuis la jonction centrale (12, 13.2) */}
      <path d="M 12 13.2 L 16.16 10.8 M 12 13.2 L 7.84 10.8 M 12 13.2 L 12 18.0" />
    </svg>
  );
};

// Rétrocompatibilité
export const AgoraAssemblyIcon = AgoraAlveolesIcon;

/**
 * MarcheCloverIcon:
 * Symbole « Marché » : Le trèfle à quatre feuilles signature YonyWood,
 * composé de 4 feuilles en cœur avec leurs nervures axiales et une petite tige
 * gracieuse en bas pour un rendu floral et botanique immédiatement identifiable.
 */
export const MarcheCloverIcon: React.FC<IconProps> = ({ 
  className = 'w-5 h-5',
  strokeWidth = 1.5 
}) => {
  const strokeVal = typeof strokeWidth === 'number' ? strokeWidth : parseFloat(String(strokeWidth)) || 1.5;
  const s = 0.060; // Taille légèrement réduite des fleurs pour laisser respirer l'icône
  const innerStroke = strokeVal / s;

  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
      aria-hidden="true"
    >
      <g transform={`translate(12, 9.2) scale(${s})`} strokeWidth={innerStroke}>
        {/* Les 4 feuilles du trèfle */}
        <g transform="translate(-4, -4) rotate(-45)">
          <path d="M0 0 C8 -9 46 -32 57 -57 C74 -76 68 -111 42 -116 C26 -119 10 -110 0 -100 C-10 -110 -26 -119 -42 -116 C-68 -111 -74 -76 -57 -57 C-46 -32 -8 -9 0 0 Z" />
        </g>
        <g transform="translate(4, -4) rotate(45)">
          <path d="M0 0 C8 -9 46 -32 57 -57 C74 -76 68 -111 42 -116 C26 -119 10 -110 0 -100 C-10 -110 -26 -119 -42 -116 C-68 -111 -74 -76 -57 -57 C-46 -32 -8 -9 0 0 Z" />
        </g>
        <g transform="translate(-4, 4) rotate(-135)">
          <path d="M0 0 C8 -9 46 -32 57 -57 C74 -76 68 -111 42 -116 C26 -119 10 -110 0 -100 C-10 -110 -26 -119 -42 -116 C-68 -111 -74 -76 -57 -57 C-46 -32 -8 -9 0 0 Z" />
        </g>
        <g transform="translate(4, 4) rotate(135)">
          <path d="M0 0 C8 -9 46 -32 57 -57 C74 -76 68 -111 42 -116 C26 -119 10 -110 0 -100 C-10 -110 -26 -119 -42 -116 C-68 -111 -74 -76 -57 -57 C-46 -32 -8 -9 0 0 Z" />
        </g>

        {/* Les 4 nervures axiales intérieures */}
        <g fill="currentColor" stroke="none">
          <g transform="translate(-4, -4) rotate(-45)">
            <path d="M0 -34 Q2.4 -60 0 -88 Q-2.4 -60 0 -34 Z" />
          </g>
          <g transform="translate(4, -4) rotate(45)">
            <path d="M0 -34 Q2.4 -60 0 -88 Q-2.4 -60 0 -34 Z" />
          </g>
          <g transform="translate(-4, 4) rotate(-135)">
            <path d="M0 -34 Q2.4 -60 0 -88 Q-2.4 -60 0 -34 Z" />
          </g>
          <g transform="translate(4, 4) rotate(135)">
            <path d="M0 -34 Q2.4 -60 0 -88 Q-2.4 -60 0 -34 Z" />
          </g>
        </g>

        {/* Tige allongée et nettement visible, courbée vers la gauche */}
        <path d="M 0 25 C -2 90, -24 150, -52 198" />
      </g>
    </svg>
  );
};

// Rétrocompatibilité
export const MarcheSproutIcon = MarcheCloverIcon;

/**
 * ProductionTokenIcon:
 * Symbole « Production » : Jeton de valeur / Pièce inspirée des jetons de casino,
 * avec contour dentelé/cannelé, double anneau concentrique et noyau central,
 * distinguant clairement la participation économique et financière de l'imaginaire végétal.
 */
export const ProductionTokenIcon: React.FC<IconProps> = ({ 
  className = 'w-5 h-5',
  strokeWidth = 1.5 
}) => {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth={strokeWidth} 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
      aria-hidden="true"
    >
      {/* Anneau extérieur du jeton */}
      <circle cx="12" cy="12" r="9.5" />
      {/* Anneau intérieur concentrique pointillé */}
      <circle cx="12" cy="12" r="6" strokeDasharray="2.5 2" />
      {/* Noyau central (symbole de pièce/valeur) */}
      <circle cx="12" cy="12" r="2.8" />
      {/* Cannelures radiales du jeton de casino (8 repères de tranche) */}
      <line x1="12" y1="2.5" x2="12" y2="4.5" />
      <line x1="12" y1="19.5" x2="12" y2="21.5" />
      <line x1="2.5" y1="12" x2="4.5" y2="12" />
      <line x1="19.5" y1="12" x2="21.5" y2="12" />
      <line x1="5.28" y1="5.28" x2="6.7" y2="6.7" />
      <line x1="17.3" y1="17.3" x2="18.72" y2="18.72" />
      <line x1="5.28" y1="18.72" x2="6.7" y2="17.3" />
      <line x1="17.3" y1="6.7" x2="18.72" y2="5.28" />
    </svg>
  );
};

/**
 * SingleAlveoleIcon:
 * Alvéole pour remplacer les sacs sur la page Agora / Matrice.
 */
export const SingleAlveoleIcon: React.FC<IconProps> = ({ 
  className = 'w-5 h-5',
  strokeWidth = 1.5 
}) => {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth={strokeWidth} 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
      aria-hidden="true"
    >
      <path d="M 12 3 L 19.5 7.3 L 19.5 16.7 L 12 21 L 4.5 16.7 L 4.5 7.3 Z" />
    </svg>
  );
};

/**
 * CastingSearchIcon:
 * Symbole « Casting » : loupe de recherche entourant la silhouette d'un profil/personnage,
 * symbolisant la détection des talents, la sélection et le casting.
 */
export const CastingSearchIcon: React.FC<IconProps> = ({ 
  className = 'w-5 h-5',
  strokeWidth = 1.5 
}) => {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth={strokeWidth} 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
      aria-hidden="true"
    >
      {/* Cercle généreux et harmonieux de la loupe agrandie */}
      <circle cx="10.2" cy="10.2" r="8.2" />
      {/* Tête de l'acteur / protagoniste */}
      <circle cx="10.2" cy="8.2" r="2.5" />
      {/* Buste / Épaules bien proportionnés */}
      <path d="M 6.2 15.2 C 6.8 12.8 8.3 12.0 10.2 12.0 C 12.1 12.0 13.6 12.8 14.2 15.2" />
      {/* Manche solide de la loupe à 45° */}
      <line x1="16.3" y1="16.3" x2="21.8" y2="21.8" />
    </svg>
  );
};

/**
 * CoproduireRingsIcon:
 * Symbole « Coproduire » : deux anneaux entrelacés / cercles sécants en diagonale,
 * symbolisant l'alliance, le cofinancement créatif et le partage de valeur.
 */
export const CoproduireRingsIcon: React.FC<IconProps> = ({ 
  className = 'w-5 h-5',
  strokeWidth = 1.5 
}) => {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth={strokeWidth} 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
      aria-hidden="true"
    >
      {/* Anneau inférieur gauche */}
      <circle cx="9.5" cy="14" r="5" />
      {/* Anneau supérieur droit */}
      <circle cx="14.5" cy="9.5" r="5" />
    </svg>
  );
};

/**
 * DuocumentairesTvIcon (DuoIcon / robot-final):
 * Symbole officiel « Duo » de la barre de navigation :
 * Écran double rétro avec ses deux compartiments, la séparation centrale,
 * les deux points-yeux intérieurs et les deux pieds vintage inclinés.
 * En mode actif : blanc pur (#FFFFFF) au cœur de la capsule terracotta (#A2482B).
 * En mode inactif : gris (#6E6254 / text-stone-600).
 */
export interface DuoIconProps extends IconProps {
  isActive?: boolean;
}

export const DuocumentairesTvIcon: React.FC<DuoIconProps> = ({ 
  className = 'w-5 h-5',
  strokeWidth = 1.75,
  isActive
}) => {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth={strokeWidth} 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={`${isActive === true ? 'text-white' : isActive === false ? 'text-[#6E6254]' : ''} ${className}`.trim()}
      aria-hidden="true"
    >
      <title>Duo</title>
      <rect x="3" y="5" width="18" height="9" rx="2" />
      <path d="M 12 5 L 12 14" />
      <circle cx="7.5" cy="9.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="16.5" cy="9.5" r="1" fill="currentColor" stroke="none" />
      <path d="M 7 14 L 5.5 20 M 17 14 L 18.5 20" />
    </svg>
  );
};

export const DuoIcon = DuocumentairesTvIcon;
export const DuoNavIcon = DuocumentairesTvIcon;

/**
 * ProfileSoloIcon:
 * Symbole officiel « Profil » du projet :
 * Écran-tête singulier en forme de télé retournée formant un visage
 * (rectangle arrondi, deux points pour les yeux, deux petits pieds vintage évasés vers l'extérieur).
 * Utilisée dans la barre de navigation et sur les cartes vidéo pour renvoyer vers le profil.
 * Ne contient JAMAIS de photo.
 */
export const ProfileSoloIcon: React.FC<IconProps> = ({ 
  className = 'w-5 h-5',
  strokeWidth = 1.55 
}) => {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth={strokeWidth} 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
      aria-hidden="true"
    >
      {/* Boîtier / tête rétro compacte du protagoniste solo */}
      <rect x="6.25" y="5.5" width="11.5" height="10.5" rx="2.4" />

      {/* Regard / yeux du protagoniste singulier (2 points nets) */}
      <circle cx="10.3" cy="10.75" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="13.7" cy="10.75" r="0.9" fill="currentColor" stroke="none" />

      {/* Piétement vintage évasé vers l'extérieur (les deux petits pieds) */}
      <path d="M 9.2 16 L 7.4 19.8" />
      <path d="M 14.8 16 L 16.6 19.8" />
    </svg>
  );
};

export { ProfilePhotoTvFrame } from './ProfilePhotoTvFrame';

/**
 * TvPlayerIcon:
 * Symbole officiel « Petite Télé / Lecteur Vidéo » en haut à droite des cartes vidéo.
 * Boîtier rétro compact avec ses deux antennes élégantes pointées vers le haut
 * et ses deux points de mire expressifs.
 */
export const TvPlayerIcon: React.FC<IconProps> = ({ 
  className = 'w-5 h-5',
  strokeWidth = 1.6 
}) => {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth={strokeWidth} 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
      aria-hidden="true"
    >
      {/* Boîtier écran télévision compact */}
      <rect x="6.25" y="8" width="11.5" height="10.5" rx="2.4" />

      {/* Regard / points de mire de l'écran */}
      <circle cx="10.3" cy="13.25" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="13.7" cy="13.25" r="0.9" fill="currentColor" stroke="none" />

      {/* Deux antennes rétro orientées vers le haut et l'extérieur */}
      <path d="M 9.2 8 L 7.4 4.2" />
      <path d="M 14.8 8 L 16.6 4.2" />
    </svg>
  );
};

/**
 * YonywoodDefinitiveLogo:
 * Logo officiel et définitif de YonyWood dessiné à la main avec les deux 'o' formant
 * le double écran TV vintage et les tiges élancées de Y, W et d.
 */
export const YonywoodDefinitiveLogo: React.FC<{ className?: string }> = ({ 
  className = 'h-8 w-auto' 
}) => {
  return (
    <svg 
      viewBox="75 130 835 258" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="YonyWood"
    >
      <g stroke="currentColor" strokeWidth="17.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Y */}
        <path d="M 104 162 C 104 220, 114 242, 158 242 C 158 242, 158 190, 158 162" />
        <path d="M 158 220 L 158 266 C 158 304, 134 316, 108 316 C 96 316, 88 308, 92 296" />

        {/* o */}
        <path d="M 220 212 C 248 212, 260 234, 260 262 C 260 290, 248 308, 220 308 C 192 308, 180 290, 180 262 C 180 234, 192 212, 220 212 Z" />

        {/* n */}
        <path d="M 288 214 L 288 308" />
        <path d="M 288 244 C 298 218, 324 210, 344 210 C 358 210, 368 222, 368 244 L 368 308" />

        {/* y */}
        <path d="M 396 214 C 396 250, 406 268, 436 268 L 442 214" />
        <path d="M 442 250 L 442 334 C 442 368, 418 382, 388 380 C 372 379, 362 366, 374 358" />

        {/* W (tiges élancées) */}
        <path d="M 462 142 L 462 272 C 462 298, 484 310, 508 310 C 532 310, 546 288, 552 248 C 558 288, 574 310, 598 310 C 622 310, 638 296, 638 272 L 638 142" />

        {/* oo: Le double écran TV vintage */}
        <rect x="656" y="214" width="156" height="92" rx="22" ry="22" />
        <line x1="734" y1="214" x2="734" y2="306" />
        <path d="M 696 306 L 674 336" />
        <path d="M 772 306 L 794 336" />
      </g>

      {/* Yeux / témoins au centre des deux écrans */}
      <circle cx="709" cy="260" r="7.5" fill="currentColor" />
      <circle cx="759" cy="260" r="7.5" fill="currentColor" />

      {/* d */}
      <g stroke="currentColor" strokeWidth="17.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M 894 290 C 884 306, 866 310, 850 310 C 824 310, 810 290, 810 262 C 810 234, 824 214, 850 214 C 866 214, 884 218, 894 234" />
        <line x1="894" y1="308" x2="894" y2="142" />
      </g>
    </svg>
  );
};

/**
 * DirectorChairIcon:
 * Symbole « Studio » : Fauteuil de réalisateur officiel YonyWood,
 * directement calibré sur la planche d'exploration (Variante 2/6 et exemple barre de nav) :
 * montants verticaux fins, dossier en toile tendue AVEC COULEUR/REMPLISSAGE PLEIN,
 * accoudoirs extérieurs dégagés, assise nette et piétement ciseau en X.
 */
export const DirectorChairIcon: React.FC<IconProps> = ({ 
  className = 'w-5 h-5',
  strokeWidth = 1.75 
}) => {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth={strokeWidth} 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
      aria-hidden="true"
    >
      {/* Montants verticaux arrière (dépassent légèrement en haut avec petits embouts) */}
      <line x1="7" y1="3" x2="7" y2="13.5" />
      <line x1="17" y1="3" x2="17" y2="13.5" />

      {/* Dossier en toile tendue - AVEC COULEUR PLEINE (fill="currentColor") comme demandé */}
      <rect x="7" y="4.5" width="10" height="4.5" rx="0.5" fill="currentColor" />

      {/* Accoudoirs extérieurs gauche et droite (espace central bien dégagé) */}
      <line x1="3.5" y1="10" x2="7" y2="10" />
      <line x1="17" y1="10" x2="20.5" y2="10" />

      {/* Barre d'assise horizontale */}
      <line x1="5" y1="13.5" x2="19" y2="13.5" />

      {/* Piétement en X (ciseaux de chaise de réalisateur) */}
      <line x1="7" y1="13.5" x2="17" y2="21.5" />
      <line x1="17" y1="13.5" x2="7" y2="21.5" />
    </svg>
  );
};

/**
 * FilmReelIcon:
 * Symbole « Héritage » : Bobine de film épurée et d'une clarté immédiate,
 * avec un grand cercle précis, son moyeu central, 4 perforations circulaires équilibrées
 * et bien visibles en petite taille (nord, est, sud, ouest), et une traîne horizontale
 * nette à la base symbolisant l'amorce de pellicule déroulée.
 */
export const FilmReelIcon: React.FC<IconProps> = ({ 
  className = 'w-5 h-5',
  strokeWidth = 1.75 
}) => {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth={strokeWidth} 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
      aria-hidden="true"
    >
      {/* Grand cercle de la bobine de film (diamètre généreux pour lisibilité parfaite) */}
      <circle cx="11" cy="10.5" r="8.5" />
      
      {/* Moyeu / axe central */}
      <circle cx="11" cy="10.5" r="1.5" fill="currentColor" stroke="none" />
      
      {/* 4 perforations bien proportionnées et contrastées (4 points cardinaux) */}
      <circle cx="11" cy="5.7" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="15.8" cy="10.5" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="11" cy="15.3" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="6.2" cy="10.5" r="1.5" fill="currentColor" stroke="none" />
      
      {/* Traîne de pellicule horizontale et nette à la base */}
      <line x1="10" y1="19" x2="21.5" y2="19" />
    </svg>
  );
};

/**
 * ClapCinemaIcon:
 * Symbole « Productions » : Clap de cinéma avec partie supérieure entrouverte,
 * bandes biseautées et ardoise de tournage inférieure.
 */
export const ClapCinemaIcon: React.FC<IconProps> = ({ 
  className = 'w-5 h-5',
  strokeWidth = 1.5 
}) => {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth={strokeWidth} 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
      aria-hidden="true"
    >
      {/* Ardoise inférieure du clap */}
      <rect x="4" y="11" width="16" height="9.5" rx="1.5" />
      
      {/* Séparateur supérieur de l'ardoise */}
      <line x1="4" y1="14" x2="20" y2="14" />
      
      {/* Rayures du bandeau fixe de l'ardoise */}
      <line x1="8" y1="11" x2="10" y2="14" />
      <line x1="13" y1="11" x2="15" y2="14" />
      <line x1="18" y1="11" x2="20" y2="14" />

      {/* Bras supérieur entrouvert du clap (charnière à gauche en x=4) */}
      <path d="M 4 10.5 L 18.8 6.5 C 19.4 6.3 20.1 6.7 20.3 7.3 L 20.5 8.1 C 20.7 8.7 20.3 9.4 19.7 9.6 L 4.9 13.5" />
      
      {/* Rayures du bras mobile supérieur */}
      <line x1="8.5" y1="9.4" x2="7.5" y2="6.8" />
      <line x1="13.2" y1="8.1" x2="12.2" y2="5.5" />
      <line x1="17.9" y1="6.8" x2="16.9" y2="4.2" />
    </svg>
  );
};

/**
 * YonyWoodLogo:
 * Logo officiel YonyWood en SVG vectoriel pur et monochrome élégant.
 */
export interface YonyWoodLogoProps {
  className?: string;
  color?: string;
}

export const YonyWoodLogo: React.FC<YonyWoodLogoProps> = ({
  className = 'h-8 w-auto',
  color = '#1C1917',
}) => {
  return (
    <svg 
      viewBox="65 115 850 280" 
      fill="none" 
      className={className}
      aria-label="YonyWood"
    >
      <g stroke={color} strokeWidth="17.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Y */}
        <path d="M 104 162 C 104 220, 114 242, 158 242 C 158 242, 158 190, 158 162" />
        <path d="M 158 220 L 158 266 C 158 304, 134 316, 108 316 C 96 316, 88 308, 92 296" />

        {/* o */}
        <path d="M 220 212 C 248 212, 260 234, 260 262 C 260 290, 248 308, 220 308 C 192 308, 180 290, 180 262 C 180 234, 192 212, 220 212 Z" />

        {/* n */}
        <path d="M 288 214 L 288 308" />
        <path d="M 288 244 C 298 218, 324 210, 344 210 C 358 210, 368 222, 368 244 L 368 308" />

        {/* y */}
        <path d="M 396 214 C 396 250, 406 268, 436 268 L 442 214" />
        <path d="M 442 250 L 442 334 C 442 368, 418 382, 388 380 C 372 379, 362 366, 374 358" />

        {/* W */}
        <path d="M 462 142 L 462 272 C 462 298, 484 310, 508 310 C 532 310, 546 288, 552 248 C 558 288, 574 310, 598 310 C 622 310, 638 296, 638 272 L 638 142" />

        {/* oo: Retro Dual-Screen TV */}
        <rect x="656" y="214" width="156" height="92" rx="22" ry="22" />
        <line x1="734" y1="214" x2="734" y2="306" />
        <path d="M 696 306 L 674 336" />
        <path d="M 772 306 L 794 336" />
      </g>

      {/* TV Eyes (Solid Dots) */}
      <circle cx="709" cy="260" r="7.5" fill={color} />
      <circle cx="759" cy="260" r="7.5" fill={color} />

      {/* d */}
      <g stroke={color} strokeWidth="17.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M 894 290 C 884 306, 866 310, 850 310 C 824 310, 810 290, 810 262 C 810 234, 824 214, 850 214 C 866 214, 884 218, 894 234" />
        <line x1="894" y1="308" x2="894" y2="142" />
      </g>
    </svg>
  );
};

/**
 * LumiereSunDotsIcon:
 * Symbole officiel « Lumière » (nouvelle icône transmise par l'utilisateur) :
 * Disque central entouré d'une couronne de huit petits points équidistants.
 * À l'état inactif, reprend la couleur courante (#6E6254 / text-stone-600).
 * À l'état actif, s'affiche en blanc pur (#FFFFFF) au cœur de la capsule terracotta (#A2482B / #9B4F36).
 */
export const LumiereSunDotsIcon: React.FC<IconProps & { isActive?: boolean }> = ({ 
  className = 'w-5 h-5',
  isActive = false
}) => {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className={className}
      aria-hidden="true"
    >
      <title>Lumière</title>
      {/* Disque central */}
      <circle cx="12" cy="12" r="4.4" />
      {/* Couronne de 8 petits points */}
      <circle cx="12" cy="3.2" r="1.15" />
      <circle cx="18.22" cy="5.78" r="1.15" />
      <circle cx="20.8" cy="12" r="1.15" />
      <circle cx="18.22" cy="18.22" r="1.15" />
      <circle cx="12" cy="20.8" r="1.15" />
      <circle cx="5.78" cy="18.22" r="1.15" />
      <circle cx="3.2" cy="12" r="1.15" />
      <circle cx="5.78" cy="5.78" r="1.15" />
    </svg>
  );
};

// Rétrocompatibilité pour tous les imports existants
export const PortraitsViseurIcon = LumiereSunDotsIcon;

/**
 * LineageGenerationsIcon:
 * Symbole officiel « Lignée » : Arbre de filiation généalogique et transmission intergénérationnelle.
 * Nœud racine/ancêtre au sommet relié par une tige verticale à une frise de descendance (trois nœuds de générations).
 */
export const LineageGenerationsIcon: React.FC<IconProps> = ({ 
  className = 'w-5 h-5',
  strokeWidth = 1.6 
}) => {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth={strokeWidth} 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
      aria-hidden="true"
    >
      {/* Nœud ancestral / origine supérieure */}
      <circle cx="12" cy="4.5" r="2.2" />
      {/* Ligne de filiation verticale */}
      <line x1="12" y1="6.7" x2="12" y2="10.5" />
      {/* Barre transversale de filiation familiale */}
      <path d="M 6.5 10.5 L 17.5 10.5" />
      {/* Filiations descendantes vers les générations */}
      <line x1="6.5" y1="10.5" x2="6.5" y2="14.5" />
      <line x1="12" y1="10.5" x2="12" y2="14.5" />
      <line x1="17.5" y1="10.5" x2="17.5" y2="14.5" />
      {/* Nœuds de transmission générationnelle */}
      <circle cx="6.5" cy="17" r="2" />
      <circle cx="12" cy="17" r="2" />
      <circle cx="17.5" cy="17" r="2" />
      {/* Racines de filiation sous la génération centrale */}
      <line x1="12" y1="19" x2="12" y2="21.5" />
    </svg>
  );
};

/**
 * ParcoursDeVieIcon:
 * Symbole officiel « Parcours de vie » : Cheminement sinueux balisé avec 3 étapes de vie charnières.
 * Évoque immédiatement l'itinéraire, les choix, les expériences et l'évolution de la personne.
 */
export const ParcoursDeVieIcon: React.FC<IconProps> = ({ 
  className = 'w-5 h-5',
  strokeWidth = 1.6 
}) => {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth={strokeWidth} 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
      aria-hidden="true"
    >
      {/* Cheminement sinueux fluide */}
      <path d="M 5 19 C 7.5 14, 10.5 15, 12 12 C 13.5 9, 16.5 10, 19 5" />
      {/* 3 jalons d'étapes de vie le long du tracé */}
      <circle cx="5" cy="19" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="19" cy="5" r="2" />
      {/* Point intérieur contrasté au jalon central */}
      <circle cx="12" cy="12" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
};

/**
 * BesoinsHandsIcon:
 * Symbole officiel « Besoins » : Deux mains ouvertes en coupe et accueil de ressources,
 * symbolisant l'appel, la main tendue, le soutien mutuel et les besoins exprimés par le protagoniste.
 */
export const BesoinsHandsIcon: React.FC<IconProps> = ({ 
  className = 'w-5 h-5',
  strokeWidth = 1.6 
}) => {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth={strokeWidth} 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
      aria-hidden="true"
    >
      {/* Main tendue ouverte accueillant une ressource */}
      <path d="M 3 13 C 5 11.5, 7.5 11, 10 12.5 L 13.5 14.5 C 15 15.2, 17 14.5, 18 13.2 L 20.5 10.5 C 21.2 9.7, 21 8.5, 20 8 C 19.2 7.6, 18.2 8, 17.6 8.8 L 15.5 11" />
      <path d="M 7 11.5 L 9 8 C 9.5 7.2, 10.5 7, 11.2 7.5 C 11.8 8, 12 9, 11.5 9.8 L 10 12" />
      {/* Cœur / étincelle d'entraide symbolisant le besoin exprimé */}
      <path d="M 17 3.5 C 16 2.5, 14.5 3, 14.5 4.2 C 14.5 5.5, 17 7.5, 17 7.5 C 17 7.5, 19.5 5.5, 19.5 4.2 C 19.5 3, 18 2.5, 17 3.5 Z" fill="currentColor" stroke="none" />
    </svg>
  );
};

