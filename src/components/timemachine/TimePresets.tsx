import React from 'react';
import { useCampusStore } from '../../store/campusStore';

interface Preset {
  label: string;
  hour: number;
  description: string;
}

const PRESETS: Preset[] = [
  { label: 'First Period', hour: 8.1, description: 'P1 · 08:00 — towers filling up' },
  { label: 'Midday', hour: 10.5, description: 'P3–P4 · peak lecture load' },
  { label: 'Lunch', hour: 12.8, description: '12:25–13:25 — Java Food Court surge' },
  { label: 'Lab Block', hour: 14.0, description: 'P6&7 · 13:25 — labs at capacity' },
  { label: 'Last Period', hour: 15.3, description: 'P8 · 15:10 — final stretch' },
  { label: 'Evening', hour: 19.0, description: 'Dinner flow, hostels refilling' },
  { label: 'Late Night', hour: 23.0, description: 'Library late hours, dorms at peak' },
];

export const TimePresets: React.FC = () => {
  const { currentTime, setTime } = useCampusStore();

  return (
    <div className="flex max-w-full items-center gap-1 overflow-x-auto pb-0.5">
      <span className="mr-1 hidden font-mono text-[9px] uppercase tracking-widest text-ink-faint sm:inline">
        Jump
      </span>
      {PRESETS.map((preset) => {
        const isCurrent = Math.abs(currentTime - preset.hour) < 0.4;

        return (
          <button
            key={preset.label}
            type="button"
            onClick={() => setTime(preset.hour)}
            title={preset.description}
            className={`whitespace-nowrap rounded-full px-2.5 py-1 text-2xs transition-colors ${
              isCurrent
                ? 'bg-royal font-semibold text-white'
                : 'text-ink-soft hover:bg-night-hover hover:text-ink'
            }`}
          >
            {preset.label}
          </button>
        );
      })}
    </div>
  );
};
