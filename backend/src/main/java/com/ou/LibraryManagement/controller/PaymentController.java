package com.ou.LibraryManagement.controller;

import com.ou.LibraryManagement.dto.payment.PaymentRequest;
import com.ou.LibraryManagement.dto.payment.PaymentResponse;
import com.ou.LibraryManagement.service.PaymentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    // 🔹 Lấy tất cả payment
    @GetMapping
    public ResponseEntity<List<PaymentResponse>> getAll(){
        return ResponseEntity.ok(paymentService.findAll());
    }

    // 🔹 Lấy payment theo user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PaymentResponse>> getByUser(@PathVariable Long userId){
        return ResponseEntity.ok(paymentService.getByUser(userId));
    }

    // 🔹 Thanh toán fine
    @PostMapping
    public ResponseEntity<PaymentResponse> payFine(@RequestBody PaymentRequest request){
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(paymentService.payFine(request));
    }
}