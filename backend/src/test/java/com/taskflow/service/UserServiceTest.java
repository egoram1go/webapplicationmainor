package com.taskflow.service;

import com.taskflow.entity.User;
import com.taskflow.repository.UserRepository;
import com.taskflow.security.UserPrincipal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class UserServiceTest {

    private UserRepository repo;
    private UserService service;

    @BeforeEach
    void setup() {
        repo = mock(UserRepository.class);
        service = new UserService(repo);
    }

    @Test
    void loadUserByUsername_ShouldReturnUserPrincipal() {
        User user = new User();
        user.setEmail("email@test.com");

        when(repo.findByEmail("email@test.com")).thenReturn(Optional.of(user));

        UserDetails details = service.loadUserByUsername("email@test.com");

        assertThat(details).isInstanceOf(UserPrincipal.class);
    }
}
