package com.taskflow.security;

import com.taskflow.security.UserPrincipal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.security.core.Authentication;

import java.lang.reflect.Field;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

public class JwtTokenProviderTest {

    private JwtTokenProvider jwtTokenProvider;

    @BeforeEach
    public void setUp() throws Exception {
        jwtTokenProvider = new JwtTokenProvider();

        Field secretField = JwtTokenProvider.class.getDeclaredField("jwtSecret");
        secretField.setAccessible(true);
        secretField.set(jwtTokenProvider, "ThisIsASecureKeyThatIsLongEnoughForHS512Encryption!!12345678901234567890");

        Field expirationField = JwtTokenProvider.class.getDeclaredField("jwtExpirationInMs");
        expirationField.setAccessible(true);
        expirationField.set(jwtTokenProvider, 3600000);
    }

    @Test
    public void testGenerateAndValidateToken() {
        UserPrincipal userPrincipal = new UserPrincipal(1L, "test@example.com", "password");
        Authentication authentication = Mockito.mock(Authentication.class);
        when(authentication.getPrincipal()).thenReturn(userPrincipal);

        String token = jwtTokenProvider.generateToken(authentication);
        assertNotNull(token);

        boolean isValid = jwtTokenProvider.validateToken(token);
        assertTrue(isValid);

        Long userId = jwtTokenProvider.getUserIdFromToken(token);
        assertEquals(1L, userId);
    }

    @Test
    public void testExpiredToken() throws Exception {
        Field expirationField = JwtTokenProvider.class.getDeclaredField("jwtExpirationInMs");
        expirationField.setAccessible(true);
        expirationField.set(jwtTokenProvider, 1); // 1 millisecond

        UserPrincipal userPrincipal = new UserPrincipal(2L, "expired@example.com", "password");
        Authentication authentication = Mockito.mock(Authentication.class);
        when(authentication.getPrincipal()).thenReturn(userPrincipal);

        String token = jwtTokenProvider.generateToken(authentication);
        Thread.sleep(5); // ensure expiration
        boolean isValid = jwtTokenProvider.validateToken(token);
        assertFalse(isValid);
    }
}