import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Progress } from "../ui/progress";
import {
  Code,
  FileText,
  Palette,
  MessageSquare,
  Send,
  Cpu,
  Layers,
  Map,
  Zap,
  Terminal,
} from "lucide-react";
import { Task } from "../tasks/TaskCard";

interface UEFNAssistantProps {
  onCreateTask?: (
    task: Omit<Task, "id" | "status" | "progress" | "createdAt" | "errorLog">,
  ) => void;
}

const UEFNAssistant = ({ onCreateTask = () => {} }: UEFNAssistantProps) => {
  // Helper function to analyze prompts for keywords
  const analyzePrompt = (prompt: string): string[] => {
    const lowercasePrompt = prompt.toLowerCase();
    const keywords = [];

    // Check for task-related keywords
    if (lowercasePrompt.includes("create")) keywords.push("create");
    if (lowercasePrompt.includes("task")) keywords.push("task");

    // Check for code-related keywords
    if (lowercasePrompt.includes("verse")) keywords.push("verse");
    if (lowercasePrompt.includes("script")) keywords.push("script");
    if (lowercasePrompt.includes("code")) keywords.push("code");

    // Check for asset-related keywords
    if (lowercasePrompt.includes("asset")) keywords.push("asset");
    if (lowercasePrompt.includes("model")) keywords.push("model");
    if (lowercasePrompt.includes("mesh")) keywords.push("mesh");

    // Check for specific UEFN device keywords
    if (lowercasePrompt.includes("trigger")) keywords.push("trigger");
    if (lowercasePrompt.includes("zone")) keywords.push("zone");
    if (lowercasePrompt.includes("player")) keywords.push("player");
    if (lowercasePrompt.includes("movement")) keywords.push("movement");

    return keywords;
  };
  const [prompt, setPrompt] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversation, setConversation] = useState<
    Array<{ role: "user" | "assistant"; content: string }>
  >([
    {
      role: "assistant",
      content:
        "Hello! I'm your UEFN AI assistant. I can help you with Verse scripting, asset management, and creating tasks for your Fortnite Creative project. How can I assist you today?",
    },
  ]);

  // Process the user prompt
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    // Add user message to conversation
    setConversation((prev) => [...prev, { role: "user", content: prompt }]);

    // Clear input and show processing state
    const userPrompt = prompt;
    setPrompt("");
    setIsProcessing(true);

    // Analyze the prompt for keywords
    const keywords = analyzePrompt(userPrompt);

    // Simulate AI processing
    setTimeout(() => {
      let response = "";
      let shouldCreateTask = false;
      let taskData = {
        title: "",
        description: "",
        priority: "medium" as const,
        assignedTo: "Cody",
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
        dependencies: [],
        tags: [],
      };

      // Use the analyzed keywords for more intelligent responses
      if (keywords.includes("create") && keywords.includes("task")) {
        // Extract task information from prompt
        const titleMatch = userPrompt.match(
          /create\s+(?:a\s+)?task\s+(?:to\s+)?([^.]+)/i,
        );
        const title = titleMatch ? titleMatch[1].trim() : "New UEFN Task";

        response = `I've created a task for "${title}". Would you like me to add more details or assign it to a specific agent?`;

        taskData = {
          ...taskData,
          title,
          description: userPrompt,
          tags: ["uefn", "verse"],
        };

        shouldCreateTask = true;
      } else if (
        keywords.includes("verse") ||
        keywords.includes("script") ||
        keywords.includes("code")
      ) {
        response =
          'Here\'s a sample Verse script for your request:\n\n```verse\nusing { /Fortnite.com/Devices }\nusing { /Verse.org/Simulation }\n\n# Define a class for the requested functionality\nMyDevice := class(creative_device) {\n    # Properties\n    var IsActive: boolean = false\n    \n    # Device setup\n    OnBeginPlay(): void = {\n        # Initialize the device\n        Print("Device initialized")\n    }\n    \n    # Toggle the device state\n    ToggleState(): void = {\n        set IsActive = not IsActive\n        if (IsActive) {\n            Print("Device activated")\n        } else {\n            Print("Device deactivated")\n        }\n    }\n}\n```\n\nWould you like me to explain how this code works or modify it for your specific needs?';
      } else if (
        keywords.includes("asset") ||
        keywords.includes("model") ||
        keywords.includes("mesh")
      ) {
        response =
          'I can help you manage assets for your UEFN project. Here\'s a JSON structure you can use to organize your assets:\n\n```json\n{\n  "assets": [\n    {\n      "name": "PlayerSpawn",\n      "path": "/Game/Devices/PlayerSpawnPad",\n      "category": "device",\n      "tags": ["player", "spawn"]\n    },\n    {\n      "name": "TreePine",\n      "path": "/Game/Props/Nature/Trees/PineTree",\n      "category": "prop",\n      "tags": ["nature", "tree"]\n    }\n  ]\n}\n```\n\nWould you like me to create a task to implement an asset management system for your project?';
      } else if (keywords.includes("trigger") && keywords.includes("zone")) {
        // Special case for trigger zone requests
        response =
          'Here\'s a Verse script for a trigger zone:\n\n```verse\nusing { /Fortnite.com/Devices }\nusing { /Fortnite.com/Characters }\nusing { /Verse.org/Simulation }\n\n# A trigger zone that detects when players enter or exit\nTriggerZoneDevice := class(creative_device) {\n    # Properties\n    @editable var TriggerVolume : trigger_device = trigger_device{}\n    @editable var ShowDebugMessages : boolean = true\n    \n    # Variables to track players in the zone\n    var PlayersInZone : [agent]int = map{}\n    \n    # Setup the device\n    OnBeginPlay(): void = {\n        # Subscribe to trigger events\n        TriggerVolume.TriggeredEvent.Subscribe(OnTriggered)\n    }\n    \n    # Handle trigger events\n    OnTriggered(Agent : agent): void = {\n        if (PlayersInZone[Agent] = 0):\n            # Player entered the zone\n            set PlayersInZone[Agent] = 1\n            OnPlayerEntered(Agent)\n        else:\n            # Player exited the zone\n            PlayersInZone.Remove(Agent)\n            OnPlayerExited(Agent)\n    }\n    \n    # Called when a player enters the zone\n    OnPlayerEntered(Agent : agent): void = {\n        if (ShowDebugMessages):\n            Print("Player entered trigger zone")\n        \n        # Add your custom logic here\n    }\n    \n    # Called when a player exits the zone\n    OnPlayerExited(Agent : agent): void = {\n        if (ShowDebugMessages):\n            Print("Player exited trigger zone")\n        \n        # Add your custom logic here\n    }\n}\n```\n\nTo use this in your UEFN project:\n1. Create a new Verse device\n2. Paste this code\n3. Place a trigger volume in your map\n4. Connect the trigger volume to this device\n\nWould you like me to explain any part of this code in more detail?';
      } else if (keywords.includes("player") && keywords.includes("movement")) {
        // Special case for player movement requests
        response =
          "Here's a Verse script for custom player movement:\n\n```verse\nusing { /Fortnite.com/Characters }\nusing { /Fortnite.com/Devices }\nusing { /Verse.org/Simulation }\nusing { /Verse.org/Keys }\nusing { /UnrealEngine.com/Temporary/SpatialMath }\n\n# Custom player movement controller\nPlayerMovementController := class(creative_device) {\n    # Properties\n    @editable var MovementSpeed : float = 500.0\n    @editable var JumpForce : float = 700.0\n    @editable var EnableDoubleJump : boolean = true\n    \n    # Variables\n    var PlayerMap : [player]fort_character = map{}\n    var CanDoubleJump : [player]boolean = map{}\n    \n    # Setup the device\n    OnBeginPlay(): void = {\n        # Subscribe to player spawned event\n        GetPlayspace().PlayerAddedEvent().Subscribe(OnPlayerAdded)\n        GetPlayspace().PlayerRemovedEvent().Subscribe(OnPlayerRemoved)\n    }\n    \n    # Handle player added to game\n    OnPlayerAdded(InPlayer : player): void = {\n        if (InPlayer.GetFortCharacter[]):\n            set PlayerMap[InPlayer] = InPlayer.GetFortCharacter[]\n            set CanDoubleJump[InPlayer] = false\n            \n            # Subscribe to jump input\n            InPlayer.JumpButtonEvent().Subscribe(OnJumpInput)\n    }\n    \n    # Handle player removed from game\n    OnPlayerRemoved(InPlayer : player): void = {\n        PlayerMap.Remove(InPlayer)\n        CanDoubleJump.Remove(InPlayer)\n    }\n    \n    # Handle jump input\n    OnJumpInput(InPlayer : player, IsPressed : boolean): void = {\n        if (IsPressed):\n            if (PlayerMap[InPlayer] = false):\n                return\n                \n            if (PlayerMap[InPlayer].IsOnGround()):\n                # Regular jump\n                PlayerMap[InPlayer].Jump()\n                set CanDoubleJump[InPlayer] = EnableDoubleJump\n            else if (CanDoubleJump[InPlayer]):\n                # Double jump\n                PlayerMap[InPlayer].LaunchCharacter(vector3(0.0, 0.0, JumpForce), false, false)\n                set CanDoubleJump[InPlayer] = false\n    }\n}\n```\n\nThis script provides:\n1. Custom movement speed\n2. Adjustable jump force\n3. Optional double jump functionality\n\nWould you like me to create a task to implement this in your project?";
      } else {
        response =
          "I understand you're interested in UEFN development. I can help with:\n\n1. Verse scripting and code generation\n2. Asset management and organization\n3. Creating tasks for your project workflow\n4. Providing documentation and examples\n\nCould you please provide more details about what specific aspect of UEFN you need help with?";
      }

      // Add assistant response to conversation
      setConversation((prev) => [
        ...prev,
        { role: "assistant", content: response },
      ]);
      setIsProcessing(false);

      // Create task if needed
      if (shouldCreateTask) {
        onCreateTask(taskData);
      }
    }, 1500);
  };

  return (
    <Card className="w-full h-full flex flex-col bg-white">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold flex items-center">
            <Cpu className="mr-2 h-5 w-5 text-primary" />
            UEFN AI Assistant
          </CardTitle>
          <div className="flex space-x-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Code className="h-3 w-3" /> Verse
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Layers className="h-3 w-3" /> Assets
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Map className="h-3 w-3" /> Islands
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col overflow-hidden p-4">
        {/* Conversation history */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          {conversation.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
              >
                {message.role === "assistant" &&
                message.content.includes("```") ? (
                  <div>
                    {message.content.split("```").map((part, i) => {
                      if (i % 2 === 0) {
                        return (
                          <div key={i} className="whitespace-pre-wrap mb-2">
                            {part}
                          </div>
                        );
                      } else {
                        const [language, ...codeParts] = part.split("\n");
                        const code = codeParts.join("\n");
                        return (
                          <div key={i} className="mb-2">
                            <div className="bg-gray-800 text-gray-200 p-1 text-xs rounded-t-md flex items-center">
                              {language === "verse" ? (
                                <Code className="h-3 w-3 mr-1" />
                              ) : language === "json" ? (
                                <FileText className="h-3 w-3 mr-1" />
                              ) : (
                                <Terminal className="h-3 w-3 mr-1" />
                              )}
                              {language}
                            </div>
                            <pre className="bg-gray-900 text-gray-200 p-3 rounded-b-md overflow-x-auto text-sm">
                              {code}
                            </pre>
                          </div>
                        );
                      }
                    })}
                  </div>
                ) : (
                  <div
                    className="whitespace-pre-wrap"
                    onClick={() => {
                      // If the message contains task-related content, offer to create a task
                      if (
                        message.role === "assistant" &&
                        message.content.toLowerCase().includes("task") &&
                        !message.content.includes("```")
                      ) {
                        const createTask = confirm(
                          "Would you like to create a task from this message?",
                        );
                        if (createTask) {
                          // Extract a title from the message
                          const lines = message.content.split("\n");
                          const title = lines[0]
                            .replace(/["']/g, "")
                            .substring(0, 50);

                          onCreateTask({
                            title: title || "New task from assistant",
                            description: message.content,
                            priority: "medium",
                            assignedTo: "Cody",
                            dueDate: new Date(
                              Date.now() + 7 * 24 * 60 * 60 * 1000,
                            ).toISOString(),
                            dependencies: [],
                            tags: ["ai-generated", "uefn"],
                          });
                        }
                      }
                    }}
                  >
                    {message.content}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isProcessing && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg p-3 bg-muted">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-150"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-300"></div>
                  <span className="text-sm text-gray-500">Thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <Separator className="my-2" />

        {/* Input area */}
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Textarea
            placeholder="Ask about Verse scripting, asset management, or create tasks..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="flex-1 resize-none"
            rows={2}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <Button type="submit" disabled={isProcessing || !prompt.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>

        <div className="mt-2 flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setPrompt("Create a task to implement player movement in Verse");
              // Auto-submit after a short delay
              setTimeout(() => {
                const event = new Event("submit", {
                  bubbles: true,
                  cancelable: true,
                });
                document.querySelector("form")?.dispatchEvent(event);
              }, 100);
            }}
          >
            Player Movement
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setPrompt("Show me a Verse script for a trigger zone");
              // Auto-submit after a short delay
              setTimeout(() => {
                const event = new Event("submit", {
                  bubbles: true,
                  cancelable: true,
                });
                document.querySelector("form")?.dispatchEvent(event);
              }, 100);
            }}
          >
            Trigger Zone
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setPrompt("Help me organize my UEFN assets");
              // Auto-submit after a short delay
              setTimeout(() => {
                const event = new Event("submit", {
                  bubbles: true,
                  cancelable: true,
                });
                document.querySelector("form")?.dispatchEvent(event);
              }, 100);
            }}
          >
            Asset Management
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UEFNAssistant;
