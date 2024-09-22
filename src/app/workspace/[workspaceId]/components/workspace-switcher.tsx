import { useCreateWorkspace } from "@/app/features/workspaces/api/use-create-workspaces";
import { useGetWorkspace } from "@/app/features/workspaces/api/use-get-workspace";
import { useGetWorkspaces } from "@/app/features/workspaces/api/use-get-workspaces";
import { useCreateWorkspaceModal } from "@/app/features/workspaces/store/use-create-workspace-modal";
import { useWorkspaceId } from "@/app/hooks/use-workspace-id";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Loader, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
const WorkspaceSwitcher = () => {
  const router = useRouter();
  const [_open, setOpen] = useCreateWorkspaceModal();
  const workspaceId = useWorkspaceId();
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
    id: workspaceId,
  });
  const { data: workspaces, isLoading: workspacesLoading } = useGetWorkspaces();

  const filtredWorkspaces = workspaces?.filter((w) => w._id !== workspaceId);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="items-center justify-center font-semibold text-black size-9 bg-accent hover:bg-accent/90">
          {workspaceLoading ? (
            <Loader className="size-5 animate-spin shrink-0" />
          ) : (
            workspace?.name?.charAt(0).toUpperCase()
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        side="bottom"
        sideOffset={6}
        className="flex flex-col w-64 gap-2 p-2 rounded-md bg-slate-50"
      >
        <DropdownMenuItem
          onClick={() => router.push(`/workspace/${workspaceId}`)}
          className="flex flex-col items-start justify-start p-2 capitalize rounded-md cursor-pointer hover:bg-slate-100 focus-visible:outline-none"
        >
          <span>{workspace?.name}</span>
          <span className="text-xs text-muted-foreground">Active workspace</span>
        </DropdownMenuItem>
        <Separator />
        {filtredWorkspaces?.map((w) => (
          <DropdownMenuItem
            key={w._id}
            onClick={() => router.push(`/workspace/${w._id}`)}
            className="flex items-center justify-start gap-3 p-2 capitalize rounded-md cursor-pointer hover:bg-slate-100 focus-visible:outline-none"
          >
            <div className="font-semibold  bg-slate-200 text-black px-2.5 py-2 rounded-md">
              <span>{w.name.charAt(0).toUpperCase()}</span>
            </div>
            <span className="truncate">{w.name}</span>
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem
          onClick={() => setOpen(true)}
          className="flex items-center gap-3 p-2 text-black capitalize rounded-md cursor-pointer hover:bg-blue-800 hover:text-white focus-visible:outline-none"
        >
          <div className="p-2 text-black rounded-md bg-slate-200">
            <Plus className="size-5" />
          </div>
          <span className="text-xs font-semibold">Create workspace</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default WorkspaceSwitcher;
