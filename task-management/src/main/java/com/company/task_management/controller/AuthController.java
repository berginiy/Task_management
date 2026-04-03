package com.company.task_management.controller;

import com.company.task_management.dto.user.UserResponseDto;
import com.company.task_management.entity.User;
import com.company.task_management.enums.Role;
import com.company.task_management.security.JwtService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final com.company.task_management.repository.UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(@RequestBody LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
            String token = jwtService.generateToken(userDetails);

            return ResponseEntity.ok(new TokenResponse(token));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body(new TokenResponse(null, "Неверный email или пароль"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(new TokenResponse(null, "Внутренняя ошибка сервера"));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<TokenResponse> register(@RequestBody RegisterRequest request) {
        try {
            if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                return ResponseEntity.badRequest()
                        .body(new TokenResponse(null, "Пользователь с таким email уже существует"));
            }

            User user = User.builder()
                    .fullName(request.getFullName())
                    .email(request.getEmail())
                    .passwordHash(passwordEncoder.encode(request.getPassword()))
                    .role(Role.EXECUTOR)
                    .active(true)
                    .build();

            User savedUser = userRepository.save(user);
            String token = jwtService.generateToken(savedUser);

            return ResponseEntity.ok(new TokenResponse(token));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body(new TokenResponse(null, "Ошибка регистрации: " + e.getMessage()));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponseDto> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getName())) {
            return ResponseEntity.status(401).build();
        }

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        UserResponseDto dto = new UserResponseDto();
        dto.setId(user.getId());
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole().name());

        if (user.getDepartment() != null) {
            dto.setDepartmentId(user.getDepartment().getId());
            dto.setDepartmentName(user.getDepartment().getName());
        }

        return ResponseEntity.ok(dto);
    }


    @Getter @Setter
    public static class LoginRequest {
        private String email;
        private String password;
    }

    @Getter @Setter
    public static class RegisterRequest {
        private String fullName;
        private String email;
        private String password;
    }

    @Getter
    public static class TokenResponse {
        private final String token;
        private final String error;

        public TokenResponse(String token) {
            this.token = token;
            this.error = null;
        }

        public TokenResponse(String token, String error) {
            this.token = token;
            this.error = error;
        }
    }
}