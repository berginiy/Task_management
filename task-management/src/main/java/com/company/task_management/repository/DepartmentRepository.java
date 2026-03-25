package com.company.task_management.repository;

import com.company.task_management.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, UUID> {

    boolean existsByName(String name);

    Optional<Department> findByName(String name);

    @Query("""
        SELECT d FROM Department d
        LEFT JOIN FETCH d.headUser
        ORDER BY d.name ASC
    """)
    List<Department> findAllWithHeadUser();

    @Query("""
        SELECT d FROM Department d
        WHERE d.headUser.id = :userId
    """)
    List<Department> findByHeadUserId(UUID userId);
}
