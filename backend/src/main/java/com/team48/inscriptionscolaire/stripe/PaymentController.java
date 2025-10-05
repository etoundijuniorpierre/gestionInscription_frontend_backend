package com.team48.inscriptionscolaire.stripe;

import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import com.team48.inscriptionscolaire.enrollment.EnrollmentRepository;
import com.team48.inscriptionscolaire.enrollment.StatusSubmission;
import com.team48.inscriptionscolaire.notification.NotificationService;
import com.team48.inscriptionscolaire.payment.Payment;
import com.team48.inscriptionscolaire.payment.PaymentDto;
import com.team48.inscriptionscolaire.payment.PaymentMapper;
import com.team48.inscriptionscolaire.payment.PaymentRepository;
import com.team48.inscriptionscolaire.user.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
@Slf4j
public class PaymentController {

    private final PaymentService paymentService;
    private final PaymentRepository paymentRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final NotificationService notificationService;

    @Value("${stripe.webhook.secret:}")
    private String endpointSecret;

    @PostMapping("/create-session")
    public ResponseEntity<PaymentResponseDto> createPaymentSession(@RequestBody PaymentRequestDto paymentRequest) throws StripeException {
        PaymentResponseDto response = paymentService.createStripeSession(paymentRequest);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my-payments")
    public ResponseEntity<List<PaymentDto>> getMyPayments(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        List<Payment> payments = paymentRepository.findByStudentId(user.getId());
        List<PaymentDto> paymentDtos = payments.stream()
                .map(PaymentMapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(paymentDtos);
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
                        
                        // Update enrollment status based on payment type
                        if (payment.getEnrollment() != null) {
                            if (payment.getPaymentType() == com.team48.inscriptionscolaire.payment.PaymentType.REGISTRATION_FEE) {
                                // For registration fee, move enrollment to PENDING status
                                payment.getEnrollment().setStatus(StatusSubmission.PENDING);
                                enrollmentRepository.save(payment.getEnrollment());
                            } else if (payment.getPaymentType() == com.team48.inscriptionscolaire.payment.PaymentType.PROGRAM_PAYMENT) {
                                // For program payment, enrollment is already APPROVED
                                // No status change needed
                            }
                            
                            // Send notification to admins about payment completion
                            String adminMessage = "Un paiement a été effectué par " + 
                                    payment.getEnrollment().getStudent().fullName() + 
                                    " pour le programme '" + 
                                    payment.getEnrollment().getProgram().getProgramName() + 
                                    "'. Type de paiement: " + 
                                    payment.getPaymentType().toString();
                            notificationService.sendNotificationToAdmins(adminMessage);
                        }
                    });
                }
                break;
            default:
                log.info("Unhandled event type: {}", event.getType());
        }

        return ResponseEntity.ok().body("Success");
    }
}