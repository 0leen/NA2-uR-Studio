import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  ChevronDown,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowUpDown,
  Link,
} from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed" | "failed";
  priority: "low" | "medium" | "high";
  assignedTo: string;
  dependencies: string[];
  createdAt: string;
  dueDate: string;
}

interface TaskManagementProps {
  tasks?: Task[];
  onCreateTask?: () => void;
  onEditTask?: (taskId: string) => void;
  onDeleteTask?: (taskId: string) => void;
  onAssignTask?: (taskId: string, agentId: string) => void;
  onUpdateTaskStatus?: (taskId: string, status: string) => void;
}

const TaskManagement = ({
  tasks = [
    {
      id: "task-1",
      title: "Design game map layout",
      description: "Create the initial layout for the UEFN game map",
      status: "completed",
      priority: "high",
      assignedTo: "Yui",
      dependencies: [],
      createdAt: "2023-06-15T10:30:00Z",
      dueDate: "2023-06-18T23:59:59Z",
    },
    {
      id: "task-2",
      title: "Implement player movement mechanics",
      description: "Code the basic player movement and physics",
      status: "in-progress",
      priority: "high",
      assignedTo: "Cody",
      dependencies: ["task-1"],
      createdAt: "2023-06-16T09:15:00Z",
      dueDate: "2023-06-20T23:59:59Z",
    },
    {
      id: "task-3",
      title: "Create game assets list",
      description: "Compile a list of required game assets for the map",
      status: "pending",
      priority: "medium",
      assignedTo: "MetaBot",
      dependencies: ["task-1"],
      createdAt: "2023-06-16T14:45:00Z",
      dueDate: "2023-06-19T23:59:59Z",
    },
    {
      id: "task-4",
      title: "Design UI elements",
      description: "Create UI mockups for the game interface",
      status: "pending",
      priority: "medium",
      assignedTo: "Yui",
      dependencies: [],
      createdAt: "2023-06-17T11:20:00Z",
      dueDate: "2023-06-21T23:59:59Z",
    },
    {
      id: "task-5",
      title: "Implement game scoring system",
      description: "Code the scoring and achievement system",
      status: "pending",
      priority: "low",
      assignedTo: "Cody",
      dependencies: ["task-2"],
      createdAt: "2023-06-17T16:30:00Z",
      dueDate: "2023-06-22T23:59:59Z",
    },
  ],
  onCreateTask = () => {},
  onEditTask = () => {},
  onDeleteTask = () => {},
  onAssignTask = () => {},
  onUpdateTaskStatus = () => {},
}: TaskManagementProps) => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false);

  // Filter tasks based on active tab and search query
  const filteredTasks = tasks.filter((task) => {
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "pending" && task.status === "pending") ||
      (activeTab === "in-progress" && task.status === "in-progress") ||
      (activeTab === "completed" && task.status === "completed") ||
      (activeTab === "failed" && task.status === "failed");

    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
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

  return (
    <Card className="w-full bg-white shadow-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Task Management</CardTitle>
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
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Dialog
            open={isNewTaskDialogOpen}
            onOpenChange={setIsNewTaskDialogOpen}
          >
            <DialogTrigger asChild>
              <Button onClick={onCreateTask}>
                <Plus className="mr-2 h-4 w-4" /> New Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {/* Task creation form would go here */}
                <p className="text-sm text-gray-500">
                  Task creation form placeholder - would include fields for
                  title, description, priority, dependencies, etc.
                </p>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsNewTaskDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={() => setIsNewTaskDialogOpen(false)}>
                  Create Task
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-5 mb-4">
            <TabsTrigger value="all">All Tasks</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="failed">Failed</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <TaskTable
              tasks={filteredTasks}
              getStatusBadge={getStatusBadge}
              getPriorityBadge={getPriorityBadge}
              getStatusIcon={getStatusIcon}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
              onAssignTask={onAssignTask}
              onUpdateTaskStatus={onUpdateTaskStatus}
            />
          </TabsContent>
          <TabsContent value="pending" className="space-y-4">
            <TaskTable
              tasks={filteredTasks}
              getStatusBadge={getStatusBadge}
              getPriorityBadge={getPriorityBadge}
              getStatusIcon={getStatusIcon}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
              onAssignTask={onAssignTask}
              onUpdateTaskStatus={onUpdateTaskStatus}
            />
          </TabsContent>
          <TabsContent value="in-progress" className="space-y-4">
            <TaskTable
              tasks={filteredTasks}
              getStatusBadge={getStatusBadge}
              getPriorityBadge={getPriorityBadge}
              getStatusIcon={getStatusIcon}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
              onAssignTask={onAssignTask}
              onUpdateTaskStatus={onUpdateTaskStatus}
            />
          </TabsContent>
          <TabsContent value="completed" className="space-y-4">
            <TaskTable
              tasks={filteredTasks}
              getStatusBadge={getStatusBadge}
              getPriorityBadge={getPriorityBadge}
              getStatusIcon={getStatusIcon}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
              onAssignTask={onAssignTask}
              onUpdateTaskStatus={onUpdateTaskStatus}
            />
          </TabsContent>
          <TabsContent value="failed" className="space-y-4">
            <TaskTable
              tasks={filteredTasks}
              getStatusBadge={getStatusBadge}
              getPriorityBadge={getPriorityBadge}
              getStatusIcon={getStatusIcon}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
              onAssignTask={onAssignTask}
              onUpdateTaskStatus={onUpdateTaskStatus}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

interface TaskTableProps {
  tasks: Task[];
  getStatusBadge: (status: string) => React.ReactNode;
  getPriorityBadge: (priority: string) => React.ReactNode;
  getStatusIcon: (status: string) => React.ReactNode;
  onEditTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onAssignTask: (taskId: string, agentId: string) => void;
  onUpdateTaskStatus: (taskId: string, status: string) => void;
}

const TaskTable = ({
  tasks,
  getStatusBadge,
  getPriorityBadge,
  getStatusIcon,
  onEditTask,
  onDeleteTask,
  onAssignTask,
  onUpdateTaskStatus,
}: TaskTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">
              <div className="flex items-center space-x-1">
                <span>Task</span>
                <ArrowUpDown className="h-3 w-3" />
              </div>
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead>Dependencies</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                No tasks found. Create a new task to get started.
              </TableCell>
            </TableRow>
          ) : (
            tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <div className="font-medium">{task.title}</div>
                    <div className="text-xs text-gray-500 truncate max-w-[280px]">
                      {task.description}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    {getStatusIcon(task.status)}
                    <span>{getStatusBadge(task.status)}</span>
                  </div>
                </TableCell>
                <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                <TableCell>{task.assignedTo}</TableCell>
                <TableCell>
                  {task.dependencies.length > 0 ? (
                    <div className="flex items-center space-x-1">
                      <Link className="h-3 w-3 text-gray-500" />
                      <span className="text-xs">
                        {task.dependencies.length} dependencies
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-500">None</span>
                  )}
                </TableCell>
                <TableCell>
                  {new Date(task.dueDate).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEditTask(task.id)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Task
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <ChevronDown className="mr-2 h-4 w-4" />
                        Change Status
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => onDeleteTask(task.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Task
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TaskManagement;
