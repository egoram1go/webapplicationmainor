package com.taskflow.service;

import com.taskflow.entity.User;
import com.taskflow.repository.UserRepository;
import com.taskflow.security.UserPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    private final UserRepository repo;
    public UserService(UserRepository repo) { this.repo = repo; }
    public Optional<User> findByUsername(String username) { return repo.findByUsername(username); }
    public Optional<User> findById(Long userId) { return repo.findById(userId); }
    public User save(User user) { return repo.save(user); }

    public Optional<User> findByEmail(String email) {
        return repo.findByEmail(email);
    }

    public boolean emailExists(String email) {
        return repo.findByEmail(email).isPresent();
    }

    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = repo.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        return UserPrincipal.create(user);
    }
}
