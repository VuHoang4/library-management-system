package com.ou.LibraryManagement.service;

import com.ou.LibraryManagement.dto.system.SystemSettingRequest;
import com.ou.LibraryManagement.dto.system.SystemSettingResponse;
import com.ou.LibraryManagement.entity.SystemSetting;
import com.ou.LibraryManagement.exception.NotFoundException;
import com.ou.LibraryManagement.mapper.SystemSettingMapper;
import com.ou.LibraryManagement.repository.SystemSettingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SystemSettingService {

    private final SystemSettingRepository repository;
    private final SystemSettingMapper mapper;

    public SystemSettingService(SystemSettingRepository repository,
                                SystemSettingMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    // ================== READ ==================

    public List<SystemSettingResponse> getAllSettings() {
        return repository.findAll()
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    public SystemSettingResponse getSetting(Long id) {
        return mapper.toResponse(findEntityById(id));
    }

    public SystemSetting getActiveSetting() {
        return repository.findByActiveTrue()
                .orElseThrow(() ->
                        new NotFoundException("Không tìm thấy cấu hình đang active"));
    }

    // ================== INTERNAL ==================

    public SystemSetting findEntityById(Long id) {
        return repository.findById(id)
                .orElseThrow(() ->
                        new NotFoundException("Không tìm thấy cấu hình với ID: " + id));
    }

    // ================== ADMIN ==================

    @Transactional
    public SystemSettingResponse updateSetting(Long id, SystemSettingRequest request) {

        SystemSetting setting = findEntityById(id);

        // 🌟 đảm bảo chỉ có 1 active
        if (request.active()) {
            repository.findByActiveTrue().ifPresent(active -> {
                if (!active.getId().equals(id)) {
                    active.setActive(false);
                    repository.save(active);
                }
            });
        }

        mapper.updateEntityFromRequest(request, setting);

        return mapper.toResponse(repository.save(setting));
    }
}