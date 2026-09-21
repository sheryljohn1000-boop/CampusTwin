import React, { useState } from 'react';
import {
  Map as MapIcon,
  Car,
  Users,
  Building2,
  Bus,
  Utensils,
  UserCheck,
  AlertTriangle,
  Bot,
  SlidersHorizontal,
  Lock,
} from 'lucide-react';

interface NavModule {
  id: string;
  name: string;
  icon: React.ElementType;
  stage: string;
  description: string;
  built: boolean;
}

const NAV_MODULES: NavModule[] = [
  {
    id: 'map',
    name: 'Campus Map',
    icon: MapIcon,
    stage: 'Active',
    description: 'Live map, occupancy telemetry and zone inspection.',
    built: true,
  },
  {
    id: 'parking',
    name: 'Smart Parking',
    icon: Car,
    stage: 'Stage 2',
    description: 'Multi-level parking occupancy, sensor telemetry & EV routing.',
    built: false,
  },
  {
    id: 'crowd',
    name: 'Crowd Density',
    icon: Users,
    stage: 'Stage 3',
    description: 'Pedestrian density tracking, bottleneck prediction & surge alerts.',
    built: false,
  },
  {
    id: 'buildings',
    name: 'Building & HVAC',
    icon: Building2,
    stage: 'Stage 4',
    description: 'Energy curves, air quality & HVAC control.',
    built: false,
  },
  {
    id: 'shuttle',
    name: 'Shuttle Transit',
    icon: Bus,
    stage: 'Stage 5',
    description: 'Fleet GPS tracker, arrival ETAs & passenger count.',
    built: false,
  },
  {
    id: 'mess',
    name: 'Dining Flow',
    icon: Utensils,
    stage: 'Stage 6',
    description: 'Queue estimation, meal inventory & nutritional flow.',
    built: false,
  },
  {
    id: 'attendance',
    name: 'Attendance Intelligence',
    icon: UserCheck,
    stage: 'Stage 7',
    description: 'Automated lecture attendance & geofence check-ins.',
    built: false,
  },
  {
    id: 'emergency',
    name: 'Emergency Matrix',
    icon: AlertTriangle,
    stage: 'Stage 8',
    description: 'Incident response, evacuation routes & muster points.',
    built: false,
  },
  {
    id: 'assistant',
    name: 'Campus Copilot',
    icon: Bot,
    stage: 'Stage 9',
    description: 'Natural-language campus query agent & scheduler.',
    built: false,
  },
  {
    id: 'whatif',
    name: 'What-If Sandbox',
    icon: SlidersHorizontal,
    stage: 'Stage 10',
    description: 'Scenario simulator: closures, surges & infrastructure testing.',
    built: false,
  },
];

export const Sidebar: React.FC = () => {
  const [activeModule] = useState<string>('map');
  const [hoveredModule, setHoveredModule] = useState<NavModule | null>(null);

  return (
    <aside className="z-20 flex w-14 shrink-0 select-none flex-col items-center border-r border-night-line bg-night-raised py-4 lg:w-16">
      <nav className="flex w-full flex-1 flex-col items-center gap-1.5 px-2">
        {NAV_MODULES.map((mod) => {
          const Icon = mod.icon;
          const isActive = mod.id === activeModule;
          const isBuilt = mod.built;

          return (
            <div
              key={mod.id}
              className="group relative flex w-full justify-center"
              onMouseEnter={() => setHoveredModule(mod)}
              onMouseLeave={() => setHoveredModule(null)}
            >
              <button
                type="button"
                disabled={!isBuilt}
                className={`relative flex h-11 w-11 items-center justify-center rounded-xl transition-colors lg:h-12 lg:w-12 ${
                  isActive
                    ? 'bg-royal text-white shadow-glow-royal'
                    : isBuilt
                    ? 'text-ink-soft hover:bg-night-hover hover:text-ink'
                    : 'text-ink-faint opacity-40'
                }`}
              >
                <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
                {!isBuilt && (
                  <Lock className="absolute bottom-1.5 right-1.5 h-2 w-2 opacity-60" strokeWidth={2} />
                )}
              </button>

              {/* Hover flyout */}
              {hoveredModule?.id === mod.id && (
                <div className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 w-60 -translate-y-1/2 rounded-card border border-night-line bg-night-card p-3 shadow-lift">
                  <div className="mb-1 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Icon className={`h-3.5 w-3.5 ${isBuilt ? 'text-royal' : 'text-ink-faint'}`} strokeWidth={1.75} />
                      <span className="text-xs font-semibold text-ink">{mod.name}</span>
                    </div>
                    <span
                      className={`rounded-full px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider ${
                        isBuilt ? 'bg-royal-soft text-royal' : 'bg-night-hover text-ink-faint'
                      }`}
                    >
                      {mod.stage}
                    </span>
                  </div>
                  <p className="text-2xs leading-relaxed text-ink-soft">{mod.description}</p>
                  {!isBuilt && (
                    <div className="mt-2 border-t border-night-line pt-2 text-[10px] text-ink-faint">
                      Coming in a later stage
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="pt-2 text-center font-mono text-[9px] tracking-widest text-ink-faint">
        <span className="hidden lg:inline">v2.0</span>
      </div>
    </aside>
  );
};
