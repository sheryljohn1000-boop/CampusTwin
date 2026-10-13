import React from 'react';

interface ThresholdSliderProps {
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
}

export const ThresholdSlider: React.FC<ThresholdSliderProps> = ({
  label,
  unit,
  min,
  max,
  step,
  value,
  onChange,
}) => (
  <div className="rounded-card border border-night-line bg-night-raised p-3">
    <div className="mb-2 flex items-center justify-between">
      <span className="text-2xs font-medium text-ink-soft">{label}</span>
      <span className="font-mono text-2xs font-semibold tabular-nums text-royal">
        {value}
        {unit}
      </span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full accent-[#3dd68c]"
    />
  </div>
);
