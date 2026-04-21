package com.ou.LibraryManagement.service;

import com.ou.LibraryManagement.dto.dashboard.DashboardSummaryResponse;
import com.ou.LibraryManagement.dto.dashboard.DueSoonResponse;
import com.ou.LibraryManagement.dto.dashboard.OverdueResponse;

import java.util.List;

public interface DashboardService {
    // Hàm nhận vào email (từ token) và trả về dữ liệu thống kê
    DashboardSummaryResponse getSummaryByEmail(String email);
    List<DueSoonResponse> getDueSoonBooks(String email);
    List<OverdueResponse> getOverdueBooks(String email);
}