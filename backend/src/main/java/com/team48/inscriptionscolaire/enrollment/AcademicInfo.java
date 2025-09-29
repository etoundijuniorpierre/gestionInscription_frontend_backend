package com.team48.inscriptionscolaire.enrollment;

import jakarta.persistence.Embeddable;
import lombok.Data;
import java.time.LocalDate;

@Embeddable
@Data
public class AcademicInfo {
    private String lastInstitution;
    private String specialization;
    private Boolean availableForInternship;
    private LocalDate startDate;
    private LocalDate endDate;
}