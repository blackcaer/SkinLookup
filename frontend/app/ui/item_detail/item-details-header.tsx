import Link from "next/link";
import Image from "next/image";
import { ItemInfo } from "@/app/ui/common/types";
import Skeleton from "react-loading-skeleton";
import { useState } from "react";

interface ItemDetailHeaderProps {
  item: ItemInfo;
}

function StatDisplayer({ title, value }: { title: string; value: string }) {
  return (
    <p className="flex flex-row justify-between">
      <strong>{title}:</strong> {value}
    </p>
  );
}

export default function ItemDetailHeader({ item }: ItemDetailHeaderProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="flex flex-row justify-center flex-wrap">
      <Link href="" className="flex flex-row">
        {isLoading && (
          <Skeleton
            height={400}
            width={400}
            className="absolute top-0 left-0 rounded-md"
          />
        )}
        <Image
          src={item.previewUrl || "/default.png"}
          alt={`${item.name} picture`}
          className="mr-4 rounded-lg shadow-xl"
          width={400}
          height={400}
          onLoad={() => setIsLoading(false)}
        />
      </Link>

      <div className="flex flex-col py-8 px-4 bg-gray-50 rounded-lg shadow-lg text-xl">
        <h2 className="text-2xl font-bold mb-6">Item name: {item.name}</h2>

        <div className="text-lg flex flex-col gap-2">
          <StatDisplayer title="Collection" value={item.itemCollection} />
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
      </div>
    </div>
  );
}
