package com.ou.LibraryManagement.util;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.util.HexFormat;

public class VNPayUtil {

    public static String hmacSHA512(String key, String data) {
        try {
            Mac hmac = Mac.getInstance("HmacSHA512");
            SecretKeySpec secretKey =
                    new SecretKeySpec(key.getBytes(), "HmacSHA512");

            hmac.init(secretKey);

            byte[] hash = hmac.doFinal(data.getBytes());
            return HexFormat.of().formatHex(hash);

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}