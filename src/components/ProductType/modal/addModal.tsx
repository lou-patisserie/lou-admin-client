import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/UI/Dialog";
import { X } from "lucide-react";
import { ProductTypes } from "@/types/data-types";
import AddProductTypeForm from "../form/addForm";

interface AddModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  refetch: () => void;
}

const AddModal = ({ open, setOpen, refetch }: AddModalProps) => {
  return (
    <div className="max-w-fit">
      <Dialog open={open}>
        <DialogContent
          className={
            "max-w-sm overflow-y-auto max-h-screen rounded-md overflow-x-hidden md:max-w-md"
          }
        >
          <DialogHeader className="flex flex-row justify-between">
            <div>
              <DialogTitle className="text-left">Add New Product Type Form</DialogTitle>
              <DialogDescription className="text-left">Fill all required form.</DialogDescription>
            </div>
            <X className="h-4 w-4 cursor-pointer" onClick={() => setOpen(false)} />
          </DialogHeader>
          <AddProductTypeForm setOpen={setOpen} refetch={refetch} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddModal;
