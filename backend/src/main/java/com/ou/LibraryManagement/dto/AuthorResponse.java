package com.ou.LibraryManagement.dto;

import com.ou.LibraryManagement.model.Author;

public record AuthorResponse(

        Long id,
        String name,
        String bio

) {

    public static AuthorResponse fromEntity(Author author){
        return new AuthorResponse(
                author.getId(),
                author.getName(),
                author.getBio()
        );
    }
}