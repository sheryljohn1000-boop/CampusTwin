import React from 'react';
import { DataMode } from '../../types/sensors';

export const DataModeBadge: React.FC<{ mode?: DataMode; className?: string }> = ({
  mode = 'SIMULATED DATA',
  className = '',
}) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider ${
      mode === 'LIVE DATA'
        ? 'border-emerald-400/50 bg-emerald-400/10 text-emerald-300'
        : 'border-gold/50 bg-gold-soft text-gold'
    } ${className}`}
  >
    <span
      className={`h-1.5 w-1.5 rounded-full ${
        mode === 'LIVE DATA' ? 'animate-pulse bg-emerald-300' : 'bg-gold'
      }`}
    />
    {mode}
  </span>
);

export const TimeStamp: React.FC<{ ts: number; label?: string }> = ({
  ts,
  label = 'Updated',
}) => (
  <span className="font-mono text-[10px] text-ink-faint">
    {label} {new Date(ts).toLocaleTimeString()}
  </span>
);

// ── Metric tile — type-first, no icon chips, no inner boxes ────────────────
interface MetricTileProps {
  label: string;
  value: string;
  sub?: string;
  tone?: 'royal' | 'gold' | 'emerald' | 'sky' | 'amber' | 'red' | 'neutral';
  trend?: 'up' | 'down' | 'flat';
}

const TONE_MAP: Record<
  NonNullable<MetricTileProps['tone']>,
  { text: string; dot: string }
> = {
  royal: { text: 'text-royal', dot: 'bg-royal' },
  gold: { text: 'text-gold', dot: 'bg-gold' },
  emerald: { text: 'text-emerald-300', dot: 'bg-emerald-300' },
  sky: { text: 'text-teal-200', dot: 'bg-teal-200' },
  amber: { text: 'text-amber-300', dot: 'bg-amber-300' },
  red: { text: 'text-red-400', dot: 'bg-red-400' },
  neutral: { text: 'text-ink', dot: 'bg-ink-faint' },
};

export const MetricTile: React.FC<MetricTileProps> = ({
  label,
  value,
  sub,
  tone = 'neutral',
  trend,
}) => {
  const t = TONE_MAP[tone];
  return (
    <div className="flex flex-col justify-between px-1 py-2">
      <span className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-ink-faint">
        <span className={`h-1 w-1 rounded-full ${t.dot}`} />
        {label}
      </span>
      <div className="mt-1.5">
        <span className={`text-2xl font-semibold tracking-tight tabular-nums ${t.text}`}>
          {value}
          {trend && trend !== 'flat' && (
            <span className="ml-1 align-middle text-2xs text-ink-faint">
              {trend === 'up' ? '↑' : '↓'}
            </span>
          )}
        </span>
        {sub && <div className="mt-0.5 text-[10px] text-ink-faint">{sub}</div>}
      </div>
    </div>
  );
};

// ── Status card (zone summary tile) ────────────────────────────────────────
interface StatusCardProps {
  title: string;
  statusLabel: string;
  statusTone: 'good' | 'warn' | 'bad' | 'neutral';
  rows: { label: string; value: string; dot?: string }[];
  onClick?: () => void;
}

const STATUS_DOT: Record<StatusCardProps['statusTone'], string> = {
  good: 'bg-emerald-300',
  warn: 'bg-amber-300',
  bad: 'bg-red-400',
  neutral: 'bg-ink-faint',
};

const STATUS_TEXT: Record<StatusCardProps['statusTone'], string> = {
  good: 'text-emerald-300',
  warn: 'text-amber-300',
  bad: 'text-red-400',
  neutral: 'text-ink-soft',
};

export const StatusCard: React.FC<StatusCardProps> = ({
  title,
  statusLabel,
  statusTone,
  rows,
  onClick,
}) => (
  <button
    type="button"
    onClick={onClick}
    className="group w-full border-l-2 border-l-royal/60 bg-night-card/60 p-4 text-left transition-colors hover:border-l-royal hover:bg-night-card"
  >
    <div className="mb-3 flex items-center justify-between">
      <h3 className="text-sm font-medium tracking-tight text-ink">{title}</h3>
      <span
        className={`flex items-center gap-1.5 text-2xs font-medium ${STATUS_TEXT[statusTone]}`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[statusTone]}`} />
        {statusLabel}
      </span>
    </div>
    <div className="space-y-1.5">
      {rows.map((r) => (
        <div key={r.label} className="flex items-center justify-between text-2xs">
          <span className="text-ink-faint">{r.label}</span>
          <span className="flex items-center gap-1.5 font-medium tabular-nums text-ink">
            {r.dot && <span className={`h-1 w-1 rounded-full ${r.dot}`} />}
            {r.value}
          </span>
        </div>
      ))}
    </div>
    <div className="mt-3 text-[10px] font-medium text-royal opacity-0 transition-opacity group-hover:opacity-100">
      Open zone →
    </div>
  </button>
);

// ── Section header ─────────────────────────────────────────────────────────
export const SectionTitle: React.FC<{ children: React.ReactNode; right?: React.ReactNode }> = ({
  children,
  right,
}) => (
  <div className="mb-3 flex items-baseline justify-between">
    <h2 className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-faint">
      {children}
    </h2>
    {right}
  </div>
);

// ── Page header (title + timestamp + mode, no badge boxes) ────────────────
export const PageHeader: React.FC<{
  title: string;
  subtitle: string;
  mode: DataMode;
  ts: number;
}> = ({ title, subtitle, mode, ts }) => (
  <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
    <div>
      <h1 className="text-2xl font-medium tracking-tight text-ink">{title}</h1>
      <p className="mt-1 text-xs text-ink-faint">{subtitle}</p>
      <p className="mt-2 flex items-center gap-2 font-mono text-[10px] text-ink-faint">
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            mode === 'LIVE DATA' ? 'animate-pulse bg-emerald-300' : 'bg-gold'
          }`}
        />
        {mode.toLowerCase()} · updated {new Date(ts).toLocaleTimeString()}
      </p>
    </div>
  </div>
);
