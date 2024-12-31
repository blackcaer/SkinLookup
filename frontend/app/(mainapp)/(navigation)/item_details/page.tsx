"use client";
import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import ItemDetailHeader from "@/app/ui/item_detail/item-details-header";
import ChartPrice from "@/app/ui/charts/chart-price";
import ChartVolume from "@/app/ui/charts/chart-volume";
import { ChartConfigVolMed } from "@/app/ui/common/chart-configs";
import { ItemData } from "@/app/ui/common/types";
import { clearTokens, getToken } from "@/services/authServise";

const ItemDetailsPageComp = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [name, setName] = useState<string | null>(searchParams.get("name"));
  const [itemData, setItemData] = useState<ItemData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isInPortfolio, setIsInPortfolio] = useState<boolean|null>(null);

  useEffect(() => {
    const fetchRandomItemName = async () => {
      const response = await fetch(`http://127.0.0.1:8000/api/random_item_name/`);
      if (response.ok) {
        const data = await response.json();
        console.log("data: ",data);
        setName(data["name"]);
        router.replace(`/item_details?name=${data["name"]}`);
        console.log("after router replace")
      } else {
        console.error("Failed to fetch random item name");
      }
    };

    if (!name || name.trim() === "") {
      console.log("fetch item name")
      fetchRandomItemName();
    }
  
    const getItemData = async () => {
      try {
        const token = getToken();
        const response = await fetch(
          `http://127.0.0.1:8000/api/items/?name=${name}`,
          {
            method: "GET",
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );
        if (response.ok) {
          const data = await response.json();
          if(token)
            setIsInPortfolio(data["is_in_portfolio"]);
          setItemData(data["item"]);
        } else {
          if (token) {
            // Authorization error, expired token
            clearTokens();
            window.location.reload();
            return;
          }
          console.error(`Bad status code: ${response.statusText} (${response.status})`);
        }
      } catch (error) {
        console.error("Error fetching item data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (name) {
      console.log("getItemData");
      console.log("name: ",name);
      getItemData();
    }
  }, [name,router]);

  return (
    <div>

      <div className="flex flex-col gap-6">
        {isLoading ? (
          <div className="w-full h-[800px] bg-gray-200 animate-pulse rounded-lg"></div>
        ) : (
          itemData && (
            <>
              <ItemDetailHeader
                item={itemData.item}
                isInPortfolio={isInPortfolio}
              />
              <ChartPrice data={itemData.phsm} config={ChartConfigVolMed} />
              <ChartVolume data={itemData.phsm} config={ChartConfigVolMed} />
            </>
          )
        )}
      </div>
    </div>
  );
};

const ItemDetailsPage = () => {
  return (
    <Suspense>
      <ItemDetailsPageComp/>
    </Suspense>
  )
} // Page has to be in Suspense because of the useSearchParams hook

export default ItemDetailsPage;