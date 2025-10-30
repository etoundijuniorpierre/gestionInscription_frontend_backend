package com.team48.inscriptionscolaire.enrollment;

import com.team48.inscriptionscolaire.document.DocumentDto;
import com.team48.inscriptionscolaire.program.ProgramResponseDTO;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class EnrollmentDtoResponse {
    private Integer id;
    private Integer programId;
    private Integer studentId;
    private String programName;
    private StatusSubmission status;
    private String paymentType; // Added to distinguish between REGISTRATION_FEE and PROGRAM_PAYMENT
    private LocalDateTime createdDate;
    private LocalDateTime lastModifiedDate;
    private LocalDateTime submissionDate;
    private LocalDateTime validationDate;
    private int currentStep;
    private PersonalInfoDto personalInfo;
    private AcademicInfoDto academicInfo;
    private List<DocumentDto> documents;
    private ContactDetailsDto contactDetails;
    private String rejectionReason;
    private ProgramResponseDTO program; // Added program data
}