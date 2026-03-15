package com.ou.LibraryManagement.service;

import com.ou.LibraryManagement.model.SystemSetting;
import com.ou.LibraryManagement.repository.SystemSettingRepository;
import org.springframework.stereotype.Service;

@Service
public class SystemSettingService {

    private final SystemSettingRepository repository;

    public SystemSettingService(SystemSettingRepository repository) {
        this.repository = repository;
    }

    public SystemSetting getSetting(Long id) {
        return repository.findById(id).orElse(null);
    }

    public SystemSetting save(SystemSetting setting) {
        return repository.save(setting);
    }
}