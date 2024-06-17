import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/UI/Pagination";

interface CakesPaginationProps {
  totalPages: number;
  paginate: (pageNumber: number) => void;
  currentPage: number;
}

const CakesPagination = ({ totalPages, paginate, currentPage }: CakesPaginationProps) => {
  const scrollCakeIntoView = () => {
    setTimeout(() => {
      const cakeSection = document.getElementById("cake-section");
      if (cakeSection) {
        cakeSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const backBtn = () => {
    if (currentPage > 1) {
      paginate(currentPage - 1);
      scrollCakeIntoView();
    }
  };

  const nextBtn = () => {
    if (currentPage < totalPages) {
      paginate(currentPage + 1);
      scrollCakeIntoView();
    }
  };

  const pageNumberSelect = (pageNumber: number) => {
    paginate(pageNumber);
    scrollCakeIntoView();
  };

  const renderPaginationItems = () => {
    const items = [];

    // Always show the first page
    items.push(
      <PaginationItem key={1}>
        <PaginationLink
          onClick={() => pageNumberSelect(1)}
          className={`flex items-center justify-center m-0 p-0 h-6 w-6 rounded-md cursor-pointer transition duration-300 ease-in-out ${
            currentPage === 1
              ? "bg-luoDarkBiege text-white"
              : "bg-white text-black hover:bg-stone-600"
          }`}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    // Show ellipsis if current page is more than 3
    if (currentPage > 3) {
      items.push(<PaginationEllipsis key="start-ellipsis" />);
    }

    // Show the page before the current page if it's greater than 2
    if (currentPage > 2) {
      items.push(
        <PaginationItem key={currentPage - 1}>
          <PaginationLink
            onClick={() => pageNumberSelect(currentPage - 1)}
            className={`flex items-center justify-center m-0 p-0 h-6 w-6 rounded-md cursor-pointer transition duration-300 ease-in-out ${
              currentPage === currentPage - 1
                ? "bg-luoDarkBiege text-white"
                : "bg-white text-black hover:bg-stone-600"
            }`}
          >
            {currentPage - 1}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Show the current page
    if (currentPage !== 1 && currentPage !== totalPages) {
      items.push(
        <PaginationItem key={currentPage}>
          <PaginationLink
            onClick={() => pageNumberSelect(currentPage)}
            className="flex items-center justify-center m-0 p-0 h-6 w-6 rounded-md bg-luoDarkBiege text-white cursor-pointer transition duration-300 ease-in-out"
          >
            {currentPage}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Show the page after the current page if it's less than total pages - 1
    if (currentPage < totalPages - 1) {
      items.push(
        <PaginationItem key={currentPage + 1}>
          <PaginationLink
            onClick={() => pageNumberSelect(currentPage + 1)}
            className={`flex items-center justify-center m-0 p-0 h-6 w-6 rounded-md cursor-pointer transition duration-300 ease-in-out ${
              currentPage === currentPage + 1
                ? "bg-luoDarkBiege text-white"
                : "bg-white text-black hover:bg-stone-600"
            }`}
          >
            {currentPage + 1}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Show ellipsis if current page is less than total pages - 2
    if (currentPage < totalPages - 2) {
      items.push(<PaginationEllipsis key="end-ellipsis" />);
    }

    // Always show the last page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            onClick={() => pageNumberSelect(totalPages)}
            className={`flex items-center justify-center m-0 p-0 h-6 w-6 rounded-md cursor-pointer transition duration-300 ease-in-out ${
              currentPage === totalPages
                ? "bg-luoDarkBiege text-white"
                : "bg-white text-black hover:bg-stone-600"
            }`}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={backBtn}
              className="cursor-pointer bg-luoDarkBiege hover:bg-stone-600"
            />
          </PaginationItem>
          {renderPaginationItems()}
          <PaginationItem>
            <PaginationNext
              onClick={nextBtn}
              className="cursor-pointer bg-luoDarkBiege hover:bg-stone-600"
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default CakesPagination;
