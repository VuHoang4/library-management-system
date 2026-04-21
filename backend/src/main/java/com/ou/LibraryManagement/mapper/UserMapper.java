package com.ou.LibraryManagement.mapper;

import com.ou.LibraryManagement.dto.user.UserRequest;
import com.ou.LibraryManagement.dto.user.UserResponse;
import com.ou.LibraryManagement.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {

    // Ánh xạ từ User sang UserResponse
    @Mapping(target = "roleId", source = "role.id")
    @Mapping(target = "roleName", source = "role.name")
    UserResponse toResponse(User user);

    // Chuyển từ Request sang Entity để tạo mới
    User toEntity(UserRequest request);

    // Cập nhật Entity từ Request (Dùng cho trang Profile/Admin Update)
    void updateEntityFromRequest(UserRequest request, @MappingTarget User user);
}