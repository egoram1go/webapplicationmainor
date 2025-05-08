package com.taskflow.repository;

import com.taskflow.entity.Task;
import com.taskflow.entity.Task.Status;
import com.taskflow.entity.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

public class TaskRepositoryTest extends AbstractPostgresContainerTest {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    @Test
    void shouldFindTasksByUserIdAndStatus() {
        User user = userRepository.save(User.builder()
                .username("alice")
                .email("alice@example.com")
                .password("pass")
                .build());

        Task task = Task.builder()
                .title("Test Task")
                .description("Integration test task")
                .dueDate(LocalDateTime.now().plusDays(3))
                .priority("HIGH")
                .status(Status.TODO)
                .user(user)
                .build();

        taskRepository.save(task);

        List<Task> found = taskRepository.findByUserIdAndStatus(user.getId(), Status.TODO);
        assertThat(found).isNotEmpty();
        assertThat(found.get(0).getTitle()).isEqualTo("Test Task");
    }
}
