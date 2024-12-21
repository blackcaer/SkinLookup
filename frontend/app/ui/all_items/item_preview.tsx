import clsx from "clsx";
import Image from "next/image";
import { FC } from "react";
import Link from "next/link";
import { ItemInfo } from "@/app/ui/types";

interface ItemPreviewProps {
    item: ItemInfo;
}

const ItemPreview: FC<ItemPreviewProps> = ({ item }) => {

  return (
    <Link href="/" className="flex flex-col">
        <Image 
            src={item.previewUrl || "/default.png"}
            alt={`${item.name} picture`}
            className="mr-4 rounded-md"
            width={220}
            height={220}
        />
        <label> Collection {item.itemCollection} </label>
        <label> {item.name} </label>
    </Link>
  );
}

export default ItemPreview;
