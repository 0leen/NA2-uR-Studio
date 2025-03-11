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
  Code,
  Palette,
  FileText,
} from "lucide-react";

interface Task {
  id: string;
  title: string;
  status: "pending" | "in-progress" | "completed" | "failed";
  progress: number;
  description: string;
}

interface AgentCardProps {
  name?: string;
  role?: string;
  avatar?: string;
  status?: "idle" | "working" | "error";
  tasks?: Task[];
  output?: string;
  onAssignTask?: () => void;
  onViewOutput?: () => void;
}

const AgentCard = ({
  name = "Cody",
  role = "Code Agent",
  avatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=cody",
  status = "idle",
  tasks = [
    {
      id: "1",
      title: "Generate game mechanics",
      status: "completed",
      progress: 100,
      description: "Create core gameplay mechanics for the UEFN map",
    },
    {
      id: "2",
      title: "Implement player movement",
      status: "in-progress",
      progress: 65,
      description: "Code player movement and physics interactions",
    },
    {
      id: "3",
      title: "Create UI elements",
      status: "pending",
      progress: 0,
      description: "Develop UI components for the game interface",
    },
  ],
  output = "function PlayerMovement() {\n  // Movement code implementation\n  const speed = 5.0;\n  // More code...\n}",
  onAssignTask = () => {},
  onViewOutput = () => {},
}: AgentCardProps) => {
  // Helper function to get the appropriate icon based on agent role
  const getAgentIcon = () => {
    switch (role.toLowerCase()) {
      case "code agent":
        return <Code className="h-5 w-5" />;
      case "ui/ux agent":
        return <Palette className="h-5 w-5" />;
      case "content agent":
        return <FileText className="h-5 w-5" />;
      default:
        return <Code className="h-5 w-5" />;
    }
  };

  // Helper function to get status badge color
  const getStatusBadge = () => {
    switch (status) {
      case "idle":
        return <Badge variant="secondary">Idle</Badge>;
      case "working":
        return <Badge variant="default">Working</Badge>;
      case "error":
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="secondary">Idle</Badge>;
    }
  };

  // Helper function to get task status icon
  const getTaskStatusIcon = (taskStatus: string) => {
    switch (taskStatus) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Card className="w-full max-w-md bg-white shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gray-100">
              <img
                src={avatar}
                alt={`${name} avatar`}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <CardTitle className="text-lg font-bold">{name}</CardTitle>
              <CardDescription className="flex items-center space-x-1">
                {getAgentIcon()}
                <span>{role}</span>
              </CardDescription>
            </div>
          </div>
          <div>{getStatusBadge()}</div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="mb-4">
          <h4 className="mb-2 font-medium">Current Tasks</h4>
          <div className="space-y-3">
            {tasks.map((task) => (
              <div key={task.id} className="rounded-md border p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getTaskStatusIcon(task.status)}
                    <span className="font-medium">{task.title}</span>
                  </div>
                  <Badge
                    variant={
                      task.status === "completed"
                        ? "secondary"
                        : task.status === "in-progress"
                          ? "default"
                          : task.status === "failed"
                            ? "destructive"
                            : "outline"
                    }
                  >
                    {task.status.replace("-", " ")}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-gray-500">{task.description}</p>
                {task.status === "in-progress" && (
                  <Progress className="mt-2" value={task.progress} />
                )}
              </div>
            ))}
          </div>
        </div>

        {output && (
          <div>
            <h4 className="mb-2 font-medium">Latest Output</h4>
            <div className="max-h-32 overflow-auto rounded-md bg-gray-100 p-3">
              <pre className="text-xs">{output}</pre>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onAssignTask}>
          Assign Task
        </Button>
        <Button onClick={onViewOutput}>View Output</Button>
      </CardFooter>
    </Card>
  );
};

export default AgentCard;
