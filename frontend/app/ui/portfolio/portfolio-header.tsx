import { PItem } from "@/app/ui/common/types";
import CardInfo from "./card-info";

interface PortfolioHeaderProps {
  pitemList: PItem[];
}

export default function PortfolioHeader({pitemList: itemList}:PortfolioHeaderProps) {
  const foo = itemList.reduce((sum, currentItem) => sum + currentItem.count, 0);
  return (
    <div className="flex flex-row justify-center mb-6 gap-4">
      <CardInfo
        title="Total value"
        description="Total value of items in portfolio"
        content="$ 374.02"
      />
      <CardInfo
        title="Total profit"
        description="Total profit in relation to store price"
        content="72%"
      />
      <CardInfo
        title="Weekly value change"
        description="Weekly value change of your items"
        content="-1.3%"
      />
      <CardInfo
        title="Total items"
        description="Total items in portfolio"
        content={foo.toString()}
      />
    </div>
  );
}
