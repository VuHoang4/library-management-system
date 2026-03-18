package com.ou.LibraryManagement.controller;

import com.ou.LibraryManagement.dto.notification.NotificationRequest;
import com.ou.LibraryManagement.dto.notification.NotificationResponse;
import com.ou.LibraryManagement.service.NotificationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService service;

    public NotificationController(NotificationService service){
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<NotificationResponse>> getAll(){
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<NotificationResponse>> getByUser(@PathVariable Long userId){
        return ResponseEntity.ok(service.getByUser(userId));
    }

    @PostMapping
    public ResponseEntity<NotificationResponse> create(@RequestBody NotificationRequest request){
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(service.create(request));
    }
}