package com.company.task_management.dto.task;

import com.company.task_management.enums.TaskStatus;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class TaskResponseDto {
    private UUID id;
    private String title;
    private String description;
    private TaskStatus status;
    private boolean urgently;
    private boolean expired;
    private LocalDateTime deadline;
    private LocalDateTime newDeadline;
    private LocalDateTime endDate;
    private boolean extensionRequested;
    private boolean extensionApproved;
    private UUID departmentId;
    private String departmentName;
    private UUID creatorId;
    private String creatorName;
    private UUID executorId;
    private String executorName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean nearDeadline;
}