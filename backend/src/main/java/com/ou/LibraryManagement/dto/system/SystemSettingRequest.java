package com.ou.LibraryManagement.dto.system;

public record SystemSettingRequest(
        int borrowDays,
        double finePerDay
) {}