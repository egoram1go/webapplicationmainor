package com.taskflow.service;

import com.taskflow.entity.Task;
import com.taskflow.entity.Task.Status;
import com.taskflow.repository.TaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class TaskServiceTest {

    private TaskRepository repo;
    private TaskService service;

    @BeforeEach
    void setup() {
        repo = mock(TaskRepository.class);
        service = new TaskService(repo);
    }

    @Test
    void addToCart_ShouldSetStatusToCart() {
        Task task = new Task();
        task.setId(1L);
        task.setStatus(Status.TODO);

        when(repo.findById(1L)).thenReturn(Optional.of(task));
        when(repo.save(task)).thenReturn(task);

        Optional<Task> updated = service.addToCart(1L);

        assertThat(updated).isPresent();
        assertThat(updated.get().getStatus()).isEqualTo(Status.CART);
        verify(repo).save(task);
    }
}
