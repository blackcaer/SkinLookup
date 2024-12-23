import CardInfo from "./card-info";

export default function PortfolioHeader() {
  return (
    <>
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
        content="32"
      />
    </>
  );
}
