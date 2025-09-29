package com.team48.inscriptionscolaire.stripe;

import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import com.team48.inscriptionscolaire.payment.Payment;
import com.team48.inscriptionscolaire.payment.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
@Slf4j
public class PaymentController {

    private final PaymentService paymentService;
    private final PaymentRepository paymentRepository;

    @Value("${stripe.webhook.secret:}")
    private String endpointSecret;

    @PostMapping("/create-session")
    public ResponseEntity<PaymentResponseDto> createPaymentSession(@RequestBody PaymentRequestDto paymentRequest) throws StripeException {
        PaymentResponseDto response = paymentService.createStripeSession(paymentRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/webhook")
    public ResponseEntity<String> handleStripeWebhook(@RequestBody String payload, @RequestHeader("Stripe-Signature") String sigHeader) {
        Event event;
        try {
            event = Webhook.constructEvent(payload, sigHeader, endpointSecret);
        } catch (SignatureVerificationException e) {
            log.error("Webhook signature verification failed", e);
            return ResponseEntity.badRequest().body("Webhook signature verification failed");
        }

        switch (event.getType()) {
            case "checkout.session.completed":
                Session session = (Session) event.getDataObjectDeserializer().getObject().orElse(null);
                if (session != null) {
                    // Update payment status in our database
                    paymentRepository.findBySessionId(session.getId()).ifPresent(payment -> {
                        payment.setStatus("COMPLETED");
                        paymentRepository.save(payment);
                    });
                }
                break;
            default:
                log.info("Unhandled event type: {}", event.getType());
        }

        return ResponseEntity.ok().body("Success");
    }
}