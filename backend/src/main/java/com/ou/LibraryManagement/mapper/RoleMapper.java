package com.ou.LibraryManagement.mapper;

import com.ou.LibraryManagement.dto.role.RoleResponse;
import com.ou.LibraryManagement.entity.Role;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring") // "spring" để bạn có thể @Autowired hoặc inject qua Constructor
public interface RoleMapper {

    // MapStruct sẽ tự khớp "id" với "id", "name" với "name"
    RoleResponse toResponse(Role role);
}