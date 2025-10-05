package com.team48.inscriptionscolaire.admin;

import lombok.Data;

import java.time.LocalDate;

@Data
public class AdminRequestDto {
    private String firstname;
    private String lastname;
    private String email;
    private boolean accountLocked;
    private boolean enabled;
    private LocalDate dateOfBirth;
    private String address;
    private String phoneNumber;
    private String gender;
    private String nationality;
}