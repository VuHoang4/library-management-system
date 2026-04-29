package com.ou.LibraryManagement.dto.user;

import java.time.LocalDateTime;

public record UserResponse(
        Long id,
        String name,
        String email,
        String phone,
        String address,
        String avatarUrl,

        // Dữ liệu từ bảng Role
        Long roleId,
        String roleName,


        boolean active,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}