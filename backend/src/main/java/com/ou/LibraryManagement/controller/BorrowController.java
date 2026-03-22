package com.ou.LibraryManagement.controller;

import com.ou.LibraryManagement.dto.borrow.BorrowRequest;
import com.ou.LibraryManagement.dto.borrow.BorrowResponse;
import com.ou.LibraryManagement.service.BorrowRecordService;
import org.springframework.http.HttpStatus;
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
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(borrowService.borrowBook(request));
    }

    @PutMapping("/return/{id}")
    public ResponseEntity<BorrowResponse> returnBook(@PathVariable Long id) {
        return ResponseEntity.ok(borrowService.returnBook(id));
    }

    @PutMapping("/{id}/renew")
    public ResponseEntity<BorrowResponse> renew(@PathVariable Long id){
        return ResponseEntity.ok(borrowService.renewBook(id));
    }
}