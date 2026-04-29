package com.ou.LibraryManagement.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DueSoonResponse {
    private Long id;
    private Long bookId;
    private String title;
    private String author;
    private String imageUrl;
    private LocalDate borrowDate;
    private LocalDate dueDate;
}