package com.ou.LibraryManagement.dto.fine;

import com.ou.LibraryManagement.entity.enums.FineStatus;
import java.time.LocalDateTime;

public record FineResponse(
        Long id,
        double amount,
        String reason,
        FineStatus status,

        // Thông tin liên quan để hiển thị trên UI
        String userName,
        String bookTitle,
        Long borrowId,

        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}