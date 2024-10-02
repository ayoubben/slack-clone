import { useState } from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Popover, PopoverContent } from "./ui/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";

interface EmojiPopoverProps {
  children: React.ReactNode;
  hint?: string;
  onEmojiSelected: (emoji: any) => void;
}

const EmojiPopover = ({
  children,
  hint = "Emojies",
  onEmojiSelected,
}: EmojiPopoverProps) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const onSelect = (emoji: any) => {
    onEmojiSelected(emoji);
    setPopoverOpen(false);

    setTimeout(() => {
      setTooltipOpen(false);
    }, 500);
  };

  return (
    <TooltipProvider>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen} delayDuration={50}>
          <PopoverTrigger asChild>
            <TooltipTrigger asChild>{children}</TooltipTrigger>
          </PopoverTrigger>
          <TooltipContent
            side="top"
            align="start"
            sideOffset={5}
            alignOffset={10}
            className="text-white bg-black border-black"
          >
            <p className="font-medium text-sm">{hint}</p>
          </TooltipContent>
          <PopoverContent className="p-0 w-full border-none shadow-none">
            <Picker data={data} onEmojiSelect={onSelect} />
          </PopoverContent>
        </Tooltip>
      </Popover>
    </TooltipProvider>
  );
};

export default EmojiPopover;
