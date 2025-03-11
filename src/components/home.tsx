import React, { useState } from "react";
import Header from "./layout/Header";
import ProjectDashboard from "./dashboard/ProjectDashboard";
import NewProjectModal from "./modals/NewProjectModal";

const Home = () => {
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState({
    id: "1",
    name: "UEFN Battle Royale Map",
    description:
      "A dynamic battle royale map with multiple biomes and interactive elements",
  });
  const [projects, setProjects] = useState([
    {
      id: "1",
      name: "UEFN Battle Royale Map",
    },
    {
      id: "2",
      name: "UEFN Adventure Map",
    },
    {
      id: "3",
      name: "UEFN Puzzle Map",
    },
  ]);

  // Handle project change from header dropdown
  const handleProjectChange = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      setCurrentProject({
        ...project,
        description:
          "A dynamic battle royale map with multiple biomes and interactive elements", // This would come from the API in a real app
      });
    }
  };

  // Handle new project creation
  const handleCreateProject = (projectData: any) => {
    const newProject = {
      id: `${projects.length + 1}`,
      name: projectData.projectName,
      description: projectData.description,
    };

    setProjects([...projects, { id: newProject.id, name: newProject.name }]);
    setCurrentProject(newProject);
    setIsNewProjectModalOpen(false);
  };

  // Handle opening the new project modal
  const handleNewProjectClick = () => {
    setIsNewProjectModalOpen(true);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-white">
      {/* Header */}
      <Header
        projectName={currentProject.name}
        projects={projects}
        onProjectChange={handleProjectChange}
        onSettingsClick={() => console.log("Settings clicked")}
        onHelpClick={() => console.log("Help clicked")}
        onLogoutClick={() => console.log("Logout clicked")}
        onProfileClick={() => console.log("Profile clicked")}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <ProjectDashboard
          projectName={currentProject.name}
          projectDescription={currentProject.description}
        />
      </div>

      {/* New Project Modal */}
      <NewProjectModal
        open={isNewProjectModalOpen}
        onOpenChange={setIsNewProjectModalOpen}
        onSubmit={handleCreateProject}
        onCancel={() => setIsNewProjectModalOpen(false)}
      />
    </div>
  );
};

export default Home;
