package com.ou.LibraryManagement.mapper;

import com.ou.LibraryManagement.dto.category.CategoryRequest;
import com.ou.LibraryManagement.dto.category.CategoryResponse;
import com.ou.LibraryManagement.entity.Category;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface CategoryMapper {

    // 1. Chuyển Entity thành Response trả về cho Frontend
    CategoryResponse toResponse(Category category);

    // 2. Chuyển Request thành Entity để lưu mới vào Database
    Category toEntity(CategoryRequest request);

    // 3. Đổ dữ liệu từ Request đè lên Entity có sẵn (Dùng cho hàm Update)
    void updateEntityFromRequest(CategoryRequest request, @MappingTarget Category category);
}