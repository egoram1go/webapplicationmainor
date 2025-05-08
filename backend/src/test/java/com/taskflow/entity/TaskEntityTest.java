package com.taskflow.entity;

import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

public class TaskEntityTest {

    @Test
    void shouldCreateTaskWithBuilderAndUser() {
        User user = User.builder()
                .username("jane")
                .email("jane@example.com")
                .password("pass")
                .build();

        Task task = Task.builder()
                .title("Write tests")
                .description("Unit test Task entity")
                .dueDate(LocalDateTime.now().plusDays(1))
                .priority("HIGH")
                .status(Task.Status.TODO)
                .user(user)
                .build();

        assertThat(task.getTitle()).isEqualTo("Write tests");
        assertThat(task.getUser()).isEqualTo(user);
    }
}
