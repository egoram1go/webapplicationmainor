
export interface User {
  id: number;
  username: string;
  email: string;
  tasks?: Task[];
}

export interface AuthResponse {
  token?: string;
  user?: User;
  id?: number;
  username?: string;
  email?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
  OFFERED = "OFFERED",
  CART = "CART"
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: string | null;
  priority?: string;
  userId: number;
  username?: string; 
  inCart?: boolean;
  offered?: boolean;
  comments: Comment[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  taskId: number;
  userId: number;
  username: string;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  status: TaskStatus.TODO;
  dueDate?: Date | string | null;
}

export interface UpdateTaskRequest {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate?: Date | string | null;
}

export interface CreateCommentRequest {
  content: string;
  taskId: number;
}

export interface UpdateCommentRequest {
  id: number;
  content: string;
}

export interface TaskResponseDto {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: string | null;
  priority?: string;
  userId: number;
  username?: string;
  inCart?: boolean;
  offered?: boolean;
  comments?: Comment[];
  createdAt?: string;
  updatedAt?: string;
}
