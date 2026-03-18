package com.ou.LibraryManagement.dto.reservation;

import jakarta.validation.constraints.NotNull;

public record ReservationRequest(

        @NotNull
        Long userId,
        @NotNull
        Long bookId

) {}