package com.team48.inscriptionscolaire.stripe;

import com.stripe.exception.StripeException;
import org.springframework.stereotype.Service;

@Service
public interface PaymentService {
    PaymentResponseDto createStripeSession(PaymentRequestDto paymentRequest) throws StripeException;
}
