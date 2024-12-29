import { FC, useState } from "react";
import { ItemInfo } from "@/app/ui/common/types";
import ItemPreviewBase from "./item-preview-base";
import { PlusIcon, CheckIcon } from "@heroicons/react/24/outline";
import { sendItemCount } from "@/services/portfolioService";

interface ItemPreviewProps {
  item: ItemInfo;
  inPortfolio: boolean;
  isLoggedIn: boolean;
}

const ItemPreview: FC<ItemPreviewProps> = ({
  item,
  inPortfolio,
  isLoggedIn,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isInPortfolio, setIsInPortfolio] = useState(inPortfolio);

  const handleChangePortfolio = () => {
    sendItemCount(item.name, isInPortfolio ? 0 : 1);
    setIsInPortfolio(!isInPortfolio);
  };

  return (
    <div
      className="relative flex flex-col w-[240px] h-[300px] border border-gray-300 rounded-lg shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <ItemPreviewBase item={item} />
      {isHovered && isLoggedIn && (
        <button
          type="button"
          className="absolute top-2 right-2"
          onClick={handleChangePortfolio}
        >
          {isInPortfolio ? (
            <CheckIcon className="w-8 h-8 text-white" />
          ) : (
            <PlusIcon className="w-8 h-8 text-white" />
          )}
        </button>
      )}
    </div>
  );
};

export default ItemPreview;
