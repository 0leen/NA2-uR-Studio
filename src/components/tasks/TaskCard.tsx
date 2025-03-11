import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import {
  Clock,
  CheckCircle,
  AlertCircle,
  Link as LinkIcon,
  Calendar,
  User,
  ArrowRight,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed" | "failed" | "blocked";
  priority: "low" | "medium" | "high" | "critical";
  progress: number;
  assignedTo: string;
  dependencies: string[];
  createdAt: string;
  dueDate: string;
  tags: string[];
  errorLog?: { code: string; message: string }[];
}

interface TaskCardProps {
  task: Task;
  onView?: (taskId: string) => void;
  onEdit?: (taskId: string) => void;
  onDelete?: (taskId: string) => void;
  onStatusChange?: (taskId: string, status: Task["status"]) => void;
  compact?: boolean;
}

const TaskCard = ({
  task,
  onView = () => {},
  onEdit = () => {},
  onDelete = () => {},
  onStatusChange = () => {},
  compact = false,
}: TaskCardProps) => {
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
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

  // Determine if task is overdue
  const isOverdue = () => {
    const now = new Date();
    const due = new Date(task.dueDate);
    return now > due && task.status !== "completed";
  };

  if (compact) {
    return (
      <Card
        className={`w-full bg-white shadow-sm hover:shadow-md transition-shadow ${isOverdue() ? "border-red-300" : ""}`}
      >
        <CardHeader className="p-3 pb-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium truncate">
              {task.title}
            </CardTitle>
            {getStatusBadge(task.status)}
          </div>
        </CardHeader>
        <CardContent className="p-3 pt-2">
          <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
            <div className="flex items-center">
              <User className="h-3 w-3 mr-1" />
              <span>{task.assignedTo}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              <span className={isOverdue() ? "text-red-500 font-medium" : ""}>
                {formatDate(task.dueDate)}
              </span>
            </div>
          </div>
          {task.status === "in-progress" && (
            <Progress value={task.progress} className="h-1 mt-1" />
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={`w-full bg-white shadow-md hover:shadow-lg transition-shadow ${isOverdue() ? "border-red-300" : ""}`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold">{task.title}</CardTitle>
          {getStatusBadge(task.status)}
        </div>
        <CardDescription className="line-clamp-2">
          {task.description}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Priority</p>
            {getPriorityBadge(task.priority)}
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Assigned To</p>
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1 text-gray-500" />
              <span>{task.assignedTo}</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Due Date</p>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1 text-gray-500" />
              <span className={isOverdue() ? "text-red-500 font-medium" : ""}>
                {formatDate(task.dueDate)}
              </span>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Dependencies</p>
            {task.dependencies.length > 0 ? (
              <div className="flex items-center">
                <LinkIcon className="h-4 w-4 mr-1 text-gray-500" />
                <span>{task.dependencies.length} tasks</span>
              </div>
            ) : (
              <span className="text-xs text-gray-500">None</span>
            )}
          </div>
        </div>

        {task.status === "in-progress" && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-500">Progress</span>
              <span className="text-xs font-medium">{task.progress}%</span>
            </div>
            <Progress value={task.progress} className="h-2" />
          </div>
        )}

        {task.status === "blocked" &&
          task.errorLog &&
          task.errorLog.length > 0 && (
            <div className="mb-4 p-2 bg-amber-50 rounded-md border border-amber-200">
              <p className="text-xs font-medium text-amber-800 mb-1">
                Blocking Issues:
              </p>
              <ul className="text-xs text-amber-800">
                {task.errorLog.map((error, index) => (
                  <li key={index} className="flex items-start">
                    <AlertCircle className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                    <span>
                      <span className="font-medium">{error.code}:</span>{" "}
                      {error.message}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

        {task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {task.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between pt-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onView(task.id)}
              >
                View Details
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View complete task details</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(task.id)}
            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
          >
            Edit
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => {
              const nextStatus = getNextStatus(task.status);
              if (nextStatus) onStatusChange(task.id, nextStatus);
            }}
            disabled={task.status === "completed" || task.status === "failed"}
          >
            {getNextStatusLabel(task.status)}
            {task.status !== "completed" && task.status !== "failed" && (
              <ArrowRight className="ml-1 h-4 w-4" />
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

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
      return "Complete";
    case "blocked":
      return "Unblock";
    case "completed":
      return "Completed";
    case "failed":
      return "Failed";
    default:
      return "Update";
  }
};

export default TaskCard;
