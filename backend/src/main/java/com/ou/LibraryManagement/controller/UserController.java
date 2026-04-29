package com.ou.LibraryManagement.controller;

import com.ou.LibraryManagement.dto.user.*;

import com.ou.LibraryManagement.mapper.UserMapper;
import com.ou.LibraryManagement.service.UserService;
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;


import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final UserMapper userMapper;

    public UserController(UserService userService, UserMapper userMapper) {
        this.userService = userService;
        this.userMapper = userMapper;
    }

    // ================= ADMIN =================

   // @PreAuthorize("hasRole('ADMIN')")
//    @GetMapping
//    public ResponseEntity<List<UserResponse>> getAll() {
//        return ResponseEntity.ok(userService.getAllUsers());
//    }

    @GetMapping
    public List<UserResponse> getUsers(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String role
    ) {
        return userService.search(keyword, role);
    }

    @PutMapping("/{id}/toggle-active")
    public ResponseEntity<UserResponse> toggle(@PathVariable Long id) {
        return ResponseEntity.ok(userService.toggleActive(id));
    }

   // @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<UserResponse> create(@Valid @RequestBody UserRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(userService.createUser(request));
    }

  //  @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> update(@PathVariable Long id,
                                               @Valid @RequestBody UserRequest request) {
        return ResponseEntity.ok(userService.updateUser(id, request));
    }

    // ================= CURRENT USER =================

   // @PreAuthorize("isAuthenticated()")
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getMe(Principal principal) {
        return userService.findEntityByEmail(principal.getName())
                .map(user -> ResponseEntity.ok(userMapper.toResponse(user)))
                .orElse(ResponseEntity.notFound().build());
    }

   // @PreAuthorize("isAuthenticated()")
    @PutMapping("/me")
    public ResponseEntity<UserResponse> updateProfile(
            Principal principal,
            @Valid @RequestBody ProfileUpdateRequest request) {

        return ResponseEntity.ok(
                userService.updateProfile(principal.getName(), request)
        );
    }

   // @PreAuthorize("isAuthenticated()")
    @PutMapping("/me/password")
    public ResponseEntity<Void> changePassword(
            Principal principal,
            @Valid @RequestBody ChangePasswordRequest request) {

        userService.changePassword(principal.getName(), request);
        return ResponseEntity.ok().build();
    }
}