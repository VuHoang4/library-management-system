package com.ou.LibraryManagement.controller;

import com.ou.LibraryManagement.dto.auth.LoginRequest;
import com.ou.LibraryManagement.dto.auth.LoginResponse;
import com.ou.LibraryManagement.service.AuthService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {

        return authService.login(
                request.email(),
                request.password()
        );
    }
}