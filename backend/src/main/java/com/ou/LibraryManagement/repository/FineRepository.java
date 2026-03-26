package com.ou.LibraryManagement.repository;

import com.ou.LibraryManagement.entity.Fine;
import com.ou.LibraryManagement.entity.enums.FineStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FineRepository extends JpaRepository<Fine, Long> {
    List<Fine> findByUserId(Long userId);

    List<Fine> findByUserIdAndStatus(Long userId, FineStatus fineStatus);

    boolean existsByUserIdAndStatus(Long userId, FineStatus fineStatus);
}