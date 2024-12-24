import Image from "next/image";
import Link from "next/link";

interface ItemPreviewBaseProps {
    item: {
        previewUrl: string;
        name: string;
    };
}

export default function ItemPreviewBase({ item }: ItemPreviewBaseProps) {
    return (
        <>
            <Link href="/item_details">
                <Image
                    src={item.previewUrl || "/default.png"}
                    alt={`${item.name} picture`}
                    className="mr-4 rounded-md"
                    width={240}
                    height={240}
                />
            </Link>
            <div className="flex flex-col items-center justify-center h-full w-full">
                <h2 className="break-words text-center text-lg pt-1">{item.name}</h2>
            </div>
        </>
    );
}