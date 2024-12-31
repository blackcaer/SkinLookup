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
  ).slice(1); // Remove the oldest element, because there's often no data for it

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>
          Show portfolio value throughout the history
        </AccordionTrigger>
        <AccordionContent>
          <ChartPrice
            title="Portfolio value over time"
            description="Total value of all items in the portfolio (spikes in price might be caused by new items being released)"
            data={combinedDataForCharts}
            config={ChartConfigVolMed}
            className=""
            chartClassName=""
          />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-2">
        <AccordionTrigger>
          Show volume of portfolio items throughout the history
        </AccordionTrigger>
        <AccordionContent>
          <ChartVolume
            title="Portfolio volume over time"
            description="Total sold volume of all items in the portfolio (does not depend on count of items)"
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
