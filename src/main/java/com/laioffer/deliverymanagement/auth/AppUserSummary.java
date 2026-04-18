package com.laioffer.deliverymanagement.auth;

import java.util.UUID;

public record AppUserSummary(
        UUID id,
        String email,
        String phone,
        String fullName,
        boolean guest
) {
}
