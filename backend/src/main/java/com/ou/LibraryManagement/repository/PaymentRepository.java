package com.ou.LibraryManagement.repository;

import com.ou.LibraryManagement.entity.Payment;
import com.ou.LibraryManagement.entity.enums.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    List<Payment> findByUserId(Long userId);

    List<Payment> findByFineId(Long fineId);

    boolean existsByFineIdAndStatus(Long fineId, PaymentStatus status);

    List<Payment> findByFineIdOrderByCreatedAtDesc(Long fineId);

    List<Payment> findByFine_User_Id(Long userId);

    Optional<Payment> findByOrderId(String orderId);

    Optional<Payment> findByTxnRef(String txnRef);
}