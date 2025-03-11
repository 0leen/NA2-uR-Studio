import React, { useState } from "react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Bell,
  ChevronDown,
  HelpCircle,
  LogOut,
  Settings,
  User,
} from "lucide-react";

interface HeaderProps {
  userName?: string;
  userAvatar?: string;
  projectName?: string;
  projects?: Array<{ id: string; name: string }>;
  onProjectChange?: (projectId: string) => void;
  onSettingsClick?: () => void;
  onHelpClick?: () => void;
  onLogoutClick?: () => void;
  onProfileClick?: () => void;
}

const Header = ({
  userName = "John Doe",
  userAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  projectName = "UEFN Battle Royale Map",
  projects = [
    { id: "1", name: "UEFN Battle Royale Map" },
    { id: "2", name: "UEFN Adventure Map" },
    { id: "3", name: "UEFN Puzzle Map" },
  ],
  onProjectChange = () => {},
  onSettingsClick = () => {},
  onHelpClick = () => {},
  onLogoutClick = () => {},
  onProfileClick = () => {},
}: HeaderProps) => {
  const [currentProject, setCurrentProject] = useState(projectName);

  const handleProjectChange = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      setCurrentProject(project.name);
      onProjectChange(projectId);
    }
  };

  return (
    <header className="w-full h-16 bg-white border-b border-gray-200 px-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        {/* App Logo */}
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-white">
            <span className="text-lg font-bold">A</span>
          </div>
          <span className="text-lg font-bold hidden md:inline">AI Studio</span>
        </div>

        {/* Project Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center space-x-1">
              <span className="max-w-[150px] truncate">{currentProject}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[220px]">
            <DropdownMenuLabel>Switch Project</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {projects.map((project) => (
              <DropdownMenuItem
                key={project.id}
                onClick={() => handleProjectChange(project.id)}
                className="cursor-pointer"
              >
                {project.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <span className="text-primary">+ Create New Project</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center space-x-2">
        {/* Help Button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={onHelpClick}
              >
                <HelpCircle className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Help & Documentation</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Notifications Button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Notifications</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Settings Button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={onSettingsClick}
              >
                <Settings className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Settings</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center space-x-2 rounded-full p-1 pl-1 pr-2 md:pr-3"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={userAvatar} alt={userName} />
                <AvatarFallback>
                  {userName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <span className="hidden md:inline text-sm font-medium">
                {userName}
              </span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={onProfileClick}
            >
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={onSettingsClick}
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-red-600"
              onClick={onLogoutClick}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
