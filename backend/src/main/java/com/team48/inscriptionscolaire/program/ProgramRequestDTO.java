package com.team48.inscriptionscolaire.program;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
public class ProgramRequestDTO {
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
    
    // New fields for duration and price
    private int duration; // Duration in months
    private BigDecimal price; // Program price
    
    // New field for learn modules
    private List<LearnModuleDTO> learnModules;
    
    @Data
    public static class LearnModuleDTO {
        private String moduleName;
        private String moduleDescription;
        private int moduleOrder;
    }
}