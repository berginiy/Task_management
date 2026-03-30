package com.company.task_management.dto.department;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class DepartmentResponseDto {
    private UUID id;
    private String name;
    private String description;
    private UUID headUserId;
    private String headUserName;
    private int userCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}