package com.company.task_management.repository;

import com.company.task_management.entity.Task;
import com.company.task_management.enums.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface TaskRepository extends JpaRepository<Task, UUID> {

    List<Task> findAllByDepartmentId(UUID departmentId);

    List<Task> findAllByCreatorId(UUID creatorId);

    List<Task> findAllByExecutorId(UUID executorId);

    List<Task> findAllByStatus(TaskStatus status);

    @Query("""
        SELECT t FROM Task t
        WHERE t.deadline IS NOT NULL
          AND t.deadline BETWEEN :now AND :threshold
          AND t.status NOT IN ('COMPLETED', 'REJECTED', 'EXPIRED')
          AND t.nearDeadline = false
    """)
    List<Task> findTasksNearDeadline(LocalDateTime now, LocalDateTime threshold);

    @Query("""
        SELECT t FROM Task t
        WHERE t.deadline IS NOT NULL
          AND t.deadline < :now
          AND t.status NOT IN ('COMPLETED', 'REJECTED', 'EXPIRED')
          AND t.expired = false
    """)
    List<Task> findExpiredTasks(LocalDateTime now);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.department.id = :departmentId")
    long countByDepartmentId(UUID departmentId);

    @Modifying
    @Query("UPDATE Task t SET t.department = null WHERE t.department.id = :departmentId")
    void clearDepartmentFromTasks(@Param("departmentId") UUID departmentId);
}