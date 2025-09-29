package com.team48.inscriptionscolaire.statistics;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class LastEnrollmentDto {
    private Integer id;
    private String studentName;
    private String programName;
    private LocalDateTime submissionDate;
    private String status;
}