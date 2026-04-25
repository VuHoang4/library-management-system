package com.ou.LibraryManagement.service;

import com.ou.LibraryManagement.dto.auth.LoginResponse;
import com.ou.LibraryManagement.dto.auth.UserLoginResponse;
import com.ou.LibraryManagement.entity.User;
import com.ou.LibraryManagement.exception.BadRequestException;
import com.ou.LibraryManagement.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserService userService,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public LoginResponse login(String email, String password) {

        // 1. Tìm user
        User user = userService.findEntityByEmail(email)
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        // 2. Check password
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new BadRequestException("Invalid email or password");
        }

        // 3. Generate token
        String token = jwtUtil.generateToken(
                user.getEmail(),
                user.getRole().getName()
        );

        // 4. Response
        UserLoginResponse userDto = new UserLoginResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().getName()
        );

        return new LoginResponse(token, userDto);
    }
}