import { UserButton } from "@/app/features/auth/components/user-button";
import WorkspaceSwitcher from "./workspace-switcher";
import SidebarButton from "./sidebar-button";
import { Bell, Home, MessageCircle, MoreHorizontal } from "lucide-react";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();
  return (
    <aside className="flex flex-col gap-y-4 items-center py-4 w-[72px] h-full bg-[#481349]">
      <WorkspaceSwitcher />
      <SidebarButton
        label="Home"
        icon={Home}
        isActive={pathname.includes("/workspace")}
      />
      <SidebarButton
        label="Dms"
        icon={MessageCircle}
        isActive={pathname.includes("/laterToDefine")}
      />
      <SidebarButton
        label="Activity"
        icon={Bell}
        isActive={pathname.includes("/laterToDefine")}
      />
      <SidebarButton
        label="More"
        icon={MoreHorizontal}
        isActive={pathname.includes("/laterToDefine")}
      />
      <div className="flex flex-col items-center py-1 mt-auto ">
        <UserButton />
      </div>
    </aside>
  );
};

export default Sidebar;
