"use client";
import React, { useEffect, useState } from 'react';
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import SearchBar from "@/app/ui/all/search-bar";
import ItemDetailHeader from "@/app/ui/item_detail/item-details-header";
import ChartPrice from "@/app/ui/charts/chart-price";
import ChartVolume from "@/app/ui/charts/chart-volume";
import { ChartConfigVolMed } from "@/app/ui/common/chart-configs";
import { ItemData } from '@/app/ui/common/types';


const ItemDetailsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  let name = searchParams.get("name");
  if (!name || name.trim() === "") router.push("/all");

  const [itemData, setItemData] = useState<ItemData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const getItemData = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/items/?name=${name}`,
          {
            method: "GET",
          }
        );
        if (response.ok) {
          console.log("Response ok");
          const data = await response.json();
          console.log(data);
          setItemData(data);
        } else {
          console.log("Response bad");
          alert(`Error fetching item data: ${response.statusText} (${response.status})`);
        }
      } catch (error) {
        console.error("Error fetching item data:", error);
        alert("Error fetching item data");
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
              <ItemDetailHeader item={itemData.item} />
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
