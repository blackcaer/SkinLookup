import Link from "next/link";
import clsx from "clsx";
import Image from "next/image";
import { ItemInfo } from "@/app/ui/types";
import ChartLine2 from "@/app/ui/stats/chart-line-2";

import { demo1, demo2 } from "@/app/ui/demo-data";

export default function Page() {
  const item = demo2;
  item.previewUrl = "/fr_locker.png";

  const lineChartConfig = {
    desktop: {
      label: "Visitors",
      color: "hsl(var(--chart-1))",
    },
  };

  const barChartConfig = {
    sales: {
      label: "Activity minutes",
      color: "hsl(var(--chart-1))",
    },
    price: {
      label: "Average activity",
      color: "hsl(var(--chart-2))",
    },
  };

  const filteredPhsm = item.phsm.map(({ volume, ...rest }) => rest);

  return (
    <div > {/*className="flex flex-col sm:flex-col gap-1 md:overflow-hidden">*/}

        {/* <div className="grid gap-6 md:grid-cols-2"> */}
        <div className="flex flex-row">
            <Link href="" className="flex flex-col">
                <Image
                src={item.previewUrl || "/default.png"}
                alt={`${item.name} picture`}
                className="mr-4 rounded-md"
                width={400}
                height={400}
                />
                <label> Collection {item.itemCollection} </label>
                <label> {item.name} </label>
            </Link>
            <ChartLine2 data={filteredPhsm} config={barChartConfig} />


        </div>

    </div>
  );
}
