package com.ou.LibraryManagement.dto.auth;

public record UserLoginResponse(
        Long id,
        String name,
        String email,
        String role
) {}