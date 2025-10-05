package com.team48.inscriptionscolaire.document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

/**
 * Data Transfer Object for Document entity.
 * This class is used to send document information to the client
 * without exposing the full database entity, especially the file data.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentDto {

    private Integer id;
    private String name;
    private String contentType;
    private LocalDateTime uploadDate;
    private ValidationStatus validationStatus;
    private String documentType;
    private String rejectionReason;
    
    // BaseEntity audit fields
    private LocalDateTime createdDate;
    private LocalDateTime lastModifiedDate;
}