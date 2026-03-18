package com.ou.LibraryManagement.dto.system;

import com.ou.LibraryManagement.entity.SystemSetting;

public record SystemSettingResponse(
        Long id,
        int borrowDays,
        double finePerDay
) {
    public static SystemSettingResponse fromEntity(SystemSetting s){
        return new SystemSettingResponse(
                s.getId(),
                s.getBorrowDays(),
                s.getFinePerDay()
        );
    }
}