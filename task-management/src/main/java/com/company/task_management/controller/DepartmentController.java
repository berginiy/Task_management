package com.company.task_management.controller;

import com.company.task_management.dto.department.DepartmentRequestDto;
import com.company.task_management.dto.department.DepartmentResponseDto;
import com.company.task_management.dto.user.UserResponseDto;
import com.company.task_management.entity.Department;
import com.company.task_management.entity.User;
import com.company.task_management.repository.DepartmentRepository;
import com.company.task_management.repository.UserRepository;
import com.company.task_management.service.DepartmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/departments")
@RequiredArgsConstructor
public class DepartmentController {

    private final DepartmentService departmentService;
    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'CREATOR', 'EXECUTOR')")
    public ResponseEntity<List<DepartmentResponseDto>> getAll() {
        return ResponseEntity.ok(departmentService.getAll());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CREATOR', 'EXECUTOR')")
    public ResponseEntity<DepartmentResponseDto> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(departmentService.getById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DepartmentResponseDto> create(@Valid @RequestBody DepartmentRequestDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(departmentService.create(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DepartmentResponseDto> update(@PathVariable UUID id,
                                                        @Valid @RequestBody DepartmentRequestDto dto) {
        return ResponseEntity.ok(departmentService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        departmentService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/available-users")
    @PreAuthorize("hasAnyRole('ADMIN', 'CREATOR')")
    public ResponseEntity<List<UserResponseDto>> getAvailableUsers(@PathVariable UUID id) {
        return ResponseEntity.ok(departmentService.getAvailableUsers(id));
    }

    @PostMapping("/{id}/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> addUsers(
            @PathVariable UUID id,
            @RequestBody List<String> userIds) {

        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Отдел не найден"));

        List<UUID> uuidList = userIds.stream()
                .map(UUID::fromString)
                .toList();

        List<User> usersToAdd = userRepository.findAllById(uuidList);

        for (User user : usersToAdd) {
            department.addUser(user);
        }

        departmentRepository.save(department);

        return ResponseEntity.ok().build();
    }
}