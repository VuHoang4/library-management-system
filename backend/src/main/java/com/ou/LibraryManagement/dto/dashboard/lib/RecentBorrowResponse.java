package com.ou.LibraryManagement.dto.dashboard.lib;

import java.time.LocalDate;

public record RecentBorrowResponse(
        Long id,
        String readerName,
        String bookTitle,
        LocalDate date,
        String status
) {}