import Link from "next/link";
import Image from "next/image";
import { ItemInfo } from "@/app/ui/common/types";
import Skeleton from "react-loading-skeleton";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { sendItemCount } from "@/services/portfolioService";

interface ItemDetailHeaderProps {
  item: ItemInfo;
  isInPortfolio: boolean|null;
}

function StatDisplayer({
  title,
  value,
  className,
}: {
  title: string;
  value: string;
  className?: string;
}) {
  return (
    <p className={`flex flex-row justify-between ${className || ""}`}>
      <strong>{title}:</strong> {value}
    </p>
  );
}

export default function ItemDetailHeader({
  item,
  isInPortfolio: inPortfolio,
}: ItemDetailHeaderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isInPortfolio, setIsInPortfolio] = useState<boolean|null>(inPortfolio);

  const handleChangePortfolio = () => {
    sendItemCount(item.name, isInPortfolio ? 0 : 1);
    setIsInPortfolio(!isInPortfolio);
  };

  return (
    <div className="flex flex-row justify-center flex-wrap gap-4">
      <Link href="" className="flex flex-row">
        {isLoading && (
          // <Skeleton
          //   height={400}
          //   width={400}
          //   className={`absolute top-0 left-0 rounded-lg shadow-xl ${
          //     isLoading ? "block" : "hidden pointer-events-none"
          //   }`}
          // />
          " "
        )}
        <Image
          src={item.previewUrl || "/default.png"}
          alt={`${item.name} picture`}
          className={`rounded-lg shadow-xl transition-opacity${
            isLoading ? "absolute" : "block"
          }`}
          width={400}
          height={400}
          onLoad={() => setIsLoading(false)}
          priority={true}
        />
      </Link>

      <div className="flex flex-col py-8 px-4 bg-gray-50 rounded-lg shadow-lg text-xl min-w-[400px]">
        <div className="text-lg flex flex-col gap-2">
          <StatDisplayer
            title="Item name"
            value={item.name}
            className="text-2xl mb-6"
          />
          <StatDisplayer
            title="Collection"
            value={item.itemCollection || "None"}
          />
          <StatDisplayer title="Item type" value={item.itemType} />
          <StatDisplayer
            title="Estimated supply"
            value={item.supplyTotalEstimated.toString()}
          />
          <StatDisplayer
            title="Steam Store price"
            value={item.storePrice.toString()}
          />
          <StatDisplayer title="Accepted" value={item.timeAccepted} />
        </div>

        {isInPortfolio !== null && (
          <Button
            variant={"outline"}
            className="mt-auto"
            onClick={handleChangePortfolio}
          >
            {isInPortfolio ? "Remove from portfolio" : "Add to portfolio"}
          </Button>
        )}
      </div>
    </div>
  );
}
