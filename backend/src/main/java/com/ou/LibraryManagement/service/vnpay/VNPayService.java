package com.ou.LibraryManagement.service.vnpay;

import com.ou.LibraryManagement.config.VNPayConfig;
import com.ou.LibraryManagement.util.VNPayUtil;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Service
public class VNPayService {

    public String createPaymentUrl(Map<String, String> params) {

        List<String> fieldNames = new ArrayList<>(params.keySet());
        Collections.sort(fieldNames);

        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();

        boolean first = true;

        for (String field : fieldNames) {
            String value = params.get(field);

            if (value == null || value.isEmpty()) continue;

            //  CHỈ bỏ SecureHash
            if (field.equals("vnp_SecureHash")) continue;

            String encodedValue = URLEncoder.encode(value, StandardCharsets.US_ASCII);

            if (!first) {
                hashData.append('&');
                query.append('&');
            }

            //  QUAN TRỌNG: HASH cũng dùng encoded
            hashData.append(field).append('=').append(encodedValue);

            query.append(field).append('=').append(encodedValue);

            first = false;
        }

        String secureHash = VNPayUtil.hmacSHA512(
                VNPayConfig.vnp_HashSecret,
                hashData.toString()
        );

        System.out.println("HASH DATA: " + hashData);

        return VNPayConfig.vnp_Url + "?"
                + query + "&vnp_SecureHash=" + secureHash;
    }

    public boolean verifyReturn(Map<String, String> fields) {

        String secureHash = fields.remove("vnp_SecureHash");

//  FIX QUAN TRỌNG
        fields.remove("vnp_SecureHashType");

        List<String> fieldNames = new ArrayList<>(fields.keySet());
        Collections.sort(fieldNames);

        StringBuilder hashData = new StringBuilder();
        boolean first = true;

        for (String field : fieldNames) {
            String value = fields.get(field);

            if (value == null || value.isEmpty()) continue;

            if (!first) {
                hashData.append('&');
            }

            hashData.append(field).append('=').append(value);
            first = false;
        }

        String signValue = VNPayUtil.hmacSHA512(
                VNPayConfig.vnp_HashSecret,
                hashData.toString()
        );

        return signValue.equals(secureHash);
    }
}