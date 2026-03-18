package com.ou.LibraryManagement.dto.notification;

import com.ou.LibraryManagement.entity.Notification;
public record NotificationResponse(
        Long id,
        String title,
        String content,
        Long userId
) {
    public static NotificationResponse fromEntity(Notification n){
        return new NotificationResponse(
                n.getId(),
                n.getTitle(),
                n.getContent(),
                n.getUser().getId()
        );
    }
}