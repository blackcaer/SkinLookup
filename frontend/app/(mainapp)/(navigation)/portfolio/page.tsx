import Image from "next/image";
import ItemPreview from "@/app/ui/all_items/item_preview";
import { demo1, demo2 } from "@/app/ui/demo-data";
import { ChartConfigVolMed } from "@/app/ui/chart-configs";
import ChartPrice from "@/app/ui/stats/chart-price";
import CardInfo from "@/app/ui/portfolio/card-info";

export default function Page() {
  const item = demo2;
  item.previewUrl = "/fr_locker.png";
{/* max-h-[500px] */}
  return (
    <>
      {/* <div className="flex flex-col lg:flex-row gap-2 justify-center mb-6"> */}
      <div className="grid lg:grid-cols-2 xl:grid-cols-5 gap-2 justify-center mb-6">
        <CardInfo title="Total value"/>
        <ChartPrice data={item.phsm} config={ChartConfigVolMed} className="col-span-1 xl:col-span-2" chartClassName=""/> 
        <CardInfo
          title="Total profit"
          description="Total profit in relation to store price"
        />
        <CardInfo title="Total items" />
      </div>
      <div className="flex flex-col flex-wrap sm:flex-row gap-4 md:overflow-hidden justify-center">
        <ItemPreview item={item} />
        <ItemPreview item={item} />
        <ItemPreview item={item} />
        <ItemPreview item={item} />
        <ItemPreview item={item} />
        <ItemPreview item={item} />
        <ItemPreview item={item} />
        <ItemPreview item={item} />
        <ItemPreview item={item} />
        <ItemPreview item={item} />
      </div>
    </>
  );
}
