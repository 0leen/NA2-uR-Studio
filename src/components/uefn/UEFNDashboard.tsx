import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import {
  Code,
  FileText,
  Palette,
  Cpu,
  Layers,
  Map,
  Zap,
  Terminal,
  GitBranch,
  BarChart,
  Clock,
} from "lucide-react";
import UEFNAssistant from "./UEFNAssistant";
import { TaskBoard, Task } from "../tasks";

interface UEFNDashboardProps {
  projectName?: string;
  projectDescription?: string;
}

const UEFNDashboard = ({
  projectName = "Battle Royale Island",
  projectDescription = "A dynamic battle royale map with multiple biomes and interactive elements",
}: UEFNDashboardProps) => {
  // Add onCreateTask function to pass to child components
  const onCreateTask = (taskData) => {
    // Create a new task with generated ID and default values
    const newTask = {
      id: `task-${tasks.length + 1}`,
      status: "pending",
      progress: 0,
      createdAt: new Date().toISOString(),
      ...taskData,
    };

    setTasks([...tasks, newTask]);
    // Show notification
    alert(`New task created: ${taskData.title}`);
  };
  const [activeTab, setActiveTab] = useState("assistant");
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "task-1",
      title: "Set up player spawners",
      description:
        "Place player spawn devices around the map and configure team settings",
      status: "completed",
      priority: "high",
      progress: 100,
      assignedTo: "Cody",
      dependencies: [],
      createdAt: "2023-06-15T10:30:00Z",
      dueDate: "2023-06-18T23:59:59Z",
      tags: ["devices", "setup", "spawners"],
    },
    {
      id: "task-2",
      title: "Implement storm controller",
      description:
        "Create a storm controller device and configure phases for the battle royale gameplay",
      status: "in-progress",
      priority: "high",
      progress: 65,
      assignedTo: "Cody",
      dependencies: ["task-1"],
      createdAt: "2023-06-16T09:15:00Z",
      dueDate: "2023-06-20T23:59:59Z",
      tags: ["verse", "storm", "gameplay"],
    },
    {
      id: "task-3",
      title: "Design terrain and biomes",
      description:
        "Create diverse terrain with multiple biomes including desert, snow, and jungle areas",
      status: "blocked",
      priority: "medium",
      progress: 30,
      assignedTo: "Yui",
      dependencies: [],
      createdAt: "2023-06-16T14:45:00Z",
      dueDate: "2023-06-19T23:59:59Z",
      tags: ["terrain", "design", "biomes"],
      errorLog: [
        { code: "E302", message: "Missing terrain assets for jungle biome" },
        { code: "E201", message: "Need height map for mountain areas" },
      ],
    },
    {
      id: "task-4",
      title: "Create loot spawners",
      description:
        "Implement item spawner devices with different loot tiers across the map",
      status: "pending",
      priority: "medium",
      progress: 0,
      assignedTo: "Cody",
      dependencies: ["task-3"],
      createdAt: "2023-06-17T11:20:00Z",
      dueDate: "2023-06-21T23:59:59Z",
      tags: ["devices", "loot", "gameplay"],
    },
    {
      id: "task-5",
      title: "Design UI for game state",
      description:
        "Create HUD elements to show player count, storm phase, and match time",
      status: "pending",
      priority: "low",
      progress: 0,
      assignedTo: "Yui",
      dependencies: ["task-2"],
      createdAt: "2023-06-17T16:30:00Z",
      dueDate: "2023-06-22T23:59:59Z",
      tags: ["UI", "HUD", "design"],
    },
  ]);

  // Handle creating a new task
  const handleCreateTask = (
    taskData: Omit<
      Task,
      "id" | "status" | "progress" | "createdAt" | "errorLog"
    >,
  ) => {
    const newTask: Task = {
      id: `task-${tasks.length + 1}`,
      status: "pending",
      progress: 0,
      createdAt: new Date().toISOString(),
      ...taskData,
    };

    setTasks([...tasks, newTask]);
  };

  // Handle task status change
  const handleStatusChange = (taskId: string, newStatus: Task["status"]) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          const updatedTask = { ...task, status: newStatus };

          // Update progress based on status
          if (newStatus === "completed") {
            updatedTask.progress = 100;
          } else if (newStatus === "in-progress" && task.status === "pending") {
            updatedTask.progress = 10;
          }

          return updatedTask;
        }
        return task;
      }),
    );
  };

  // Calculate project stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const inProgressTasks = tasks.filter(
    (t) => t.status === "in-progress",
  ).length;
  const pendingTasks = tasks.filter((t) => t.status === "pending").length;
  const blockedTasks = tasks.filter((t) => t.status === "blocked").length;
  const completionPercentage =
    Math.round((completedTasks / totalTasks) * 100) || 0;

  return (
    <div className="w-full h-full bg-white">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="border-b p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center">
                <Map className="mr-2 h-6 w-6 text-primary" />
                {projectName}
              </h1>
              <p className="text-sm text-gray-500">{projectDescription}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-gray-500">Project Completion</div>
                <div className="flex items-center space-x-2">
                  <Progress value={completionPercentage} className="w-32 h-2" />
                  <span className="text-sm font-medium">
                    {completionPercentage}%
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  alert("Publishing island to Fortnite...");
                  // Simulate publishing process
                  setTimeout(() => {
                    alert(
                      "Island published successfully! Island code: 1234-5678-9012",
                    );
                  }, 2000);
                }}
              >
                <Zap className="mr-2 h-4 w-4" />
                Publish Island
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 overflow-hidden"
        >
          <div className="border-b bg-gray-50">
            <TabsList className="mx-4 h-12">
              <TabsTrigger
                value="assistant"
                className="data-[state=active]:bg-white"
              >
                <Cpu className="mr-2 h-4 w-4" />
                AI Assistant
              </TabsTrigger>
              <TabsTrigger
                value="tasks"
                className="data-[state=active]:bg-white"
              >
                <Clock className="mr-2 h-4 w-4" />
                Tasks
              </TabsTrigger>
              <TabsTrigger
                value="assets"
                className="data-[state=active]:bg-white"
              >
                <Layers className="mr-2 h-4 w-4" />
                Assets
              </TabsTrigger>
              <TabsTrigger
                value="verse"
                className="data-[state=active]:bg-white"
              >
                <Code className="mr-2 h-4 w-4" />
                Verse Scripts
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="data-[state=active]:bg-white"
              >
                <BarChart className="mr-2 h-4 w-4" />
                Analytics
              </TabsTrigger>
            </TabsList>
          </div>

          {/* AI Assistant Tab */}
          <TabsContent
            value="assistant"
            className="flex-1 overflow-auto p-4 data-[state=active]:flex-1"
          >
            <UEFNAssistant onCreateTask={handleCreateTask} />
          </TabsContent>

          {/* Tasks Tab */}
          <TabsContent
            value="tasks"
            className="flex-1 overflow-auto p-4 data-[state=active]:flex-1"
          >
            <TaskBoard
              tasks={tasks}
              onCreateTask={() => setActiveTab("assistant")}
              onViewTask={(taskId) => {
                const task = tasks.find((t) => t.id === taskId);
                if (task) {
                  // Show task details in a modal or panel
                  alert(
                    `Task: ${task.title}\nStatus: ${task.status}\nAssigned to: ${task.assignedTo}`,
                  );
                }
              }}
              onEditTask={(taskId) => {
                const task = tasks.find((t) => t.id === taskId);
                if (task) {
                  // In a real app, you would open an edit modal
                  alert(`Editing task: ${task.title}`);
                }
              }}
              onDeleteTask={(id) => setTasks(tasks.filter((t) => t.id !== id))}
              onStatusChange={handleStatusChange}
            />
          </TabsContent>

          {/* Assets Tab */}
          <TabsContent
            value="assets"
            className="flex-1 overflow-auto p-4 data-[state=active]:flex-1"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Terrain Assets</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md border hover:bg-gray-100 cursor-pointer">
                      <div className="flex items-center">
                        <img
                          src="https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=100&q=80"
                          alt="Mountain"
                          className="w-12 h-12 object-cover rounded mr-3"
                        />
                        <div>
                          <p className="font-medium">Mountain Set</p>
                          <p className="text-xs text-gray-500">12 assets</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          alert("Mountain assets added to your island")
                        }
                      >
                        Add
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md border hover:bg-gray-100 cursor-pointer">
                      <div className="flex items-center">
                        <img
                          src="https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=100&q=80"
                          alt="Forest"
                          className="w-12 h-12 object-cover rounded mr-3"
                        />
                        <div>
                          <p className="font-medium">Forest Pack</p>
                          <p className="text-xs text-gray-500">18 assets</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          alert("Forest assets added to your island")
                        }
                      >
                        Add
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md border hover:bg-gray-100 cursor-pointer">
                      <div className="flex items-center">
                        <img
                          src="https://images.unsplash.com/photo-1504751331200-9c302e80a857?w=100&q=80"
                          alt="Desert"
                          className="w-12 h-12 object-cover rounded mr-3"
                        />
                        <div>
                          <p className="font-medium">Desert Biome</p>
                          <p className="text-xs text-gray-500">9 assets</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          alert("Desert assets added to your island")
                        }
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Game Devices</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md border hover:bg-gray-100 cursor-pointer">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-blue-100 rounded flex items-center justify-center">
                          <Zap className="h-6 w-6 text-blue-500" />
                        </div>
                        <div className="ml-3">
                          <p className="font-medium">Player Spawner</p>
                          <p className="text-xs text-gray-500">Core device</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          alert("Player Spawner added to your island");
                          // Create a task for configuring the spawner
                          onCreateTask({
                            title: "Configure Player Spawner",
                            description:
                              "Set up team assignments and spawn locations for the battle royale map",
                            priority: "high",
                            assignedTo: "Cody",
                            dueDate: new Date(
                              Date.now() + 2 * 24 * 60 * 60 * 1000,
                            ).toISOString(),
                            dependencies: [],
                            tags: ["spawner", "setup", "core"],
                          });
                        }}
                      >
                        Add
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md border hover:bg-gray-100 cursor-pointer">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-purple-100 rounded flex items-center justify-center">
                          <Map className="h-6 w-6 text-purple-500" />
                        </div>
                        <div className="ml-3">
                          <p className="font-medium">Storm Controller</p>
                          <p className="text-xs text-gray-500">Battle Royale</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          alert("Storm Controller added to your island");
                          // Create a task for configuring the storm
                          onCreateTask({
                            title: "Configure Storm Controller",
                            description:
                              "Set up storm phases and damage values for the battle royale gameplay",
                            priority: "high",
                            assignedTo: "Cody",
                            dueDate: new Date(
                              Date.now() + 3 * 24 * 60 * 60 * 1000,
                            ).toISOString(),
                            dependencies: [],
                            tags: ["storm", "gameplay", "battle-royale"],
                          });
                        }}
                      >
                        Add
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md border hover:bg-gray-100 cursor-pointer">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-amber-100 rounded flex items-center justify-center">
                          <Layers className="h-6 w-6 text-amber-500" />
                        </div>
                        <div className="ml-3">
                          <p className="font-medium">Item Spawner</p>
                          <p className="text-xs text-gray-500">Loot system</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          alert("Item Spawner added to your island");
                          // Create a task for configuring loot
                          onCreateTask({
                            title: "Set up Loot System",
                            description:
                              "Configure item spawners with different loot tiers across the map",
                            priority: "medium",
                            assignedTo: "Cody",
                            dueDate: new Date(
                              Date.now() + 4 * 24 * 60 * 60 * 1000,
                            ).toISOString(),
                            dependencies: [],
                            tags: ["loot", "items", "gameplay"],
                          });
                        }}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Assets</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md border hover:bg-gray-100 cursor-pointer">
                      <div className="flex items-center">
                        <img
                          src="https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=100&q=80"
                          alt="Vehicle"
                          className="w-12 h-12 object-cover rounded mr-3"
                        />
                        <div>
                          <p className="font-medium">Battle Bus</p>
                          <p className="text-xs text-gray-500">Vehicle</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => alert("Battle Bus added to your island")}
                      >
                        Add
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md border hover:bg-gray-100 cursor-pointer">
                      <div className="flex items-center">
                        <img
                          src="https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=100&q=80"
                          alt="Building"
                          className="w-12 h-12 object-cover rounded mr-3"
                        />
                        <div>
                          <p className="font-medium">Modern Buildings</p>
                          <p className="text-xs text-gray-500">Structures</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          alert("Modern Buildings added to your island")
                        }
                      >
                        Add
                      </Button>
                    </div>

                    <Button
                      className="w-full mt-4"
                      variant="outline"
                      onClick={() => {
                        alert("Opening Asset Marketplace...");
                        // In a real implementation, this would open the full asset marketplace
                      }}
                    >
                      Browse All Assets
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Verse Scripts Tab */}
          <TabsContent
            value="verse"
            className="flex-1 overflow-auto p-4 data-[state=active]:flex-1"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>My Verse Scripts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div
                      className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        alert("Opening Storm Controller script in editor...");
                        // In a real implementation, this would open the script in a code editor
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Code className="h-5 w-5 text-blue-500 mr-2" />
                          <span className="font-medium">
                            StormController.verse
                          </span>
                        </div>
                        <Badge>Active</Badge>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Last edited: Today at 2:45 PM
                      </p>
                      <p className="text-sm mt-2">
                        Controls storm phases and damage for battle royale
                        gameplay
                      </p>
                    </div>

                    <div
                      className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        alert("Opening Player Movement script in editor...");
                        // In a real implementation, this would open the script in a code editor
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Code className="h-5 w-5 text-blue-500 mr-2" />
                          <span className="font-medium">
                            PlayerMovement.verse
                          </span>
                        </div>
                        <Badge>Active</Badge>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Last edited: Yesterday at 10:20 AM
                      </p>
                      <p className="text-sm mt-2">
                        Custom player movement with double jump functionality
                      </p>
                    </div>

                    <div
                      className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        alert("Opening Trigger Zone script in editor...");
                        // In a real implementation, this would open the script in a code editor
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Code className="h-5 w-5 text-blue-500 mr-2" />
                          <span className="font-medium">TriggerZone.verse</span>
                        </div>
                        <Badge variant="outline">Draft</Badge>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Last edited: 3 days ago
                      </p>
                      <p className="text-sm mt-2">
                        Detects when players enter or exit a defined zone
                      </p>
                    </div>

                    <Button
                      className="w-full mt-2"
                      variant="outline"
                      onClick={() => {
                        // Create a new script
                        const scriptName = prompt(
                          "Enter name for new Verse script:",
                          "NewScript.verse",
                        );
                        if (scriptName) {
                          alert(`Creating new script: ${scriptName}`);
                          // In a real implementation, this would create a new script file
                          onCreateTask({
                            title: `Implement ${scriptName}`,
                            description: `Create and implement functionality for the new ${scriptName} Verse script`,
                            priority: "medium",
                            assignedTo: "Cody",
                            dueDate: new Date(
                              Date.now() + 5 * 24 * 60 * 60 * 1000,
                            ).toISOString(),
                            dependencies: [],
                            tags: ["verse", "code", "implementation"],
                          });
                        }
                      }}
                    >
                      Create New Script
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Script Templates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div
                      className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        alert(
                          "Applying Battle Royale Game Manager template...",
                        );
                        // In a real implementation, this would create a new script from the template
                        onCreateTask({
                          title: "Configure Battle Royale Game Manager",
                          description:
                            "Set up game phases, scoring, and win conditions for battle royale gameplay",
                          priority: "high",
                          assignedTo: "Cody",
                          dueDate: new Date(
                            Date.now() + 2 * 24 * 60 * 60 * 1000,
                          ).toISOString(),
                          dependencies: [],
                          tags: ["verse", "game-manager", "battle-royale"],
                        });
                      }}
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center mr-3">
                          <Code className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                          <p className="font-medium">
                            Battle Royale Game Manager
                          </p>
                          <p className="text-xs text-gray-500">
                            Complete game loop with phases
                          </p>
                        </div>
                      </div>
                    </div>

                    <div
                      className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        alert(
                          "Applying Advanced Movement Controller template...",
                        );
                        // In a real implementation, this would create a new script from the template
                        onCreateTask({
                          title: "Implement Advanced Movement Controller",
                          description:
                            "Set up advanced movement mechanics including sliding, wall running, and grappling",
                          priority: "medium",
                          assignedTo: "Cody",
                          dueDate: new Date(
                            Date.now() + 4 * 24 * 60 * 60 * 1000,
                          ).toISOString(),
                          dependencies: [],
                          tags: ["verse", "movement", "mechanics"],
                        });
                      }}
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-green-100 rounded flex items-center justify-center mr-3">
                          <Code className="h-5 w-5 text-green-500" />
                        </div>
                        <div>
                          <p className="font-medium">
                            Advanced Movement Controller
                          </p>
                          <p className="text-xs text-gray-500">
                            Sliding, wall running, grappling
                          </p>
                        </div>
                      </div>
                    </div>

                    <div
                      className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        alert("Applying Interactive Props System template...");
                        // In a real implementation, this would create a new script from the template
                        onCreateTask({
                          title: "Set up Interactive Props System",
                          description:
                            "Implement a system for interactive props that players can use in the environment",
                          priority: "medium",
                          assignedTo: "Cody",
                          dueDate: new Date(
                            Date.now() + 3 * 24 * 60 * 60 * 1000,
                          ).toISOString(),
                          dependencies: [],
                          tags: ["verse", "props", "interaction"],
                        });
                      }}
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-purple-100 rounded flex items-center justify-center mr-3">
                          <Code className="h-5 w-5 text-purple-500" />
                        </div>
                        <div>
                          <p className="font-medium">
                            Interactive Props System
                          </p>
                          <p className="text-xs text-gray-500">
                            Usable objects and environment items
                          </p>
                        </div>
                      </div>
                    </div>

                    <Button
                      className="w-full mt-2"
                      variant="outline"
                      onClick={() => {
                        alert("Opening Template Marketplace...");
                        // In a real implementation, this would open the template marketplace
                      }}
                    >
                      Browse All Templates
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent
            value="analytics"
            className="flex-1 overflow-auto p-4 data-[state=active]:flex-1"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Player Count
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12,458</div>
                  <p className="text-xs text-green-500 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4 mr-1"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.577 4.878a.75.75 0 01.919-.53l4.78 1.281a.75.75 0 01.531.919l-1.281 4.78a.75.75 0 01-1.449-.387l.81-3.022a19.407 19.407 0 00-5.594 5.203.75.75 0 01-1.139.093L7 10.06l-4.72 4.72a.75.75 0 01-1.06-1.061l5.25-5.25a.75.75 0 011.06 0l3.074 3.073a20.923 20.923 0 015.545-4.931l-3.042-.815a.75.75 0 01-.53-.919z"
                        clipRule="evenodd"
                      />
                    </svg>
                    +24% from last week
                  </p>
                  <div className="mt-4 h-20 bg-gray-100 rounded-md flex items-end">
                    <div className="w-1/6 h-4 bg-primary rounded-sm mx-[1px]"></div>
                    <div className="w-1/6 h-8 bg-primary rounded-sm mx-[1px]"></div>
                    <div className="w-1/6 h-6 bg-primary rounded-sm mx-[1px]"></div>
                    <div className="w-1/6 h-10 bg-primary rounded-sm mx-[1px]"></div>
                    <div className="w-1/6 h-14 bg-primary rounded-sm mx-[1px]"></div>
                    <div className="w-1/6 h-20 bg-primary rounded-sm mx-[1px]"></div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Average Play Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">18:24</div>
                  <p className="text-xs text-green-500 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4 mr-1"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.577 4.878a.75.75 0 01.919-.53l4.78 1.281a.75.75 0 01.531.919l-1.281 4.78a.75.75 0 01-1.449-.387l.81-3.022a19.407 19.407 0 00-5.594 5.203.75.75 0 01-1.139.093L7 10.06l-4.72 4.72a.75.75 0 01-1.06-1.061l5.25-5.25a.75.75 0 011.06 0l3.074 3.073a20.923 20.923 0 015.545-4.931l-3.042-.815a.75.75 0 01-.53-.919z"
                        clipRule="evenodd"
                      />
                    </svg>
                    +12% from last week
                  </p>
                  <div className="mt-4 h-20 bg-gray-100 rounded-md flex items-end">
                    <div className="w-1/6 h-10 bg-primary rounded-sm mx-[1px]"></div>
                    <div className="w-1/6 h-8 bg-primary rounded-sm mx-[1px]"></div>
                    <div className="w-1/6 h-12 bg-primary rounded-sm mx-[1px]"></div>
                    <div className="w-1/6 h-14 bg-primary rounded-sm mx-[1px]"></div>
                    <div className="w-1/6 h-16 bg-primary rounded-sm mx-[1px]"></div>
                    <div className="w-1/6 h-20 bg-primary rounded-sm mx-[1px]"></div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Player Retention
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">68%</div>
                  <p className="text-xs text-amber-500 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4 mr-1"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2.24 6.8a.75.75 0 001.06-.04l1.95-2.1v8.59a.75.75 0 001.5 0V4.66l1.95 2.1a.75.75 0 101.1-1.02l-3.25-3.5a.75.75 0 00-1.1 0L2.2 5.74a.75.75 0 00.04 1.06zm8 6.4a.75.75 0 00-.04 1.06l3.25 3.5a.75.75 0 001.1 0l3.25-3.5a.75.75 0 10-1.1-1.02l-1.95 2.1V6.75a.75.75 0 00-1.5 0v8.59l-1.95-2.1a.75.75 0 00-1.06-.04z"
                        clipRule="evenodd"
                      />
                    </svg>
                    No change from last week
                  </p>
                  <div className="mt-4 h-20 bg-gray-100 rounded-md flex items-end">
                    <div className="w-1/6 h-20 bg-primary rounded-sm mx-[1px]"></div>
                    <div className="w-1/6 h-16 bg-primary rounded-sm mx-[1px]"></div>
                    <div className="w-1/6 h-14 bg-primary rounded-sm mx-[1px]"></div>
                    <div className="w-1/6 h-12 bg-primary rounded-sm mx-[1px]"></div>
                    <div className="w-1/6 h-14 bg-primary rounded-sm mx-[1px]"></div>
                    <div className="w-1/6 h-14 bg-primary rounded-sm mx-[1px]"></div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Popular Locations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center mr-3">
                          <span className="text-red-500 font-bold">1</span>
                        </div>
                        <span>Central Tower</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-32 h-2 bg-gray-200 rounded-full mr-2">
                          <div
                            className="h-full bg-red-500 rounded-full"
                            style={{ width: "85%" }}
                          ></div>
                        </div>
                        <span className="text-sm">85%</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center mr-3">
                          <span className="text-orange-500 font-bold">2</span>
                        </div>
                        <span>Desert Oasis</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-32 h-2 bg-gray-200 rounded-full mr-2">
                          <div
                            className="h-full bg-orange-500 rounded-full"
                            style={{ width: "72%" }}
                          ></div>
                        </div>
                        <span className="text-sm">72%</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-yellow-100 rounded flex items-center justify-center mr-3">
                          <span className="text-yellow-500 font-bold">3</span>
                        </div>
                        <span>Mountain Peak</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-32 h-2 bg-gray-200 rounded-full mr-2">
                          <div
                            className="h-full bg-yellow-500 rounded-full"
                            style={{ width: "64%" }}
                          ></div>
                        </div>
                        <span className="text-sm">64%</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center mr-3">
                          <span className="text-green-500 font-bold">4</span>
                        </div>
                        <span>Forest Camp</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-32 h-2 bg-gray-200 rounded-full mr-2">
                          <div
                            className="h-full bg-green-500 rounded-full"
                            style={{ width: "51%" }}
                          ></div>
                        </div>
                        <span className="text-sm">51%</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center mr-3">
                          <span className="text-blue-500 font-bold">5</span>
                        </div>
                        <span>Lakeside Village</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-32 h-2 bg-gray-200 rounded-full mr-2">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: "43%" }}
                          ></div>
                        </div>
                        <span className="text-sm">43%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Memory Usage</span>
                        <span className="text-sm font-medium">72%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full">
                        <div
                          className="h-full bg-amber-500 rounded-full"
                          style={{ width: "72%" }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">CPU Usage</span>
                        <span className="text-sm font-medium">64%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full">
                        <div
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: "64%" }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Network Usage</span>
                        <span className="text-sm font-medium">38%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: "38%" }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Storage Usage</span>
                        <span className="text-sm font-medium">45%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full">
                        <div
                          className="h-full bg-purple-500 rounded-full"
                          style={{ width: "45%" }}
                        ></div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Button
                        className="w-full"
                        variant="outline"
                        onClick={() => {
                          alert("Generating detailed performance report...");
                          // In a real implementation, this would generate a detailed report
                        }}
                      >
                        Generate Detailed Report
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UEFNDashboard;
