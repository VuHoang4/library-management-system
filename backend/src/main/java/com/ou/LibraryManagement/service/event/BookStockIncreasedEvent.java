package com.ou.LibraryManagement.service.event;

import com.ou.LibraryManagement.entity.Book;

// Thay vì chứa Long id, hãy cho nó chứa Book book
public record BookStockIncreasedEvent(Book book) {
}