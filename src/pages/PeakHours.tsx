import React from 'react';
import { useSensorStore } from '../store/sensorStore';
import { useUiStore } from '../store/uiStore';
import { PageHeader, SectionTitle } from '../components/ui/Primitives';

const HOURLY_PEOPLE = [
  { time: '07:00', people: 24 }, { time: '08:00', people: 68 },
  { time: '09:00', people: 42 }, { time: '10:00', people: 32 },
  { time: '11:00', people: 96 }, { time: '12:00', people: 218, lunch: true },
  { time: '13:00', people: 184, lunch: true }, { time: '14:00', people: 76 },
  { time: '15:00', people: 54 }, { time: '16:00', people: 38 },
  { time: '17:00', people: 62 }, { time: '18:00', people: 28 },
];

export const PeakHours: React.FC = () => {
  const dataMode = useSensorStore((s) => s.dataMode);
  const lastUpdateTs = useSensorStore((s) => s.lastUpdateTs);
  const cafeteria = useSensorStore((s) => s.cafeteria);
  const setPage = useUiStore((s) => s.setPage);
  const max = Math.max(...HOURLY_PEOPLE.map((point) => point.people));
  const busiest = HOURLY_PEOPLE.reduce((peak, point) => point.people > peak.people ? point : peak);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-5 lg:px-6">
      <PageHeader title="Peak Hours" subtitle="Cafeteria traffic patterns across the day" mode={dataMode} ts={lastUpdateTs} />
      <div className="mb-6 grid grid-cols-1 gap-3.5 sm:grid-cols-3">
        <div className="rounded-card border border-royal/30 bg-royal-soft p-4">
          <p className="text-[10px] uppercase tracking-[0.18em] text-ink-faint">Busiest period</p>
          <p className="mt-2 text-2xl font-semibold text-royal">{busiest.time}</p>
          <p className="mt-1 text-2xs text-ink-soft">{busiest.people} estimated people</p>
        </div>
        <div className="rounded-card border border-gold/30 bg-gold-soft p-4">
          <p className="text-[10px] uppercase tracking-[0.18em] text-ink-faint">Lunch window</p>
          <p className="mt-2 text-2xl font-semibold text-gold">12:00–14:00</p>
          <p className="mt-1 text-2xs text-ink-soft">Plan staffing for the surge</p>
        </div>
        <div className="rounded-card border border-night-line bg-night-card p-4">
          <p className="text-[10px] uppercase tracking-[0.18em] text-ink-faint">Right now</p>
          <p className="mt-2 text-2xl font-semibold text-emerald-300">{cafeteria.peopleCount}</p>
          <p className="mt-1 text-2xs text-ink-soft">estimated people in cafeteria</p>
        </div>
      </div>

      <div className="rounded-card border border-night-line bg-night-card p-5">
        <SectionTitle right={<span className="text-2xs text-gold">Lunch peak highlighted</span>}>Estimated occupancy by hour</SectionTitle>
        <div className="relative flex h-72 items-end gap-2 border-b border-night-line px-1 pt-8 sm:gap-3">
          <div className="pointer-events-none absolute inset-x-0 top-8 border-t border-dashed border-gold/20" />
          {HOURLY_PEOPLE.map((point) => (
            <div key={point.time} className="group flex h-full flex-1 flex-col items-center justify-end gap-2">
              <span className="text-[10px] font-mono text-ink-faint opacity-0 transition-opacity group-hover:opacity-100">{point.people}</span>
              <div className={`w-full max-w-12 rounded-t-md transition-all group-hover:brightness-125 ${point.lunch ? 'bg-gold shadow-[0_0_18px_rgba(245,190,70,0.2)]' : 'bg-royal/70'}`} style={{ height: `${Math.max(8, (point.people / max) * 220)}px` }} />
              <span className={`text-[9px] font-mono ${point.lunch ? 'text-gold' : 'text-ink-faint'}`}>{point.time}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-4 text-[10px] text-ink-faint">
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-royal/70" />Regular activity</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-gold" />Lunch peak</span>
          <button type="button" onClick={() => setPage('cafeteria')} className="ml-auto text-royal hover:underline">Open cafeteria details →</button>
        </div>
      </div>
      <p className="mt-4 text-[10px] leading-relaxed text-ink-faint">Peak-hour values are representative simulated patterns and will be replaced by historical cafeteria occupancy data when the live sensor feed is connected.</p>
    </div>
  );
};
