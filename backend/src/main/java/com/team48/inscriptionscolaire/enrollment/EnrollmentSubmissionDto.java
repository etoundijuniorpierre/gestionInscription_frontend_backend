package com.team48.inscriptionscolaire.enrollment;

import lombok.Data;
import java.util.List;

@Data
public class EnrollmentSubmissionDto {
    private PersonalInfoDto personalInfo;
    private AcademicInfoDto academicInfo;
    private ContactDetailsDto contactDetails;
    private Long programId; // ID of the chosen program
    private List<Long> documentIds; // Example: list of uploaded document IDs
}