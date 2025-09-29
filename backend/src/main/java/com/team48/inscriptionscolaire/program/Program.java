package com.team48.inscriptionscolaire.program;

import com.team48.inscriptionscolaire.common.BaseEntity;
import com.team48.inscriptionscolaire.enrollment.Enrollment;
import com.team48.inscriptionscolaire.learnModule.LearnModule;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;


@Entity
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class Program extends BaseEntity {
    @Column(length = 500)
    private String programName;

    @Column(unique = true, length = 50)
    private String programCode;

    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(precision = 10, scale = 2)
    private BigDecimal registrationFee;

    @Column(nullable = false)
    private int maxCapacity;

    private LocalDate registrationStartDate;
    private LocalDate registrationEndDate;
    
    // New fields for duration and price
    private int duration; // Duration in months
    
    @Column(precision = 10, scale = 2)
    private BigDecimal price; // Program price

    @OneToMany(mappedBy = "program")
    private List<Enrollment> enrollmentList;
    
    // New field for learn modules
    @OneToMany(mappedBy = "program", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<LearnModule> learnModules;

}