import { useMemo } from 'react';
import { create } from 'zustand';
import {
  CafeteriaStats,
  DataMode,
  EnvStats,
  Insight,
  ThresholdConfig,
  ZoneAlert,
} from '../types/sensors';
import {
  sensorFeed,
  startSimulatedTicker,
  GroundHistoryPoint,
  CafeteriaHistoryPoint,
} from '../data/sensorFeed';
import { DEFAULT_THRESHOLDS, setRuntimeThresholds, RUNTIME_THRESHOLDS } from '../data/thresholds';

interface SensorStoreState {
  ground: EnvStats;
  groundHistory: GroundHistoryPoint[];
  cafeteria: CafeteriaStats;
  cafeteriaHistory: CafeteriaHistoryPoint[];
  smartLightingOn: boolean;
  thresholds: ThresholdConfig;
  alerts: ZoneAlert[];
  insights: Insight[];
  dataMode: DataMode;
  lastUpdateTs: number;
  dismissedAlertIds: string[];

  setThreshold: (key: keyof ThresholdConfig, value: number) => void;
  resetThresholds: () => void;
  dismissAlert: (id: string) => void;
  clearAllAlerts: () => void;
}

const MAX_HISTORY = 120; // ~6 minutes of 3-second ticks per metric

function deriveAlerts(
  ground: EnvStats,
  cafeteria: CafeteriaStats,
  t: ThresholdConfig,
  smartLightingOn: boolean
): ZoneAlert[] {
  const now = Date.now();
  const alerts: ZoneAlert[] = [];

  // ── Ground floor environmental thresholds ──
  if (ground.temperatureC > t.tempHigh) {
    alerts.push({
      id: 'ground-temp-high',
      zoneId: 'tp1-ground',
      zoneName: 'TP1 Ground Floor',
      severity: 'warning',
      metric: 'temperature',
      metricLabel: 'Temperature',
      message: `Temperature above limit — HVAC review recommended`,
      value: ground.temperatureC,
      threshold: t.tempHigh,
      unit: '°C',
      timestamp: now,
    });
  } else if (ground.temperatureC < t.tempLow) {
    alerts.push({
      id: 'ground-temp-low',
      zoneId: 'tp1-ground',
      zoneName: 'TP1 Ground Floor',
      severity: 'info',
      metric: 'temperature',
      metricLabel: 'Temperature',
      message: `Temperature below comfort minimum`,
      value: ground.temperatureC,
      threshold: t.tempLow,
      unit: '°C',
      timestamp: now,
    });
  }

  if (ground.relativeHumidity > t.humidityHigh) {
    alerts.push({
      id: 'ground-hum-high',
      zoneId: 'tp1-ground',
      zoneName: 'TP1 Ground Floor',
      severity: 'warning',
      metric: 'humidity',
      metricLabel: 'Humidity',
      message: `Humidity above comfort limit — ventilation check advised`,
      value: ground.relativeHumidity,
      threshold: t.humidityHigh,
      unit: '%',
      timestamp: now,
    });
  }

  // Auto-lighting demo event
  if (smartLightingOn) {
    alerts.push({
      id: 'ground-autolight',
      zoneId: 'tp1-ground',
      zoneName: 'TP1 Ground Floor',
      severity: 'info',
      metric: 'autoLight',
      metricLabel: 'Smart Lighting',
      message: `Lights ON — motion in a dark zone triggered auto-lighting`,
      timestamp: now,
    });
  }

  // ── Cafeteria thresholds ──
  if (cafeteria.peopleCount > t.occupancyHigh) {
    alerts.push({
      id: 'caf-occ-high',
      zoneId: 'tp1-cafeteria',
      zoneName: 'TP1 Cafeteria',
      severity: 'warning',
      metric: 'peopleCount',
      metricLabel: 'Occupancy',
      message: `High occupancy — consider opening overflow seating`,
      value: cafeteria.peopleCount,
      threshold: t.occupancyHigh,
      unit: 'people',
      timestamp: now,
    });
  }

  if (cafeteria.noiseDb > t.noiseHigh) {
    alerts.push({
      id: 'caf-noise-high',
      zoneId: 'tp1-cafeteria',
      zoneName: 'TP1 Cafeteria',
      severity: 'warning',
      metric: 'noise',
      metricLabel: 'Noise level',
      message: `Noise above comfort limit`,
      value: cafeteria.noiseDb,
      threshold: t.noiseHigh,
      unit: 'dB',
      timestamp: now,
    });
  }

  if (
    cafeteria.temperatureC > t.comfortTempHigh ||
    cafeteria.temperatureC < t.comfortTempLow
  ) {
    alerts.push({
      id: 'caf-temp-comfort',
      zoneId: 'tp1-cafeteria',
      zoneName: 'TP1 Cafeteria',
      severity: 'warning',
      metric: 'temperature',
      metricLabel: 'Temperature',
      message: `Cafeteria outside comfort temperature band`,
      value: cafeteria.temperatureC,
      threshold: t.comfortTempHigh,
      unit: '°C',
      timestamp: now,
    });
  }

  if (cafeteria.relativeHumidity > t.comfortHumHigh) {
    alerts.push({
      id: 'caf-hum-high',
      zoneId: 'tp1-cafeteria',
      zoneName: 'TP1 Cafeteria',
      severity: 'info',
      metric: 'humidity',
      metricLabel: 'Humidity',
      message: `Humidity high for dining comfort`,
      value: cafeteria.relativeHumidity,
      threshold: t.comfortHumHigh,
      unit: '%',
      timestamp: now,
    });
  }

  return alerts;
}

function deriveInsights(
  ground: EnvStats,
  cafeteria: CafeteriaStats,
  t: ThresholdConfig
): Insight[] {
  const insights: Insight[] = [];

  // Example anomaly detection (rule-based placeholder for future ML backend)
  if (ground.temperatureC > t.tempHigh + 1) {
    insights.push({
      id: 'insight-temp-anomaly',
      category: 'anomaly',
      zoneName: 'TP1 Ground Floor',
      title: 'Temperature anomaly',
      detail: `Ground-floor temperature is running ${(ground.temperatureC - t.tempHigh).toFixed(1)}°C above the configured limit. In live operation this would be flagged by the statistical anomaly detector on the Python backend.`,
      severity: 'warning',
    });
  }

  // Historical trend example
  insights.push({
    id: 'insight-occupancy-trend',
    category: 'trend',
    zoneName: 'TP1 Cafeteria',
    title: 'Lunch peak pattern',
    detail: `Cafeteria occupancy has consistently peaked between 12:00–13:00 (${Math.round(t.occupancyHigh * 0.9)}–${Math.round(t.occupancyHigh * 1.1)} people across recent days). Staffing the counter 11:45–13:15 covers the surge.`,
    severity: 'info',
  });

  // Energy-saving suggestion
  insights.push({
    id: 'insight-energy-saving',
    category: 'energy',
    zoneName: 'TP1 Ground Floor',
    title: 'Light energy saving opportunity',
    detail: `Lighting can be dimmed ~30% during 09:00–16:00 daylight hours — ambient lux on the ground floor already exceeds task-light minimums. In live deployment the Python backend would verify this against ESP32 light-sensor history.`,
    severity: 'info',
  });

  // Comfort recommendation
  insights.push({
    id: 'insight-comfort',
    category: 'comfort',
    zoneName: 'TP1 Cafeteria',
    title: 'Comfort improvement suggestion',
    detail: `During the lunch peak (${cafeteria.peopleCount > t.occupancyHigh * 0.8 ? 'currently active' : 'observed daily'}), noise and temperature both rise together. Pre-cooling the cafeteria 15 minutes before 12:00 keeps temperature in band without running HVAC at full through the meal.`,
    severity: 'info',
  });

  return insights;
}

export const useSensorStore = create<SensorStoreState>((set) => {
  // Feed → store pump (the ONLY place simulation data enters state)
  startSimulatedTicker((s) => {
    const t = useSensorStore.getState().thresholds;
    const lighting =
      s.ground.motionDetected && s.ground.lightLux < t.lightDark;
    useSensorStore.setState({
      ground: s.ground,
      groundHistory: [...s.groundHistory.slice(-MAX_HISTORY)],
      cafeteria: s.cafeteria,
      cafeteriaHistory: [...s.cafeteriaHistory.slice(-MAX_HISTORY)],
      smartLightingOn: lighting,
      dataMode: s.mode,
      lastUpdateTs: s.lastTickTs,
    insights: deriveInsights(s.ground, s.cafeteria, t),
    alerts: deriveAlerts(s.ground, s.cafeteria, t, lighting),
    });
  });

  return {
    ground: sensorFeed.ground,
    groundHistory: sensorFeed.groundHistory as GroundHistoryPoint[],
    cafeteria: sensorFeed.cafeteria,
    cafeteriaHistory: [],
    smartLightingOn:
      sensorFeed.ground.motionDetected &&
      sensorFeed.ground.lightLux < RUNTIME_THRESHOLDS.lightDark,
    thresholds: { ...DEFAULT_THRESHOLDS },
    alerts: deriveAlerts(
      sensorFeed.ground,
      sensorFeed.cafeteria,
      DEFAULT_THRESHOLDS,
      sensorFeed.ground.motionDetected &&
        sensorFeed.ground.lightLux < RUNTIME_THRESHOLDS.lightDark
    ),
    insights: [],
    dataMode: 'SIMULATED DATA',
    lastUpdateTs: Date.now(),
    dismissedAlertIds: [],

    setThreshold: (key, value) => {
      set((state) => {
        const next = { ...state.thresholds, [key]: value };
        setRuntimeThresholds(next);
        const withNew = deriveAlerts(
          state.ground,
          state.cafeteria,
          next,
          state.smartLightingOn
        );
        return {
          thresholds: next,
          alerts: withNew,
        };
      });
    },

    resetThresholds: () => {
      setRuntimeThresholds({ ...DEFAULT_THRESHOLDS });
      set((state) => ({
        thresholds: { ...DEFAULT_THRESHOLDS },
        alerts: deriveAlerts(
          state.ground,
          state.cafeteria,
          DEFAULT_THRESHOLDS,
          state.smartLightingOn
        ),
      }));
    },

    dismissAlert: (id) =>
      set((state) => ({
        dismissedAlertIds: [...state.dismissedAlertIds, id],
      })),

    clearAllAlerts: () => set({ dismissedAlertIds: [] }),
  };
});

// Selector helpers used by pages: alerts live in state (stable identity per
// tick) and the dismissed filter is memoized so the snapshot stays referentially
// stable between store updates (required by zustand v5 + useSyncExternalStore).
export function useActiveAlerts(): ZoneAlert[] {
  const alerts = useSensorStore((s) => s.alerts);
  const dismissed = useSensorStore((s) => s.dismissedAlertIds);
  return useMemo(
    () => alerts.filter((a) => !dismissed.includes(a.id)),
    [alerts, dismissed]
  );
}
