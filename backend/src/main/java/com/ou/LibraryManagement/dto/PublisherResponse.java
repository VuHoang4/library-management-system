package com.ou.LibraryManagement.dto;

import com.ou.LibraryManagement.model.Publisher;

public record PublisherResponse(

        Long id,
        String name

) {

    public static PublisherResponse fromEntity(Publisher publisher){
        return new PublisherResponse(
                publisher.getId(),
                publisher.getName()
        );
    }
}