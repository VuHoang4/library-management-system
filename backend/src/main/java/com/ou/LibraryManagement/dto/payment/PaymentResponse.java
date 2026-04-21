package com.ou.LibraryManagement.dto.payment;

import com.ou.LibraryManagement.entity.enums.PaymentStatus;
import java.time.LocalDateTime;

public record PaymentResponse(
        Long id,
        double amount,
        String method,
        String orderId, // Mã giao dịch từ cổng thanh toán
        PaymentStatus status,
        String reason,    // Lý do phạt lấy từ bảng Fine
        String userName,  // Tên người thanh toán
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}