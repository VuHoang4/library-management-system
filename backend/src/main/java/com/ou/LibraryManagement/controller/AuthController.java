package com.ou.LibraryManagement.controller;

import com.ou.LibraryManagement.dto.auth.LoginRequest;
import com.ou.LibraryManagement.dto.auth.LoginResponse;
import com.ou.LibraryManagement.service.AuthService; // Đường dẫn mới

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    // Thay thế @Autowired bằng Constructor Injection
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {

        LoginResponse response = authService.login(
                request.email(),
                request.password()
        );

        return ResponseEntity.ok(response);
    }
}