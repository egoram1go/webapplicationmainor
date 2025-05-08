package com.taskflow.repository;

import com.taskflow.entity.Task;
import com.taskflow.entity.Task.Status;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByUserId(Long userId);
    List<Task> findByUserIdAndStatus(Long userId, Status status);
    List<Task> findByStatus(Status status);
}
