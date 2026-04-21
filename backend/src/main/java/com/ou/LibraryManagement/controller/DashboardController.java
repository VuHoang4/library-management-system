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
@RequestMapping("/api/users") // Match với React: /api/users/me/dashboard-summary
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    // Yêu cầu phải có role USER mới được xem (nếu bạn có dùng role)
    // @PreAuthorize("hasAuthority('USER')")
    @GetMapping("/me/dashboard-summary")
    public ResponseEntity<DashboardSummaryResponse> getMyDashboardSummary(Authentication authentication) {

        // authentication.getName() sẽ lấy email (hoặc username) từ Token JWT
        String email = authentication.getName();

        // Chuyển việc xử lý xuống tầng Service
        DashboardSummaryResponse summary = dashboardService.getSummaryByEmail(email);

        return ResponseEntity.ok(summary);
    }

    // API: GET /api/users/me/due-soon
    @GetMapping("/me/due-soon")
    public ResponseEntity<List<DueSoonResponse>> getMyDueSoonBooks(Authentication authentication) {
        String email = authentication.getName();
        List<DueSoonResponse> result = dashboardService.getDueSoonBooks(email);
        return ResponseEntity.ok(result);
    }

    // API: GET /api/users/me/overdue
    @GetMapping("/me/overdue")
    public ResponseEntity<List<OverdueResponse>> getMyOverdueBooks(Authentication authentication) {
        String email = authentication.getName();
        List<OverdueResponse> result = dashboardService.getOverdueBooks(email);
        return ResponseEntity.ok(result);
    }
}