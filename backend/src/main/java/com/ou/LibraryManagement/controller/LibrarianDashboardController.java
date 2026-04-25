package com.ou.LibraryManagement.controller;

import com.ou.LibraryManagement.dto.dashboard.lib.LibrarianDashboardResponse;
import com.ou.LibraryManagement.dto.dashboard.lib.RecentBorrowResponse;
import com.ou.LibraryManagement.service.LibrarianDashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
@RestController
@RequestMapping("/api/librarian/dashboard")
public class LibrarianDashboardController {

    private final LibrarianDashboardService service;

    public LibrarianDashboardController(LibrarianDashboardService service) {
        this.service = service;
    }

    @GetMapping("/summary")
    public ResponseEntity<LibrarianDashboardResponse> getSummary() {
        return ResponseEntity.ok(service.getSummary());
    }

    @GetMapping("/recent-borrows")
    public ResponseEntity<List<RecentBorrowResponse>> getRecent() {
        return ResponseEntity.ok(service.getRecentBorrows());
    }
}