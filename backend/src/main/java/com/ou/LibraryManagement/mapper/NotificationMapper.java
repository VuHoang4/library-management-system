package com.ou.LibraryManagement.mapper;

import com.ou.LibraryManagement.dto.notification.NotificationResponse;
import com.ou.LibraryManagement.entity.Notification;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface NotificationMapper {

    // Map title, content, type tu dong
    // Logic: unread = !isRead
    @Mapping(target = "unread", expression = "java(!notification.isRead())")
    NotificationResponse toResponse(Notification notification);
}