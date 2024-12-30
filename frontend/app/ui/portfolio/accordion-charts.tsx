import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ChartPrice from "../charts/chart-price";
import { ChartConfigVolMed } from "@/app/ui/common/chart-configs";
import ChartVolume from "../charts/chart-volume";
import { PItem } from "@/app/ui/common/types";
import { mergeListOfPhsm } from "./utils";

interface AccordionChartsProps {
  pitemList: PItem[];
}

export function AccordionCharts({ pitemList }: AccordionChartsProps) {
  pitemList[0].itemData.phsm = pitemList[0].itemData.phsm.slice(-10);
  console.log(pitemList);

  // Merged phsm of all portfolio items. 
  // Median is multiplied by count of items, so it shows historical total value of portfolio. 
  // Volume is not multiplied, because it does not depend on user's count of items.
  const combinedDataForCharts = mergeListOfPhsm(
    pitemList.map((pitem) =>
      pitem.itemData.phsm.map((dp) => ({
        ...dp,
        median: dp.median * pitem.count,
      }))
    )
  ); 

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>
          Show items value throughout the history
        </AccordionTrigger>
        <AccordionContent>
          <ChartPrice
            data={combinedDataForCharts}
            config={ChartConfigVolMed}
            className=""
            chartClassName=""
          />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-2">
        <AccordionTrigger>
          Show items volume throughout the history
        </AccordionTrigger>
        <AccordionContent>
          <ChartVolume
            data={combinedDataForCharts}
            config={ChartConfigVolMed}
            className=""
            chartClassName=""
          />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-3">
        <AccordionTrigger>Some other info</AccordionTrigger>
        <AccordionContent>there is info</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
