package com.ou.LibraryManagement.dto.dashboard.lib;

public record LibrarianDashboardResponse(
        long totalBooks,
        long activeBorrows,
        long overdueBorrows,
        long totalReaders
) {}