package com.ou.LibraryManagement.controller;

import com.ou.LibraryManagement.dto.author.AuthorRequest;
import com.ou.LibraryManagement.dto.author.AuthorResponse;
import com.ou.LibraryManagement.service.AuthorService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/api/authors")
public class AuthorController {

    private final AuthorService authorService;

    public AuthorController(AuthorService authorService) {
        this.authorService = authorService;
    }

    // ===== PUBLIC =====
    @GetMapping
    public ResponseEntity<List<AuthorResponse>> getAll() {
        return ResponseEntity.ok(authorService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AuthorResponse> getOne(@PathVariable Long id) {
        return ResponseEntity.ok(authorService.getById(id));
    }

    // ===== ADMIN =====
  //  @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<AuthorResponse> create(@RequestBody @Valid AuthorRequest request) {
        return ResponseEntity.ok(authorService.create(request));
    }

   // @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<AuthorResponse> update(@PathVariable Long id,
                                                 @RequestBody @Valid AuthorRequest request) {
        return ResponseEntity.ok(authorService.update(id, request));
    }

   // @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        authorService.delete(id);
        return ResponseEntity.noContent().build();
    }
}