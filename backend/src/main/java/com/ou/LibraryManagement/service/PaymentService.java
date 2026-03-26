package com.ou.LibraryManagement.service;

import com.ou.LibraryManagement.config.VNPayConfig;
import com.ou.LibraryManagement.dto.payment.PaymentRequest;
import com.ou.LibraryManagement.dto.payment.PaymentResponse;
import com.ou.LibraryManagement.entity.Fine;
import com.ou.LibraryManagement.entity.Payment;
import com.ou.LibraryManagement.entity.enums.FineStatus;
import com.ou.LibraryManagement.entity.enums.PaymentStatus;
import com.ou.LibraryManagement.exception.BadRequestException;
import com.ou.LibraryManagement.exception.NotFoundException;
import com.ou.LibraryManagement.repository.FineRepository;
import com.ou.LibraryManagement.repository.PaymentRepository;
import com.ou.LibraryManagement.service.momo.MoMoService;
import com.ou.LibraryManagement.service.vnpay.VNPayService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final FineRepository fineRepository;
    private final MoMoService momoService;
    private final VNPayService vnPayService;

    public PaymentService(
            PaymentRepository paymentRepository,
            FineRepository fineRepository,
            MoMoService momoService,
            VNPayService vnPayService
    ) {
        this.paymentRepository = paymentRepository;
        this.fineRepository = fineRepository;
        this.momoService = momoService;
        this.vnPayService = vnPayService;
    }

    // ================= QUERY =================
    public List<PaymentResponse> findAll(){
        return paymentRepository.findAll()
                .stream()
                .map(PaymentResponse::fromEntity)
                .toList();
    }

    public List<PaymentResponse> getByUser(Long userId){
        return paymentRepository.findByFine_User_Id(userId)
                .stream()
                .map(PaymentResponse::fromEntity)
                .toList();
    }

    public PaymentResponse findById(Long id){
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Payment not found"));

        return PaymentResponse.fromEntity(payment);
    }

    // ================= COMMAND =================
    @Transactional
    public PaymentResponse payFine(PaymentRequest request){

        Fine fine = findFine(request.fineId());

        validateFineNotPaid(fine);

        Payment payment = createPayment(fine, request);

        Payment saved = paymentRepository.save(payment);

        //  update fine status
        fine.setStatus(FineStatus.PAID);

        return PaymentResponse.fromEntity(saved);
    }

    // ================= HELPER =================
    private Fine findFine(Long id){
        return fineRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Fine not found"));
    }

    private void validateFineNotPaid(Fine fine){
        if(fine.getStatus() == FineStatus.PAID){
            throw new BadRequestException("Fine already paid");
        }
    }

    private Payment createPayment(Fine fine, PaymentRequest request){
        Payment payment = new Payment();

        payment.setFine(fine);
        payment.setAmount(fine.getAmount());
        payment.setMethod(request.method());
        payment.setStatus(PaymentStatus.PENDING);

        return payment;
    }

    @Transactional
    public String createMoMoPayment(Long fineId) throws Exception {

        Fine fine = fineRepository.findById(fineId)
                .orElseThrow(() -> new NotFoundException("Fine not found"));

        if (fine.getStatus() == FineStatus.PAID) {
            throw new BadRequestException("Fine already paid");
        }
        String orderId = UUID.randomUUID().toString();

        Payment payment = new Payment();
        payment.setOrderId(orderId);
        payment.setFine(fine);
        payment.setUser(fine.getUser());
        payment.setAmount(fine.getAmount());
        payment.setMethod("MOMO");
        payment.setStatus(PaymentStatus.PENDING);

        paymentRepository.save(payment);

        return momoService.createPayment(orderId, (long) fine.getAmount());
    }

    public void updateStatus(String orderId, boolean success){

        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new NotFoundException("Payment not found"));

        //  tránh update 2 lần
        if(payment.getStatus() != PaymentStatus.PENDING){
            return;
        }

        if(success){
            payment.setStatus(PaymentStatus.SUCCESS);

            Fine fine = payment.getFine();

            //  check amount (anti hack)
            if(payment.getAmount() != fine.getAmount()){
                throw new RuntimeException("Amount mismatch");
            }

            fine.setStatus(FineStatus.PAID);
            fineRepository.save(fine);

        } else {
            payment.setStatus(PaymentStatus.FAILED);
        }

        paymentRepository.save(payment);
    }

    public String payWithVNPay(Long fineId) {

        Fine fine = fineRepository.findById(fineId)
                .orElseThrow(() -> new NotFoundException("Fine not found"));

        if (fine.getStatus() == FineStatus.PAID) {
            throw new BadRequestException("Fine already paid");
        }

        long amount = (long) (fine.getAmount() * 100);

        String txnRef = String.valueOf(System.currentTimeMillis());

        // tạo payment
        Payment payment = new Payment();
        payment.setFine(fine);
        payment.setUser(fine.getUser());
        payment.setAmount(fine.getAmount());
        payment.setMethod("VNPAY");
        payment.setStatus(PaymentStatus.PENDING);
        payment.setTxnRef(txnRef);

        paymentRepository.save(payment);

        //  params
        Map<String, String> params = new HashMap<>();

        params.put("vnp_Version", "2.1.0");
        params.put("vnp_Command", "pay");
        params.put("vnp_TmnCode", VNPayConfig.vnp_TmnCode);
        params.put("vnp_Amount", String.valueOf(amount));
        params.put("vnp_CurrCode", "VND");

        params.put("vnp_TxnRef", txnRef);
        params.put("vnp_OrderInfo", "thanh_toan_fine_" + fineId);
        params.put("vnp_OrderType", "other");

        params.put("vnp_Locale", "vn");
        params.put("vnp_ReturnUrl", VNPayConfig.vnp_ReturnUrl);
        params.put("vnp_IpAddr", "8.8.8.8");

        params.put("vnp_CreateDate",
                new SimpleDateFormat("yyyyMMddHHmmss").format(new Date())
        );


        return vnPayService.createPaymentUrl(params);
    }

    public String handleVNPayReturn(HttpServletRequest request) {

        Map<String, String> fields = new HashMap<>();

        request.getParameterMap().forEach((k, v) -> {
            fields.put(k, v[0]);
        });

        //  DEBUG
        System.out.println("VNPay return params: " + fields);

        //  validate param cơ bản
        String txnRef = request.getParameter("vnp_TxnRef");
        String responseCode = request.getParameter("vnp_ResponseCode");

        if (txnRef == null || responseCode == null) {
            return "Missing VNPay parameters";
        }

        // verify signature
        if (!vnPayService.verifyReturn(new HashMap<>(fields))) {
            return "Invalid signature";
        }

        //  tìm payment
        Optional<Payment> optionalPayment = paymentRepository.findByTxnRef(txnRef);

        if (optionalPayment.isEmpty()) {
            return "Payment not found with txnRef=" + txnRef;
        }

        Payment payment = optionalPayment.get();

        //  tránh update lại nhiều lần
        if (payment.getStatus() == PaymentStatus.SUCCESS) {
            return "Payment already processed";
        }

        // SUCCESS
        if ("00".equals(responseCode)) {

            payment.setStatus(PaymentStatus.SUCCESS);

            Fine fine = payment.getFine();
            fine.setStatus(FineStatus.PAID);

            fineRepository.save(fine);
            paymentRepository.save(payment);

            return "Thanh toán thành công";
        }

        //  FAILED
        payment.setStatus(PaymentStatus.FAILED);
        paymentRepository.save(payment);

        return "Thanh toán thất bại";
    }

}