package com.company.task_management.repository;

import com.company.task_management.entity.Task;
import com.company.task_management.enums.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TaskRepository extends JpaRepository<Task, UUID> {
    List<Task> findAllByDepartmentId(UUID departmentId);
    List<Task> findAllByCreatorId(UUID creatorId);
    List<Task> findAllByExecutorId(UUID executorId);
    List<Task> findAllByStatus(TaskStatus status);
}