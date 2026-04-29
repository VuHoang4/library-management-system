package com.ou.LibraryManagement.dto.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record ProfileUpdateRequest(

        @NotBlank(message = "Họ và tên không được để trống")
        String fullName,

        // Tuỳ chọn: Thêm Regex để bắt buộc nhập đúng định dạng số điện thoại VN
        @Pattern(regexp = "^(0|\\+84)[3|5|7|8|9][0-9]{8}$", message = "Số điện thoại không hợp lệ")
        String phone,

        String address

) {}