package com.ou.LibraryManagement.dto.role;
import com.ou.LibraryManagement.entity.Role;

public record RoleResponse(
        Long id,
        String name
) {
    public static RoleResponse fromEntity(Role role){
        return new RoleResponse(
                role.getId(),
                role.getName()
        );
    }
}