package com.company.task_management.controller;

import com.company.task_management.dto.department.DepartmentRequestDto;
import com.company.task_management.dto.department.DepartmentResponseDto;
import com.company.task_management.entity.Department;
import com.company.task_management.entity.User;
import com.company.task_management.repository.DepartmentRepository;
import com.company.task_management.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/departments")
@RequiredArgsConstructor
public class DepartmentController {

    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;

    @GetMapping
    public List<DepartmentResponseDto> getAllDepartments() {
        List<Department> departments = departmentRepository.findAll();
        return departments.stream()
                .map(this::convertToResponseDto)
                .collect(Collectors.toList());
    }

    @PostMapping
    public ResponseEntity<DepartmentResponseDto> createDepartment(@RequestBody DepartmentRequestDto requestDto) {
        if (departmentRepository.existsByName(requestDto.getName())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Отдел с таким названием уже существует");
        }

        Department department = new Department();
        department.setName(requestDto.getName().trim());
        department.setDescription(requestDto.getDescription() != null ? requestDto.getDescription().trim() : null);

        if (requestDto.getHeadUserId() != null) {
            User head = userRepository.findById(requestDto.getHeadUserId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Руководитель не найден"));
            department.setHead(head);
        }

        Department saved = departmentRepository.save(department);
        return ResponseEntity.status(HttpStatus.CREATED).body(convertToResponseDto(saved));
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

        return dto;
    }
}