import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Search,
  Filter,
  Plus,
  SortDesc,
  LayoutGrid,
  List,
  Calendar,
} from "lucide-react";
import TaskCard, { Task } from "./TaskCard";
import TaskList from "./TaskList";
import TaskKanban from "./TaskKanban";

interface TaskBoardProps {
  tasks?: Task[];
  onCreateTask?: () => void;
  onViewTask?: (taskId: string) => void;
  onEditTask?: (taskId: string) => void;
  onDeleteTask?: (taskId: string) => void;
  onStatusChange?: (taskId: string, status: Task["status"]) => void;
}

const TaskBoard = ({
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
    {
      id: "task-6",
      title: "Implement lava trap mechanics",
      description:
        "Create interactive lava traps with damage mechanics and visual effects",
      status: "pending",
      priority: "critical",
      progress: 0,
      assignedTo: "Cody",
      dependencies: ["task-2", "task-3"],
      createdAt: "2023-06-18T09:00:00Z",
      dueDate: "2023-06-23T23:59:59Z",
      tags: ["code", "traps", "gameplay"],
    },
    {
      id: "task-7",
      title: "Design marketing materials",
      description: "Create promotional images and video trailer for the map",
      status: "pending",
      priority: "low",
      progress: 0,
      assignedTo: "MetaBot",
      dependencies: ["task-1", "task-4"],
      createdAt: "2023-06-18T14:20:00Z",
      dueDate: "2023-06-25T23:59:59Z",
      tags: ["marketing", "promotion"],
    },
  ],
  onCreateTask = () => {},
  onViewTask = () => {},
  onEditTask = () => {},
  onDeleteTask = () => {},
  onStatusChange = () => {},
}: TaskBoardProps) => {
  const [viewMode, setViewMode] = useState<"grid" | "list" | "kanban">(
    "kanban",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("dueDate");

  // Get unique assignees from tasks
  const assignees = Array.from(new Set(tasks.map((task) => task.assignedTo)));

  // Filter tasks based on search query and filters
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    const matchesStatus =
      statusFilter === "all" || task.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || task.priority === priorityFilter;
    const matchesAssignee =
      assigneeFilter === "all" || task.assignedTo === assigneeFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesAssignee;
  });

  // Sort tasks based on selected sort option
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case "dueDate":
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      case "priority":
        const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        return (
          priorityOrder[a.priority as keyof typeof priorityOrder] -
          priorityOrder[b.priority as keyof typeof priorityOrder]
        );
      case "status":
        const statusOrder = {
          "in-progress": 0,
          pending: 1,
          blocked: 2,
          completed: 3,
          failed: 4,
        };
        return (
          statusOrder[a.status as keyof typeof statusOrder] -
          statusOrder[b.status as keyof typeof statusOrder]
        );
      case "title":
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  return (
    <Card className="w-full bg-white shadow-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Task Management</CardTitle>
        <div className="flex space-x-2">
          <Button onClick={onCreateTask}>
            <Plus className="mr-2 h-4 w-4" /> New Task
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-6">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search tasks..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Assignee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assignees</SelectItem>
                {assignees.map((assignee) => (
                  <SelectItem key={assignee} value={assignee}>
                    {assignee}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[130px]">
                <SortDesc className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dueDate">Due Date</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="status">Status</SelectItem>
                <SelectItem value="title">Title</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center rounded-md border p-1">
              <Button
                variant={viewMode === "kanban" ? "default" : "ghost"}
                size="sm"
                className="h-8 px-2"
                onClick={() => setViewMode("kanban")}
              >
                <Calendar className="h-4 w-4 mr-1" />
                Kanban
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                className="h-8 px-2"
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="h-4 w-4 mr-1" />
                Grid
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                className="h-8 px-2"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4 mr-1" />
                List
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-4">
          {filteredTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-md">
              <p className="text-gray-500 mb-2">
                No tasks found matching your criteria
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                  setPriorityFilter("all");
                  setAssigneeFilter("all");
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : viewMode === "kanban" ? (
            <TaskKanban
              tasks={sortedTasks}
              onViewTask={onViewTask}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
              onStatusChange={onStatusChange}
            />
          ) : viewMode === "list" ? (
            <TaskList
              tasks={sortedTasks}
              onViewTask={onViewTask}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
              onStatusChange={onStatusChange}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onView={onViewTask}
                  onEdit={onEditTask}
                  onDelete={onDeleteTask}
                  onStatusChange={onStatusChange}
                />
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskBoard;
