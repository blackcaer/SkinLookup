"use client";
import React, { useEffect, useState } from "react";
import { AccordionCharts } from "@/app/ui/portfolio/accordion-charts";
import ItemList from "@/app/ui/portfolio/item-list";
import PortfolioHeader from "@/app/ui/portfolio/portfolio-header";

import { PItem } from "@/app/ui/common/types";
import { clearTokens, getToken } from "@/services/authServise";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [pitemList, setPItemList] = useState<PItem[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  

  useEffect(() => {
    
    const getPortfolio = async () => {
      try {
        const token = getToken();
        if (!token) {
          console.log("No token found");
          setIsLoggedIn(false);
          return;
        }else
          setIsLoggedIn(true);
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
          console.error(
            `Bad status code: ${response.statusText} (${response.status})`
          );
          if (token) 
          {
            // Authorization error, expired token
            clearTokens();
            window.location.reload();
            return;
          }
          
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

  if (!isLoggedIn) {
    return (
    <div className="flex flex-col items-center justify-center h-[800px] gap-4 text-xl">
      <h2> You have to be logged in to see this site </h2>
        <Link href='/login/'>
          <Button className="px-8 py-6 text-xl"> Log in </Button>
        </Link>
      </div>
      );
  }

  return (
    <>
    {isLoading ? (
      <div className="w-full h-[800px] bg-gray-200 animate-pulse rounded-lg"></div>
    ):
    (<>
    
      <PortfolioHeader pitemList={pitemList} />

      <div className="mb-6">
        <AccordionCharts pitemList={pitemList}/>
      </div>

      <div>
        <ItemList pitemList={pitemList} setPItemList={setPItemList} />
      </div>
    </>)}
    
    </>
  )
  
}
