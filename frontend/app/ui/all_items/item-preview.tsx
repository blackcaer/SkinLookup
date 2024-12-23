import Image from "next/image";
import { FC } from "react";
import Link from "next/link";
import { ItemInfo } from "@/app/ui/types";

interface ItemPreviewProps {
  item: ItemInfo;
}

const ItemPreview: FC<ItemPreviewProps> = ({ item }) => {
  return (
    <div className="flex flex-col w-[240px] h-[300px] border border-gray-300 rounded-lg shadow-lg">
    <Link href="/item_details" >
    
      <Image
        src={item.previewUrl || "/default.png"}
        alt={`${item.name} picture`}
        className="mr-4 rounded-md"
        width={240}
        height={240}
      />
      </Link>
      <h2 className="break-words text-center pt-1"> {item.name} </h2>
    </div>
  );
};

export default ItemPreview;
