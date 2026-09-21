export type ZoneCategory = 
  | 'academic'
  | 'research'
  | 'library'
  | 'dining'
  | 'recreation'
  | 'residential'
  | 'admin'
  | 'hospital';

export type DayOrder = 1 | 2 | 3 | 4 | 5;

export type OccupancyLevel = 'low' | 'moderate' | 'high' | 'critical';

export interface GeoLocation {
  lat: number;
  lng: number;
}

export interface ClassSchedulePeriod {
  periodNumber: number | string; // 1 to 8, or 'LUNCH'
  timeSlot: string; // "08:45 - 09:35"
  startDecimal: number; // 8.75
  endDecimal: number; // 9.58
  subjectCode: string;
  subjectName: string;
  room: string;
  faculty: string;
  type: 'theory' | 'lab' | 'break';
}

export interface CampusZone {
  id: string;
  code: string;
  name: string;
  fullName: string;
  category: ZoneCategory;
  capacity: number;
  location: GeoLocation; // Real GPS coordinate on SRM KTR campus
  polygonCoords?: [number, number][]; // Real GPS boundary polygon
  hourlyProfile: number[]; // 24-hour occupancy baseline
  timetable?: Record<DayOrder, ClassSchedulePeriod[]>; // SRM Day Order 1-5 timetables
}

export interface CampusHealthMetrics {
  overallHealthScore: number;
  status: 'OPTIMAL' | 'MODERATE' | 'CONGESTED' | 'ELEVATED';
  totalCampusCapacity: number;
  totalCurrentOccupants: number;
  averageUtilizationPercentage: number;
  activeZonesCount: number;
}

export interface LiveWeatherInfo {
  temperatureC: number;
  relativeHumidity: number;
  apparentTemperatureC?: number;
  weatherCode: number;
  conditionText: string;
  isLive: boolean;
  updatedAt: string;
}

export interface SimulationState {
  currentTime: number; // Decimal hours 0.00 to 23.99
  isPlaying: boolean;
  playbackSpeed: number; // 1, 5, 15
  dayOrder: DayOrder; // SRM Day Order 1 to 5 (default 5)
  selectedZoneId: string | null;
  activeModule: 'map' | string;
  weather: LiveWeatherInfo;
  mapTileStyle: 'dark' | 'streets' | 'satellite';
}

export interface CampusStoreState extends SimulationState {
  zones: CampusZone[];
  
  // Actions
  setTime: (time: number) => void;
  advanceTime: (deltaHours: number) => void;
  togglePlay: () => void;
  setPlaying: (isPlaying: boolean) => void;
  setPlaybackSpeed: (speed: number) => void;
  setDayOrder: (dayOrder: DayOrder) => void;
  selectZone: (zoneId: string | null) => void;
  setMapTileStyle: (style: 'dark' | 'streets' | 'satellite') => void;
  setWeather: (weather: LiveWeatherInfo) => void;
  
  // Computed getters
  getZoneOccupancyAtTime: (zone: CampusZone, time: number) => { occupancy: number; percentage: number; level: OccupancyLevel };
  getCampusHealth: () => CampusHealthMetrics;
  getCurrentClassForZone: (zone: CampusZone, time: number, dayOrder: DayOrder) => ClassSchedulePeriod | null;
}
