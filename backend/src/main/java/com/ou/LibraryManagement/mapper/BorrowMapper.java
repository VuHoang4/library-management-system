package com.ou.LibraryManagement.mapper;

import com.ou.LibraryManagement.dto.borrow.BorrowResponse;
import com.ou.LibraryManagement.entity.Borrow;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface BorrowMapper {

    // MapStruct sẽ tự động gọi borrow.getUser().getName()
    // và gán vào userName một cách an toàn (không lo NullPointerException)
    @Mapping(target = "userName", source = "user.name")
    @Mapping(target = "bookTitle", source = "book.title")
    @Mapping(target = "imageUrl", source = "book.imageUrl")
    BorrowResponse toResponse(Borrow borrow);
}