package com.taskflow.service;

import com.taskflow.entity.User;
import com.taskflow.repository.UserRepository;
import com.taskflow.security.UserPrincipal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class CustomUserDetailsServiceTest {

    private UserRepository repo;
    private CustomUserDetailsService service;

    @BeforeEach
    void setup() {
        repo = mock(UserRepository.class);
        service = new CustomUserDetailsService(repo);
    }

    @Test
    void loadUserByUsername_ShouldReturnUserPrincipal() {
        User user = new User();
        user.setEmail("email@test.com");

        when(repo.findByEmail("email@test.com")).thenReturn(Optional.of(user));

        var details = service.loadUserByUsername("email@test.com");

        assertThat(details).isInstanceOf(UserPrincipal.class);
        verify(repo).findByEmail("email@test.com");
    }
}
