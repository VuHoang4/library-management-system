package com.ou.LibraryManagement.dto.category;

import com.ou.LibraryManagement.entity.Category;

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