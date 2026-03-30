package com.company.task_management.controller;

import com.company.task_management.dto.task.TaskRequestDto;
import com.company.task_management.dto.task.TaskResponseDto;
import com.company.task_management.enums.TaskStatus;
import com.company.task_management.service.ExtensionRequestService;
import com.company.task_management.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;
    private final ExtensionRequestService extensionRequestService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'CREATOR', 'EXECUTOR')")
    public ResponseEntity<List<TaskResponseDto>> getAll() {
        return ResponseEntity.ok(taskService.getAll());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CREATOR', 'EXECUTOR')")
    public ResponseEntity<TaskResponseDto> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(taskService.getById(id));
    }

    @GetMapping("/department/{departmentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CREATOR')")
    public ResponseEntity<List<TaskResponseDto>> getByDepartment(@PathVariable UUID departmentId) {
        return ResponseEntity.ok(taskService.getByDepartment(departmentId));
    }

    @GetMapping("/executor/{executorId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CREATOR', 'EXECUTOR')")
    public ResponseEntity<List<TaskResponseDto>> getByExecutor(@PathVariable UUID executorId) {
        return ResponseEntity.ok(taskService.getByExecutor(executorId));
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CREATOR')")
    public ResponseEntity<List<TaskResponseDto>> getByStatus(@PathVariable TaskStatus status) {
        return ResponseEntity.ok(taskService.getByStatus(status));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'CREATOR')")
    public ResponseEntity<TaskResponseDto> create(@Valid @RequestBody TaskRequestDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(taskService.create(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CREATOR')")
    public ResponseEntity<TaskResponseDto> update(@PathVariable UUID id,
                                                  @Valid @RequestBody TaskRequestDto dto) {
        return ResponseEntity.ok(taskService.update(id, dto));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'CREATOR', 'EXECUTOR')")
    public ResponseEntity<TaskResponseDto> updateStatus(@PathVariable UUID id,
                                                        @RequestParam TaskStatus status) {
        return ResponseEntity.ok(taskService.updateStatus(id, status));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        taskService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/extension/request")
    @PreAuthorize("hasRole('EXECUTOR')")
    public ResponseEntity<TaskResponseDto> requestExtension(
            @PathVariable UUID id,
            @RequestParam LocalDateTime newDeadline) {
        return ResponseEntity.ok(extensionRequestService.requestExtension(id, newDeadline));
    }

    @PostMapping("/{id}/extension/approve")
    @PreAuthorize("hasAnyRole('ADMIN', 'CREATOR')")
    public ResponseEntity<TaskResponseDto> approveExtension(@PathVariable UUID id) {
        return ResponseEntity.ok(extensionRequestService.approveExtension(id));
    }

    @PostMapping("/{id}/extension/reject")
    @PreAuthorize("hasAnyRole('ADMIN', 'CREATOR')")
    public ResponseEntity<TaskResponseDto> rejectExtension(@PathVariable UUID id) {
        return ResponseEntity.ok(extensionRequestService.rejectExtension(id));
    }
}