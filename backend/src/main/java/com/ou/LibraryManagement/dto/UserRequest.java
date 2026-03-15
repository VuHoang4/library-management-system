package com.ou.LibraryManagement.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record UserRequest(

        @NotBlank(message = "Name không được để trống")
        String name,

        @Email(message = "Email không hợp lệ")
        String email,

        String password,

        Long roleId

) {}