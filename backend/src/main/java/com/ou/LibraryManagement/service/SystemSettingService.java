package com.ou.LibraryManagement.service;

import com.ou.LibraryManagement.dto.system.SystemSettingRequest;
import com.ou.LibraryManagement.dto.system.SystemSettingResponse;
import com.ou.LibraryManagement.entity.SystemSetting;
import com.ou.LibraryManagement.exception.NotFoundException;
import com.ou.LibraryManagement.repository.SystemSettingRepository;
import org.springframework.stereotype.Service;

@Service
public class SystemSettingService {

    private final SystemSettingRepository repository;

    public SystemSettingService(SystemSettingRepository repository) {
        this.repository = repository;
    }

    public SystemSettingResponse getSetting(Long id) {
        SystemSetting setting = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Setting not found with id: " + id));

        return SystemSettingResponse.fromEntity(setting);
    }

    public SystemSettingResponse updateSetting(Long id, SystemSettingRequest request) {

        SystemSetting setting = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Setting not found with id: " + id));

        setting.setBorrowDays(request.borrowDays());
        setting.setFinePerDay(request.finePerDay());

        SystemSetting updated = repository.save(setting);

        return SystemSettingResponse.fromEntity(updated);
    }
}