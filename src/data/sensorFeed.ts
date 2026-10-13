import {
  CafeteriaStats,
  DataMode,
  EnvStats,
  FeedStatus,
  SensorZoneId,
} from '../types/sensors';

export interface GroundHistoryPoint extends EnvStats {
  ts: number;
}
export interface CafeteriaHistoryPoint extends CafeteriaStats {
  ts: number;
}

/**
 * ─── TP1 Sensor Feed ────────────────────────────────────────────────────────
 * A modular data layer with a SINGLE seam the future ESP32/MQTT backend will
 * plug into. The dashboard subscribes via `useSensorFeed()` and never touches
 * simulation internals — swap `startSimulatedTicker` for the MQTT bridge
 * in `connectRealBroker()` and every UI keeps working identically.
 *
 * Planned production path:
 *   ESP32 (Wi-Fi, MQTT client) → broker (mosquitto) → Python backend
 *   (paho-mqtt consumer → Postgres → FastAPI re-publish) → this feed.
 * Anomaly detection runs server-side in Python; the browser stays a viewer.
 */

// ── Zone simulation parameters ─────────────────────────────────────────────
const SIM_PARAMS: Record<
  SensorZoneId,
  {
    baseTemp: number;
    baseHum: number;
    baseLight: number;
    motionProbability: number;
    baseNoise: number;
    occupancyProfile: number[]; // 24-hour people-count multiplier
    capacity: number;
  }
> = {
  'tp1-ground': {
    baseTemp: 25.5,
    baseHum: 55,
    baseLight: 340, // daylight through glass facade
    motionProbability: 0.35,
    baseNoise: 0,
    occupancyProfile: [
      0.05, 0.03, 0.02, 0.02, 0.03, 0.08, 0.25, 0.6,
      0.85, 0.92, 0.9, 0.85, 0.55, 0.8, 0.88, 0.82,
      0.5, 0.28, 0.18, 0.12, 0.08, 0.05, 0.03, 0.02,
    ],
    capacity: 500,
  },
  'tp1-cafeteria': {
    baseTemp: 26.5,
    baseHum: 58,
    baseLight: 300,
    motionProbability: 0.75,
    baseNoise: 62,
    occupancyProfile: [
      0.02, 0.01, 0.01, 0.01, 0.02, 0.05, 0.2, 0.55,
      0.35, 0.2, 0.25, 0.65, 0.95, 0.92, 0.4, 0.3,
      0.72, 0.85, 0.78, 0.6, 0.42, 0.18, 0.06, 0.02,
    ],
    capacity: 260,
  },
};

/**
 * Interpolates the 24h occupancy multiplier profile so minute-level ticks
 * move smoothly instead of jumping on the hour. Returns minutes-precision.
 */
function interpolatedProfileFactor(zoneId: SensorZoneId, now: Date): number {
  const profile = SIM_PARAMS[zoneId].occupancyProfile;
  const t = now.getHours() + now.getMinutes() / 60;
  const h1 = Math.floor(t) % 24;
  const h2 = (h1 + 1) % 24;
  const frac = t - Math.floor(t);
  return profile[h1] * (1 - frac) + profile[h2] * frac;
}

/** Smooth-random walk helper: keeps consecutive readings related. */
function drift(prev: number, next: number, step: number): number {
  const delta = next - prev;
  const clampedDelta = Math.max(-step, Math.min(step, delta));
  return prev + clampedDelta + (Math.random() - 0.5) * step * 0.3;
}

/**
 * SIMULATED data generation — clearly labelled as such in the UI.
 * Uses real wall-clock time (not the campus TimeMachine slider) because the
 * sensor feed represents the physical building, not the occupancy forecast.
 */
function generateGroundFloorStats(prev?: EnvStats): EnvStats {
  const now = new Date();
  const base = SIM_PARAMS['tp1-ground'];
  const hourFactor = interpolatedProfileFactor('tp1-ground', now);
  const isNight = now.getHours() < 7 || now.getHours() >= 19;

  const tempTarget = base.baseTemp + hourFactor * 3.5 + (isNight ? -1.5 : 0);
  const humTarget = base.baseHum + (isNight ? 6 : -4) + (Math.random() - 0.5) * 3;
  const lightTarget = isNight ? 28 : base.baseLight * (0.6 + Math.random() * 0.5);
  const motion = Math.random() < base.motionProbability * (hourFactor * 2 + 0.2);

  return {
    temperatureC: prev
      ? Math.round(drift(prev.temperatureC, tempTarget, 0.4) * 10) / 10
      : Math.round(tempTarget * 10) / 10,
    relativeHumidity: prev ? Math.round(drift(prev.relativeHumidity, humTarget, 2)) : Math.round(humTarget),
    lightLux: prev ? Math.round(drift(prev.lightLux, lightTarget, 30)) : Math.round(lightTarget),
    motionDetected: motion,
  };
}

function generateCafeteriaStats(prev?: CafeteriaStats): CafeteriaStats {
  const now = new Date();
  const base = SIM_PARAMS['tp1-cafeteria'];
  const hourFactor = interpolatedProfileFactor('tp1-cafeteria', now);

  const peopleTarget = Math.round(base.capacity * hourFactor);
  const tempTarget = base.baseTemp + hourFactor * 3; // crowd → warm room
  const humTarget = base.baseHum + hourFactor * 6;   // crowd → humid room
  const noiseTarget = 45 + hourFactor * 30;          // empty ~45dB, packed ~75dB

  const stats: CafeteriaStats = {
    peopleCount: prev
      ? Math.max(0, Math.round(drift(prev.peopleCount, peopleTarget, 6)))
      : Math.max(0, peopleTarget + Math.round((Math.random() - 0.5) * 10)),
    temperatureC: prev
      ? Math.round(drift(prev.temperatureC, tempTarget, 0.4) * 10) / 10
      : Math.round(tempTarget * 10) / 10,
    relativeHumidity: prev ? Math.round(drift(prev.relativeHumidity, humTarget, 2)) : Math.round(humTarget),
    noiseDb: prev ? Math.round(drift(prev.noiseDb, noiseTarget, 3)) : Math.round(noiseTarget),
  };

  return stats;
}

// ── Feed state (module-singleton, consumed by the zustand store) ─────────────

export interface SensorFeedState {
  mode: DataMode;
  brokerUrl: string;
  lastTickTs: number;
  ground: EnvStats;
  groundHistory: GroundHistoryPoint[];
  cafeteria: CafeteriaStats;
  cafeteriaHistory: CafeteriaHistoryPoint[];
}

export const sensorFeed: SensorFeedState = {
  mode: 'SIMULATED DATA',
  brokerUrl: '',
  lastTickTs: Date.now(),
  ground: generateGroundFloorStats(),
  groundHistory: [],
  cafeteria: generateCafeteriaStats(),
  cafeteriaHistory: [],
};

let ticker: ReturnType<typeof setInterval> | null = null;

export function startSimulatedTicker(onTick: (s: SensorFeedState) => void): void {
  if (ticker) return;
  const tick = () => {
    sensorFeed.ground = generateGroundFloorStats(sensorFeed.ground);
    sensorFeed.groundHistory = [
      ...sensorFeed.groundHistory.slice(-119),
      { ...sensorFeed.ground, ts: Date.now() },
    ];
    const caf = generateCafeteriaStats(sensorFeed.cafeteria);
    sensorFeed.cafeteria = caf;
    sensorFeed.cafeteriaHistory = [
      ...sensorFeed.cafeteriaHistory as CafeteriaHistoryPoint[],
      { ...sensorFeed.cafeteria, ts: Date.now() },
    ];
    sensorFeed.mode = 'SIMULATED DATA';
    sensorFeed.lastTickTs = Date.now();
    onTick(sensorFeed);
  };
  ticker = setInterval(tick, 3000); // every 3 s (first interval fires after 3 s,
  // avoids touching consumer state during store module init)
}

export function stopSimulatedTicker(): void {
  if (ticker) {
    clearInterval(ticker);
    ticker = null;
  }
}

/**
 * FUTURE INTEGRATION POINT — MQTT bridge.
 * Wiring instructions for when the ESP32 nodes are flash-ready:
 *
 *   1. `npm i mqtt`
 *   2. Run the Python backend (FastAPI) that subscribes to
 *      `tp1/ground/#` and `tp1/cafeteria/#` topics, stores to Postgres,
 *      and re-publishes snapshots over WebSocket.
 *   3. Replace `startSimulatedTicker(onTick)` below with:
 *        const ws = new WebSocket('ws://<host>:8000/ws/sensors');
 *        ws.onmessage = (e) => onTick(JSON.parse(e.data) as SensorFeedState);
 *      and flip `sensorFeed.mode = 'LIVE DATA'`.
 * Topic map (planned ESP32 payloads, JSON at 5-second intervals):
 *   tp1/ground/env      → { t, h, lux, motion }
 *   tp1/ground/light    → { on }        (ground-floor PIR → relay)
 *   tp1/cafeteria/env   → { t, h, noise }
 *   tp1/cafeteria/people→ { count }     (IR beam or camera count)
 */
export function connectRealBroker(
  onTick: (s: SensorFeedState) => void,
  _wsUrl: string
): void {
  // Placeholder for the WS/MQTT bridge implementation above.
  stopSimulatedTicker();
  onTick(sensorFeed);
}

export function getFeedStatus(): FeedStatus {
  return {
    mode: sensorFeed.mode,
    brokerUrl: sensorFeed.brokerUrl,
    topicNamespace: sensorFeed.brokerUrl ? 'tp1' : 'sim',
    updateIntervalMs: 3000,
    lastTickTs: sensorFeed.lastTickTs,
    connected: sensorFeed.brokerUrl !== '',
  };
}
