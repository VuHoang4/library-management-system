package com.ou.LibraryManagement.dto.publisher;

import jakarta.validation.constraints.NotBlank;

public record PublisherRequest(

        @NotBlank(message = "Publisher name không được để trống")
        String name

) {}