// ─── TP1 Smart Building Twin · Sensor types ────────────────────────────────
// The dashboard reads ONLY from these interfaces. When real ESP32 devices are
// wired through the MQTT bridge (see data/sensorFeed.ts), the sim generator is
// retired and real readings flow through the same shapes — zero UI changes.

export type DataMode = 'SIMULATED DATA' | 'LIVE DATA';

export type SensorZoneId = 'tp1-ground' | 'tp1-cafeteria';

export type SensorKind =
  | 'temperature'
  | 'humidity'
  | 'light'
  | 'motion'
  | 'peopleCount'
  | 'noise';

export interface SensorReading {
  zoneId: SensorZoneId;
  kind: SensorKind;
  value: number;
  unit: string;
  timestamp: number; // epoch ms
  isSimulated: boolean;
  deviceId?: string; // future ESP32 MAC / topic id
}

export interface ZoneAlert {
  id: string;
  zoneId: SensorZoneId;
  zoneName: string;
  severity: 'info' | 'warning' | 'critical';
  metric: SensorKind | 'autoLight' | 'system';
  metricLabel: string;
  message: string;
  value?: number;
  threshold?: number;
  unit?: string;
  timestamp: number;
}

export interface EnvStats {
  temperatureC: number;
  relativeHumidity: number;
  lightLux: number;
  motionDetected: boolean;
}

export interface CafeteriaStats {
  peopleCount: number;
  temperatureC: number;
  relativeHumidity: number;
  noiseDb: number;
}

export interface TwinZoneSnapshot {
  zoneId: SensorZoneId;
  zoneName: string;
  dataMode: DataMode;
  lastUpdateTs: number;
  env?: EnvStats;
  cafeteria?: CafeteriaStats;
  smartLightingOn: boolean;
}

export interface ThresholdConfig {
  // Ground floor
  tempHigh: number;        // °C
  tempLow: number;         // °C
  humidityHigh: number;    // %
  lightDark: number;       // lux — room considered "dark" below this
  // Cafeteria
  occupancyHigh: number;   // people
  noiseHigh: number;       // dB
  comfortTempHigh: number; // °C
  comfortTempLow: number;  // °C
  comfortHumHigh: number;  // %
}

export interface Insight {
  id: string;
  category: 'anomaly' | 'trend' | 'energy' | 'comfort' | 'ops';
  zoneName: string;
  title: string;
  detail: string;
  severity: 'info' | 'warning' | 'critical';
}

export interface FeedStatus {
  mode: DataMode;
  brokerUrl: string;      // '' until a real broker is configured
  topicNamespace: 'sim' | 'tp1';
  updateIntervalMs: number;
  lastTickTs: number;
  connected: boolean;
}
