package com.team48.inscriptionscolaire.enrollment;

import com.team48.inscriptionscolaire.student.Gender;
import lombok.Data;

import java.time.LocalDate;

@Data
public class PersonalInfoDto {
    private String firstName;
    private String lastName;
    private String nationality;
    private Gender gender;
    private LocalDate dateOfBirth;
    //private String phoneNumber;

}