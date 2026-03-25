package com.company.task_management.repository;

import com.company.task_management.entity.User;
import com.company.task_management.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;
import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    List<User> findAllByDepartmentIdAndActiveTrue(UUID departmentId);

    List<User> findAllByActiveTrue();

    @Query("""
        SELECT u FROM User u
        WHERE u.department.id = :departmentId
          AND u.role = :role
          AND u.active = true
    """)
    List<User> findByDepartmentAndRole(UUID departmentId, Role role);
}