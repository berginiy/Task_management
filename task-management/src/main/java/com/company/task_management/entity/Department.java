package com.company.task_management.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "departments")
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Department extends BaseEntity {

    @Column(nullable = false, length = 255)
    private String name;

    @Column(length = 500)
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "head_user_id")
    private User head;

    @ManyToMany
    @JoinTable(
            name = "department_users",
            joinColumns = @JoinColumn(name = "department_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    @Builder.Default
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnoreProperties("departments")
    private Set<User> users = new HashSet<>();

    public void addUser(User user) {
        if (user == null) return;
        this.users.add(user);
        user.getDepartments().add(this);
    }

    public void removeUser(User user) {
        if (user == null) return;
        this.users.remove(user);

        if (user.getDepartments() != null) {
            user.getDepartments().remove(this);
        }
    }
}
