package com.laioffer.deliverymanagement.auth;

public record LoginResponse(
        String accessToken,
        String tokenType,
        long expiresIn,
        AppUserSummary user
) {
}
