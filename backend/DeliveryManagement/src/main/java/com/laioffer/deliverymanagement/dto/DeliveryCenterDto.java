package com.laioffer.deliverymanagement.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record DeliveryCenterDto(
        UUID id,
        String name,
        BigDecimal latitude,
        BigDecimal longitude,
        String addressLine,
        String serviceAreaGeo,
        String metadata
) {
}
