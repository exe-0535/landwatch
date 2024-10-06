'use client';

import { Bar, BarChart, CartesianGrid, XAxis, Line, LineChart } from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const chartData1 = [
  { field: 'NDVI', landsat: 0.72, earth: 0.68 },
  { field: 'EVI', landsat: 0.65, earth: 0.42 },
  { field: 'Reflectance Intensity', landsat: 0.78, earth: 0.74 },
  { field: 'Humidity', landsat: 0.65, earth: 0.62 },
  { field: 'Amplitude', landsat: 1.5, earth: 1.2 },
];

const chartData2 = [
  { field: 'NDVI', landsat: 0.61, earth: 0.59 },
  { field: 'EVI', landsat: 0.39, earth: 0.36 },
  { field: 'Reflectance Intensity', landsat: 0.63, earth: 0.81 },
  { field: 'Humidity', landsat: 0.72, earth: 0.72 },
  { field: 'Amplitude', landsat: 1.3, earth: 1.1 },
];

const chartConfig = {
  landsat: {
    label: 'Landsap',
    color: 'hsl(var(--chart-1))',
  },
  earth: {
    label: 'Earth',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export function ComparisonChart() {
  return (
    <div className="mt-8 gap-5 lg:flex">
      <ChartContainer className="lg:w-1/2" config={chartConfig}>
        <BarChart accessibilityLayer data={chartData1}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="field"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dashed" />}
          />
          <Bar dataKey="landsat" fill="var(--color-landsat)" radius={4} />
          <Bar dataKey="earth" fill="var(--color-earth)" radius={4} />
        </BarChart>
      </ChartContainer>
      <ChartContainer className="lg:w-1/2" config={chartConfig}>
        <LineChart
          accessibilityLayer
          data={chartData2}
          margin={{
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="field"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Line
            dataKey="landsat"
            type="monotone"
            stroke="var(--color-landsat)"
            strokeWidth={2}
            dot={false}
          />
          <Line
            dataKey="earth"
            type="monotone"
            stroke="var(--color-earth)"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
}
