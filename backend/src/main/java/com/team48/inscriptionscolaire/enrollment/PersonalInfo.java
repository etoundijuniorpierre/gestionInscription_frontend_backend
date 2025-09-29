package com.team48.inscriptionscolaire.enrollment;

import com.team48.inscriptionscolaire.student.Gender;
import jakarta.persistence.Embeddable;
import lombok.Data;

import java.time.LocalDate;

@Embeddable
@Data
public class PersonalInfo {
    private String firstName;
    private String lastName;
    private String nationality; // Corrected casing to match DTO
    private Gender gender;
    private LocalDate dateOfBirth;
    // other personal fields
}