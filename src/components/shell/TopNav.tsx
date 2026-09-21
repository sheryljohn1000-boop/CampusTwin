import React from 'react';
import { useCampusStore } from '../../store/campusStore';
import { formatTime12h, getTimePhase } from '../../utils/formatters';
import { useLiveWeather, useIstClock } from '../../hooks/useLiveWeather';
import { DayOrder } from '../../types/campus';
import { Sun, CloudRain, Cloud, Droplets, Activity } from 'lucide-react';

export const TopNav: React.FC = () => {
  const { currentTime, dayOrder, setDayOrder, getCampusHealth } = useCampusStore();

  const liveWeather = useLiveWeather();
  const istClock = useIstClock();
  const health = getCampusHealth();
  const timePhase = getTimePhase(currentTime);

  const getWeatherIcon = (code: number) => {
    if (code <= 1) return <Sun className="h-3.5 w-3.5 text-gold" strokeWidth={1.75} />;
    if (code >= 51) return <CloudRain className="h-3.5 w-3.5 text-sky-400" strokeWidth={1.75} />;
    return <Cloud className="h-3.5 w-3.5 text-ink-faint" strokeWidth={1.75} />;
  };

  return (
    <header className="z-30 flex h-14 w-full shrink-0 select-none items-center justify-between border-b border-night-line bg-night-raised px-4 lg:px-6">
      {/* Brand */}
      <div className="flex items-center gap-2.5">
        <span className="h-2 w-2 rounded-full bg-royal shadow-glow-royal" />
        <span className="text-sm font-semibold tracking-tight text-ink">SRM KTR</span>
        <span className="text-ink-faint">/</span>
        <span className="hidden font-mono text-2xs tracking-widest text-ink-faint sm:inline">
          CAMPUS OCCUPANCY TWIN
        </span>
      </div>

      {/* Center: simulated clock */}
      <div className="hidden items-center gap-2.5 md:flex">
        <div className="flex items-center gap-2 rounded-full border border-night-line bg-night-card px-3 py-1 font-mono text-2xs">
          <span className="font-semibold text-ink">{formatTime12h(currentTime)}</span>
          <span className="text-ink-faint">·</span>
          <span className="text-ink-soft">{timePhase.label}</span>
        </div>
      </div>

      {/* Right: Day Order selector + live weather + health */}
      <div className="flex items-center gap-2.5">
        {/* Day Order 1-5 (SRM cycles classes by day order, not weekday) */}
        <div className="flex items-center gap-0.5 rounded-full border border-night-line bg-night-card p-0.5">
          {([1, 2, 3, 4, 5] as DayOrder[]).map((order) => (
            <button
              key={order}
              type="button"
              onClick={() => setDayOrder(order)}
              title={`Day Order ${order} timetable`}
              className={`rounded-full px-2 py-1 font-mono text-2xs transition-colors ${
                dayOrder === order
                  ? 'bg-royal font-semibold text-white shadow-glow-royal'
                  : 'text-ink-soft hover:bg-night-hover hover:text-ink'
              }`}
            >
              {order}
            </button>
          ))}
        </div>

        {/* Live weather: temperature + humidity, live IST clock */}
        <div
          className="flex items-center gap-2 rounded-full border border-night-line bg-night-card px-3 py-1.5 font-mono text-2xs"
          title={
            liveWeather.isLive
              ? 'Live from Open-Meteo · Kattankulathur'
              : 'Connecting to live feed…'
          }
        >
          {getWeatherIcon(liveWeather.weatherCode)}
          <span className="font-semibold tabular-nums text-ink">
            {liveWeather.temperatureC.toFixed(1)}°C
          </span>
          <span className="text-ink-faint">·</span>
          <Droplets className="h-3 w-3 text-sky-400" strokeWidth={1.75} />
          <span className="tabular-nums text-ink-soft">{liveWeather.relativeHumidity}% RH</span>
          <span className="hidden text-ink-faint lg:inline">·</span>
          <span className="hidden font-semibold tabular-nums text-gold lg:inline">
            {istClock} IST
          </span>
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              liveWeather.isLive ? 'animate-pulse bg-royal' : 'bg-ink-faint'
            }`}
          />
        </div>

        {/* Campus health */}
        <div className="hidden items-center gap-1.5 rounded-full border border-night-line bg-night-card px-2.5 py-1.5 font-mono text-2xs lg:flex">
          <Activity className="h-3.5 w-3.5 text-royal" strokeWidth={1.75} />
          <span className="font-semibold tabular-nums text-ink">{health.overallHealthScore}%</span>
          <span className="hidden text-ink-faint xl:inline">{health.status}</span>
        </div>
      </div>
    </header>
  );
};
