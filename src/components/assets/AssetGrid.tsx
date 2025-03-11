import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import {
  Search,
  Filter,
  SortDesc,
  Grid,
  List,
  Download,
  Plus,
} from "lucide-react";
import AssetCard from "./AssetCard";

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

interface AssetGridProps {
  assets?: Asset[];
  onAssetClick?: (asset: Asset) => void;
  onCreateAsset?: () => void;
}

const AssetGrid = ({
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
}: AssetGridProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [assetType, setAssetType] = useState<
    "all" | "code" | "design" | "content"
  >("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "name">("newest");

  // Filter assets based on search query and selected type
  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    const matchesType = assetType === "all" || asset.type === assetType;
    return matchesSearch && matchesType;
  });

  // Sort assets based on selected sort option
  const sortedAssets = [...filteredAssets].sort((a, b) => {
    if (sortBy === "newest") {
      return (
        new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime()
      );
    } else if (sortBy === "oldest") {
      return (
        new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime()
      );
    } else {
      return a.name.localeCompare(b.name);
    }
  });

  return (
    <div className="w-full h-full bg-white p-6">
      <div className="flex flex-col space-y-6">
        {/* Header with search and filters */}
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <h2 className="text-2xl font-bold">Asset Library</h2>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={onCreateAsset}>
              <Plus className="h-4 w-4 mr-2" />
              New Asset
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Import
            </Button>
          </div>
        </div>

        {/* Search and filters */}
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="Search assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Select
              value={assetType}
              onValueChange={(value) => setAssetType(value as any)}
            >
              <SelectTrigger className="w-[130px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="code">Code</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="content">Content</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={sortBy}
              onValueChange={(value) => setSortBy(value as any)}
            >
              <SelectTrigger className="w-[130px]">
                <SortDesc className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center rounded-md border p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs for asset categories */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
            <TabsTrigger value="design">Design</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-4">
            {sortedAssets.length > 0 ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                    : "flex flex-col space-y-4"
                }
              >
                {sortedAssets.map((asset) => (
                  <div key={asset.id} onClick={() => onAssetClick(asset)}>
                    <AssetCard asset={asset} viewMode={viewMode} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-gray-500">
                  No assets found matching your search criteria.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery("");
                    setAssetType("all");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </TabsContent>
          <TabsContent value="code" className="mt-4">
            {sortedAssets.filter((asset) => asset.type === "code").length >
            0 ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                    : "flex flex-col space-y-4"
                }
              >
                {sortedAssets
                  .filter((asset) => asset.type === "code")
                  .map((asset) => (
                    <div key={asset.id} onClick={() => onAssetClick(asset)}>
                      <AssetCard asset={asset} viewMode={viewMode} />
                    </div>
                  ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-gray-500">No code assets found.</p>
              </div>
            )}
          </TabsContent>
          <TabsContent value="design" className="mt-4">
            {sortedAssets.filter((asset) => asset.type === "design").length >
            0 ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                    : "flex flex-col space-y-4"
                }
              >
                {sortedAssets
                  .filter((asset) => asset.type === "design")
                  .map((asset) => (
                    <div key={asset.id} onClick={() => onAssetClick(asset)}>
                      <AssetCard asset={asset} viewMode={viewMode} />
                    </div>
                  ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-gray-500">No design assets found.</p>
              </div>
            )}
          </TabsContent>
          <TabsContent value="content" className="mt-4">
            {sortedAssets.filter((asset) => asset.type === "content").length >
            0 ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                    : "flex flex-col space-y-4"
                }
              >
                {sortedAssets
                  .filter((asset) => asset.type === "content")
                  .map((asset) => (
                    <div key={asset.id} onClick={() => onAssetClick(asset)}>
                      <AssetCard asset={asset} viewMode={viewMode} />
                    </div>
                  ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-gray-500">No content assets found.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AssetGrid;
