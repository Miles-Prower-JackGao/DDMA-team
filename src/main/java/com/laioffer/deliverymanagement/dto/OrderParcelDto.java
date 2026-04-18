package com.laioffer.deliverymanagement.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record OrderParcelDto(
        UUID id,
        UUID orderId,
        String sizeTier,
        BigDecimal weightKg,
        boolean fragile,
        String deliveryNotes,
        String dimensions,
        String metadata
) {
}
