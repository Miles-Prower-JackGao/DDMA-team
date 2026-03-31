package com.laioffer.deliverymanagement.auth;

public record RegistrationResponse(
        AppUserSummary user,
        String message
) {
}
