package com.taskflow.repository;

import com.taskflow.entity.Comment;
import com.taskflow.entity.Task;
import com.taskflow.entity.User;
import com.taskflow.entity.Task.Status;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

public class CommentRepositoryTest extends AbstractPostgresContainerTest {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    @Test
    void shouldSaveCommentLinkedToTaskAndUser() {
        User user = userRepository.save(User.builder()
                .username("bob")
                .email("bob@example.com")
                .password("1234")
                .build());

        Task task = taskRepository.save(Task.builder()
                .title("Task with comment")
                .description("Desc")
                .dueDate(LocalDateTime.now().plusDays(1))
                .priority("MEDIUM")
                .status(Status.IN_PROGRESS)
                .user(user)
                .build());

        Comment comment = Comment.builder()
                .content("Test comment")
                .task(task)
                .author(user)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        commentRepository.save(comment);

        List<Comment> comments = commentRepository.findAll();
        assertThat(comments).hasSize(1);
        assertThat(comments.get(0).getContent()).isEqualTo("Test comment");
    }
}
