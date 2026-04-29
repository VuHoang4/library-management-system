package com.ou.LibraryManagement.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OverdueResponse {
    private Long id;
    private String title;
    private Double fine;
}