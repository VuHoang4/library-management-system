package com.ou.LibraryManagement.service.momo;

import com.ou.LibraryManagement.config.MoMoConfig;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class MoMoService {

    public String createPayment(String orderId, long amount) throws Exception {

        String requestId = UUID.randomUUID().toString();
        String orderInfo = "Thanh toan tien phat";

        String extraData = "";

        String rawHash = "accessKey=" + MoMoConfig.ACCESS_KEY +
                "&amount=" + amount +
                "&extraData=" + extraData +
                "&ipnUrl=" + MoMoConfig.NOTIFY_URL +
                "&orderId=" + orderId +
                "&orderInfo=" + orderInfo +
                "&partnerCode=" + MoMoConfig.PARTNER_CODE +
                "&redirectUrl=" + MoMoConfig.RETURN_URL +
                "&requestId=" + requestId +
                "&requestType=captureWallet";

        String signature = hmacSHA256(rawHash, MoMoConfig.SECRET_KEY);

        Map<String, Object> body = new HashMap<>();
        body.put("partnerCode", MoMoConfig.PARTNER_CODE);
        body.put("accessKey", MoMoConfig.ACCESS_KEY);
        body.put("requestId", requestId);
        body.put("amount", amount);
        body.put("orderId", orderId);
        body.put("orderInfo", orderInfo);
        body.put("redirectUrl", MoMoConfig.RETURN_URL);
        body.put("ipnUrl", MoMoConfig.NOTIFY_URL);
        body.put("requestType", "captureWallet");
        body.put("extraData", extraData); //  THÊM DÒNG NÀY
        body.put("signature", signature);

        RestTemplate restTemplate = new RestTemplate();
        Map response = restTemplate.postForObject(MoMoConfig.ENDPOINT, body, Map.class);

        return (String) response.get("payUrl");
    }

    private String hmacSHA256(String data, String key) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(), "HmacSHA256");
        mac.init(secretKey);
        byte[] hash = mac.doFinal(data.getBytes());

        StringBuilder hex = new StringBuilder();
        for (byte b : hash) {
            hex.append(String.format("%02x", b));
        }
        return hex.toString();
    }

    public boolean verifyIPN(Map<String, Object> data, String momoSignature) throws Exception {

        String accessKey = MoMoConfig.ACCESS_KEY;
        String partnerCode = MoMoConfig.PARTNER_CODE;

        String orderId = data.get("orderId").toString();
        String requestId = data.get("requestId").toString();
        String amount = data.get("amount").toString();
        String orderInfo = data.get("orderInfo").toString();
        String orderType = data.get("orderType").toString();
        String transId = data.get("transId").toString();
        String resultCode = data.get("resultCode").toString();
        String message = data.get("message").toString();
        String payType = data.get("payType") == null ? "" : data.get("payType").toString();
        String responseTime = data.get("responseTime").toString();
        String extraData = data.get("extraData") == null ? "" : data.get("extraData").toString();

        String rawHash = "accessKey=" + accessKey +
                "&amount=" + amount +
                "&extraData=" + extraData +
                "&message=" + message +
                "&orderId=" + orderId +
                "&orderInfo=" + orderInfo +
                "&orderType=" + orderType +
                "&partnerCode=" + partnerCode +
                "&payType=" + payType +
                "&requestId=" + requestId +
                "&responseTime=" + responseTime +
                "&resultCode=" + resultCode +
                "&transId=" + transId;

        String mySignature = hmacSHA256(rawHash, MoMoConfig.SECRET_KEY);

        return mySignature.equals(momoSignature);
    }
}