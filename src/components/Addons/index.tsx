"use client";

import { AddOnsType } from "@/types/data-types";
import { useCallback, useEffect, useState } from "react";
import ContentWrapper from "../UI/ContentWrapper";
import AddModal from "./modal/addModal";
import { getAllAddOns } from "@/api/add-ons-api";
import AddOnsItem from "./item";

const AddOnsComponent = () => {
  const [addOns, setAddOns] = useState<AddOnsType[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const fetchAddOns = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAllAddOns();
      if (response.success) {
        setAddOns(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch fishes or types:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAddOns();
  }, [fetchAddOns]);

  const updateAddOns = (updateAddOn: AddOnsType[]) => {
    setAddOns(updateAddOn);
  };

  const refetch = () => {
    fetchAddOns();
  };

  return (
    <>
      <section id="addons-section" className="section-wrapper w-[95%] max-w-[1000px] pt-5">
        <h1 className="text-luoDarkBiege text-2xl font-bold mb-6">Manage Add-Ons</h1>
        <div className="flex flex-col flex-wrap justify-between items-center mb-3">
          <div className="flex justify-between w-full items-center mb-2 sm:justify-end">
            <button
              className="bg-luoDarkBiege text-white px-3 py-2.5 rounded-md sm:hidden"
              onClick={() => setIsOpen(true)}
            >
              Add Add Ons
            </button>
          </div>
          <div className="w-full flex flex-warp items-center">
            <button
              className="bg-luoDarkBiege text-white px-3 min-w-fit py-2.5 rounded-md hidden sm:block"
              onClick={() => setIsOpen(true)}
            >
              Add Add-Ons
            </button>
          </div>
        </div>
        <ContentWrapper loading={loading}>
          {addOns.map(addOn => (
            <AddOnsItem
              addOn={addOn}
              addOns={addOns}
              key={addOn.ID}
              updateAddOns={updateAddOns}
              refetch={refetch}
            />
          ))}
        </ContentWrapper>
        <AddModal open={isOpen} setOpen={setIsOpen} refetch={refetch} />
      </section>
    </>
  );
};

export default AddOnsComponent;
