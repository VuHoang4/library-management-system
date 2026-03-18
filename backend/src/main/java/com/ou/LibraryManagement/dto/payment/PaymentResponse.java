package com.ou.LibraryManagement.dto.payment;

import com.ou.LibraryManagement.entity.Payment;
import com.ou.LibraryManagement.entity.enums.PaymentStatus;

import java.time.LocalDateTime;

public record PaymentResponse(

        Long id,
        double amount,
        String method,
        PaymentStatus status,
        Long fineId,
        LocalDateTime createdAt

) {

    public static PaymentResponse fromEntity(Payment payment){
        return new PaymentResponse(
                payment.getId(),
                payment.getAmount(),
                payment.getMethod(),
                payment.getStatus(),
                payment.getFine().getId(),
                payment.getCreatedAt()
        );
    }
}