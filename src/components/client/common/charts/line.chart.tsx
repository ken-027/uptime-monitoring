'use client';

import { AppStatus } from '@/enum/app.enum';
import {
  // YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
} from 'recharts';

interface LogData {
  time: string;
  responseTime: number;
  status: AppStatus;
}

interface LineChartProps {
  data: LogData[];
  lastStatus: AppStatus;
  interval: number;
}

export default function LineChart({ data, lastStatus, interval }: LineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorDown" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#e06658" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#e06658" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorUp" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
          </linearGradient>
        </defs>
        {/* <YAxis /> */}
        <Tooltip content={CustomTooltip} />
        <CartesianGrid strokeDasharray="0.2 0.2" />
        <Area
          name={`Response Time (${interval} hour${interval > 1 ? 's' : ''} interval)`}
          type="bumpX"
          dataKey="responseTime"
          fillOpacity={1}
          stroke={lastStatus === AppStatus.UP ? '#82ca9d' : '#e06658'}
          fill={lastStatus === AppStatus.UP ? 'url(#colorUp)' : 'url(#colorDown)'}
        />
        <Legend align="center" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length > 0) {
    const { responseTime, status, time } = payload[0].payload;
    return (
      <div
        className="recharts-default-tooltip rounded-md"
        style={{ backgroundColor: 'white', padding: 10, border: '1px solid #ccc' }}
      >
        <p
          className={`recharts-tooltip-label uppercase font-bold text-gray-600 ${status === AppStatus.UP ? 'text-green-500' : 'text-red-500'}`}
        >
          {status}
        </p>
        <p className="recharts-tooltip-item">
          <span className="text-gray-600">Response Time:</span> {responseTime} ms
        </p>
        <p className="recharts-tooltip-label">
          <span className="text-gray-600">Time:</span>
          {time}
        </p>
      </div>
    );
  }

  return null;
};
