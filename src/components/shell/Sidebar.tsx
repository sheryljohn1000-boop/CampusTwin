import React, { useState } from 'react';
import { useUiStore } from '../../store/uiStore';
import {
  HomeIcon,
  CupIcon,
  BellIcon,
  ChartIcon,
} from '../ui/LineIcons';

type AppPage = 'overview' | 'cafeteria' | 'peakHours' | 'alerts' | 'insights';

const NAV_ITEMS: { id: AppPage; name: string; icon: React.FC<{ className?: string; strokeWidth?: number }> }[] = [
  { id: 'overview', name: 'Overview', icon: HomeIcon },
  { id: 'cafeteria', name: 'Cafeteria', icon: CupIcon },
  { id: 'peakHours', name: 'Peak Hours', icon: ChartIcon },
  { id: 'alerts', name: 'Alerts', icon: BellIcon },
  { id: 'insights', name: 'Insights', icon: ChartIcon },
];

export const Sidebar: React.FC = () => {
  const { activePage, setPage } = useUiStore();
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <aside className="z-20 flex w-16 shrink-0 select-none flex-col items-center border-r border-night-line bg-night-raised/80 py-5">
      <nav className="flex w-full flex-1 flex-col items-center gap-2 px-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === activePage;

          return (
            <div
              key={item.id}
              className="group relative flex w-full justify-center"
              onMouseEnter={() => setHovered(item.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <button
                type="button"
                onClick={() => setPage(item.id)}
                className={`relative flex h-11 w-11 items-center justify-center rounded-xl transition-all ${
                  isActive ? 'text-royal' : 'text-ink-faint hover:text-ink'
                }`}
                aria-label={item.name}
              >
                <Icon className="h-[22px] w-[22px]" strokeWidth={1.4} />
                {isActive && (
                  <span className="absolute -left-2 h-5 w-[2px] rounded-full bg-royal shadow-glow-royal" />
                )}
              </button>

              {/* Minimal hover label */}
              {hovered === item.id && (
                <div className="pointer-events-none absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 rounded-lg border border-night-line bg-night-card px-2.5 py-1 text-2xs font-medium tracking-wide text-ink shadow-lift">
                  {item.name}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
};
