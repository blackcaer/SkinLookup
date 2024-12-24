"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import clsx from "clsx";
import Link from "next/link";

export default function SearchBar() {
  const [searchResults, setSearchResults] = useState<string[]>([]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;

    const results = query
      ? [
          "Forest Raiders Roadsign Gloves",
          "Forest Raiders Roadsign Locker",
          "Forest Raiders Roadsign Kilt",
        ].filter((item) => item.toLowerCase().includes(query.toLowerCase()))
      : [];
    setSearchResults(results);
  };

  return (
    <div className="relative">
      <Input
        id="search_bar"
        onInput={handleSearch}
        className={clsx(
          "sm:text-md md:text-lg w-full h-14 placeholder:opacity-80 border-x-2 border-t-2 ",
          searchResults.length > 0
            ? "rounded-t-lg rounded-b-none border-b-0"
            : "rounded-lg border-b-2"
        )}
        placeholder="Wpisz tutaj co chcesz znaleźć"
      />
      {searchResults.length > 0 && (
        <ul className="absolute top-full left-0 w-full bg-white border-x-2 border-b-2 border-t-0 z-10 rounded-b-lg">
          {searchResults.map((result, index) => (
            <li key={index} className="p-2 hover:bg-gray-100 rounded-lg">
              <Link
                href={"/item_details/?name=" + result}
                onClick={() => {
                  setSearchResults([]);
                  (
                    document.querySelector("#search_bar") as HTMLInputElement
                  ).value = "";
                }}
              >
                {result}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
