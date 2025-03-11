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
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Progress } from "../ui/progress";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  Link as LinkIcon,
  User,
  Tag,
  MessageSquare,
  FileText,
  Code,
  Palette,
} from "lucide-react";
import { Task } from "./TaskCard";

interface TaskDetailViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task;
  allTasks?: Task[];
  onEdit: (taskId: string) => void;
  onStatusChange: (taskId: string, status: Task["status"]) => void;
}

const TaskDetailView = ({
  open,
  onOpenChange,
  task,
  allTasks = [],
  onEdit,
  onStatusChange,
}: TaskDetailViewProps) => {
  const [activeTab, setActiveTab] = useState<
    "details" | "comments" | "history"
  >("details");

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  // Helper function to get status badge
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
      case "blocked":
        return (
          <Badge
            variant="outline"
            className="bg-amber-100 text-amber-800 flex items-center gap-1"
          >
            <AlertCircle className="h-3 w-3" /> Blocked
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Helper function to get priority badge
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "critical":
        return <Badge className="bg-red-600">Critical</Badge>;
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

  // Helper function to get agent icon
  const getAgentIcon = (agentName: string) => {
    switch (agentName.toLowerCase()) {
      case "cody":
        return <Code className="h-4 w-4 text-blue-500" />;
      case "yui":
        return <Palette className="h-4 w-4 text-purple-500" />;
      case "metabot":
        return <FileText className="h-4 w-4 text-amber-500" />;
      default:
        return <User className="h-4 w-4 text-gray-500" />;
    }
  };

  // Find dependency tasks
  const dependencyTasks = task.dependencies
    .map((depId) => allTasks.find((t) => t.id === depId))
    .filter(Boolean) as Task[];

  // Find dependent tasks (tasks that depend on this one)
  const dependentTasks = allTasks.filter((t) =>
    t.dependencies.includes(task.id),
  );

  // Helper function to determine the next status in the workflow
  const getNextStatus = (currentStatus: string): Task["status"] | null => {
    switch (currentStatus) {
      case "pending":
        return "in-progress";
      case "in-progress":
        return "completed";
      case "blocked":
        return "in-progress";
      default:
        return null;
    }
  };

  // Helper function to get the label for the next status button
  const getNextStatusLabel = (currentStatus: string): string => {
    switch (currentStatus) {
      case "pending":
        return "Start Task";
      case "in-progress":
        return "Mark as Completed";
      case "blocked":
        return "Unblock Task";
      case "completed":
        return "Completed";
      case "failed":
        return "Failed";
      default:
        return "Update Status";
    }
  };

  // Determine if task is overdue
  const isOverdue = () => {
    const now = new Date();
    const due = new Date(task.dueDate);
    return now > due && task.status !== "completed";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">
              {task.title}
            </DialogTitle>
            {getStatusBadge(task.status)}
          </div>
          <DialogDescription>
            Task ID: {task.id} • Created: {formatDate(task.createdAt)}
          </DialogDescription>
        </DialogHeader>

        <div className="flex border-b mb-4">
          <button
            className={`px-4 py-2 font-medium text-sm ${activeTab === "details" ? "border-b-2 border-primary text-primary" : "text-gray-500"}`}
            onClick={() => setActiveTab("details")}
          >
            Details
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${activeTab === "comments" ? "border-b-2 border-primary text-primary" : "text-gray-500"}`}
            onClick={() => setActiveTab("comments")}
          >
            Comments
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${activeTab === "history" ? "border-b-2 border-primary text-primary" : "text-gray-500"}`}
            onClick={() => setActiveTab("history")}
          >
            History
          </button>
        </div>

        {activeTab === "details" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Description
              </h3>
              <p className="text-sm">{task.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Status
                </h3>
                <div className="flex items-center">
                  {getStatusBadge(task.status)}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Priority
                </h3>
                <div className="flex items-center">
                  {getPriorityBadge(task.priority)}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Assigned To
                </h3>
                <div className="flex items-center space-x-2">
                  {getAgentIcon(task.assignedTo)}
                  <span>{task.assignedTo}</span>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Due Date
                </h3>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <span
                    className={isOverdue() ? "text-red-500 font-medium" : ""}
                  >
                    {formatDate(task.dueDate)}
                  </span>
                </div>
              </div>
            </div>

            {task.status === "in-progress" && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Progress
                </h3>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">{task.progress}% Complete</span>
                </div>
                <Progress value={task.progress} className="h-2" />
              </div>
            )}

            {task.status === "blocked" &&
              task.errorLog &&
              task.errorLog.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Blocking Issues
                  </h3>
                  <div className="p-3 bg-amber-50 rounded-md border border-amber-200">
                    <ul className="space-y-2">
                      {task.errorLog.map((error, index) => (
                        <li key={index} className="flex items-start">
                          <AlertCircle className="h-4 w-4 mr-2 mt-0.5 text-amber-600 flex-shrink-0" />
                          <div>
                            <span className="font-medium">{error.code}:</span>{" "}
                            {error.message}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Dependencies
              </h3>
              {dependencyTasks.length > 0 ? (
                <div className="space-y-2">
                  {dependencyTasks.map((depTask) => (
                    <div
                      key={depTask.id}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-md border"
                    >
                      <div className="flex items-center space-x-2">
                        <LinkIcon className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{depTask.title}</span>
                      </div>
                      {getStatusBadge(depTask.status)}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No dependencies</p>
              )}
            </div>

            {dependentTasks.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Dependent Tasks
                </h3>
                <div className="space-y-2">
                  {dependentTasks.map((depTask) => (
                    <div
                      key={depTask.id}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-md border"
                    >
                      <div className="flex items-center space-x-2">
                        <LinkIcon className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{depTask.title}</span>
                      </div>
                      {getStatusBadge(depTask.status)}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {task.tags.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Tags</h3>
                <div className="flex flex-wrap gap-1">
                  {task.tags.map((tag, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-gray-100 px-2 py-1 rounded-full text-xs"
                    >
                      <Tag className="h-3 w-3 mr-1 text-gray-500" />
                      {tag}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "comments" && (
          <div className="min-h-[300px] flex items-center justify-center">
            <div className="text-center text-gray-500">
              <MessageSquare className="h-10 w-10 mx-auto mb-2 text-gray-300" />
              <p>Comments feature coming soon</p>
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div className="min-h-[300px] flex items-center justify-center">
            <div className="text-center text-gray-500">
              <Clock className="h-10 w-10 mx-auto mb-2 text-gray-300" />
              <p>Task history feature coming soon</p>
            </div>
          </div>
        )}

        <Separator className="my-4" />

        <DialogFooter className="flex items-center justify-between sm:justify-between">
          <Button variant="outline" onClick={() => onEdit(task.id)}>
            Edit Task
          </Button>
          <Button
            onClick={() => {
              const nextStatus = getNextStatus(task.status);
              if (nextStatus) {
                onStatusChange(task.id, nextStatus);
                onOpenChange(false);
              }
            }}
            disabled={task.status === "completed" || task.status === "failed"}
          >
            {getNextStatusLabel(task.status)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailView;
