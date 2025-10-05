package com.team48.inscriptionscolaire.enrollment;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;
/**
 * A Data Transfer Object (DTO) for handling enrollment form data from the frontend.
 * This DTO represents the JSON part of a multipart request.
 */
@Data
public class EnrollmentDtoRequest {
    private Integer programId;
    private int currentStep;
    private PersonalInfoDto personalInfo;
    private AcademicInfoDto academicInfo;
    private ContactDetailsDto contactDetails;
}