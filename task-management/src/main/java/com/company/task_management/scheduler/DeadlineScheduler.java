package com.company.task_management.scheduler;

import com.company.task_management.entity.Task;
import com.company.task_management.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DeadlineScheduler {

    private final TaskRepository taskRepository;

    @Scheduled(fixedRate = 3600000) // каждый час
    @Transactional
    public void checkDeadlines() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime threshold = now.plusHours(24);

        List<Task> nearDeadlineTasks = taskRepository.findTasksNearDeadline(now, threshold);
        for (Task task : nearDeadlineTasks) {
            task.setNearDeadline(true);
            log.info("Task '{}' is near deadline: {}", task.getTitle(), task.getDeadline());
        }
        taskRepository.saveAll(nearDeadlineTasks);

        List<Task> expiredTasks = taskRepository.findExpiredTasks(now);
        for (Task task : expiredTasks) {
            task.setExpired(true);
            log.warn("Task '{}' is expired: {}", task.getTitle(), task.getDeadline());
        }
        taskRepository.saveAll(expiredTasks);

        log.info("Deadline check completed. Near: {}, Expired: {}",
                nearDeadlineTasks.size(), expiredTasks.size());
    }
}