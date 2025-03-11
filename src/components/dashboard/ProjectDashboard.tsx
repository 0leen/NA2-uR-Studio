import React, { useState } from "react";
import Sidebar from "./Sidebar";
import OrchestratorPanel from "../orchestrator/OrchestratorPanel";
import WorkflowVisualization from "../workflow/WorkflowVisualization";
import AgentGrid from "../agents/AgentGrid";
import AssetLibrary from "../assets/AssetLibrary";

interface ProjectDashboardProps {
  projectName?: string;
  projectDescription?: string;
}

const ProjectDashboard = ({
  projectName = "UEFN Battle Royale Map",
  projectDescription = "A dynamic battle royale map with multiple biomes and interactive elements",
}: ProjectDashboardProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activePage, setActivePage] = useState("orchestrator");

  // Toggle sidebar collapsed state
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Handle navigation between different sections
  const handleNavigate = (page: string) => {
    setActivePage(page);
  };

  // Render the appropriate content based on active page
  const renderContent = () => {
    switch (activePage) {
      case "orchestrator":
        return (
          <OrchestratorPanel
            projectName={projectName}
            projectDescription={projectDescription}
          />
        );
      case "agents":
        return <AgentGrid />;
      case "workflow":
        return <WorkflowVisualization />;
      case "assets":
        return <AssetLibrary />;
      case "ui":
        return (
          <div className="flex h-full w-full items-center justify-center bg-white p-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold">UI/UX Design</h2>
              <p className="mt-2 text-gray-500">
                Design and preview UI elements for your UEFN map
              </p>
            </div>
          </div>
        );
      case "settings":
        return (
          <div className="flex h-full w-full items-center justify-center bg-white p-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold">Project Settings</h2>
              <p className="mt-2 text-gray-500">
                Configure settings for your UEFN project
              </p>
            </div>
          </div>
        );
      case "help":
        return (
          <div className="flex h-full w-full items-center justify-center bg-white p-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold">Help & Documentation</h2>
              <p className="mt-2 text-gray-500">
                Get help and learn more about the AI Studio for UEFN
              </p>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex h-full w-full items-center justify-center bg-white p-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold">Page Not Found</h2>
              <p className="mt-2 text-gray-500">
                The requested page does not exist
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
        activePage={activePage}
        onNavigate={handleNavigate}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">{renderContent()}</div>
    </div>
  );
};

export default ProjectDashboard;
