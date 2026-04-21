package com.ou.LibraryManagement.dto.reservation;

import jakarta.validation.constraints.NotNull;

public record ReservationRequest(

        @NotNull(message = "ID người dùng không được để trống")
        Long userId,

        @NotNull(message = "ID sách không được để trống")
        Long bookId

) {}