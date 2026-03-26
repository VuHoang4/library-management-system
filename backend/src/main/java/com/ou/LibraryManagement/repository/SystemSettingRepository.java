package com.ou.LibraryManagement.repository;

import com.ou.LibraryManagement.entity.SystemSetting;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SystemSettingRepository extends JpaRepository<SystemSetting, Long> {
    Optional<SystemSetting> findByActiveTrue();
}