package com.ou.LibraryManagement.dto.dashboard.admin;

public record TopBookResponse(
        Long id,
        String title,
        long borrows
) {}