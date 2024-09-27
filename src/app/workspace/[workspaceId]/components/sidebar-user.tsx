import { Button } from "@/components/ui/button";
import { Id } from "../../../../../convex/_generated/dataModel";
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useWorkspaceId } from "@/app/hooks/use-workspace-id";
import Link from "next/link";

const sideSidebarUserVariants = cva("flex justify-start text-slate-100  rounded-lg", {
  variants: {
    variant: {
      default: "text-slate-100",
      active: "bg-slate-200 hover:bg-slate text-[#481349]",
    },
  },
});

interface SidebarUserProps {
  id: Id<"members">;
  label?: string;
  image?: string;
  variant?: VariantProps<typeof sideSidebarUserVariants>["variant"];
}

const SidebarUser = ({ id, label, image, variant }: SidebarUserProps) => {
  const workspaceId = useWorkspaceId();
  return (
    <>
      <Button
        className={cn(sideSidebarUserVariants({ variant }))}
        size="sm"
        variant="transparent"
        asChild
      >
        <Link
          href={`/workspace/${workspaceId}/channel/${id}`}
          className="flex items-center gap-3"
        >
          <Avatar className="size-5 rounded-md">
            <AvatarImage src={image} alt="Avatar" className="rounded-md" />
            <AvatarFallback>{label?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="text-sm truncate">{label}</span>
        </Link>
      </Button>
    </>
  );
};

export default SidebarUser;
