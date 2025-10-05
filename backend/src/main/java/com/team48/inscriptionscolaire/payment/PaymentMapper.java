package com.team48.inscriptionscolaire.payment;

import com.team48.inscriptionscolaire.enrollment.Enrollment;

public class PaymentMapper {
    
    public static Payment toEntity(PaymentDto dto) {
        if (dto == null) {
            return null;
        }
        
        return Payment.builder()
                .id(dto.getId())
                .sessionId(dto.getSessionId())
                .amount(dto.getAmount())
                .currency(dto.getCurrency())
                .status(dto.getStatus())
                .paymentDate(dto.getPaymentDate())
                .build();
    }
    
    public static PaymentDto toDto(Payment payment) {
        if (payment == null) {
            return null;
        }
        
        PaymentDto dto = new PaymentDto();
        dto.setId(payment.getId());
        dto.setSessionId(payment.getSessionId());
        dto.setAmount(payment.getAmount());
        dto.setCurrency(payment.getCurrency());
        dto.setStatus(payment.getStatus());
        dto.setPaymentDate(payment.getPaymentDate());
        dto.setCreatedDate(payment.getCreatedDate());
        dto.setLastModifiedDate(payment.getLastModifiedDate());
        
        // Set payment type
        if (payment.getPaymentType() != null) {
            dto.setPaymentType(payment.getPaymentType().toString());
        }
        
        // Set enrollment ID and program name if available
        if (payment.getEnrollment() != null) {
            dto.setEnrollmentId(payment.getEnrollment().getId());
            if (payment.getEnrollment().getProgram() != null) {
                dto.setEnrollmentName(payment.getEnrollment().getProgram().getProgramName());
            }
        }
        
        return dto;
    }
}