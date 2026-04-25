package com.ou.LibraryManagement.dto.dashboard.lib;

public record DashboardSummaryResponse(
        long totalBooks,
        long activeBorrows,
        long overdueBorrows,
        long totalReaders
) {}