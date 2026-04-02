package com.company.task_management.entity;

import com.company.task_management.enums.Role;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.*;

@Entity
@Table(name = "users")
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "createdTasks", "assignedTasks", "taskExecutors"})
public class User extends BaseEntity implements UserDetails {

    @Column(name = "full_name", nullable = false, length = 255)
    private String fullName;

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    @JsonIgnoreProperties("users")
    private Department department;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private boolean active = true;

    @OneToMany(mappedBy = "creator", fetch = FetchType.LAZY)
    @Builder.Default
    private List<Task> createdTasks = new ArrayList<>();

    @OneToMany(mappedBy = "executor", fetch = FetchType.LAZY)
    @Builder.Default
    private List<Task> assignedTasks = new ArrayList<>();

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    @Builder.Default
    private List<TaskExecutor> taskExecutors = new ArrayList<>();

    @ManyToMany(mappedBy = "users")
    @Builder.Default
    @JsonIgnoreProperties("users")
    private Set<Department> departments = new HashSet<>();

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public String getPassword() {
        return passwordHash;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return active;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return active;
    }
}