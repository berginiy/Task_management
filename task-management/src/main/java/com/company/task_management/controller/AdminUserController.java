package com.company.task_management.controller;

import com.company.task_management.entity.User;
import com.company.task_management.enums.Role;
import com.company.task_management.repository.UserRepository;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody CreateUserRequest request) {
        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .active(true)
                .build();

        User saved = userRepository.save(user);
        return ResponseEntity.ok(saved);
    }

    @Getter
    @Setter
    public static class CreateUserRequest {
        private String fullName;
        private String email;
        private String password;
        private Role role;
    }
}