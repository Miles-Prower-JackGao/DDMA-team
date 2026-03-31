package com.laioffer.deliverymanagement.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

public record OtpChallengeDto(
        UUID id,
        UUID userId,
        String channel,
        String codeHash,
        OffsetDateTime expiresAt,
        boolean consumed,
        short attemptCount,
        OffsetDateTime createdAt
) {
}
