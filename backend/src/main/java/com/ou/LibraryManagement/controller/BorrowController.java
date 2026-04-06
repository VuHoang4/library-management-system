package com.ou.LibraryManagement.controller;

import com.ou.LibraryManagement.dto.borrow.BorrowRequest;
import com.ou.LibraryManagement.dto.borrow.BorrowResponse;
import com.ou.LibraryManagement.service.LibraryService;
import com.ou.LibraryManagement.service.BorrowService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/api/borrow")
public class BorrowController {

    private final LibraryService libraryService;
    private final BorrowService borrowService;

    public BorrowController(LibraryService libraryService,
                            BorrowService borrowService) {
        this.libraryService = libraryService;
        this.borrowService = borrowService;
    }

    // ================= QUERY =================

    @GetMapping
    public ResponseEntity<List<BorrowResponse>> getAll() {
        return ResponseEntity.ok(
                borrowService.findAll()
                        .stream()
                        .map(BorrowResponse::fromEntity)
                        .toList()
        );
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BorrowResponse>> getUserBorrow(@PathVariable Long userId) {
        return ResponseEntity.ok(
                borrowService.getByUser(userId)
                        .stream()
                        .map(BorrowResponse::fromEntity)
                        .toList()
        );
    }

    // ================= COMMAND =================

    @PostMapping
    public ResponseEntity<BorrowResponse> borrowBook(@RequestBody BorrowRequest request) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(libraryService.borrowBook(request));
    }

    @PutMapping("/return/{id}")
    public ResponseEntity<BorrowResponse> returnBook(@PathVariable Long id) {
        return ResponseEntity.ok(libraryService.returnBook(id));
    }

    @PutMapping("/{id}/renew")
    public ResponseEntity<BorrowResponse> renew(@PathVariable Long id){
        return ResponseEntity.ok(libraryService.renewBook(id));
    }
}