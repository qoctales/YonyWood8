import React from 'react';
import { MatrixExplorer } from '../MatrixExplorer';

export const DemoHeritagesSection: React.FC = () => {
  return (
    <div className="w-full h-[calc(100dvh-130px)] min-h-[660px] rounded-3xl overflow-hidden relative border border-stone-200/80 shadow-xs bg-white">
      <MatrixExplorer 
        onNavigate={() => {}} 
        isLandingDemo={true}
        initialZoom={0.78}
        hideModeToggle={true}
      />
    </div>
  );
};
