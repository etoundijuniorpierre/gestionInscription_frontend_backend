package com.team48.inscriptionscolaire.payment;

import com.team48.inscriptionscolaire.common.BaseEntity;
import com.team48.inscriptionscolaire.enrollment.Enrollment;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class Payment extends BaseEntity {
    
    private String sessionId;
    private BigDecimal amount;
    private String currency;
    private String status;
    private LocalDateTime paymentDate;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "enrollment_id")
    private Enrollment enrollment;
    
    // Type of payment: REGISTRATION_FEE or PROGRAM_PAYMENT
    @Enumerated(EnumType.STRING)
    private PaymentType paymentType;
    
    // Payment method used
    private String paymentMethod;
}