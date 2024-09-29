"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useCreateChannel } from "../api/use-create-channel";
import { useCreateChannelModal } from "../store/use-create-channel-modal";
import { useWorkspaceId } from "@/app/hooks/use-workspace-id";
import { useRouter } from "next/navigation";

export const CreateChannelModal = () => {
  const workspaceId = useWorkspaceId();
  const router = useRouter();
  const { mutate, isPending } = useCreateChannel();

  const [open, setOpen] = useCreateChannelModal();
  const [name, setName] = useState("");

  const handleClose = () => {
    setOpen(false);
    setName("");
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(
      { name, workspaceId },
      {
        onSuccess(id) {
          toast.success("Channel created");
          handleClose();
          router.push(`/workspace/${workspaceId}/channel/${id}`);
        },

        onError() {
          toast.error("Something went wrong");
        },
      }
    );
  };

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatedName = e.target.value.replace(/\s+/g, "-");
    setName(formatedName);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Add a channel</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Input
            name="name"
            type="text"
            placeholder="Name"
            value={name}
            onChange={handleChangeName}
            required
            disabled={isPending}
            minLength={3}
            maxLength={60}
          />

          <Button type="submit" className="w-full" disabled={isPending}>
            Create
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
