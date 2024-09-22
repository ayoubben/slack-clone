"use client";

import { useGetWorkspace } from "@/app/features/workspaces/api/use-get-workspace";
import { useWorkspaceId } from "@/app/hooks/use-workspace-id";

const WorkspacePage = () => {
  const workspaceId = useWorkspaceId();
  const { data } = useGetWorkspace({ id: workspaceId });
  return <div>data : {JSON.stringify(data)}</div>;
};

export default WorkspacePage;
