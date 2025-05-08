import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTasks } from "../../context/TasksContext";
import { Task, TaskStatus } from "../../types";
import CommentList from "../../components/tasks/CommentList";
import TaskForm from "../../components/tasks/TaskForm";
import { format, isValid } from "date-fns";
import { ArrowLeft, Calendar, Clock, Edit, Trash2, ShoppingCart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const TaskDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const taskId = parseInt(id || "0");
  const navigate = useNavigate();
  
  const { 
    tasks, 
    getTaskById, 
    updateTask, 
    deleteTask, 
    addToCart,
    removeFromCart,
    addToOffered,
    removeFromOffered
  } = useTasks();

  const [task, setTask] = useState<Task | undefined>(undefined);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const currentTask = getTaskById(taskId);
    setTask(currentTask);
  }, [taskId, tasks, getTaskById]);

  const formatDateSafe = (dateString?: string | Date) => {
    if (!dateString) return "N/A";
    
    const date = new Date(dateString);
    return isValid(date) ? format(date, "MMM d, yyyy") : "N/A";
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteTask(taskId);
      navigate(-1);
    } catch (error) {
      console.error("Error deleting task:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdateTask = async (updatedTask: any) => {
    setIsLoading(true);
    try {
      await updateTask(updatedTask);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating task:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!task) return;
    
    setIsUpdatingStatus(true);
    try {
      await addToCart(task.id);
      const updatedTask = getTaskById(task.id);
      setTask(updatedTask);
    } catch (error) {
      console.error("Error adding task to cart:", error);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleRemoveFromCart = async () => {
    if (!task) return;
    
    setIsUpdatingStatus(true);
    try {
      await removeFromCart(task.id);
      const updatedTask = getTaskById(task.id);
      setTask(updatedTask);
    } catch (error) {
      console.error("Error removing task from cart:", error);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleAddToOffered = async () => {
    if (!task) return;
    
    setIsUpdatingStatus(true);
    try {
      await addToOffered(task.id);
      const updatedTask = getTaskById(task.id);
      setTask(updatedTask);
    } catch (error) {
      console.error("Error adding task to offered:", error);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleRemoveFromOffered = async () => {
    if (!task) return;
    
    setIsUpdatingStatus(true);
    try {
      await removeFromOffered(task.id);
      const updatedTask = getTaskById(task.id);
      setTask(updatedTask);
    } catch (error) {
      console.error("Error removing task from offered:", error);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const isTaskInCart = task?.status === TaskStatus.CART;
  const isTaskOffered = task?.status === TaskStatus.OFFERED;

  const statusStyles = {
    [TaskStatus.TODO]: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    [TaskStatus.IN_PROGRESS]: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    [TaskStatus.DONE]: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    [TaskStatus.OFFERED]: "bg-taskflow-light-purple text-taskflow-darker-purple dark:bg-taskflow-purple/30 dark:text-taskflow-light-purple",
    [TaskStatus.CART]: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
  };

  if (!task) {
    return (
      <div className="text-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-taskflow-purple mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading task...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Task Details</h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-bold mb-2">{task.title}</h2>
            <Badge className={statusStyles[task.status]}>
              {task.status.replace("_", " ")}
            </Badge>
          </div>
          
          <div className="flex space-x-2">
            {/* Special status buttons */}
            {!isTaskInCart && !isTaskOffered && (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleAddToCart}
                  disabled={isUpdatingStatus}
                >
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  Add to Cart
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleAddToOffered}
                  disabled={isUpdatingStatus}
                >
                  <Share2 className="h-4 w-4 mr-1" />
                  Offer Task
                </Button>
              </>
            )}
            
            {isTaskInCart && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRemoveFromCart}
                disabled={isUpdatingStatus}
              >
                <ShoppingCart className="h-4 w-4 mr-1" />
                Remove from Cart
              </Button>
            )}
            
            {isTaskOffered && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRemoveFromOffered}
                disabled={isUpdatingStatus}
              >
                <Share2 className="h-4 w-4 mr-1" />
                Remove from Offered
              </Button>
            )}
            
            {/* Edit and Delete buttons */}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleEdit}
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <span className="flex items-center">
                  <span className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent border-white rounded-full"></span>
                  Deleting...
                </span>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </>
              )}
            </Button>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-x-6 gap-y-2 mb-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            Created: {formatDateSafe(task.createdAt)}
          </div>

          {task.updatedAt && task.updatedAt !== task.createdAt && (
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              Updated: {formatDateSafe(task.updatedAt)}
            </div>
          )}

          {task.dueDate && (
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              Due: {formatDateSafe(task.dueDate)}
            </div>
          )}
        </div>
        
        <div className="mb-8 whitespace-pre-wrap bg-gray-50 dark:bg-gray-900 p-4 rounded-md">
          {task.description}
        </div>
        
        <div className="border-t pt-6">
          <CommentList taskId={task.id} comments={task.comments || []} />
        </div>
      </div>
      
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          
          <TaskForm
            onSubmit={handleUpdateTask}
            defaultValues={task}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaskDetailPage;