package com.ou.LibraryManagement.dto.fine;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record FineRequest(

        @NotNull(message = "ID phiếu mượn không được để trống")
        Long borrowId,

        @Min(value = 0, message = "Số tiền phạt không được âm")
        double amount,

        String reason

) {}