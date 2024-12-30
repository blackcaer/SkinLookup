import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ChartPrice from "../charts/chart-price";
import { ChartConfigVolMed } from "@/app/ui/common/chart-configs";
import ChartVolume from "../charts/chart-volume";
import { ItemData, PItem, PriceHistory } from "@/app/ui/common/types";

// Helper function to find the closest previous dataPoint
const findClosestPreviousDataPoint = (phsm: PriceHistory[], date: string) => {
  if (new Date(phsm[0].date) > new Date(date)) {
    return null;
  }
  for (let i = phsm.length - 1; i >= 0; i--) {
    if (new Date(phsm[i].date) < new Date(date)) {
      return phsm[i];
    }
  }
  return null;
};

interface AccordionChartsProps {
  pitemList: PItem[];
}
const mergeListOfPhsm = (phsmList: PriceHistory[][]) => {
  const combinedData: { date: string; median: number; volume: number }[] = [];

  // Collect all unique dates
  const allDates = new Set<string>();
  phsmList.forEach((phsm) => {
    phsm.forEach((dataPoint) => {
      allDates.add(dataPoint.date);
    });
  });

  // Combine data for each date
  allDates.forEach((date) => {
    let totalMedian = 0;
    let totalVolume = 0;

    phsmList.forEach((phsm) => {
      let dataPoint: PriceHistory | undefined | null = phsm.find(
        (dp) => dp.date === date
      );
      if (!dataPoint) {
        dataPoint = findClosestPreviousDataPoint(phsm, date);
      }
      if (dataPoint) {
        totalMedian += dataPoint.median;
        totalVolume += dataPoint.volume;
      }
    });

    combinedData.push({ date, median: totalMedian, volume: totalVolume });
  });

  // Sort combined data by date
  combinedData.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  console.log(combinedData);
  return combinedData;
};

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
