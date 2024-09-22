"use client";
import Sidebar from "./components/sidebar";
import { Toolbar } from "./components/toolbar";

interface WorkspaceLayoutProps {
  children: React.ReactNode;
}

export const WorkspaceLayout = ({ children }: WorkspaceLayoutProps) => {
  return (
    <div className="h-full">
      <Toolbar />
      <div className="flex h-[calc(100vh-56px)]">
        <Sidebar />
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export default WorkspaceLayout;
