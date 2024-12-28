'use client';
    
import { FC, useState } from "react";
import { ItemInfo } from "@/app/ui/common/types";
import {
    PlusIcon,
    MinusIcon,
    TrashIcon
  } from "@heroicons/react/24/outline";
import ItemPreviewBase from "../all/item-preview-base";

interface PortfolioItemPreviewProps {
  item: ItemInfo;
  count?: number;
  onChangeCount: (count:number) => void;
}

const PortfolioItemPreview: FC<PortfolioItemPreviewProps> = ({ item, count, onChangeCount }) => {
  const [itemCount, setItemCount] = useState(count || 1);

  const handleIncrease = () => {
    const newCount = itemCount + 1;
    setItemCount(newCount);
    onChangeCount(newCount);
  };

  const handleDecrease = () => {
    if (itemCount > 1) {
      const newCount = itemCount - 1;
      setItemCount(newCount);
      onChangeCount(newCount);
    }
  };

  const handleDelete = () => {
    onChangeCount(0);
    setItemCount(0);
  };

  const formattedItemName = `${item.name} x${itemCount}`;

  return (
    <div className="relative flex flex-col w-[240px] h-[300px] border border-gray-300 rounded-lg shadow-lg group">
      <ItemPreviewBase item={{ ...item, name: formattedItemName }}/>
      
      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-90 transition-opacity flex items-center justify-center rounded-lg">
        <div className="flex flex-col text-white items-center justify-center gap-3">
          <form>
            <button type="button" className="h-12 w-12" onClick={handleIncrease}><PlusIcon/></button>
            <button type="button" className="h-12 w-12" onClick={handleDecrease}><MinusIcon/></button>
            <button type="button" className="h-12 w-12" onClick={handleDelete}><TrashIcon/></button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PortfolioItemPreview;
