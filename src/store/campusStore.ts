import { create } from 'zustand';
import { 
  CampusStoreState, 
  CampusZone, 
  DayOrder, 
  OccupancyLevel, 
  CampusHealthMetrics,
  ClassSchedulePeriod,
  LiveWeatherInfo
} from '../types/campus';
import { SRM_KTR_ZONES } from '../data/srmData';

// Helper to interpolate between two hours for smooth curves
function getInterpolatedBaseline(hourlyProfile: number[], time: number): number {
  const normalizedTime = ((time % 24) + 24) % 24;
  const h1 = Math.floor(normalizedTime);
  const h2 = (h1 + 1) % 24;
  const fraction = normalizedTime - h1;

  const val1 = hourlyProfile[h1] ?? 0.5;
  const val2 = hourlyProfile[h2] ?? 0.5;

  return val1 + (val2 - val1) * fraction;
}

/**
 * SRM day-order aware occupancy for buildings that have a timetable.
 * The whole-building fill ratio follows the current period of the active
 * Day Order: classes fill the tower, lunch empties it, labs pack it.
 * Returns null when the zone has no timetable (falls back to hourlyProfile).
 */
function getScheduleDrivenRatio(
  zone: CampusZone,
  time: number,
  dayOrder: DayOrder
): number | null {
  const schedule = zone.timetable?.[dayOrder];
  if (!schedule) return null;

  if (time < 7.25) return null; // early morning: fall back to baseline profile

  // Ramp-up as students arrive between 7:15 and first period
  if (time < 8.0) {
    const t = (time - 7.25) / 0.75;
    return 0.05 + t * 0.6;
  }

  // Find the period covering this moment
  const current = schedule.find(
    (p) => time >= p.startDecimal && time < p.endDecimal
  );

  if (time < 16.0) {
    if (!current) return 0.7; // between-period movement
    if (current.type === 'break') return 0.52; // lunch dip
    if (current.subjectCode === 'FREE') return 0.7; // free slot, partial exit
    return current.type === 'lab' ? 0.94 : 0.88; // lab packs more than theory
  }

  // After last period: project work & dispersal decay 16:00 - 17:30
  if (time < 17.5) {
    const t = (time - 16.0) / 1.5;
    return 0.68 - t * 0.4;
  }

  return null; // evening: fall back to baseline profile
}

export const useCampusStore = create<CampusStoreState>((set, get) => ({
  currentTime: 12.5, // 12:30 PM default (Lunch break & class change)
  isPlaying: false,
  playbackSpeed: 5,
  dayOrder: 5, // Default is Day Order 5 per user instruction!
  selectedZoneId: 'srm-tp2', // TP2 (Tech Park 2) selected by default!
  activeModule: 'map',
  mapTileStyle: 'dark',
  zones: SRM_KTR_ZONES,
  weather: {
    temperatureC: 31.4,
    relativeHumidity: 68,
    weatherCode: 2,
    conditionText: 'Partly Cloudy',
    isLive: false,
    updatedAt: '—',
  },

  setTime: (time: number) => {
    const clamped = Math.max(0, Math.min(23.99, time));
    set({ currentTime: clamped });
  },

  advanceTime: (deltaHours: number) => {
    set((state) => {
      let newTime = state.currentTime + deltaHours;
      if (newTime >= 24) newTime = newTime % 24;
      if (newTime < 0) newTime = 24 + (newTime % 24);
      return { currentTime: newTime };
    });
  },

  togglePlay: () => {
    set((state) => ({ isPlaying: !state.isPlaying }));
  },

  setPlaying: (isPlaying: boolean) => {
    set({ isPlaying });
  },

  setPlaybackSpeed: (speed: number) => {
    set({ playbackSpeed: speed });
  },

  setDayOrder: (dayOrder: DayOrder) => {
    set({ dayOrder });
  },

  selectZone: (selectedZoneId: string | null) => {
    set({ selectedZoneId });
  },

  setMapTileStyle: (mapTileStyle: 'dark' | 'streets' | 'satellite') => {
    set({ mapTileStyle });
  },

  setWeather: (weather: LiveWeatherInfo) => {
    set({ weather });
  },

  getZoneOccupancyAtTime: (zone: CampusZone, time: number) => {
    const state = get();
    const scheduleRatio = getScheduleDrivenRatio(zone, time, state.dayOrder);
    const baseline = getInterpolatedBaseline(zone.hourlyProfile, time);
    const rawRatio = Math.max(
      0.01,
      Math.min(1.0, scheduleRatio ?? baseline)
    );
    const occupancy = Math.round(zone.capacity * rawRatio);
    const percentage = Math.round(rawRatio * 100);

    let level: OccupancyLevel = 'low';
    if (percentage > 90) {
      level = 'critical';
    } else if (percentage >= 75) {
      level = 'high';
    } else if (percentage >= 50) {
      level = 'moderate';
    }

    return { occupancy, percentage, level };
  },

  getCurrentClassForZone: (zone: CampusZone, time: number, dayOrder: DayOrder): ClassSchedulePeriod | null => {
    if (!zone.timetable || !zone.timetable[dayOrder]) return null;
    const schedule = zone.timetable[dayOrder];
    const current = schedule.find(
      (period) => time >= period.startDecimal && time < period.endDecimal
    );
    return current ?? null;
  },

  getCampusHealth: (): CampusHealthMetrics => {
    const state = get();
    let totalCap = 0;
    let totalOcc = 0;

    state.zones.forEach((zone) => {
      totalCap += zone.capacity;
      const { occupancy } = state.getZoneOccupancyAtTime(zone, state.currentTime);
      totalOcc += occupancy;
    });

    const avgUtil = totalCap > 0 ? Math.round((totalOcc / totalCap) * 100) : 0;
    let healthScore = 96;
    if (avgUtil > 80) healthScore -= 8;
    if (avgUtil > 90) healthScore -= 12;

    let status: CampusHealthMetrics['status'] = 'OPTIMAL';
    if (healthScore < 75) status = 'CONGESTED';
    else if (healthScore < 85) status = 'MODERATE';

    return {
      overallHealthScore: healthScore,
      status,
      totalCampusCapacity: totalCap,
      totalCurrentOccupants: totalOcc,
      averageUtilizationPercentage: avgUtil,
      activeZonesCount: state.zones.length,
    };
  },
}));
