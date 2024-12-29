"use client";
import React, { useEffect, useState } from "react";
import { demo1, demo2 } from "@/app/ui/demo-data";
import { AccordionCharts } from "@/app/ui/portfolio/accordion-charts";
import ItemList from "@/app/ui/portfolio/item-list";
import PortfolioHeader from "@/app/ui/portfolio/portfolio-header";

import { PItem } from "@/app/ui/common/types";
import { getToken } from "@/services/authServise";

export default function Page() {

  const [isLoading, setIsLoading] = useState(true);
  const [pitemList, setPItemList] = useState<PItem[]>([]);

  useEffect(() => {
    
    const getPortfolio = async () => {
      try {
        const token = getToken();
        if (!token) {
          console.error("No token found");
          return;
        }
        const response = await fetch(
          `http://127.0.0.1:8000/api/portfolio/`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          console.log("Response ok");
          const data = await response.json();
          const correctedData = data.map((item: any) => {
            const { item_data, ...rest } = item;
            return { itemData: item_data, ...rest };
          });
          setPItemList(correctedData);
        } else {
          console.log(
            `Bad status code: ${response.statusText} (${response.status})`
          );
        }
      } catch (error) {
        console.error("Error fetching item data:", error);
        console.log("Error fetching item data");
      } finally {
        setIsLoading(false);
      }
    };
    getPortfolio();
  }, []);

  return (
    <>
    {isLoading ? (
      <div className="w-full h-[800px] bg-gray-200 animate-pulse rounded-lg"></div>
    ):
    (<>
    
      <PortfolioHeader pitemList={pitemList} />

      <div className="mb-6">
        <AccordionCharts />
      </div>

      <div>
        <ItemList pitemList={pitemList} setPItemList={setPItemList} />
      </div>
    </>)}
    
    </>
  )
  
}
