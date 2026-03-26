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

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;
    private final AppConfig appConfig;
    private final MoMoService momoService;

    public PaymentController(PaymentService paymentService,AppConfig appConfig,MoMoService momoService) {
        this.paymentService = paymentService;
        this.appConfig = appConfig;
        this.momoService = momoService;
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

    // 🔹 tạo payment MoMo
    @PostMapping("/momo")
    public String payWithMoMo(@RequestParam Long fineId) throws Exception {
        return paymentService.createMoMoPayment(fineId);
    }

    // 🔹 callback từ MoMo
    @PostMapping("/momo-ipn")
    public ResponseEntity<?> momoIPN(@RequestBody Map<String, Object> data) throws Exception {

        System.out.println("IPN DATA: " + data);

        String orderId = (String) data.get("orderId");
        int resultCode = Integer.parseInt(data.get("resultCode").toString());
        String signature = (String) data.get("signature");

        //  DEV MODE (cho phép fake)
        if (!appConfig.momoSecure) {
            paymentService.updateStatus(orderId, resultCode == 0);
            return ResponseEntity.ok().build();
        }

        //  PRODUCTION MODE (verify signature)
        boolean valid = momoService.verifyIPN(data, signature);

        if (!valid) {
            return ResponseEntity.badRequest().body("Invalid signature");
        }

        paymentService.updateStatus(orderId, resultCode == 0);

        return ResponseEntity.ok().build();
    }


    @GetMapping("/vnpay")
    public String payVNPay(@RequestParam Long fineId) {
        return paymentService.payWithVNPay(fineId);
    }

    @GetMapping("/vnpay-return")
    public String vnpayReturn(HttpServletRequest request) {
        return paymentService.handleVNPayReturn(request);
    }
}