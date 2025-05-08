import React from "react";
import { Link } from "react-router-dom";
import { Task, TaskStatus } from "../../types";
import { format, isValid, parseISO } from "date-fns";
import { Edit, Trash2, X, ShoppingCart, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
  onRemoveFromSpecial?: (taskId: number) => void;
  specialButtonLabel?: string;
  showCartButton?: boolean;
  showOfferButton?: boolean;
  onAddToCart?: (taskId: number) => void;
  onOfferTask?: (taskId: number) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  onEdit, 
  onDelete, 
  onRemoveFromSpecial,
  specialButtonLabel,
  showCartButton = false,
  showOfferButton = false,
  onAddToCart,
  onOfferTask
}) => {
  const statusColors = {
    [TaskStatus.TODO]: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    [TaskStatus.IN_PROGRESS]: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    [TaskStatus.DONE]: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  };

  const priorityColors = {
    HIGH: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    MEDIUM: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    LOW: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  };

  const statusLabels = {
    [TaskStatus.TODO]: "To Do",
    [TaskStatus.IN_PROGRESS]: "In Progress",
    [TaskStatus.DONE]: "Done",
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    
    try {
      const date = parseISO(dateString);
      if (!isValid(date)) return null;
      return format(date, "MMM d, yyyy");
    } catch (error) {
      console.error("Invalid date format:", dateString);
      return null;
    }
  };

  const formattedDueDate = task.dueDate ? formatDate(task.dueDate) : null;
  const formattedCreatedDate = formatDate(task.createdAt);

  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-lg">
            <Link to={`/tasks/${task.id}`} className="hover:text-taskflow-purple dark:hover:text-taskflow-light-purple">
              {task.title}
            </Link>
          </CardTitle>
          <div className="flex gap-2">
            {task.priority && (
              <Badge variant="outline" className={priorityColors[task.priority]}>
                {task.priority}
              </Badge>
            )}
            {statusLabels[task.status] && (
              <Badge variant="outline" className={statusColors[task.status]}>
                {statusLabels[task.status]}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1">
        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
          {task.description}
        </p>
        
        <div className="mt-3 flex items-center text-xs text-gray-500 dark:text-gray-400">
          {task.comments && task.comments.length > 0 && (
            <span className="mr-3">{task.comments.length} comments</span>
          )}
          
          {formattedDueDate && (
            <span>Due: {formattedDueDate}</span>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-2 flex flex-col gap-2 border-t border-gray-100 dark:border-gray-800">
        <div className="flex justify-between w-full">
          <div className="flex gap-2">
            {showCartButton && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onAddToCart?.(task.id)}
                className="text-xs"
              >
                <ShoppingCart className="h-3 w-3 mr-1" />
                Add to Cart
              </Button>
            )}
            
            {showOfferButton && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onOfferTask?.(task.id)}
                className="text-xs"
              >
                <Share2 className="h-3 w-3 mr-1" />
                Offer Task
              </Button>
            )}
            
            {onRemoveFromSpecial && specialButtonLabel && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onRemoveFromSpecial(task.id)}
                className="text-xs"
              >
                <X className="h-3 w-3 mr-1" />
                {specialButtonLabel}
              </Button>
            )}
          </div>
          
          <div className="flex space-x-1">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onEdit(task)}
              className="h-8 w-8"
              aria-label="Edit task"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onDelete(task.id)}
              className="h-8 w-8 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              aria-label="Delete task"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="w-full text-xs text-gray-500 dark:text-gray-400 text-left">
          {formattedCreatedDate ? `Created: ${formattedCreatedDate}` : ''}
        </div>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;