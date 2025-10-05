package com.team48.inscriptionscolaire.enrollment;

import jakarta.persistence.Embeddable;
import lombok.Data;

import java.time.LocalDate;

@Embeddable
@Data
public class PersonalInfo {
    private String firstName;
    private String lastName;
    private String nationality;
    private String gender;
    private LocalDate dateOfBirth;
}