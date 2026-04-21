package com.ou.LibraryManagement.dto.pos;

import java.time.LocalDate;

public record ActiveBorrowResponse(
        Long id,
        String title,
        String author,
        LocalDate borrowDate,
        LocalDate dueDate,
        String status,
        int overdueDays
) {}