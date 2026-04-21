package com.ou.LibraryManagement.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OverdueResponse {
    private Long id;            // Mã phiếu mượn
    private String title;       // Tên sách
    private Double fine;        // Tổng tiền phạt (của riêng cuốn này)
}