package com.company.task_management.dto.department;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.UUID;

@Data
public class DepartmentRequestDto {

    @NotBlank
    private String name;

    private String description;

    private UUID headUserId;
}