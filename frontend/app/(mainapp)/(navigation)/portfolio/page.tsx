'use client';
import React, { useState } from 'react';
import { demo1, demo2 } from "@/app/ui/demo-data";
import { AccordionCharts } from "@/app/ui/portfolio/accordion-charts";
import ItemList from "@/app/ui/portfolio/item-list";
import PortfolioHeader from "@/app/ui/portfolio/portfolio-header";
import PortfolioItemPreview from "@/app/ui/portfolio/portfolio-item-preview";

import {PItem} from "@/app/ui/common/types";

export default function Page() {
  const items: PItem[] = [
    { item: demo1, count: 1 },
    { item: demo2, count: 2 },
  ];
  const [itemList, setItemList] = useState(items);
  return (
    <>
      
        <PortfolioHeader itemList={itemList}/>
      
      <div className="mb-6">
        <AccordionCharts />
      </div>

      <div>
        
        <ItemList itemList={itemList} setItemList={setItemList} />
      </div>
    </>
  );
}
