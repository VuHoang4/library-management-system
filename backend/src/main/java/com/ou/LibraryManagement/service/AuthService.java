package com.ou.LibraryManagement.service;

import com.ou.LibraryManagement.dto.auth.LoginResponse;
import com.ou.LibraryManagement.dto.auth.UserLoginResponse;
import com.ou.LibraryManagement.entity.User;
import com.ou.LibraryManagement.exception.BadRequestException;
import com.ou.LibraryManagement.repository.UserRepository;
import com.ou.LibraryManagement.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public LoginResponse login(String email, String password) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new BadRequestException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(
                user.getEmail(),
                user.getRole().getName()
        );

        UserLoginResponse userDto = new UserLoginResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().getName()
        );

        return new LoginResponse(
                token,
                userDto
        );
    }
}