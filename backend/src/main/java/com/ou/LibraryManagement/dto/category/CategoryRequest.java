package com.ou.LibraryManagement.dto.category;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CategoryRequest(

        @NotBlank(message = "Tên thể loại không được để trống")
        @Size(max = 100, message = "Tên thể loại không được vượt quá 100 ký tự")
        String name,

        String description,

        //  THÊM: Icon/Ảnh minh họa cho Thể loại
        String imageUrl

) {}