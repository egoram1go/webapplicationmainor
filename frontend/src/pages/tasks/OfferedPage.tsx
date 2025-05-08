import React, { useEffect } from "react";
import { useTasks } from "../../context/TasksContext";
import TaskList from "../../components/tasks/TaskList";
import { TaskStatus } from "../../types";
import { Share2 } from "lucide-react";

const OfferedPage: React.FC = () => {
  const { offeredTasks, fetchTasks, deleteTask, offerTask, unofferTask } = useTasks();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this offered task?")) {
      await deleteTask(id);
      fetchTasks();
    }
  };
  
  const handleUnofferTask = async (id: number) => {
    try {
      await unofferTask(id);
      fetchTasks();
    } catch (error) {
      console.error("Failed to unoffer task:", error);
    }
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <Share2 className="h-6 w-6 mr-2 text-taskflow-purple" />
        <h1 className="text-2xl font-bold">Offered Tasks</h1>
      </div>
      
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        These tasks are marked as offered for potential delegation or sharing with team members.
      </p>
      
      <TaskList
        title="Offered Tasks"
        tasks={offeredTasks}
        emptyMessage="No tasks have been offered yet."
        onTaskUpdated={fetchTasks}
        onDeleteTask={handleDelete}
        onRemoveFromSpecial={handleUnofferTask}
        specialButtonLabel="Unoffer Task"
      />
    </div>
  );
};

export default OfferedPage;