package com.team48.inscriptionscolaire.enrollment;

import lombok.Data;
import java.time.LocalDate;

@Data
public class AcademicInfoDto {
    private String lastInstitution;
    private String specialization;
    private Boolean availableForInternship;
    private LocalDate startDate;
    private LocalDate endDate;
    private Boolean diplomaObtained;
}