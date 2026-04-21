package com.ou.LibraryManagement.mapper;

import com.ou.LibraryManagement.dto.reservation.ReservationResponse;
import com.ou.LibraryManagement.entity.Reservation;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ReservationMapper {

    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "bookId", source = "book.id")
    @Mapping(target = "userName", source = "user.name")
    @Mapping(target = "bookTitle", source = "book.title")
    @Mapping(target = "imageUrl", source = "book.imageUrl")
    ReservationResponse toResponse(Reservation reservation);
}