package com.ou.LibraryManagement.config;

import org.springframework.stereotype.Component;

@Component
public class VNPayConfig {

    public static String vnp_TmnCode = "EKORTRWW";
    public static String vnp_HashSecret = "0Z845VOQI8GIJTQIMQCVSSVN34QX5AZ3";

    public static String vnp_Url =
            "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";

    //  dùng ngrok
    public static final String vnp_ReturnUrl =
            "https://second-passengers-hope-westminster.trycloudflare.com/api/payments/vnpay-return";
}