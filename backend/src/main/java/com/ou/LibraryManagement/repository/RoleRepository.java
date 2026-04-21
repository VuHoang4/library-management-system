package com.ou.LibraryManagement.repository;

import com.ou.LibraryManagement.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    // Trả về Optional để an toàn hơn
    Optional<Role> findByName(String name);
}