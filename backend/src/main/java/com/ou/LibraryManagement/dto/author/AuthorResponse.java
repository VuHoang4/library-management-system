package com.ou.LibraryManagement.dto.author;

import com.ou.LibraryManagement.entity.Author;

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