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
import EditProductTypeForm from "../form/editForm";

interface EditModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  typeId: string;
  refetch: () => void;
}

const EditModal = ({ open, setOpen, typeId, refetch }: EditModalProps) => {
  return (
    <div className="max-w-fit">
      <Dialog open={open}>
        <DialogContent
          className={
            "max-w-sm rounded-md overflow-y-auto max-h-screen overflow-x-hidden md:max-w-md"
          }
        >
          <DialogHeader className="max-w-[86vw] flex flex-row justify-between">
            <div>
              <DialogTitle className="text-left">Edit Product Type Form</DialogTitle>
              <DialogDescription className="text-left">Fill all required form.</DialogDescription>
            </div>
            <X className="h-4 w-4 cursor-pointer" onClick={() => setOpen(false)} />
          </DialogHeader>
          <EditProductTypeForm setOpen={setOpen} typeId={typeId} refetch={refetch} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditModal;
