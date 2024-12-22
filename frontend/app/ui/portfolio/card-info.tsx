"use client";

import React from "react";


import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";


interface CardInfoProps {
  title?: string;
  description?: string;
}

export default function CardInfo({
  title,
  description,
}: CardInfoProps) {
  title = title || "Volume over time";
  description =
    description || "Volume of an item on Steam Market since item's release";
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
      
      </CardContent>
    </Card>
  );
}
