package com.company.task_management.controller;

import com.company.task_management.dto.note.TaskNoteRequestDto;
import com.company.task_management.dto.note.TaskNoteResponseDto;
import com.company.task_management.service.TaskNoteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/notes")
@RequiredArgsConstructor
public class TaskNoteController {

    private final TaskNoteService taskNoteService;

    @GetMapping("/task/{taskId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CREATOR')")
    public ResponseEntity<List<TaskNoteResponseDto>> getByTask(@PathVariable UUID taskId) {
        return ResponseEntity.ok(taskNoteService.getByTask(taskId));
    }

    @GetMapping("/task/{taskId}/public")
    @PreAuthorize("hasAnyRole('ADMIN', 'CREATOR', 'EXECUTOR')")
    public ResponseEntity<List<TaskNoteResponseDto>> getPublicByTask(@PathVariable UUID taskId) {
        return ResponseEntity.ok(taskNoteService.getPublicByTask(taskId));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'CREATOR', 'EXECUTOR')")
    public ResponseEntity<TaskNoteResponseDto> create(@Valid @RequestBody TaskNoteRequestDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(taskNoteService.create(dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CREATOR')")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        taskNoteService.delete(id);
        return ResponseEntity.noContent().build();
    }
}