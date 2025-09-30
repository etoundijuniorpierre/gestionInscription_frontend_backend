package com.team48.inscriptionscolaire.enrollment;

import lombok.Data;

import java.time.LocalDate;

@Data
public class PersonalInfoDto {
    private String firstName;
    private String lastName;
    private String nationality;
    private String gender;
    private LocalDate dateOfBirth;
    //private String phoneNumber;

}