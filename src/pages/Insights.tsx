import React from 'react';
import { useSensorStore } from '../store/sensorStore';
import { PageHeader } from '../components/ui/Primitives';
import { Insight } from '../types/sensors';

const CATEGORY_META: Record<
  Insight['category'],
  { label: string; classes: string }
> = {
  anomaly: { label: 'Anomaly detection', classes: 'text-red-400' },
  trend: { label: 'Historical trend', classes: 'text-royal' },
  energy: { label: 'Energy saving', classes: 'text-emerald-300' },
  comfort: { label: 'Comfort', classes: 'text-sky-300' },
  ops: { label: 'Operations', classes: 'text-gold' },
};

export const Insights: React.FC = () => {
  const insights = useSensorStore((s) => s.insights);
  const dataMode = useSensorStore((s) => s.dataMode);
  const lastUpdateTs = useSensorStore((s) => s.lastUpdateTs);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-5 lg:px-6">
      <PageHeader
        title="Insights & Recommendations"
        subtitle="Rule-based analysis with sample data — the foundation for backend analytics"
        mode={dataMode}
        ts={lastUpdateTs}
      />

      <div className="mb-4 rounded-card border border-royal/30 bg-royal-soft p-3 text-2xs leading-relaxed text-royal">
        <strong>Transparency note:</strong> these are rule-based example insights
        generated from the simulated readings, labelled as such — not outputs of a
        trained ML model. The architecture reserves an{' '}
        <span className="font-mono">insights[]</span> channel so the Python backend
        (anomaly detection + trend analysis) will publish here once connected.
      </div>

      <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
        {insights.map((ins) => {
          const meta = CATEGORY_META[ins.category];
          return (
            <div
              key={ins.id}
              className="rounded-card border border-night-line bg-night-card p-4"
            >
              <div className="mb-2 flex items-center justify-between gap-3">
                <span
                  className={`flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-wider ${meta.classes}`}
                >
                  {meta.label}
                </span>
                <span className="text-[10px] text-ink-faint">{ins.zoneName}</span>
              </div>
              <h3 className="text-sm font-semibold text-ink">{ins.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-ink-soft">{ins.detail}</p>
            </div>
          );
        })}
      </div>

    </div>
  );
};
