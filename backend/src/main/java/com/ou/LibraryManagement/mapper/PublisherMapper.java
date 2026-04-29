package com.ou.LibraryManagement.mapper;

import com.ou.LibraryManagement.dto.publisher.PublisherRequest;
import com.ou.LibraryManagement.dto.publisher.PublisherResponse;
import com.ou.LibraryManagement.entity.Publisher;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface PublisherMapper {

    PublisherResponse toResponse(Publisher publisher);

    Publisher toEntity(PublisherRequest request);

    void updateEntityFromRequest(PublisherRequest request, @MappingTarget Publisher publisher);
}