import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import { tasksApi, commentsApi } from "@/services/api";
import { Task, Comment, CreateTaskRequest, UpdateTaskRequest, CreateCommentRequest, UpdateCommentRequest, TaskStatus } from "@/types";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";

interface TasksContextType {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  getTaskById: (id: number) => Task | undefined;
  getTasksByStatus: (status: TaskStatus) => Task[];
  cartTasks: Task[];
  offeredTasks: Task[];
  createTask: (task: CreateTaskRequest) => Promise<Task>;
  updateTask: (task: UpdateTaskRequest) => Promise<Task>;
  deleteTask: (id: number) => Promise<void>;
  addToCart: (id: number) => Promise<void>;
  removeFromCart: (id: number) => Promise<void>;
  offerTask: (id: number) => Promise<void>;
  unofferTask: (id: number) => Promise<void>;
  updateTaskStatus: (id: number, status: TaskStatus) => Promise<void>;
  addComment: (comment: CreateCommentRequest) => Promise<Comment>;
  updateComment: (comment: UpdateCommentRequest) => Promise<Comment>;
  deleteComment: (id: number) => Promise<void>;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export const TasksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const cartTasks = tasks.filter(task => task.status === TaskStatus.CART);
  const offeredTasks = tasks.filter(task => task.status === TaskStatus.OFFERED);

  const fetchTasks = useCallback(async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const fetchedTasks = await tasksApi.getAllTasks();
      setTasks(fetchedTasks);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      setError("Failed to fetch tasks. Please try again later.");
      toast.error("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const getTaskById = useCallback((id: number): Task | undefined => {
    return tasks.find(task => task.id === id);
  }, [tasks]);

  const getTasksByStatus = useCallback((status: TaskStatus): Task[] => {
    return tasks.filter(task => task.status === status);
  }, [tasks]);

  const createTask = async (task: CreateTaskRequest): Promise<Task> => {
    try {
      const createdTask = await tasksApi.createTask(task);
      await fetchTasks();
      toast.success("Task created successfully");
      return createdTask;
    } catch (error) {
      console.error("Failed to create task:", error);
      toast.error("Failed to create task");
      throw error;
    }
  };

  const updateTask = async (task: UpdateTaskRequest): Promise<Task> => {
    try {
      const updatedTask = await tasksApi.updateTask(task);
      setTasks(prev => prev.map(t => t.id === task.id ? updatedTask : t));
      toast.success("Task updated successfully");
      return updatedTask;
    } catch (error) {
      console.error("Failed to update task:", error);
      toast.error("Failed to update task");
      throw error;
    }
  };

  const updateTaskStatus = async (id: number, status: TaskStatus): Promise<void> => {
    try {
      await tasksApi.updateStatus(id, status);
      setTasks(prev => prev.map(task => 
        task.id === id ? { ...task, status } : task
      ));
    } catch (error) {
      console.error(`Failed to update task status to ${status}:`, error);
      throw error;
    }
  };

  const deleteTask = async (id: number): Promise<void> => {
    try {
      await tasksApi.deleteTask(id);
      setTasks(prev => prev.filter(task => task.id !== id));
      toast.success("Task deleted successfully");
    } catch (error) {
      console.error("Failed to delete task:", error);
      toast.error("Failed to delete task");
      throw error;
    }
  };

  const addToCart = async (id: number): Promise<void> => {
    try {
      await tasksApi.addToCart(id);
      await fetchTasks();
      toast.success("Task added to cart");
    } catch (error) {
      console.error("Failed to add task to cart:", error);
      toast.error("Failed to add task to cart");
      throw error;
    }
  };
  
  const removeFromCart = async (id: number): Promise<void> => {
    try {
      await tasksApi.removeFromCart(id);
      await fetchTasks();
      toast.success("Task removed from cart");
    } catch (error) {
      console.error("Failed to remove task from cart:", error);
      toast.error("Failed to remove task from cart");
      throw error;
    }
  };
  
  const offerTask = async (id: number): Promise<void> => {
    try {
      await tasksApi.offerTask(id);
      await fetchTasks();
      toast.success("Task offered successfully");
    } catch (error) {
      console.error("Failed to offer task:", error);
      toast.error("Failed to offer task");
      throw error;
    }
  };
  
  const unofferTask = async (id: number): Promise<void> => {
    try {
      await tasksApi.unofferTask(id);
      await fetchTasks();
      toast.success("Task unoffered successfully");
    } catch (error) {
      console.error("Failed to unoffer task:", error);
      toast.error("Failed to unoffer task");
      throw error;
    }
  };  

  const addComment = async (comment: CreateCommentRequest): Promise<Comment> => {
    try {
      const newComment = await commentsApi.createComment(comment);
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === comment.taskId 
            ? { 
                ...task, 
                comments: [...(task.comments || []), newComment] 
              } 
            : task
        )
      );
      toast.success("Comment added successfully");
      return newComment;
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
      throw error;
    }
  };

  const updateComment = async (comment: UpdateCommentRequest): Promise<Comment> => {
    try {
      const updatedComment = await commentsApi.updateComment(comment);
      setTasks(prevTasks =>
        prevTasks.map(task => ({
          ...task,
          comments: task.comments?.map(c => 
            c.id === comment.id ? updatedComment : c
          ) || []
        }))
      );
      toast.success("Comment updated successfully");
      return updatedComment;
    } catch (error) {
      console.error("Failed to update comment:", error);
      toast.error("Failed to update comment");
      throw error;
    }
  };

  const deleteComment = async (id: number): Promise<void> => {
    try {
      await commentsApi.deleteComment(id);
      setTasks(prevTasks =>
        prevTasks.map(task => ({
          ...task,
          comments: task.comments?.filter(c => c.id !== id) || []
        }))
      );
      toast.success("Comment deleted successfully");
    } catch (error) {
      console.error("Failed to delete comment:", error);
      toast.error("Failed to delete comment");
      throw error;
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <TasksContext.Provider
      value={{
        tasks,
        loading,
        error,
        cartTasks,
        offeredTasks,
        fetchTasks,
        getTaskById,
        getTasksByStatus,
        createTask,
        updateTask,
        deleteTask,
        addToCart,
        removeFromCart,
        offerTask,
        unofferTask,
        updateTaskStatus,
        addComment,
        updateComment,
        deleteComment
      }}
    >
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TasksContext);
  if (context === undefined) {
    throw new Error("useTasks must be used within a TasksProvider");
  }
  return context;
};