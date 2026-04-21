package com.ou.LibraryManagement.mapper;

import com.ou.LibraryManagement.dto.fine.FineResponse;
import com.ou.LibraryManagement.entity.Fine;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface FineMapper {

    @Mapping(target = "userName", source = "user.name")
    @Mapping(target = "bookTitle", source = "borrow.book.title")
    @Mapping(target = "borrowId", source = "borrow.id")
    FineResponse toResponse(Fine fine);
}