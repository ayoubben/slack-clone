import { useCurrentMember } from "@/app/features/members/api/use-current-member";
import { useGetWorkspace } from "@/app/features/workspaces/api/use-get-workspace";
import { useWorkspaceId } from "@/app/hooks/use-workspace-id";
import { AlertTriangle, Loader2, Loader, ListFilter, SquarePen } from "lucide-react";
import { WorkspaceHeader } from "./workspace-header";
import { Button } from "@/components/ui/button";

export const WorkspaceSidebar = () => {
  const workspaceId = useWorkspaceId();
  const { data: member, isLoading: memberLoading } = useCurrentMember({ workspaceId });
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
    id: workspaceId,
  });

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
        <div className="flex items-center gap-0.5">
          <Button variant="transparent" size="iconSm">
            <ListFilter className="size-4" /> {/* Error: Cannot find name 'F' */}
          </Button>
          <Button variant="transparent" size="iconSm">
            <SquarePen className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
