import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import {
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  Code,
  FileText,
  Palette,
  PieChart,
  Plus,
  RefreshCw,
  Settings,
} from "lucide-react";

import TaskManagement from "./TaskManagement";
import AgentGrid from "../agents/AgentGrid";
import WorkflowVisualization from "../workflow/WorkflowVisualization";
import AssetLibrary from "../assets/AssetLibrary";

interface ProjectStats {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  pendingTasks: number;
  failedTasks: number;
}

interface OrchestratorPanelProps {
  projectName?: string;
  projectDescription?: string;
  projectStats?: ProjectStats;
  lastUpdated?: string;
  onRefresh?: () => void;
  onSettings?: () => void;
}

const OrchestratorPanel = ({
  projectName = "UEFN Battle Royale Map",
  projectDescription = "A dynamic battle royale map with multiple biomes and interactive elements",
  projectStats = {
    totalTasks: 25,
    completedTasks: 8,
    inProgressTasks: 5,
    pendingTasks: 10,
    failedTasks: 2,
  },
  lastUpdated = "2023-06-28T14:30:00Z",
  onRefresh = () => {},
  onSettings = () => {},
}: OrchestratorPanelProps) => {
  const [activeTab, setActiveTab] = useState("dashboard");

  // Calculate completion percentage
  const completionPercentage = Math.round(
    (projectStats.completedTasks / projectStats.totalTasks) * 100,
  );

  // Format the last updated date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex h-full w-full flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b p-4">
        <div>
          <h1 className="text-2xl font-bold">{projectName}</h1>
          <p className="text-sm text-gray-500">{projectDescription}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={onSettings}>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
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
              value="dashboard"
              className="data-[state=active]:bg-white"
            >
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="tasks" className="data-[state=active]:bg-white">
              Tasks
            </TabsTrigger>
            <TabsTrigger
              value="agents"
              className="data-[state=active]:bg-white"
            >
              Agents
            </TabsTrigger>
            <TabsTrigger
              value="workflow"
              className="data-[state=active]:bg-white"
            >
              Workflow
            </TabsTrigger>
            <TabsTrigger
              value="assets"
              className="data-[state=active]:bg-white"
            >
              Assets
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Dashboard Tab */}
        <TabsContent
          value="dashboard"
          className="flex-1 overflow-auto p-4 data-[state=active]:flex-1"
        >
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Project Stats Cards */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Tasks
                </CardTitle>
                <FileText className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {projectStats.totalTasks}
                </div>
                <p className="text-xs text-gray-500">
                  Project completion: {completionPercentage}%
                </p>
                <Progress value={completionPercentage} className="mt-2 h-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Completed Tasks
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {projectStats.completedTasks}
                </div>
                <p className="text-xs text-gray-500">
                  {Math.round(
                    (projectStats.completedTasks / projectStats.totalTasks) *
                      100,
                  )}
                  % of total tasks
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  In Progress Tasks
                </CardTitle>
                <Clock className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {projectStats.inProgressTasks}
                </div>
                <p className="text-xs text-gray-500">
                  {Math.round(
                    (projectStats.inProgressTasks / projectStats.totalTasks) *
                      100,
                  )}
                  % of total tasks
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Tasks
                </CardTitle>
                <Clock className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {projectStats.pendingTasks}
                </div>
                <p className="text-xs text-gray-500">
                  {Math.round(
                    (projectStats.pendingTasks / projectStats.totalTasks) * 100,
                  )}
                  % of total tasks
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Agent Status Overview */}
          <div className="mt-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Agent Status</h2>
              <Button variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Agent
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center space-x-3 pb-2">
                  <div className="h-8 w-8 overflow-hidden rounded-full bg-blue-100">
                    <img
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=cody"
                      alt="Cody avatar"
                      className="h-full w-full"
                    />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-medium">Cody</CardTitle>
                    <div className="flex items-center space-x-1">
                      <Code className="h-3 w-3 text-blue-500" />
                      <span className="text-xs text-gray-500">Code Agent</span>
                    </div>
                  </div>
                  <Badge className="ml-auto" variant="default">
                    Working
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-xs">
                    <div className="mb-1 flex justify-between">
                      <span>Current Task:</span>
                      <span className="font-medium">
                        Implement player movement
                      </span>
                    </div>
                    <Progress value={65} className="h-1" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center space-x-3 pb-2">
                  <div className="h-8 w-8 overflow-hidden rounded-full bg-purple-100">
                    <img
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=yui"
                      alt="Yui avatar"
                      className="h-full w-full"
                    />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-medium">Yui</CardTitle>
                    <div className="flex items-center space-x-1">
                      <Palette className="h-3 w-3 text-purple-500" />
                      <span className="text-xs text-gray-500">UI/UX Agent</span>
                    </div>
                  </div>
                  <Badge className="ml-auto" variant="secondary">
                    Idle
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-xs">
                    <div className="mb-1 flex justify-between">
                      <span>Last Task:</span>
                      <span className="font-medium">Design main menu</span>
                    </div>
                    <div className="text-gray-500">
                      Ready for new assignment
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center space-x-3 pb-2">
                  <div className="h-8 w-8 overflow-hidden rounded-full bg-amber-100">
                    <img
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=metabot"
                      alt="MetaBot avatar"
                      className="h-full w-full"
                    />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-medium">
                      MetaBot
                    </CardTitle>
                    <div className="flex items-center space-x-1">
                      <FileText className="h-3 w-3 text-amber-500" />
                      <span className="text-xs text-gray-500">
                        Content Agent
                      </span>
                    </div>
                  </div>
                  <Badge className="ml-auto" variant="destructive">
                    Error
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-xs">
                    <div className="mb-1 flex justify-between">
                      <span>Current Task:</span>
                      <span className="font-medium">
                        Generate game narrative
                      </span>
                    </div>
                    <div className="text-red-500">
                      Error: Insufficient context parameters
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Project Timeline */}
          <div className="mt-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Project Timeline</h2>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Calendar className="mr-2 h-4 w-4" />
                  View Calendar
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-gray-500" />
                    <span className="font-medium">Project Progress</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Last updated: {formatDate(lastUpdated)}
                  </div>
                </div>

                <div className="mt-4 h-32 w-full bg-gray-100 p-4 text-center">
                  <PieChart className="mx-auto h-16 w-16 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">
                    Timeline visualization placeholder
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tasks Tab */}
        <TabsContent
          value="tasks"
          className="flex-1 overflow-auto p-4 data-[state=active]:flex-1"
        >
          <TaskManagement />
        </TabsContent>

        {/* Agents Tab */}
        <TabsContent
          value="agents"
          className="flex-1 overflow-auto data-[state=active]:flex-1"
        >
          <AgentGrid />
        </TabsContent>

        {/* Workflow Tab */}
        <TabsContent
          value="workflow"
          className="flex-1 overflow-auto p-4 data-[state=active]:flex-1"
        >
          <WorkflowVisualization />
        </TabsContent>

        {/* Assets Tab */}
        <TabsContent
          value="assets"
          className="flex-1 overflow-auto data-[state=active]:flex-1"
        >
          <AssetLibrary />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrchestratorPanel;
