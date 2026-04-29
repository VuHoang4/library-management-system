package com.ou.LibraryManagement.mapper;

import com.ou.LibraryManagement.dto.book.BookDetailResponse;
import com.ou.LibraryManagement.dto.book.BookResponse;
import com.ou.LibraryManagement.entity.Book;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;


@Mapper(componentModel = "spring")
public interface BookMapper {


    @Mapping(target = "author", source = "book.author.name")
    @Mapping(target = "category", source = "book.category.name")
    @Mapping(target = "publisher", source = "book.publisher.name")
    @Mapping(target = "available", source = "available") // Lấy từ tham số truyền vào
    @Mapping(target = "userReservationStatus", ignore = true)
    @Mapping(target = "userBorrowStatus", ignore = true)
    BookResponse toResponseBasic(Book book, int available);

    @Mapping(target = "author", source = "book.author.name")
    @Mapping(target = "category", source = "book.category.name")
    @Mapping(target = "publisher", source = "book.publisher.name")
    @Mapping(target = "available", source = "available")
    @Mapping(target = "userReservationStatus", source = "userReservationStatus") // Lấy từ tham số
    @Mapping(target = "userBorrowStatus", source = "userBorrowStatus")           // Lấy từ tham số
    BookResponse toResponseReader(Book book, int available, String userReservationStatus, String userBorrowStatus);

    @Mapping(target = "available", source = "available") // Lấy từ tham số truyền vào
    @Mapping(target = "author", source = "book.author.name")
    @Mapping(target = "category", source = "book.category.name")
    @Mapping(target = "publisher", source = "book.publisher.name")
    @Mapping(target = "authorId", source = "book.author.id")
    @Mapping(target = "categoryId", source = "book.category.id")
    @Mapping(target = "publisherId", source = "book.publisher.id")
    BookDetailResponse toDetailResponse(Book book, int available);
}