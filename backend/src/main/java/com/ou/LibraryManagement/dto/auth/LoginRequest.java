package com.ou.LibraryManagement.dto.auth;

public record LoginRequest(
        String email,
        String password
) {}