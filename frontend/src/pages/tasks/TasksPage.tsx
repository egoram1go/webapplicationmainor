import React, { useState, useEffect } from "react";
import { useTasks } from "../../context/TasksContext";
import TaskList from "../../components/tasks/TaskList";
import TaskDialog from "../../components/tasks/TaskDialog";
import { Task, TaskStatus } from "../../types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TasksPageProps {
  title?: string;
  status?: TaskStatus;
}

const TasksPage: React.FC<TasksPageProps> = ({
  title = "All Tasks",
  status,
}) => {
  const { tasks, fetchTasks, deleteTask } = useTasks();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Filter tasks if a status is provided
  const filteredTasks = status
    ? tasks.filter((task) => task.status === status)
    : tasks;

  const handleDeleteTask = async (taskId: number) => {
    setShowDeleteConfirm(taskId);
    const confirmed = window.confirm("Are you sure you want to delete this task?");
    
    if (confirmed) {
      try {
        await deleteTask(taskId);
        fetchTasks();
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    }
    
    setShowDeleteConfirm(null);
  };

  const renderTaskList = () => {
    if (status) {
      return (
        <TaskList
          title={title}
          tasks={filteredTasks}
          onTaskUpdated={fetchTasks}
          onDeleteTask={handleDeleteTask}
        />
      );
    }

    // If no specific status is provided, show tabs for all task statuses
    const todoTasks = tasks.filter((task) => task.status === TaskStatus.TODO);
    const inProgressTasks = tasks.filter((task) => task.status === TaskStatus.IN_PROGRESS);
    const doneTasks = tasks.filter((task) => task.status === TaskStatus.DONE);

    return (
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="todo">To Do</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="done">Done</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <TaskList
            title="All Tasks"
            tasks={filteredTasks}
            onTaskUpdated={fetchTasks}
            onDeleteTask={handleDeleteTask}
          />
        </TabsContent>
        
        <TabsContent value="todo">
          <TaskList
            title="To Do Tasks"
            tasks={todoTasks}
            onTaskUpdated={fetchTasks}
            onDeleteTask={handleDeleteTask}
          />
        </TabsContent>
        
        <TabsContent value="in-progress">
          <TaskList
            title="In Progress Tasks"
            tasks={inProgressTasks}
            onTaskUpdated={fetchTasks}
            onDeleteTask={handleDeleteTask}
          />
        </TabsContent>
        
        <TabsContent value="done">
          <TaskList
            title="Done Tasks"
            tasks={doneTasks}
            onTaskUpdated={fetchTasks}
            onDeleteTask={handleDeleteTask}
          />
        </TabsContent>
      </Tabs>
    );
  };

  return <div>{renderTaskList()}</div>;
};

export default TasksPage;
