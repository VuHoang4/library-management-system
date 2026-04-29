package com.ou.LibraryManagement.controller;

import com.ou.LibraryManagement.dto.dashboard.admin.DashboardSummaryResponse;
import com.ou.LibraryManagement.dto.dashboard.admin.BadDebtorResponse;
import com.ou.LibraryManagement.dto.dashboard.admin.TopBookResponse;
import com.ou.LibraryManagement.service.impl.AdminDashboardServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
@RestController
@RequestMapping("/api/admin/dashboard")
public class AdminDashboardController {

    @Autowired
    private AdminDashboardServiceImpl dashboardService;

    @GetMapping("/summary")
    public DashboardSummaryResponse getSummary() {
        return dashboardService.getSummary();
    }

    @GetMapping("/top-books")
    public List<TopBookResponse> getTopBooks() {
        return dashboardService.getTopBooks();
    }

    @GetMapping("/bad-debtors")
    public List<BadDebtorResponse> getBadDebtors() {
        return dashboardService.getBadDebtors();
    }
}