package com.ou.LibraryManagement.dto.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UserRequest(

        @NotBlank(message = "Name không được để trống")
        String name,

        @Email(message = "Email không hợp lệ")
        @NotBlank
        String email,

        @NotBlank
        @Size(min = 6, message = "Password tối thiểu 6 ký tự")
        String password,

        @NotNull(message = "RoleId không được null")
        Long roleId

) {}