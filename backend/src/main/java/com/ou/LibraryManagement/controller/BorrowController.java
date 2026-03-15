package com.ou.LibraryManagement.controller;

import com.ou.LibraryManagement.dto.BorrowRequest;
import com.ou.LibraryManagement.dto.BorrowResponse;
import com.ou.LibraryManagement.model.BorrowRecord;
import com.ou.LibraryManagement.service.BorrowRecordService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/borrow")
public class BorrowController {

    private final BorrowRecordService borrowService;

    public BorrowController(BorrowRecordService borrowService) {
        this.borrowService = borrowService;
    }

    @GetMapping
    public ResponseEntity<List<BorrowResponse>> getAll() {
        return ResponseEntity.ok(borrowService.findAll());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BorrowResponse>> getUserBorrow(@PathVariable Long userId) {
        return ResponseEntity.ok(borrowService.getByUser(userId));
    }

    @PostMapping
    public ResponseEntity<BorrowResponse> borrowBook(@RequestBody BorrowRequest request) {
        return borrowService.borrowBook(request);
    }

    @PutMapping("/return/{id}")
    public ResponseEntity<BorrowResponse> returnBook(@PathVariable Long id) {
        return borrowService.returnBook(id);
    }
}