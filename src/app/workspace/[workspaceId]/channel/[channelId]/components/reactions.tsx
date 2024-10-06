import { Button } from "@/components/ui/button";
import { Doc, Id } from "../../../../../../../convex/_generated/dataModel";
import { useCurrentMember } from "@/app/features/members/api/use-current-member";
import { useWorkspaceId } from "@/app/hooks/use-workspace-id";
import { cn } from "@/lib/utils";
import EmojiPopover from "@/components/emoji-popover";
import { MdOutlineAddReaction } from "react-icons/md";

interface ReactionProps {
  reactions: Array<
    Omit<Doc<"reactions">, "memberId"> & {
      count: number;
      memberIds: Id<"members">[];
    }
  >;
  handleReaction: (value: string) => void;
}

const Reaction = ({ reactions, handleReaction }: ReactionProps) => {
  const workspaceId = useWorkspaceId();
  const { data: currentMember } = useCurrentMember({ workspaceId });
  if (reactions.length === 0 || !currentMember) {
    return null;
  }

  return (
    <div className="flex gap-1">
      {reactions.map((reaction) => (
        <Button
          variant="transparent"
          key={reaction._id}
          onClick={() => handleReaction(reaction.value)}
          className={cn(
            "flex items-center h-6 gap-2 rounded-full border border-gray-300 px-2 py-0.5 text-xs text-black",
            reaction.memberIds.includes(currentMember._id) &&
              "bg-blue-500/20 text-blue-500 border-blue-500 hover:bg-blue-500/10"
          )}
        >
          <span>{reaction.value}</span>
          <span>{reaction.count}</span>
        </Button>
      ))}
      <EmojiPopover
        hint="Add reaction"
        onEmojiSelected={(emoji) => handleReaction(emoji.native)}
      >
        <Button
          variant="ghost"
          size="iconSm"
          className="flex items-center h-6 gap-2 rounded-full border border-gray-300 px-2 py-0.5 text-xs text-black"
        >
          <MdOutlineAddReaction className="size-4" />
        </Button>
      </EmojiPopover>
    </div>
  );
};

export default Reaction;
