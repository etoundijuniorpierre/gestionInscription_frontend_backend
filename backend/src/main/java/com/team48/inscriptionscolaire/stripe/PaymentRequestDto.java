package com.team48.inscriptionscolaire.stripe;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentRequestDto {
    // The amount to be paid, in the smallest currency unit (e.g., CFA for USD)
    private Long amount;

    // The ID of the enrollment this payment is for
    private Integer enrollmentId;
}
