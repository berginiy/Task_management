package com.company.task_management.dto.department;

import com.company.task_management.dto.user.UserResponseDto;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;
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
    private List<UserResponseDto> users;
}