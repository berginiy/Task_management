package com.company.task_management.service;

import com.company.task_management.dto.department.DepartmentRequestDto;
import com.company.task_management.dto.department.DepartmentResponseDto;
import com.company.task_management.dto.user.UserResponseDto;
import com.company.task_management.entity.Department;
import com.company.task_management.entity.User;
import com.company.task_management.exception.DuplicateEntityException;
import com.company.task_management.exception.EntityNotFoundException;
import com.company.task_management.repository.DepartmentRepository;
import com.company.task_management.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;

    public List<DepartmentResponseDto> getAll() {
        return departmentRepository.findAll().stream()
                .map(this::toDto)
                .toList();
    }

    public DepartmentResponseDto getById(UUID id) {
        return toDto(findById(id));
    }

    @Transactional
    public DepartmentResponseDto create(DepartmentRequestDto dto) {
        if (departmentRepository.existsByName(dto.getName())) {
            throw new DuplicateEntityException("Department already exists: " + dto.getName());
        }

        Department department = new Department();
        department.setName(dto.getName());
        department.setDescription(dto.getDescription());

        if (dto.getHeadUserId() != null) {
            User head = userRepository.findById(dto.getHeadUserId())
                    .orElseThrow(() -> new EntityNotFoundException("User not found"));
            department.setHead(head);
        }

        return toDto(departmentRepository.save(department));
    }

    @Transactional
    public DepartmentResponseDto update(UUID id, DepartmentRequestDto dto) {
        Department department = findById(id);

        if (!department.getName().equals(dto.getName()) && departmentRepository.existsByName(dto.getName())) {
            throw new DuplicateEntityException("Department already exists: " + dto.getName());
        }

        department.setName(dto.getName());
        department.setDescription(dto.getDescription());

        if (dto.getHeadUserId() != null) {
            User head = userRepository.findById(dto.getHeadUserId())
                    .orElseThrow(() -> new EntityNotFoundException("User not found"));
            department.setHead(head);
        } else {
            department.setHead(null);
        }

        return toDto(departmentRepository.save(department));
    }

    @Transactional
    public void delete(UUID id) {
        departmentRepository.delete(findById(id));
    }

    public List<UserResponseDto> getAvailableUsers(UUID departmentId) {
        return departmentRepository.findUsersWithoutDepartment().stream()
                .map(user -> {
                    UserResponseDto dto = new UserResponseDto();
                    dto.setId(user.getId());
                    dto.setFullName(user.getFullName());
                    dto.setEmail(user.getEmail());
                    dto.setRole(user.getRole().name());
                    dto.setActive(user.isActive());
                    return dto;
                })
                .toList();
    }

    @Transactional
    public void addUsers(UUID departmentId, List<UUID> userIds) {
        Department department = findById(departmentId);
        for (UUID userId : userIds) {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new EntityNotFoundException("User not found: " + userId));
            user.setDepartment(department);
            userRepository.save(user);
        }
    }

    private Department findById(UUID id) {
        return departmentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Department not found: " + id));
    }

    private DepartmentResponseDto toDto(Department d) {
        DepartmentResponseDto dto = new DepartmentResponseDto();
        dto.setId(d.getId());
        dto.setName(d.getName());
        dto.setDescription(d.getDescription());
        dto.setUserCount(d.getUsers().size());
        dto.setCreatedAt(d.getCreatedAt());
        dto.setUpdatedAt(d.getUpdatedAt());

        if (d.getHead() != null) {
            dto.setHeadUserId(d.getHead().getId());
            dto.setHeadUserName(d.getHead().getFullName());
        }

        return dto;
    }
}