package com.ou.LibraryManagement.controller;

import com.ou.LibraryManagement.dto.FineRequest;
import com.ou.LibraryManagement.dto.FineResponse;
import com.ou.LibraryManagement.model.Fine;
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
        return fineService.findById(id);
    }

    @PostMapping
    public ResponseEntity<FineResponse> create(@RequestBody FineRequest request) {
        return fineService.create(request);
    }

    @PutMapping("/pay/{id}")
    public ResponseEntity<FineResponse> payFine(@PathVariable Long id) {
        return fineService.payFine(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {

        return fineService.deleteById(id)
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }
}