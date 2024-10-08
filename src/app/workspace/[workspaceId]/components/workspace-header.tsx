import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, ListFilter, SquarePen } from "lucide-react";
import { Doc } from "../../../../../convex/_generated/dataModel";
import { Separator } from "@/components/ui/separator";
import WorkspacePreferencesModal from "./workspace-preferences-modal";
import { InviteModal } from "./invite-modal";
import { useState } from "react";

interface WorkspaceHeaderProps {
  workspace: Doc<"workspaces">;
  isAdmin: boolean;
}

export const WorkspaceHeader = ({ workspace, isAdmin }: WorkspaceHeaderProps) => {
  const [open, setOpen] = useState(false);
  const [openIvite, setOpenIvite] = useState(false);
  return (
    <>
      <InviteModal
        open={openIvite}
        setOpen={setOpenIvite}
        workspaceId={workspace._id}
        workspaceName={workspace.name}
        joinCode={workspace.joinCode}
      />
      <WorkspacePreferencesModal
        open={open}
        setOpen={setOpen}
        initialValue={workspace.name}
        workspaceId={workspace._id}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="truncate items-center justify-center font-semibold text-slate-100 bg-transparent  hover:bg-accent/40">
            <span className="truncate">{workspace?.name}</span>
            <ChevronDown className="size-5 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          side="bottom"
          sideOffset={6}
          className="w-64 bg-white p-2 rounded-md shadow-md z-10"
        >
          <DropdownMenuItem className="flex gap-2 items-start justify-start p-2 capitalize rounded-md cursor-pointer hover:bg-slate-100 focus-visible:outline-none">
            <div className="size-9 relative overflow-hidden bg-[#616061] text-white font-bold rounded-md flex items-center justify-center ">
              {workspace.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col items-start">
              <p className="font-bold">{workspace.name}</p>
              <p className="text-xs text-muted-foreground">Active workspace</p>
            </div>
          </DropdownMenuItem>
          {isAdmin && (
            <>
              <Separator className="my-1" />
              <DropdownMenuItem
                className="flex gap-2 items-start justify-start p-2 capitalize rounded-md cursor-pointer hover:bg-slate-100 focus-visible:outline-none"
                onClick={() => setOpen(true)}
              >
                Preferences
              </DropdownMenuItem>

              <Separator className="my-1" />
              <DropdownMenuItem
                className="flex gap-2 items-start justify-start p-2 capitalize rounded-md cursor-pointer hover:bg-slate-100 focus-visible:outline-none"
                onClick={() => setOpenIvite(true)}
              >
                Invite people to {workspace.name}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="flex items-center gap-0.5">
        <Button variant="transparent" size="iconSm">
          <ListFilter className="size-4" /> {/* Error: Cannot find name 'F' */}
        </Button>
        <Button variant="transparent" size="iconSm">
          <SquarePen className="size-4" />
        </Button>
      </div>
    </>
  );
};
