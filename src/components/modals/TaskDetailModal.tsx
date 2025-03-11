import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  Link as LinkIcon,
  Plus,
  Trash2,
  User,
  X,
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

interface Agent {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: "idle" | "working" | "error";
}

interface TaskDetailModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  task?: Task;
  agents?: Agent[];
  availableTasks?: Task[];
  onSave?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onAddDependency?: (taskId: string, dependencyId: string) => void;
  onRemoveDependency?: (taskId: string, dependencyId: string) => void;
}

const TaskDetailModal = ({
  open = true,
  onOpenChange = () => {},
  task = {
    id: "task-1",
    title: "Design game map layout",
    description:
      "Create the initial layout for the UEFN game map with multiple biomes and interactive elements.",
    status: "in-progress",
    priority: "high",
    assignedTo: "Yui",
    dependencies: ["task-3"],
    createdAt: "2023-06-15T10:30:00Z",
    dueDate: "2023-06-22T23:59:59Z",
  },
  agents = [
    {
      id: "agent-1",
      name: "Cody",
      role: "Code Agent",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=cody",
      status: "idle",
    },
    {
      id: "agent-2",
      name: "Yui",
      role: "UI/UX Agent",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=yui",
      status: "working",
    },
    {
      id: "agent-3",
      name: "MetaBot",
      role: "Content Agent",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=metabot",
      status: "idle",
    },
  ],
  availableTasks = [
    {
      id: "task-2",
      title: "Implement player movement mechanics",
      description: "Code the basic player movement and physics",
      status: "pending",
      priority: "medium",
      assignedTo: "Cody",
      dependencies: [],
      createdAt: "2023-06-16T09:15:00Z",
      dueDate: "2023-06-20T23:59:59Z",
    },
    {
      id: "task-3",
      title: "Create game assets list",
      description: "Compile a list of required game assets for the map",
      status: "completed",
      priority: "low",
      assignedTo: "MetaBot",
      dependencies: [],
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
  ],
  onSave = () => {},
  onDelete = () => {},
  onAddDependency = () => {},
  onRemoveDependency = () => {},
}: TaskDetailModalProps) => {
  const [editedTask, setEditedTask] = useState<Task>({ ...task });
  const [newDependencyId, setNewDependencyId] = useState<string>("");

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format date for input
  const formatDateForInput = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" /> Pending
          </Badge>
        );
      case "in-progress":
        return (
          <Badge variant="default" className="flex items-center gap-1">
            <Clock className="h-3 w-3" /> In Progress
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" /> Completed
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertCircle className="h-3 w-3" /> Failed
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Get priority badge
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

  // Find a task by ID
  const findTaskById = (id: string) => {
    return availableTasks.find((t) => t.id === id);
  };

  // Handle form changes
  const handleChange = (field: keyof Task, value: string) => {
    setEditedTask((prev) => ({ ...prev, [field]: value }));
  };

  // Handle adding a dependency
  const handleAddDependency = () => {
    if (newDependencyId && !editedTask.dependencies.includes(newDependencyId)) {
      const updatedDependencies = [...editedTask.dependencies, newDependencyId];
      setEditedTask((prev) => ({
        ...prev,
        dependencies: updatedDependencies,
      }));
      onAddDependency(editedTask.id, newDependencyId);
      setNewDependencyId("");
    }
  };

  // Handle removing a dependency
  const handleRemoveDependency = (dependencyId: string) => {
    const updatedDependencies = editedTask.dependencies.filter(
      (id) => id !== dependencyId,
    );
    setEditedTask((prev) => ({ ...prev, dependencies: updatedDependencies }));
    onRemoveDependency(editedTask.id, dependencyId);
  };

  // Handle save
  const handleSave = () => {
    onSave(editedTask);
    onOpenChange(false);
  };

  // Handle delete
  const handleDelete = () => {
    onDelete(editedTask.id);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Task Details</DialogTitle>
          <DialogDescription>
            View and edit task information, dependencies, and assignments.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Task Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Task Information</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={editedTask.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={editedTask.status}
                  onValueChange={(value) =>
                    handleChange("status", value as Task["status"])
                  }
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={editedTask.priority}
                  onValueChange={(value) =>
                    handleChange("priority", value as Task["priority"])
                  }
                >
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="assignedTo">Assigned To</Label>
                <Select
                  value={editedTask.assignedTo}
                  onValueChange={(value) => handleChange("assignedTo", value)}
                >
                  <SelectTrigger id="assignedTo">
                    <SelectValue placeholder="Assign to agent" />
                  </SelectTrigger>
                  <SelectContent>
                    {agents.map((agent) => (
                      <SelectItem key={agent.id} value={agent.name}>
                        <div className="flex items-center">
                          <div className="relative h-5 w-5 overflow-hidden rounded-full mr-2">
                            <img
                              src={agent.avatar}
                              alt={agent.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          {agent.name} ({agent.role})
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <Input
                    id="dueDate"
                    type="date"
                    className="pl-10"
                    value={formatDateForInput(editedTask.dueDate)}
                    onChange={(e) =>
                      handleChange(
                        "dueDate",
                        new Date(e.target.value).toISOString(),
                      )
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Created At</Label>
                <div className="flex h-10 items-center rounded-md border border-input bg-gray-100 px-3 py-2 text-sm">
                  {formatDate(editedTask.createdAt)}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={4}
                value={editedTask.description}
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </div>
          </div>

          <Separator />

          {/* Dependencies */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Dependencies</h3>
            <p className="text-sm text-gray-500">
              Tasks that must be completed before this task can be started.
            </p>

            <div className="flex items-end gap-2">
              <div className="flex-1 space-y-2">
                <Label htmlFor="dependency">Add Dependency</Label>
                <Select
                  value={newDependencyId}
                  onValueChange={setNewDependencyId}
                >
                  <SelectTrigger id="dependency">
                    <SelectValue placeholder="Select a task" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTasks
                      .filter(
                        (t) =>
                          t.id !== editedTask.id &&
                          !editedTask.dependencies.includes(t.id),
                      )
                      .map((task) => (
                        <SelectItem key={task.id} value={task.id}>
                          {task.title}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                type="button"
                onClick={handleAddDependency}
                disabled={!newDependencyId}
              >
                <Plus className="mr-2 h-4 w-4" /> Add
              </Button>
            </div>

            <div className="space-y-2">
              {editedTask.dependencies.length > 0 ? (
                <div className="rounded-md border">
                  {editedTask.dependencies.map((depId) => {
                    const depTask = findTaskById(depId);
                    return (
                      depTask && (
                        <div
                          key={depId}
                          className="flex items-center justify-between border-b p-3 last:border-0"
                        >
                          <div className="flex items-center gap-2">
                            <LinkIcon className="h-4 w-4 text-gray-500" />
                            <div>
                              <div className="font-medium">{depTask.title}</div>
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                {getStatusBadge(depTask.status)}
                                <span>•</span>
                                <span>Due: {formatDate(depTask.dueDate)}</span>
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveDependency(depId)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )
                    );
                  })}
                </div>
              ) : (
                <div className="flex h-20 items-center justify-center rounded-md border border-dashed">
                  <p className="text-sm text-gray-500">
                    No dependencies added yet
                  </p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Assignment Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Assignment Information</h3>

            {editedTask.assignedTo ? (
              <div className="rounded-md border p-4">
                {agents
                  .filter((agent) => agent.name === editedTask.assignedTo)
                  .map((agent) => (
                    <div key={agent.id} className="flex items-center gap-4">
                      <div className="relative h-12 w-12 overflow-hidden rounded-full">
                        <img
                          src={agent.avatar}
                          alt={agent.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium">{agent.name}</div>
                        <div className="text-sm text-gray-500">
                          {agent.role}
                        </div>
                        <Badge
                          variant={
                            agent.status === "working"
                              ? "default"
                              : agent.status === "error"
                                ? "destructive"
                                : "secondary"
                          }
                          className="mt-1"
                        >
                          {agent.status.charAt(0).toUpperCase() +
                            agent.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="flex h-20 items-center justify-center rounded-md border border-dashed">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <User className="h-4 w-4" />
                  <span>No agent assigned</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex items-center justify-between sm:justify-between">
          <Button
            variant="destructive"
            onClick={handleDelete}
            className="gap-1"
          >
            <Trash2 className="h-4 w-4" /> Delete Task
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailModal;
