package com.company.task_management.repository;

import com.company.task_management.entity.Department;
import com.company.task_management.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, UUID> {

    boolean existsByName(String name);

    @Query("SELECT DISTINCT d FROM Department d LEFT JOIN FETCH d.users LEFT JOIN FETCH d.head")
    List<Department> findAllWithUsersAndHead();

    @Query("SELECT u FROM User u WHERE u.department IS NULL AND u.active = true")
    List<User> findUsersWithoutDepartment();
}