import { useDeleteWorkspace } from "@/app/features/workspaces/api/use-delete-workspaces";
import { useUpdateWorkspace } from "@/app/features/workspaces/api/use-update-workspaces";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { TrashIcon } from "lucide-react";
import { useState } from "react";
import { Id } from "../../../../../convex/_generated/dataModel";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { useConfirm } from "@/app/hooks/use-confirm";

interface WorkspacePreferencesModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  initialValue?: string;
  workspaceId: Id<"workspaces">;
}

const WorkspacePreferencesModal = ({
  open,
  setOpen,
  initialValue,
  workspaceId,
}: WorkspacePreferencesModalProps) => {
  const [value, setValue] = useState<string>(initialValue || "");
  const [openEdit, setOpenEdit] = useState(false);
  const [ConfirmDialog, confirm] = useConfirm(
    "Delete workspace",
    "Are you sure you want to delete this workspace?"
  );
  const router = useRouter();

  const { mutate: updateWorkspace, isPending: isUpdatingWorkspace } =
    useUpdateWorkspace();
  const { mutate: deleteWorkspace, isPending: isDeletingWorkspace } =
    useDeleteWorkspace();

  const handleRenameWorkSpace = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateWorkspace(
      { id: workspaceId, name: value },
      {
        onSuccess: () => {
          setOpenEdit(false);
          toast.success("Workspace name updated successfully");
        },
        onError: () => {
          toast.error("Something went wrong");
        },
      }
    );
  };
  const handleRemoveWorkSpace = async () => {
    const ok = await confirm();

    if (!ok) return;

    deleteWorkspace(
      { id: workspaceId },
      {
        onSuccess: () => {
          toast.success("Workspace name updated successfully");
          router.replace("/");
        },
        onError: () => {
          toast.error("Something went wrong");
        },
      }
    );
  };

  return (
    <>
      <ConfirmDialog />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-white p-0">
          <div className="px-4 pb-4 flex flex-col gap-y-2">
            <DialogHeader className="border-b p-4 font-semibold"> {value} </DialogHeader>
            <Dialog open={openEdit} onOpenChange={setOpenEdit}>
              <DialogTrigger asChild>
                <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Workspace name</p>
                    <p className="text-sm text-[#1264a3] hover:underline font-semibold">
                      Edit
                    </p>
                  </div>
                  <p className="text-sm">{value}</p>
                </div>
              </DialogTrigger>
              <DialogContent className="bg-white">
                <DialogHeader>
                  <DialogTitle className="p-4 font-semibold">
                    Rename workspace
                  </DialogTitle>
                </DialogHeader>
                <form className="flex flex-col gap-y-2" onSubmit={handleRenameWorkSpace}>
                  <Input
                    disabled={isUpdatingWorkspace || isDeletingWorkspace}
                    maxLength={60}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Rename workspace"
                    required
                  />

                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline" onClick={() => setOpenEdit(false)}>
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button
                      type="submit"
                      className="btn"
                      variant="default"
                      disabled={isUpdatingWorkspace || isDeletingWorkspace}
                    >
                      Rename
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            <button
              disabled={false}
              onClick={handleRemoveWorkSpace}
              className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg border text-pink-600 hover:bg-gray-50"
            >
              <TrashIcon />
              <p className="font-semibold">Delete workspace</p>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WorkspacePreferencesModal;
