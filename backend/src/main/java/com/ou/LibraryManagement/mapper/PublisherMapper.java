package com.ou.LibraryManagement.mapper;

import com.ou.LibraryManagement.dto.publisher.PublisherRequest;
import com.ou.LibraryManagement.dto.publisher.PublisherResponse;
import com.ou.LibraryManagement.entity.Publisher;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface PublisherMapper {

    // Chuyen tu Entity sang Response DTO
    PublisherResponse toResponse(Publisher publisher);

    // Chuyen tu Request DTO sang Entity de tao moi
    Publisher toEntity(PublisherRequest request);

    // Cap nhat du lieu tu Request len Entity co san
    void updateEntityFromRequest(PublisherRequest request, @MappingTarget Publisher publisher);
}