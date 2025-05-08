import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { TasksProvider } from "./context/TasksContext";
import { ThemeProvider } from "./context/ThemeContext";

// Layouts
import MainLayout from "./components/layout/MainLayout";

// Auth pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// App pages
import Dashboard from "./pages/Dashboard";
import TasksPage from "./pages/tasks/TasksPage";
import TaskDetailPage from "./pages/tasks/TaskDetailPage";
import CartPage from "./pages/tasks/CartPage";
import OfferedPage from "./pages/tasks/OfferedPage";
import NotFound from "./pages/NotFound";
import { TaskStatus } from "./types";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <TasksProvider>
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected routes */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <MainLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Dashboard />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="tasks" element={<TasksPage />} />
                  <Route
                    path="tasks/todo"
                    element={<TasksPage title="To Do Tasks" status={TaskStatus.TODO} />}
                  />
                  <Route
                    path="tasks/in-progress"
                    element={<TasksPage title="In Progress Tasks" status={TaskStatus.IN_PROGRESS} />}
                  />
                  <Route
                    path="tasks/done"
                    element={<TasksPage title="Done Tasks" status={TaskStatus.DONE} />}
                  />
                  <Route path="tasks/:id" element={<TaskDetailPage />} />
                  <Route path="cart" element={<CartPage />} />
                  <Route path="offered" element={<OfferedPage />} />
                </Route>

                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </TasksProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
