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
  const combinedData = mergeListOfPhsm(
    pitemList.map((pitem) => pitem.itemData.phsm)
  );

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>
          Show items value throughout the history
        </AccordionTrigger>
        <AccordionContent>
          <ChartPrice
            data={combinedData}
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
            data={combinedData}
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
