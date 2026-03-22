package com.ou.LibraryManagement.dto.book;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

public record BookRequest(
        @NotBlank(message = "Title không được để trống")
        String title,

        String isbn,

        @Min(value = 0, message = "Quantity phải >= 0")
        int quantity
) {}