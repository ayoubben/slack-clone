import EmojiPopover from "@/components/emoji-popover";
import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { MessageSquareTextIcon, Pencil, Smile, Trash } from "lucide-react";

interface ToolbarProps {
  isAuthor: boolean;
  isPending: boolean;
  handleEdit: () => void;
  handleThread: () => void;
  handleReaction: (value: string) => void;
  handleDelete: () => void;
  hideTheadButton?: boolean;
}

const Toolbar = ({
  isAuthor,
  isPending,
  handleEdit,
  handleThread,
  handleReaction,
  handleDelete,
  hideTheadButton,
}: ToolbarProps) => {
  return (
    <div className="absolute top-0 right-5">
      <div className="group-hover:opacity-100 opacity-0 transition-opacity border bg-white rounded-md shadow-sm ">
        <EmojiPopover
          hint="Add reaction"
          onEmojiSelected={(emoji) => handleReaction(emoji.native)}
        >
          <Button variant="ghost" size="iconSm" disabled={isPending}>
            <Smile className="size-4" />
          </Button>
        </EmojiPopover>
        {!hideTheadButton && (
          <Hint label="Reply in thread">
            <Button
              variant="ghost"
              size="iconSm"
              disabled={isPending}
              onClick={handleEdit}
            >
              <MessageSquareTextIcon className="size-4" />
            </Button>
          </Hint>
        )}
        {isAuthor && (
          <>
            <Hint label="edit message">
              <Button
                variant="ghost"
                size="iconSm"
                disabled={isPending}
                onClick={handleEdit}
              >
                <Pencil className="size-4" />
              </Button>
            </Hint>
            <Hint label="Delete message">
              <Button
                variant="ghost"
                size="iconSm"
                disabled={isPending}
                onClick={handleEdit}
              >
                <Trash className="size-4" />
              </Button>
            </Hint>
          </>
        )}
      </div>
    </div>
  );
};

export default Toolbar;
