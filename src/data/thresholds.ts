import { ThresholdConfig } from '../types/sensors';

/**
 * Default alert thresholds — every value is configurable by facilities staff
 * via the Ground Floor / Cafeteria pages. Remove the @default if you wire up
 * persistent settings later.
 */
export const DEFAULT_THRESHOLDS: ThresholdConfig = {
  // Ground floor
  tempHigh: 30,
  tempLow: 18,
  humidityHigh: 70,
  lightDark: 120, // lux — below this the room counts as "dark"

  // Cafeteria
  occupancyHigh: 220,
  noiseHigh: 75,
  comfortTempHigh: 29,
  comfortTempLow: 19,
  comfortHumHigh: 75,
};

/** Editable at runtime by the threshold sliders. */
export let RUNTIME_THRESHOLDS: ThresholdConfig = DEFAULT_THRESHOLDS;

export function setRuntimeThresholds(next: ThresholdConfig): void {
  RUNTIME_THRESHOLDS = next;
}
