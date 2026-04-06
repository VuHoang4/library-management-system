package com.ou.LibraryManagement.controller;

import com.ou.LibraryManagement.config.AppConfig;
import com.ou.LibraryManagement.dto.payment.PaymentRequest;
import com.ou.LibraryManagement.dto.payment.PaymentResponse;
import com.ou.LibraryManagement.service.PaymentService;
import com.ou.LibraryManagement.service.momo.MoMoService;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;
    private final AppConfig appConfig;
    private final MoMoService momoService;

    public PaymentController(PaymentService paymentService, AppConfig appConfig, MoMoService momoService) {
        this.paymentService = paymentService;
        this.appConfig = appConfig;
        this.momoService = momoService;
    }

    // 🔒 ADMIN (xem toàn bộ)
    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping
    public ResponseEntity<List<PaymentResponse>> getAll(){
        return ResponseEntity.ok(paymentService.findAll());
    }

    // 🔓 USER xem payment của mình
    @GetMapping("/me")
    public ResponseEntity<List<PaymentResponse>> getMyPayments(Authentication auth){
        return ResponseEntity.ok(
                paymentService.getByEmail(auth.getName())
        );
    }

    // 🔓 USER thanh toán fine
    @PreAuthorize("hasAuthority('USER')")
    @PostMapping
    public ResponseEntity<PaymentResponse> payFine(@RequestBody PaymentRequest request){
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(paymentService.payFine(request));
    }

    // 🔓 USER tạo MoMo payment
    @PreAuthorize("hasAuthority('USER')")
    @PostMapping("/momo")
    public String payWithMoMo(@RequestParam Long fineId) throws Exception {
        return paymentService.createMoMoPayment(fineId);
    }

    // 🔓 PUBLIC (callback từ MoMo)
    @PostMapping("/momo-ipn")
    public ResponseEntity<?> momoIPN(@RequestBody Map<String, Object> data) throws Exception {

        System.out.println("IPN DATA: " + data);

        String orderId = (String) data.get("orderId");
        int resultCode = Integer.parseInt(data.get("resultCode").toString());
        String signature = (String) data.get("signature");

        // DEV MODE
        if (!appConfig.momoSecure) {
            paymentService.updateStatus(orderId, resultCode == 0);
            return ResponseEntity.ok().build();
        }

        // PROD MODE
        boolean valid = momoService.verifyIPN(data, signature);

        if (!valid) {
            return ResponseEntity.badRequest().body("Invalid signature");
        }

        paymentService.updateStatus(orderId, resultCode == 0);

        return ResponseEntity.ok().build();
    }

    // 🔓 USER tạo VNPay
    @PreAuthorize("hasAuthority('USER')")
    @GetMapping("/vnpay")
    public String payVNPay(@RequestParam Long fineId) {
        return paymentService.payWithVNPay(fineId);
    }

    // 🔓 PUBLIC return từ VNPay
    @GetMapping("/vnpay-return")
    public String vnpayReturn(HttpServletRequest request) {
        return paymentService.handleVNPayReturn(request);
    }
}