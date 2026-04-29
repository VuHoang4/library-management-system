package com.ou.LibraryManagement.controller;

import com.ou.LibraryManagement.dto.system.SystemSettingRequest;
import com.ou.LibraryManagement.dto.system.SystemSettingResponse;

import com.ou.LibraryManagement.service.SystemSettingService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;


@RestController
@RequestMapping("/api/settings")
public class SystemSettingController {

    private final SystemSettingService systemSettingService;

    public SystemSettingController(SystemSettingService systemSettingService) {
        this.systemSettingService = systemSettingService;
    }

    @GetMapping
    public ResponseEntity<SystemSettingResponse> getActive() {
        return ResponseEntity.ok(systemSettingService.getActive());
    }

    @PutMapping
    public ResponseEntity<SystemSettingResponse> update(@RequestBody SystemSettingRequest request) {
        return ResponseEntity.ok(systemSettingService.update(request));
    }


    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<SystemSettingResponse> getOne(@PathVariable Long id) {
        return ResponseEntity.ok(systemSettingService.getSetting(id));
    }

}