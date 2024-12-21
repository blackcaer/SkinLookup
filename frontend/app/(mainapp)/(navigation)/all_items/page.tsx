import Image from "next/image";
import ItemPreview from "@/app/ui/all_items/item_preview";

export default function Page() {
  const sampleData = {
    "id": 6196910726,
    "appId": 252490,
    "itemType": "Locker",
    "itemCollection": "Forest Raiders",
    "name": "Forest Raiders Locker",
    "nameId": 176460408,
    //"previewUrl": "https://steamuserimages-a.akamaihd.net/ugc/2452862891801771581/B96690B4E46626858DF8FD93D59715427CE8267A/",
    "previewUrl": "/fr_locker.png",
    "supplyTotalEstimated": 29888,
    "timeAccepted": "2024-10-03T00:00:00",
    "storePrice": 2.49
}
  
  return (
    <div className="flex flex-col flex-wrap sm:flex-row gap-4 md:overflow-hidden">
      <ItemPreview item={sampleData} />
      <ItemPreview item={sampleData} />
      <ItemPreview item={sampleData} />
      <ItemPreview item={sampleData} />
      <ItemPreview item={sampleData} />
      <ItemPreview item={sampleData} />
      <ItemPreview item={sampleData} />
      <ItemPreview item={sampleData} />
      <ItemPreview item={sampleData} />
      <ItemPreview item={sampleData} />
      
    </div>
  );
}
