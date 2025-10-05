package com.team48.inscriptionscolaire.program;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Set;

@Data
public class ProgramResponseDTO {
    private Integer id;
    private String programName;
    private String programCode;
    private String description;
    private String certificateName;
    private String careerProspects;
    private BigDecimal registrationFee;
    private int maxCapacity;
    private LocalDate registrationStartDate;
    private LocalDate registrationEndDate;
    private String image;
    
    // BaseEntity audit fields
    private LocalDateTime createdDate;
    private LocalDateTime lastModifiedDate;
    
    // New fields for duration and price
    private int duration; // Duration in months
    private BigDecimal price; // Program price
    
    private LocalDate startDate; // Start date of the program
    private LocalDate endDate; // End date of the program (calculated)
    
    // Enrollment status field
    private boolean enrollmentOpen;
    
    // New fields for schedule management
    private int hoursPerDay; // Number of hours of classes per day
    private int daysPerWeek; // Number of days of classes per week
    private Set<String> courseDays; // Days of the week when classes are held
    private LocalTime startTime; // Start time of classes each day
    private LocalTime endTime;   // End time of classes each day
    
    // New field for learn modules
    private List<LearnModuleDTO> learnModules;
    
    @Data
    public static class LearnModuleDTO {
        private Integer id;
        private String moduleName;
        private String moduleDescription;
        private int moduleOrder;
    }
}