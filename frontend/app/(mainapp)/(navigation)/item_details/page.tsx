import { demo1, demo2 } from "@/app/ui/demo-data";
import ChartVolume from "@/app/ui/charts/chart-volume";
import { ChartConfigVolMed } from "@/app/ui/chart-configs";
import ChartPrice from "@/app/ui/charts/chart-price";
import SearchBar from "@/app/ui/all/search";
import ItemDetailHeader from "@/app/ui/item_detail/item-details-header";

export default function Page() {
  const item = demo2;

  return (
    <div>
      <div className="mb-6">
        <SearchBar/>
      </div>
      
      <div className="flex flex-col gap-6">
        <ItemDetailHeader item={item} />

        <ChartPrice data={item.phsm} config={ChartConfigVolMed} />

        <ChartVolume data={item.phsm} config={ChartConfigVolMed} />
      </div>
    </div>
  );
}
