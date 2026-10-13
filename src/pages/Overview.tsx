import React from 'react';
import { BellRing } from 'lucide-react';
import { useSensorStore, useActiveAlerts } from '../store/sensorStore';
import { useUiStore } from '../store/uiStore';
import {
  PageHeader,
  MetricTile,
  StatusCard,
  SectionTitle,
} from '../components/ui/Primitives';

const COMFORT_TEMP: [number, number] = [19, 29]; // °C
const COMFORT_HUM: [number, number] = [40, 75]; // %

function withinComfort(value: number, [lo, hi]: [number, number]): boolean {
  return value >= lo && value <= hi;
}

export const Overview: React.FC = () => {
  const ground = useSensorStore((s) => s.ground);
  const cafeteria = useSensorStore((s) => s.cafeteria);
  const smartLightingOn = useSensorStore((s) => s.smartLightingOn);
  const dataMode = useSensorStore((s) => s.dataMode);
  const lastUpdateTs = useSensorStore((s) => s.lastUpdateTs);
  const alerts = useActiveAlerts();
  const setPage = useUiStore((s) => s.setPage);

  // Statuses
  const groundOk =
    withinComfort(ground.temperatureC, COMFORT_TEMP) &&
    withinComfort(ground.relativeHumidity, COMFORT_HUM);
  const cafOk =
    withinComfort(cafeteria.temperatureC, COMFORT_TEMP) && cafeteria.noiseDb < 80;
  const buildingStatus = groundOk && cafOk ? 'good' : 'warn';
  const buildingLabel = groundOk && cafOk ? 'Normal' : 'Attention';

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-5 lg:px-6">
      <PageHeader
        title="TP1 Smart Building Twin"
        subtitle="Turing Hall · Ground Floor & Cafeteria — sensor demo (no hardware connected yet)"
        mode={dataMode}
        ts={lastUpdateTs}
      />

      {/* Top: building-wide status cards */}
      <SectionTitle
        right={
          <button
            type="button"
            onClick={() => setPage('alerts')}
            className="text-2xs font-medium text-royal hover:underline"
          >
            All alerts →
          </button>
        }
      >
        Building status
      </SectionTitle>
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        <StatusCard
          title="TP1 · Overall building"
          statusLabel={buildingLabel}
          statusTone={buildingStatus as 'good' | 'warn'}
          rows={[
            { label: 'Ground floor', value: groundOk ? 'Comfortable' : 'Out of band' },
            { label: 'Cafeteria', value: cafOk ? 'Comfortable' : 'Check conditions' },
            {
              label: 'Zones monitored',
              value: '2',
            },
            { label: 'Feed', value: dataMode === 'LIVE DATA' ? 'LIVE' : 'SIM' },
          ]}
          onClick={() => setPage('ground')}
        />

        <StatusCard
          title="Ground Floor"
          statusLabel={groundOk ? 'Comfortable' : 'Check env'}
          statusTone={groundOk ? 'good' : 'warn'}
          rows={[
            { label: 'Temperature', value: `${ground.temperatureC.toFixed(1)}°C` },
            { label: 'Humidity', value: `${ground.relativeHumidity}% RH` },
            { label: 'Ambient light', value: `${ground.lightLux} lux` },
            {
              label: 'Motion',
              value: ground.motionDetected ? 'Detected' : 'None',
              dot: ground.motionDetected ? 'bg-gold' : undefined,
            },
          ]}
          onClick={() => setPage('ground')}
        />

        <StatusCard
          title="Cafeteria"
          statusLabel={cafOk ? 'Comfortable' : 'Check env'}
          statusTone={cafOk ? 'good' : 'warn'}
          rows={[
            { label: 'Est. people', value: `${cafeteria.peopleCount}` },
            { label: 'Noise', value: `${cafeteria.noiseDb} dB` },
            { label: 'Temperature', value: `${cafeteria.temperatureC.toFixed(1)}°C` },
          ]}
          onClick={() => setPage('cafeteria')}
        />
      </div>

      {/* Middle: environment strip */}
      <div className="mt-6">
        <SectionTitle>Current environment · whole building</SectionTitle>
        <div className="grid grid-cols-2 gap-x-8 gap-y-5 md:grid-cols-4 lg:grid-cols-6">
          <MetricTile
            label="Temp (avg)"
            value={`${((ground.temperatureC + cafeteria.temperatureC) / 2).toFixed(1)}°C`}
            tone="sky"
          />
          <MetricTile
            label="Humidity (avg)"
            value={`${Math.round((ground.relativeHumidity + cafeteria.relativeHumidity) / 2)}% RH`}
            tone="royal"
          />
          <MetricTile
            label="Light (ground)"
            value={`${ground.lightLux} lux`}
            tone="gold"
          />
          <MetricTile
            label="Smart lighting"
            value={smartLightingOn ? 'On' : 'Off'}
            sub={smartLightingOn ? 'motion + dark' : 'no trigger'}
            tone={smartLightingOn ? 'gold' : 'neutral'}
          />
          <MetricTile
            label="Motion (ground)"
            value={ground.motionDetected ? 'Active' : 'Clear'}
            tone={ground.motionDetected ? 'amber' : 'neutral'}
          />
          <MetricTile
            label="Est. TP1 people"
            value={`${cafeteria.peopleCount}`}
            sub="cafeteria only"
            tone="royal"
          />
        </div>
      </div>

      {/* Cafeteria strip */}
      <div className="mt-6 grid grid-cols-1 gap-3.5 lg:grid-cols-2">
        <div className="rounded-card border border-night-line bg-night-card p-4">
          <SectionTitle
            right={
              <button
                type="button"
                onClick={() => setPage('cafeteria')}
                className="text-2xs font-medium text-royal hover:underline"
              >
                Details →
              </button>
            }
          >
            Cafeteria operations
          </SectionTitle>
          <div className="grid grid-cols-2 gap-x-8 gap-y-5">
            <MetricTile
              label="Occupancy"
              value={`${cafeteria.peopleCount}`}
              tone="royal"
            />
            <MetricTile
              label="Noise"
              value={`${cafeteria.noiseDb} dB`}
              tone={cafeteria.noiseDb > 75 ? 'amber' : 'emerald'}
            />
          </div>
        </div>

        {/* Latest alerts */}
        <div className="rounded-card border border-night-line bg-night-card p-4">
          <SectionTitle
            right={
              <button
                type="button"
                onClick={() => setPage('alerts')}
                className="text-2xs font-medium text-royal hover:underline"
              >
                All →
              </button>
            }
          >
            Active alerts & warnings
          </SectionTitle>

          <div className="space-y-2">
            {alerts.length === 0 ? (
              <p className="text-2xs text-ink-faint">
                No active threshold alerts right now.
              </p>
            ) : (
              alerts.slice(0, 3).map((a) => (
                <div
                  key={a.id}
                  className="flex items-start gap-2.5 rounded-card border border-night-line bg-night-raised p-2.5"
                >
                  <BellRing
                    className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${
                      a.severity === 'critical'
                        ? 'text-red-400'
                        : a.severity === 'warning'
                        ? 'text-amber-300'
                        : 'text-sky-300'
                    }`}
                    strokeWidth={1.75}
                  />
                  <div className="min-w-0">
                    <div className="text-2xs font-semibold text-ink">
                      {a.zoneName} · {a.metricLabel}
                    </div>
                    <div className="text-[10px] leading-snug text-ink-soft">{a.message}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <p className="mt-6 rounded-card border border-gold/30 bg-gold-soft p-3 text-2xs leading-relaxed text-gold">
        All values on this page are <strong>SIMULATED DATA</strong> from a demo generative
        model. Real ESP32 readings will flow through the same data layer once the
        hardware is connected.
      </p>
    </div>
  );
};
