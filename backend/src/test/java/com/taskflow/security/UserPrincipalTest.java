package com.taskflow.security;

import com.taskflow.entity.User;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

import static org.junit.jupiter.api.Assertions.*;

class UserPrincipalTest {

    @Test
    void create_ShouldMapUserFieldsCorrectly() {
        User user = new User();
        user.setId(42L);
        user.setEmail("user@example.com");
        user.setPassword("securePassword");

        UserPrincipal principal = UserPrincipal.create(user);

        assertEquals(42L, principal.getId());
        assertEquals("user@example.com", principal.getUsername());
        assertEquals("securePassword", principal.getPassword());
    }

    @Test
    void authorities_ShouldBeEmpty() {
        UserPrincipal principal = new UserPrincipal(1L, "email@example.com", "pass");

        Collection<? extends GrantedAuthority> authorities = principal.getAuthorities();
        assertNotNull(authorities);
        assertTrue(authorities.isEmpty());
    }

    @Test
    void accountStatusFlags_ShouldBeTrue() {
        UserPrincipal principal = new UserPrincipal(1L, "email@example.com", "pass");

        assertTrue(principal.isAccountNonExpired());
        assertTrue(principal.isAccountNonLocked());
        assertTrue(principal.isCredentialsNonExpired());
        assertTrue(principal.isEnabled());
    }

    @Test
    void getUsername_ShouldReturnEmail() {
        UserPrincipal principal = new UserPrincipal(1L, "user@domain.com", "pass");
        assertEquals("user@domain.com", principal.getUsername());
    }
}
