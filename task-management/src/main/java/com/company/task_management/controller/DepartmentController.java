package com.company.task_management.controller;

import com.company.task_management.dto.department.DepartmentRequestDto;
import com.company.task_management.dto.department.DepartmentResponseDto;
import com.company.task_management.dto.user.UserResponseDto;
import com.company.task_management.entity.Department;
import com.company.task_management.entity.User;
import com.company.task_management.repository.DepartmentRepository;
import com.company.task_management.repository.TaskRepository;
import com.company.task_management.repository.UserRepository;
import com.company.task_management.service.DepartmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/departments")
@RequiredArgsConstructor
public class DepartmentController {

    private final DepartmentService departmentService;
    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;
    private final TaskRepository taskRepository;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'CREATOR', 'EXECUTOR')")
    public ResponseEntity<List<DepartmentResponseDto>> getAll() {
        List<Department> departments = departmentRepository.findAllWithUsersAndHead();
        return ResponseEntity.ok(
                departments.stream()
                        .map(this::convertToResponseDto)
                        .collect(Collectors.toList())
        );
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
    @Transactional
    public ResponseEntity<Void> deleteDepartment(@PathVariable UUID id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Отдел не найден"));

        taskRepository.clearDepartmentFromTasks(id);

        userRepository.clearDepartmentFromUsers(id);

        departmentRepository.deleteDepartmentUsers(id);

        departmentRepository.deleteById(id);

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


    private DepartmentResponseDto convertToResponseDto(Department department) {
        DepartmentResponseDto dto = new DepartmentResponseDto();

        dto.setId(department.getId());
        dto.setName(department.getName());
        dto.setDescription(department.getDescription());
        dto.setCreatedAt(department.getCreatedAt());
        dto.setUpdatedAt(department.getUpdatedAt());

        if (department.getHead() != null) {
            dto.setHeadUserId(department.getHead().getId());
            dto.setHeadUserName(department.getHead().getFullName());
        }

        dto.setUserCount(department.getUsers() != null ? department.getUsers().size() : 0);

        if (department.getUsers() != null) {
            dto.setUsers(
                    department.getUsers().stream()
                            .map(user -> {
                                UserResponseDto userDto = new UserResponseDto();
                                userDto.setId(user.getId());
                                userDto.setFullName(user.getFullName());
                                userDto.setEmail(user.getEmail());
                                userDto.setRole(user.getRole().name());
                                return userDto;
                            })
                            .collect(Collectors.toList())
            );
        }

        return dto;
    }
}