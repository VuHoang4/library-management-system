package com.ou.LibraryManagement.controller;

import com.ou.LibraryManagement.dto.notification.NotificationRequest;
import com.ou.LibraryManagement.dto.notification.NotificationResponse;
import com.ou.LibraryManagement.service.NotificationService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService service;

    public NotificationController(NotificationService service){
        this.service = service;
    }

    // 🔒 ADMIN (xem toàn bộ)
    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping
    public ResponseEntity<List<NotificationResponse>> getAll(){
        return ResponseEntity.ok(service.getAll());
    }

    // 🔓 USER xem notification của mình
    @GetMapping("/me")
    public ResponseEntity<List<NotificationResponse>> getMyNotifications(Authentication auth){
        return ResponseEntity.ok(service.getByEmail(auth.getName()));
    }

    // 🔒 ADMIN + LIBRARIAN (tạo notification)
    @PreAuthorize("hasAnyAuthority('ADMIN','LIBRARIAN')")
    @PostMapping
    public ResponseEntity<NotificationResponse> create(@RequestBody NotificationRequest request){
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(service.create(request));
    }
}