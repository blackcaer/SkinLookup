"use client";
import { PItem } from "@/app/ui/common/types";
import PortfolioItemPreview from "./portfolio-item-preview";

interface ItemListProps {
  pitemList: PItem[];
  setPItemList: React.Dispatch<React.SetStateAction<PItem[]>>;
}

const ItemList: React.FC<ItemListProps> = ({
  pitemList: pitemList,
  setPItemList: setPItemList,
}) => {
  const handleRemoveItem = (nameId: number) => {
    setPItemList((prevItems) =>
      prevItems.filter((p_item) => p_item.itemData.item.nameId !== nameId)
    );
  };

  const handleIncreaseItem = (nameId: number) => {
    setPItemList((prevItems) =>
      prevItems.map((p_item) =>
        p_item.itemData.item.nameId === nameId
          ? { ...p_item, count: p_item.count + 1 }
          : p_item
      )
    );
  };

  const handleDecreaseItem = (nameId: number) => {
    setPItemList((prevItems) =>
      prevItems.map((p_item) =>
        p_item.itemData.item.nameId === nameId && p_item.count > 1
          ? { ...p_item, count: p_item.count - 1 }
          : p_item
      )
    );
  };

  return (
    <div>
      <div className="text-right pr-6 pb-2 text-lg">
        {pitemList.length} shown positions{" "}
      </div>
      <div className="flex flex-col flex-wrap sm:flex-row gap-4 md:overflow-hidden justify-center">
        {pitemList.map(({ itemData, count }) => (
          <PortfolioItemPreview
            key={itemData.item.nameId}
            item={itemData.item}
            count={count}
            onRemove={() => handleRemoveItem(itemData.item.nameId)}
            onIncrease={() => handleIncreaseItem(itemData.item.nameId)}
            onDecrease={() => handleDecreaseItem(itemData.item.nameId)}
          />
        ))}
      </div>
    </div>
  );
};

export default ItemList;
