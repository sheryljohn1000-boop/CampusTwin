import React from 'react';
import { BellRing, BellOff } from 'lucide-react';
import { useSensorStore, useActiveAlerts } from '../store/sensorStore';
import { PageHeader } from '../components/ui/Primitives';

export const Alerts: React.FC = () => {
  const alerts = useActiveAlerts().filter((alert) => alert.zoneId === 'tp1-cafeteria');
  const dismissAlert = useSensorStore((s) => s.dismissAlert);
  const dataMode = useSensorStore((s) => s.dataMode);
  const lastUpdateTs = useSensorStore((s) => s.lastUpdateTs);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-5 lg:px-6">
      <PageHeader
        title="Alerts & Warnings"
        subtitle="Threshold breaches for the TP1 Cafeteria"
        mode={dataMode}
        ts={lastUpdateTs}
      />

      {alerts.length === 0 ? (
        <div className="rounded-card border border-night-line bg-night-card p-8 text-center">
          <BellRing className="mx-auto mb-2 h-5 w-5 text-ink-faint" strokeWidth={1.5} />
          <p className="text-xs font-medium text-ink">No active alerts</p>
          <p className="mt-1 text-2xs text-ink-faint">
            All monitored metrics are inside their configured thresholds. Alerts appear
            here the moment a live reading crosses a limit.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {alerts.map((a) => (
            <div
              key={a.id}
              className={`flex items-start justify-between gap-3 rounded-card border bg-night-card p-3.5 ${
                a.severity === 'critical'
                  ? 'border-red-400/40'
                  : a.severity === 'warning'
                  ? 'border-amber-400/40'
                  : 'border-sky-400/30'
              }`}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                    a.severity === 'critical'
                      ? 'bg-red-400/15 text-red-400'
                      : a.severity === 'warning'
                      ? 'bg-amber-400/15 text-amber-300'
                      : 'bg-sky-400/10 text-sky-300'
                  }`}
                >
                  <BellRing className="h-3.5 w-3.5" strokeWidth={1.75} />
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-2xs font-semibold text-ink">
                      {a.zoneName} · {a.metricLabel}
                    </span>
                    <span
                      className={`rounded-full px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider ${
                        a.severity === 'critical'
                          ? 'bg-red-400/15 text-red-400'
                          : a.severity === 'warning'
                          ? 'bg-amber-400/15 text-amber-300'
                          : 'bg-sky-400/10 text-sky-300'
                      }`}
                    >
                      {a.severity}
                    </span>
                  </div>
                  <p className="mt-0.5 text-2xs text-ink-soft">{a.message}</p>
                  {a.value !== undefined && a.threshold !== undefined && (
                    <p className="mt-1 font-mono text-[10px] text-ink-faint">
                      current <span className="text-ink">{a.value}{a.unit}</span> ·
                      threshold <span className="text-ink">{a.threshold}{a.unit}</span> ·
                      at {new Date(a.timestamp).toLocaleTimeString()}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => dismissAlert(a.id)}
                title="Dismiss until it re-triggers"
                className="shrink-0 rounded-full border border-night-line p-1.5 text-ink-faint transition-colors hover:bg-night-hover hover:text-ink"
              >
                <BellOff className="h-3.5 w-3.5" strokeWidth={1.75} />
              </button>
            </div>
          ))}
        </div>
      )}

      <p className="mt-4 text-[10px] leading-relaxed text-ink-faint">
        Alerts are evaluated client-side on every feed tick (3 s) against the thresholds
        configured on the zone pages. Dismissed alerts return automatically when the
        reading crosses back into range and breaches again.
      </p>
    </div>
  );
};
