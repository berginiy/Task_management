package com.company.task_management.dto.note;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class TaskNoteResponseDto {
    private UUID id;
    private UUID taskId;
    private UUID authorId;
    private String authorName;
    private String content;
    private boolean internal;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}