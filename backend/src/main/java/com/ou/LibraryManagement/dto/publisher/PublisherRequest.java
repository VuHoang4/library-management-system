package com.ou.LibraryManagement.dto.publisher;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PublisherRequest(

        @NotBlank(message = "Tên nhà xuất bản không được để trống")
        @Size(max = 255)
        String name,

        // Them website de doc gia co the tra cuu them thong tin
        String website,

        // Them mo ta hoac dia chi tru so
        String description

) {}