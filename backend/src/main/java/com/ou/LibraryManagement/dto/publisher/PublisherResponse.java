package com.ou.LibraryManagement.dto.publisher;

import com.ou.LibraryManagement.entity.Publisher;

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