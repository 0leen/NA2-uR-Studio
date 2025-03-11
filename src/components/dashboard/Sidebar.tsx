import React from "react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  LayoutDashboard,
  Code,
  Palette,
  FileText,
  GitBranch,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
  activePage?: string;
  onNavigate?: (page: string) => void;
}

const Sidebar = ({
  collapsed = false,
  onToggle = () => {},
  activePage = "orchestrator",
  onNavigate = () => {},
}: SidebarProps) => {
  const navItems = [
    {
      id: "orchestrator",
      label: "Orchestrator",
      icon: <LayoutDashboard className="h-5 w-5" />,
      description: "Central command panel for task management",
    },
    {
      id: "agents",
      label: "AI Agents",
      icon: <Code className="h-5 w-5" />,
      description: "Manage AI agents and their tasks",
    },
    {
      id: "workflow",
      label: "Workflow",
      icon: <GitBranch className="h-5 w-5" />,
      description: "Visualize task dependencies and progress",
    },
    {
      id: "assets",
      label: "Asset Library",
      icon: <FileText className="h-5 w-5" />,
      description: "Browse and manage generated assets",
    },
    {
      id: "ui",
      label: "UI/UX",
      icon: <Palette className="h-5 w-5" />,
      description: "Design and preview UI elements",
    },
  ];

  const bottomNavItems = [
    {
      id: "settings",
      label: "Settings",
      icon: <Settings className="h-5 w-5" />,
      description: "Configure project settings",
    },
    {
      id: "help",
      label: "Help & Docs",
      icon: <HelpCircle className="h-5 w-5" />,
      description: "Documentation and support",
    },
  ];

  return (
    <div
      className={`flex h-full flex-col bg-white shadow-md transition-all duration-300 ${collapsed ? "w-16" : "w-64"}`}
    >
      <div className="flex h-full flex-col justify-between p-2">
        {/* Top navigation items */}
        <div className="space-y-2">
          {/* Logo/Brand */}
          <div className="flex h-12 items-center justify-center rounded-md bg-primary/10 p-2">
            {collapsed ? (
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-white">
                <span className="text-lg font-bold">A</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-white">
                  <span className="text-lg font-bold">A</span>
                </div>
                <span className="text-lg font-bold">AI Studio</span>
              </div>
            )}
          </div>

          <Separator className="my-2" />

          {/* Main navigation */}
          <nav className="space-y-1">
            {navItems.map((item) => (
              <TooltipProvider key={item.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={activePage === item.id ? "default" : "ghost"}
                      className={`w-full justify-start ${collapsed ? "px-2" : "px-3"}`}
                      onClick={() => onNavigate(item.id)}
                    >
                      <div className="flex items-center">
                        {item.icon}
                        {!collapsed && (
                          <span className="ml-3">{item.label}</span>
                        )}
                      </div>
                    </Button>
                  </TooltipTrigger>
                  {collapsed && (
                    <TooltipContent side="right">
                      <div>
                        <p className="font-medium">{item.label}</p>
                        <p className="text-xs opacity-70">{item.description}</p>
                      </div>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            ))}
          </nav>
        </div>

        {/* Bottom navigation items */}
        <div className="space-y-2">
          <Separator className="my-2" />

          {/* Settings and Help */}
          <nav className="space-y-1">
            {bottomNavItems.map((item) => (
              <TooltipProvider key={item.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={activePage === item.id ? "default" : "ghost"}
                      className={`w-full justify-start ${collapsed ? "px-2" : "px-3"}`}
                      onClick={() => onNavigate(item.id)}
                    >
                      <div className="flex items-center">
                        {item.icon}
                        {!collapsed && (
                          <span className="ml-3">{item.label}</span>
                        )}
                      </div>
                    </Button>
                  </TooltipTrigger>
                  {collapsed && (
                    <TooltipContent side="right">
                      <div>
                        <p className="font-medium">{item.label}</p>
                        <p className="text-xs opacity-70">{item.description}</p>
                      </div>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            ))}
          </nav>

          {/* Collapse/Expand button */}
          <Button
            variant="outline"
            size="sm"
            className="mt-4 w-full"
            onClick={onToggle}
          >
            {collapsed ? (
              <>
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Expand</span>
              </>
            ) : (
              <>
                <ChevronLeft className="h-4 w-4" />
                <span className="ml-2">Collapse</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
