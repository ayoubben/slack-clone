
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";

interface useGetWorkspaceProps {
  workspaceId: Id<"workspaces">;
}

export const useGetInfoWorkspace = ({ workspaceId }: useGetWorkspaceProps) => {
  const data = useQuery(api.workspaces.getInfo, { workspaceId });
  const isLoading = data === undefined;

  return { data, isLoading };
};
