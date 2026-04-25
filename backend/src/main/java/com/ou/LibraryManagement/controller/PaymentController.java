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

    // 🔒 ADMIN (xem toàn bộ)
//    @PreAuthorize("hasAuthority('ADMIN')")
// 🔓 ADMIN xem tất cả
    @GetMapping
    public ResponseEntity<List<PaymentResponse>> getPayments(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search
    ) {
        return ResponseEntity.ok(paymentService.getPayments(status, search));
    }

    @PutMapping("/fines/{id}/pay-cash")
    public ResponseEntity<PaymentResponse> payCash(@PathVariable Long id) {
        return ResponseEntity.ok(paymentService.confirmFinePayment(id));
    }
    // 🔓 USER xem payment của mình
    @GetMapping("/me")
    public ResponseEntity<List<PaymentResponse>> getMyPayments(Authentication auth){
        List<PaymentResponse> responses = paymentService.findEntitiesByEmail(auth.getName())
                .stream()
                .map(paymentMapper::toResponse) // 3. Tương tự, map ở đây
                .toList();
        return ResponseEntity.ok(responses);
    }

    // 🔓 USER thanh toán fine
//    @PreAuthorize("hasAuthority('USER')")
    @PostMapping
    public ResponseEntity<PaymentResponse> payFine(@RequestBody PaymentRequest request){
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(paymentService.payFine(request));
    }

    // 🔓 USER tạo MoMo payment
//    @PreAuthorize("hasAuthority('USER')")
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
//    @PreAuthorize("hasAuthority('USER')")
    @GetMapping("/vnpay")
    public String payVNPay(@RequestParam Long fineId) {
        return paymentService.payWithVNPay(fineId);
    }

    // 🔓 PUBLIC return từ VNPay
    @GetMapping("/vnpay-return")
    public void vnpayReturn(HttpServletRequest request, HttpServletResponse response) throws IOException {
        // Lấy URL từ logic xử lý của Service
        String redirectUrl = paymentService.handleVNPayReturn(request);

        // Bắn lệnh Redirect để đẩy người dùng về lại React (localhost:3000)
        response.sendRedirect(redirectUrl);
    }
}