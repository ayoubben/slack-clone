import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PlusIcon } from "lucide-react";
import { FaCaretDown } from "react-icons/fa";
import { useToggle } from "react-use";

interface WorkspaceSectionProps {
  children?: React.ReactNode;
  label: string;
  onNew?: () => void;
}

const WorkspaceSection = ({ children, label, onNew }: WorkspaceSectionProps) => {
  const [isOpen, toggle] = useToggle(false);
  return (
    <div className="flex flex-col gap-2 px-2">
      <div className="flex justify-between gap-4 group">
        <Button variant="transparent" onClick={toggle} className="p-0.5">
          <FaCaretDown
            className={cn(
              "size-5 text-white mr-2 transition-transform",
              !isOpen && "-rotate-90"
            )}
          />
          <span className="text-sm font-semibold text-white">{label}</span>
        </Button>

        <Button
          variant="transparent"
          className="p-0.5 opacity-0 group-hover:opacity-100"
          onClick={onNew}
        >
          <PlusIcon className="size-5 text-white" />
        </Button>
      </div>

      {isOpen && children}
    </div>
  );
};

export default WorkspaceSection;
