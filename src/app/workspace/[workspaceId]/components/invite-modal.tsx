import { useNewJoinCodeWorkspace } from "@/app/features/workspaces/api/use-new-joincode-workspaces";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { CopyIcon, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { Id } from "../../../../../convex/_generated/dataModel";
import { useConfirm } from "@/app/hooks/use-confirm";

interface InviteModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  workspaceId: Id<"workspaces">;
  workspaceName: string;
  joinCode: string;
}

export const InviteModal = ({
  open,
  setOpen,
  workspaceId,
  workspaceName,
  joinCode,
}: InviteModalProps) => {
  const [ConfirmDialog, confirm] = useConfirm(
    "Generate new join code",
    "Are you sure you want to generate a new join code?"
  );
  const { mutate: newJoinCode, isPending: isUpdatingJoinCode } =
    useNewJoinCodeWorkspace();

  const handleGenerateNewCode = async () => {
    const ok = await confirm();

    if (!ok) return;

    newJoinCode(
      { workspaceId: workspaceId },
      {
        onSuccess: () => {
          toast.success("New join code generated successfully");
        },
        onError: () => {
          toast.error("Something went wrong");
        },
      }
    );
  };

  const handleCopy = () => {
    navigator.clipboard
      .writeText(`${window.location.origin}/join/${workspaceId}`)
      .then(() => {
        toast.success("Copied to clipboard");
      });
  };

  return (
    <>
      <ConfirmDialog />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="p-4 font-semibold">
              Invite people to {workspaceName}
            </DialogTitle>
            <DialogDescription className="p-4 text-sm text-muted-foreground">
              Invite people to your workspace
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-y-2 py-6 justify-center items-center">
            <p className="text-2xl uppercase tracking-widest font-bold">{joinCode}</p>
            <Button variant="ghost" onClick={handleCopy} className="flex gap-1">
              <CopyIcon className="size-5" />
              <span>Copy link</span>
            </Button>
          </div>

          <div className="flex justify-between">
            <Button
              variant="secondary"
              disabled={isUpdatingJoinCode}
              onClick={() => handleGenerateNewCode()}
              className="flex gap-1"
            >
              <RefreshCcw className="size-5 " />
              <span>Generate new code</span>
            </Button>

            <DialogClose asChild>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
