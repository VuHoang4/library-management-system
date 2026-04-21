package com.ou.LibraryManagement.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummaryResponse {
    private int borrowCount;         // Số sách đang mượn
    private int reservationCount;    // Số sách đang đặt trước
    private double totalDebt;          // Tổng nợ phạt chưa đóng
    private int dueSoonCount;        // Số sách sắp đến hạn (ví dụ: trong 3 ngày tới)
}