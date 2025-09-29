package com.team48.inscriptionscolaire.enrollment;

import lombok.Data;

import java.util.List;

@Data
public class ContactDetailsDto {
    private String email;
    private String phoneNumber;
    private String countryCode;
    private String country;
    private String region;
    private String city;
    private String address;
    private List<EmergencyContactDto> emergencyContacts;
}