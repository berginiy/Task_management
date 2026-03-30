package com.company.task_management.dto.task;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class TaskRequestDto {

    @NotBlank
    private String title;

    private String description;

    private boolean urgently;

    private LocalDateTime deadline;

    @NotNull
    private UUID departmentId;

    @NotNull
    private UUID creatorId;

    private UUID executorId;
}