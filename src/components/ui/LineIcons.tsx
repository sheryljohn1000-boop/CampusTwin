import React from 'react';

/**
 * Minimal monochrome line icons in the style of the reference sheet:
 * thin, geometric, no fill, oversized-tray look. Each accepts className /
 * strokeWidth for sizing consistency.
 */

interface IconProps {
  className?: string;
  strokeWidth?: number;
}

export const HomeIcon: React.FC<IconProps> = ({ className = 'h-5 w-5', strokeWidth = 1.5 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5 9.5V21h14V9.5" />
    <rect x="8" y="12" width="3.5" height="4.5" />
    <rect x="13" y="12" width="3.5" height="3" />
    <rect x="13" y="16.5" width="3.5" height="3" />
  </svg>
);

export const StairsIcon: React.FC<IconProps> = ({ className = 'h-5 w-5', strokeWidth = 1.5 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 18h14" />
    <path d="M4 18v-4h4v-4h4V6h4" />
    <circle cx="19" cy="6.5" r="2.5" />
  </svg>
);

export const CupIcon: React.FC<IconProps> = ({ className = 'h-5 w-5', strokeWidth = 1.5 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 9h11v5a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4V9Z" />
    <path d="M17 10.5h1.5a2 2 0 0 1 0 4H17" />
    <path d="M4 21h15" />
    <path d="M9 6V4.5" />
    <path d="M12 6V4" />
    <path d="M15 6V4.5" />
  </svg>
);

export const BellIcon: React.FC<IconProps> = ({ className = 'h-5 w-5', strokeWidth = 1.5 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2.5h-15L6 16Z" />
    <path d="M12 5V3" />
    <path d="M9.5 20.5a2.5 2.5 0 0 0 5 0" />
    <path d="M3 9.5c-.5-.8-.8-1.7-1-2.5" />
    <path d="M21 9.5c.5-.8.8-1.7 1-2.5" />
  </svg>
);

export const ChartIcon: React.FC<IconProps> = ({ className = 'h-5 w-5', strokeWidth = 1.5 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 20h18" />
    <rect x="5" y="14" width="3" height="6" />
    <rect x="10.5" y="11" width="3" height="9" />
    <rect x="16" y="8" width="3" height="12" />
    <path d="M5 10 10 6.5 14 9l6-6" />
    <path d="M17.5 3H20v2.5" />
  </svg>
);
