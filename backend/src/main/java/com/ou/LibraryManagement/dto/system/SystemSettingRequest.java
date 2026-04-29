package com.ou.LibraryManagement.dto.system;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import jakarta.validation.constraints.Min;

public record SystemSettingRequest(

        @Min(value = 1, message = "Số ngày mượn tối thiểu phải là 1 ngày")
        int borrowDays,

        @Min(value = 0, message = "Tiền phạt mỗi ngày không được nhỏ hơn 0")
        double finePerDay,

        @Min(value = 0, message = "Số lần gia hạn tối đa không được nhỏ hơn 0")
        int maxRenew,

        @Min(value = 1, message = "Số sách tối đa phải >= 1")
        int maxBooksAllowed,

        @Min(value = 1, message = "Thời gian giữ sách phải >= 1 ngày")
        int holdExpirationDays
) {}