import React, { useEffect, useRef } from 'react';
import { Play, Pause, Clock } from 'lucide-react';
import { useCampusStore } from '../../store/campusStore';
import { formatTime12h, getTimePhase } from '../../utils/formatters';
import { TimePresets } from './TimePresets';

export const TimeMachineSlider: React.FC = () => {
  const {
    currentTime,
    setTime,
    advanceTime,
    isPlaying,
    togglePlay,
    playbackSpeed,
    setPlaybackSpeed,
    dayOrder,
  } = useCampusStore();

  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());

  // Simulation tick loop
  useEffect(() => {
    if (!isPlaying) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    lastTimeRef.current = performance.now();

    const tick = (now: number) => {
      const deltaMs = now - lastTimeRef.current;
      lastTimeRef.current = now;
      const deltaHours = (deltaMs / 1000) * (playbackSpeed / 25);
      advanceTime(deltaHours);
      animationFrameRef.current = requestAnimationFrame(tick);
    };

    animationFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, playbackSpeed, advanceTime]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTime(parseFloat(e.target.value));
  };

  const currentPercent = (currentTime / 24) * 100;
  const timePhase = getTimePhase(currentTime);

  return (
    <div className="z-20 w-full select-none border-t border-night-line bg-night-raised px-4 py-3 md:px-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-2.5">
        {/* Top row: title, time readout, presets */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-ink-faint" strokeWidth={1.75} />
              <span className="text-2xs font-medium uppercase tracking-widest text-ink-faint">
                24h simulation
              </span>
            </div>

            <div className="h-3.5 w-px bg-night-line" />

            <div className="flex items-baseline gap-1.5 font-mono text-2xs">
              <span className="font-semibold text-ink">{formatTime12h(currentTime)}</span>
              <span className="hidden text-ink-faint md:inline">· {timePhase.label}</span>
            </div>
          </div>

          <TimePresets />
        </div>

        {/* Slider */}
        <div className="relative pb-0.5 pt-0.5">
          {/* Track */}
          <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-night-hover">
            <div
              className="h-full rounded-full bg-gradient-to-r from-royal-deep to-royal transition-[width] duration-75"
              style={{ width: `${currentPercent}%` }}
            />
          </div>

          <input
            type="range"
            min="0"
            max="23.99"
            step="0.05"
            value={currentTime}
            onChange={handleSliderChange}
            className="absolute inset-0 z-10 h-full w-full cursor-ew-resize opacity-0"
            aria-label="Simulation time of day"
          />

          {/* Handle */}
          <div
            className="pointer-events-none absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${currentPercent}%` }}
          >
            <div className="h-3.5 w-3.5 rounded-full border-2 border-royal bg-night-card shadow-glow-royal" />
          </div>

          {/* Hour ticks */}
          <div className="mt-1.5 flex justify-between px-0.5 font-mono text-[9px] text-ink-faint">
            <span>00:00</span>
            <span className="hidden sm:inline">06:00</span>
            <span>08:00 · P1</span>
            <span className="hidden sm:inline">12:25 · Lunch</span>
            <span>16:00</span>
            <span className="hidden sm:inline">20:00</span>
            <span>24:00</span>
          </div>
        </div>

        {/* Bottom row: play controls */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={togglePlay}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-2xs font-semibold transition-colors ${
                isPlaying
                  ? 'bg-night-hover text-ink hover:bg-night-line'
                  : 'bg-royal text-white shadow-glow-royal hover:bg-royal-deep'
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="h-3 w-3 fill-current" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-3 w-3 fill-current" />
                  Play
                </>
              )}
            </button>

            <div className="flex items-center gap-0.5 rounded-full border border-night-line bg-night-card p-0.5">
              {[1, 5, 15, 30].map((speed) => (
                <button
                  key={speed}
                  type="button"
                  onClick={() => setPlaybackSpeed(speed)}
                  className={`rounded-full px-2 py-0.5 font-mono text-2xs transition-colors ${
                    playbackSpeed === speed
                      ? 'bg-royal font-semibold text-white'
                      : 'text-ink-soft hover:bg-night-hover hover:text-ink'
                  }`}
                >
                  {speed}×
                </button>
              ))}
            </div>
          </div>

          <span className="hidden font-mono text-[9px] text-ink-faint sm:inline">
            Occupancy follows the Day Order {dayOrder} timetable
          </span>
        </div>
      </div>
    </div>
  );
};
