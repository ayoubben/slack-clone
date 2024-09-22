"use client";
import { useWorkspaceId } from "@/app/hooks/use-workspace-id";

const WorkspacePage = () => {
  const workspaceId = useWorkspaceId();
  return <div>WorkspacePage : {workspaceId}</div>;
};

export default WorkspacePage;
