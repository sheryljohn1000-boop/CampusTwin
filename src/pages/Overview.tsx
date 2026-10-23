import React from 'react';
import { BarChart3, BellRing, Coffee, Lightbulb } from 'lucide-react';
import { useSensorStore } from '../store/sensorStore';
import { useUiStore } from '../store/uiStore';
import { PageHeader, SectionTitle } from '../components/ui/Primitives';

const CARDS = [
  { id: 'cafeteria' as const, title: 'Cafeteria overview', description: 'Live comfort, occupancy, noise and temperature readings.', icon: Coffee, accent: 'text-emerald-300', border: 'hover:border-emerald-300/50' },
  { id: 'peakHours' as const, title: 'Peak hours', description: 'See the busiest cafeteria periods and lunch-time pressure.', icon: BarChart3, accent: 'text-gold', border: 'hover:border-gold/50' },
  { id: 'insights' as const, title: 'Insights', description: 'Practical recommendations from the simulated sensor feed.', icon: Lightbulb, accent: 'text-royal', border: 'hover:border-royal/60' },
  { id: 'alerts' as const, title: 'Alerts', description: 'Review threshold breaches and conditions needing attention.', icon: BellRing, accent: 'text-amber-300', border: 'hover:border-amber-300/50' },
];

export const Overview: React.FC = () => {
  const cafeteria = useSensorStore((s) => s.cafeteria);
  const dataMode = useSensorStore((s) => s.dataMode);
  const lastUpdateTs = useSensorStore((s) => s.lastUpdateTs);
  const setPage = useUiStore((s) => s.setPage);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-5 lg:px-6">
      <PageHeader title="TP1 Smart Building Twin" subtitle="Turing Hall · Cafeteria command center" mode={dataMode} ts={lastUpdateTs} />
      <div className="mb-7 rounded-card border border-royal/30 bg-gradient-to-br from-royal/10 via-night-card/80 to-night-card p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div><p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-royal">Cafeteria overview</p><h2 className="mt-2 text-xl font-medium tracking-tight text-ink">A clearer view of the day ahead.</h2><p className="mt-1 max-w-xl text-xs leading-relaxed text-ink-soft">Monitor the space, understand lunch-time demand, and jump directly into the view you need.</p></div>
          <button type="button" onClick={() => setPage('cafeteria')} className="rounded-full border border-royal/50 px-3 py-1.5 text-2xs font-medium text-royal transition-colors hover:bg-royal/10">Open cafeteria →</button>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-5 border-t border-night-line/80 pt-4 sm:grid-cols-4">
          <div><p className="text-[10px] uppercase tracking-wider text-ink-faint">Occupancy</p><p className="mt-1 text-2xl font-semibold text-emerald-300">{cafeteria.peopleCount}</p></div>
          <div><p className="text-[10px] uppercase tracking-wider text-ink-faint">Temperature</p><p className="mt-1 text-2xl font-semibold text-teal-200">{cafeteria.temperatureC.toFixed(1)}°C</p></div>
          <div><p className="text-[10px] uppercase tracking-wider text-ink-faint">Humidity</p><p className="mt-1 text-2xl font-semibold text-royal">{cafeteria.relativeHumidity}%</p></div>
          <div><p className="text-[10px] uppercase tracking-wider text-ink-faint">Noise</p><p className="mt-1 text-2xl font-semibold text-gold">{cafeteria.noiseDb} dB</p></div>
        </div>
      </div>
      <SectionTitle>Explore cafeteria intelligence</SectionTitle>
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        {CARDS.map(({ id, title, description, icon: Icon, accent, border }) => (
          <button key={id} type="button" onClick={() => setPage(id)} className={`group rounded-card border border-night-line bg-night-card p-5 text-left transition-all hover:-translate-y-0.5 hover:bg-night-raised ${border}`}>
            <div className="flex items-start justify-between gap-4"><span className={`flex h-10 w-10 items-center justify-center rounded-xl bg-night-raised ${accent}`}><Icon className="h-5 w-5" strokeWidth={1.5} /></span><span className="text-sm text-ink-faint transition-transform group-hover:translate-x-1">→</span></div>
            <h3 className="mt-5 text-sm font-medium text-ink">{title}</h3><p className="mt-1.5 max-w-sm text-xs leading-relaxed text-ink-faint">{description}</p><p className={`mt-5 text-[10px] font-medium ${accent}`}>View details →</p>
          </button>
        ))}
      </div>
    </div>
  );
};
