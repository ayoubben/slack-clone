import { useWorkspaceId } from "@/app/hooks/use-workspace-id";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { IconType } from "react-icons/lib";

const sideSidebarItemVariants = cva("flex justify-start text-slate-100  rounded-lg", {
  variants: {
    variant: {
      default: "text-slate-100",
      active: "bg-slate-200 hover:bg-slate text-[#481349]",
    },
  },
});

interface SidebarItemProps {
  id: string;
  label: string;
  icon: IconType | LucideIcon;
  variant?: VariantProps<typeof sideSidebarItemVariants>["variant"];
}

const SidebarItem = ({ id, label, icon: Icon, variant }: SidebarItemProps) => {
  const workspaceId = useWorkspaceId();
  return (
    <Button
      className={cn(sideSidebarItemVariants({ variant }))}
      size="sm"
      variant="transparent"
      asChild
    >
      <Link href={`/workspace/${workspaceId}/channel/${id}`}>
        <Icon className="size-3.5 mr-2 shrink-0" />
        <span className="text-sm truncate">{label}</span>
      </Link>
    </Button>
  );
};

export default SidebarItem;
