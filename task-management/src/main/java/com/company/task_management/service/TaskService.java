package com.company.task_management.service;

import com.company.task_management.dto.task.TaskRequestDto;
import com.company.task_management.dto.task.TaskResponseDto;
import com.company.task_management.entity.Department;
import com.company.task_management.entity.Task;
import com.company.task_management.entity.User;
import com.company.task_management.enums.TaskStatus;
import com.company.task_management.exception.EntityNotFoundException;
import com.company.task_management.repository.DepartmentRepository;
import com.company.task_management.repository.TaskRepository;
import com.company.task_management.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;

    public List<TaskResponseDto> getAll() {
        return taskRepository.findAll().stream()
                .map(this::toResponseDto)
                .toList();
    }

    public TaskResponseDto getById(UUID id) {
        return toResponseDto(findById(id));
    }

    public List<TaskResponseDto> getByDepartment(UUID departmentId) {
        return taskRepository.findAllByDepartmentId(departmentId).stream()
                .map(this::toResponseDto)
                .toList();
    }

    public List<TaskResponseDto> getByExecutor(UUID executorId) {
        return taskRepository.findAllByExecutorId(executorId).stream()
                .map(this::toResponseDto)
                .toList();
    }

    public List<TaskResponseDto> getByStatus(TaskStatus status) {
        return taskRepository.findAllByStatus(status).stream()
                .map(this::toResponseDto)
                .toList();
    }

    @Transactional
    public TaskResponseDto create(TaskRequestDto dto) {
        Department department = departmentRepository.findById(dto.getDepartmentId())
                .orElseThrow(() -> new EntityNotFoundException("Department not found"));

        User creator = userRepository.findById(dto.getCreatorId())
                .orElseThrow(() -> new EntityNotFoundException("Creator not found"));

        Task task = new Task();
        task.setTitle(dto.getTitle());
        task.setDescription(dto.getDescription());
        task.setStatus(TaskStatus.NEW);
        task.setUrgently(dto.isUrgently());
        task.setDeadline(dto.getDeadline());
        task.setDepartment(department);
        task.setCreator(creator);

        if (dto.getExecutorId() != null) {
            User executor = userRepository.findById(dto.getExecutorId())
                    .orElseThrow(() -> new EntityNotFoundException("Executor not found"));
            task.assignExecutor(executor);
        }

        return toResponseDto(taskRepository.save(task));
    }

    @Transactional
    public TaskResponseDto update(UUID id, TaskRequestDto dto) {
        Task task = findById(id);

        Department department = departmentRepository.findById(dto.getDepartmentId())
                .orElseThrow(() -> new EntityNotFoundException("Department not found"));

        User creator = userRepository.findById(dto.getCreatorId())
                .orElseThrow(() -> new EntityNotFoundException("Creator not found"));

        task.setTitle(dto.getTitle());
        task.setDescription(dto.getDescription());
        task.setUrgently(dto.isUrgently());
        task.setDeadline(dto.getDeadline());
        task.setDepartment(department);
        task.setCreator(creator);

        if (dto.getExecutorId() != null) {
            User executor = userRepository.findById(dto.getExecutorId())
                    .orElseThrow(() -> new EntityNotFoundException("Executor not found"));
            task.assignExecutor(executor);
        } else {
            task.setExecutor(null);
            task.setExecutorFullName(null);
        }

        return toResponseDto(taskRepository.save(task));
    }

    @Transactional
    public TaskResponseDto updateStatus(UUID id, TaskStatus newStatus) {
        Task task = findById(id);
        task.setStatus(newStatus);
        return toResponseDto(taskRepository.save(task));
    }

    @Transactional
    public void delete(UUID id) {
        taskRepository.delete(findById(id));
    }

    private Task findById(UUID id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Task not found: " + id));
    }

    public TaskResponseDto toResponseDto(Task task) {
        TaskResponseDto dto = new TaskResponseDto();
        dto.setId(task.getId());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setStatus(task.getStatus());
        dto.setUrgently(task.isUrgently());
        dto.setExpired(task.isExpired());
        dto.setNearDeadline(task.isNearDeadline());
        dto.setDeadline(task.getDeadline());
        dto.setNewDeadline(task.getNewDeadline());
        dto.setEndDate(task.getEndDate());
        dto.setExtensionRequested(task.isExtensionRequested());
        dto.setExtensionApproved(task.isExtensionApproved());
        dto.setCreatedAt(task.getCreatedAt());
        dto.setUpdatedAt(task.getUpdatedAt());

        if (task.getDepartment() != null) {
            dto.setDepartmentId(task.getDepartment().getId());
            dto.setDepartmentName(task.getDepartment().getName());
        }

        if (task.getCreator() != null) {
            dto.setCreatorId(task.getCreator().getId());
            dto.setCreatorName(task.getCreator().getFullName());
        }

        if (task.getExecutor() != null) {
            dto.setExecutorId(task.getExecutor().getId());
            dto.setExecutorName(task.getExecutor().getFullName());
        }

        return dto;
    }
}