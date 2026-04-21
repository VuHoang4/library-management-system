package com.ou.LibraryManagement.controller;

import com.ou.LibraryManagement.dto.borrow.BorrowRequest;
import com.ou.LibraryManagement.dto.borrow.BorrowResponse;

import com.ou.LibraryManagement.service.BorrowService;
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/borrows")
public class BorrowController {

    private final BorrowService borrowService;

    public BorrowController(BorrowService borrowService) {
        this.borrowService = borrowService;
    }

    // ================= LIBRARIAN =================

  //  @PreAuthorize("hasAnyRole('THU_THU','ADMIN')")
    @GetMapping
    public ResponseEntity<List<BorrowResponse>> getAll() {
        return ResponseEntity.ok(borrowService.getAll());
    }

 //   @PreAuthorize("hasAnyRole('THU_THU','ADMIN')")
    @PostMapping
    public ResponseEntity<BorrowResponse> borrowBook(@Valid @RequestBody BorrowRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(borrowService.borrowBook(request));
    }

  //  @PreAuthorize("hasAnyRole('THU_THU','ADMIN')")
    @PutMapping("/{id}/return")
    public ResponseEntity<BorrowResponse> returnBook(@PathVariable Long id) {
        return ResponseEntity.ok(borrowService.returnBook(id));
    }

  //  @PreAuthorize("hasAnyRole('THU_THU','ADMIN')")
    @PutMapping("/{id}/renew")
    public ResponseEntity<BorrowResponse> renew(@PathVariable Long id) {
        return ResponseEntity.ok(borrowService.renewBook(id));
    }

    // ================= READER =================

  //  @PreAuthorize("isAuthenticated()")
    @GetMapping("/me")
    public ResponseEntity<List<BorrowResponse>> getMyBorrows(Principal principal) {
        return ResponseEntity.ok(
                borrowService.getMyBorrows(principal.getName())
        );
    }
}