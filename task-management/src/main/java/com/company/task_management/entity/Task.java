package com.company.task_management.entity;

import com.company.task_management.enums.TaskStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
        name = "tasks",
        indexes = {
                @Index(name = "idx_tasks_department_id", columnList = "department_id"),
                @Index(name = "idx_tasks_creator_id",    columnList = "creator_id"),
                @Index(name = "idx_tasks_executor_id",   columnList = "executor_id"),
                @Index(name = "idx_tasks_status",        columnList = "status"),
                @Index(name = "idx_tasks_deadline",      columnList = "deadline"),
                @Index(name = "idx_tasks_is_expired",    columnList = "is_expired")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Task extends BaseEntity {

    @Column(nullable = false, length = 500)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private TaskStatus status = TaskStatus.NEW;

    @Column(name = "is_urgently", nullable = false)
    @Builder.Default
    private boolean Urgently = false;

    @Column(name = "is_expired", nullable = false)
    @Builder.Default
    private boolean Expired = false;

    @Column(name = "received_at")
    private LocalDateTime receivedAt;

    @Column(name = "deadline")
    private LocalDateTime deadline;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    @Column(name = "new_deadline")
    private LocalDateTime newDeadline;

    @Column(name = "extension_requested", nullable = false)
    @Builder.Default
    private boolean extensionRequested = false;

    @Column(name = "extension_approved", nullable = false)
    @Builder.Default
    private boolean extensionApproved = false;

    @Column(name = "executor_full_name", length = 255)
    private String executorFullName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "creator_id", nullable = false)
    private User creator;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "executor_id")
    private User executor;

    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<TaskHistory> history = new ArrayList<>();

    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<TaskNote> notes = new ArrayList<>();

    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<TaskExecutor> executors = new ArrayList<>();

    public void assignExecutor(User user) {
        this.executor = user;
        this.executorFullName = user.getFullName();
    }

    public LocalDateTime getEffectiveDeadline() {
        return (extensionApproved && newDeadline != null) ? newDeadline : deadline;
    }
}
