package com.ou.LibraryManagement.dto.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UserRequest(

        @NotBlank(message = "Tên không được để trống")
        String name,

        @Email(message = "Email không hợp lệ")
        @NotBlank(message = "Email không được để trống")
        String email,

        @NotBlank(message = "Mật khẩu không được để trống")
        @Size(min = 6, message = "Mật khẩu tối thiểu 6 ký tự")
        String password,

        @NotNull(message = "ID quyền (Role) không được để trống")
        Long roleId,

        //  THÊM: Các thông tin bổ sung
        String phone,
        String address,
        String avatarUrl

) {}