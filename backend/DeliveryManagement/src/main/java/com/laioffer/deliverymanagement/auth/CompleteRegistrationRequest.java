package com.laioffer.deliverymanagement.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record CompleteRegistrationRequest(
        @NotNull UUID challengeId,
        @NotBlank String otpCode
) {
}
