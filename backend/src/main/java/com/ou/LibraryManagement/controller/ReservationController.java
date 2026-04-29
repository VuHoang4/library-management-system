package com.ou.LibraryManagement.controller;

import com.ou.LibraryManagement.dto.reservation.ReservationRequest;
import com.ou.LibraryManagement.dto.reservation.ReservationResponse;
import com.ou.LibraryManagement.service.ReservationService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    private final ReservationService reservationService;

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @PreAuthorize("hasAnyAuthority('ADMIN', 'LIBRARIAN')")
    @GetMapping
    public ResponseEntity<List<ReservationResponse>> getAll() {
        return ResponseEntity.ok(reservationService.getAll());
    }

    @PreAuthorize("hasAnyAuthority('ADMIN', 'LIBRARIAN')")
    @PutMapping("/complete")
    public ResponseEntity<Void> complete(@RequestParam Long userId,
                                         @RequestParam Long bookId) {
        reservationService.complete(userId, bookId);
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/me")
    public ResponseEntity<List<ReservationResponse>> getMyReservations(Principal principal) {
        return ResponseEntity.ok(
                reservationService.getMyReservations(principal.getName())
        );
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping
    public ResponseEntity<ReservationResponse> create(@RequestBody ReservationRequest request,
                                                      Principal principal) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(reservationService.createReservation(request, principal.getName()));
    }
}