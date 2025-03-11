import React, { useState } from "react";
import { TaskBoard, TaskDetailView, TaskCreateForm, Task } from "../tasks";

interface TaskManagementProps {
  tasks?: Task[];
  onCreateTask?: () => void;
  onEditTask?: (taskId: string) => void;
  onDeleteTask?: (taskId: string) => void;
  onAssignTask?: (taskId: string, agentId: string) => void;
  onUpdateTaskStatus?: (taskId: string, status: Task["status"]) => void;
}

const TaskManagement = ({
  tasks = [
    {
      id: "task-1",
      title: "Design game map layout",
      description:
        "Create the initial layout for the UEFN game map with multiple biomes and interactive elements",
      status: "completed",
      priority: "high",
      progress: 100,
      assignedTo: "Yui",
      dependencies: [],
      createdAt: "2023-06-15T10:30:00Z",
      dueDate: "2023-06-18T23:59:59Z",
      tags: ["design", "map", "layout"],
    },
    {
      id: "task-2",
      title: "Implement player movement mechanics",
      description:
        "Code the basic player movement and physics interactions for the character controller",
      status: "in-progress",
      priority: "high",
      progress: 65,
      assignedTo: "Cody",
      dependencies: ["task-1"],
      createdAt: "2023-06-16T09:15:00Z",
      dueDate: "2023-06-20T23:59:59Z",
      tags: ["code", "movement", "physics"],
    },
    {
      id: "task-3",
      title: "Create game assets list",
      description:
        "Compile a comprehensive list of required game assets for the map including models, textures, and sounds",
      status: "blocked",
      priority: "medium",
      progress: 30,
      assignedTo: "MetaBot",
      dependencies: ["task-1"],
      createdAt: "2023-06-16T14:45:00Z",
      dueDate: "2023-06-19T23:59:59Z",
      tags: ["assets", "planning"],
      errorLog: [
        { code: "E302", message: "Missing collision mesh references" },
        { code: "E201", message: "Awaiting design approval from Yui" },
      ],
    },
    {
      id: "task-4",
      title: "Design UI elements",
      description:
        "Create UI mockups for the game interface including HUD, menus, and interactive elements",
      status: "pending",
      priority: "medium",
      progress: 0,
      assignedTo: "Yui",
      dependencies: [],
      createdAt: "2023-06-17T11:20:00Z",
      dueDate: "2023-06-21T23:59:59Z",
      tags: ["UI", "design", "HUD"],
    },
    {
      id: "task-5",
      title: "Implement game scoring system",
      description:
        "Code the scoring and achievement system for tracking player progress and statistics",
      status: "pending",
      priority: "low",
      progress: 0,
      assignedTo: "Cody",
      dependencies: ["task-2"],
      createdAt: "2023-06-17T16:30:00Z",
      dueDate: "2023-06-22T23:59:59Z",
      tags: ["code", "scoring", "achievements"],
    },
  ],
  onCreateTask = () => {},
  onEditTask = () => {},
  onDeleteTask = () => {},
  onAssignTask = () => {},
  onUpdateTaskStatus = () => {},
}: TaskManagementProps) => {
  const [activeTab, setActiveTab] = useState<"details" | "board">("board");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [localTasks, setLocalTasks] = useState<Task[]>(tasks);

  // Handle viewing a task's details
  const handleViewTask = (taskId: string) => {
    const task = localTasks.find((t) => t.id === taskId);
    if (task) {
      setSelectedTask(task);
      setActiveTab("details");
    }
  };

  // Handle status change
  const handleStatusChange = (taskId: string, newStatus: Task["status"]) => {
    // Update local state
    setLocalTasks((prevTasks) =>
      prevTasks.map((task) => {
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

    // Call the parent's callback
    onUpdateTaskStatus(taskId, newStatus);
  };

  // Handle task creation
  const handleCreateTask = (
    taskData: Omit<
      Task,
      "id" | "status" | "progress" | "createdAt" | "errorLog"
    >,
  ) => {
    // Create a new task with generated ID and default values
    const newTask: Task = {
      id: `task-${localTasks.length + 1}`,
      status: "pending",
      progress: 0,
      createdAt: new Date().toISOString(),
      ...taskData,
    };

    // Update local state
    setLocalTasks((prevTasks) => [...prevTasks, newTask]);

    // Call the parent's callback
    onCreateTask();

    // Close the modal
    setIsCreateTaskOpen(false);
  };

  // Handle task deletion
  const handleDeleteTask = (taskId: string) => {
    // Update local state
    setLocalTasks((prevTasks) =>
      prevTasks.filter((task) => task.id !== taskId),
    );

    // Call the parent's callback
    onDeleteTask(taskId);
  };

  return (
    <div className="w-full h-full">
      {activeTab === "board" ? (
        <>
          <TaskBoard
            tasks={localTasks}
            onCreateTask={() => setIsCreateTaskOpen(true)}
            onViewTask={handleViewTask}
            onEditTask={onEditTask}
            onDeleteTask={handleDeleteTask}
            onStatusChange={handleStatusChange}
          />

          <TaskCreateForm
            open={isCreateTaskOpen}
            onOpenChange={setIsCreateTaskOpen}
            onSubmit={handleCreateTask}
            existingTasks={localTasks}
          />
        </>
      ) : (
        selectedTask && (
          <TaskDetailView
            open={true}
            onOpenChange={() => setActiveTab("board")}
            task={selectedTask}
            allTasks={localTasks}
            onEdit={onEditTask}
            onStatusChange={handleStatusChange}
          />
        )
      )}
    </div>
  );
};

export default TaskManagement;
