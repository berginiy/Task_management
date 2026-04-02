package com.company.task_management.config;

import com.company.task_management.entity.User;
import com.company.task_management.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.findByEmail("admin@taskmanager.com").isEmpty()) {

            User admin = User.builder()
                    .fullName("Администратор")
                    .email("admin@taskmanager.com")
                    .passwordHash(passwordEncoder.encode("admin123"))
                    .role(com.company.task_management.enums.Role.ADMIN)
                    .active(true)
                    .build();

            userRepository.save(admin);

            System.out.println("========================================");
            System.out.println("✅ АДМИН УСПЕШНО СОЗДАН!");
            System.out.println("Email: admin@taskmanager.com");
            System.out.println("Пароль: admin123");
            System.out.println("========================================");
        }
    }
}