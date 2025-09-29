package com.team48.inscriptionscolaire.stripe;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PaymentResponseDto {
    private String sessionId;
}
