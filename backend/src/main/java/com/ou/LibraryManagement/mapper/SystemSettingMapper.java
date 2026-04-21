package com.ou.LibraryManagement.mapper;

import com.ou.LibraryManagement.dto.system.SystemSettingRequest;
import com.ou.LibraryManagement.dto.system.SystemSettingResponse;
import com.ou.LibraryManagement.entity.SystemSetting;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface SystemSettingMapper {

    SystemSettingResponse toResponse(SystemSetting setting);

    SystemSetting toEntity(SystemSettingRequest request);

    void updateEntityFromRequest(SystemSettingRequest request, @MappingTarget SystemSetting setting);
}