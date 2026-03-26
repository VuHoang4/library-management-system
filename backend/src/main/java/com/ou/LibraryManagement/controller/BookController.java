package com.ou.LibraryManagement.controller;

import com.ou.LibraryManagement.dto.book.BookRequest;
import com.ou.LibraryManagement.dto.book.BookResponse;
import com.ou.LibraryManagement.service.BookService;
import com.ou.LibraryManagement.service.LibraryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
public class BookController {

    private final BookService bookService;
    private final LibraryService libraryService;

    public BookController(BookService bookService, LibraryService libraryService){
        this.bookService = bookService;
        this.libraryService = libraryService;
    }

    @GetMapping
    public ResponseEntity<List<BookResponse>> getAll(){
        return ResponseEntity.ok(bookService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookResponse> getById(@PathVariable Long id){
        return ResponseEntity.ok(bookService.findById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<BookResponse>> search(@RequestParam String keyword){
        return ResponseEntity.ok(bookService.search(keyword));
    }

    @PostMapping
    public ResponseEntity<BookResponse> create(@Valid @RequestBody BookRequest request){
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(bookService.create(request));
    }

    @PutMapping("/{id}")
    public BookResponse update(@PathVariable Long id,
                              @Valid @RequestBody BookRequest request){

        return libraryService.updateBook(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id){
        bookService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}