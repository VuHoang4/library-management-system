package com.ou.LibraryManagement.dto;

public record ReservationRequest(

        Long userId,
        Long bookId

) {}