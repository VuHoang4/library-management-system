package com.ou.LibraryManagement.mapper;

import com.ou.LibraryManagement.dto.role.RoleResponse;
import com.ou.LibraryManagement.entity.Role;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface RoleMapper {

    RoleResponse toResponse(Role role);
}