import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/UI/Dialog";
import AddCakeForm from "../form/addForm";
import { X } from "lucide-react";
import { Cakes } from "@/types/data-types";

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
            "max-w-md rounded-md overflow-y-auto max-h-screen overflow-x-hidden md:max-w-md"
          }
        >
          <DialogHeader className="max-w-[86vw] flex flex-row justify-between">
            <div>
              <DialogTitle className="text-left">Add New Cake Form</DialogTitle>
              <DialogDescription className="text-left">Fill all required form.</DialogDescription>
            </div>
            <X className="h-4 w-4 cursor-pointer" onClick={() => setOpen(false)} />
          </DialogHeader>
          <AddCakeForm setOpen={setOpen} refetch={refetch} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddModal;
