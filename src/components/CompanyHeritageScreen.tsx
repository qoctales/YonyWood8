import React from 'react';
import { ViewScreen } from '../types';
import { CompanyEntity, CompanyStakeholder, COMPANIES_DATA } from '../data/companyPortraitsData';
import { FocusScreen } from './FocusScreen';

export type { CompanyStakeholder, CompanyEntity };
export { COMPANIES_DATA };

export interface CompanyHeritageScreenProps {
  onNavigate?: (screen: ViewScreen) => void;
  initialCompanyId?: string;
  selectedCompanyId?: string;
  initialTopicId?: string;
}

export const ENTERPRISE_CATEGORIES = [
  'HISTOIRE',
  'FONDATION',
  'VISION',
  'PHILOSOPHIE',
  'PRODUITS & SERVICES',
  'CRÉATIVITÉ & INNOVATION',
  'IMPACT',
  'ENGAGEMENT'
] as const;

export type EnterpriseCategory = typeof ENTERPRISE_CATEGORIES[number];

export interface CompanyDuo {
  id: string;
  category: EnterpriseCategory;
  themeQuestion: string;
  companyA: CompanyEntity;
  companyB: CompanyEntity;
}

export const COMPANY_DUOS: CompanyDuo[] = [
  {
    id: 'c-duo-1',
    category: 'HISTOIRE',
    themeQuestion: 'Comment est née votre histoire et quelles racines continuent de vous porter ?',
    companyA: COMPANIES_DATA[2] || COMPANIES_DATA[0],
    companyB: COMPANIES_DATA[0] || COMPANIES_DATA[1],
  }
];

/**
 * Redirige et intègre la nouvelle expérience Focus (remplaçant « Entreprise »)
 */
export const CompanyHeritageScreen: React.FC<CompanyHeritageScreenProps> = (props) => {
  return (
    <FocusScreen 
      onNavigate={props.onNavigate}
      initialTopicId={props.initialTopicId || props.initialCompanyId || props.selectedCompanyId}
      selectedCompanyId={props.selectedCompanyId}
    />
  );
};
