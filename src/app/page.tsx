"use client";

import { useEffect, useMemo } from "react";
import { UserButton } from "./features/auth/components/user-button";
import { useGetWorkspaces } from "./features/workspaces/api/use-get-workspaces";
import { useCreateWorkspaceModal } from "./features/workspaces/store/use-create-workspace-modal";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data, isLoading } = useGetWorkspaces();
  const [open, setOpen] = useCreateWorkspaceModal();
  const router = useRouter();

  // avec useMemo, workspaceId ne sera recalculé que si data change
  const workspaceId = useMemo(() => data?.[0]?._id, [data]);

  useEffect(() => {
    if (isLoading) return;

    if (workspaceId) {
      router.replace(`/workspace/${workspaceId}`);
    } else if (!open) {
      setOpen(true);
    }
  }, [isLoading, workspaceId, open, setOpen]);

  return (
    <div>
      LoggedIn
      <UserButton />
    </div>
  );
}
