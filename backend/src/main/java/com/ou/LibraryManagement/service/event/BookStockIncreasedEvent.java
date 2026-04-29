package com.ou.LibraryManagement.service.event;

import com.ou.LibraryManagement.entity.Book;

public record BookStockIncreasedEvent(Book book) {
}