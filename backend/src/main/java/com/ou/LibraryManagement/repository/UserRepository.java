package com.ou.LibraryManagement.repository;

import com.ou.LibraryManagement.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    // Check trùng email nhưng bỏ qua ID của chính mình khi update
    boolean existsByEmailAndIdNot(String email, Long id);
    long countByRoleName(String roleName);

    // Omni-search: Tìm theo SĐT, Email hoặc ID (Ép ID sang chuỗi để so sánh)
    @Query("SELECT u FROM User u WHERE u.role.name = 'ROLE_READER' AND " +
            "(u.phone = :keyword OR u.email = :keyword OR CAST(u.id AS string) = :keyword)")
    Optional<User> findReaderForPos(@Param("keyword") String keyword);

    @Query("""
    SELECT u FROM User u
    WHERE LOWER(u.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
       OR LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%'))
       OR u.phone LIKE CONCAT('%', :keyword, '%')
""")
    List<User> search(@Param("keyword") String keyword);

    @Query("""
    SELECT u FROM User u
    WHERE u.role.name = 'READER'
      AND (
           :keyword IS NULL OR
           LOWER(u.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
           LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%'))
      )
""")
    List<User> searchReaders(@Param("keyword") String keyword);

}