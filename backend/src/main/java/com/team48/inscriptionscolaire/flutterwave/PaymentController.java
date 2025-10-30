package com.team48.inscriptionscolaire.flutterwave;

import com.fasterxml.jackson.databind.JsonNode;
import com.team48.inscriptionscolaire.enrollment.Enrollment;
import com.team48.inscriptionscolaire.enrollment.EnrollmentRepository;
import com.team48.inscriptionscolaire.enrollment.StatusSubmission;
import com.team48.inscriptionscolaire.payment.Payment;
import com.team48.inscriptionscolaire.payment.PaymentMapper;
import com.team48.inscriptionscolaire.payment.PaymentRepository;
import com.team48.inscriptionscolaire.payment.PaymentType;
import com.team48.inscriptionscolaire.student.Student;
import com.team48.inscriptionscolaire.student.StudentStatus;
import com.team48.inscriptionscolaire.user.User;
import com.team48.inscriptionscolaire.user.UserRepository;
import com.team48.inscriptionscolaire.enrollment.EnrollmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final FlutterwaveService flutterwaveService;
    private final EnrollmentRepository enrollmentRepository;
    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final EnrollmentService enrollmentService;

    @PostMapping("/initiate/registration-fee")
    public ResponseEntity<?> initiateRegistrationFeePayment(@RequestBody Map<String, Object> body, Authentication authentication) {
        try {
            // Get the current user
            User user = (User) authentication.getPrincipal();
            
            // Get enrollment ID from body
            Integer enrollmentId = Integer.valueOf(body.get("enrollmentId").toString());
            Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                    .orElseThrow(() -> new RuntimeException("Enrollment not found"));
            
            // Verify that the enrollment belongs to the current user
            if (!enrollment.getStudent().getId().equals(user.getId())) {
                return ResponseEntity.badRequest().body(Map.of("error", "You can only initiate payment for your own enrollments"));
            }
            
            // Check that enrollment is in correct status for registration fee payment
            if (enrollment.getStatus() != StatusSubmission.PENDING_PAYMENT) {
                return ResponseEntity.badRequest().body(Map.of("error", "Enrollment is not in a valid status for registration fee payment"));
            }
            
            // Registration fee payment
            PaymentType paymentType = PaymentType.REGISTRATION_FEE;
            // Use the actual registration fee from the program instead of mock data
            Double amount = enrollment.getProgram().getRegistrationFee() != null ? 
                         enrollment.getProgram().getRegistrationFee().doubleValue() : 5000.0;
            
            String email = user.getEmail();
            String redirectUrl = (String) body.get("redirectUrl");

            // Create a custom tx_ref that includes the enrollment ID for easy identification
            String txRef = "ENR-" + enrollment.getId() + "-" + UUID.randomUUID();

            String link = flutterwaveService.createPaymentLink(email, amount, redirectUrl, txRef);
            
            // Create or update payment record
            Payment payment = enrollment.getPayment() != null ? enrollment.getPayment() : new Payment();
            payment.setAmount(new BigDecimal(amount));
            payment.setCurrency("XAF");
            payment.setStatus("PENDING");
            payment.setPaymentDate(LocalDateTime.now());
            payment.setEnrollment(enrollment);
            payment.setPaymentType(paymentType);
            payment.setPaymentMethod("FLUTTERWAVE");
            paymentRepository.save(payment);
            
            return ResponseEntity.ok(Map.of("link", link, "paymentId", payment.getId()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/initiate/program-payment")
    public ResponseEntity<?> initiateProgramPayment(@RequestBody Map<String, Object> body, Authentication authentication) {
        try {
            // Get the current user
            User user = (User) authentication.getPrincipal();
            
            // Get enrollment ID from body
            Integer enrollmentId = Integer.valueOf(body.get("enrollmentId").toString());
            Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                    .orElseThrow(() -> new RuntimeException("Enrollment not found"));
            
            // Verify that the enrollment belongs to the current user
            if (!enrollment.getStudent().getId().equals(user.getId())) {
                return ResponseEntity.badRequest().body(Map.of("error", "You can only initiate payment for your own enrollments"));
            }
            
            // Check that enrollment is in correct status for program payment
            if (enrollment.getStatus() != StatusSubmission.PENDING_PROGRAM_PAYMENT) {
                return ResponseEntity.badRequest().body(Map.of("error", "Enrollment is not in a valid status for program payment"));
            }
            
            // Program payment
            PaymentType paymentType = PaymentType.PROGRAM_PAYMENT;
            // Use the actual program price instead of mock data
            Double amount = enrollment.getProgram().getPrice() != null ? 
                         enrollment.getProgram().getPrice().doubleValue() : 10000.0;
            
            String email = user.getEmail();
            String redirectUrl = (String) body.get("redirectUrl");

            // Create a custom tx_ref that includes the enrollment ID for easy identification
            String txRef = "ENR-" + enrollment.getId() + "-" + UUID.randomUUID();

            String link = flutterwaveService.createPaymentLink(email, amount, redirectUrl, txRef);
            
            // Create or update payment record
            Payment payment = enrollment.getPayment() != null ? enrollment.getPayment() : new Payment();
            payment.setAmount(new BigDecimal(amount));
            payment.setCurrency("XAF");
            payment.setStatus("PENDING");
            payment.setPaymentDate(LocalDateTime.now());
            payment.setEnrollment(enrollment);
            payment.setPaymentType(paymentType);
            payment.setPaymentMethod("FLUTTERWAVE");
            paymentRepository.save(payment);
            
            return ResponseEntity.ok(Map.of("link", link, "paymentId", payment.getId()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Get all payments for the current user
     */
    @GetMapping("/my-payments")
    public ResponseEntity<?> getMyPayments(Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            
            // Get all enrollments for the current user
            List<Enrollment> enrollments = enrollmentRepository.findByStudentId(user.getId());
            
            // Get all payments associated with these enrollments
            List<Payment> payments = enrollments.stream()
                .filter(enrollment -> enrollment.getPayment() != null)
                .map(Enrollment::getPayment)
                .collect(Collectors.toList());
            
            // Convert to a more frontend-friendly format using the PaymentMapper
            List<Map<String, Object>> paymentData = payments.stream()
                .map(PaymentMapper::toPaymentHistoryMap)
                .collect(Collectors.toList());
            
            return ResponseEntity.ok(paymentData);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Webhook endpoint. Flutterwave will POST an event here.
     * We do a server-side verification by calling Flutterwave verify endpoint with the transaction id.
     */
    @PostMapping("/webhook")
    public ResponseEntity<String> handleWebhook(@RequestBody Map<String, Object> payload) {
        try {
            System.out.println("Webhook received with payload: " + payload);
            
            // payload example: { "event": "charge.completed", "data": { "id": 12345, "status": "successful", ... } }
            Map<String, Object> data = (Map<String, Object>) payload.get("data");
            if (data == null) {
                System.out.println("No data in webhook payload");
                return ResponseEntity.badRequest().body("No data in webhook");
            }

            Object idObj = data.get("id"); // Flutterwave transaction id
            if (idObj == null) {
                System.out.println("No transaction id present in webhook data");
                return ResponseEntity.badRequest().body("No transaction id present");
            }

            String transactionId = idObj.toString();
            System.out.println("Processing transaction ID: " + transactionId);
            
            // Verify transaction with Flutterwave
            JsonNode verification = flutterwaveService.verifyTransactionById(transactionId);
            JsonNode status = verification.path("data").path("status");
            String stat = status.asText("");
            System.out.println("Transaction status: " + stat);

            if ("successful".equalsIgnoreCase(stat)) {
                String txRef = verification.path("data").path("tx_ref").asText();
                System.out.println("Transaction tx_ref: " + txRef);
                
                // Extract enrollment ID from tx_ref
                Long enrollmentId = extractEnrollmentIdFromTxRef(txRef);
                System.out.println("Extracted enrollment ID: " + enrollmentId);
                
                if (enrollmentId != null) {
                    // Find the enrollment and update its status
                    Enrollment enrollment = enrollmentRepository.findById(Math.toIntExact(enrollmentId))
                            .orElse(null);
                    
                    if (enrollment != null) {
                        System.out.println("Found enrollment with ID: " + enrollmentId + " and status: " + enrollment.getStatus());
                        
                        // Get the payment to determine the payment type
                        Payment payment = enrollment.getPayment();
                        if (payment != null) {
                            // Update enrollment status based on payment type using the service method
                            enrollmentService.updateEnrollmentStatusAfterPayment(enrollment.getId(), payment.getPaymentType());
                            System.out.println("Updated enrollment status based on payment type: " + payment.getPaymentType());
                        }
                        
                        // Update payment status
                        if (payment != null) {
                            payment.setStatus("SUCCESSFUL");
                            paymentRepository.save(payment);
                            System.out.println("Updated payment status to COMPLETED");
                        }
                        
                        System.out.println("Payment successful for enrollment ID: " + enrollmentId);
                    } else {
                        System.out.println("Enrollment with ID " + enrollmentId + " not found");
                    }
                } else {
                    System.out.println("Could not extract enrollment ID from tx_ref: " + txRef);
                }
                
                System.out.println("Payment verified successful for tx_ref=" + txRef);
            } else {
                System.out.println("Payment not successful: " + stat + " for transactionId=" + transactionId);
            }

            return ResponseEntity.ok("Received");
        } catch (Exception e) {
            System.err.println("Error processing webhook: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error processing webhook: " + e.getMessage());
        }
    }
    
    /**
     * Extract enrollment ID from tx_ref string
     * @param txRef the transaction reference string
     * @return the enrollment ID or null if not found
     */
    private Long extractEnrollmentIdFromTxRef(String txRef) {
        try {
            if (txRef != null && txRef.startsWith("ENR-")) {
                // Format is ENR-{enrollmentId}-{UUID}
                String[] parts = txRef.split("-");
                if (parts.length >= 2) {
                    return Long.parseLong(parts[1]);
                }
            }
        } catch (NumberFormatException e) {
            // Ignore and return null
        }
        return null;
    }
}