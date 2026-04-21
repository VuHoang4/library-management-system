package com.ou.LibraryManagement.dto.notification;

import java.time.LocalDateTime;

public record NotificationResponse(
        Long id,
        String title,
        String content,
        String type,
        boolean unread, // Dung de hien thi cham do thong bao
        LocalDateTime createdAt
) {}