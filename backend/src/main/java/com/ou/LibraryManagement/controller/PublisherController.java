package com.ou.LibraryManagement.controller;

import com.ou.LibraryManagement.dto.publisher.PublisherRequest;
import com.ou.LibraryManagement.dto.publisher.PublisherResponse;
import com.ou.LibraryManagement.service.PublisherService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/api/publishers")
public class PublisherController {

    private final PublisherService publisherService;

    public PublisherController(PublisherService publisherService) {
        this.publisherService = publisherService;
    }

    //  USER + LIBRARIAN + ADMIN
    @GetMapping
    public ResponseEntity<List<PublisherResponse>> getAll() {
        return ResponseEntity.ok(publisherService.findAll());
    }

    //  USER + LIBRARIAN + ADMIN
    @GetMapping("/{id}")
    public ResponseEntity<PublisherResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(publisherService.findById(id));
    }

    //  LIBRARIAN + ADMIN
//    @PreAuthorize("hasAnyAuthority('LIBRARIAN','ADMIN')")
    @PostMapping
    public ResponseEntity<PublisherResponse> create(@Valid @RequestBody PublisherRequest request) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(publisherService.create(request));
    }

    //  LIBRARIAN + ADMIN
//    @PreAuthorize("hasAnyAuthority('LIBRARIAN','ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<PublisherResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody PublisherRequest request
    ) {
        return ResponseEntity.ok(publisherService.update(id, request));
    }

    //  ADMIN only
//    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        publisherService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}