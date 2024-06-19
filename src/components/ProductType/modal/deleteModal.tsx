import { Button } from "@/components/UI/Button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/UI/Dialog";

interface AddModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  handleDelete: () => void;
}

const DeleteModal = ({ open, setOpen, handleDelete }: AddModalProps) => {
  return (
    <div>
      <Dialog open={open}>
        <DialogContent className={"max-w-fit max-h-screen"}>
          <DialogHeader>
            <DialogTitle>Delete Confirmation</DialogTitle>
          </DialogHeader>
          <div>
            <p>Are you sure to delete this cake?</p>
          </div>
          <DialogFooter className="">
            <Button
              className="text-luoDarkBiege border-luoDarkBiege"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-luoDarkBiege text-white"
              onClick={() => {
                handleDelete();
                setOpen(false);
              }}
            >
              Yes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeleteModal;
