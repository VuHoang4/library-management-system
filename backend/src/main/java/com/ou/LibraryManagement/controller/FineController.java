package com.ou.LibraryManagement.controller;

import com.ou.LibraryManagement.dto.fine.FineResponse;
import com.ou.LibraryManagement.entity.enums.FineStatus;
import com.ou.LibraryManagement.mapper.FineMapper;

import com.ou.LibraryManagement.service.FineService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/fines")
public class FineController {

    private final FineService fineService;

    public FineController(FineService fineService) {
        this.fineService = fineService;
    }

    // ================= LIBRARIAN =================

    @PreAuthorize("hasAnyRole('THU_THU','ADMIN')")
    @GetMapping
    public ResponseEntity<List<FineResponse>> getAll() {
        return ResponseEntity.ok(fineService.getAllFines());
    }

    @PreAuthorize("hasAnyRole('THU_THU','ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<FineResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(fineService.getFineDetail(id));
    }

    @PreAuthorize("hasAnyRole('THU_THU','ADMIN')")
    @GetMapping("/user/{userId}/unpaid")
    public ResponseEntity<List<FineResponse>> getUnpaidByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(
                fineService.getUnpaidFinesByUser(userId)
        );
    }

    // ================= READER =================

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/me")
    public ResponseEntity<List<FineResponse>> getMyFines(Principal principal) {
        return ResponseEntity.ok(
                fineService.getMyAllFines(principal.getName())
        );
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/me/unpaid")
    public ResponseEntity<List<FineResponse>> getMyUnpaid(Principal principal) {
        return ResponseEntity.ok(
                fineService.getMyUnpaidFines(principal.getName())
        );
    }
}