import Image from "next/image";
import ItemPreview from "@/app/ui/all_items/item_preview";
import { demo1, demo2 } from "@/app/ui/demo-data";
import { ChartConfigVolMed } from "@/app/ui/chart-configs";
import ChartPrice from "@/app/ui/charts/chart-price";
import CardInfo from "@/app/ui/portfolio/card-info";
import { AccordionCharts } from "@/app/ui/portfolio/accordion-charts";

export default function Page() {
  const item = demo2;
  item.previewUrl = "/fr_locker.png";

  return (
    <>
      <div className="flex flex-row justify-center mb-6 gap-4">
        <CardInfo
          title="Total value"
          description="Total value of items in portfolio"
          content="$ 374.02"
        />
        <CardInfo
          title="Total profit"
          description="Total profit in relation to store price"
          content="72%"
        />
        <CardInfo
          title="Weekly value change"
          description="Weekly value change of your items"
          content="-1.3%"
        />
        <CardInfo
          title="Total items"
          description="Total items in portfolio"
          content="32"
        />
      </div>
      <div className="mb-6">
        <AccordionCharts/>
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
