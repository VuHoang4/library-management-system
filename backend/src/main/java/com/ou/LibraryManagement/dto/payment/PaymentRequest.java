package com.ou.LibraryManagement.dto.payment;

import jakarta.validation.constraints.NotNull;

public record PaymentRequest(

        @NotNull
        Long fineId,

        @NotNull
        String method // VNPAY, CASH

) {}