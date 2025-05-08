import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTasks } from "../context/TasksContext";
import { useAuth } from "../context/AuthContext";
import { TaskStatus, Task } from "../types";
import TaskDialog from "../components/tasks/TaskDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckSquare,
  Clock,
  ListTodo,
  Plus,
  ShoppingCart,
  Share2,
} from "lucide-react";
import TaskCard from "../components/tasks/TaskCard";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { toast } from "sonner"; // Assuming you're using Sonner for toasts

const STATUS_COLUMNS = [
  {
    status: TaskStatus.TODO,
    title: "To Do",
    icon: <ListTodo className="h-4 w-4 text-yellow-500" />,
    color: "bg-yellow-500"
  },
  {
    status: TaskStatus.IN_PROGRESS,
    title: "In Progress",
    icon: <Clock className="h-4 w-4 text-blue-500" />,
    color: "bg-blue-500"
  },
  {
    status: TaskStatus.DONE,
    title: "Done",
    icon: <CheckSquare className="h-4 w-4 text-green-500" />,
    color: "bg-green-500"
  },
];

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const {
    tasks,
    loading,
    fetchTasks,
    getTasksByStatus,
    updateTaskStatus,
    deleteTask,
    addToCart,
    offerTask,
    removeFromCart,
    unofferTask
  } = useTasks();
  
  const navigate = useNavigate();
  const [showTaskDialog, setShowTaskDialog] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<Task | null>(null);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskDialog(true);
  };

  const handleDeleteTask = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(id);
        toast.success("Task deleted successfully");
      } catch (error) {
        toast.error("Failed to delete task");
      }
    }
  };

  const handleAddToCart = async (id: number) => {
    try {
      await addToCart(id);
      toast.success("Task added to cart");
    } catch (error) {
      toast.error("Failed to add task to cart");
    }
  };

  const handleRemoveFromCart = async (id: number) => {
    try {
      await removeFromCart(id);
      toast.success("Task removed from cart");
    } catch (error) {
      toast.error("Failed to remove task from cart");
    }
  };

  const handleOfferTask = async (id: number) => {
    try {
      await offerTask(id);
      toast.success("Task offered successfully");
    } catch (error) {
      toast.error("Failed to offer task");
    }
  };

  const handleUnofferTask = async (id: number) => {
    try {
      await unofferTask(id);
      toast.success("Task unoffered successfully");
    } catch (error) {
      toast.error("Failed to unoffer task");
    }
  };

  const handleTaskSaved = () => {
    setShowTaskDialog(false);
    setEditingTask(null);
    fetchTasks();
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }

    const taskId = parseInt(draggableId);
    const newStatus = destination.droppableId as TaskStatus;
    
    updateTaskStatus(taskId, newStatus).catch(error => {
      console.error("Failed to update task status:", error);
      toast.error("Failed to update task status");
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">Welcome, {user?.username || 'User'}!</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Here's an overview of your tasks
      </p>

      <div className="flex flex-wrap gap-2 mb-8">
        <Button onClick={() => { setEditingTask(null); setShowTaskDialog(true); }}>
          <Plus className="mr-1 h-4 w-4" /> New Task
        </Button>
        <Button variant="outline" onClick={() => navigate("/tasks")}>
          View All Tasks
        </Button>
        <Button variant="outline" onClick={() => navigate("/cart")} className="flex items-center">
          <ShoppingCart className="h-4 w-4 mr-2" /> Cart
        </Button>
        <Button variant="outline" onClick={() => navigate("/offered")} className="flex items-center">
          <Share2 className="h-4 w-4 mr-2" /> Offered
        </Button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {STATUS_COLUMNS.map((column) => {
            const columnTasks = getTasksByStatus(column.status);
            
            return (
              <Droppable key={column.status} droppableId={column.status}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 min-h-[200px]"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-medium flex items-center">
                        <div className={`w-3 h-3 ${column.color} rounded-full mr-2`}></div>
                        {column.title}
                      </h2>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {columnTasks.length}
                      </span>
                    </div>
                    
                    {loading ? (
                      <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                          <Card key={i} className="h-24 animate-pulse" />
                        ))}
                      </div>
                    ) : columnTasks.length === 0 ? (
                      <Card className="border-dashed border-2 border-muted">
                        <CardContent className="p-4 text-center text-muted-foreground">
                          <p>No tasks</p>
                        </CardContent>
                      </Card>
                    ) : (
                      <div className="space-y-3">
                        {columnTasks.map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <TaskCard
                                  task={task}
                                  onEdit={handleEditTask}
                                  onDelete={handleDeleteTask}
                                  showCartButton={task.status !== TaskStatus.CART}
                                  showOfferButton={task.status !== TaskStatus.OFFERED}
                                  onAddToCart={handleAddToCart}
                                  onOfferTask={handleOfferTask}
                                  onRemoveFromSpecial={
                                    task.status === TaskStatus.CART ? handleRemoveFromCart : 
                                    task.status === TaskStatus.OFFERED ? handleUnofferTask : 
                                    undefined
                                  }
                                  specialButtonLabel={
                                    task.status === TaskStatus.CART ? "Remove from Cart" : 
                                    task.status === TaskStatus.OFFERED ? "Unoffer Task" : 
                                    undefined
                                  }
                                />
                              </div>
                            )}
                          </Draggable>
                        ))}
                      </div>
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            );
          })}
        </div>
      </DragDropContext>
      
      <TaskDialog
        open={showTaskDialog}
        onOpenChange={setShowTaskDialog}
        task={editingTask}
        onSaved={handleTaskSaved}
      />
    </div>
  );
};

export default Dashboard;