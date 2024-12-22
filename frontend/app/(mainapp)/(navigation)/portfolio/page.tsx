import Image from "next/image";
import ItemPreview from "@/app/ui/all_items/item_preview";
import { demo1, demo2 } from "@/app/ui/demo-data";

export default function Page() {
  const sampleData = demo1
  sampleData.previewUrl = "/fr_locker.png";

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
