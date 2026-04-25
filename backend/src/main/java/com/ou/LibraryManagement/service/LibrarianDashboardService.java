package com.ou.LibraryManagement.service;

import com.ou.LibraryManagement.dto.dashboard.lib.LibrarianDashboardResponse;
import com.ou.LibraryManagement.dto.dashboard.lib.RecentBorrowResponse;

import java.util.List;
public interface LibrarianDashboardService {

    LibrarianDashboardResponse getSummary();

    List<RecentBorrowResponse> getRecentBorrows();
}