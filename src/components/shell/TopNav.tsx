import React from 'react';
import { useLiveWeather, useIstClock } from '../../hooks/useLiveWeather';
import { Sun, CloudRain, Cloud } from 'lucide-react';

export const TopNav: React.FC = () => {
  const liveWeather = useLiveWeather();
  const istClock = useIstClock();

  const getWeatherIcon = (code: number) => {
    if (code <= 1) return <Sun className="h-3.5 w-3.5 text-gold" strokeWidth={1.75} />;
    if (code >= 51) return <CloudRain className="h-3.5 w-3.5 text-sky-400" strokeWidth={1.75} />;
    return <Cloud className="h-3.5 w-3.5 text-ink-faint" strokeWidth={1.75} />;
  };

  return (
    <header className="z-30 flex h-14 w-full shrink-0 select-none items-center justify-between border-b border-night-line px-5 lg:px-7">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <span className="h-2 w-2 rounded-full bg-royal shadow-glow-royal" />
        <span className="text-base font-semibold tracking-tight text-ink">TP1</span>
        <span className="hidden text-xs font-medium tracking-[0.2em] text-ink-faint sm:inline">
          SMART BUILDING TWIN
        </span>
      </div>

      {/* Right: live weather + clock, floating type only */}
      <div className="flex items-center gap-5 font-mono text-2xs">
        <div
          className="flex items-center gap-2"
          title={
            liveWeather.isLive
              ? 'Live from Open-Meteo · Kattankulathur'
              : 'Connecting to live feed…'
          }
        >
          {getWeatherIcon(liveWeather.weatherCode)}
          <span className="font-medium tabular-nums text-ink">
            {liveWeather.temperatureC.toFixed(1)}°C
          </span>
          <span className="text-ink-faint">·</span>
          <span className="tabular-nums text-ink-soft">{liveWeather.relativeHumidity}% RH</span>
        </div>

        <span className="h-4 w-px bg-night-line" />

        <span className="font-medium tabular-nums text-gold">{istClock}</span>
      </div>
    </header>
  );
};
