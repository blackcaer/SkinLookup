'use client';
    
import Image from "next/image";
import { FC, useState } from "react";
import Link from "next/link";
import { ItemInfo } from "@/app/ui/types";
import {
    PlusIcon,
    MinusIcon,
    TrashIcon
  } from "@heroicons/react/24/outline";

interface ItemPreviewProps {
  item: ItemInfo;
  count?: number;
  onRemove: () => void;
  onIncrease: () => void;
  onDecrease: () => void;
}

const ItemPreview: FC<ItemPreviewProps> = ({ item, count, onRemove, onIncrease, onDecrease }) => {
  const [itemCount, setItemCount] = useState(count || 1);

  const handleIncrease = () => {
    setItemCount(itemCount + 1);
    onIncrease();
  };

  const handleDecrease = () => {
    if (itemCount > 1) {
      setItemCount(itemCount - 1);
      onDecrease();
    }
  };

  const handleDelete = () => {
    onRemove();
  };

  return (
    <div className="relative flex flex-col w-[240px] h-[300px] border border-gray-300 rounded-lg shadow-lg group">
      <Link href="/item_details">
        <Image
          src={item.previewUrl || "/default.png"}
          alt={`${item.name} picture`}
          className="mr-4 rounded-md"
          width={240}
          height={240}
        />
      </Link>
      <h2 className="break-words text-center pt-1">{item.name} x{itemCount}</h2>
      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-90 transition-opacity flex items-center justify-center rounded-lg">
        <div className="flex flex-col text-white items-center justify-center gap-3">
          <form>
            <button type="button" className="h-12 w-12" onClick={handleIncrease}><PlusIcon/></button>
            <button type="button" className="h-12 w-12" onClick={handleDecrease}><MinusIcon/></button>
            <button type="button" className="h-12 w-12" onClick={handleDelete}><TrashIcon/></button>
          </form>
          <p className="text-4xl">{itemCount}</p>
        </div>
      </div>
    </div>
  );
};

export default ItemPreview;
