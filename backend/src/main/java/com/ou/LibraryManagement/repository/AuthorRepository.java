package com.ou.LibraryManagement.repository;

import com.ou.LibraryManagement.entity.Author;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AuthorRepository extends JpaRepository<Author, Long> {
    // Chỉ lấy những tác giả đang hoạt động (Soft Delete)
    List<Author> findAllByIsActiveTrue();

    // Kiểm tra trùng tên cho các tác giả đang active
    boolean existsByNameAndIsActiveTrue(String name);
}