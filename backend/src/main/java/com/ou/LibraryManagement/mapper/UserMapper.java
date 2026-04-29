package com.ou.LibraryManagement.mapper;

import com.ou.LibraryManagement.dto.user.UserRequest;
import com.ou.LibraryManagement.dto.user.UserResponse;
import com.ou.LibraryManagement.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "roleId", source = "role.id")
    @Mapping(target = "roleName", source = "role.name")
    UserResponse toResponse(User user);

    User toEntity(UserRequest request);

    void updateEntityFromRequest(UserRequest request, @MappingTarget User user);
}