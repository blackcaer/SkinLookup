'use client';
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';

interface ItemPreviewBaseProps {
    item: {
        previewUrl: string;
        name: string;
    };
}

export default function ItemPreviewBase({ item }: ItemPreviewBaseProps) {
    const [isLoading, setIsLoading] = useState(true);

    const handleLoadingComplete = () => {
        setIsLoading(false);
    };

    return (
        <>
            <Link href={`/item_details?name=${item.name}`}>
                {isLoading && <Skeleton height={240} width={240} className="absolute top-0 left-0 rounded-md" />}
                <Image
                    src={item.previewUrl || "/default.png"}
                    alt={`${item.name} picture`}
                    className={`mr-4 rounded-md transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                    width={240}
                    height={240}
                    onLoad={handleLoadingComplete}
                    priority={true}
                />
            </Link>
            <div className="flex flex-col items-center justify-center h-full w-full">
                <h2 className="break-words text-center text-lg pt-1">{item.name}</h2>
            </div>
        </>
    );
}