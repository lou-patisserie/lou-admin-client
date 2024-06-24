"use client";

import { ProductTypes } from "@/types/data-types";
import { useCallback, useEffect, useState } from "react";
import ContentWrapper from "../UI/ContentWrapper";
import AddModal from "./modal/addModal";
import ProductTypeItems from "./item";
import { getAllProductTypes } from "@/api/product-type-api";

const ProductComponent = () => {
  const [types, setTypes] = useState<ProductTypes[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const fetchTypes = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllProductTypes();

      setTypes(data.data);
    } catch (error) {
      console.error("Failed to fetch fishes or types:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTypes();
  }, [fetchTypes]);

  const updateTypes = (updateTypes: ProductTypes[]) => {
    setTypes(updateTypes);
  };

  const refetch = () => {
    fetchTypes();
  };
  return (
    <>
      <section id="type-section" className="section-wrapper w-[95%] max-w-[1000px] pt-5">
        <h1 className="text-luoDarkBiege text-2xl font-bold mb-6">Manage Product Types</h1>
        <div className="flex flex-col flex-wrap justify-between items-center mb-3">
          <div className="flex justify-between w-full items-center mb-2 sm:justify-end">
            <button
              className="bg-luoDarkBiege text-white px-3 py-2.5 rounded-md sm:hidden"
              onClick={() => setIsOpen(true)}
            >
              Add Product Types
            </button>
          </div>
          <div className="w-full flex flex-warp items-center">
            <button
              className="bg-luoDarkBiege text-white px-3 min-w-fit py-2.5 rounded-md hidden sm:block"
              onClick={() => setIsOpen(true)}
            >
              Add Product Type
            </button>
          </div>
        </div>
        <ContentWrapper loading={loading}>
          {types.map(type => (
            <ProductTypeItems
              type={type}
              types={types}
              key={type.ID}
              updateTypes={updateTypes}
              refetch={refetch}
            />
          ))}
        </ContentWrapper>
        <AddModal open={isOpen} setOpen={setIsOpen} refetch={refetch} />
      </section>
    </>
  );
};

export default ProductComponent;
