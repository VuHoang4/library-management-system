package com.ou.LibraryManagement.mapper;

import com.ou.LibraryManagement.dto.author.AuthorRequest;
import com.ou.LibraryManagement.dto.author.AuthorResponse;
import com.ou.LibraryManagement.entity.Author;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

// componentModel = "spring" giúp bạn có thể @Autowired mapper này ở bất kỳ đâu
@Mapper(componentModel = "spring")
public interface AuthorMapper {

    // 1. Map từ Entity sang Response DTO
    AuthorResponse toResponse(Author author);

    // 2. Map từ Request DTO sang Entity (Dùng khi Tạo mới)
    Author toEntity(AuthorRequest request);

    // 3. Map từ Request DTO đè lên Entity có sẵn (Dùng khi Cập nhật)
    // Cực kỳ hữu ích, không cần phải gọi thủ công author.setName(), author.setBio()...
    void updateEntityFromRequest(AuthorRequest request, @MappingTarget Author author);
}