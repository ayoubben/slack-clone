"use client";
import { useWorkspaceId } from "@/app/hooks/use-workspace-id";
import VerificationInput from "react-verification-input";
import Image from "next/image";
import { useJoinWorkspace } from "@/app/features/workspaces/api/use-join-workspaces";
import { toast } from "sonner";
import { useGetInfoWorkspace } from "@/app/features/workspaces/api/use-get-info-workspace";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { use, useEffect, useMemo } from "react";

const JoinPage = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();

  const { mutate, isPending } = useJoinWorkspace();
  const { data, isLoading } = useGetInfoWorkspace({ workspaceId });

  const isMember = useMemo(() => data?.isMember, [data]);

  const verifyJoinCode = (code: string) => {
    mutate(
      { workspaceId: workspaceId, joinCode: code },
      {
        onSuccess: () => {
          router.push(`/workspace/${workspaceId}`);
          toast.success("Joined workspace");
        },
        onError: () => {
          toast.error("Something went wrong");
        },
      }
    );
  };

  useEffect(() => {
    if (isMember) {
      router.push(`/workspace/${workspaceId}`);
    }
  }, [isMember, router, workspaceId]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-8 h-full">
        <Loader2 className="animate-spin size-5" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-8 h-full">
      <div className="flex flex-col items-center">
        <h1 className="text-4xl font-bold">Join workspace {data?.name}</h1>
        <Image src="/hash.svg" alt="Logo" width={200} height={200} />
      </div>
      <div className="flex flex-col items-center">
        <VerificationInput
          classNames={{
            character: "rounded-md border-1 border-gray-300 px-4 py-2 text-2xl font-bold",
            characterInactive: "bg-muted",
            characterFilled: "bg-white",
          }}
          onComplete={verifyJoinCode}
        />
      </div>
    </div>
  );
};

export default JoinPage;
