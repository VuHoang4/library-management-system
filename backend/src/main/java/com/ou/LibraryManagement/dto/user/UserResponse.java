package com.ou.LibraryManagement.dto.user;

import com.ou.LibraryManagement.entity.User;

public record UserResponse(

        Long id,
        String name,
        String email,
        Long roleId,
        String role

) {

    public static UserResponse fromEntity(User user){
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole() != null ? user.getRole().getId() : null,
                user.getRole() != null ? user.getRole().getName() : null
        );
    }
}