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
  content?: string;
}

export default function CardInfo({ title, description,content }: CardInfoProps) {
    
  return (

    <Card className="w-full min-h-[100px]">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>

      </CardHeader>
        <CardContent>
        <div className="flex flex-col justify-center items-center">

            <p className="text-3xl font-bold text-center">{content}</p>
          
        </div>
        </CardContent>
    </Card>
  );
}

const foo = (    <Card className="w-full min-h-[100px]">
    <CardHeader>
      <CardTitle>{123}</CardTitle>
      <CardDescription>{321}</CardDescription>
    </CardHeader>

    <CardContent className="w-full h-full">
      <div className="flex flex-col w-full h-full  justify-center items-center">

          <p className="text-4xl font-bold text-center">$ 374 !!!</p>
        
      </div>
    </CardContent>
  </Card>);