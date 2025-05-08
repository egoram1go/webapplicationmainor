package com.taskflow.config;

import com.taskflow.security.JwtAuthenticationFilter;
import com.taskflow.security.JwtTokenProvider;
import com.taskflow.service.CustomUserDetailsService;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class SecurityConfigTest {

    private final JwtTokenProvider tokenProvider = mock(JwtTokenProvider.class);
    private final CustomUserDetailsService customUserDetailsService = mock(CustomUserDetailsService.class);
    private final SecurityConfig securityConfig = new SecurityConfig(tokenProvider, customUserDetailsService);

    @Test
    void passwordEncoderBeanShouldReturnBCrypt() {
        PasswordEncoder encoder = securityConfig.passwordEncoder();
        assertTrue(encoder instanceof BCryptPasswordEncoder);
    }

    @Test
    void jwtAuthenticationFilterBeanShouldNotBeNull() {
        JwtAuthenticationFilter filter = securityConfig.jwtAuthenticationFilter();
        assertNotNull(filter);
    }

    @Test
    void authenticationManagerShouldBeCreated() throws Exception {
        AuthenticationConfiguration config = mock(AuthenticationConfiguration.class);
        AuthenticationManager manager = mock(AuthenticationManager.class);
        when(config.getAuthenticationManager()).thenReturn(manager);

        AuthenticationManager result = securityConfig.authenticationManager(config);
        assertEquals(manager, result);
    }
}
