"use client"

import React from 'react';
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip as ChartTooltip } from "recharts"
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
  ChartTooltipContent
} from "@/components/ui/chart"

interface ChartLine2Props {
  data: { date: string; median: number;}[];
  config: ChartConfig;
}

export default function ChartLine2({ data, config }: ChartLine2Props)  {
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Price over time</CardTitle>
        <CardDescription>Price of an item on Steam Market since item's release</CardDescription>
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
};