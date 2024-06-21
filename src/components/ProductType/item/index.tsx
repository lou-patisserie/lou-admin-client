import { Pen, Trash2 } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import SpinnerWithText from "@/components/UI/Spinner";
import { ProductTypes } from "@/types/data-types";
import { deleteProductType } from "@/api/product-type-api";
import DeleteModal from "../modal/deleteModal";
import EditModal from "../modal/editModal";

interface TypesItemsProps {
  type: ProductTypes;
  types: ProductTypes[];
  updateTypes: (updateTypes: ProductTypes[]) => void;
  refetch: () => void;
}

export default function ProductTypeItems({ type, types, updateTypes, refetch }: TypesItemsProps) {
  const { ID, name, desc } = type;

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [deleting, setIsDeleting] = useState(false);

  const adminTokenString =
    typeof window !== "undefined" ? sessionStorage.getItem("admin-token") : null;
  const adminToken = adminTokenString ? JSON.parse(adminTokenString) : null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await deleteProductType(type.ID);
      if (response.success) {
        setIsVisible(false);
        setTimeout(() => {
          const updatedCakes = types.filter(t => t.ID !== type.ID);
          updateTypes(updatedCakes);
          setIsDeleting(false);
        }, 500);
      }
    } catch (error) {
      setIsDeleting(false);
      console.error("Failed to delete fish:", error);
    }
  };

  return (
    <div
      className={`relative transition-opacity duration-500 ease-out-expo ${
        !isVisible ? "opacity-0 -translate-y-2" : ""
      }`}
    >
      {deleting && (
        <div className="absolute inset-0 bg-luoBiege bg-opacity-50 flex justify-center items-center z-10">
          <SpinnerWithText text="Deleting..." />
        </div>
      )}
      <div className={`flex gap-2 items-start py-4`}>
        <div className="text-black w-full text-start text-sm flex flex-col pt-2">
          <p>
            Name: <span>{name}</span>
          </p>
          <p>
            Description: <span>{desc}</span>
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <div onClick={() => setEditModalOpen(true)}>
            <Pen
              size={20}
              className="text-luoDarkBiege transition duration-150 hover:text-green-400"
            />
          </div>
          <div>
            <Trash2
              size={20}
              className="text-rose-500 transition duration-150 hover:text-rose-800"
              onClick={() => setDeleteModalOpen(true)}
            />
          </div>
        </div>
      </div>
      <DeleteModal
        open={deleteModalOpen}
        setOpen={setDeleteModalOpen}
        handleDelete={handleDelete}
      />
      <EditModal
        open={editModalOpen}
        setOpen={setEditModalOpen}
        typeId={type.ID}
        refetch={refetch}
      />
      <div className="w-full h-[2px] bg-gray-500 opacity-80 my-2" />
    </div>
  );
}
