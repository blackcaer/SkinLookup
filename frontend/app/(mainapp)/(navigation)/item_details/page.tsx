"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import SearchBar from "@/app/ui/all/search-bar";
import ItemDetailHeader from "@/app/ui/item_detail/item-details-header";
import ChartPrice from "@/app/ui/charts/chart-price";
import ChartVolume from "@/app/ui/charts/chart-volume";
import { ChartConfigVolMed } from "@/app/ui/common/chart-configs";
import { ItemData } from "@/app/ui/common/types";
import { clearTokens, getToken } from "@/services/authServise";

const ItemDetailsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  let name = searchParams.get("name");
  if (!name || name.trim() === "") router.push("/all");

  const [itemData, setItemData] = useState<ItemData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isInPortfolio, setIsInPortfolio] = useState<boolean>(false);

  useEffect(() => {
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
          setIsInPortfolio(data["is_in_portfolio"]);
          setItemData(data["item"]);
        } else {
          if (token) {
            // Authorization error, expired token
            clearTokens();
            window.location.reload();
            return;
          }
          console.log(
            `Bad status code: ${response.statusText} (${response.status})`
          );
        }
      } catch (error) {
        console.error("Error fetching item data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getItemData();
  }, [name]);

  return (
    <div>
      <div className="mb-6">
        <SearchBar />
      </div>

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

export default ItemDetailsPage;
