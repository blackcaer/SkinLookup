import Link from "next/link";
import clsx from "clsx";
import Image from "next/image";
import { ItemInfo } from "@/app/ui/types";
import ChartPrice from "@/app/ui/stats/chart-price";

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

        <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-4">
                <Link href="" className="flex flex-row">
                    <Image
                    src={item.previewUrl || "/default.png"}
                    alt={`${item.name} picture`}
                    className="mr-4 rounded-md"
                    width={400}
                    height={400}
                    />
                </Link>

                <div className="flex flex-col gap-2">
                    <h2 > {item.name} </h2>
                    <p > Collection {item.itemCollection} </p>
                    <p > itemType {item.itemType} </p>
                    <p > Estimated supply on market {item.supplyTotalEstimated} </p>
                    <p > Accepted {item.timeAccepted} </p>
                    <p > Steam Store price {item.storePrice} </p>
                </div>
            </div>

                
            <ChartPrice 
                data={filteredPhsm} 
                config={barChartConfig}
                />

        </div>

    </div>
  );
}
