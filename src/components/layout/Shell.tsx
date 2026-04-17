import type { ReactNode } from 'react';
import { TopBar } from './TopBar';
import { FilterSidebar } from '../filters/FilterSidebar';
import { PaperPanel } from '../detail/PaperPanel';
import { Legend } from './Legend';
import { useFilterStore } from '../../store/useFilterStore';

export function Shell({ children }: { children: ReactNode }) {
  const layout = useFilterStore((s) => s.layout);
  return (
    <div className="h-full w-full flex flex-col">
      <TopBar />
      <div className="flex-1 flex overflow-hidden">
        <FilterSidebar />
        <main className="flex-1 relative overflow-hidden">
          {children}
          {layout === 'force' && <Legend />}
        </main>
        <PaperPanel />
      </div>
    </div>
  );
}
