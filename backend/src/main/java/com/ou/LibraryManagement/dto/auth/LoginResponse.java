package com.ou.LibraryManagement.dto.auth;

public record LoginResponse(
        String token,
        UserLoginResponse user
) {}