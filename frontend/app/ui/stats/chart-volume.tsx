"use client";

import React from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip as ChartTooltip,
} from "recharts";
import { format } from "date-fns";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface ChartVolumeProps {
  data: { date: string; volume: number }[];
  config: ChartConfig;
  title?: string;
  description?: string;
  className?: string;
  chartClassName?: string;
}

const formatDate = (dateString: string) => {
  const [day, month, year] = dateString.split('/');
  const shortYear = year.slice(-2);
  return `${day}/${month}/${shortYear}`;
};

export default function ChartVolume({
  data,
  config,
  title,
  description,
  className,
  chartClassName,
}: ChartVolumeProps) {
  title = title || "Volume over time";
  description =
    description || "Volume of an item on Steam Market since item's release";
  
  const formattedData = data.map(item => ({
    ...item,
    date: formatDate(item.date),
  }));

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className={`${chartClassName}`}>
          <LineChart
            data={formattedData}
            margin={{
              top: 5,
              right: 5,
              left: 0,
              bottom: 35,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" angle={-45} textAnchor="end" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              type="monotone"
              dataKey="volume"
              stroke="var(--color-volume)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
