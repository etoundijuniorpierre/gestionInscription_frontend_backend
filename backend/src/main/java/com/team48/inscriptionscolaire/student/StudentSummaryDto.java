package com.team48.inscriptionscolaire.student;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentSummaryDto {
    private Integer id;
    private String firstName;
    private String lastName;
    private String email;
    private String fullName; // Nom complet pour affichage

    public String getFullName() {
        return firstName + " " + lastName;
    }
}
