import React, { useState } from "react";
import { Task, CreateTaskRequest, UpdateTaskRequest } from "../../types";
import { useTasks } from "../../context/TasksContext";
import TaskForm from "./TaskForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
  onSaved: (task: Task) => void;
}

const TaskDialog: React.FC<TaskDialogProps> = ({
  open,
  onOpenChange,
  task,
  onSaved
}) => {
  const { createTask, updateTask } = useTasks();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (
    data: CreateTaskRequest | UpdateTaskRequest
  ): Promise<void> => {
    setIsLoading(true);
    try {
      const result = "id" in data
        ? await updateTask(data as UpdateTaskRequest)
        : await createTask(data as CreateTaskRequest);

      onSaved(result);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to save task:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {task ? "Edit Task" : "Create New Task"}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
        </DialogDescription>
        <TaskForm
          onSubmit={handleSubmit}
          defaultValues={task || undefined}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
};

export default TaskDialog;
