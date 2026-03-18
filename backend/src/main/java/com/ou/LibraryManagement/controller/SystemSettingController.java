package com.ou.LibraryManagement.controller;

import com.ou.LibraryManagement.dto.system.SystemSettingRequest;
import com.ou.LibraryManagement.dto.system.SystemSettingResponse;
import com.ou.LibraryManagement.service.SystemSettingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
public class SystemSettingController {

    private final SystemSettingService service;

    public SystemSettingController(SystemSettingService service){
        this.service = service;
    }

    @GetMapping("/{id}")
    public ResponseEntity<SystemSettingResponse> getSetting(@PathVariable Long id){
        return ResponseEntity.ok(service.getSetting(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SystemSettingResponse> updateSetting(
            @PathVariable Long id,
            @RequestBody SystemSettingRequest request){

        return ResponseEntity.ok(service.updateSetting(id, request));
    }
}