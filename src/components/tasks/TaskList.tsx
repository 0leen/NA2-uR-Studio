import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Clock,
  CheckCircle,
  AlertCircle,
  Link as LinkIcon,
  MoreVertical,
  Edit,
  Eye,
  Trash2,
  ArrowRight,
  ArrowUpDown,
} from "lucide-react";
import { Task } from "./TaskCard";

interface TaskListProps {
  tasks: Task[];
  onViewTask: (taskId: string) => void;
  onEditTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onStatusChange: (taskId: string, status: Task["status"]) => void;
}

const TaskList = ({
  tasks,
  onViewTask,
  onEditTask,
  onDeleteTask,
  onStatusChange,
}: TaskListProps) => {
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
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
  const isOverdue = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    return now > due;
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
        return "Start";
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
            <TableHead>Progress</TableHead>
            <TableHead>Assigned To</TableHead>
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
                    {task.dependencies.length > 0 && (
                      <div className="flex items-center mt-1">
                        <LinkIcon className="h-3 w-3 text-gray-400 mr-1" />
                        <span className="text-xs text-gray-500">
                          {task.dependencies.length} dependencies
                        </span>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(task.status)}</TableCell>
                <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                <TableCell>
                  {task.status === "in-progress" ? (
                    <div className="w-[100px]">
                      <div className="flex justify-between text-xs mb-1">
                        <span>{task.progress}%</span>
                      </div>
                      <Progress value={task.progress} className="h-2" />
                    </div>
                  ) : task.status === "completed" ? (
                    <span className="text-xs text-green-600">100%</span>
                  ) : (
                    <span className="text-xs text-gray-500">-</span>
                  )}
                </TableCell>
                <TableCell>{task.assignedTo}</TableCell>
                <TableCell>
                  <span
                    className={
                      isOverdue(task.dueDate) && task.status !== "completed"
                        ? "text-red-500"
                        : ""
                    }
                  >
                    {formatDate(task.dueDate)}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end items-center space-x-1">
                    {task.status !== "completed" &&
                      task.status !== "failed" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                          onClick={() => {
                            const nextStatus = getNextStatus(task.status);
                            if (nextStatus) onStatusChange(task.id, nextStatus);
                          }}
                        >
                          {getNextStatusLabel(task.status)}
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </Button>
                      )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onViewTask(task.id)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEditTask(task.id)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Task
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
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TaskList;
