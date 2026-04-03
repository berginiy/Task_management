package com.company.task_management.config;

import com.company.task_management.entity.User;
import com.company.task_management.enums.Role;
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
                    .role(Role.ADMIN)
                    .active(true)
                    .build();
            userRepository.save(admin);
            System.out.println("✅ ADMIN создан: admin@taskmanager.com / admin123");
        }

        if (userRepository.findByEmail("creator@taskmanager.com").isEmpty()) {
            User creator = User.builder()
                    .fullName("Создатель Задач")
                    .email("creator@taskmanager.com")
                    .passwordHash(passwordEncoder.encode("creator123"))
                    .role(Role.CREATOR)
                    .active(true)
                    .build();
            userRepository.save(creator);
            System.out.println("✅ CREATOR создан: creator@taskmanager.com / creator123");
        }
    }
}