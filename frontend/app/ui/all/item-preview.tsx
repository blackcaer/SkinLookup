import Image from "next/image";
import { FC } from "react";
import Link from "next/link";
import { ItemInfo } from "@/app/ui/types";
import ItemPreviewBase from "./item-preview-base";

interface ItemPreviewProps {
  item: ItemInfo;
}

const ItemPreview: FC<ItemPreviewProps> = ({ item }) => {
  return (
    <div className="flex flex-col w-[240px] h-[300px] border border-gray-300 rounded-lg shadow-lg">
      <ItemPreviewBase item={item}/>
    </div>
  );
};

export default ItemPreview;
