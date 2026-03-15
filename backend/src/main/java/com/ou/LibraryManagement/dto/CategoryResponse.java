package com.ou.LibraryManagement.dto;

import com.ou.LibraryManagement.model.Category;

public record CategoryResponse(

        Long id,
        String name,
        String description

) {

    public static CategoryResponse fromEntity(Category category){
        return new CategoryResponse(
                category.getId(),
                category.getName(),
                category.getDescription()
        );
    }
}