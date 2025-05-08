import React, { useEffect } from "react";
import { useTasks } from "../../context/TasksContext";
import TaskList from "../../components/tasks/TaskList";
import { TaskStatus } from "../../types";
import { ShoppingCart } from "lucide-react";

const CartPage: React.FC = () => {
  const { cartTasks, fetchTasks, deleteTask, addToCart, removeFromCart } = useTasks();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this task from your cart?")) {
      await deleteTask(id);
      fetchTasks();
    }
  };
  
  const handleRemoveFromCart = async (id: number) => {
    try {
      await removeFromCart(id);
      fetchTasks();
    } catch (error) {
      console.error("Failed to remove task from cart:", error);
    }
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <ShoppingCart className="h-6 w-6 mr-2 text-taskflow-purple" />
        <h1 className="text-2xl font-bold">Task Cart</h1>
      </div>
      
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Use the cart to temporarily store tasks you're planning to work on soon.
      </p>
      
      <TaskList
        title="Tasks in Cart"
        tasks={cartTasks}
        emptyMessage="Your cart is empty. Add tasks to your cart for temporary organization."
        onTaskUpdated={fetchTasks}
        onDeleteTask={handleDelete}
        onRemoveFromSpecial={handleRemoveFromCart}
        specialButtonLabel="Remove from Cart"
      />
    </div>
  );
};

export default CartPage;