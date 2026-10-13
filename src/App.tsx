import React from 'react';
import { TopNav } from './components/shell/TopNav';
import { Sidebar } from './components/shell/Sidebar';
import { useUiStore } from './store/uiStore';
import { Overview } from './pages/Overview';
import { GroundFloor } from './pages/GroundFloor';
import { Cafeteria } from './pages/Cafeteria';
import { Alerts } from './pages/Alerts';
import { Insights } from './pages/Insights';

const PAGES: Record<string, React.ComponentType> = {
  overview: Overview,
  ground: GroundFloor,
  cafeteria: Cafeteria,
  alerts: Alerts,
  insights: Insights,
};

export const App: React.FC = () => {
  const activePage = useUiStore((s) => s.activePage);
  const PageComponent = PAGES[activePage] ?? Overview;

  return (
    <div className="relative flex h-screen w-screen flex-col overflow-hidden bg-night font-sans text-ink antialiased">
      {/* Ambient decor: aurora glow + halftone texture (fixed, behind app) */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-40 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-royal/10 blur-[120px]" />
        <div className="absolute -bottom-52 -right-24 h-[380px] w-[560px] rounded-full bg-royal/8 blur-[110px]" />
        <div className="halftone absolute right-0 top-0 h-64 w-64 opacity-40 [mask-image:radial-gradient(circle_at_top_right,black,transparent_75%)]" />
        <div className="halftone absolute bottom-0 left-0 h-56 w-56 opacity-30 [mask-image:radial-gradient(circle_at_bottom_left,black,transparent_75%)]" />
      </div>

      <div className="relative z-10 flex h-full flex-col">
      <TopNav />

      <div className="relative flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="relative flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <PageComponent />
          </div>
        </main>
      </div>
      </div>
    </div>
  );
};

export default App;
