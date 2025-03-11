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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import {
  Search,
  Filter,
  Plus,
  ArrowRight,
  ArrowDown,
  MoreVertical,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  AlertCircle,
  Clock,
  CheckCircle,
  Edit,
  Trash2,
  MoveHorizontal,
  Link,
  Unlink,
} from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed" | "failed";
  priority: "low" | "medium" | "high";
  assignedTo: string;
  dependencies: string[];
  dependents: string[];
}

interface WorkflowVisualizationProps {
  tasks?: Task[];
  onTaskClick?: (taskId: string) => void;
  onAddTask?: () => void;
  onEditTask?: (taskId: string) => void;
  onDeleteTask?: (taskId: string) => void;
  onAddDependency?: (taskId: string, dependencyId: string) => void;
  onRemoveDependency?: (taskId: string, dependencyId: string) => void;
  onReorderTask?: (taskId: string, newPosition: number) => void;
}

const WorkflowVisualization = ({
  tasks = [
    {
      id: "task-1",
      title: "Design game map layout",
      description: "Create the initial layout for the UEFN game map",
      status: "completed",
      priority: "high",
      assignedTo: "Yui",
      dependencies: [],
      dependents: ["task-2", "task-3"],
    },
    {
      id: "task-2",
      title: "Implement player movement mechanics",
      description: "Code the basic player movement and physics",
      status: "in-progress",
      priority: "high",
      assignedTo: "Cody",
      dependencies: ["task-1"],
      dependents: ["task-5"],
    },
    {
      id: "task-3",
      title: "Create game assets list",
      description: "Compile a list of required game assets for the map",
      status: "pending",
      priority: "medium",
      assignedTo: "MetaBot",
      dependencies: ["task-1"],
      dependents: [],
    },
    {
      id: "task-4",
      title: "Design UI elements",
      description: "Create UI mockups for the game interface",
      status: "pending",
      priority: "medium",
      assignedTo: "Yui",
      dependencies: [],
      dependents: [],
    },
    {
      id: "task-5",
      title: "Implement game scoring system",
      description: "Code the scoring and achievement system",
      status: "pending",
      priority: "low",
      assignedTo: "Cody",
      dependencies: ["task-2"],
      dependents: [],
    },
  ],
  onTaskClick = () => {},
  onAddTask = () => {},
  onEditTask = () => {},
  onDeleteTask = () => {},
  onAddDependency = () => {},
  onRemoveDependency = () => {},
  onReorderTask = () => {},
}: WorkflowVisualizationProps) => {
  const [viewMode, setViewMode] = useState<"diagram" | "list">("diagram");
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Filter tasks based on search query and status filter
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || task.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Helper function to get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">Pending</Badge>;
      case "in-progress":
        return <Badge variant="default">In Progress</Badge>;
      case "completed":
        return <Badge variant="secondary">Completed</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Helper function to get priority badge
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-500">High</Badge>;
      case "medium":
        return <Badge className="bg-yellow-500">Medium</Badge>;
      case "low":
        return <Badge className="bg-green-500">Low</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Helper function to get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-gray-500" />;
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  // Find a task by ID
  const findTaskById = (id: string) => {
    return tasks.find((task) => task.id === id);
  };

  return (
    <Card className="w-full h-full bg-white shadow-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Workflow Visualization</CardTitle>
        <div className="flex space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search tasks..."
              className="pl-8 w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={onAddTask}>
            <Plus className="mr-2 h-4 w-4" /> Add Task
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue="diagram"
          value={viewMode}
          onValueChange={(value) => setViewMode(value as "diagram" | "list")}
          className="w-full"
        >
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="diagram">Diagram View</TabsTrigger>
              <TabsTrigger value="list">List View</TabsTrigger>
            </TabsList>

            {viewMode === "diagram" && (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))}
                  disabled={zoomLevel <= 50}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm">{zoomLevel}%</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setZoomLevel(Math.min(150, zoomLevel + 10))}
                  disabled={zoomLevel >= 150}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setZoomLevel(100)}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <TabsContent value="diagram" className="w-full">
            <div
              className="relative border rounded-md p-6 overflow-auto bg-gray-50"
              style={{ height: "600px" }}
            >
              <div
                className="relative"
                style={{
                  transform: `scale(${zoomLevel / 100})`,
                  transformOrigin: "top left",
                  width: "fit-content",
                  minWidth: "100%",
                  height: "fit-content",
                  minHeight: "100%",
                }}
              >
                {/* Render task nodes and connections */}
                <div className="flex flex-col space-y-8">
                  {/* Tasks with no dependencies (root tasks) */}
                  <div className="flex space-x-8">
                    {filteredTasks
                      .filter((task) => task.dependencies.length === 0)
                      .map((task) => (
                        <TaskNode
                          key={task.id}
                          task={task}
                          getStatusBadge={getStatusBadge}
                          getPriorityBadge={getPriorityBadge}
                          getStatusIcon={getStatusIcon}
                          onClick={() => onTaskClick(task.id)}
                          onEdit={() => onEditTask(task.id)}
                          onDelete={() => onDeleteTask(task.id)}
                        />
                      ))}
                  </div>

                  {/* Tasks with dependencies */}
                  <div className="flex space-x-8">
                    {filteredTasks
                      .filter((task) => task.dependencies.length > 0)
                      .map((task) => (
                        <div key={task.id} className="relative">
                          {/* Draw connections to dependencies */}
                          {task.dependencies.map((depId) => {
                            const depTask = findTaskById(depId);
                            return (
                              depTask && (
                                <div
                                  key={`${task.id}-${depId}`}
                                  className="absolute -top-8 left-1/2 transform -translate-x-1/2"
                                >
                                  <div className="flex flex-col items-center">
                                    <ArrowDown className="h-6 w-6 text-gray-400" />
                                    <div className="text-xs text-gray-500">
                                      Depends on
                                    </div>
                                  </div>
                                </div>
                              )
                            );
                          })}

                          <TaskNode
                            task={task}
                            getStatusBadge={getStatusBadge}
                            getPriorityBadge={getPriorityBadge}
                            getStatusIcon={getStatusIcon}
                            onClick={() => onTaskClick(task.id)}
                            onEdit={() => onEditTask(task.id)}
                            onDelete={() => onDeleteTask(task.id)}
                          />
                        </div>
                      ))}
                  </div>
                </div>

                {/* This is a simplified visualization. In a real implementation, 
                    you would use a proper graph visualization library like react-flow, 
                    cytoscape.js, or d3.js to create a more sophisticated workflow diagram */}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="list" className="w-full">
            <div className="space-y-4">
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <TaskListItem
                    key={task.id}
                    task={task}
                    getStatusBadge={getStatusBadge}
                    getPriorityBadge={getPriorityBadge}
                    getStatusIcon={getStatusIcon}
                    findTaskById={findTaskById}
                    onClick={() => onTaskClick(task.id)}
                    onEdit={() => onEditTask(task.id)}
                    onDelete={() => onDeleteTask(task.id)}
                    onAddDependency={(depId) => onAddDependency(task.id, depId)}
                    onRemoveDependency={(depId) =>
                      onRemoveDependency(task.id, depId)
                    }
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-md">
                  <p className="text-gray-500">No tasks found</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      setSearchQuery("");
                      setStatusFilter("all");
                    }}
                  >
                    Clear filters
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

interface TaskNodeProps {
  task: Task;
  getStatusBadge: (status: string) => React.ReactNode;
  getPriorityBadge: (priority: string) => React.ReactNode;
  getStatusIcon: (status: string) => React.ReactNode;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const TaskNode = ({
  task,
  getStatusBadge,
  getPriorityBadge,
  getStatusIcon,
  onClick,
  onEdit,
  onDelete,
}: TaskNodeProps) => {
  return (
    <div
      className={`w-64 p-4 rounded-md shadow-md cursor-pointer transition-all hover:shadow-lg ${
        task.status === "completed"
          ? "bg-green-50 border border-green-200"
          : task.status === "in-progress"
            ? "bg-blue-50 border border-blue-200"
            : task.status === "failed"
              ? "bg-red-50 border border-red-200"
              : "bg-white border border-gray-200"
      }`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center space-x-2">
          {getStatusIcon(task.status)}
          <span className="font-medium truncate max-w-[150px]">
            {task.title}
          </span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Task
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Task
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="text-xs text-gray-500 mb-3 line-clamp-2">
        {task.description}
      </div>

      <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">Status:</span>
          {getStatusBadge(task.status)}
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">Priority:</span>
          {getPriorityBadge(task.priority)}
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">Assigned to:</span>
          <span className="text-xs font-medium">{task.assignedTo}</span>
        </div>
      </div>

      {(task.dependencies.length > 0 || task.dependents.length > 0) && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          {task.dependencies.length > 0 && (
            <div className="flex items-center mb-1">
              <ArrowDown className="h-3 w-3 text-gray-400 mr-1" />
              <span className="text-xs text-gray-500">
                Dependencies: {task.dependencies.length}
              </span>
            </div>
          )}
          {task.dependents.length > 0 && (
            <div className="flex items-center">
              <ArrowUp className="h-3 w-3 text-gray-400 mr-1" />
              <span className="text-xs text-gray-500">
                Dependents: {task.dependents.length}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface TaskListItemProps {
  task: Task;
  getStatusBadge: (status: string) => React.ReactNode;
  getPriorityBadge: (priority: string) => React.ReactNode;
  getStatusIcon: (status: string) => React.ReactNode;
  findTaskById: (id: string) => Task | undefined;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onAddDependency: (dependencyId: string) => void;
  onRemoveDependency: (dependencyId: string) => void;
}

const TaskListItem = ({
  task,
  getStatusBadge,
  getPriorityBadge,
  getStatusIcon,
  findTaskById,
  onClick,
  onEdit,
  onDelete,
  onAddDependency,
  onRemoveDependency,
}: TaskListItemProps) => {
  return (
    <div
      className={`p-4 rounded-md shadow-sm border cursor-pointer transition-all hover:shadow-md ${
        task.status === "completed"
          ? "bg-green-50 border-green-200"
          : task.status === "in-progress"
            ? "bg-blue-50 border-blue-200"
            : task.status === "failed"
              ? "bg-red-50 border-red-200"
              : "bg-white border-gray-200"
      }`}
      onClick={onClick}
    >
      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                {getStatusIcon(task.status)}
                <h3 className="font-medium">{task.title}</h3>
              </div>
              <p className="text-sm text-gray-500 mb-2">{task.description}</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                  }}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Task
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    // This would open a modal to add dependencies
                    // For now, we'll just simulate adding a dependency
                    onAddDependency("task-1");
                  }}
                >
                  <Link className="mr-2 h-4 w-4" />
                  Add Dependency
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Task
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            {getStatusBadge(task.status)}
            {getPriorityBadge(task.priority)}
            <Badge variant="outline">{task.assignedTo}</Badge>
          </div>
        </div>

        <div className="flex flex-col space-y-2 min-w-[200px]">
          <div>
            <h4 className="text-sm font-medium mb-1">Dependencies</h4>
            {task.dependencies.length > 0 ? (
              <div className="space-y-1">
                {task.dependencies.map((depId) => {
                  const depTask = findTaskById(depId);
                  return (
                    depTask && (
                      <div
                        key={depId}
                        className="flex items-center justify-between bg-gray-100 rounded p-1 text-xs"
                      >
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(depTask.status)}
                          <span className="truncate max-w-[120px]">
                            {depTask.title}
                          </span>
                        </div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onRemoveDependency(depId);
                                }}
                              >
                                <Unlink className="h-3 w-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Remove dependency</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    )
                  );
                })}
              </div>
            ) : (
              <div className="text-xs text-gray-500 italic">None</div>
            )}
          </div>

          <div>
            <h4 className="text-sm font-medium mb-1">Dependents</h4>
            {task.dependents.length > 0 ? (
              <div className="space-y-1">
                {task.dependents.map((depId) => {
                  const depTask = findTaskById(depId);
                  return (
                    depTask && (
                      <div
                        key={depId}
                        className="flex items-center bg-gray-100 rounded p-1 text-xs"
                      >
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(depTask.status)}
                          <span className="truncate max-w-[150px]">
                            {depTask.title}
                          </span>
                        </div>
                      </div>
                    )
                  );
                })}
              </div>
            ) : (
              <div className="text-xs text-gray-500 italic">None</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Missing ArrowUp component
const ArrowUp = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m5 12 7-7 7 7" />
    <path d="M12 19V5" />
  </svg>
);

export default WorkflowVisualization;
