package com.laioffer.deliverymanagement.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

public record AppUserDto(
        UUID id,
        String email,
        String phone,
        String passwordHash,
        String fullName,
        boolean guest,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt,
        int version,
        String metadata
) {
}
