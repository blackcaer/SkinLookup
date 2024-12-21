import clsx from "clsx";
import Image from "next/image";
import { MapIcon } from "@heroicons/react/24/outline";
import { FC } from "react";
import Link from "next/link";

interface Item {
    id: number;
    appId: number;
    itemType: string;
    itemCollection: string;
    name: string;
    nameId: number;
    previewUrl: string;
    supplyTotalEstimated: number;
    timeAccepted: string;
    storePrice: number;
}

interface ItemPreviewProps {
    item: Item;
}

const ItemPreview: FC<ItemPreviewProps> = ({ item }) => {

  return (
    <Link href="" className="flex flex-row">
        <Image 
            src={item.previewUrl || "/default.png"}
            alt={`${item.name} picture`}
            className="mr-4 rounded-md"
            width={220}
            height={220}
        />
    </Link>
  );
}

export default ItemPreview;
