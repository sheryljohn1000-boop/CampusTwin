import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { CampusZone } from '../../types/campus';
import { formatTime24h } from '../../utils/formatters';

interface ZoneOccupancyChartProps {
  zone: CampusZone;
  currentTime: number;
}

export const ZoneOccupancyChart: React.FC<ZoneOccupancyChartProps> = ({
  zone,
  currentTime,
}) => {
  const chartData = zone.hourlyProfile.map((baseline, hour) => ({
    hour: `${hour.toString().padStart(2, '0')}:00`,
    hourNum: hour,
    occupancy: Math.round(zone.capacity * baseline),
    percentage: Math.round(baseline * 100),
  }));

  const currentHourLabel = `${Math.floor(currentTime).toString().padStart(2, '0')}:00`;

  return (
    <div className="mt-2 h-40 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 8, left: -22, bottom: 0 }}>
          <defs>
            <linearGradient id="occupancyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b7cf6" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#8b7cf6" stopOpacity={0.02} />
            </linearGradient>
          </defs>

          <XAxis
            dataKey="hour"
            stroke="#262a3a"
            tick={{ fill: '#6d6b85', fontSize: 9, fontFamily: 'JetBrains Mono' }}
            interval={3}
            tickLine={false}
          />
          <YAxis
            stroke="#262a3a"
            tick={{ fill: '#6d6b85', fontSize: 9, fontFamily: 'JetBrains Mono' }}
            domain={[0, 100]}
            unit="%"
            tickLine={false}
          />
          <Tooltip
            cursor={{ stroke: '#3a3f56', strokeDasharray: '3 3' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="rounded-lg border border-night-line bg-night-card px-2.5 py-1.5 shadow-lift">
                    <div className="font-mono text-[10px] text-ink-faint">{data.hour}</div>
                    <div className="text-xs font-semibold text-ink">
                      {data.occupancy.toLocaleString()} people · {data.percentage}%
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />

          {/* Current time marker */}
          <ReferenceLine
            x={currentHourLabel}
            stroke="#d4b570"
            strokeWidth={1.5}
            strokeDasharray="3 3"
            label={{
              value: `NOW ${formatTime24h(currentTime)}`,
              fill: '#d4b570',
              fontSize: 9,
              fontFamily: 'JetBrains Mono',
              position: 'top',
            }}
          />

          <Area
            type="monotone"
            dataKey="percentage"
            stroke="#8b7cf6"
            strokeWidth={1.5}
            fillOpacity={1}
            fill="url(#occupancyGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
