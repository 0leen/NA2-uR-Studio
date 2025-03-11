import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "../ui/dialog";
import {
  Search,
  Filter,
  Upload,
  Download,
  Plus,
  FileUp,
  Settings,
  HelpCircle,
} from "lucide-react";
import AssetGrid from "./AssetGrid";

interface Asset {
  id: string;
  name: string;
  type: "code" | "design" | "content";
  preview: string;
  dateCreated: string;
  creator: string;
  tags: string[];
  version: string;
}

interface AssetLibraryProps {
  assets?: Asset[];
  onAssetClick?: (asset: Asset) => void;
  onCreateAsset?: () => void;
  onImportAsset?: () => void;
  onExportAsset?: (assetId: string) => void;
}

const AssetLibrary = ({
  assets = [
    {
      id: "1",
      name: "Player Movement Script",
      type: "code",
      preview: "function movePlayer() { ... }",
      dateCreated: "2023-06-15",
      creator: "Cody",
      tags: ["movement", "player", "physics"],
      version: "1.2.0",
    },
    {
      id: "2",
      name: "Main Menu UI",
      type: "design",
      preview:
        "https://images.unsplash.com/photo-1618609255910-ced9a6ec8c8a?w=600&q=80",
      dateCreated: "2023-06-18",
      creator: "Yui",
      tags: ["UI", "menu", "interface"],
      version: "2.0.1",
    },
    {
      id: "3",
      name: "Game Description",
      type: "content",
      preview: "An immersive battle royale experience set in a...",
      dateCreated: "2023-06-20",
      creator: "MetaBot",
      tags: ["description", "marketing", "text"],
      version: "1.0.0",
    },
    {
      id: "4",
      name: "Enemy AI Logic",
      type: "code",
      preview: "class EnemyAI { constructor() { ... } }",
      dateCreated: "2023-06-22",
      creator: "Cody",
      tags: ["AI", "enemy", "behavior"],
      version: "1.1.0",
    },
    {
      id: "5",
      name: "Game Map Layout",
      type: "design",
      preview:
        "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=600&q=80",
      dateCreated: "2023-06-25",
      creator: "Yui",
      tags: ["map", "layout", "environment"],
      version: "1.3.2",
    },
    {
      id: "6",
      name: "Tutorial Script",
      type: "content",
      preview: "Welcome to Fortnite Creative! This tutorial will guide you...",
      dateCreated: "2023-06-28",
      creator: "MetaBot",
      tags: ["tutorial", "guide", "instructions"],
      version: "1.0.1",
    },
  ],
  onAssetClick = () => {},
  onCreateAsset = () => {},
  onImportAsset = () => {},
  onExportAsset = () => {},
}: AssetLibraryProps) => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState("current");

  // Filter assets based on active tab and search query
  const filteredAssets = assets.filter((asset) => {
    const matchesTab = activeTab === "all" || asset.type === activeTab;
    const matchesSearch =
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    return matchesTab && matchesSearch;
  });

  return (
    <div className="w-full h-full bg-white">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div>
              <h1 className="text-2xl font-bold">Asset Library</h1>
              <p className="text-sm text-gray-500">
                Manage and organize your project assets
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Dialog
                open={isImportDialogOpen}
                onOpenChange={setIsImportDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="outline" onClick={onImportAsset}>
                    <Upload className="mr-2 h-4 w-4" />
                    Import
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Import Assets</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg">
                      <FileUp className="h-10 w-10 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500 mb-2">
                        Drag and drop files here, or click to browse
                      </p>
                      <Button variant="outline" size="sm">
                        Browse Files
                      </Button>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsImportDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={() => setIsImportDialogOpen(false)}>
                      Import
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button onClick={onCreateAsset}>
                <Plus className="mr-2 h-4 w-4" />
                New Asset
              </Button>
            </div>
          </div>

          <div className="mt-6 flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="Search assets by name or tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Select
                value={selectedProject}
                onValueChange={setSelectedProject}
              >
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">Current Project</SelectItem>
                  <SelectItem value="all">All Projects</SelectItem>
                  <SelectItem value="shared">Shared With Me</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <HelpCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <Tabs
            defaultValue="all"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="border-b px-6">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="all" className="px-4 py-2">
                  All Assets
                </TabsTrigger>
                <TabsTrigger value="code" className="px-4 py-2">
                  Code
                </TabsTrigger>
                <TabsTrigger value="design" className="px-4 py-2">
                  Design
                </TabsTrigger>
                <TabsTrigger value="content" className="px-4 py-2">
                  Content
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="p-6">
              <AssetGrid
                assets={filteredAssets}
                onAssetClick={onAssetClick}
                onCreateAsset={onCreateAsset}
              />
            </TabsContent>

            <TabsContent value="code" className="p-6">
              <AssetGrid
                assets={filteredAssets.filter((asset) => asset.type === "code")}
                onAssetClick={onAssetClick}
                onCreateAsset={onCreateAsset}
              />
            </TabsContent>

            <TabsContent value="design" className="p-6">
              <AssetGrid
                assets={filteredAssets.filter(
                  (asset) => asset.type === "design",
                )}
                onAssetClick={onAssetClick}
                onCreateAsset={onCreateAsset}
              />
            </TabsContent>

            <TabsContent value="content" className="p-6">
              <AssetGrid
                assets={filteredAssets.filter(
                  (asset) => asset.type === "content",
                )}
                onAssetClick={onAssetClick}
                onCreateAsset={onCreateAsset}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Stats Footer */}
        <div className="p-4 border-t bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              <div>
                <span className="text-sm text-gray-500">Total Assets:</span>{" "}
                <Badge variant="secondary">{assets.length}</Badge>
              </div>
              <div>
                <span className="text-sm text-gray-500">Code:</span>{" "}
                <Badge variant="outline" className="bg-blue-50">
                  {assets.filter((a) => a.type === "code").length}
                </Badge>
              </div>
              <div>
                <span className="text-sm text-gray-500">Design:</span>{" "}
                <Badge variant="outline" className="bg-green-50">
                  {assets.filter((a) => a.type === "design").length}
                </Badge>
              </div>
              <div>
                <span className="text-sm text-gray-500">Content:</span>{" "}
                <Badge variant="outline" className="bg-amber-50">
                  {assets.filter((a) => a.type === "content").length}
                </Badge>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export All
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetLibrary;
