package com.ou.LibraryManagement.dto;

import java.time.LocalDate;

public record Overdue(
        Long borrowId,
        String bookTitle,
        String userName,
        LocalDate dueDate
) {}