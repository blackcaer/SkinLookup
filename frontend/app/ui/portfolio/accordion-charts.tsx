import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
import ChartPrice from "../charts/chart-price"
import { demo1, demo2 } from "@/app/ui/demo-data";
import { ChartConfigVolMed } from "@/app/ui/chart-configs";
import ChartVolume from "../charts/chart-volume";

export function AccordionCharts() {
    const item = demo2;     //TODO - add props, change to real data
    return (
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>Show items value throughout the history</AccordionTrigger>
          <AccordionContent>
            <ChartPrice data={item.phsm} config={ChartConfigVolMed} className="" chartClassName=""/>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="item-2">
          <AccordionTrigger>Show items volume throughout the history</AccordionTrigger>
          <AccordionContent>
            <ChartVolume data={item.phsm} config={ChartConfigVolMed} className="" chartClassName=""/>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger>Some other info</AccordionTrigger>
          <AccordionContent>
            there is info
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    )
  }
