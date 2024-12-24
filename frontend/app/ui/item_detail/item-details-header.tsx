import Link from "next/link";
import Image from "next/image";
import { ItemInfo } from "@/app/ui/types";

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
  return (
    <div className="flex flex-row justify-center flex-wrap">
      <Link href="" className="flex flex-row">
        <Image
          src={item.previewUrl || "/default.png"}
          alt={`${item.name} picture`}
          className="mr-4 rounded-lg shadow-xl"
          width={400}
          height={400}
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
