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
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  Download,
  MoreVertical,
  Eye,
  Copy,
  Pencil,
  Trash2,
  Code,
  Image,
  FileText,
  File,
} from "lucide-react";

interface AssetCardProps {
  id?: string;
  title?: string;
  description?: string;
  type?: "code" | "image" | "document" | "other";
  preview?: string;
  createdAt?: string;
  updatedAt?: string;
  version?: number;
  tags?: string[];
  author?: string;
  onView?: () => void;
  onDownload?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onCopy?: () => void;
}

const AssetCard = ({
  id = "asset-1",
  title = "Player Movement System",
  description = "Core movement mechanics for UEFN character controller with physics interactions",
  type = "code",
  preview = "function PlayerMovement() {\n  // Movement code implementation\n  const speed = 5.0;\n  // More code...\n}",
  createdAt = "2023-06-15T10:30:00Z",
  updatedAt = "2023-06-18T14:45:00Z",
  version = 2,
  tags = ["movement", "physics", "controller"],
  author = "Cody",
  onView = () => {},
  onDownload = () => {},
  onEdit = () => {},
  onDelete = () => {},
  onCopy = () => {},
}: AssetCardProps) => {
  // Format dates for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Get appropriate icon based on asset type
  const getAssetIcon = () => {
    switch (type) {
      case "code":
        return <Code className="h-5 w-5 text-blue-500" />;
      case "image":
        return <Image className="h-5 w-5 text-green-500" />;
      case "document":
        return <FileText className="h-5 w-5 text-amber-500" />;
      default:
        return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  // Get appropriate preview based on asset type
  const renderPreview = () => {
    switch (type) {
      case "code":
        return (
          <div className="max-h-32 overflow-auto rounded-md bg-gray-100 p-3">
            <pre className="text-xs">{preview}</pre>
          </div>
        );
      case "image":
        return (
          <div className="h-32 w-full overflow-hidden rounded-md bg-gray-100">
            <img
              src={
                preview ||
                "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&q=80"
              }
              alt={title}
              className="h-full w-full object-cover"
            />
          </div>
        );
      case "document":
        return (
          <div className="max-h-32 overflow-hidden rounded-md bg-gray-100 p-3">
            <p className="text-xs text-gray-600">{preview}</p>
          </div>
        );
      default:
        return (
          <div className="flex h-32 items-center justify-center rounded-md bg-gray-100">
            <File className="h-10 w-10 text-gray-400" />
          </div>
        );
    }
  };

  return (
    <Card className="w-full max-w-sm bg-white shadow-md transition-shadow hover:shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getAssetIcon()}
            <CardTitle className="text-base">{title}</CardTitle>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onView}>
                <Eye className="mr-2 h-4 w-4" />
                <span>View</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDownload}>
                <Download className="mr-2 h-4 w-4" />
                <span>Download</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onCopy}>
                <Copy className="mr-2 h-4 w-4" />
                <span>Copy</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onEdit}>
                <Pencil className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardDescription className="text-xs text-gray-500">
          {description}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {renderPreview()}

        <div className="mt-3 flex flex-wrap gap-1">
          {tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="flex items-center">
                <span>v{version}</span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Latest version</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className="flex items-center space-x-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="flex items-center">
                  <span>Created: {formatDate(createdAt)}</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Created by {author}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="flex items-center">
                  <span>Updated: {formatDate(updatedAt)}</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Last modified</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between pt-2">
        <Button variant="outline" size="sm" onClick={onView}>
          <Eye className="mr-2 h-4 w-4" />
          View
        </Button>
        <Button size="sm" onClick={onDownload}>
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AssetCard;
