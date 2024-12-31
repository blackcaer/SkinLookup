import { PItem } from "@/app/ui/common/types";
import CardInfo from "./card-info";

interface PortfolioHeaderProps {
  pitemList: PItem[];
}

export default function PortfolioHeader({pitemList}:PortfolioHeaderProps) {
  const totalItems = pitemList.reduce((sum, currentPItem) => sum + currentPItem.count, 0);
  const sumPriceWeekAgo = pitemList.reduce((sum, currentPItem) => sum + currentPItem.count*(currentPItem.itemData.priceWeekAgo||0), 0);
  const sumPriceNow = pitemList.reduce((sum, currentPItem) => sum + currentPItem.count*(currentPItem.itemData.priceNow||0), 0);
  const sumPriceStore = pitemList.reduce((sum, currentPItem) => sum + currentPItem.count*currentPItem.itemData.item.storePrice, 0);
  const sumPriceProfit = 100*(sumPriceNow - sumPriceStore)/sumPriceStore;
  const weeklyChange = (100*(sumPriceNow-sumPriceWeekAgo)/sumPriceNow);

  return (  
    <div className="grid grid-cols-2 lg:flex flex-row justify-center mb-6 gap-4">
      <CardInfo
        title="Total value"
        description="Total value of items in portfolio"
        content={"$ "+sumPriceNow.toFixed(2)}
      />
      <CardInfo
        title="Total profit"
        description="Total profit in relation to store price"
        content={sumPriceProfit.toFixed(2)+"%"}
      />
      <CardInfo
        title="Weekly value change"
        description="Weekly value change of your items"
        // content="-1.3%"
        content={weeklyChange.toFixed(2)+"%"}
      />
      <CardInfo
        title="Total items"
        description="Total items in portfolio"
        content={totalItems.toString()}
      />
    </div>
  );
}
