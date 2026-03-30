package com.company.task_management.repository;

import com.company.task_management.entity.TaskNote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TaskNoteRepository extends JpaRepository<TaskNote, UUID> {
    List<TaskNote> findAllByTaskId(UUID taskId);

    @Query("SELECT n FROM TaskNote n WHERE n.task.id = :taskId AND n.internal = false")
    List<TaskNote> findPublicByTaskId(UUID taskId);
}