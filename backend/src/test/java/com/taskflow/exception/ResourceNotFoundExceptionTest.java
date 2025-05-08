package com.taskflow.exception;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class ResourceNotFoundExceptionTest {

    @Test
    public void testExceptionMessage() {
        ResourceNotFoundException ex = new ResourceNotFoundException("User", "id", 123);
        assertEquals("User not found with id : '123'", ex.getMessage());
    }
}
