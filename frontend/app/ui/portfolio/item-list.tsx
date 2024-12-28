"use client";
import { PItem } from "@/app/ui/common/types";
import PortfolioItemPreview from "./portfolio-item-preview";

interface ItemListProps {
  pitemList: PItem[];
  setPItemList: React.Dispatch<React.SetStateAction<PItem[]>>;
}

const sendItemCount = async (itemName: string, count: number) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      console.error("No token found");
      return;
    }
    const response = await fetch(
      `http://127.0.0.1:8000/api/portfolio/set_item_count/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: itemName,
          count: count,
        }),
      }
    );
    console.log("Response: ", response);
    if (response.ok) {
      console.log("Response ok");
    } else {
      console.log(
        `Bad status code: ${response.statusText} (${response.status})`
      );
    }
  } catch (error) {
    console.error("Error fetching item data:", error);
    console.log("Error fetching item data");
  }
};

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
      <div className="flex flex-col flex-wrap sm:flex-row gap-4 md:overflow-hidden justify-center">
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
