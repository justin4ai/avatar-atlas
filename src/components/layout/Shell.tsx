import type { ReactNode } from 'react';
import { Github, Mail } from 'lucide-react';
import { TopBar } from './TopBar';
import { FilterSidebar } from '../filters/FilterSidebar';
import { PaperPanel } from '../detail/PaperPanel';
import { Legend } from './Legend';
import { useFilterStore } from '../../store/useFilterStore';

export function Shell({ children }: { children: ReactNode }) {
  const layout = useFilterStore((s) => s.layout);
  const sidebarOpen = useFilterStore((s) => s.sidebarOpen);
  const setSidebarOpen = useFilterStore((s) => s.setSidebarOpen);
  return (
    <div className="h-full w-full flex flex-col">
      <TopBar />
      <div className="flex-1 flex overflow-hidden relative">
        {sidebarOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black/50 z-30 animate-fade-in"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <FilterSidebar />
        <main className="flex-1 relative overflow-hidden min-w-0">
          {children}
          {layout === 'force' && <Legend />}
        </main>
        <PaperPanel />
      </div>
      <FeedbackBar />
    </div>
  );
}

function FeedbackBar() {
  return (
    <div className="flex-none flex items-center justify-center sm:justify-end gap-3 sm:gap-4 px-4 sm:px-6 py-2 border-t border-white/5 bg-black/20 font-mono text-[10.5px] uppercase tracking-[0.16em] text-white/45">
      <span className="hidden sm:inline text-white/35">
        Found a wrong tag or missing paper?
      </span>
      <a
        href="https://github.com/justin4ai/avatar-taxonomy/issues"
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1.5 hover:text-white transition"
      >
        <Github size={11} />
        issues
      </a>
      <span className="text-white/15">·</span>
      <a
        href="mailto:justinahn@kaist.ac.kr"
        className="inline-flex items-center gap-1.5 hover:text-white transition"
      >
        <Mail size={11} />
        justinahn@kaist.ac.kr
      </a>
    </div>
  );
}
