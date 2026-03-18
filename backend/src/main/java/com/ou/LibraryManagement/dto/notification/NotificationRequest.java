package com.ou.LibraryManagement.dto.notification;

public record NotificationRequest(
        Long userId,
        String title,
        String content
) {}