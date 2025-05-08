package com.taskflow.dto.response;

import com.taskflow.entity.Task;
import org.junit.jupiter.api.Test;
import java.time.LocalDateTime;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;

class TaskResponseDtoTest {

    @Test
    void testTaskResponseDto() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime dueDate = now.plusDays(7);

        CommentResponseDto comment = new CommentResponseDto();
        comment.setId(1L);
        comment.setContent("First comment");

        TaskResponseDto task = new TaskResponseDto();
        task.setId(1L);
        task.setTitle("Test Task");
        task.setDescription("Test Description");
        task.setDueDate(dueDate);
        task.setPriority("HIGH");
        task.setStatus(Task.Status.IN_PROGRESS);
        task.setUserId(100L);
        task.setUsername("taskowner");
        task.setInCart(true);
        task.setOffered(false);
        task.setComments(List.of(comment));
        task.setCreatedAt(now);
        task.setUpdatedAt(now);

        assertEquals(1L, task.getId());
        assertEquals("Test Task", task.getTitle());
        assertEquals("Test Description", task.getDescription());
        assertEquals(dueDate, task.getDueDate());
        assertEquals("HIGH", task.getPriority());
        assertEquals(Task.Status.IN_PROGRESS, task.getStatus());
        assertEquals(100L, task.getUserId());
        assertEquals("taskowner", task.getUsername());
        assertTrue(task.isInCart());
        assertFalse(task.isOffered());
        assertEquals(1, task.getComments().size());
        assertEquals(1L, task.getComments().get(0).getId());
        assertEquals("First comment", task.getComments().get(0).getContent());
        assertEquals(now, task.getCreatedAt());
        assertEquals(now, task.getUpdatedAt());
    }
}