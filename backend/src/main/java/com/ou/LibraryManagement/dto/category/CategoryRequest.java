package com.ou.LibraryManagement.dto.category;

import jakarta.validation.constraints.NotBlank;

public record CategoryRequest(

        @NotBlank(message = "Category name không được để trống")
        String name,

        String description

) {}