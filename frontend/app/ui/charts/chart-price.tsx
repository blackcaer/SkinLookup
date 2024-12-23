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

interface ChartPriceProps {
  data: { date: string; median: number }[];
  config: ChartConfig;
  title?: string;
  description?: string;
  className?: string,
  chartClassName?: string,
}

const formatDate = (dateString: string) => {
  const [day, month, year] = dateString.split('/');
  const shortYear = year.slice(-2);
  return `${day}/${month}/${shortYear}`;
};

export default function ChartPrice({
  data,
  config,
  title,
  description,
  className,
  chartClassName
}: ChartPriceProps) {
  title = title || "Price over time";
  description =
    description || "Price of an item on Steam Market since item's release";

  const formattedData = data.map(item => ({
    ...item,
    date: formatDate(item.date),
  }));

  return (
    <Card className={`${className}`}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="">
        <ChartContainer config={config} className={`${chartClassName} `}>
          <LineChart
            data={formattedData}
            margin={{
              top: 5,
              right: 5,
              left: -30,
              bottom: 25,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" angle={-45} textAnchor="end" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              type="monotone"
              dataKey="median"
              stroke="var(--color-median)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}