package com.ou.LibraryManagement.controller;

import com.ou.LibraryManagement.config.AppConfig;
import com.ou.LibraryManagement.dto.payment.PaymentRequest;
import com.ou.LibraryManagement.dto.payment.PaymentResponse;
import com.ou.LibraryManagement.mapper.PaymentMapper;
import com.ou.LibraryManagement.service.PaymentService;
import com.ou.LibraryManagement.service.momo.MoMoService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.prepost.PreAuthorize;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;
    private final AppConfig appConfig;
    private final MoMoService momoService;
    private final PaymentMapper paymentMapper;

    public PaymentController(PaymentService paymentService, AppConfig appConfig, MoMoService momoService, PaymentMapper paymentMapper) {
        this.paymentService = paymentService;
        this.appConfig = appConfig;
        this.momoService = momoService;
        this.paymentMapper = paymentMapper;
    }

    @PreAuthorize("hasAnyAuthority('ADMIN', 'LIBRARIAN')")
    @GetMapping
    public ResponseEntity<List<PaymentResponse>> getPayments(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search
    ) {
        return ResponseEntity.ok(paymentService.getPayments(status, search));
    }

    @PreAuthorize("hasAnyAuthority('ADMIN', 'LIBRARIAN')")
    @PutMapping("/fines/{id}/pay-cash")
    public ResponseEntity<PaymentResponse> payCash(@PathVariable Long id) {
        return ResponseEntity.ok(paymentService.confirmFinePayment(id));
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/me")
    public ResponseEntity<List<PaymentResponse>> getMyPayments(Authentication auth){
        List<PaymentResponse> responses = paymentService.findEntitiesByEmail(auth.getName())
                .stream()
                .map(paymentMapper::toResponse)
                .toList();
        return ResponseEntity.ok(responses);
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping
    public ResponseEntity<PaymentResponse> payFine(@RequestBody PaymentRequest request){
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(paymentService.payFine(request));
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/momo")
    public String payWithMoMo(@RequestParam Long fineId) throws Exception {
        return paymentService.createMoMoPayment(fineId);
    }

    @PostMapping("/momo-ipn")
    public ResponseEntity<?> momoIPN(@RequestBody Map<String, Object> data) throws Exception {
        String orderId = (String) data.get("orderId");
        int resultCode = Integer.parseInt(data.get("resultCode").toString());
        String signature = (String) data.get("signature");

        if (!appConfig.momoSecure) {
            paymentService.updateStatus(orderId, resultCode == 0);
            return ResponseEntity.ok().build();
        }

        boolean valid = momoService.verifyIPN(data, signature);
        if (!valid) {
            return ResponseEntity.badRequest().body("Invalid signature");
        }

        paymentService.updateStatus(orderId, resultCode == 0);
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/vnpay")
    public String payVNPay(@RequestParam Long fineId) {
        return paymentService.payWithVNPay(fineId);
    }

    @GetMapping("/vnpay-return")
    public void vnpayReturn(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String redirectUrl = paymentService.handleVNPayReturn(request);
        response.sendRedirect(redirectUrl);
    }
}