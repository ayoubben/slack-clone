import { useRemoveChannel } from "@/app/features/channels/api/use-remove-channels";
import { useUpdateChannel } from "@/app/features/channels/api/use-update-channels";
import { useCurrentMember } from "@/app/features/members/api/use-current-member";
import { useChannelId } from "@/app/hooks/use-channel-id";
import { useConfirm } from "@/app/hooks/use-confirm";
import { useWorkspaceId } from "@/app/hooks/use-workspace-id";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { ChevronDown, Hash, HashIcon, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface HeaderProps {
  name: string;
}

const Header = ({ name }: HeaderProps) => {
  const channelId = useChannelId();
  const workspaceId = useWorkspaceId();
  const router = useRouter();
  const [openEdit, setOpenEdit] = useState(false);
  const [value, setValue] = useState(name);
  const { data: member, isLoading } = useCurrentMember({ workspaceId });
  const { mutate: updateChannel, isPending: isUpdatingChannel } = useUpdateChannel();
  const { mutate: removeChannel, isPending: isRemovingChannel } = useRemoveChannel();
  const [ConfirmDialog, confirm] = useConfirm(
    "Delete channel",
    "Are you sure you want to delete this channel?"
  );

  const handleRenameWorkSpace = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateChannel(
      { id: channelId, name: value },
      {
        onSuccess: () => {
          setOpenEdit(false);
          toast.success("Channel name updated successfully");
        },
        onError: () => {
          toast.error("Something went wrong");
        },
      }
    );
  };

  const handleRemoveChannel = async () => {
    const ok = await confirm();

    if (!ok) return;

    removeChannel(
      { id: channelId },
      {
        onSuccess: () => {
          toast.success("Channel removed successfully");
          router.replace(`/workspace/${workspaceId}`);
        },
        onError: () => {
          toast.error("Something went wrong");
        },
      }
    );
  };

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatedName = e.target.value.replace(/\s+/g, "-");
    setValue(formatedName);
  };

  return (
    <>
      <ConfirmDialog />
      <div className="flex items-center justify-start border-b p-4 h-[49px] overflow-hidden">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              className="truncate  font-semibold text-black bg-transparent  hover:bg-accent/40"
              disabled={member?.role !== "admin"}
            >
              <HashIcon className="size-4 mr-2" />
              <span className="truncate">{name}</span>
              <ChevronDown className="size-5 ml-2" />
            </Button>
          </DialogTrigger>

          <DialogContent className="bg-gray-50 p-0 overflow-hidden">
            <DialogHeader className="border-b p-4 font-semibold">
              <DialogTitle>{name}</DialogTitle>
            </DialogHeader>
            <div className="px-4 pb-4 flex flex-col gap-y-2">
              <Dialog open={openEdit} onOpenChange={setOpenEdit}>
                <DialogTrigger asChild>
                  <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">Channel name</p>
                      <p className="text-sm text-[#1264a3] hover:underline font-semibold">
                        Edit
                      </p>
                    </div>
                    <p className="text-sm">{name}</p>
                  </div>
                </DialogTrigger>
                <DialogContent className="bg-white">
                  <DialogHeader>
                    <DialogTitle className="p-4 font-semibold">
                      Rename Channel
                    </DialogTitle>
                  </DialogHeader>
                  <form
                    className="flex flex-col gap-y-2"
                    onSubmit={handleRenameWorkSpace}
                  >
                    <Input
                      disabled={isUpdatingChannel}
                      maxLength={60}
                      value={value}
                      onChange={handleChangeName}
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
                        disabled={isUpdatingChannel}
                      >
                        Rename
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              <button
                disabled={false}
                onClick={handleRemoveChannel}
                className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg border text-pink-600 hover:bg-gray-50"
              >
                <TrashIcon />
                <p className="font-semibold">Delete channel</p>
              </button>

              {/* </Dialog> */}

              {/* <button
            disabled={false}
            // onClick={handleRemoveWorkSpace}
            className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg border text-pink-600 hover:bg-gray-50"
          >
            <TrashIcon />
            <p className="font-semibold">Delete channel</p>
          </button> */}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default Header;
