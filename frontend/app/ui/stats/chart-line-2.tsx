"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import { format } from 'date-fns';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface ChartLine2Props {
  data: { date: string; median: number;}[];
  config: ChartConfig;
}

export default function ChartLine2({ data, config }: ChartLine2Props) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Activity trend</CardTitle>
        <CardDescription>Average activity during last week</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config}>
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 5,
              left: 0,
              bottom: 35,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(date) => format(new Date(date), 'MM/dd/yyyy')}
              angle={-45}
              textAnchor="end"
            />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              type="monotone"
              dataKey="median"
              stroke="var(--color-price)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
