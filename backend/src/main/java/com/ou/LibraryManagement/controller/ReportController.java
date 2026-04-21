//package com.ou.LibraryManagement.controller;
//
//import com.ou.LibraryManagement.dto.HotBook;
//import com.ou.LibraryManagement.dto.Overdue;
//import com.ou.LibraryManagement.service.ReportService;
//
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//import org.springframework.security.access.prepost.PreAuthorize;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/reports")
//public class ReportController {
//
//    private final ReportService service;
//
//    public ReportController(ReportService service){
//        this.service = service;
//    }
//
//    // 🔒 LIBRARIAN + ADMIN
//    @PreAuthorize("hasAnyAuthority('LIBRARIAN','ADMIN')")
//    @GetMapping("/hot-books")
//    public ResponseEntity<List<HotBook>> getHotBooks(){
//        return ResponseEntity.ok(service.getHotBooks());
//    }
//
//    // 🔒 LIBRARIAN + ADMIN
//    @PreAuthorize("hasAnyAuthority('LIBRARIAN','ADMIN')")
//    @GetMapping("/overdue")
//    public ResponseEntity<List<Overdue>> getOverdue(){
//        return ResponseEntity.ok(service.getOverdueBooks());
//    }
//}