package com.ou.LibraryManagement.controller;

import com.ou.LibraryManagement.dto.system.SystemSettingRequest;
import com.ou.LibraryManagement.dto.system.SystemSettingResponse;

import com.ou.LibraryManagement.service.SystemSettingService;
import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/api/settings")
public class SystemSettingController {

    private final SystemSettingService systemSettingService;

    public SystemSettingController(SystemSettingService systemSettingService) {
        this.systemSettingService = systemSettingService;
    }

    // ===== READ =====

   // @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<SystemSettingResponse>> getAll() {
        return ResponseEntity.ok(systemSettingService.getAllSettings());
    }

   // @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<SystemSettingResponse> getOne(@PathVariable Long id) {
        return ResponseEntity.ok(systemSettingService.getSetting(id));
    }

    // ===== UPDATE =====

  //  @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<SystemSettingResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody SystemSettingRequest request) {

        return ResponseEntity.ok(
                systemSettingService.updateSetting(id, request)
        );
    }
}