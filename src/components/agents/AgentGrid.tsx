import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { Plus, Filter, Search } from "lucide-react";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import AgentCard from "./AgentCard";

interface Agent {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: "idle" | "working" | "error";
  tasks: {
    id: string;
    title: string;
    status: "pending" | "in-progress" | "completed" | "failed";
    progress: number;
    description: string;
  }[];
  output: string;
}

interface AgentGridProps {
  agents?: Agent[];
  onAddAgent?: () => void;
  onAssignTask?: (agentId: string) => void;
  onViewOutput?: (agentId: string) => void;
}

const AgentGrid = ({
  agents = [
    {
      id: "1",
      name: "Cody",
      role: "Code Agent",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=cody",
      status: "working",
      tasks: [
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
      ],
      output:
        "function PlayerMovement() {\n  // Movement code implementation\n  const speed = 5.0;\n  // More code...\n}",
    },
    {
      id: "2",
      name: "Yui",
      role: "UI/UX Agent",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=yui",
      status: "idle",
      tasks: [
        {
          id: "3",
          title: "Design main menu",
          status: "completed",
          progress: 100,
          description: "Create the main menu interface for the game",
        },
        {
          id: "4",
          title: "Create HUD elements",
          status: "pending",
          progress: 0,
          description: "Design heads-up display elements for gameplay",
        },
      ],
      output:
        '<div className="main-menu">\n  <h1>UEFN Game Title</h1>\n  <button>Start Game</button>\n  <button>Options</button>\n</div>',
    },
    {
      id: "3",
      name: "MetaBot",
      role: "Content Agent",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=metabot",
      status: "error",
      tasks: [
        {
          id: "5",
          title: "Generate game narrative",
          status: "failed",
          progress: 30,
          description: "Create storyline and character backgrounds",
        },
        {
          id: "6",
          title: "Design level layouts",
          status: "pending",
          progress: 0,
          description: "Create level designs and environment layouts",
        },
      ],
      output:
        "Error: Unable to generate narrative content due to insufficient context parameters.",
    },
  ],
  onAddAgent = () => {},
  onAssignTask = () => {},
  onViewOutput = () => {},
}: AgentGridProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Filter agents based on search query and status filter
  const filteredAgents = agents.filter((agent) => {
    const matchesSearch =
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.role.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || agent.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="w-full bg-gray-50 p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">AI Agents</h2>
        <Button onClick={onAddAgent}>
          <Plus className="mr-2 h-4 w-4" />
          Add Agent
        </Button>
      </div>

      <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search agents..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="idle">Idle</SelectItem>
              <SelectItem value="working">Working</SelectItem>
              <SelectItem value="error">Error</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="grid" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="w-full">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredAgents.map((agent) => (
              <AgentCard
                key={agent.id}
                name={agent.name}
                role={agent.role}
                avatar={agent.avatar}
                status={agent.status}
                tasks={agent.tasks}
                output={agent.output}
                onAssignTask={() => onAssignTask(agent.id)}
                onViewOutput={() => onViewOutput(agent.id)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="list" className="w-full">
          <div className="space-y-4">
            {filteredAgents.map((agent) => (
              <div
                key={agent.id}
                className="flex items-center justify-between rounded-lg border bg-white p-4 shadow-sm"
              >
                <div className="flex items-center space-x-4">
                  <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gray-100">
                    <img
                      src={agent.avatar}
                      alt={`${agent.name} avatar`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">{agent.name}</h3>
                    <p className="text-sm text-gray-500">{agent.role}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onAssignTask(agent.id)}
                  >
                    Assign Task
                  </Button>
                  <Button size="sm" onClick={() => onViewOutput(agent.id)}>
                    View Output
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {filteredAgents.length === 0 && (
        <div className="mt-10 flex flex-col items-center justify-center rounded-lg border border-dashed p-10 text-center">
          <p className="text-lg font-medium">No agents found</p>
          <p className="text-sm text-gray-500">
            Try adjusting your search or filter criteria
          </p>
          <Button
            className="mt-4"
            variant="outline"
            onClick={() => {
              setSearchQuery("");
              setStatusFilter("all");
            }}
          >
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default AgentGrid;
