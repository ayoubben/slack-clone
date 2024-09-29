"use client";
import { useEffect, useState } from "react";
import { CreateWorkspaceModal } from "@/app/features/workspaces/components/create-workspace-modal";
import { CreateChannelModal } from "@/app/features/channels/components/create-channel-modal";

const Modals = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;
  return (
    <>
      <CreateWorkspaceModal />
      <CreateChannelModal />
    </>
  );
};

export default Modals;
