import { useCurrentMember } from "@/app/features/members/api/use-current-member";
import { useGetWorkspace } from "@/app/features/workspaces/api/use-get-workspace";
import { useWorkspaceId } from "@/app/hooks/use-workspace-id";
import {
  AlertTriangle,
  HashIcon,
  Loader,
  MessageCircle,
  MessagesSquare,
} from "lucide-react";
import { WorkspaceHeader } from "./workspace-header";
import SidebarItem from "./sidebar-item";
import { useGetChannels } from "@/app/features/channels/api/use-get-channels";
import WorkspaceSection from "./workspace-section";
import { useGetMembers } from "@/app/features/members/api/use-get-members";
import SidebarUser from "./sidebar-user";
import { useCreateChannelModal } from "@/app/features/channels/store/use-create-channel-modal";
import { useChannelId } from "@/app/hooks/use-channel-id";

export const WorkspaceSidebar = () => {
  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();
  const [_open, setOpen] = useCreateChannelModal();
  const { data: member, isLoading: memberLoading } = useCurrentMember({ workspaceId });
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
    id: workspaceId,
  });

  const { data: channels, isLoading: channelsLoading } = useGetChannels({ workspaceId });
  const { data: members, isLoading: membersLoading } = useGetMembers({ workspaceId });

  if (memberLoading || workspaceLoading) {
    return (
      <div className="flex flex-col gap-y-2 h-full items-center justify-center">
        <Loader className="size-9 text-slate-100  animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!workspace || !member) {
    return (
      <div className="flex flex-col gap-y-2 bg-[#5E2C5F] h-full items-center justify-center">
        <AlertTriangle className="size-5 text-white" />
        <p className="text-white text-sm">Workspace not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex justify-between gap-4 grow-1">
        <WorkspaceHeader workspace={workspace} isAdmin={member?.role === "admin"} />
      </div>
      <div className="flex flex-col gap-3">
        <SidebarItem
          id="threads"
          label="threads"
          icon={MessagesSquare}
          variant="default"
        />
        <SidebarItem
          id="drafts"
          label="drafts & sent"
          icon={MessageCircle}
          variant="default"
        />
      </div>

      <WorkspaceSection label="channels" onNew={() => setOpen(true)}>
        {channels?.map((item) => {
          return (
            <SidebarItem
              key={item._id}
              id={item._id}
              label={item.name}
              icon={HashIcon}
              variant={item._id === channelId ? "active" : "default"}
            />
          );
        })}
      </WorkspaceSection>

      <WorkspaceSection label="Direct messages" onNew={() => {}}>
        {members?.map((item) => {
          return (
            <SidebarUser
              key={item._id}
              id={item._id}
              label={item.user.name}
              image={item.user.image}
            />
          );
        })}
      </WorkspaceSection>
    </div>
  );
};
