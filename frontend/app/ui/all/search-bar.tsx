"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import clsx from "clsx";
import Link from "next/link";

export default function SearchBar() {
  const MAX_SEARCH_RESULTS = 10;
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [query, setQuery] = useState<string>("");

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  useEffect(() => {
    const searchQuery = async () => {
      if (!query) {
        setSearchResults([]);
        return;
      }

      const staticResult = searchResults.filter((item) =>
        item.toLowerCase().includes(query.toLowerCase())
      );
      if (staticResult.length >= MAX_SEARCH_RESULTS) {
        // Short circuit if we have enough results
        setSearchResults(staticResult);
        console.log("short circuit");
        return;
      }

      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/search/${query}/`,
          {
            method: "GET",
          }
        );
        if (response.ok) {
          console.log("Response ok");
          const data = await response.json();
          setSearchResults(data);
        } else {
          console.log("Response bad");
          console.log(
            `Error fetching item data: ${response.statusText} (${response.status})`
          );
        }
      } catch (error) {
        console.error("Error fetching item data:", error);
        console.log("Error fetching item data");
      }
    };
    searchQuery();
  }, [query]);

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
        value={query}
        placeholder="Your search here"
      />
      {searchResults.length > 0 && (
        <ul className="absolute top-full left-0 w-full bg-white border-x-2 border-b-2 border-t-0 z-10 rounded-b-lg">
          {searchResults.slice(0, MAX_SEARCH_RESULTS).map((result, index) => (
            <li key={index} className="p-2 hover:bg-gray-100 rounded-lg">
              <Link
                href={"/item_details/?name=" + result}
                onClick={() => {
                  setSearchResults([]);
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
