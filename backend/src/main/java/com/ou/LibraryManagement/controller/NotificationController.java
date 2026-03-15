package com.ou.LibraryManagement.controller;

import com.ou.LibraryManagement.model.Notification;
import com.ou.LibraryManagement.service.NotificationService;
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
    public ResponseEntity<List<Notification>> getAll(){
        return ResponseEntity.ok(service.getAll());
    }

    @PostMapping
    public ResponseEntity<Notification> create(@RequestBody Notification notification){
        return ResponseEntity.ok(service.save(notification));
    }
}