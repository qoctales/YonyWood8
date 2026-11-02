/**
 * Utilitaires de formatage de texte pour les cartes vidéo et badges YonyWood.
 * Règle stricte d'affichage : Seule la première lettre est en majuscule,
 * tout le reste est en minuscule (Sentence case).
 */

export const formatFirstLetterOnly = (text?: string | null): string => {
  if (!text) return '';
  const trimmed = text.trim();
  if (!trimmed) return '';
  const lower = trimmed.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
};
