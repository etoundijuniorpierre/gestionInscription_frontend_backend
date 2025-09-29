package com.team48.inscriptionscolaire.enrollment;

import com.team48.inscriptionscolaire.document.Document;
import com.team48.inscriptionscolaire.document.DocumentDto;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class EnrollmentDtoResponse {
    private Integer id;
    private String academicYear;
    private Integer programId;
    private Integer studentId;
    private String programName;
    private StatusSubmission status;
    private LocalDateTime createdDate;
    private LocalDateTime submissionDate;
    private LocalDateTime validationDate;
    private int currentStep;
    private PersonalInfoDto personalInfo;
    private AcademicInfoDto academicInfo;
    private List<DocumentDto> documents;
    private ContactDetailsDto contactDetails;
    private String rejectionReason;
    //private EnrollmentStepDto enrollmentStepDto;
}