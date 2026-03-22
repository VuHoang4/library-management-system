package com.ou.LibraryManagement.service;

import com.ou.LibraryManagement.dto.payment.PaymentRequest;
import com.ou.LibraryManagement.dto.payment.PaymentResponse;
import com.ou.LibraryManagement.entity.Fine;
import com.ou.LibraryManagement.entity.Payment;
import com.ou.LibraryManagement.entity.User;
import com.ou.LibraryManagement.entity.enums.FineStatus;
import com.ou.LibraryManagement.entity.enums.PaymentStatus;
import com.ou.LibraryManagement.exception.BadRequestException;
import com.ou.LibraryManagement.exception.NotFoundException;
import com.ou.LibraryManagement.repository.FineRepository;
import com.ou.LibraryManagement.repository.PaymentRepository;
import com.ou.LibraryManagement.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final FineRepository fineRepository;
    private final UserRepository userRepository;

    public PaymentService(
            PaymentRepository paymentRepository,
            FineRepository fineRepository,
            UserRepository userRepository
    ) {
        this.paymentRepository = paymentRepository;
        this.fineRepository = fineRepository;
        this.userRepository = userRepository;
    }

    // 🔹 Lấy tất cả payment
    public List<PaymentResponse> findAll(){
        return paymentRepository.findAll()
                .stream()
                .map(PaymentResponse::fromEntity)
                .toList();
    }

    // 🔹 Lấy theo user
    public List<PaymentResponse> getByUser(Long userId){
        return paymentRepository.findByUserId(userId)
                .stream()
                .map(PaymentResponse::fromEntity)
                .toList();
    }

    // 🔹 Thanh toán fine
    @Transactional
    public PaymentResponse payFine(PaymentRequest request){

        Fine fine = fineRepository.findById(request.fineId())
                .orElseThrow(() -> new NotFoundException("Fine not found"));

        if(fine.getStatus() == FineStatus.PAID){
            throw new BadRequestException("Fine already paid");
        }

        User user = fine.getUser();

        Payment payment = new Payment();
        payment.setFine(fine);
        payment.setUser(user);
        payment.setAmount(fine.getAmount());
        payment.setMethod(request.method());
        payment.setStatus(PaymentStatus.SUCCESS); // mock luôn

        Payment saved = paymentRepository.save(payment);

        // 🔥 update fine
        fine.setStatus(FineStatus.PAID);
        fineRepository.save(fine);

        return PaymentResponse.fromEntity(saved);
    }
}