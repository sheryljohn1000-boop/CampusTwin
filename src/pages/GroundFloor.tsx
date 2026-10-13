import React from 'react';
import {
  Lightbulb,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { useSensorStore, useActiveAlerts } from '../store/sensorStore';
import type { GroundHistoryPoint } from '../data/sensorFeed';
import {
  PageHeader,
  MetricTile,
  SectionTitle,
  DataModeBadge,
  TimeStamp,
} from '../components/ui/Primitives';
import { ThresholdSlider } from '../components/ui/ThresholdSlider';

export const GroundFloor: React.FC = () => {
  const ground = useSensorStore((s) => s.ground);
  const history = useSensorStore((s) => s.groundHistory);
  const smartLightingOn = useSensorStore((s) => s.smartLightingOn);
  const thresholds = useSensorStore((s) => s.thresholds);
  const setThreshold = useSensorStore((s) => s.setThreshold);
  const dataMode = useSensorStore((s) => s.dataMode);
  const lastUpdateTs = useSensorStore((s) => s.lastUpdateTs);
  const allAlerts = useActiveAlerts();
  const zoneAlerts = allAlerts.filter((a) => a.zoneId === 'tp1-ground');

  const chartData = (history as GroundHistoryPoint[]).slice(-40).map((r) => ({
    t: new Date(r.ts).toLocaleTimeString([], { minute: '2-digit', second: '2-digit' }),
    temp: r.temperatureC,
    hum: r.relativeHumidity,
    lux: r.lightLux,
  }));

  const lightingRuleSatisfied = ground.motionDetected && ground.lightLux < thresholds.lightDark;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-5 lg:px-6">
      <PageHeader
        title="TP1 Ground Floor Twin"
        subtitle="Environment · motion · smart lighting — sensor demo, hardware not yet connected"
        mode={dataMode}
        ts={lastUpdateTs}
      />

      {/* Metric row */}
      <div className="grid grid-cols-2 gap-x-8 gap-y-5 md:grid-cols-3 lg:grid-cols-5">
        <MetricTile
          label="Temperature"
          value={`${ground.temperatureC.toFixed(1)}°C`}
          sub={`limit ${thresholds.tempHigh}°C`}
          tone={ground.temperatureC > thresholds.tempHigh ? 'red' : 'sky'}
        />
        <MetricTile
          label="Humidity"
          value={`${ground.relativeHumidity}% RH`}
          sub={`limit ${thresholds.humidityHigh}% RH`}
          tone={ground.relativeHumidity > thresholds.humidityHigh ? 'amber' : 'royal'}
        />
        <MetricTile
          label="Ambient light"
          value={`${ground.lightLux} lux`}
          sub={`dark below ${thresholds.lightDark} lux`}
          tone={ground.lightLux < thresholds.lightDark ? 'gold' : 'emerald'}
        />
        <MetricTile
          label="Motion"
          value={ground.motionDetected ? 'Detected' : 'Clear'}
          tone={ground.motionDetected ? 'amber' : 'neutral'}
        />
        <MetricTile
          label="Smart lighting"
          value={smartLightingOn ? 'On' : 'Off'}
          sub={lightingRuleSatisfied ? 'trigger active' : 'no trigger'}
          tone={smartLightingOn ? 'gold' : 'neutral'}
        />
      </div>

      {/* Smart lighting simulation panel */}
      <div className="mt-5 rounded-card border border-night-line bg-night-card p-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h3 className="text-xs font-semibold text-ink">Automatic lighting rule</h3>
            <p className="text-2xs text-ink-faint">
              Simulated relay: lights activate when motion is detected while ambient light
              is below the dark threshold.
            </p>
          </div>
          <span
            className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-2xs font-semibold ${
              smartLightingOn
                ? 'border-gold/50 bg-gold-soft text-gold'
                : 'border-night-line bg-night-raised text-ink-faint'
            }`}
          >
            <Lightbulb className="h-3.5 w-3.5" strokeWidth={1.75} />
            {smartLightingOn ? 'LIGHTS ON' : 'LIGHTS OFF'}
          </span>
        </div>

        {/* Rule visualization */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-2xs">
          <span
            className={`rounded-full px-2 py-1 ${
              ground.motionDetected ? 'bg-amber-400/15 text-amber-300' : 'bg-night-hover text-ink-faint'
            }`}
          >
            motion {ground.motionDetected ? '●' : '○'}
          </span>
          <span className="text-ink-faint">AND</span>
          <span
            className={`rounded-full px-2 py-1 ${
              ground.lightLux < thresholds.lightDark ? 'bg-royal-soft text-royal' : 'bg-night-hover text-ink-faint'
            }`}
          >
            lux {ground.lightLux} &lt; {thresholds.lightDark}
          </span>
          <span className="text-ink-faint">→</span>
          <span
            className={`rounded-full px-2 py-1 font-semibold ${
              smartLightingOn ? 'bg-gold text-night' : 'bg-night-hover text-ink-faint'
            }`}
          >
            relays {smartLightingOn ? 'CLOSED' : 'OPEN'}
          </span>
        </div>
      </div>

      {/* Env history chart */}
      <div className="mt-5 rounded-card border border-night-line bg-night-card p-4">
        <SectionTitle right={<TimeStamp ts={lastUpdateTs} label="Latest reading" />}>
          Environment history (live sim, ~3s per tick)
        </SectionTitle>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
              <XAxis
                dataKey="t"
                tick={{ fill: '#5f7f72', fontSize: 9 }}
                tickLine={false}
                interval="preserveStartEnd"
                minTickGap={40}
              />
              <YAxis tick={{ fill: '#5f7f72', fontSize: 9 }} tickLine={false} width={30} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0a1a16',
                  border: '1px solid #12352d',
                  borderRadius: 10,
                  fontSize: 11,
                }}
                labelStyle={{ color: '#a6a4bd' }}
                formatter={(value: number | string, name: string) => [value, String(name)]}
              />
              <Line type="monotone" dataKey="temp" name="Temp °C" stroke="#5eead4" strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="hum" name="Humidity %" stroke="#3dd68c" strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="lux" name="Lux" stroke="#a8f0c8" strokeWidth={0} dot={false} hide />
              <ReferenceLine y={thresholds.tempHigh} stroke="#f9a8a8" strokeDasharray="3 3" strokeOpacity={0.6} />
              <ReferenceLine y={thresholds.humidityHigh} stroke="#5eead4" strokeDasharray="3 3" strokeOpacity={0.6} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-2 text-[10px] text-ink-faint">
          Temperature °C and humidity % plotted; ambient lux appears in the hover
          tooltip. Dashed lines mark the current alert thresholds.
        </p>
      </div>

      {/* Threshold configuration */}
      <div className="mt-5 rounded-card border border-night-line bg-night-card p-4">
        <SectionTitle>Alert thresholds (configurable)</SectionTitle>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <ThresholdSlider
            label="High temperature"
            unit="°C"
            min={20}
            max={40}
            step={0.5}
            value={thresholds.tempHigh}
            onChange={(v) => setThreshold('tempHigh', v)}
          />
          <ThresholdSlider
            label="Low temperature"
            unit="°C"
            min={10}
            max={22}
            step={0.5}
            value={thresholds.tempLow}
            onChange={(v) => setThreshold('tempLow', v)}
          />
          <ThresholdSlider
            label="High humidity"
            unit="%"
            min={40}
            max={95}
            step={1}
            value={thresholds.humidityHigh}
            onChange={(v) => setThreshold('humidityHigh', v)}
          />
          <ThresholdSlider
            label="Dark-light cutoff"
            unit=" lux"
            min={10}
            max={400}
            step={10}
            value={thresholds.lightDark}
            onChange={(v) => setThreshold('lightDark', v)}
          />
        </div>

        <div className="mt-3 flex items-center gap-3">
          <DataModeBadge mode={dataMode} />
        </div>
      </div>

      {/* Zone alerts */}
      <div className="mt-5 rounded-card border border-night-line bg-night-card p-4">
        <SectionTitle>Alerts · Ground Floor</SectionTitle>
        {zoneAlerts.length === 0 ? (
          <p className="text-2xs text-ink-faint">
            All readings are within the configured thresholds.
          </p>
        ) : (
          <div className="space-y-2">
            {zoneAlerts.map((a) => (
              <div
                key={a.id}
                className={`flex items-start gap-2.5 rounded-card border bg-night-raised p-2.5 ${
                  a.severity === 'critical'
                    ? 'border-red-400/40'
                    : a.severity === 'warning'
                    ? 'border-amber-400/40'
                    : 'border-sky-400/30'
                }`}
              >
                <span
                  className={`mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                    a.severity === 'critical'
                      ? 'bg-red-400'
                      : a.severity === 'warning'
                      ? 'bg-amber-300'
                      : 'bg-sky-300'
                  }`}
                />
                <div className="min-w-0">
                  <div className="text-2xs font-semibold text-ink">{a.metricLabel}</div>
                  <div className="text-[10px] text-ink-soft">{a.message}</div>
                  {a.value !== undefined && a.threshold !== undefined && (
                    <div className="mt-0.5 font-mono text-[10px] text-ink-faint">
                      current {a.value}
                      {a.unit} · threshold {a.threshold}
                      {a.unit} · {new Date(a.timestamp).toLocaleTimeString()}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
