package com.taskflow.sql;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.boot.ApplicationArguments;
import org.springframework.jdbc.core.JdbcTemplate;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

public class DatabaseInitializerTest {

    @Test
    public void testRunQueriesJdbcTemplate() throws Exception {
        JdbcTemplate jdbcTemplate = Mockito.mock(JdbcTemplate.class);
        when(jdbcTemplate.queryForObject(
                eq("SELECT COUNT(*) FROM app_user WHERE username = ?"),
                eq(Integer.class),
                eq("testuser"))).thenReturn(1);

        ApplicationArguments args = Mockito.mock(ApplicationArguments.class);

        DatabaseInitializer initializer = new DatabaseInitializer(jdbcTemplate);
        initializer.run(args);

        verify(jdbcTemplate, times(1)).queryForObject(
                any(String.class), eq(Integer.class), eq("testuser"));
    }
}
