package com.taskflow.controller;

import com.taskflow.dto.request.LoginRequestDto;
import com.taskflow.dto.request.SignupRequestDto;
import com.taskflow.dto.response.AuthResponseDto;
import com.taskflow.dto.response.UserResponseDto;
import com.taskflow.entity.User;
import com.taskflow.security.JwtTokenProvider;
import com.taskflow.service.UserService;
import org.junit.jupiter.api.Test;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class AuthControllerTest {

    private final UserService userService = mock(UserService.class);
    private final PasswordEncoder passwordEncoder = mock(PasswordEncoder.class);
    private final ModelMapper modelMapper = new ModelMapper();
    private final AuthenticationManager authenticationManager = mock(AuthenticationManager.class);
    private final JwtTokenProvider jwtTokenProvider = mock(JwtTokenProvider.class);

    private final AuthController controller = new AuthController(
            userService, passwordEncoder, modelMapper, authenticationManager, jwtTokenProvider);

    @Test
    void signup_ReturnsConflict_WhenEmailExists() {
        SignupRequestDto dto = new SignupRequestDto();
        dto.setEmail("test@example.com");
        when(userService.emailExists("test@example.com")).thenReturn(true);

        ResponseEntity<?> response = controller.signup(dto);
        assertEquals(HttpStatus.CONFLICT, response.getStatusCode());
    }

    @Test
    void login_ReturnsToken_WhenCredentialsValid() {
        LoginRequestDto dto = new LoginRequestDto();
        dto.setEmail("user@example.com");
        dto.setPassword("password");

        Authentication auth = mock(Authentication.class);
        User user = new User();
        user.setEmail(dto.getEmail());

        when(authenticationManager.authenticate(any())).thenReturn(auth);
        when(jwtTokenProvider.generateToken(auth)).thenReturn("mocked-jwt");
        when(userService.findByEmail(dto.getEmail())).thenReturn(java.util.Optional.of(user));

        ResponseEntity<?> response = controller.login(dto);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        AuthResponseDto body = (AuthResponseDto) response.getBody();
        assertNotNull(body);
        assertEquals("mocked-jwt", body.getToken());
    }
}
