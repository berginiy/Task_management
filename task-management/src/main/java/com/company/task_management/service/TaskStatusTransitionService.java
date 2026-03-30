package com.company.task_management.service;

import com.company.task_management.enums.Role;
import com.company.task_management.enums.TaskStatus;
import com.company.task_management.exception.InvalidStatusTransitionException;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Set;

@Service
public class TaskStatusTransitionService {

    private static final Map<Role, Map<TaskStatus, Set<TaskStatus>>> ALLOWED_TRANSITIONS = Map.of(

            Role.ADMIN, Map.of(
                    TaskStatus.NEW,                  Set.of(TaskStatus.IN_PROGRESS, TaskStatus.REJECTED),
                    TaskStatus.IN_PROGRESS,          Set.of(TaskStatus.PENDING_REVIEW, TaskStatus.REJECTED),
                    TaskStatus.PENDING_REVIEW,       Set.of(TaskStatus.COMPLETED, TaskStatus.REJECTED),
                    TaskStatus.EXTENSION_REQUESTED,  Set.of(TaskStatus.IN_PROGRESS, TaskStatus.REJECTED),
                    TaskStatus.EXPIRED,              Set.of(TaskStatus.IN_PROGRESS)
            ),

            Role.CREATOR, Map.of(
                    TaskStatus.NEW,                  Set.of(TaskStatus.IN_PROGRESS),
                    TaskStatus.PENDING_REVIEW,       Set.of(TaskStatus.COMPLETED, TaskStatus.REJECTED),
                    TaskStatus.EXTENSION_REQUESTED,  Set.of(TaskStatus.IN_PROGRESS, TaskStatus.REJECTED)
            ),

            Role.EXECUTOR, Map.of(
                    TaskStatus.IN_PROGRESS,          Set.of(TaskStatus.PENDING_REVIEW, TaskStatus.EXTENSION_REQUESTED),
                    TaskStatus.EXTENSION_REQUESTED,  Set.of(TaskStatus.IN_PROGRESS)
            )
    );

    public void validate(TaskStatus current, TaskStatus next, Role role) {
        Map<TaskStatus, Set<TaskStatus>> transitions = ALLOWED_TRANSITIONS.get(role);
        if (transitions == null) {
            throw new InvalidStatusTransitionException(current.name(), next.name());
        }
        Set<TaskStatus> allowed = transitions.get(current);
        if (allowed == null || !allowed.contains(next)) {
            throw new InvalidStatusTransitionException(current.name(), next.name());
        }
    }
}