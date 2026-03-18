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

    private final ReservationService reservationService;

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @GetMapping
    public ResponseEntity<List<ReservationResponse>> getAll() {
        return ResponseEntity.ok(reservationService.findAll());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ReservationResponse>> getUserReservations(@PathVariable Long userId) {
        return ResponseEntity.ok(reservationService.getByUser(userId));
    }

    @PostMapping
    public ResponseEntity<ReservationResponse> create(@RequestBody ReservationRequest request) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(reservationService.create(request));
    }

    //  khi sách có sẵn
    @PutMapping("/{id}/ready")
    public ResponseEntity<ReservationResponse> markReady(@PathVariable Long id){
        return ResponseEntity.ok(reservationService.markReady(id));
    }

    //  user nhận sách
    @PutMapping("/{id}/complete")
    public ResponseEntity<ReservationResponse> complete(@PathVariable Long id){
        return ResponseEntity.ok(reservationService.complete(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        reservationService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}