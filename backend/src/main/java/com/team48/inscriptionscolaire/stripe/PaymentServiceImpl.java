package com.team48.inscriptionscolaire.stripe;

import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import com.team48.inscriptionscolaire.enrollment.Enrollment;
import com.team48.inscriptionscolaire.enrollment.EnrollmentRepository;
import com.team48.inscriptionscolaire.payment.Payment;
import com.team48.inscriptionscolaire.payment.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final EnrollmentRepository enrollmentRepository;
    private final PaymentRepository paymentRepository;

    @Override
    public PaymentResponseDto createStripeSession(PaymentRequestDto paymentRequest) throws StripeException {
        // Define the success and cancel URLs
        String successUrl = "http://localhost:5173/payment/success"; // Update to your frontend URL
        String cancelUrl = "http://localhost:5173/payment/cancel";   // Update to your frontend URL

        SessionCreateParams params = SessionCreateParams.builder()
                .addPaymentMethodType(SessionCreateParams.PaymentMethodType.CARD)
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl(successUrl)
                .setCancelUrl(cancelUrl)
                .addLineItem(
                        SessionCreateParams.LineItem.builder()
                                .setPriceData(
                                        SessionCreateParams.LineItem.PriceData.builder()
                                                .setCurrency("usd")
                                                .setUnitAmount(paymentRequest.getAmount()) // Use dynamic amount
                                                .setProductData(
                                                        SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                .setName("Enrollment Fee - ID: " + paymentRequest.getEnrollmentId()) // Use dynamic data
                                                                .build())
                                                .build())
                                .setQuantity(1L)
                                .build())
                .build();

        Session session = Session.create(params);

        // Save payment information to our database
        Enrollment enrollment = enrollmentRepository.findById(paymentRequest.getEnrollmentId()).orElse(null);
        if (enrollment != null) {
            Payment payment = Payment.builder()
                    .sessionId(session.getId())
                    .amount(new BigDecimal(paymentRequest.getAmount()).divide(new BigDecimal(100))) // Convert cents to dollars
                    .currency("usd")
                    .status("PENDING")
                    .paymentDate(LocalDateTime.now())
                    .enrollment(enrollment)
                    .build();
            
            paymentRepository.save(payment);
        }

        return new PaymentResponseDto(session.getId());
    }
}