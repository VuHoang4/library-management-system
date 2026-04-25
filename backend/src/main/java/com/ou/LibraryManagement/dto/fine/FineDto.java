package com.ou.LibraryManagement.dto.fine;

public record FineDto(
        Long id,
        double amount,
        String reason,
        Long borrowId
) {}