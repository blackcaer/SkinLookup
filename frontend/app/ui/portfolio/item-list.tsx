"use client";
import { PItem } from "@/app/ui/common/types";
import PortfolioItemPreview from "./portfolio-item-preview";
import { sendItemCount } from "@/services/portfolioService";

interface ItemListProps {
  pitemList: PItem[];
  setPItemList: React.Dispatch<React.SetStateAction<PItem[]>>;
}

const ItemList: React.FC<ItemListProps> = ({
  pitemList: pitemList,
  setPItemList: setPItemList,
}) => {
  const handleOnChangeCount = (name: string, count: number) => {
    sendItemCount(name, count);

    if (count === 0) {
      setPItemList((prevItems) =>
        prevItems.filter((p_item) => p_item.itemData.item.name !== name)
      );
    } else
      setPItemList((prevItems) =>
        prevItems.map((p_item) =>
          p_item.itemData.item.name === name ? { ...p_item, count } : p_item
        )
      );
  };

  return (
    <div>
      <div className="text-right pr-6 pb-2 text-lg">
        {pitemList.length} shown positions{" "}
      </div>
      <div className="flex flex-col flex-wrap sm:flex-row gap-4 md:overflow-hidden justify-center items-center">
        {pitemList.map(({ itemData, count }) => (
          <PortfolioItemPreview
            key={itemData.item.nameId}
            item={itemData.item}
            count={count}
            onChangeCount={(count) =>
              handleOnChangeCount(itemData.item.name, count)
            }
          />
        ))}
      </div>
    </div>
  );
};

export default ItemList;
