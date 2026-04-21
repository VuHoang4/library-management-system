package com.ou.LibraryManagement.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor // Lombok sẽ tạo Constructor dựa trên thứ tự khai báo dưới đây
public class DueSoonResponse {
    private Long id;            // 1. Khớp với br.id
    private Long bookId;        // 2. Khớp với b.id
    private String title;       // 3. Khớp với b.title
    private String author;      // 4. Khớp với b.author
    private String imageUrl;    // 5. Khớp với b.imageUrl
    private LocalDate borrowDate; // 6. Khớp với br.borrowDate
    private LocalDate dueDate;    // 7. Khớp với br.dueDate
}