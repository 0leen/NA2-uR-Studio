import React from "react";
import { Task } from "./TaskCard";
import TaskCard from "./TaskCard";

interface TaskKanbanProps {
  tasks: Task[];
  onViewTask: (taskId: string) => void;
  onEditTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onStatusChange: (taskId: string, status: Task["status"]) => void;
}

const TaskKanban = ({
  tasks,
  onViewTask,
  onEditTask,
  onDeleteTask,
  onStatusChange,
}: TaskKanbanProps) => {
  // Group tasks by status
  const pendingTasks = tasks.filter((task) => task.status === "pending");
  const inProgressTasks = tasks.filter((task) => task.status === "in-progress");
  const blockedTasks = tasks.filter((task) => task.status === "blocked");
  const completedTasks = tasks.filter((task) => task.status === "completed");
  const failedTasks = tasks.filter((task) => task.status === "failed");

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
      {/* Pending Column */}
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
          <h3 className="font-medium">Pending</h3>
          <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full">
            {pendingTasks.length}
          </span>
        </div>
        <div className="space-y-3 min-h-[200px]">
          {pendingTasks.length === 0 ? (
            <div className="border border-dashed rounded-md p-4 text-center text-gray-500 text-sm">
              No pending tasks
            </div>
          ) : (
            pendingTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onView={onViewTask}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
                onStatusChange={onStatusChange}
                compact
              />
            ))
          )}
        </div>
      </div>

      {/* In Progress Column */}
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between bg-blue-100 p-2 rounded-md">
          <h3 className="font-medium text-blue-800">In Progress</h3>
          <span className="text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full">
            {inProgressTasks.length}
          </span>
        </div>
        <div className="space-y-3 min-h-[200px]">
          {inProgressTasks.length === 0 ? (
            <div className="border border-dashed rounded-md p-4 text-center text-gray-500 text-sm">
              No tasks in progress
            </div>
          ) : (
            inProgressTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onView={onViewTask}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
                onStatusChange={onStatusChange}
                compact
              />
            ))
          )}
        </div>
      </div>

      {/* Blocked Column */}
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between bg-amber-100 p-2 rounded-md">
          <h3 className="font-medium text-amber-800">Blocked</h3>
          <span className="text-xs bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full">
            {blockedTasks.length}
          </span>
        </div>
        <div className="space-y-3 min-h-[200px]">
          {blockedTasks.length === 0 ? (
            <div className="border border-dashed rounded-md p-4 text-center text-gray-500 text-sm">
              No blocked tasks
            </div>
          ) : (
            blockedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onView={onViewTask}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
                onStatusChange={onStatusChange}
                compact
              />
            ))
          )}
        </div>
      </div>

      {/* Completed Column */}
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between bg-green-100 p-2 rounded-md">
          <h3 className="font-medium text-green-800">Completed</h3>
          <span className="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded-full">
            {completedTasks.length}
          </span>
        </div>
        <div className="space-y-3 min-h-[200px]">
          {completedTasks.length === 0 ? (
            <div className="border border-dashed rounded-md p-4 text-center text-gray-500 text-sm">
              No completed tasks
            </div>
          ) : (
            completedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onView={onViewTask}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
                onStatusChange={onStatusChange}
                compact
              />
            ))
          )}
        </div>
      </div>

      {/* Failed Column */}
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between bg-red-100 p-2 rounded-md">
          <h3 className="font-medium text-red-800">Failed</h3>
          <span className="text-xs bg-red-200 text-red-800 px-2 py-0.5 rounded-full">
            {failedTasks.length}
          </span>
        </div>
        <div className="space-y-3 min-h-[200px]">
          {failedTasks.length === 0 ? (
            <div className="border border-dashed rounded-md p-4 text-center text-gray-500 text-sm">
              No failed tasks
            </div>
          ) : (
            failedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onView={onViewTask}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
                onStatusChange={onStatusChange}
                compact
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskKanban;
