package com.ou.LibraryManagement.repository;

import com.ou.LibraryManagement.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    // Lấy tất cả thể loại đang hoạt động (cho người dùng xem)
    List<Category> findAllByIsActiveTrue();

    // Kiểm tra trùng tên (chỉ xét những thể loại đang active)
    boolean existsByNameAndIsActiveTrue(String name);
}