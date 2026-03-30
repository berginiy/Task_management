package com.company.task_management.service;

import com.company.task_management.dto.task.TaskResponseDto;
import com.company.task_management.entity.Task;
import com.company.task_management.enums.TaskStatus;
import com.company.task_management.exception.EntityNotFoundException;
import com.company.task_management.exception.InvalidStatusTransitionException;
import com.company.task_management.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ExtensionRequestService {

    private final TaskRepository taskRepository;
    private final TaskService taskService;

    @Transactional
    public TaskResponseDto requestExtension(UUID taskId, LocalDateTime newDeadline) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new EntityNotFoundException("Task not found: " + taskId));

        if (task.getStatus() != TaskStatus.IN_PROGRESS) {
            throw new InvalidStatusTransitionException(task.getStatus().name(), "EXTENSION_REQUESTED");
        }

        task.setExtensionRequested(true);
        task.setNewDeadline(newDeadline);
        task.setStatus(TaskStatus.EXTENSION_REQUESTED);

        return taskService.toResponseDto(taskRepository.save(task));
    }

    @Transactional
    public TaskResponseDto approveExtension(UUID taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new EntityNotFoundException("Task not found: " + taskId));

        if (task.getStatus() != TaskStatus.EXTENSION_REQUESTED) {
            throw new InvalidStatusTransitionException(task.getStatus().name(), "APPROVED");
        }

        task.setExtensionApproved(true);
        task.setStatus(TaskStatus.IN_PROGRESS);

        return taskService.toResponseDto(taskRepository.save(task));
    }

    @Transactional
    public TaskResponseDto rejectExtension(UUID taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new EntityNotFoundException("Task not found: " + taskId));

        if (task.getStatus() != TaskStatus.EXTENSION_REQUESTED) {
            throw new InvalidStatusTransitionException(task.getStatus().name(), "REJECTED");
        }

        task.setExtensionRequested(false);
        task.setNewDeadline(null);
        task.setStatus(TaskStatus.IN_PROGRESS);

        return taskService.toResponseDto(taskRepository.save(task));
    }
}