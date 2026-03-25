package com.company.task_management.dto.user;

import com.company.task_management.enums.Role;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class UserResponseDto {
    private UUID id;
    private String fullName;
    private String email;
    private Role role;
    private UUID departmentId;
    private String departmentName;
    private boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}