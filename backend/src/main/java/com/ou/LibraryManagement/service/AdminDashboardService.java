package com.ou.LibraryManagement.service;

import com.ou.LibraryManagement.dto.dashboard.*;
import com.ou.LibraryManagement.dto.dashboard.admin.BadDebtorResponse;
import com.ou.LibraryManagement.dto.dashboard.admin.DashboardSummaryResponse;
import com.ou.LibraryManagement.dto.dashboard.admin.TopBookResponse;

import java.util.List;

public interface AdminDashboardService {

    DashboardSummaryResponse getSummary();

    List<TopBookResponse> getTopBooks();

    List<BadDebtorResponse> getBadDebtors();
}