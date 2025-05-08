package com.taskflow.entity;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

public class UserEntityTest {

    @Test
    void shouldCreateUserWithBuilder() {
        User user = User.builder()
                .username("jane")
                .email("jane@example.com")
                .password("secure")
                .build();

        assertThat(user.getUsername()).isEqualTo("jane");
        assertThat(user.getEmail()).isEqualTo("jane@example.com");
        assertThat(user.getPassword()).isEqualTo("secure");
    }
}
