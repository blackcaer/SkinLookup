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
    <Link href="/item_details" className="flex flex-col w-[240px]">
      <Image
        src={item.previewUrl || "/default.png"}
        alt={`${item.name} picture`}
        className="mr-4 rounded-md"
        width={240}
        height={240}
      />
      <h2 className="break-words text-center"> {item.name} </h2>
      {/* <p> Collection {item.itemCollection} </p> */}
    </Link>
  );
};

export default ItemPreview;
