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
import { CakeById } from "@/types/data-types";
import EditCakeForm from "../form/editForm";

interface EditModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  cakeId: string;
  refetch: () => void;
}

const EditModal = ({ open, setOpen, cakeId, refetch }: EditModalProps) => {
  return (
    <div className="max-w-[400px]">
      <Dialog open={open}>
        <DialogContent className={"max-w-fit overflow-y-auto max-h-screen overflow-x-hidden"}>
          <DialogHeader className="max-w-[86vw] flex flex-row justify-between">
            <div>
              <DialogTitle className="text-left">Edit Cake Form</DialogTitle>
              <DialogDescription className="text-left">Fill all required form.</DialogDescription>
            </div>
            <X className="h-4 w-4 cursor-pointer" onClick={() => setOpen(false)} />
          </DialogHeader>
          <EditCakeForm setOpen={setOpen} cakeId={cakeId} refetch={refetch} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditModal;
