package com.team48.inscriptionscolaire.admin;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class AdminResponseDto {
    private Integer id;
    private String firstname;
    private String lastname;
    private String email;
    private boolean status;
    private String roleName;
    private LocalDateTime createdDate;
    private LocalDateTime lastModifiedDate;
    private LocalDate dateOfBirth;
    private String address;
    private String phoneNumber;
    private String gender;
    private String nationality;
}