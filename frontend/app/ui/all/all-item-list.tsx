"use client";
import React, { useEffect, useState } from "react";
import { ItemInfo } from "@/app/ui/common/types";
import ItemPreview from "@/app/ui/all/item-preview";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { clearTokens, getToken } from "@/services/authServise";

const ITEMS_PER_PAGE = 36;

const AllItemList = () => {
  const [items, setItems] = useState<ItemInfo[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [namesInPortfolio, setNamesInPortfolio] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    const fetchItems = async () => {
      const token = getToken();
      if (!token) {
        console.log("No token found");
        setIsLoggedIn(false);
      } else {
        setIsLoggedIn(true);
      }

      try {
        const response = await fetch("http://127.0.0.1:8000/api/items/all/", {
          method: "GET",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!response.ok) {
          if (token) {
            // Authorization error, expired token
            clearTokens();
            window.location.reload();
            return;
          }else 
            throw new Error(`${response.status} ${response.statusText}`);
        } 

        const data = await response.json();
        setNamesInPortfolio(data["names_in_portfolio"]); // If user not authenticated, this will be []
        setItems(data["items"]);

      } catch (error) {
        setError("Error fetching items: " + error);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  if (error) return <div>{error}</div>;

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = items.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="flex flex-wrap flex-row gap-4 justify-center">
      {currentItems.map((item) => (
        <ItemPreview
          key={item.nameId}
          item={item}
          inPortfolio={namesInPortfolio.includes(item.name)}
          isLoggedIn={isLoggedIn}
        />
      ))}
      <div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious onClick={handlePreviousPage} href="#" />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  href="#"
                  isActive={index + 1 === currentPage}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext onClick={handleNextPage} href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default AllItemList;
