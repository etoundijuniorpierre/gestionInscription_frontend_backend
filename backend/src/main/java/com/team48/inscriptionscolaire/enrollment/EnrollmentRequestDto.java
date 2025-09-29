package com.team48.inscriptionscolaire.enrollment;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class EnrollmentRequestDto {
    // Step 1: Personal Info
    private String lastName;
    private String firstName;
    private String gender;
    private LocalDate dateOfBirth;
    private String nationality;
    private String identityDocumentType;
    private String identityDocumentNumber;
    private LocalDate issueDate;
    private LocalDate expirationDate;
    private String placeOfIssue;

    // Step 2: Documents
    private String diploma1Name;
    private String diploma1Status;
    private String diploma2Name;
    private String diploma2Status;
    private String cniRectoName;
    private String cniRectoStatus;
    private String cniVersoName;
    private String cniVersoStatus;
    private String birthCertificateName;
    private String birthCertificateStatus;
    private String passportPhotoName;
    private String passportPhotoStatus;

    // Step 3: Academic Info
    private String lastInstitution;
    private String specialization;
    private Boolean availableForInternship;
    private LocalDate startDate;
    private LocalDate endDate;

    // Step 4: Contact Info
    private String email;
    private String phoneNumber;
    private String countryCode;
    private String country;
    private String region;
    private String city;
    private String address;
    private List<EmergencyContactDto> emergencyContacts;
}