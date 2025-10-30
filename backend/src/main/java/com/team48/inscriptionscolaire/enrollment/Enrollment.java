package com.team48.inscriptionscolaire.enrollment;

import com.team48.inscriptionscolaire.document.Document;
import com.team48.inscriptionscolaire.payment.Payment;
import com.team48.inscriptionscolaire.program.Program;
import com.team48.inscriptionscolaire.student.Student;
import com.team48.inscriptionscolaire.user.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class Enrollment extends BaseEntity {

    private LocalDateTime submissionDate;

    @Enumerated(EnumType.STRING)
    private StatusSubmission status;

    private LocalDateTime validationDate;
    private String rejectionReason;

    @ManyToOne
    private Student student;

    @OneToMany(mappedBy = "enrollment", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Document> documents;

    @ManyToOne
    private Program program;

    @Embedded
    private PersonalInfo personalInfo;

    @Embedded
    private AcademicInfo academicInfo;

    @Embedded
    private ContactDetails contactDetails;

    private int stepCompleted;

    @OneToOne(mappedBy = "enrollment", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Payment payment;
}