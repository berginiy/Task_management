package com.company.task_management.entity;

import com.company.task_management.enums.TaskStatus;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "task_history")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class TaskHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id", nullable = false)
    @JsonIgnoreProperties("history")
    private Task task;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "changed_by", nullable = false)
    @JsonIgnoreProperties({"taskHistory"})
    private User changedBy;

    @Enumerated(EnumType.STRING)
    @Column(name = "old_status", length = 30)
    private TaskStatus oldStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "new_status", nullable = false, length = 30)
    private TaskStatus newStatus;

    @Column(columnDefinition = "TEXT")
    private String comment;

    @CreatedDate
    @Column(name = "changed_at", nullable = false, updatable = false)
    private LocalDateTime changedAt;
}