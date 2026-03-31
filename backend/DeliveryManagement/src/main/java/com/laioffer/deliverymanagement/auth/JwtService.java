package com.laioffer.deliverymanagement.auth;

import com.laioffer.deliverymanagement.dto.AppUserDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.Map;

@Component
public class JwtService {

    private final byte[] secret;
    private final long expirationSeconds;

    public JwtService(
            @Value("${app.auth.jwt-secret}") String secret,
            @Value("${app.auth.jwt-expiration-seconds}") long expirationSeconds
    ) {
        this.secret = secret.getBytes(StandardCharsets.UTF_8);
        this.expirationSeconds = expirationSeconds;
    }

    public String issueToken(AppUserDto user) {
        Instant now = Instant.now();
        String header = encodeJson(Map.of("alg", "HS256", "typ", "JWT"));

        Map<String, Object> payloadBody = new LinkedHashMap<>();
        payloadBody.put("sub", user.id().toString());
        payloadBody.put("email", user.email());
        payloadBody.put("phone", user.phone());
        payloadBody.put("guest", user.guest());
        payloadBody.put("iat", now.getEpochSecond());
        payloadBody.put("exp", now.plusSeconds(expirationSeconds).getEpochSecond());
        String payload = encodeJson(payloadBody);

        String signingInput = header + "." + payload;
        return signingInput + "." + sign(signingInput);
    }

    public long expirationSeconds() {
        return expirationSeconds;
    }

    private String encodeJson(Map<String, Object> body) {
        StringBuilder builder = new StringBuilder("{");
        boolean first = true;
        for (Map.Entry<String, Object> entry : body.entrySet()) {
            if (!first) {
                builder.append(',');
            }
            builder.append('"').append(escapeJson(entry.getKey())).append('"').append(':');
            appendJsonValue(builder, entry.getValue());
            first = false;
        }
        builder.append('}');
        return Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(builder.toString().getBytes(StandardCharsets.UTF_8));
    }

    private void appendJsonValue(StringBuilder builder, Object value) {
        if (value == null) {
            builder.append("null");
            return;
        }
        if (value instanceof Number || value instanceof Boolean) {
            builder.append(value);
            return;
        }
        builder.append('"').append(escapeJson(String.valueOf(value))).append('"');
    }

    private String escapeJson(String value) {
        return value
                .replace("\\", "\\\\")
                .replace("\"", "\\\"");
    }

    private String sign(String signingInput) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(secret, "HmacSHA256"));
            byte[] signature = mac.doFinal(signingInput.getBytes(StandardCharsets.UTF_8));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(signature);
        } catch (Exception e) {
            throw new IllegalStateException("Failed to sign JWT", e);
        }
    }
}
