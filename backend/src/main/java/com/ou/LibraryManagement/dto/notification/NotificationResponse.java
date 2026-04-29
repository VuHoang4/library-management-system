package com.ou.LibraryManagement.dto.notification;

import java.time.LocalDateTime;

public record NotificationResponse(
        Long id,
        String title,
        String content,
        String type,
        boolean unread,
        LocalDateTime createdAt
) {}