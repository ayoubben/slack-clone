import { useCreateMessage } from "@/app/features/messages/api/use-create-message";
import { useGenerateUploadUrl } from "@/app/features/upload/api/use-generate-upload-url";
import { useChannelId } from "@/app/hooks/use-channel-id";
import { useWorkspaceId } from "@/app/hooks/use-workspace-id";
import dynamic from "next/dynamic";
import Quill from "quill";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Id } from "../../../../../../../convex/_generated/dataModel";
const Editor = dynamic(() => import("./editor"), { ssr: false });

interface ChatInputProps {
  placeholder: string;
}

type CreateMessageValues = {
  channelId: Id<"channels">;
  workspaceId: Id<"workspaces">;
  body: string;
  image?: Id<"_storage"> | undefined;
};

const ChatInput = ({ placeholder }: ChatInputProps) => {
  const [editorkey, setEditorkey] = useState(0);
  const [isPending, setIsPending] = useState(false);
  const editorRef = useRef<Quill | null>(null);

  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();
  const { mutate: generateUploadUrl } = useGenerateUploadUrl();
  const { mutate: createMessage } = useCreateMessage();

  const onSubmit = async ({ image, body }: { image: File | null; body: string }) => {
    try {
      setIsPending(true);
      editorRef?.current?.enable(false);

      const values: CreateMessageValues = {
        channelId,
        workspaceId,
        body,
        image: undefined,
      };

      if (image) {
        const url = await generateUploadUrl({}, { throwError: true });
        if (!url) throw new Error("Failed to generate upload url");

        const result = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": image.type },
          body: image,
        });

        if (!result.ok) throw new Error("Failed to upload image");

        const { storageId } = await result.json();
        values.image = storageId;
      }

      await createMessage(values);

      setEditorkey((prevKey) => prevKey + 1);
    } catch (error) {
      toast.error("Message failed to send");
    } finally {
      setIsPending(false);
      editorRef?.current?.enable(true);
    }
  };
  return (
    <div className="px-5 w-full">
      <Editor
        key={editorkey}
        placeholder={placeholder}
        onSubmit={onSubmit}
        disabled={isPending}
        innerRef={editorRef}
        variant="create"
      />
    </div>
  );
};

export default ChatInput;
