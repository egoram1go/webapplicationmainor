package com.taskflow.dto.response;

import org.junit.jupiter.api.Test;
import java.time.LocalDateTime;
import static org.junit.jupiter.api.Assertions.*;

class CommentResponseDtoTest {

    @Test
    void testCommentResponseDto() {
        LocalDateTime now = LocalDateTime.now();

        CommentResponseDto comment = new CommentResponseDto();
        comment.setId(1L);
        comment.setContent("Test comment");
        comment.setTaskId(10L);
        comment.setAuthorId(100L);
        comment.setAuthorUsername("commenter");
        comment.setCreatedAt(now);
        comment.setUpdatedAt(now);

        assertEquals(1L, comment.getId());
        assertEquals("Test comment", comment.getContent());
        assertEquals(10L, comment.getTaskId());
        assertEquals(100L, comment.getAuthorId());
        assertEquals("commenter", comment.getAuthorUsername());
        assertEquals(now, comment.getCreatedAt());
        assertEquals(now, comment.getUpdatedAt());
    }
}