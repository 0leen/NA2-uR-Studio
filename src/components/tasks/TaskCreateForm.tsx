import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Task } from "./TaskCard";

const taskSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z
    .string()
    .min(10, { message: "Please provide a more detailed description" }),
  priority: z.enum(["critical", "high", "medium", "low"]),
  assignedTo: z
    .string()
    .min(1, { message: "Please assign this task to someone" }),
  dueDate: z.string().min(1, { message: "Due date is required" }),
  dependencies: z.array(z.string()).optional(),
  tags: z.string().optional(),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface TaskCreateFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (
    task: Omit<Task, "id" | "status" | "progress" | "createdAt" | "errorLog">,
  ) => void;
  existingTasks?: Task[];
  agents?: { id: string; name: string; role: string }[];
}

const TaskCreateForm = ({
  open,
  onOpenChange,
  onSubmit,
  existingTasks = [],
  agents = [
    { id: "agent-1", name: "Cody", role: "Code Agent" },
    { id: "agent-2", name: "Yui", role: "UI/UX Agent" },
    { id: "agent-3", name: "MetaBot", role: "Content Agent" },
  ],
}: TaskCreateFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      assignedTo: "",
      dueDate: new Date().toISOString().split("T")[0],
      dependencies: [],
      tags: "",
    },
  });

  const handleSubmit = async (values: TaskFormValues) => {
    setIsSubmitting(true);
    try {
      // Process tags from comma-separated string to array
      const tags = values.tags
        ? values.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
        : [];

      // Create the task object
      const newTask = {
        title: values.title,
        description: values.description,
        priority: values.priority as Task["priority"],
        assignedTo: values.assignedTo,
        dueDate: new Date(values.dueDate).toISOString(),
        dependencies: values.dependencies || [],
        tags,
      };

      onSubmit(newTask);
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get tomorrow's date for the minimum due date
  const getTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Create New Task
          </DialogTitle>
          <DialogDescription>
            Add a new task to the project workflow. Tasks can be assigned to AI
            agents and tracked through completion.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6 py-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Implement player movement mechanics"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    A clear, concise title for the task
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Code the basic player movement and physics interactions for the character controller"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Detailed description of what needs to be done
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="critical">Critical</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Task importance level</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="assignedTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assigned To</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Assign to agent" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {agents.map((agent) => (
                          <SelectItem key={agent.id} value={agent.name}>
                            {agent.name} ({agent.role})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      AI agent responsible for this task
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due Date</FormLabel>
                  <FormControl>
                    <Input type="date" min={getTomorrow()} {...field} />
                  </FormControl>
                  <FormDescription>
                    When should this task be completed?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Input placeholder="code, movement, physics" {...field} />
                  </FormControl>
                  <FormDescription>
                    Comma-separated tags to categorize this task
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                  onOpenChange(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Task"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskCreateForm;
