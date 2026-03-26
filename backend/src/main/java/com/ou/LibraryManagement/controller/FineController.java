package com.ou.LibraryManagement.controller;

import com.ou.LibraryManagement.dto.fine.FineResponse;
import com.ou.LibraryManagement.service.FineService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fines")
public class FineController {

    private final FineService fineService;

    public FineController(FineService fineService) {
        this.fineService = fineService;
    }

    @GetMapping
    public ResponseEntity<List<FineResponse>> getAll() {
        return ResponseEntity.ok(fineService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FineResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(fineService.findById(id));
    }
    @GetMapping("/user/{userId}")
    public List<FineResponse> getByUser(@PathVariable Long userId){
        return fineService.getByUser(userId);
    }
    @GetMapping("/user/{userId}/unpaid")
    public List<FineResponse> getUnpaid(@PathVariable Long userId){
        return fineService.getUnpaidByUser(userId);
    }

//    @DeleteMapping("/{id}")
//    public ResponseEntity<Void> delete(@PathVariable Long id) {
//        fineService.deleteById(id);
//        return ResponseEntity.noContent().build();
//    }
}