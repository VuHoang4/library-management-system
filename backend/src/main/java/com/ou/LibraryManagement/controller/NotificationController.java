package com.ou.LibraryManagement.controller;

import com.ou.LibraryManagement.dto.notification.NotificationResponse;
import com.ou.LibraryManagement.service.NotificationService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService NotificationService) {
        this.notificationService = NotificationService;
    }

    // ================= USER NOTIFICATIONS =================

    @GetMapping("/me")
 //   @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<NotificationResponse>> getMyNotifications(Principal principal) {
        return ResponseEntity.ok(
                notificationService.getMyNotifications(principal.getName())
        );
    }

    @PutMapping("/{id}/read")
 //   @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/read-all")
   // @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> markAllAsRead(Principal principal) {
        notificationService.markAllAsRead(principal.getName());
        return ResponseEntity.ok().build();
    }
}