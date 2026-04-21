package com.ou.LibraryManagement.dto.system;

import java.time.LocalDateTime;

public record SystemSettingResponse(
        Long id,
        int borrowDays,
        double finePerDay,
        int maxRenew,
        boolean active,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}