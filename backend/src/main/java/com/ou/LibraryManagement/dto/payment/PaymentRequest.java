package com.ou.LibraryManagement.dto.payment;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record PaymentRequest(

        @NotNull(message = "ID hóa đơn phạt không được để trống")
        Long fineId,

        @Positive(message = "Số tiền thanh toán phải lớn hơn 0")
        double amount,

        @NotBlank(message = "Phương thức thanh toán không được để trống")
        String method // VNPAY, CASH, MOMO
) {}