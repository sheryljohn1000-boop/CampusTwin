import { OccupancyLevel, ZoneCategory } from '../types/campus';

export function formatTime24h(decimalHours: number): string {
  const normalized = ((decimalHours % 24) + 24) % 24;
  const hours = Math.floor(normalized);
  const minutes = Math.floor((normalized - hours) * 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

export function formatTime12h(decimalHours: number): string {
  const normalized = ((decimalHours % 24) + 24) % 24;
  let hours = Math.floor(normalized);
  const minutes = Math.floor((normalized - hours) * 60);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  if (hours === 0) hours = 12;
  return `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
}

export function getTimePhase(decimalHours: number): { label: string; icon: string } {
  const h = Math.floor(decimalHours);
  if (h >= 5 && h < 9) return { label: 'Early Morning', icon: '🌅' };
  if (h >= 9 && h < 12) return { label: 'Midday Classes', icon: '☀️' };
  if (h >= 12 && h < 14) return { label: 'Lunch Break Peak', icon: '🍽️' };
  if (h >= 14 && h < 18) return { label: 'Afternoon Labs', icon: '🔬' };
  if (h >= 18 && h < 21) return { label: 'Evening Recreation & Dinner', icon: '🌆' };
  if (h >= 21 && h < 24) return { label: 'Late Night Study', icon: '🌙' };
  return { label: 'Overnight Dorm Cycle', icon: '🌌' };
}

export function getOccupancyColor(level: OccupancyLevel): {
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  dotColor: string;
  glowColor: string;
  svgFill: string;
  svgStroke: string;
} {
  switch (level) {
    case 'critical':
      return {
        badgeBg: 'bg-red-500/15',
        badgeText: 'text-red-400 font-bold',
        badgeBorder: 'border-red-500/50',
        dotColor: 'bg-red-400',
        glowColor: 'rgba(248, 113, 113, 0.7)',
        svgFill: '#f87171',
        svgStroke: '#fca5a5',
      };
    case 'high':
      return {
        badgeBg: 'bg-gold/15',
        badgeText: 'text-gold font-semibold',
        badgeBorder: 'border-gold/50',
        dotColor: 'bg-gold',
        glowColor: 'rgba(168, 240, 200, 0.6)',
        svgFill: '#a8f0c8',
        svgStroke: '#c9f5de',
      };
    case 'moderate':
      return {
        badgeBg: 'bg-royal/15',
        badgeText: 'text-royal font-semibold',
        badgeBorder: 'border-royal/50',
        dotColor: 'bg-royal',
        glowColor: 'rgba(61, 214, 140, 0.55)',
        svgFill: '#3dd68c',
        svgStroke: '#7fe7bb',
      };
    case 'low':
    default:
      return {
        badgeBg: 'bg-emerald-400/10',
        badgeText: 'text-royal font-medium',
        badgeBorder: 'border-emerald-400/40',
        dotColor: 'bg-royal/70',
        glowColor: 'rgba(61, 214, 140, 0.4)',
        svgFill: '#2ab477',
        svgStroke: '#5fd8a2',
      };
  }
}

export function getCategoryLabel(category: ZoneCategory): string {
  switch (category) {
    case 'academic': return 'Academic & Lecture';
    case 'research': return 'Advanced Research';
    case 'library': return 'Knowledge Commons';
    case 'dining': return 'Dining & Food Court';
    case 'recreation': return 'Athletics & Rec';
    case 'residential': return 'Residential Housing';
    case 'admin': return 'Operations & Admin';
    case 'hospital': return 'Medical & Hospital';
  }
}
