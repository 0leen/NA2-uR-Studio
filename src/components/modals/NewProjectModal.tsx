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
import { MapPin, Users, Calendar, Tag } from "lucide-react";

const formSchema = z.object({
  projectName: z.string().min(3, { message: "Project name is required" }),
  description: z
    .string()
    .min(10, { message: "Please provide a more detailed description" }),
  mapType: z.string({ required_error: "Please select a map type" }),
  teamSize: z.string({ required_error: "Please select a team size" }),
  deadline: z.string().optional(),
  requirements: z
    .string()
    .min(20, { message: "Please provide detailed requirements" }),
  tags: z.string().optional(),
});

interface NewProjectModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSubmit?: (data: z.infer<typeof formSchema>) => void;
  onCancel?: () => void;
}

const NewProjectModal = ({
  open = true,
  onOpenChange = () => {},
  onSubmit = () => {},
  onCancel = () => {},
}: NewProjectModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: "",
      description: "",
      mapType: "",
      teamSize: "",
      deadline: "",
      requirements: "",
      tags: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onSubmit(values);
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating project:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Create New UEFN Map Project
          </DialogTitle>
          <DialogDescription>
            Enter project details and natural language requirements to get
            started with your new Fortnite Creative map.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="projectName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Battle Royale Arena" {...field} />
                  </FormControl>
                  <FormDescription>
                    A unique name for your UEFN map project
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
                  <FormLabel>Project Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="A dynamic battle royale map with multiple biomes and interactive elements"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Brief overview of your map concept
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="mapType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Map Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select map type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="battle_royale">
                          Battle Royale
                        </SelectItem>
                        <SelectItem value="zone_wars">Zone Wars</SelectItem>
                        <SelectItem value="box_fights">Box Fights</SelectItem>
                        <SelectItem value="prop_hunt">Prop Hunt</SelectItem>
                        <SelectItem value="deathrun">Deathrun</SelectItem>
                        <SelectItem value="adventure">Adventure</SelectItem>
                        <SelectItem value="puzzle">Puzzle</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      <MapPin className="inline h-3 w-3 mr-1" />
                      Type of gameplay experience
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="teamSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team Size</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select team size" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="solo">Solo (1 player)</SelectItem>
                        <SelectItem value="duo">Duo (2 players)</SelectItem>
                        <SelectItem value="trio">Trio (3 players)</SelectItem>
                        <SelectItem value="squad">Squad (4 players)</SelectItem>
                        <SelectItem value="large_team">
                          Large Team (5-16 players)
                        </SelectItem>
                        <SelectItem value="massive">
                          Massive (16+ players)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      <Users className="inline h-3 w-3 mr-1" />
                      Number of players per team
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="deadline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Completion Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormDescription>
                    <Calendar className="inline h-3 w-3 mr-1" />
                    When do you aim to complete this project?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="requirements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Natural Language Requirements</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Create a battle royale map with three distinct biomes: desert, snow, and jungle. Include interactive elements like traps, hidden loot caches, and environmental hazards. The map should support 16 players with a shrinking storm mechanic..."
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Describe your map in detail using natural language. Be
                    specific about gameplay mechanics, visual elements, and
                    player experience.
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
                    <Input
                      placeholder="battle, pvp, adventure, puzzle"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    <Tag className="inline h-3 w-3 mr-1" />
                    Comma-separated tags to categorize your project
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
                  onCancel();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Project"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewProjectModal;
