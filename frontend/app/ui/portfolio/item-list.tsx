'use client';
import React, { useState } from 'react';
import { ItemInfo } from '@/app/ui/types';
import PortfolioItemPreview from './portfolio-item-preview';

interface ItemListProps {
  p_items: { item: ItemInfo; count: number }[];
}

const ItemList: React.FC<ItemListProps> = ({ p_items: items }) => {
  const [itemList, setItemList] = useState(items);

  const handleRemoveItem = (nameId: number) => {
    setItemList((prevItems) => prevItems.filter((p_items) => p_items.item.nameId !== nameId));
  };

  const handleIncreaseItem = (nameId: number) => {
    setItemList((prevItems) =>
      prevItems.map((p_items) =>
        p_items.item.nameId === nameId ? { ...p_items, count: p_items.count + 1 } : p_items
      )
    );
  };

  const handleDecreaseItem = (nameId: number) => {
    setItemList((prevItems) =>
      prevItems.map((p_item) =>
        p_item.item.nameId === nameId && p_item.count > 1
          ? { ...p_item, count: p_item.count - 1 }
          : p_item
      )
    );
  };

  return (
    <div className="flex flex-col flex-wrap sm:flex-row gap-4 md:overflow-hidden justify-center">
      {itemList.map(({ item, count }) => (
        <PortfolioItemPreview
          key={item.nameId}
          item={item}
          count={count}
          onRemove={() => handleRemoveItem(item.nameId)}
          onIncrease={() => handleIncreaseItem(item.nameId)}
          onDecrease={() => handleDecreaseItem(item.nameId)}
        />
      ))}
    </div>
  );
};

export default ItemList;