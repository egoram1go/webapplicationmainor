package com.taskflow.entity;

import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

public class CommentEntityTest {

    @Test
    void shouldSetTimestampsOnPersist() {
        Comment comment = new Comment();
        comment.onCreate();

        assertThat(comment.getCreatedAt()).isNotNull();
        assertThat(comment.getUpdatedAt()).isNotNull();
    }

    @Test
    void shouldUpdateTimestampOnUpdate() {
        Comment comment = new Comment();
        comment.onCreate(); // Simulate persist

        LocalDateTime firstUpdate = comment.getUpdatedAt();
        try {
            Thread.sleep(10); // simulate delay
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        comment.onUpdate();
        assertThat(comment.getUpdatedAt()).isAfter(firstUpdate);
    }

    @Test
    void shouldCreateCommentLinkedToTaskAndUser() {
        User user = User.builder().username("bob").email("bob@test.com").password("123").build();
        Task task = Task.builder().title("My task").user(user).build();

        Comment comment = Comment.builder()
                .content("Nice work")
                .task(task)
                .author(user)
                .build();

        assertThat(comment.getTask()).isEqualTo(task);
        assertThat(comment.getAuthor()).isEqualTo(user);
    }
}
