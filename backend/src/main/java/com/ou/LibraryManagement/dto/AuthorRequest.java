package com.ou.LibraryManagement.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AuthorRequest(

        @NotBlank(message = "Author name không được để trống")
        @Size(max = 255)
        String name,

        String bio

) {}