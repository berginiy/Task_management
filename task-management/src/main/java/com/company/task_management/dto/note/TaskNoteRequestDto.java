package com.company.task_management.dto.note;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class TaskNoteRequestDto {

    @NotNull
    private UUID taskId;

    @NotNull
    private UUID authorId;

    @NotBlank
    private String content;

    private boolean internal;
}