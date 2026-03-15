package com.ou.LibraryManagement.dto;

import com.ou.LibraryManagement.model.User;

public record UserResponse(

        Long id,
        String name,
        String email,
        String role

) {

    public static UserResponse fromEntity(User user){
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole() != null ? user.getRole().getName() : null
        );
    }
}