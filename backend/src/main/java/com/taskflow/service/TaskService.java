package com.taskflow.service;

import com.taskflow.entity.Task;
import com.taskflow.entity.Task.Status;
import com.taskflow.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaskService {
    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public List<Task> getTasksForUser(Long userId) {
        return taskRepository.findByUserId(userId);
    }

    public List<Task> getCartTasks(Long userId) {
        return taskRepository.findByUserIdAndStatus(userId, Status.CART);
    }

    public List<Task> getOfferedTasks(Long userId) {
        return taskRepository.findByUserIdAndStatus(userId, Status.OFFERED);
    }

    public Task save(Task task) {
        return taskRepository.save(task);
    }

    public void delete(Long taskId) {
        taskRepository.deleteById(taskId);
    }

    public Optional<Task> findById(Long taskId) {
        return taskRepository.findById(taskId);
    }

    public Optional<Task> addToCart(Long id) {
        return taskRepository.findById(id).map(task -> {
            task.setStatus(Status.CART);
            return taskRepository.save(task);
        });
    }

    public Optional<Task> removeFromCart(Long id) {
        return taskRepository.findById(id).map(task -> {
            // Decide what status to set when removing from cart
            // For example, set it back to TODO
            task.setStatus(Status.TODO);
            return taskRepository.save(task);
        });
    }

    public Optional<Task> addToOffered(Long id) {
        return taskRepository.findById(id).map(task -> {
            task.setStatus(Status.OFFERED);
            return taskRepository.save(task);
        });
    }

    public Optional<Task> removeFromOffered(Long id) {
        return taskRepository.findById(id).map(task -> {
            // Decide what status to set when removing from offered
            // For example, set it back to TODO
            task.setStatus(Status.TODO);
            return taskRepository.save(task);
        });
    }

    // Additional helper methods for status management
    public Optional<Task> updateStatus(Long id, Status status) {
        return taskRepository.findById(id).map(task -> {
            task.setStatus(status);
            return taskRepository.save(task);
        });
    }

    public List<Task> getTasksByStatus(Status status) {
        return taskRepository.findByStatus(status);
    }
}