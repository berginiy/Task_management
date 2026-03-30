package com.company.task_management.service;

import com.company.task_management.dto.note.TaskNoteRequestDto;
import com.company.task_management.dto.note.TaskNoteResponseDto;
import com.company.task_management.entity.Task;
import com.company.task_management.entity.TaskNote;
import com.company.task_management.entity.User;
import com.company.task_management.exception.EntityNotFoundException;
import com.company.task_management.repository.TaskNoteRepository;
import com.company.task_management.repository.TaskRepository;
import com.company.task_management.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TaskNoteService {

    private final TaskNoteRepository taskNoteRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public List<TaskNoteResponseDto> getByTask(UUID taskId) {
        return taskNoteRepository.findAllByTaskId(taskId).stream()
                .map(this::toDto)
                .toList();
    }

    public List<TaskNoteResponseDto> getPublicByTask(UUID taskId) {
        return taskNoteRepository.findPublicByTaskId(taskId).stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional
    public TaskNoteResponseDto create(TaskNoteRequestDto dto) {
        Task task = taskRepository.findById(dto.getTaskId())
                .orElseThrow(() -> new EntityNotFoundException("Task not found"));

        User author = userRepository.findById(dto.getAuthorId())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        TaskNote note = new TaskNote();
        note.setTask(task);
        note.setAuthor(author);
        note.setContent(dto.getContent());
        note.setInternal(dto.isInternal());

        return toDto(taskNoteRepository.save(note));
    }

    @Transactional
    public void delete(UUID id) {
        taskNoteRepository.delete(
                taskNoteRepository.findById(id)
                        .orElseThrow(() -> new EntityNotFoundException("Note not found: " + id))
        );
    }

    private TaskNoteResponseDto toDto(TaskNote note) {
        TaskNoteResponseDto dto = new TaskNoteResponseDto();
        dto.setId(note.getId());
        dto.setTaskId(note.getTask().getId());
        dto.setContent(note.getContent());
        dto.setInternal(note.isInternal());
        dto.setCreatedAt(note.getCreatedAt());
        dto.setUpdatedAt(note.getUpdatedAt());

        if (note.getAuthor() != null) {
            dto.setAuthorId(note.getAuthor().getId());
            dto.setAuthorName(note.getAuthor().getFullName());
        }

        return dto;
    }
}