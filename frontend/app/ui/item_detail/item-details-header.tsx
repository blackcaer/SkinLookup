import Link from "next/link";
import Image from "next/image";
import { ItemInfo } from "@/app/ui/types";

interface ItemDetailHeaderProps {
  item: ItemInfo;
}

export default function ItemDetailHeader({ item }: ItemDetailHeaderProps) {
    return (<div className="flex flex-row gap-4">
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
          <h2> {item.name} </h2>
          <p> Collection {item.itemCollection} </p>
          <p> itemType {item.itemType} </p>
          <p> Estimated supply on market {item.supplyTotalEstimated} </p>
          <p> Accepted {item.timeAccepted} </p>
          <p> Steam Store price {item.storePrice} </p>
        </div>
      </div>);
}