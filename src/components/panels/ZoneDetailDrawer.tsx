import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock } from 'lucide-react';
import { useCampusStore } from '../../store/campusStore';
import { getOccupancyColor, getCategoryLabel, formatTime24h } from '../../utils/formatters';
import { ZoneOccupancyChart } from './ZoneOccupancyChart';

/**
 * Minimal zone panel: live occupancy figure, 24h projection chart, and the
 * Day Order timetable sheet — in the royal dark theme.
 */
export const ZoneDetailDrawer: React.FC = () => {
  const {
    zones,
    selectedZoneId,
    selectZone,
    currentTime,
    dayOrder,
    getZoneOccupancyAtTime,
  } = useCampusStore();

  const zone = zones.find((z) => z.id === selectedZoneId);
  if (!zone) return null;

  const { occupancy, percentage, level } = getZoneOccupancyAtTime(zone, currentTime);
  const color = getOccupancyColor(level);
  const schedule = zone.timetable?.[dayOrder] ?? [];
  const currentPeriod = schedule.find(
    (p) => currentTime >= p.startDecimal && currentTime < p.endDecimal
  );

  return (
    <AnimatePresence>
      <motion.aside
        initial={{ x: '100%', opacity: 0.6 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed bottom-0 right-0 top-14 z-40 flex w-[340px] flex-col overflow-y-auto border-l border-night-line bg-night-raised md:w-[380px]"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-night-line px-5 py-4">
          <div>
            <div className="mb-0.5 flex items-center gap-2">
              <span className="rounded-full bg-royal-soft px-2 py-0.5 text-2xs font-mono font-semibold text-royal">
                {zone.code}
              </span>
              <span className="text-2xs font-medium text-ink-faint">
                {getCategoryLabel(zone.category)}
              </span>
            </div>
            <h2 className="text-sm font-semibold tracking-tight text-ink">{zone.name}</h2>
            <p className="mt-0.5 text-2xs text-ink-faint">{zone.fullName}</p>
          </div>

          <button
            type="button"
            onClick={() => selectZone(null)}
            className="rounded-full p-1.5 text-ink-faint transition-colors hover:bg-night-hover hover:text-ink"
            aria-label="Close panel"
          >
            <X className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>

        <div className="flex-1 space-y-6 px-5 py-5">
          {/* Occupancy number */}
          <section>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-2xs font-medium uppercase tracking-widest text-ink-faint">
                Live occupancy
              </span>
              <span className="flex items-center gap-1.5 text-2xs font-medium" style={{ color: color.svgFill }}>
                <span className={`h-1.5 w-1.5 rounded-full ${color.dotColor}`} />
                {level}
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-semibold tracking-tight tabular-nums text-ink">
                {occupancy.toLocaleString()}
              </span>
              <span className="text-xs text-ink-faint">
                / {zone.capacity.toLocaleString()} capacity
              </span>
            </div>

            {/* Capacity meter */}
            <div className="mt-3">
              <div className="mb-1 flex justify-between text-2xs text-ink-soft">
                <span>Capacity utilized</span>
                <span className="font-semibold tabular-nums" style={{ color: color.svgFill }}>
                  {percentage}%
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-night-hover">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(100, percentage)}%`,
                    backgroundColor: color.svgFill,
                  }}
                />
              </div>
            </div>
          </section>

          {/* 24h projection chart */}
          <section>
            <div className="mb-1 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-ink-faint" strokeWidth={1.75} />
                <span className="text-2xs font-medium uppercase tracking-widest text-ink-faint">
                  24h projection
                </span>
              </div>
              <span className="font-mono text-2xs text-ink-faint">
                @ {formatTime24h(currentTime)}
              </span>
            </div>

            <ZoneOccupancyChart zone={zone} currentTime={currentTime} />
          </section>

          {/* Day Order timetable sheet */}
          <section>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-2xs font-medium uppercase tracking-widest text-ink-faint">
                Timetable
              </span>
              <span className="rounded-full bg-gold-soft px-2 py-0.5 text-2xs font-semibold text-gold">
                Day Order {dayOrder}
              </span>
            </div>

            {schedule.length === 0 ? (
              <p className="rounded-card border border-night-line bg-night-card p-3 text-2xs text-ink-faint">
                No published timetable for this building.
              </p>
            ) : (
              <div className="overflow-hidden rounded-card border border-night-line bg-night-card">
                {schedule.map((p, idx) => {
                  const isBreak = p.type === 'break';
                  const isFree = p.subjectCode === 'FREE';
                  const isNow = currentPeriod?.periodNumber === p.periodNumber;
                  const isLast = idx === schedule.length - 1;

                  return (
                    <div
                      key={`${p.periodNumber}-${idx}`}
                      className={`flex items-center gap-3 px-3.5 py-2.5 ${
                        !isLast ? 'border-b border-night-line' : ''
                      } ${isNow ? 'bg-royal-soft' : ''}`}
                    >
                      {/* Period number */}
                      <span
                        className={`w-8 shrink-0 text-center font-mono text-2xs font-semibold ${
                          isBreak ? 'text-ink-faint' : isNow ? 'text-royal' : 'text-ink-soft'
                        }`}
                      >
                        {isBreak ? '—' : p.periodNumber}
                      </span>

                      {/* Time slot */}
                      <span className="w-[92px] shrink-0 font-mono text-2xs tabular-nums text-ink-faint">
                        {p.timeSlot}
                      </span>

                      {/* Subject & room */}
                      <div className="min-w-0 flex-1 leading-tight">
                        <div
                          className={`truncate text-2xs font-medium ${
                            isBreak || isFree ? 'italic text-ink-faint' : 'text-ink'
                          }`}
                        >
                          {p.subjectName}
                        </div>
                        <div className="truncate text-[10px] text-ink-faint">
                          {isBreak || isFree ? p.room : `${p.room} · ${p.faculty}`}
                        </div>
                      </div>

                      {/* Type dot: gold = lab, faint = theory */}
                      {!isBreak && !isFree && (
                        <span
                          className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                            p.type === 'lab' ? 'bg-gold' : 'bg-ink-faint'
                          }`}
                          title={p.type === 'lab' ? 'Lab' : 'Theory'}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            <p className="mt-2 text-[10px] leading-relaxed text-ink-faint">
              Day Orders rotate 1 → 5 across working days; the campus cycles to the next
              order after each holiday or exam day. Sunday is a holiday.
            </p>
          </section>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
};
