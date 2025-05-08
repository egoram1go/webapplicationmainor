
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CheckSquare,
  ShoppingCart,
  ListTodo,
  Clock,
  Share2,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, collapsed }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 px-3 py-2 rounded-md transition-all",
          "hover:bg-gray-100 dark:hover:bg-gray-800",
          isActive
            ? "bg-taskflow-purple/10 text-taskflow-purple dark:bg-taskflow-purple/20 dark:text-taskflow-light-purple font-medium"
            : "text-gray-700 dark:text-gray-300",
          collapsed && "justify-center px-2"
        )
      }
    >
      {icon}
      {!collapsed && <span>{label}</span>}
    </NavLink>
  );
};

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700",
        "transition-all duration-300 ease-in-out z-10",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="h-full flex flex-col">
        <div className={cn(
          "h-16 flex items-center px-4 border-b border-gray-200 dark:border-gray-700",
          collapsed ? "justify-center" : "justify-between"
        )}>
          {!collapsed && (
            <NavLink to="/dashboard" className="flex items-center">
              <span className="text-xl font-bold text-taskflow-purple dark:text-taskflow-light-purple">
                Taskflow
              </span>
            </NavLink>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="rounded-full"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </Button>
        </div>
        
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          <NavItem
            to="/dashboard"
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
            collapsed={collapsed}
          />
          <NavItem
            to="/tasks"
            icon={<ListTodo size={20} />}
            label="All Tasks"
            collapsed={collapsed}
          />
          <NavItem
            to="/tasks/todo"
            icon={<CheckSquare size={20} />}
            label="To Do"
            collapsed={collapsed}
          />
          <NavItem
            to="/tasks/in-progress"
            icon={<Clock size={20} />}
            label="In Progress"
            collapsed={collapsed}
          />
          <NavItem
            to="/cart"
            icon={<ShoppingCart size={20} />}
            label="Task Cart"
            collapsed={collapsed}
          />
          <NavItem
            to="/offered"
            icon={<Share2 size={20} />}
            label="Offered Tasks"
            collapsed={collapsed}
          />
        </nav>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <NavItem
            to="/settings"
            icon={<Settings size={20} />}
            label="Settings"
            collapsed={collapsed}
          />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
