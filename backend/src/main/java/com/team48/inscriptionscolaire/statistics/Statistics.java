package com.team48.inscriptionscolaire.statistics;

import com.team48.inscriptionscolaire.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@Entity
@Table
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class Statistics extends BaseEntity {
    
    // Static statistics
    private Long totalEnrollments;
    private Long validatedEnrollments;
    private Long pendingEnrollments;
    private Long newAccountsLast24h;
    
    // Real-time statistics
    private Long connectedAccounts;
    
    // Timestamp of when these statistics were generated
    private LocalDateTime generatedAt;
    
    // Type of statistics (daily, weekly, monthly, real-time)
    private String statisticsType;
    
    // Additional metrics
    private Long totalPayments;
    private Long totalDocuments;
    private Long approvedDocuments;
    
    @PrePersist
    public void prePersist() {
        this.generatedAt = LocalDateTime.now();
    }
}