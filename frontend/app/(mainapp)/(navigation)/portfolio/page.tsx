import { demo1, demo2 } from "@/app/ui/demo-data";
import { AccordionCharts } from "@/app/ui/portfolio/accordion-charts";
import ItemList from "@/app/ui/portfolio/item-list";
import PortfolioHeader from "@/app/ui/portfolio/portfolio-header";
import PortfolioItemPreview from "@/app/ui/portfolio/portfolio-item-preview";

import {PItem} from "@/app/ui/types";

export default function Page() {
  const items: PItem[] = [
    { item: demo1, count: 1 },
    { item: demo1, count: 2 },
    { item: demo1, count: 2 },
    { item: demo1, count: 2 },
    { item: demo1, count: 2 },
  ];

  return (
    <>
      <div className="flex flex-row justify-center mb-6 gap-4">
        <PortfolioHeader />
      </div>
      <div className="mb-6">
        <AccordionCharts />
      </div>

      <div >
        <ItemList p_items={items} />
      </div>
    </>
  );
}
