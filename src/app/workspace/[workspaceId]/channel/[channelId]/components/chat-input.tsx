import { useCreateMessage } from "@/app/features/messages/api/use-create-message";
import { useChannelId } from "@/app/hooks/use-channel-id";
import { useWorkspaceId } from "@/app/hooks/use-workspace-id";
import dynamic from "next/dynamic";
import Quill from "quill";
import { useRef, useState } from "react";
import { toast } from "sonner";
const Editor = dynamic(() => import("./editor"), { ssr: false });

interface ChatInputProps {
  placeholder: string;
}

const ChatInput = ({ placeholder }: ChatInputProps) => {
  const [editorkey, setEditorkey] = useState(0);
  const [isPending, setIsPending] = useState(false);
  const editorRef = useRef<Quill | null>(null);

  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();
  const { mutate: createMessage } = useCreateMessage();

  const onSubmit = async ({ image, body }: { image: File | null; body: string }) => {
    try {
      setIsPending(true);
      await createMessage({
        workspaceId,
        channelId,
        body,
      });
      setEditorkey((prevKey) => prevKey + 1);
    } catch (error) {
      toast.error("Message failed to send");
    } finally {
      setIsPending(false);
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
