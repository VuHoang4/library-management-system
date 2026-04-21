package com.ou.LibraryManagement.repository;

import com.ou.LibraryManagement.entity.Publisher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PublisherRepository extends JpaRepository<Publisher, Long> {

    // Chỉ lấy những nhà xuất bản đang hoạt động
    List<Publisher> findAllByIsActiveTrue();

    // Check trùng tên (nếu cần logic này)
    boolean existsByNameAndIsActiveTrue(String name);
}