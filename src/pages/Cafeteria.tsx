import React from 'react';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  CartesianGrid,
} from 'recharts';
import { useSensorStore, useActiveAlerts } from '../store/sensorStore';
import type { CafeteriaHistoryPoint } from '../data/sensorFeed';
import {
  PageHeader,
  MetricTile,
  SectionTitle,
} from '../components/ui/Primitives';
import { ThresholdSlider } from '../components/ui/ThresholdSlider';

const CHART_TOOLTIP_STYLE = {
  backgroundColor: '#0a1a16',
  border: '1px solid #12352d',
  borderRadius: 10,
  fontSize: 11,
} as const;

export const Cafeteria: React.FC = () => {
  const cafeteria = useSensorStore((s) => s.cafeteria);
  const history = useSensorStore((s) => s.cafeteriaHistory);
  const thresholds = useSensorStore((s) => s.thresholds);
  const setThreshold = useSensorStore((s) => s.setThreshold);
  const dataMode = useSensorStore((s) => s.dataMode);
  const lastUpdateTs = useSensorStore((s) => s.lastUpdateTs);
  const allAlerts = useActiveAlerts();
  const zoneAlerts = allAlerts.filter((a) => a.zoneId === 'tp1-cafeteria');

  const chartData = (history as CafeteriaHistoryPoint[]).slice(-40).map((r) => ({
    t: new Date(r.ts).toLocaleTimeString([], { minute: '2-digit', second: '2-digit' }),
    people: r.peopleCount,
    noise: r.noiseDb,
    temp: r.temperatureC,
  }));

  const occOver = cafeteria.peopleCount > thresholds.occupancyHigh;
  const noiseOver = cafeteria.noiseDb > thresholds.noiseHigh;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-5 lg:px-6">
      <PageHeader
        title="TP1 Cafeteria Twin"
        subtitle="Occupancy · comfort · noise — sensor demo, hardware not yet connected"
        mode={dataMode}
        ts={lastUpdateTs}
      />

      {/* Metric row */}
      <div className="grid grid-cols-2 gap-x-8 gap-y-5 md:grid-cols-4">
        <MetricTile
          label="Est. people"
          value={`${cafeteria.peopleCount}`}
          sub={`alert ≤ ${thresholds.occupancyHigh}`}
          tone={occOver ? 'red' : 'royal'}
        />
        <MetricTile
          label="Temperature"
          value={`${cafeteria.temperatureC.toFixed(1)}°C`}
          sub={`comfort ≤ ${thresholds.comfortTempHigh}°C`}
          tone={cafeteria.temperatureC > thresholds.comfortTempHigh ? 'amber' : 'sky'}
        />
        <MetricTile
          label="Humidity"
          value={`${cafeteria.relativeHumidity}% RH`}
          sub={`comfort ≤ ${thresholds.comfortHumHigh}% RH`}
          tone={cafeteria.relativeHumidity > thresholds.comfortHumHigh ? 'amber' : 'royal'}
        />
        <MetricTile
          label="Noise"
          value={`${cafeteria.noiseDb} dB`}
          sub={`limit ${thresholds.noiseHigh} dB`}
          tone={noiseOver ? 'amber' : 'emerald'}
        />
      </div>

      {/* Occupancy history chart */}
      <div className="mt-5 rounded-card border border-night-line bg-night-card p-4">
        <SectionTitle>Occupancy history</SectionTitle>
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
              <CartesianGrid stroke="#12352d" strokeOpacity={0.5} vertical={false} />
              <XAxis
                dataKey="t"
                tick={{ fill: '#5f7f72', fontSize: 9 }}
                tickLine={false}
                interval="preserveStartEnd"
                minTickGap={30}
              />
              <YAxis tick={{ fill: '#5f7f72', fontSize: 9 }} tickLine={false} width={26} />
              <Tooltip contentStyle={CHART_TOOLTIP_STYLE} labelStyle={{ color: '#a6a4bd' }} cursor={{ stroke: '#12352d', strokeDasharray: '3 3' }} />
              <ReferenceLine y={thresholds.occupancyHigh} stroke="#f9a8a8" strokeDasharray="3 3" strokeOpacity={0.6} />
              <Line type="monotone" dataKey="people" name="People" stroke="#3dd68c" strokeWidth={1.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Noise history chart */}
      <div className="mt-5 rounded-card border border-night-line bg-night-card p-4">
        <SectionTitle>Noise history</SectionTitle>
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
              <CartesianGrid stroke="#12352d" strokeOpacity={0.5} vertical={false} />
              <XAxis
                dataKey="t"
                tick={{ fill: '#5f7f72', fontSize: 9 }}
                tickLine={false}
                interval="preserveStartEnd"
                minTickGap={30}
              />
              <YAxis tick={{ fill: '#5f7f72', fontSize: 9 }} tickLine={false} width={26} />
              <Tooltip contentStyle={CHART_TOOLTIP_STYLE} labelStyle={{ color: '#a6a4bd' }} />
              <ReferenceLine y={thresholds.noiseHigh} stroke="#5eead4" strokeDasharray="3 3" strokeOpacity={0.6} />
              <Line type="monotone" dataKey="noise" name="Noise dB" stroke="#a8f0c8" strokeWidth={1.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Temperature history chart */}
      <div className="mt-5 rounded-card border border-night-line bg-night-card p-4">
        <SectionTitle>Temperature history</SectionTitle>
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
              <CartesianGrid stroke="#12352d" strokeOpacity={0.5} vertical={false} />
              <XAxis
                dataKey="t"
                tick={{ fill: '#5f7f72', fontSize: 9 }}
                tickLine={false}
                interval="preserveStartEnd"
                minTickGap={30}
              />
              <YAxis tick={{ fill: '#5f7f72', fontSize: 9 }} tickLine={false} width={26} />
              <Tooltip contentStyle={CHART_TOOLTIP_STYLE} labelStyle={{ color: '#a6a4bd' }} />
              <ReferenceLine y={thresholds.comfortTempHigh} stroke="#f9a8a8" strokeDasharray="3 3" strokeOpacity={0.6} />
              <Line type="monotone" dataKey="temp" name="Temp °C" stroke="#5eead4" strokeWidth={1.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Alert thresholds */}
      <div className="mt-5 rounded-card border border-night-line bg-night-card p-4">
        <SectionTitle>Alert thresholds (configurable)</SectionTitle>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          <ThresholdSlider
            label="High occupancy"
            unit=" ppl"
            min={80}
            max={260}
            step={5}
            value={thresholds.occupancyHigh}
            onChange={(v) => setThreshold('occupancyHigh', v)}
          />
          <ThresholdSlider
            label="High noise"
            unit=" dB"
            min={50}
            max={100}
            step={1}
            value={thresholds.noiseHigh}
            onChange={(v) => setThreshold('noiseHigh', v)}
          />
          <ThresholdSlider
            label="Comfort temp max"
            unit="°C"
            min={22}
            max={34}
            step={0.5}
            value={thresholds.comfortTempHigh}
            onChange={(v) => setThreshold('comfortTempHigh', v)}
          />
          <ThresholdSlider
            label="Comfort humidity max"
            unit="%"
            min={50}
            max={90}
            step={1}
            value={thresholds.comfortHumHigh}
            onChange={(v) => setThreshold('comfortHumHigh', v)}
          />
        </div>
      </div>

      {/* Zone alerts */}
      <div className="mt-5 rounded-card border border-night-line bg-night-card p-4">
        <SectionTitle>Alerts · Cafeteria</SectionTitle>
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
      </div>  </div>
 );
};
