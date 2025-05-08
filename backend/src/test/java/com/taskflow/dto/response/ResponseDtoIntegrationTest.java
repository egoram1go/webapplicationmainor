package com.taskflow.dto.response;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.taskflow.entity.Task;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class ResponseDtoIntegrationTest {

    private static ObjectMapper objectMapper;

    @BeforeAll
    static void setUp() {
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
    }

    @Test
    void testAuthResponseDtoSerialization() throws JsonProcessingException {
        UserResponseDto user = new UserResponseDto();
        user.setId(1L);
        user.setUsername("testuser");
        user.setEmail("test@example.com");

        AuthResponseDto authResponse = new AuthResponseDto(
                "test-token-123",
                user,
                "Authentication successful"
        );

        String json = objectMapper.writeValueAsString(authResponse);
        assertTrue(json.contains("\"token\":\"test-token-123\""));
        assertTrue(json.contains("\"message\":\"Authentication successful\""));
        assertTrue(json.contains("\"user\":{\"id\":1,\"username\":\"testuser\",\"email\":\"test@example.com\"}"));
    }

    @Test
    void testTaskResponseDtoSerialization() throws JsonProcessingException {
        LocalDateTime now = LocalDateTime.now();

        TaskResponseDto task = new TaskResponseDto();
        task.setId(1L);
        task.setTitle("Test Task");
        task.setCreatedAt(now);
        task.setUpdatedAt(now);

        String json = objectMapper.writeValueAsString(task);
        assertTrue(json.contains("\"id\":1"));
        assertTrue(json.contains("\"title\":\"Test Task\""));
        assertTrue(json.contains("\"createdAt\":\"" + now.toString().substring(0, 19) + "\""));
        assertTrue(json.contains("\"updatedAt\":\"" + now.toString().substring(0, 19) + "\""));
    }

    @Test
    void testCommentResponseDtoSerialization() throws JsonProcessingException {
        LocalDateTime now = LocalDateTime.now().withNano(0);

        CommentResponseDto comment = new CommentResponseDto();
        comment.setId(1L);
        comment.setContent("Test comment");
        comment.setCreatedAt(now);

        String json = objectMapper.writeValueAsString(comment);

        CommentResponseDto deserialized = objectMapper.readValue(json, CommentResponseDto.class);

        assertEquals(comment.getId(), deserialized.getId());
        assertEquals(comment.getContent(), deserialized.getContent());
        assertEquals(comment.getCreatedAt(), deserialized.getCreatedAt());
    }


    @Test
    void testUserResponseDtoSerialization() throws JsonProcessingException {
        UserResponseDto user = new UserResponseDto();
        user.setId(1L);
        user.setUsername("testuser");

        String json = objectMapper.writeValueAsString(user);
        assertTrue(json.contains("\"id\":1"));
        assertTrue(json.contains("\"username\":\"testuser\""));
    }
}