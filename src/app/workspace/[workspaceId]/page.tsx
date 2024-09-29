"use client";

import { useWorkspaceId } from "@/app/hooks/use-workspace-id";
import { useCreateChannelModal } from "@/app/features/channels/store/use-create-channel-modal";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useGetChannels } from "@/app/features/channels/api/use-get-channels";
import { useGetWorkspace } from "@/app/features/workspaces/api/use-get-workspace";
import { Loader, TriangleAlert } from "lucide-react";
import { useCurrentMember } from "@/app/features/members/api/use-current-member";

const WorkspacePage = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const [open, setOpen] = useCreateChannelModal();

  const { data: member, isLoading: memberIsLoading } = useCurrentMember({ workspaceId });
  const { data: channels, isLoading: channelsIsLoading } = useGetChannels({
    workspaceId,
  });
  const { data: workspace, isLoading: workspaceIsLoading } = useGetWorkspace({
    id: workspaceId,
  });

  const channelId = useMemo(() => {
    return channels?.[0]?._id;
  }, [channels]);

  const isAdmin = useMemo(() => member?.role === "admin", [member]);
  console.log(isAdmin);

  useEffect(() => {
    if (
      workspaceIsLoading ||
      channelsIsLoading ||
      memberIsLoading ||
      !workspace ||
      !member
    ) {
      return;
    }
    if (channelId) {
      router.push(`/workspace/${workspaceId}/channel/${channelId}`);
    } else if (!open && isAdmin) {
      setOpen(true);
    }
  }, [
    isAdmin,
    member,
    workspace,
    workspaceIsLoading,
    channelId,
    channelsIsLoading,
    router,
    workspaceId,
    setOpen,
    open,
  ]);

  if (channelsIsLoading || workspaceIsLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-8 h-full">
        <Loader className="animate-spin size-5" />
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="flex flex-col items-center justify-center gap-8 h-full">
        <TriangleAlert className="size-5" />
        <p className="text-center text-sm text-muted-foreground">Workspace not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-8 h-full">
      <TriangleAlert className="size-5" />
      <p className="text-center text-sm text-muted-foreground">Channel not found</p>
    </div>
  );
};

export default WorkspacePage;
