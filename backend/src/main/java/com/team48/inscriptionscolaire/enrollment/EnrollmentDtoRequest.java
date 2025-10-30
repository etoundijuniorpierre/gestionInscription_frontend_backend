package com.team48.inscriptionscolaire.enrollment;

import lombok.Data;

@Data
public class EnrollmentDtoRequest {
    private Integer programId;
    private int currentStep;
    private PersonalInfoDto personalInfo;
    private AcademicInfoDto academicInfo;
    private ContactDetailsDto contactDetails;
}