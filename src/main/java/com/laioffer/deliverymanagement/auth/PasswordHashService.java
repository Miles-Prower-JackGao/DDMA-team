package com.laioffer.deliverymanagement.auth;

import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.HexFormat;

@Component
public class PasswordHashService {

    private static final String PREFIX = "sha256";
    private static final int SALT_BYTES = 12;

    public String hash(String rawValue) {
        String salt = HexFormat.of().formatHex(randomBytes());
        return encode(rawValue, salt);
    }

    public boolean matches(String rawValue, String encodedValue) {
        if (encodedValue == null || encodedValue.isBlank()) {
            return false;
        }

        String[] parts = encodedValue.split("\\$", 3);
        if (parts.length != 3 || !PREFIX.equals(parts[0])) {
            return false;
        }

        String expected = encode(rawValue, parts[1]);
        return MessageDigest.isEqual(
                expected.getBytes(StandardCharsets.UTF_8),
                encodedValue.getBytes(StandardCharsets.UTF_8)
        );
    }

    private String encode(String rawValue, String salt) {
        return PREFIX + "$" + salt + "$" + sha256Hex(salt + ":" + rawValue);
    }

    private String sha256Hex(String value) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            return HexFormat.of().formatHex(digest.digest(value.getBytes(StandardCharsets.UTF_8)));
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 algorithm unavailable", e);
        }
    }

    private byte[] randomBytes() {
        byte[] salt = new byte[SALT_BYTES];
        new SecureRandom().nextBytes(salt);
        return salt;
    }
}
