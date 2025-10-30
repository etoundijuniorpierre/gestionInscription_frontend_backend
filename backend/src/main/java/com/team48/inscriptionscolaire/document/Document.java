package com.team48.inscriptionscolaire.document;

import com.team48.inscriptionscolaire.enrollment.Enrollment;
import com.team48.inscriptionscolaire.user.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class Document extends BaseEntity {

    private String contentType;
    private String name;
    @Column(name = "filedata", length = 50000000)
    private byte[] fileData;
    private ValidationStatus validationStatus;
    private String rejectionReason;
    private LocalDateTime uploadDate;
    private LocalDateTime validationDate;

    private String documentType;

    @ManyToOne
    private Enrollment enrollment;
}