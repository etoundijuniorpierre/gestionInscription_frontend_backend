package com.team48.inscriptionscolaire.payment;

import com.team48.inscriptionscolaire.enrollment.Enrollment;
import java.util.HashMap;
import java.util.Map;

public class PaymentMapper {
    
    public static Payment toEntity(  PaymentDto dto) {
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
    
    /**
     * Convert Payment entity to a frontend-friendly map format for the payment history display
     * @param payment The payment entity to convert
     * @return A map containing payment data for frontend display
     */
    public static Map<String, Object> toPaymentHistoryMap(Payment payment) {
        Map<String, Object> paymentMap = new HashMap<>();
        paymentMap.put("id", payment.getId());
        paymentMap.put("amount", payment.getAmount());
        paymentMap.put("currency", payment.getCurrency());
        paymentMap.put("status", payment.getStatus());
        paymentMap.put("paymentDate", payment.getPaymentDate());
        paymentMap.put("paymentType", payment.getPaymentType());
        
        Enrollment enrollment = payment.getEnrollment();
        if (enrollment != null) {
            paymentMap.put("enrollmentId", enrollment.getId());
            paymentMap.put("enrollmentName", enrollment.getProgram() != null ? enrollment.getProgram().getProgramName() : "N/A");
        }
        
        return paymentMap;
    }
}