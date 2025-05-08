
import React, { useState } from "react";
import { Task, TaskStatus } from "../../types";
import TaskCard from "./TaskCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import TaskDialog from "./TaskDialog";

interface TaskListProps {
  title: string;
  tasks: Task[];
  emptyMessage?: string;
  showAddButton?: boolean;
  onTaskUpdated: () => void;
  onDeleteTask?: (taskId: number) => void;
  onRemoveFromSpecial?: (taskId: number) => void;
  specialButtonLabel?: string;
}

const TaskList: React.FC<TaskListProps> = ({
  title,
  tasks,
  emptyMessage = "No tasks found",
  showAddButton = true,
  onTaskUpdated,
  onDeleteTask,
  onRemoveFromSpecial,
  specialButtonLabel,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  const handleOpenAddTask = () => {
    setEditingTask(null);
    setIsDialogOpen(true);
  };
  
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingTask(null);
  };
  
  const handleTaskSaved = () => {
    handleCloseDialog();
    onTaskUpdated();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        
        {showAddButton && (
          <Button onClick={handleOpenAddTask} size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Add Task
          </Button>
        )}
      </div>
      
      {!tasks || tasks.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">{emptyMessage}</p>
          
          {showAddButton && (
            <Button 
              variant="outline" 
              onClick={handleOpenAddTask}
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add your first task
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={handleEditTask}
              onDelete={onDeleteTask || (() => {})}
              onRemoveFromSpecial={onRemoveFromSpecial}
              specialButtonLabel={specialButtonLabel}
            />
          ))}
        </div>
      )}
      
      <TaskDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        task={editingTask}
        onSaved={handleTaskSaved}
      />
    </div>
  );
};

export default TaskList;
