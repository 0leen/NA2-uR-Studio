import React, { useState, useEffect, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { ThemeToggle } from "../ui/ThemeToggle";
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
  Plus,
  Minus,
  RotateCcw,
  Grid,
  Search,
  Edit,
  Trash,
  Move,
  Settings,
  ChevronDown,
  ChevronRight,
  GripVertical,
  X,
} from "lucide-react";

const UEFNWidgetEditor = () => {
  const [scale, setScale] = useState(1);
  const [selectedWidget, setSelectedWidget] = useState(null);
  const [widgets, setWidgets] = useState([]);
  const [showMinimap, setShowMinimap] = useState(false);
  const [viewMode, setViewMode] = useState("design");
  const [searchPalette, setSearchPalette] = useState("");
  const [searchProperties, setSearchProperties] = useState("");
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });

  const canvasRef = useRef(null);
  const graphCanvasRef = useRef(null);
  const minimapCanvasRef = useRef(null);

  // Initialize canvas and context
  useEffect(() => {
    if (graphCanvasRef.current) {
      const canvas = graphCanvasRef.current;
      const container = canvas.parentElement;
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
    }

    if (minimapCanvasRef.current) {
      updateMinimap();
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleResize = () => {
    if (graphCanvasRef.current) {
      const canvas = graphCanvasRef.current;
      const container = canvas.parentElement;
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
      drawConnections();
    }

    if (minimapCanvasRef.current) {
      updateMinimap();
    }
  };

  const updateMinimap = () => {
    if (!minimapCanvasRef.current) return;

    const canvas = minimapCanvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!canvasRef.current) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvas.width / canvasRect.width;
    const scaleY = canvas.height / canvasRect.height;

    widgets.forEach((widget) => {
      ctx.fillStyle = "rgba(137, 180, 250, 0.5)";
      ctx.fillRect(
        widget.x * scaleX,
        widget.y * scaleY,
        widget.width * scaleX,
        widget.height * scaleY,
      );
    });
  };

  const drawConnections = () => {
    if (!graphCanvasRef.current) return;

    const canvas = graphCanvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connections between widgets if needed
  };

  const handleWidgetDragStart = (e, widgetType) => {
    e.dataTransfer.setData("text/plain", widgetType);
  };

  const handleCanvasDragOver = (e) => {
    e.preventDefault();
  };

  const handleCanvasDrop = (e) => {
    e.preventDefault();
    const widgetType = e.dataTransfer.getData("text/plain");
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    createWidget(widgetType, x, y);
  };

  const createWidget = (type, x, y) => {
    const newWidget = {
      id: `widget-${Date.now()}`,
      type,
      x,
      y,
      width: 150,
      height: 50,
      content: getInitialContent(type),
      style: {
        fontFamily: "Fortnite",
        fontSize: "14px",
        color: "#cdd6f4",
        backgroundColor: "rgba(49, 50, 68, 0.95)",
        borderColor: "#89b4fa",
        borderWidth: "2px",
        borderRadius: "6px",
        padding: "12px",
        opacity: 1,
        zIndex: 1,
        transform: "rotate(0deg)",
      },
    };

    setWidgets([...widgets, newWidget]);
    setSelectedWidget(newWidget);
    updateMinimap();
  };

  const getInitialContent = (type) => {
    switch (type) {
      case "Button":
        return "Click Me";
      case "TextBox":
        return "Editable Text";
      case "Slider":
        return "Slider";
      case "Image":
        return "Image";
      case "VideoPlayer":
        return "Video Player";
      case "ProgressBar":
        return "Progress Bar";
      case "ToggleSwitch":
        return "Toggle";
      case "Dropdown":
        return "Select";
      case "Checkbox":
        return "Check Me";
      case "RadioButton":
        return "Select Me";
      default:
        return type;
    }
  };

  const handleWidgetClick = (e, widget) => {
    e.stopPropagation();
    setSelectedWidget(widget);
  };

  const handleCanvasClick = () => {
    setSelectedWidget(null);
    setContextMenuVisible(false);
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setContextMenuVisible(true);
  };

  const handleWidgetDelete = (widgetId) => {
    setWidgets(widgets.filter((w) => w.id !== widgetId));
    if (selectedWidget && selectedWidget.id === widgetId) {
      setSelectedWidget(null);
    }
    updateMinimap();
  };

  const handlePropertyChange = (property, value) => {
    if (!selectedWidget) return;

    setWidgets(
      widgets.map((w) => {
        if (w.id === selectedWidget.id) {
          if (property === "content") {
            return { ...w, content: value };
          } else {
            return {
              ...w,
              style: {
                ...w.style,
                [property]: value,
              },
            };
          }
        }
        return w;
      }),
    );

    // Update the selected widget reference
    const updatedWidget = widgets.find((w) => w.id === selectedWidget.id);
    if (updatedWidget) {
      setSelectedWidget(updatedWidget);
    }

    updateMinimap();
  };

  const handleZoomIn = () => {
    if (scale < 3) {
      setScale(scale + 0.1);
    }
  };

  const handleZoomOut = () => {
    if (scale > 0.5) {
      setScale(scale - 0.1);
    }
  };

  const handleZoomReset = () => {
    setScale(1);
  };

  const filteredWidgetTypes = [
    "Button",
    "TextBox",
    "Slider",
    "Image",
    "VideoPlayer",
    "ProgressBar",
    "ToggleSwitch",
    "Dropdown",
    "Checkbox",
    "RadioButton",
  ].filter((type) => type.toLowerCase().includes(searchPalette.toLowerCase()));

  const getWidgetIcon = (type) => {
    switch (type) {
      case "Button":
        return <Square className="h-4 w-4" />;
      case "TextBox":
        return <FileText className="h-4 w-4" />;
      case "Image":
        return <Image className="h-4 w-4" />;
      case "VideoPlayer":
        return <Video className="h-4 w-4" />;
      case "ProgressBar":
        return <Activity className="h-4 w-4" />;
      case "ToggleSwitch":
        return <ToggleLeft className="h-4 w-4" />;
      case "Dropdown":
        return <ChevronDown className="h-4 w-4" />;
      case "Checkbox":
        return <CheckSquare className="h-4 w-4" />;
      case "RadioButton":
        return <Circle className="h-4 w-4" />;
      default:
        return <Box className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-background">
      <div className="header bg-card border-b border-border p-2 flex items-center justify-between">
        <div className="title flex items-center gap-2">
          <h1 className="text-xl font-bold">UE5 Widget Blueprint Editor</h1>
        </div>
        <div className="menu flex gap-4">
          <span className="cursor-pointer p-1 hover:bg-accent rounded">
            File
          </span>
          <span className="cursor-pointer p-1 hover:bg-accent rounded">
            Edit
          </span>
          <span className="cursor-pointer p-1 hover:bg-accent rounded">
            Settings
          </span>
          <ThemeToggle />
        </div>
      </div>

      <div className="container flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="sidebar bg-card border-r border-border w-80 min-w-[280px] max-w-[450px] overflow-y-auto p-6 flex flex-col">
          <div className="search mb-4">
            <Input
              type="text"
              placeholder="Search Widgets..."
              value={searchPalette}
              onChange={(e) => setSearchPalette(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="section mb-6">
            <h4 className="bg-accent/20 text-foreground p-3 rounded-md mb-3 font-bold text-lg border-b-2 border-primary">
              Widgets
            </h4>
            <ul className="space-y-1">
              {filteredWidgetTypes.map((type) => (
                <li
                  key={type}
                  draggable="true"
                  onDragStart={(e) => handleWidgetDragStart(e, type)}
                  className="p-2 rounded-md bg-accent/10 hover:bg-accent/30 cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    {getWidgetIcon(type)}
                    <span>{type}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="section border-t border-b border-border py-3 my-3">
            <h4 className="bg-accent/20 text-foreground p-3 rounded-md mb-3 font-bold text-lg border-b-2 border-primary">
              <Layers className="inline-block mr-2 h-5 w-5" /> Hierarchy
            </h4>
            <ul>
              {widgets.map((widget) => (
                <li
                  key={widget.id}
                  className={`p-2 rounded-md hover:bg-accent/20 cursor-pointer flex items-center gap-2 ${selectedWidget && selectedWidget.id === widget.id ? "bg-primary/20 border border-primary" : "bg-card"}`}
                  onClick={(e) => handleWidgetClick(e, widget)}
                >
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  {getWidgetIcon(widget.type)}
                  <span>{widget.content}</span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {widget.type}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleWidgetDelete(widget.id);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Main Canvas */}
        <div className="main flex-1 bg-background relative flex flex-col">
          <div className="widget-canvas-header bg-card border-b border-border p-2 flex justify-between items-center">
            <select
              className="bg-card border border-border rounded p-2"
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
            >
              <option value="design">Design View</option>
              <option value="preview">Preview</option>
              <option value="wireframe">Wireframe</option>
            </select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMinimap(!showMinimap)}
            >
              <Map className="mr-2 h-4 w-4" />
              Minimap
            </Button>

            <div className="zoom-controls flex gap-2">
              <Button variant="outline" size="icon" onClick={handleZoomIn}>
                <Plus className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleZoomOut}>
                <Minus className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleZoomReset}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {showMinimap && (
            <div className="minimap-content absolute top-12 right-4 w-[200px] h-[200px] bg-card/80 border border-border rounded-md overflow-hidden z-10">
              <canvas
                ref={minimapCanvasRef}
                width="200"
                height="200"
                className="w-full h-full"
              />
            </div>
          )}

          <canvas
            ref={graphCanvasRef}
            className="graph-canvas absolute top-0 left-0 w-full h-full pointer-events-none z-[1]"
          />

          <div className="grid absolute top-0 left-0 right-0 bottom-0 bg-grid-pattern opacity-10"></div>

          <div
            ref={canvasRef}
            className="widget-canvas absolute top-0 left-0 right-0 bottom-0 flex-1 z-[2]"
            style={{ transform: `scale(${scale})`, transformOrigin: "0 0" }}
            onClick={handleCanvasClick}
            onContextMenu={handleContextMenu}
            onDragOver={handleCanvasDragOver}
            onDrop={handleCanvasDrop}
          >
            {widgets.map((widget) => (
              <div
                key={widget.id}
                className={`widget absolute cursor-move ${selectedWidget && selectedWidget.id === widget.id ? "border-success shadow-success/40" : ""}`}
                style={{
                  left: `${widget.x}px`,
                  top: `${widget.y}px`,
                  width: `${widget.width}px`,
                  height: `${widget.height}px`,
                  ...widget.style,
                  border: `${widget.style.borderWidth} solid ${selectedWidget && selectedWidget.id === widget.id ? "var(--success)" : widget.style.borderColor}`,
                }}
                onClick={(e) => handleWidgetClick(e, widget)}
              >
                <div className="widget-content">{widget.content}</div>

                {selectedWidget && selectedWidget.id === widget.id && (
                  <>
                    <div
                      className="widget-resize-handle resize-nw absolute w-3 h-3 bg-primary rounded-full cursor-nw-resize"
                      style={{ left: "-6px", top: "-6px" }}
                    ></div>
                    <div
                      className="widget-resize-handle resize-ne absolute w-3 h-3 bg-primary rounded-full cursor-ne-resize"
                      style={{ right: "-6px", top: "-6px" }}
                    ></div>
                    <div
                      className="widget-resize-handle resize-sw absolute w-3 h-3 bg-primary rounded-full cursor-sw-resize"
                      style={{ left: "-6px", bottom: "-6px" }}
                    ></div>
                    <div
                      className="widget-resize-handle resize-se absolute w-3 h-3 bg-primary rounded-full cursor-se-resize"
                      style={{ right: "-6px", bottom: "-6px" }}
                    ></div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Properties Panel */}
        <div className="details bg-card border-l border-border w-80 overflow-y-auto p-6">
          <div className="search mb-4">
            <Input
              type="text"
              placeholder="Search Properties..."
              value={searchProperties}
              onChange={(e) => setSearchProperties(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="section">
            <h4 className="bg-accent/20 text-foreground p-3 rounded-md mb-3 font-bold text-lg border-b-2 border-primary">
              Properties
            </h4>

            {selectedWidget ? (
              <ul className="space-y-3">
                <li className="flex flex-col gap-1">
                  <span className="text-sm font-medium">Text Content</span>
                  <Input
                    type="text"
                    value={selectedWidget.content}
                    onChange={(e) =>
                      handlePropertyChange("content", e.target.value)
                    }
                  />
                </li>

                <li className="flex flex-col gap-1">
                  <span className="text-sm font-medium">Font Size</span>
                  <Input
                    type="number"
                    value={parseInt(selectedWidget.style.fontSize) || 14}
                    onChange={(e) =>
                      handlePropertyChange("fontSize", `${e.target.value}px`)
                    }
                  />
                </li>

                <li className="flex flex-col gap-1">
                  <span className="text-sm font-medium">Font Family</span>
                  <select
                    className="bg-card border border-border rounded p-2"
                    value={selectedWidget.style.fontFamily}
                    onChange={(e) =>
                      handlePropertyChange("fontFamily", e.target.value)
                    }
                  >
                    <option value="Fortnite">Fortnite</option>
                    <option value="Arial">Arial</option>
                    <option value="Helvetica">Helvetica</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Courier New">Courier New</option>
                  </select>
                </li>

                <li className="flex flex-col gap-1">
                  <span className="text-sm font-medium">Position X</span>
                  <Input
                    type="number"
                    value={selectedWidget.x}
                    onChange={(e) => {
                      const newWidgets = widgets.map((w) => {
                        if (w.id === selectedWidget.id) {
                          return { ...w, x: parseInt(e.target.value) };
                        }
                        return w;
                      });
                      setWidgets(newWidgets);
                      setSelectedWidget({
                        ...selectedWidget,
                        x: parseInt(e.target.value),
                      });
                      updateMinimap();
                    }}
                  />
                </li>

                <li className="flex flex-col gap-1">
                  <span className="text-sm font-medium">Position Y</span>
                  <Input
                    type="number"
                    value={selectedWidget.y}
                    onChange={(e) => {
                      const newWidgets = widgets.map((w) => {
                        if (w.id === selectedWidget.id) {
                          return { ...w, y: parseInt(e.target.value) };
                        }
                        return w;
                      });
                      setWidgets(newWidgets);
                      setSelectedWidget({
                        ...selectedWidget,
                        y: parseInt(e.target.value),
                      });
                      updateMinimap();
                    }}
                  />
                </li>

                <li className="flex flex-col gap-1">
                  <span className="text-sm font-medium">Width</span>
                  <Input
                    type="number"
                    value={selectedWidget.width}
                    onChange={(e) => {
                      const newWidgets = widgets.map((w) => {
                        if (w.id === selectedWidget.id) {
                          return { ...w, width: parseInt(e.target.value) };
                        }
                        return w;
                      });
                      setWidgets(newWidgets);
                      setSelectedWidget({
                        ...selectedWidget,
                        width: parseInt(e.target.value),
                      });
                      updateMinimap();
                    }}
                  />
                </li>

                <li className="flex flex-col gap-1">
                  <span className="text-sm font-medium">Height</span>
                  <Input
                    type="number"
                    value={selectedWidget.height}
                    onChange={(e) => {
                      const newWidgets = widgets.map((w) => {
                        if (w.id === selectedWidget.id) {
                          return { ...w, height: parseInt(e.target.value) };
                        }
                        return w;
                      });
                      setWidgets(newWidgets);
                      setSelectedWidget({
                        ...selectedWidget,
                        height: parseInt(e.target.value),
                      });
                      updateMinimap();
                    }}
                  />
                </li>

                <li className="flex flex-col gap-1">
                  <span className="text-sm font-medium">Background Color</span>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={
                        selectedWidget.style.backgroundColor.startsWith("rgba")
                          ? rgbaToHex(selectedWidget.style.backgroundColor)
                          : selectedWidget.style.backgroundColor
                      }
                      onChange={(e) =>
                        handlePropertyChange("backgroundColor", e.target.value)
                      }
                      className="w-10 h-10 rounded cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={selectedWidget.style.backgroundColor}
                      onChange={(e) =>
                        handlePropertyChange("backgroundColor", e.target.value)
                      }
                      className="flex-1"
                    />
                  </div>
                </li>

                <li className="flex flex-col gap-1">
                  <span className="text-sm font-medium">Border Color</span>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={
                        selectedWidget.style.borderColor.startsWith("rgba")
                          ? rgbaToHex(selectedWidget.style.borderColor)
                          : selectedWidget.style.borderColor
                      }
                      onChange={(e) =>
                        handlePropertyChange("borderColor", e.target.value)
                      }
                      className="w-10 h-10 rounded cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={selectedWidget.style.borderColor}
                      onChange={(e) =>
                        handlePropertyChange("borderColor", e.target.value)
                      }
                      className="flex-1"
                    />
                  </div>
                </li>

                <li className="flex flex-col gap-1">
                  <span className="text-sm font-medium">Border Width</span>
                  <Input
                    type="number"
                    value={parseInt(selectedWidget.style.borderWidth) || 1}
                    min="0"
                    max="10"
                    onChange={(e) =>
                      handlePropertyChange("borderWidth", `${e.target.value}px`)
                    }
                  />
                </li>

                <li className="flex flex-col gap-1">
                  <span className="text-sm font-medium">Border Radius</span>
                  <Input
                    type="number"
                    value={parseInt(selectedWidget.style.borderRadius) || 4}
                    min="0"
                    max="50"
                    onChange={(e) =>
                      handlePropertyChange(
                        "borderRadius",
                        `${e.target.value}px`,
                      )
                    }
                  />
                </li>

                <li className="flex flex-col gap-1">
                  <span className="text-sm font-medium">Opacity</span>
                  <Input
                    type="range"
                    min="0"
                    max="100"
                    value={selectedWidget.style.opacity * 100}
                    onChange={(e) =>
                      handlePropertyChange("opacity", e.target.value / 100)
                    }
                    className="w-full"
                  />
                </li>

                <li className="flex flex-col gap-1">
                  <span className="text-sm font-medium">Z-Index</span>
                  <Input
                    type="number"
                    value={selectedWidget.style.zIndex || 1}
                    onChange={(e) =>
                      handlePropertyChange("zIndex", e.target.value)
                    }
                  />
                </li>

                <li className="flex flex-col gap-1">
                  <span className="text-sm font-medium">Rotation (deg)</span>
                  <Input
                    type="number"
                    value={parseInt(
                      selectedWidget.style.transform
                        ?.match(/rotate\((\d+)deg\)/)
                        ?.at(1) || 0,
                    )}
                    onChange={(e) =>
                      handlePropertyChange(
                        "transform",
                        `rotate(${e.target.value}deg)`,
                      )
                    }
                  />
                </li>
              </ul>
            ) : (
              <div className="text-center p-4 text-muted-foreground">
                Select a widget to edit its properties
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="footer bg-card border-t border-border p-3 flex justify-between items-center">
        <div className="left flex gap-4">
          <span className="text-muted-foreground">Widget Editor v1.0</span>
        </div>
        <div className="right flex gap-4 items-center">
          <span className="text-muted-foreground">
            Zoom: {Math.round(scale * 100)}%
          </span>
          <div className="zoom-controls flex gap-2">
            <Button variant="outline" size="icon" onClick={handleZoomIn}>
              <Plus className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleZoomOut}>
              <Minus className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleZoomReset}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {contextMenuVisible && (
        <div
          className="custom-context-menu absolute bg-card border border-border rounded-md shadow-md z-50 min-w-[180px]"
          style={{ top: contextMenuPosition.y, left: contextMenuPosition.x }}
        >
          <div className="context-menu-item p-2 hover:bg-accent flex items-center gap-2 cursor-pointer">
            <Edit className="h-4 w-4" /> Edit
          </div>
          <div className="context-menu-item p-2 hover:bg-accent flex items-center gap-2 cursor-pointer">
            <Trash className="h-4 w-4" /> Delete
          </div>
          <div className="context-menu-item p-2 hover:bg-accent flex items-center gap-2 cursor-pointer">
            <Move className="h-4 w-4" /> Arrange
          </div>
          <div className="context-menu-item p-2 hover:bg-accent flex items-center gap-2 cursor-pointer">
            <Settings className="h-4 w-4" /> Properties
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to convert RGBA to HEX
function rgbaToHex(rgba) {
  // Default to a color if conversion fails
  if (!rgba.startsWith("rgba")) return "#89b4fa";

  const parts = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (!parts) return "#89b4fa";

  const r = parseInt(parts[1]);
  const g = parseInt(parts[2]);
  const b = parseInt(parts[3]);

  const toHex = (c) => {
    const hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export default UEFNWidgetEditor;
