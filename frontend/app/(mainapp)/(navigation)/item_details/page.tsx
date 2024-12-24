"use client";
import { demo1, demo2 } from "@/app/ui/demo-data";
import ChartVolume from "@/app/ui/charts/chart-volume";
import { ChartConfigVolMed } from "@/app/ui/chart-configs";
import ChartPrice from "@/app/ui/charts/chart-price";
import SearchBar from "@/app/ui/all/search-bar";
import ItemDetailHeader from "@/app/ui/item_detail/item-details-header";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const searchParams = useSearchParams();
  let name = searchParams.get("name");
  if (!name || name.trim() === "") name = "Forest Raiders Locker"; // TODO random name

  const item = demo1; // TODO fetch item by name

  return (
    <div>
      <div className="mb-6">
        <SearchBar />
      </div>

      <div className="flex flex-col gap-6">
        <ItemDetailHeader item={item} />

        <ChartPrice data={item.phsm} config={ChartConfigVolMed} />

        <ChartVolume data={item.phsm} config={ChartConfigVolMed} />
      </div>
    </div>
  );
}
