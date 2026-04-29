package com.ou.LibraryManagement.dto.book;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record BookRequest(

        @NotBlank(message = "Tên sách không được để trống")
        @Size(max = 255)
        String title,

        String isbn,

        String imageUrl,

        //  THÊM: Các trường mới cập nhật từ Entity
        String description,

        Integer publishedYear,

        @Min(value = 0, message = "Số lượng (Quantity) phải lớn hơn hoặc bằng 0")
        int quantity,

        @NotNull(message = "ID Tác giả không được để trống")
        Long authorId,

        @NotNull(message = "ID Thể loại không được để trống")
        Long categoryId,

        @NotNull(message = "ID Nhà xuất bản không được để trống")
        Long publisherId
) {}