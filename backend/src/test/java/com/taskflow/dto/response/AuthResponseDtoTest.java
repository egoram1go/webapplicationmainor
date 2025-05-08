package com.taskflow.dto.response;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class AuthResponseDtoTest {

    @Test
    void testAuthResponseDto() {
        UserResponseDto user = new UserResponseDto();
        user.setId(1L);
        user.setUsername("testuser");
        user.setEmail("test@example.com");

        AuthResponseDto authResponse = new AuthResponseDto(
                "test-token-123",
                user,
                "Authentication successful"
        );

        assertEquals("test-token-123", authResponse.getToken());
        assertEquals(user, authResponse.getUser());
        assertEquals(1L, authResponse.getUser().getId());
        assertEquals("testuser", authResponse.getUser().getUsername());
        assertEquals("test@example.com", authResponse.getUser().getEmail());
        assertEquals("Authentication successful", authResponse.getMessage());
    }
}