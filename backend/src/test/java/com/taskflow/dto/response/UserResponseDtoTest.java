package com.taskflow.dto.response;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class UserResponseDtoTest {

    @Test
    void testUserResponseDto() {
        UserResponseDto user = new UserResponseDto();
        user.setId(1L);
        user.setUsername("testuser");
        user.setEmail("test@example.com");

        assertEquals(1L, user.getId());
        assertEquals("testuser", user.getUsername());
        assertEquals("test@example.com", user.getEmail());
    }
}