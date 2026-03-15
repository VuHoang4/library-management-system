package com.ou.LibraryManagement.service;

import com.ou.LibraryManagement.dto.BookRequest;
import com.ou.LibraryManagement.dto.BookResponse;
import com.ou.LibraryManagement.model.Book;
import com.ou.LibraryManagement.repository.BookRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookService {

    private final BookRepository bookRepository;

    public BookService(BookRepository bookRepository){
        this.bookRepository = bookRepository;
    }

    public List<BookResponse> findAll(){
        return bookRepository.findAll()
                .stream()
                .map(BookResponse::fromEntity)
                .toList();
    }

    public ResponseEntity<BookResponse> findById(Long id){
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        return ResponseEntity.ok(BookResponse.fromEntity(book));
    }

    public List<BookResponse> search(String keyword){

        return bookRepository
                .findByTitleContainingIgnoreCase(keyword)
                .stream()
                .map(BookResponse::fromEntity)
                .toList();
    }

    public ResponseEntity<BookResponse> create(BookRequest request){

        Book book = new Book();

        book.setTitle(request.title());
        book.setIsbn(request.isbn());
        book.setQuantity(request.quantity());
        book.setAvailableQuantity(request.quantity());

        Book saved = bookRepository.save(book);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(BookResponse.fromEntity(saved));
    }

    public ResponseEntity<BookResponse> update(Long id, BookRequest request){

        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        book.setTitle(request.title());
        book.setIsbn(request.isbn());
        book.setQuantity(request.quantity());

        Book updated = bookRepository.save(book);

        return ResponseEntity.ok(BookResponse.fromEntity(updated));
    }

    public boolean deleteById(Long id){
        if(!bookRepository.existsById(id))
            return false;

        bookRepository.deleteById(id);
        return true;
    }
}