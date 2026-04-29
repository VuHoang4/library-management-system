package com.ou.LibraryManagement.dto.dashboard.admin;

public record DashboardSummaryResponse(
        long totalReaders,
        long activeBorrows,
        double monthlyFines,
        long overdueCount
) {}