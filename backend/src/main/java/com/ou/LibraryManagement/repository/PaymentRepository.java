package com.ou.LibraryManagement.repository;

import com.ou.LibraryManagement.entity.Payment;
import com.ou.LibraryManagement.entity.enums.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    List<Payment> findByUserId(Long userId);

    List<Payment> findByFineId(Long fineId);

    boolean existsByFineIdAndStatus(Long fineId, PaymentStatus status);

    List<Payment> findByFineIdOrderByCreatedAtDesc(Long fineId);
}