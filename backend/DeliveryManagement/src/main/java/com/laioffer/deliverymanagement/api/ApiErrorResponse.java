package com.laioffer.deliverymanagement.api;

public record ApiErrorResponse(
        String code,
        String message
) {
}
