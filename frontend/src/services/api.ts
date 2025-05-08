import axios from "axios";
import { 
  AuthResponse, 
  LoginRequest, 
  RegisterRequest, 
  Task,
  CreateTaskRequest, 
  UpdateTaskRequest, 
  Comment, 
  CreateCommentRequest, 
  UpdateCommentRequest,
  TaskStatus,
  TaskResponseDto
} from "../types";
import { transformTask, transformTaskList, transformComment } from "./apiTransformers";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (loginRequest: LoginRequest) =>
    api.post<AuthResponse>("/auth/login", loginRequest),
  
  register: (registerRequest: RegisterRequest) =>
    api.post<AuthResponse>("/auth/signup", registerRequest),
  
  getCurrentUser: () => 
    api.get<AuthResponse>("/auth/me", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      }
    }),
};

export const tasksApi = {
  getAllTasks: async (): Promise<Task[]> => {
    const response = await api.get<TaskResponseDto[]>("/tasks");
    return transformTaskList(response.data);
  },
  
  getTaskById: async (id: number): Promise<Task> => {
    const response = await api.get<TaskResponseDto>(`/tasks/${id}`);
    return transformTask(response.data);
  },
  
  createTask: async (task: CreateTaskRequest): Promise<Task> => {
    const response = await api.post<TaskResponseDto>("/tasks", task);
    return transformTask(response.data);
  },
  
  updateTask: async (task: UpdateTaskRequest): Promise<Task> => {
    const response = await api.put<TaskResponseDto>(`/tasks/${task.id}`, task);
    return transformTask(response.data);
  },
  
  deleteTask: async (id: number): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },
  
  getTasksByStatus: async (status: TaskStatus): Promise<Task[]> => {
    const response = await api.get<TaskResponseDto[]>(`/tasks?status=${status}`);
    return transformTaskList(response.data);
  },
  
  updateStatus: async (id: number, status: TaskStatus): Promise<Task> => {
    const response = await api.patch<TaskResponseDto>(`/tasks/${id}/status`, { status });
    return transformTask(response.data);
  },
  
  getTasksInCart: async (): Promise<Task[]> => {
    const response = await api.get<TaskResponseDto[]>("/tasks/cart");
    return transformTaskList(response.data);
  },
  
  getOfferedTasks: async (): Promise<Task[]> => {
    const response = await api.get<TaskResponseDto[]>("/tasks/offered");
    return transformTaskList(response.data);
  },
  
  addToCart: async (id: number): Promise<void> => {
    await api.put(`/tasks/${id}/cart/add`);
  },
  
  removeFromCart: async (id: number): Promise<void> => {
    await api.put(`/tasks/${id}/cart/remove`);
  },
  
  offerTask: async (id: number): Promise<void> => {
    await api.put(`/tasks/${id}/offered/add`);
  },
  
  unofferTask: async (id: number): Promise<void> => {
    await api.put(`/tasks/${id}/offered/remove`);
  }
};

export const commentsApi = {
  getCommentsByTaskId: async (taskId: number): Promise<Comment[]> => {
    const response = await api.get<Comment[]>(`/comments/task/${taskId}`);
    return response.data.map(transformComment);
  },
  
  createComment: async (comment: CreateCommentRequest): Promise<Comment> => {
    const response = await api.post<Comment>("/comments", comment);
    return transformComment(response.data);
  },
  
  updateComment: async (comment: UpdateCommentRequest): Promise<Comment> => {
    const response = await api.put<Comment>(`/comments/${comment.id}`, comment);
    return transformComment(response.data);
  },
  
  deleteComment: async (id: number): Promise<void> => {
    await api.delete(`/comments/${id}`);
  }
};

export default api;