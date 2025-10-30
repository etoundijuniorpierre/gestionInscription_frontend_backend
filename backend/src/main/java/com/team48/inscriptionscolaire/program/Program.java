package com.team48.inscriptionscolaire.program;

import com.team48.inscriptionscolaire.common.BaseEntity;
import com.team48.inscriptionscolaire.learnModule.LearnModule;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Set;


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

    @Column(length = 500)
    private String certificateName;

    @Column(columnDefinition = "TEXT")
    private String careerProspects;

    @Column(precision = 10, scale = 2)
    private BigDecimal registrationFee;

    @Column(nullable = false)
    private int maxCapacity;

    private LocalDate registrationStartDate;
    private LocalDate registrationEndDate;

    // New fields for duration and price
    private int duration; // Duration in months

    private LocalDate startDate; // Start date of the program

    // New fields for schedule management
    private int hoursPerDay; // Number of hours of classes per day
    private int daysPerWeek; // Number of days of classes per week

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "program_course_days", joinColumns = @JoinColumn(name = "program_id"))
    @Column(name = "day_of_week")
    private Set<String> courseDays; // Days of the week when classes are held (e.g., "MONDAY", "WEDNESDAY", "FRIDAY")

    private LocalTime startTime; // Start time of classes each day
    private LocalTime endTime;   // End time of classes each day

    @Enumerated(EnumType.STRING)
    private ProgramStatus status; // Program status

    public LocalDate getEndDate() {
        if (startDate != null && duration > 0) {
            return startDate.plusMonths(duration);
        }
        return null;
    }

    @Column(precision = 10, scale = 2)
    private BigDecimal price; // Program price

    @OneToMany(mappedBy = "program", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<LearnModule> learnModules;

    public boolean isEnrollmentOpen() {
        LocalDate today = LocalDate.now();
        return registrationStartDate != null &&
                registrationEndDate != null &&
                !today.isBefore(registrationStartDate) &&
                !today.isAfter(registrationEndDate);
    }

    /**
     * Check if enrollment is open for a specific student, considering schedule conflicts
     *
     * @param studentId The ID of the student
     * @return true if enrollment is open for this student, false otherwise
     */
    public boolean isEnrollmentOpenForStudent(Integer studentId) {
        // First check if enrollment period is open
        if (!isEnrollmentOpen()) {
            return false;
        }

        // TODO: Check for schedule conflicts with existing enrollments
        // This would require injecting EnrollmentRepository and checking for conflicts
        // For now, return the basic enrollment status

        return true;
    }
}