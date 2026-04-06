package com.ou.LibraryManagement.repository;

import com.ou.LibraryManagement.entity.Fine;
import com.ou.LibraryManagement.entity.enums.FineStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

public interface FineRepository extends JpaRepository<Fine, Long> {
    List<Fine> findByUserEmail(String email);

    List<Fine> findByUserIdAndStatus(Long userId, FineStatus fineStatus);

    boolean existsByUserIdAndStatus(Long userId, FineStatus fineStatus);

    List<Fine> findByUserEmailAndStatus(String email, FineStatus fineStatus);

    boolean existsByBorrowRecordId(Long id);

    Optional<Fine> findByBorrowRecordId(Long id);
}