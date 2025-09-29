package com.team48.inscriptionscolaire.statistics;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class StatisticsDto {
    // Static statistics
    private Long totalEnrollments;
    private Long validatedEnrollments;
    private Long pendingEnrollments;
    private Long newAccountsLast24h;
    
    // Real-time statistics
    private Long connectedAccounts;
    private LastDocumentDto lastValidatedDocument;
    private LastEnrollmentDto lastEnrollment;
    private LastPaymentDto lastPayment;
}