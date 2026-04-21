package com.ou.LibraryManagement.controller;

import com.ou.LibraryManagement.dto.borrow.BorrowRequest;
import com.ou.LibraryManagement.dto.pos.BookSearchResponse;
import com.ou.LibraryManagement.dto.pos.CheckoutRequest;
import com.ou.LibraryManagement.dto.pos.ReaderProfileResponse;
import com.ou.LibraryManagement.service.LibrarianCirculationService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/librarian")
public class LibrarianController {

    private final LibrarianCirculationService service;

    public LibrarianController(LibrarianCirculationService service) {
        this.service = service;
    }

    // ================= SEARCH =================

    @GetMapping("/readers/search")
    public ResponseEntity<ReaderProfileResponse> searchReader(@RequestParam String keyword) {
        return ResponseEntity.ok(service.searchReader(keyword));
    }

    @GetMapping("/books/search")
    public ResponseEntity<BookSearchResponse> searchBook(@RequestParam String keyword) {
        return ResponseEntity.ok(service.findBook(keyword));
    }

    // ================= BORROW FLOW =================

    @PostMapping("/checkout")
    public ResponseEntity<Void> checkout(@Valid @RequestBody CheckoutRequest request) {
        service.checkout(request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/borrows/{id}/return")
    public ResponseEntity<Void> returnBook(@PathVariable Long id) {
        service.returnBook(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/holding/complete")
    public ResponseEntity<Void> giveHoldingBook(@Valid @RequestBody BorrowRequest request) {
        service.giveHoldingBook(request);
        return ResponseEntity.ok().build();
    }
}