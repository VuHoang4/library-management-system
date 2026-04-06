package com.ou.LibraryManagement.controller;

import com.ou.LibraryManagement.dto.reservation.ReservationRequest;
import com.ou.LibraryManagement.dto.reservation.ReservationResponse;
import com.ou.LibraryManagement.service.ReservationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    private final ReservationService service;

    public ReservationController(ReservationService service) {
        this.service = service;
    }

    // ================= GET =================
    @GetMapping
    public ResponseEntity<List<ReservationResponse>> getAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ReservationResponse>> getByUser(
            @PathVariable Long userId
    ) {
        return ResponseEntity.ok(service.getByUser(userId));
    }

    // ================= CREATE =================
    @PostMapping
    public ResponseEntity<ReservationResponse> create(
            @RequestBody ReservationRequest request
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(service.create(request));
    }

    // ================= COMPLETE =================
    @PutMapping("/complete")
    public ResponseEntity<Void> complete(
            @RequestParam Long userId,
            @RequestParam Long bookId
    ){
        service.completeReservation(userId, bookId);
        return ResponseEntity.ok().build();
    }

    // ================= DELETE =================
//    @DeleteMapping("/{id}")
//    public ResponseEntity<Void> delete(@PathVariable Long id) {
//        service.deleteById(id);
//        return ResponseEntity.noContent().build();
//    }
}