import dynamic from "next/dynamic";
import { Doc, Id } from "../../../../../../../convex/_generated/dataModel";
import { format, isToday, isYesterday } from "date-fns";
import { Hint } from "@/components/hint";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Thumbnail } from "./thumbnail";
import Toolbar from "./toolbar";
import { cn } from "@/lib/utils";
import { useUpdateMessage } from "@/app/features/messages/api/use-update-message";
import { useRemoveMessage } from "@/app/features/messages/api/use-remove-message";
import { toast } from "sonner";
import { useConfirm } from "@/app/hooks/use-confirm";
import { useUpdateReaction } from "@/app/features/reactions/api/use-update-reaction";
import Reaction from "./reactions";

const Renderer = dynamic(() => import("./Renderer"), { ssr: false });
const Editor = dynamic(() => import("./editor"), { ssr: false });

interface MessageProps {
  id: Id<"messages">;
  memberId: Id<"members">;
  authorImage?: string;
  authorName?: string;
  isAuthor: boolean;
  reactions: Array<
    Omit<Doc<"reactions">, "memberId"> & {
      count: number;
      memberIds: Id<"members">[];
    }
  >;
  body: Doc<"messages">["body"];
  image: string | undefined | null;
  createdAt: Doc<"messages">["_creationTime"];
  updatedAt?: Doc<"messages">["updatedAt"];
  isEditing: boolean;
  isCompact?: boolean;
  setEditingId: (id: Id<"messages"> | null) => void;
  hideTheadButton?: boolean;
  threadCount?: number;
  threadImage?: string;
  threadTimestamp?: number;
}

const formatFullTime = (date: number) => {
  return `${isToday(date) ? "Today" : isYesterday(date) ? "Yesterday" : format(date, "MMM d, yyyy")} at ${format(date, "hh:mm a")}`;
};

export const Message = ({
  id,
  memberId,
  authorImage,
  authorName = "Member",
  isAuthor,
  reactions,
  body,
  image,
  createdAt,
  updatedAt,
  isEditing,
  isCompact,
  setEditingId,
  hideTheadButton,
  threadCount,
  threadImage,
  threadTimestamp,
}: MessageProps) => {
  const avatarFallback = authorName?.[0]?.toUpperCase();
  const { mutate: updateMessage, isPending } = useUpdateMessage();
  const { mutate: removeMessage, isPending: isPendingRemove } = useRemoveMessage();
  const { mutate: updateReaction, isPending: isPendingReaction } = useUpdateReaction();

  const [ConfirmDialog, confirm] = useConfirm(
    "Delete message",
    "Are you sure you want to delete this message?"
  );

  const handleUpdate = ({ body }: { body: string }) => {
    updateMessage(
      { id, body },
      {
        onSuccess: () => {
          toast.success("Message updated successfully");
          setEditingId(null);
        },

        onError: () => {
          toast.error("Something went wrong");
        },
      }
    );
  };

  const handleRemoveMessage = async (id: Id<"messages">) => {
    const ok = await confirm();

    if (!ok) return;
    removeMessage(
      { id },
      {
        onSuccess: () => {
          toast.success("Message removed successfully");
        },
        onError: () => {
          toast.error("Something went wrong");
        },
      }
    );
  };

  const handleUpdateReaction = (value: string) => {
    updateReaction(
      { messageId: id, value },
      {
        onError: () => {
          toast.error("Something went wrong");
        },
      }
    );
  };

  if (isCompact) {
    return (
      <div
        className={cn(
          "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative",
          isEditing && "bg-[#e3de7eb7] hover:bg-[#e3de7eb7]",
          isPendingRemove &&
            "cursor-not-allowed bg-rose-500/50 transform transition-all duration-300 hover:bg-rose-500/50"
        )}
      >
        <ConfirmDialog />
        <div className="flex items-start gap-2">
          <Hint label={formatFullTime(createdAt)}>
            <button className="mr-1 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 w-[40px] leading-[22px] text-center hover:underline">
              {format(new Date(createdAt), "hh:mm")}
            </button>
          </Hint>
          <div className="flex flex-col w-full">
            {isEditing ? (
              <Editor
                onSubmit={handleUpdate}
                disabled={isPending}
                defaultValue={JSON.parse(body)}
                variant="update"
              />
            ) : (
              <>
                <Renderer value={body} />
                <Thumbnail url={image} />

                <Reaction reactions={reactions} handleReaction={handleUpdateReaction} />

                {updatedAt ? (
                  <span className="text-xs text-muted-foreground">(Edited)</span>
                ) : null}
              </>
            )}
          </div>
        </div>
        {!isEditing && (
          <Toolbar
            isAuthor={isAuthor}
            isPending={isPending || isPendingRemove}
            handleEdit={() => setEditingId(id)}
            handleThread={() => console.log("thread")}
            handleReaction={handleUpdateReaction}
            handleDelete={() => handleRemoveMessage(id)}
            hideTheadButton={hideTheadButton}
          />
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative",
        isEditing && "bg-[#e3de7eb7] hover:bg-[#e3de7eb7]",
        isPendingRemove &&
          "cursor-not-allowed bg-rose-500/50 transform transition-all duration-300 hover:bg-rose-500/50"
      )}
    >
      <ConfirmDialog />
      <div className="flex items-start gap-2">
        <button>
          <Avatar className="rounded-md mr-1">
            <AvatarImage className="rounded-md" src={authorImage} />
            <AvatarFallback className="rounded-md bg-sky-500 text-white text-xs">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
        </button>
        <div className="flex flex-col w-full overflow-hidden">
          <div className="text-sm">
            <button onClick={() => {}} className="font-bold text-primary hover:underline">
              {authorName}
            </button>
            <span>&nbsp;&nbsp;</span>
            <Hint label={formatFullTime(createdAt)}>
              <button className="text-xs text-muted-foreground hover:underline">
                {format(new Date(createdAt), "hh:mm")}
              </button>
            </Hint>
          </div>
          {isEditing ? (
            <Editor
              onSubmit={handleUpdate}
              disabled={isPending}
              defaultValue={JSON.parse(body)}
              variant="update"
            />
          ) : (
            <>
              <Renderer value={body} />
              <Thumbnail url={image} />
              <div className="flex">
                <Reaction reactions={reactions} handleReaction={handleUpdateReaction} />
              </div>
            </>
          )}
          {updatedAt ? (
            <span className="text-xs text-muted-foreground">(Edited)</span>
          ) : null}
        </div>
      </div>

      {!isEditing && (
        <Toolbar
          isAuthor={isAuthor}
          isPending={isPending || isPendingRemove}
          handleEdit={() => setEditingId(id)}
          handleThread={() => console.log("thread")}
          handleReaction={handleUpdateReaction}
          handleDelete={() => handleRemoveMessage(id)}
          hideTheadButton={hideTheadButton}
        />
      )}
    </div>
  );
};
