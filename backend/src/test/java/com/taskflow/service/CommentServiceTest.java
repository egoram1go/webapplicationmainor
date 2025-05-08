package com.taskflow.service;

import com.taskflow.entity.Comment;
import com.taskflow.repository.CommentRepository;
import com.taskflow.repository.TaskRepository;
import com.taskflow.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class CommentServiceTest {

    private CommentRepository commentRepository;
    private TaskRepository taskRepository;
    private CommentService commentService;

    @BeforeEach
    void setup() {
        commentRepository = mock(CommentRepository.class);
        taskRepository = mock(TaskRepository.class);
        commentService = new CommentService(commentRepository, taskRepository);
    }

    @Test
    void createComment_ShouldReturnSavedComment() {
        Comment comment = new Comment();
        comment.setContent("Test comment");

        when(commentRepository.save(comment)).thenReturn(comment);

        Comment saved = commentService.createComment(comment);

        assertThat(saved.getContent()).isEqualTo("Test comment");
        verify(commentRepository).save(comment);
    }
}
