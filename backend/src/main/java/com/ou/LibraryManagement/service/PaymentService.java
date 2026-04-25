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
import com.ou.LibraryManagement.mapper.PaymentMapper;
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
    private final PaymentMapper paymentMapper;

    public PaymentService(
            PaymentRepository paymentRepository,
            FineRepository fineRepository,
            MoMoService momoService,
            VNPayService vnPayService, PaymentMapper paymentMapper
    ) {
        this.paymentRepository = paymentRepository;
        this.fineRepository = fineRepository;
        this.momoService = momoService;
        this.vnPayService = vnPayService;
        this.paymentMapper = paymentMapper;
    }

    // ================= QUERY (Chỉ trả về Entity) =================

    public List<Payment> findAllEntities() {
        return paymentRepository.findAll();
    }

    public List<Payment> findEntitiesByUserId(Long userId) {
        // Lưu ý: Tên hàm trong Repo nên là findByUserId hoặc findByFine_User_Id
        return paymentRepository.findByFine_User_Id(userId);
    }

    public Payment findEntityById(Long id) {
        return paymentRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy giao dịch với ID: " + id));
    }

    public List<Payment> findEntitiesByEmail(String email) {
        return paymentRepository.findByUserEmail(email);
    }

    public List<PaymentResponse> getPayments(String status, String search) {

        List<Payment> payments = paymentRepository.findAll();

        return payments.stream()
                .filter(p -> {
                    if (status == null || status.equalsIgnoreCase("ALL")) return true;
                    return p.getStatus().name().equalsIgnoreCase(status);
                })
                .filter(p -> {
                    if (search == null || search.isBlank()) return true;
                    return p.getUser().getName().toLowerCase().contains(search.toLowerCase())
                            || p.getOrderId().toLowerCase().contains(search.toLowerCase());
                })
                .map(paymentMapper::toResponse)
                .toList();
    }

    // ================= COMMAND =================
    @Transactional
    public PaymentResponse payFine(PaymentRequest request){

        Fine fine = findFine(request.fineId());

        // Kiểm tra điều kiện thanh toán (Chưa trả sách sẽ bị chặn lại đây)
        validateFinePayable(fine);

        Payment payment = createPayment(fine, request);
        Payment saved = paymentRepository.save(payment);

        //  update fine status
        fine.setStatus(FineStatus.PAID);
        fineRepository.save(fine);

        return paymentMapper.toResponse(saved);
    }
    @Transactional
    public PaymentResponse confirmFinePayment(Long fineId) {

        Fine fine = findFine(fineId);

        // ❗ đã thanh toán rồi
        if (fine.getStatus() == FineStatus.PAID) {
            throw new BadRequestException("Phiếu phạt đã được thanh toán.");
        }

        // ❗ phải trả sách trước
        validateFinePayable(fine);

        // 👉 tạo payment CASH
        Payment payment = new Payment();
        payment.setFine(fine);
        payment.setUser(fine.getUser());
        payment.setAmount(fine.getAmount());
        payment.setMethod("CASH");
        payment.setStatus(PaymentStatus.SUCCESS);

        Payment saved = paymentRepository.save(payment);

        // 👉 update fine
        fine.setStatus(FineStatus.PAID);
        fineRepository.save(fine);

        return paymentMapper.toResponse(saved);
    }

    @Transactional
    public String createMoMoPayment(Long fineId) throws Exception {

        Fine fine = findFine(fineId);

        // Cú chặn thứ 2 dành cho MoMo
        validateFinePayable(fine);

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

    public String payWithVNPay(Long fineId) {

        Fine fine = findFine(fineId);

        // Cú chặn thứ 3 dành cho VNPay
        validateFinePayable(fine);

        long amount = (long) (fine.getAmount() * 100);
        String orderId = UUID.randomUUID().toString();

        // tạo payment
        Payment payment = new Payment();
        payment.setFine(fine);
        payment.setUser(fine.getUser());
        payment.setAmount(fine.getAmount());
        payment.setMethod("VNPAY");
        payment.setStatus(PaymentStatus.PENDING);
        payment.setOrderId(orderId);

        paymentRepository.save(payment);

        //  params
        Map<String, String> params = new HashMap<>();

        params.put("vnp_Version", "2.1.0");
        params.put("vnp_Command", "pay");
        params.put("vnp_TmnCode", VNPayConfig.vnp_TmnCode);
        params.put("vnp_Amount", String.valueOf(amount));
        params.put("vnp_CurrCode", "VND");

        params.put("vnp_TxnRef", orderId);
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

    @Transactional
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
            if(Double.compare(payment.getAmount(), fine.getAmount()) != 0){
                throw new RuntimeException("Amount mismatch");
            }

            fine.setStatus(FineStatus.PAID);
            fineRepository.save(fine);

        } else {
            payment.setStatus(PaymentStatus.FAILED);
        }

        paymentRepository.save(payment);
    }

    public String handleVNPayReturn(HttpServletRequest request) {

        Map<String, String> fields = new HashMap<>();
        request.getParameterMap().forEach((k, v) -> {
            fields.put(k, v[0]);
        });

        // DEBUG
        System.out.println("VNPay return params: " + fields);

        // Đường dẫn gốc của Frontend React
        String frontendUrl = "http://localhost:5173/payment-result";

        // Validate param cơ bản
        String orderId = request.getParameter("vnp_TxnRef");
        String responseCode = request.getParameter("vnp_ResponseCode");

        if (orderId == null || responseCode == null) {
            return frontendUrl + "?status=failed&message=Missing_Parameters";
        }

        // Verify signature
        if (!vnPayService.verifyReturn(new HashMap<>(fields))) {
            return frontendUrl + "?status=failed&message=Invalid_Signature";
        }

        // Tìm payment
        Optional<Payment> optionalPayment = paymentRepository.findByOrderId(orderId);

        if (optionalPayment.isEmpty()) {
            return frontendUrl + "?status=failed&message=Payment_Not_Found";
        }

        Payment payment = optionalPayment.get();

        // Tránh update lại nhiều lần (nếu người dùng F5 tải lại trang)
        if (payment.getStatus() == PaymentStatus.SUCCESS) {
            return frontendUrl + "?status=success&orderId=" + orderId;
        }

        // SUCCESS - Mã 00 là giao dịch thành công
        if ("00".equals(responseCode)) {
            payment.setStatus(PaymentStatus.SUCCESS);

            Fine fine = payment.getFine();
            fine.setStatus(FineStatus.PAID);

            fineRepository.save(fine);
            paymentRepository.save(payment);

            // Trả về link Frontend kèm status success
            return frontendUrl + "?status=success&orderId=" + orderId;
        }

        // FAILED - Các mã khác là thất bại/hủy giao dịch
        payment.setStatus(PaymentStatus.FAILED);
        paymentRepository.save(payment);

        // Trả về link Frontend kèm status failed
        return frontendUrl + "?status=failed&orderId=" + orderId;
    }

    // ================= HELPER =================
    private Fine findFine(Long id){
        return fineRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Fine not found"));
    }

    /**
     * Hàm dùng chung để kiểm tra xem một phiếu phạt có hợp lệ để thanh toán hay không
     */
    private void validateFinePayable(Fine fine) {
        // 1. Kiểm tra xem đã thanh toán chưa
        if (fine.getStatus() == FineStatus.PAID) {
            throw new BadRequestException("Phiếu phạt này đã được thanh toán.");
        }

        // 2. Kiểm tra xem đã trả sách chưa (Bắt buộc phải trả sách mới chốt được tiền phạt)
        if (fine.getBorrow() != null && fine.getBorrow().getReturnDate() == null) {
            throw new BadRequestException("Không thể thanh toán! Vui lòng mang sách đến thư viện để trả và chốt hóa đơn trước.");
        }
    }

    private Payment createPayment(Fine fine, PaymentRequest request){
        Payment payment = new Payment();

        payment.setFine(fine);
        payment.setUser(fine.getUser()); // Bổ sung set User để query getByUser không bị lỗi
        payment.setAmount(fine.getAmount());
        payment.setMethod(request.method());
        payment.setStatus(PaymentStatus.PENDING);

        return payment;
    }
}