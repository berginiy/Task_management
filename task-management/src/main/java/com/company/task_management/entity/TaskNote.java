package com.company.task_management.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "task_notes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class TaskNote extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id", nullable = false)
    @JsonIgnoreProperties("notes")
    private Task task;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    @JsonIgnoreProperties({"taskNotes", "createdTasks"})
    private User author;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "is_internal", nullable = false)
    @Builder.Default
    private boolean internal = false;
}