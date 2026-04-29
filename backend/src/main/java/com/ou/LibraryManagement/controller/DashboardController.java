package com.ou.LibraryManagement.controller;

import com.ou.LibraryManagement.dto.dashboard.DashboardSummaryResponse;
import com.ou.LibraryManagement.dto.dashboard.DueSoonResponse;
import com.ou.LibraryManagement.dto.dashboard.OverdueResponse;
import com.ou.LibraryManagement.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/me/summary")
    public ResponseEntity<DashboardSummaryResponse> getMyDashboardSummary(Authentication authentication) {
        String email = authentication.getName();
        DashboardSummaryResponse summary = dashboardService.getSummaryByEmail(email);
        return ResponseEntity.ok(summary);
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/me/due-soon")
    public ResponseEntity<List<DueSoonResponse>> getMyDueSoonBooks(Authentication authentication) {
        String email = authentication.getName();
        List<DueSoonResponse> result = dashboardService.getDueSoonBooks(email);
        return ResponseEntity.ok(result);
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/me/overdue")
    public ResponseEntity<List<OverdueResponse>> getMyOverdueBooks(Authentication authentication) {
        String email = authentication.getName();
        List<OverdueResponse> result = dashboardService.getOverdueBooks(email);
        return ResponseEntity.ok(result);
    }
}