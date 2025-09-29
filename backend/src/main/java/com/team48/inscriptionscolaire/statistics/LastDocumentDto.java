package com.team48.inscriptionscolaire.statistics;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class LastDocumentDto {
    private Integer id;
    private String name;
    private String documentType;
    private LocalDateTime validationDate;
    private String studentName;
    private String programName;
}