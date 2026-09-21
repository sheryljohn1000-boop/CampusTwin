import React from 'react';
import { SrmLiveMap } from './components/map/SrmLiveMap';
import { ZoneDetailDrawer } from './components/panels/ZoneDetailDrawer';
import { TimeMachineSlider } from './components/timemachine/TimeMachineSlider';
import { TopNav } from './components/shell/TopNav';
import { Sidebar } from './components/shell/Sidebar';

export const App: React.FC = () => {
  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-night font-sans text-ink antialiased">
      <TopNav />

      <div className="relative flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="relative flex flex-1 flex-col overflow-hidden">
          {/* Live Google-style map of SRM KTR */}
          <div className="relative flex-1 overflow-hidden">
            <SrmLiveMap />
          </div>

          {/* 24-hour simulation controller */}
          <TimeMachineSlider />
        </main>

        <ZoneDetailDrawer />
      </div>
    </div>
  );
};

export default App;
