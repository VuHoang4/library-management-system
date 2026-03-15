package com.ou.LibraryManagement.controller;

import com.ou.LibraryManagement.model.SystemSetting;
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
    public ResponseEntity<SystemSetting> getSetting(@PathVariable Long id){
        return ResponseEntity.ok(service.getSetting(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SystemSetting> updateSetting(
            @PathVariable Long id,
            @RequestBody SystemSetting setting){

        setting.setId(id);
        return ResponseEntity.ok(service.save(setting));
    }
}