import { Pen, Trash2 } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import DeleteModal from "../modal/deleteModal";
import EditModal from "../modal/editModal";
import SpinnerWithText from "@/components/UI/Spinner";
import { AddOnsType } from "@/types/data-types";
import { deleteAddOns } from "@/api/add-ons-api";

interface AddOnsItemsProps {
  addOn: AddOnsType;
  addOns: AddOnsType[];
  updateAddOns: (updatedCakes: AddOnsType[]) => void;
  refetch: () => void;
}

const AddOnsItem = ({ addOn, addOns, updateAddOns, refetch }: AddOnsItemsProps) => {
  const { ID, name, desc, main_image } = addOn;

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
      const response = await deleteAddOns(adminToken.token, addOn.ID);
      if (response.success) {
        setIsVisible(false);
        setTimeout(() => {
          const updateAddOn = addOns.filter(a => a.ID !== addOn.ID);
          updateAddOns(updateAddOn);
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
      <div className={`flex gap-2 items-center justify-center`}>
        <div className="h-40 w-40 pt-2">
          <Image
            src={main_image?.startsWith("http") ? main_image : "/assets/No-Image.png"}
            alt="add ons image"
            className="aspect-square object-cover rounded-lg shadow"
            width={200}
            height={200}
            onError={(e: any) => {
              e.target.onerror = null;
              e.target.src = "/assets/No-Image.png";
            }}
          />
        </div>
        <div className="text-black w-full text-start text-sm flex flex-col pt-2">
          <p>
            Name : <span>{name}</span>
          </p>
          <p>
            Description : <span>{desc}</span>
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
        addOnsId={ID}
        addOnsName={name}
        refetch={refetch}
      />
      <div className="w-full h-[2px] bg-gray-500 opacity-80 my-2" />
    </div>
  );
};

export default AddOnsItem;
