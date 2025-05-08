import { Task, TaskResponseDto, Comment } from "../types";

export const transformTask = (dto: TaskResponseDto): Task => ({
  id: dto.id,
  title: dto.title,
  description: dto.description,
  status: dto.status,
  dueDate: dto.dueDate,
  userId: dto.userId,
  comments: dto.comments || [],
  createdAt: dto.createdAt || new Date().toISOString(),
  updatedAt: dto.updatedAt || new Date().toISOString()
});

export const transformTaskList = (dtos: TaskResponseDto[]): Task[] => 
  dtos.map(transformTask);

export const transformComment = (dto: any): Comment => ({
  id: dto.id,
  content: dto.content,
  createdAt: dto.createdAt,
  updatedAt: dto.updatedAt,
  taskId: dto.taskId,
  userId: dto.userId,
  username: dto.username
});