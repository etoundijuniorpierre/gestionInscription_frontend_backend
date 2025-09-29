package com.team48.inscriptionscolaire.statistics;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class LastPaymentDto {
    private String sessionId;
    private BigDecimal amount;
    private String currency;
    private LocalDateTime paymentDate;
    private String studentName;
    private Integer enrollmentId;
}