package com.ou.LibraryManagement.controller;

import com.ou.LibraryManagement.dto.fine.FineResponse;
import com.ou.LibraryManagement.service.FineService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/api/fines")
public class FineController {

    private final FineService fineService;

    public FineController(FineService fineService) {
        this.fineService = fineService;
    }

    // ================= QUERY =================

//    @PreAuthorize("hasAnyAuthority('LIBRARIAN','ADMIN')")
    @GetMapping
    public ResponseEntity<List<FineResponse>> getAll() {
        return ResponseEntity.ok(fineService.findAll());
    }

//    @PreAuthorize("hasAnyAuthority('LIBRARIAN','ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<FineResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(fineService.findById(id));
    }

    @GetMapping("/me")
    public ResponseEntity<List<FineResponse>> getMyFines(Authentication auth){
        return ResponseEntity.ok(
                fineService.getByUserEmail(auth.getName())
        );
    }

    @GetMapping("/me/unpaid")
    public ResponseEntity<List<FineResponse>> getMyUnpaid(Authentication auth){
        return ResponseEntity.ok(
                fineService.getUnpaidByUserEmail(auth.getName())
        );
    }

    // ================= ADMIN / LIBRARIAN =================

//    @PreAuthorize("hasAnyAuthority('LIBRARIAN','ADMIN')")
    @GetMapping("/user/{userId}/unpaid")
    public ResponseEntity<List<FineResponse>> getUnpaidByUser(
            @PathVariable Long userId
    ){
        return ResponseEntity.ok(
                fineService.getUnpaidByUserId(userId)
        );
    }
}