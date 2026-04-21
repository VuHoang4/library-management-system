package com.ou.LibraryManagement.dto.notification;

import com.ou.LibraryManagement.entity.enums.NotificationType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record NotificationRequest(
        @NotNull(message = "ID nguoi dung khong duoc de trong")
        Long userId,

        @NotBlank(message = "Tieu de khong duoc de trong")
        String title,

        @NotBlank(message = "Noi dung khong duoc de trong")
        String content,

        // Them loai thong bao de FE hien thi mau sac
        NotificationType type
) {}