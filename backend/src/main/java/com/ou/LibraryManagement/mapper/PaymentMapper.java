package com.ou.LibraryManagement.mapper;

import com.ou.LibraryManagement.dto.payment.PaymentResponse;
import com.ou.LibraryManagement.entity.Payment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PaymentMapper {

    @Mapping(target = "reason", source = "fine.reason")
    @Mapping(target = "userName", source = "user.name")
    PaymentResponse toResponse(Payment payment);
}