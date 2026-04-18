package com.laioffer.deliverymanagement.controller;

import java.math.BigDecimal;
import java.util.UUID;

public record PayOrderResponse(
        UUID orderId,
        String handoffPin,
        String vehicleType,
        int etaMinutes,
        BigDecimal totalAmount,
        String currency
) {
}
