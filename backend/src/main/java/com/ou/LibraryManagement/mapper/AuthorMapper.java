package com.ou.LibraryManagement.mapper;

import com.ou.LibraryManagement.dto.author.AuthorRequest;
import com.ou.LibraryManagement.dto.author.AuthorResponse;
import com.ou.LibraryManagement.entity.Author;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface AuthorMapper {

    AuthorResponse toResponse(Author author);

    Author toEntity(AuthorRequest request);

    void updateEntityFromRequest(AuthorRequest request, @MappingTarget Author author);
}