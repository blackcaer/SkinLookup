"use client";
import React, { useEffect, useState } from "react";
import { ItemInfo, PItem } from "@/app/ui/common/types";
import ItemPreview from "@/app/ui/all/item-preview";

const AllItemList = () => {
  const [items, setItems] = useState<ItemInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/items/all/");
        if (!response.ok) {
          throw new Error("Failed to fetch items");
        }
        const data = await response.json();
        setItems(data);
      } catch (error) {
        setError("Error fetching items");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  if (error) return <div>{error}</div>;

  return (
    <div className="flex flex-col flex-wrap sm:flex-row gap-4 md:overflow-hidden">
      {items.map((item) => (
        <ItemPreview item={item} />
      ))}
    </div>
  );
};

export default AllItemList;
