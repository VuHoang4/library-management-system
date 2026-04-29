package com.ou.LibraryManagement.dto.dashboard.admin;

public record BadDebtorResponse(
        Long id,
        String name,
        String phone,
        double debt,
        int daysOverdue
) {}