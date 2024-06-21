"use client";

import { ChangeEvent, useCallback, useEffect, useState } from "react";
import ContentWrapper from "../UI/ContentWrapper";
import { Cakes } from "@/types/data-types";
import CakeItems from "./item";
import TotalCakes from "./total";
import { getAllCakes } from "@/api/cakes-api";
import SearchCakes from "./search";
import CakesPagination from "./pagination";
import AddModal from "./modal/addModal";

const CakeComponent = () => {
  const [cakes, setCakes] = useState<Cakes[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const [searchQuery, setSearchQuery] = useState("");

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query.toLowerCase());
    setCurrentPage(1);
  };

  const filteredCakes = cakes.filter(cake => cake.name.toLowerCase().includes(searchQuery));
  const totalPages = Math.ceil(filteredCakes.length / itemsPerPage);
  const currentCakes = filteredCakes.slice(indexOfFirstItem, indexOfLastItem);

  const fetchCakes = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllCakes();

      setCakes(data.data.reverse());
    } catch (error) {
      console.error("Failed to fetch fishes or types:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCakes();
  }, [fetchCakes]);

  const updateCakes = (updatedCakes: Cakes[]) => {
    setCakes(updatedCakes);
  };

  const refetch = () => {
    fetchCakes();
  };

  return (
    <>
      <section id="cake-section" className="section-wrapper w-[95%] max-w-[1000px] pt-5">
        <h1 className="text-luoDarkBiege text-2xl font-bold mb-6">Manage Cakes</h1>
        <div className="flex flex-col flex-wrap justify-between items-center mb-3">
          <div className="flex justify-between w-full items-center mb-2 sm:justify-end">
            <button
              className="bg-luoDarkBiege text-white px-3 py-2.5 rounded-md sm:hidden"
              onClick={() => setIsOpen(true)}
            >
              Add Cake
            </button>
            <SearchCakes onSearch={handleSearch} />
          </div>
          <div className="w-full flex flex-warp items-center">
            <button
              className="bg-luoDarkBiege text-white px-3 min-w-fit py-2.5 rounded-md hidden sm:block"
              onClick={() => setIsOpen(true)}
            >
              Add Cake
            </button>
            <div className="flex justify-between gap-2 items-center w-full sm:justify-end">
              <CakesPagination
                totalPages={totalPages}
                paginate={paginate}
                currentPage={currentPage}
              />
              <TotalCakes value={itemsPerPage} onChange={handleItemsPerPageChange} />
            </div>
          </div>
        </div>
        <ContentWrapper loading={loading}>
          {currentCakes.map(cake => (
            <CakeItems
              cake={cake}
              cakes={cakes}
              key={cake.ID}
              updateCakes={updateCakes}
              refetch={refetch}
            />
          ))}
        </ContentWrapper>
        <AddModal open={isOpen} setOpen={setIsOpen} refetch={refetch} />
      </section>
    </>
  );
};

export default CakeComponent;
