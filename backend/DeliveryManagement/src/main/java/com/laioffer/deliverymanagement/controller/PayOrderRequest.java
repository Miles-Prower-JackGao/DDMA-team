package com.laioffer.deliverymanagement.controller;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.math.BigDecimal;

public record PayOrderRequest(
        @NotBlank @Pattern(regexp = "ROBOT|DRONE") String vehicleType,
        @NotNull @DecimalMin("0.01") BigDecimal priceUsd,
        @NotNull @Min(1) Integer etaMinutes
) {
}
