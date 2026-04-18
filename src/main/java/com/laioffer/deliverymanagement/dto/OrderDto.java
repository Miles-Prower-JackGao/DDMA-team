package com.laioffer.deliverymanagement.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

public record OrderDto(
        UUID id,
        UUID userId,
        UUID centerId,
        UUID fleetVehicleId,
        String status,
        String vehicleTypeChosen,
        String pickupSummary,
        String dropoffSummary,
        String handoffPin,
        Integer estimatedMinutes,
        BigDecimal totalAmount,
        String currency,
        BigDecimal simLatitude,
        BigDecimal simLongitude,
        BigDecimal simHeadingDeg,
        OffsetDateTime simUpdatedAt,
        String planSnapshot,
        String trackingState,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt,
        int version,
        String metadata
) {
}
