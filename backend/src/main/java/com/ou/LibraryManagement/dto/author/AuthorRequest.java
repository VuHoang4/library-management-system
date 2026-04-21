package com.ou.LibraryManagement.dto.author;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AuthorRequest(

        @NotBlank(message = "Tên tác giả không được để trống")
        @Size(max = 255)
        String name,

        String bio,

        // Bổ sung thêm trường ảnh
        String imageUrl

) {}