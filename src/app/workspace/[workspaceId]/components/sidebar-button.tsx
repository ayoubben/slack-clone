import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons/lib";

interface SidebarButtonProps {
  label: string;
  icon: LucideIcon | IconType;
  isActive?: boolean;
}

const SidebarButton = ({ label, icon: Icon, isActive }: SidebarButtonProps) => {
  return (
    <div className="flex flex-col items-center justify-center bg-transparent gap-y-1">
      <Button
        variant="transparent"
        className={cn(
          "flex p-3 items-center justify-center font-semibold text-white hover:text-black size-9 hover:bg-accent/60  rounded-md",
          isActive && "bg-accent/40 text-black "
        )}
      >
        <Icon className="size-5 shrink-0" />
      </Button>
      <span className="text-xs text-accent">{label}</span>
    </div>
  );
};

export default SidebarButton;
