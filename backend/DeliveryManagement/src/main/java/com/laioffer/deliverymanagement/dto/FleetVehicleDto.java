package com.laioffer.deliverymanagement.dto;

import java.util.UUID;

public record FleetVehicleDto(
        UUID id,
        UUID centerId,
        String vehicleType,
        boolean available,
        String externalDeviceId,
        String telemetryHint,
        String metadata
) {
}
