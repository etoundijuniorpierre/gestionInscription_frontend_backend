package com.team48.inscriptionscolaire.payment;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class PaymentDto {
    private Integer id;
    private String sessionId;
    private BigDecimal amount;
    private String currency;
    private String status;
    private LocalDateTime paymentDate;
    private Integer enrollmentId;
    private String enrollmentName; // Program name from enrollment
    private String paymentType; // REGISTRATION_FEE or PROGRAM_PAYMENT
    
    // BaseEntity audit fields
    private LocalDateTime createdDate;
    private LocalDateTime lastModifiedDate;
}